package com.retinascan.ai.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.retinascan.ai.model.PatientRecord
import com.retinascan.ai.ui.components.SpecialistReferralDialog

@Composable
fun ReportScreen(
    patient: PatientRecord,
    onReferSpecialist: (specialistName: String, urgency: String, notes: String) -> Unit,
    onUpdateNotes: (notes: String) -> Unit
) {
    var showReferralDialog by remember { mutableStateOf(false) }
    var notesText by remember(patient.id) { mutableStateOf(patient.clinicalNotes) }
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surface)
            .padding(16.dp)
            .verticalScroll(scrollState),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Ophthalmic Diagnostic Report",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Automated Clinical Decision Support • Study Date: ${patient.studyDate}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        // Clinical Details Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            border = CardDefaults.outlinedCardBorder()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = "ICD-10 Code: E11.329 (Moderate NPDR without macular edema)",
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                    )
                }

                Divider()

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Patient Name", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(patient.name, fontWeight = FontWeight.Bold)
                        Text("${patient.gender}, ${patient.age}y", style = MaterialTheme.typography.bodySmall)
                    }
                    Column {
                        Text("MRN / Patient ID", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(patient.patientIdNumber, fontWeight = FontWeight.Bold)
                        Text("DOB: ${patient.dob}", style = MaterialTheme.typography.bodySmall)
                    }
                    Column {
                        Text("Grading", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("Grade ${patient.retinalGrade}", fontWeight = FontWeight.Bold, color = Color(0xFFBA1A1A))
                        Text("${patient.overallConfidence}% Conf.", style = MaterialTheme.typography.bodySmall)
                    }
                }

                Divider()

                Text(
                    text = "Clinical Findings Summary:",
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.bodyMedium
                )
                Text(
                    text = "Automated AI deep-learning screening identifies moderate diabetic retinopathy features in the left eye (OS) including multiple capillary microaneurysms, blot intraretinal hemorrhages, and nerve fiber layer infarcts (cotton wool spots) in the paramacular temporal arcade. Right eye (OD) exhibits no significant microvascular pathology.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = 20.sp
                )

                // Quantitative Pathology Count
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("${patient.lesions.count { it.type == "microaneurysm" }}", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFFBA1A1A))
                        Text("Microaneurysms", style = MaterialTheme.typography.labelSmall)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("${patient.lesions.count { it.type == "hemorrhage" }}", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFFBA1A1A))
                        Text("Hemorrhages", style = MaterialTheme.typography.labelSmall)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("${patient.lesions.count { it.type == "cotton_wool_spot" }}", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF7D5700))
                        Text("Cotton Wool", style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
        }

        // Clinical Notes Editor Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            border = CardDefaults.outlinedCardBorder()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Physician Clinical Impressions & Notes",
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.titleSmall
                )
                OutlinedTextField(
                    value = notesText,
                    onValueChange = {
                        notesText = it
                        onUpdateNotes(it)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 3,
                    placeholder = { Text("Enter doctor's clinical review notes...") }
                )
            }
        }

        // Referral Status Banner
        if (patient.referralStatus?.isReferred == true) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFC4EED0))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF1B6C30))
                    Column {
                        Text(
                            text = "Specialist Referral Transmitted (${patient.referralStatus.urgency})",
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF1B6C30)
                        )
                        Text(
                            text = "Assigned to: ${patient.referralStatus.specialistName}",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFF0F3D1A)
                        )
                    }
                }
            }
        }

        // Action Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = { /* Native Android print/share PDF */ },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.PictureAsPdf, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text("Export PDF")
            }
            Button(
                onClick = { showReferralDialog = true },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text(if (patient.referralStatus?.isReferred == true) "Update Referral" else "Refer Specialist")
            }
        }
    }

    if (showReferralDialog) {
        SpecialistReferralDialog(
            onDismiss = { showReferralDialog = false },
            onTransmitReferral = { specialist, urgency, notes ->
                onReferSpecialist(specialist, urgency, notes)
            }
        )
    }
}
