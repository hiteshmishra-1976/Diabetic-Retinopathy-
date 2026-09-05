package com.retinascan.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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
import com.retinascan.ai.model.AnomalyItem
import com.retinascan.ai.model.PatientRecord

@Composable
fun AnalysisScreen(
    patient: PatientRecord,
    onConfirm: () -> Unit,
    onFlagReview: () -> Unit,
    onNavigateToCompare: () -> Unit
) {
    var showGrid by remember { mutableStateOf(true) }
    var selectedFilter by remember { mutableStateOf("ALL") }
    var selectedAnomalyId by remember { mutableStateOf<String?>(null) }
    val scrollState = rememberScrollState()

    val filteredLesions = remember(patient.lesions, selectedFilter) {
        if (selectedFilter == "ALL") patient.lesions
        else patient.lesions.filter { it.shortCode == selectedFilter || it.type == selectedFilter }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surface)
            .padding(16.dp)
            .verticalScroll(scrollState),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Diagnosis Overview Banner
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            border = CardDefaults.outlinedCardBorder()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = patient.diagnosisName,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = patient.retinalGradeLabel,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Surface(
                        color = Color(0xFFD1E4FF),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = "${patient.overallConfidence}% Confidence",
                            color = MaterialTheme.colorScheme.primary,
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }
        }

        // Fundus Viewport with Bounding Box Overlays
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.Black)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp)
            ) {
                val activeScan = if (patient.activeEye == com.retinascan.ai.model.EyeType.OS) patient.leftEye else patient.rightEye
                AsyncImage(
                    model = activeScan.imageUrl,
                    contentDescription = "Fundus View",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )

                // Grid overlay indicator
                if (showGrid) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .border(1.dp, Color(0x3300E5FF))
                    )
                }

                // Anomaly markers
                filteredLesions.forEach { lesion ->
                    val isSelected = lesion.id == selectedAnomalyId
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(
                                start = (lesion.coordinates.leftPct * 3.2).dp,
                                top = (lesion.coordinates.topPct * 2.5).dp
                            )
                    ) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            border = ButtonDefaults.outlinedButtonBorder.copy(
                                brush = androidx.compose.ui.graphics.SolidColor(
                                    if (isSelected) Color.Yellow else Color.Red
                                )
                            ),
                            color = if (isSelected) Color(0x66BA1A1A) else Color(0x33BA1A1A),
                            modifier = Modifier
                                .size(
                                    (lesion.coordinates.widthPct * 3.0).dp,
                                    (lesion.coordinates.heightPct * 2.4).dp
                                )
                                .clickable { selectedAnomalyId = lesion.id }
                        ) {
                            Text(
                                text = lesion.shortCode,
                                color = Color.White,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(2.dp)
                            )
                        }
                    }
                }
            }
        }

        // Grid Toggle & Compare Shortcut
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Checkbox(checked = showGrid, onCheckedChange = { showGrid = it })
                Text("Coordinate Grid Overlay", style = MaterialTheme.typography.bodyMedium)
            }
            TextButton(onClick = onNavigateToCompare) {
                Icon(Icons.Default.Compare, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text("Compare Heatmap")
            }
        }

        // Pathology Filter Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = selectedFilter == "ALL",
                onClick = { selectedFilter = "ALL" },
                label = { Text("All (${patient.lesions.size})") }
            )
            FilterChip(
                selected = selectedFilter == "MA",
                onClick = { selectedFilter = "MA" },
                label = { Text("Microaneurysms") }
            )
            FilterChip(
                selected = selectedFilter == "HEM",
                onClick = { selectedFilter = "HEM" },
                label = { Text("Hemorrhages") }
            )
            FilterChip(
                selected = selectedFilter == "CWS",
                onClick = { selectedFilter = "CWS" },
                label = { Text("Cotton Wool") }
            )
            FilterChip(
                selected = selectedFilter == "HEX",
                onClick = { selectedFilter = "HEX" },
                label = { Text("Hard Exudates") }
            )
        }

        // Detected Lesions List
        Text(
            text = "Detected Pathologies (${filteredLesions.size})",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )

        filteredLesions.forEach { lesion ->
            val isSelected = lesion.id == selectedAnomalyId
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable {
                        selectedAnomalyId = if (isSelected) null else lesion.id
                    },
                shape = RoundedCornerShape(8.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant
                ),
                border = if (isSelected) CardDefaults.outlinedCardBorder().copy(
                    brush = androidx.compose.ui.graphics.SolidColor(MaterialTheme.colorScheme.primary)
                ) else null
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "${lesion.name} (${lesion.shortCode})",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = lesion.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Surface(
                        color = Color(0xFFFFDAD6),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = "${lesion.confidence}%",
                            color = Color(0xFFBA1A1A),
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }
        }

        // Clinical Action Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onFlagReview,
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.Flag, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text(if (patient.isFlagged) "Flagged" else "Flag for Review")
            }
            Button(
                onClick = onConfirm,
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text(if (patient.isConfirmed) "Confirmed" else "Confirm Finding")
            }
        }
    }
}
