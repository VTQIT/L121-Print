package com.easyprint.app.domain.model

enum class ConnectionType {
    USB,
    WIFI,
    NETWORK
}

enum class PaperSize(val displayName: String, val widthMm: Float, val heightMm: Float) {
    A4("A4 (210 × 297 mm)", 210f, 297f),
    LETTER("US Letter (8.5 × 11 in)", 215.9f, 279.4f),
    PHOTO_4X6("4 × 6 in (10 × 15 cm)", 101.6f, 152.4f),
    PHOTO_5X7("5 × 7 in (13 × 18 cm)", 127f, 177.8f),
    CUSTOM("Custom Size", 210f, 297f)
}

enum class PrintOrientation {
    PORTRAIT,
    LANDSCAPE
}

enum class ColorMode {
    COLOR,
    BLACK_AND_WHITE
}

enum class PrintQuality {
    DRAFT,
    NORMAL,
    HIGH
}

enum class ScalingMode {
    FIT_TO_PAGE,
    FILL_PAGE,
    ORIGINAL_SIZE
}

enum class MarginMode {
    NORMAL,
    NARROW,
    NONE
}

data class Printer(
    val id: String,
    val name: String,
    val model: String,
    val connectionType: ConnectionType,
    val isConnected: Boolean = false,
    val isFavorite: Boolean = false,
    val customAlias: String? = null,
    val vendorId: Int? = null, // 0x04B8 for Epson
    val productId: Int? = null,
    val ipAddress: String? = null,
    val statusDescription: String = "Ready to Print",
    val blackInkLevel: Int = 100,
    val cyanInkLevel: Int = 100,
    val magentaInkLevel: Int = 100,
    val yellowInkLevel: Int = 100,
    val supportsDuplex: Boolean = false // Epson L120 is single-sided
)
