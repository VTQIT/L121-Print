import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Folder, Download, Terminal } from 'lucide-react';

interface AndroidCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANDROID_FILES: { path: string; language: string; content: string }[] = [
  {
    path: 'app/src/main/java/com/easyprint/app/data/usb/EpsonL120Driver.kt',
    language: 'kotlin',
    content: `package com.easyprint.app.data.usb

import android.graphics.Bitmap
import android.graphics.Color
import com.easyprint.app.domain.model.ColorMode
import com.easyprint.app.domain.model.PaperSize
import com.easyprint.app.domain.model.PrintSettings
import java.io.ByteArrayOutputStream

/**
 * Epson L120 ESC/P-R Raster Graphics Driver
 * Generates raster command streams and handles bulk USB transfers.
 */
class EpsonL120Driver(private val usbManager: UsbPrinterManager) {

    companion object {
        val ESC = 0x1B.toByte()
        val FF = 0x0C.toByte() // Form Feed (Eject page)
        val CR = 0x0D.toByte()
        val LF = 0x0A.toByte()
    }

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

        // 3. Page Setup (ESC ( C) - Page length in dots
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

        usbManager.sendRawBytes(out.toByteArray())
        out.reset()

        val width = bitmap.width
        val height = bitmap.height
        val isMono = settings.colorMode == ColorMode.BLACK_AND_WHITE
        val bytesPerRow = (width + 7) / 8
        val rowBuffer = ByteArray(bytesPerRow)

        // 4. Stream raster pixel rows
        for (y in 0 until height) {
            rowBuffer.fill(0)
            for (x in 0 until width) {
                val pixel = bitmap.getPixel(x, y)
                val isDark = if (isMono) {
                    val lum = (0.299 * Color.red(pixel) + 0.587 * Color.green(pixel) + 0.114 * Color.blue(pixel))
                    lum < 128
                } else {
                    (Color.red(pixel) + Color.green(pixel) + Color.blue(pixel)) / 3 < 180
                }

                if (isDark) {
                    val byteIndex = x / 8
                    val bitIndex = 7 - (x % 8)
                    rowBuffer[byteIndex] = (rowBuffer[byteIndex].toInt() or (1 shl bitIndex)).toByte()
                }
            }

            // ESC . (Raster row transfer)
            out.write(byteArrayOf(
                ESC, '.'.code.toByte(), 0x00, 10, 10, 1,
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

        // 5. Eject page (FF)
        usbManager.sendRawBytes(byteArrayOf(FF))

        if (pageIndex == totalPages - 1) {
            usbManager.sendRawBytes(byteArrayOf(ESC, '@'.code.toByte()))
        }
        return true
    }
}`
  },
  {
    path: 'app/src/main/java/com/easyprint/app/data/usb/UsbPrinterManager.kt',
    language: 'kotlin',
    content: `package com.easyprint.app.data.usb

import android.content.Context
import android.hardware.usb.*
import com.easyprint.app.domain.model.ConnectionType
import com.easyprint.app.domain.model.Printer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class UsbPrinterManager(private val context: Context) {
    private val usbManager = context.getSystemService(Context.USB_SERVICE) as UsbManager
    val connectedPrinter = MutableStateFlow<Printer?>(null)

    companion object {
        const val EPSON_VENDOR_ID = 0x04B8 // Seiko Epson
    }

    fun scanForUsbPrinters(): List<UsbDevice> {
        return usbManager.deviceList.values.filter { device ->
            device.vendorId == EPSON_VENDOR_ID || (0 until device.interfaceCount).any {
                device.getInterface(it).interfaceClass == UsbConstants.USB_CLASS_PRINTER
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-feature android:name="android.hardware.usb.host" android:required="false" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application
        android:name=".EasyPrintApplication"
        android:label="@string/app_name"
        android:theme="@style/Theme.EasyPrint">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED" />
            </intent-filter>
            <meta-data
                android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED"
                android:resource="@xml/device_filter" />
        </activity>
    </application>
</manifest>`
  },
  {
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.easyprint.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.easyprint.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.08.00"))
    implementation("androidx.compose.material3:material3")
    implementation("io.coil-kt:coil-compose:2.7.0")
}`
  }
];

export const AndroidCodeViewerModal: React.FC<AndroidCodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = ANDROID_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.path.split('/').pop() || 'source.kt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Android Studio Source Code</h2>
              <p className="text-xs text-slate-400">Jetpack Compose • Clean Architecture • USB OTG Driver</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-64 border-r border-slate-800 bg-slate-950/60 p-3 overflow-y-auto space-y-1">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2 py-1">
              Project Structure
            </div>
            {ANDROID_FILES.map((file, idx) => {
              const fileName = file.path.split('/').pop();
              const isSelected = idx === selectedFileIndex;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{fileName}</span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>{currentFile.path}</span>
              <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {currentFile.language}
              </span>
            </div>
            <pre className="flex-1 p-4 text-xs font-mono text-slate-300 overflow-auto whitespace-pre leading-relaxed selection:bg-indigo-900 selection:text-indigo-200">
              {currentFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
