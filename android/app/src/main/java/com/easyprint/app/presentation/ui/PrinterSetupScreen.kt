package com.easyprint.app.presentation.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.easyprint.app.domain.model.ConnectionType

@Composable
fun PrinterSetupScreen(
    onBack: () -> Unit,
    onPrinterDetected: (String) -> Unit
) {
    var selectedTab by remember { mutableStateOf(ConnectionType.USB) }
    var isDetecting by remember { mutableStateOf(false) }
    var printerFound by remember { mutableStateOf<String?>(null) }
    var showPermissionDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
                Text(
                    text = "Connect Your Printer",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(start = 8.dp)
                )
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Connection Type Segmented Tabs
            TabRow(
                selectedTabIndex = selectedTab.ordinal,
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                modifier = Modifier.clip(RoundedCornerShape(14.dp))
            ) {
                Tab(
                    selected = selectedTab == ConnectionType.USB,
                    onClick = { selectedTab = ConnectionType.USB },
                    text = { Text("USB Printer") }
                )
                Tab(
                    selected = selectedTab == ConnectionType.WIFI,
                    onClick = { selectedTab = ConnectionType.WIFI },
                    text = { Text("Wi-Fi Printer") }
                )
                Tab(
                    selected = selectedTab == ConnectionType.NETWORK,
                    onClick = { selectedTab = ConnectionType.NETWORK },
                    text = { Text("Network") }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            if (selectedTab == ConnectionType.USB) {
                // USB Connection Guide
                Text(
                    text = "Connect your printer to your phone using a USB OTG adapter.",
                    fontSize = 15.sp,
                    textAlign = TextAlign.Center,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Illustrated Diagram Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        DiagramStep(icon = Icons.Default.Smartphone, title = "Android Phone", subtitle = "USB Host / OTG Enabled")
                        Icon(Icons.Default.ArrowDownward, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        DiagramStep(icon = Icons.Default.Usb, title = "USB OTG Adapter", subtitle = "Type-C or Micro-USB to USB-A")
                        Icon(Icons.Default.ArrowDownward, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        DiagramStep(icon = Icons.Default.Cable, title = "USB Printer Cable", subtitle = "Standard USB-A to Type-B")
                        Icon(Icons.Default.ArrowDownward, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        DiagramStep(icon = Icons.Default.Print, title = "Epson L120", subtitle = "Power turned ON")
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                if (printerFound != null) {
                    // Printer Found Card
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF2E7D32).copy(alpha = 0.15f)),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "Printer Found!",
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF2E7D32),
                                fontSize = 18.sp
                            )
                            Text(
                                text = printerFound ?: "",
                                fontSize = 16.sp,
                                modifier = Modifier.padding(vertical = 4.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Button(
                                onClick = { onPrinterDetected(printerFound!!) },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32))
                            ) {
                                Text("Use This Printer")
                            }
                        }
                    }
                } else {
                    Button(
                        onClick = {
                            isDetecting = true
                            // Simulate detection & permission trigger
                            showPermissionDialog = true
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        if (isDetecting) {
                            CircularProgressIndicator(modifier = Modifier.size(24.dp), color = MaterialTheme.colorScheme.onPrimary)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("Detecting USB Printer...")
                        } else {
                            Icon(Icons.Default.Refresh, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Detect Printer", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            } else {
                // Wi-Fi or Network discovery
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.WifiFind, contentDescription = null, modifier = Modifier.size(48.dp), tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("Note: Epson L120 is a direct USB printer.", fontWeight = FontWeight.Bold)
                        Text(
                            "For Wi-Fi printing, connect the printer to a PC or print server on your local network.",
                            textAlign = TextAlign.Center,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                        )
                    }
                }
            }
        }
    }

    if (showPermissionDialog) {
        AlertDialog(
            onDismissRequest = { showPermissionDialog = false; isDetecting = false },
            title = { Text("USB Permission") },
            text = { Text("Allow EasyPrint to access Epson L120?") },
            confirmButton = {
                Button(onClick = {
                    showPermissionDialog = false
                    isDetecting = false
                    printerFound = "Epson L120"
                }) {
                    Text("Allow")
                }
            },
            dismissButton = {
                TextButton(onClick = { showPermissionDialog = false; isDetecting = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
private fun DiagramStep(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, subtitle: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
        }
        Spacer(modifier = Modifier.width(14.dp))
        Column {
            Text(text = title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
            Text(text = subtitle, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
