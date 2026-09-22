package com.easyprint.app.domain.model

import android.net.Uri

data class PrintSettings(
    val paperSize: PaperSize = PaperSize.A4,
    val orientation: PrintOrientation = PrintOrientation.PORTRAIT,
    val copies: Int = 1,
    val colorMode: ColorMode = ColorMode.COLOR,
    val quality: PrintQuality = PrintQuality.NORMAL,
    val scaling: ScalingMode = ScalingMode.FIT_TO_PAGE,
    val margins: MarginMode = MarginMode.NORMAL,
    val pageRange: String = "All",
    val duplex: Boolean = false // Disabled for L120
)

data class PrintJob(
    val id: String,
    val documentTitle: String,
    val documentUris: List<Uri>,
    val printer: Printer,
    val settings: PrintSettings,
    val totalPages: Int,
    val currentPage: Int = 0,
    val status: PrintJobStatus = PrintJobStatus.QUEUED,
    val timestamp: Long = System.currentTimeMillis()
)

enum class PrintJobStatus {
    QUEUED,
    RENDERING,
    TRANSMITTING,
    PRINTING,
    COMPLETED,
    CANCELLED,
    FAILED
}
