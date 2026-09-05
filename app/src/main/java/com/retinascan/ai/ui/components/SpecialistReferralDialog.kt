package com.retinascan.ai.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.retinascan.ai.data.SampleDataProvider
import com.retinascan.ai.model.Specialist

@Composable
fun SpecialistReferralDialog(
    onDismiss: () -> Unit,
    onTransmitReferral: (specialistName: String, urgency: String, notes: String) -> Unit
) {
    var selectedSpecialist by remember { mutableStateOf(SampleDataProvider.SPECIALISTS.first()) }
    var urgency by remember { mutableStateOf("Urgent") }
    var notes by remember { mutableStateOf("Patient displays moderate NPDR with paramacular cotton wool spots and microaneurysm cluster. OCT and fluorescein angiography recommended.") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    Icons.Default.LocalHospital,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
                Text("Specialist Referral Order", fontWeight = FontWeight.Bold)
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    "Select a consulting retina specialist:",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                // Specialist selection cards
                SampleDataProvider.SPECIALISTS.forEach { specialist ->
                    val isSelected = specialist.id == selectedSpecialist.id
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { selectedSpecialist = specialist },
                        shape = RoundedCornerShape(8.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant
                        ),
                        border = if (isSelected) CardDefaults.outlinedCardBorder().copy(
                            brush = androidx.compose.ui.graphics.SolidColor(MaterialTheme.colorScheme.primary)
                        ) else null
                    ) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                text = specialist.name,
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.bodyMedium
                            )
                            Text(
                                text = specialist.title,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "${specialist.clinic} • ${specialist.distance}",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = specialist.availability,
                                style = MaterialTheme.typography.labelSmall,
                                color = Color(0xFF1B6C30),
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                Text("Referral Urgency Classification:", fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.bodyMedium)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf("STAT", "Urgent", "Routine").forEach { level ->
                        val isLevelSelected = urgency == level
                        FilterChip(
                            selected = isLevelSelected,
                            onClick = { urgency = level },
                            label = { Text(level, fontSize = 12.sp) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Clinical Handover Notes") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 3
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onTransmitReferral(selectedSpecialist.name, urgency, notes)
                    onDismiss()
                }
            ) {
                Text("Transmit Referral")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
