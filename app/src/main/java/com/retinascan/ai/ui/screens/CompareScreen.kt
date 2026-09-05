package com.retinascan.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.retinascan.ai.model.PatientRecord

@Composable
fun CompareScreen(
    patient: PatientRecord,
    onNavigateToReport: () -> Unit
) {
    var splitSliderPosition by remember { mutableStateOf(0.5f) }
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surface)
            .padding(16.dp)
            .verticalScroll(scrollState),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Grad-CAM Activation & Raw Fundus Comparison",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Visualize model attention weights against standard fundus baseline.",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        // Critical Finding Callout Card
        patient.criticalFinding?.let { finding ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFDAD6))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Icon(
                        Icons.Default.Warning,
                        contentDescription = "Alert",
                        tint = Color(0xFFBA1A1A),
                        modifier = Modifier.size(24.dp)
                    )
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = "${finding.title} • ${finding.urgency}",
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFBA1A1A),
                            style = MaterialTheme.typography.titleSmall
                        )
                        Text(
                            text = finding.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFF410002)
                        )
                    }
                }
            }
        }

        // Side by Side Visuals
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("Raw Fundus Photography (OS)", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color.Black)
            ) {
                AsyncImage(
                    model = patient.leftEye.imageUrl,
                    contentDescription = "Raw Fundus",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )
            }

            Text("Deep Attention Heatmap (Grad-CAM Layer 4)", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color.Black)
            ) {
                AsyncImage(
                    model = patient.leftEye.heatmapUrl,
                    contentDescription = "Heatmap",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )
            }
        }

        // Navigation to report
        Button(
            onClick = onNavigateToReport,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("View Diagnostic Report & Specialist Referral")
        }
    }
}
