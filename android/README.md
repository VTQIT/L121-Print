# EasyPrint - Android Mobile Printing Application (USB & Network)

EasyPrint is a modern, high-performance Android mobile printing application specifically optimized for USB OTG direct printing (including the **Epson L120** single-function ink tank printer) as well as local network/Wi-Fi printers.

---

## 🚀 Key Features

- **Direct USB OTG Printing**: Connect phone directly to the Epson L120 via USB On-The-Go adapter with zero network dependency.
- **Hardware Detection**: Auto-detects Seiko Epson USB Vendor ID `0x04B8` and standard USB Printer Class `0x07`.
- **Epson ESC/P-R Raster Engine**: Converts Android bitmaps to ESC/P-R raster commands and transfers bulk data via Android USB Host API.
- **Document & Photo Support**:
  - Photos (JPG, PNG, WebP) with borderless and fit/fill controls
  - PDF documents (using Android PdfRenderer)
  - Office documents (DOCX, XLSX, TXT)
  - Camera Document Scanner with perspective crop and black-and-white high contrast filters
- **Beginner-Friendly Flow**:
  1. Connect Printer (OTG visual diagram)
  2. Choose Document / Photo
  3. Live Paper Preview (A4, Letter, 4×6, 5×7)
  4. Print with live progress bar
- **Print History**: Locally stored record of previous print jobs with one-tap reprint.
- **Favorite Printer**: Saves Epson L120 as default with automatic reconnection.

---

## 📁 Android Project Structure

```
android/
├── app/
│   ├── build.gradle.kts
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── res/
│           │   └── xml/
│           │       └── device_filter.xml    # Epson VID 0x04B8 & Class 7 filter
│           └── java/com/easyprint/app/
│               ├── EasyPrintApplication.kt
│               ├── MainActivity.kt
│               ├── domain/
│               │   └── model/
│               │       ├── Printer.kt        # Printer models, connection types, paper sizes
│               │       └── PrintJob.kt       # Print job state, settings, status
│               ├── data/
│               │   ├── usb/
│               │   │   ├── UsbPrinterManager.kt # Android USB Host API connection & permission
│               │   │   └── EpsonL120Driver.kt   # ESC/P-R rasterization & command generator
│               │   └── network/
│               │       └── NetworkPrinterDiscovery.kt # mDNS / IP discovery
│               └── presentation/
│                   └── ui/
│                       ├── HomeScreen.kt        # Dashboard with large action cards
│                       ├── PrinterSetupScreen.kt# OTG connection diagram & detector
│                       └── PrintPreviewScreen.kt# Realistic paper canvas & print engine
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

---

## 🛠️ How to Compile in Android Studio

1. Open **Android Studio** (Ladybug, Koala, or Iguana with Kotlin 1.9+ / 2.0+).
2. Select **Open** and select the `/android` folder from this repository.
3. Allow Gradle to sync dependencies.
4. Connect an Android device (Android 8.0 Oreo to Android 15, API 26-35) with USB debugging enabled.
5. Click **Run 'app'** (`Shift + F10`).

---

## 🔌 Hardware Setup: Connecting Epson L120

1. Plug a **USB OTG adapter** (Type-C to USB-A or Micro-USB to USB-A) into the Android smartphone.
2. Plug the standard **USB printer cable** from the Epson L120 into the OTG adapter.
3. Power on the Epson L120.
4. Launch EasyPrint. The app prompts: `"Allow EasyPrint to access Epson L120?"`.
5. Tap **Allow** and start printing immediately!
