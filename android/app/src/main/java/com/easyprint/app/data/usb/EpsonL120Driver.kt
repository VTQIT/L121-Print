package com.easyprint.app.data.usb

import android.graphics.Bitmap
import android.graphics.Color
import com.easyprint.app.domain.model.ColorMode
import com.easyprint.app.domain.model.PaperSize
import com.easyprint.app.domain.model.PrintQuality
import com.easyprint.app.domain.model.PrintSettings
import java.io.ByteArrayOutputStream

/**
 * Epson L120 ESC/P-R Raster Graphics Driver
 * The Epson L120 uses ESC/P-R commands with 720 DPI horizontal/vertical resolution.
 */
class EpsonL120Driver(private val usbManager: UsbPrinterManager) {

    // ESC/P-R control byte constants
    companion object {
        val ESC = 0x1B.toByte()
        val FS = 0x1C.toByte()
        val FF = 0x0C.toByte() // Form Feed (Eject page)
        val CR = 0x0D.toByte()
        val LF = 0x0A.toByte()
    }

    /**
     * Converts an Android Bitmap into ESC/P-R raster byte stream and transmits to Epson L120.
     */
    fun printBitmapPage(
        bitmap: Bitmap,
        settings: PrintSettings,
        pageIndex: Int,
        totalPages: Int,
        onProgress: (Float) -> Unit
    ): Boolean {
        val out = ByteArrayOutputStream()

        // 1. Initialize Printer (ESC @)
        out.write(byteArrayOf(ESC, '@'.code.toByte()))

        // 2. Set Graphic Mode (ESC ( G)
        out.write(byteArrayOf(ESC, '('.code.toByte(), 'G'.code.toByte(), 0x01, 0x00, 0x01))

        // 3. Page Setup (ESC ( C - Page length)
        // For A4: 297mm approx 8418 dots at 720dpi
        val pageLengthDots = when (settings.paperSize) {
            PaperSize.A4 -> 8418
            PaperSize.LETTER -> 7920
            PaperSize.PHOTO_4X6 -> 4320
            PaperSize.PHOTO_5X7 -> 5040
            PaperSize.CUSTOM -> 8418
        }
        out.write(byteArrayOf(
            ESC, '('.code.toByte(), 'C'.code.toByte(), 0x02, 0x00,
            (pageLengthDots and 0xFF).toByte(),
            ((pageLengthDots shr 8) and 0xFF).toByte()
        ))

        // 4. Send header bytes
        usbManager.sendRawBytes(out.toByteArray())
        out.reset()

        val width = bitmap.width
        val height = bitmap.height

        // 5. Send raster rows
        val isMono = settings.colorMode == ColorMode.BLACK_AND_WHITE
        val bytesPerRow = (width + 7) / 8
        val rowBuffer = ByteArray(bytesPerRow)

        for (y in 0 until height) {
            rowBuffer.fill(0)
            for (x in 0 until width) {
                val pixel = bitmap.getPixel(x, y)
                val isDark = if (isMono) {
                    val luminance = (0.299 * Color.red(pixel) + 0.587 * Color.green(pixel) + 0.114 * Color.blue(pixel))
                    luminance < 128
                } else {
                    val red = Color.red(pixel)
                    val green = Color.green(pixel)
                    val blue = Color.blue(pixel)
                    (red + green + blue) / 3 < 180
                }

                if (isDark) {
                    val byteIndex = x / 8
                    val bitIndex = 7 - (x % 8)
                    rowBuffer[byteIndex] = (rowBuffer[byteIndex].toInt() or (1 shl bitIndex)).toByte()
                }
            }

            // ESC . (Raster row transfer)
            out.write(byteArrayOf(
                ESC, '.'.code.toByte(),
                0x00, // uncompressed
                10, 10, // vertical/horizontal pitch
                1, // 1 line
                (bytesPerRow and 0xFF).toByte(),
                ((bytesPerRow shr 8) and 0xFF).toByte()
            ))
            out.write(rowBuffer)
            out.write(CR.toInt())
            out.write(LF.toInt())

            if (y % 40 == 0 || y == height - 1) {
                usbManager.sendRawBytes(out.toByteArray())
                out.reset()
                onProgress(y.toFloat() / height.toFloat())
            }
        }

        // 6. Eject page (FF)
        usbManager.sendRawBytes(byteArrayOf(FF))

        // 7. If last page, reset
        if (pageIndex == totalPages - 1) {
            usbManager.sendRawBytes(byteArrayOf(ESC, '@'.code.toByte()))
        }

        return true
    }
}
