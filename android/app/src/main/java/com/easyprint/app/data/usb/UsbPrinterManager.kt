package com.easyprint.app.data.usb

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.usb.UsbConstants
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbDeviceConnection
import android.hardware.usb.UsbEndpoint
import android.hardware.usb.UsbInterface
import android.hardware.usb.UsbManager
import android.os.Build
import com.easyprint.app.domain.model.ConnectionType
import com.easyprint.app.domain.model.Printer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class UsbPrinterManager(private val context: Context) {

    private val usbManager = context.getSystemService(Context.USB_SERVICE) as UsbManager
    private val ACTION_USB_PERMISSION = "com.easyprint.app.USB_PERMISSION"

    private val _connectedPrinter = MutableStateFlow<Printer?>(null)
    val connectedPrinter: StateFlow<Printer?> = _connectedPrinter.asStateFlow()

    private val _isUsbHostSupported = MutableStateFlow(true)
    val isUsbHostSupported: StateFlow<Boolean> = _isUsbHostSupported.asStateFlow()

    private var activeConnection: UsbDeviceConnection? = null
    private var bulkOutEndpoint: UsbEndpoint? = null
    private var usbInterface: UsbInterface? = null

    companion object {
        const val EPSON_VENDOR_ID = 0x04B8 // Seiko Epson Corp
    }

    init {
        checkUsbHostSupport()
    }

    fun checkUsbHostSupport(): Boolean {
        val pm = context.packageManager
        val supported = pm.hasSystemFeature("android.hardware.usb.host")
        _isUsbHostSupported.value = supported
        return supported
    }

    fun scanForUsbPrinters(): List<UsbDevice> {
        val deviceList = usbManager.deviceList
        val printerDevices = mutableListOf<UsbDevice>()

        for ((_, device) in deviceList) {
            // Match Seiko Epson Vendor ID or standard USB Printer Class 7
            val isEpson = device.vendorId == EPSON_VENDOR_ID
            val isPrinterClass = (0 until device.interfaceCount).any { idx ->
                device.getInterface(idx).interfaceClass == UsbConstants.USB_CLASS_PRINTER
            }

            if (isEpson || isPrinterClass) {
                printerDevices.add(device)
            }
        }
        return printerDevices
    }

    fun requestUsbPermission(device: UsbDevice, onResult: (Boolean) -> Unit) {
        if (usbManager.hasPermission(device)) {
            connectToDevice(device)
            onResult(true)
            return
        }

        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            PendingIntent.FLAG_MUTABLE
        } else {
            0
        }
        val permissionIntent = PendingIntent.getBroadcast(
            context,
            0,
            Intent(ACTION_USB_PERMISSION),
            flags
        )

        val filter = IntentFilter(ACTION_USB_PERMISSION)
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                if (ACTION_USB_PERMISSION == intent?.action) {
                    val granted = intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)
                    if (granted) {
                        connectToDevice(device)
                    }
                    onResult(granted)
                    context?.unregisterReceiver(this)
                }
            }
        }
        context.registerReceiver(receiver, filter)
        usbManager.requestPermission(device, permissionIntent)
    }

    fun connectToDevice(device: UsbDevice): Boolean {
        // Find printer interface & bulk out endpoint
        for (i in 0 until device.interfaceCount) {
            val iface = device.getInterface(i)
            if (iface.interfaceClass == UsbConstants.USB_CLASS_PRINTER || device.vendorId == EPSON_VENDOR_ID) {
                for (j in 0 until iface.endpointCount) {
                    val ep = iface.getEndpoint(j)
                    if (ep.direction == UsbConstants.USB_DIR_OUT && ep.type == UsbConstants.USB_ENDPOINT_XFER_BULK) {
                        val connection = usbManager.openDevice(device) ?: return false
                        connection.claimInterface(iface, true)

                        this.activeConnection = connection
                        this.bulkOutEndpoint = ep
                        this.usbInterface = iface

                        val isEpsonL120 = device.vendorId == EPSON_VENDOR_ID
                        val printerModel = if (isEpsonL120) "Epson L120" else (device.productName ?: "USB Printer")

                        val printer = Printer(
                            id = "usb_${device.deviceId}",
                            name = printerModel,
                            model = "$printerModel (ESC/P-R)",
                            connectionType = ConnectionType.USB,
                            isConnected = true,
                            isFavorite = true,
                            vendorId = device.vendorId,
                            productId = device.productId,
                            statusDescription = "Connected via USB OTG",
                            supportsDuplex = false
                        )
                        _connectedPrinter.value = printer
                        return true
                    }
                }
            }
        }
        return false
    }

    fun sendRawBytes(data: ByteArray, timeoutMs: Int = 10000): Int {
        val conn = activeConnection ?: return -1
        val ep = bulkOutEndpoint ?: return -1
        return conn.bulkTransfer(ep, data, data.size, timeoutMs)
    }

    fun disconnect() {
        try {
            usbInterface?.let { activeConnection?.releaseInterface(it) }
            activeConnection?.close()
        } finally {
            activeConnection = null
            bulkOutEndpoint = null
            usbInterface = null
            _connectedPrinter.value = null
        }
    }
}
