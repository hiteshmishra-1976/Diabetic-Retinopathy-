package com.retinascan.ai.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.retinascan.ai.model.*

@Composable
fun AddPatientDialog(
    onDismiss: () -> Unit,
    onAddPatient: (PatientRecord) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var age by remember { mutableStateOf("54") }
    var gender by remember { mutableStateOf("Female") }
    var mrn by remember { mutableStateOf("RH-${(1000..9999).random()}") }
    var hba1c by remember { mutableStateOf("7.8%") }
    var bp by remember { mutableStateOf("132/84 mmHg") }
    var dmDuration by remember { mutableStateOf("8") }

    val sampleFundusUrl =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC5bjNVcgdDYH01pc0tsdxaVwYCOXsqkyjwjKVGDn8tSmhTbqQWqTSkKBp1bfYT1WHJBF_pR9wMOQ170W9hcxPwqX45sgoTmJZCUGBQlCeNdHtobFVw-o-G8v4fLPdiNYScu5DQhMdOdl0-CjoKMHlO2ujQKZc2rYDcZvgrT2PDPr5mcJngbKag7oQzpalJTc5iYmF13G2QJSOgZnrZQFMTUJ6xjILWfSMrRvOn9QZ_M5rMRLtz9LYm9w"
    val sampleNormalUrl =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCXT0aonMTlX4eTa7iL8wSon6e657zOjV4ecKMNfIpCU5lZKNyU79uQzuwPB_SXDnpeG2vAqhLD5FgugHrKFGxNeu4SL-RrORHvp-au6B_U1rzStnf5fErczfUnAp-E-Oi0v25TW0chME0UfmmEEKZbJzXVmLPd9-KD3nCwHZCN5k3HCkwojA13ATOTpktWOxCcVXO4L8HfLGDFd6E9FI6MIpGNFK094WXPaZFx7u_RwRmeCL6LbGYHQA"
    val sampleHeatmapUrl =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCnaGVurj-kMh5s9oQj-rdaDnMDj7zZ1G708m4aLW6_asA0ZyqV3qTOfpyziFiG6wInaFvqv7ewNeEJ8-_AfHeSGTMzoH4irpV6p3Koqk_vLvepxMVn-ZrQem0cYyxKfbkI99JUzZCx7bHOVTpCQMo_6ZQFWUrZJaLiVd2FSO1z4yM66fHvt2NZYQfUot3aVtxsGa6mPSchHq1GgJSepRyoc7qGL-1qUn7zDUFwTsnYgYVIuHu5-GtTJw"

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text("Register New Patient", fontWeight = FontWeight.Bold)
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Full Patient Name *") },
                    modifier = Modifier.fillMaxWidth()
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = age,
                        onValueChange = { age = it },
                        label = { Text("Age") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = gender,
                        onValueChange = { gender = it },
                        label = { Text("Gender") },
                        modifier = Modifier.weight(1f)
                    )
                }
                OutlinedTextField(
                    value = mrn,
                    onValueChange = { mrn = it },
                    label = { Text("MRN") },
                    modifier = Modifier.fillMaxWidth()
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = hba1c,
                        onValueChange = { hba1c = it },
                        label = { Text("HbA1c") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = bp,
                        onValueChange = { bp = it },
                        label = { Text("Blood Pressure") },
                        modifier = Modifier.weight(1f)
                    )
                }
                OutlinedTextField(
                    value = dmDuration,
                    onValueChange = { dmDuration = it },
                    label = { Text("DM Duration (Years)") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        val newRecord = PatientRecord(
                            id = "pt-${System.currentTimeMillis()}",
                            patientIdNumber = mrn,
                            name = name.trim(),
                            age = age.toIntOrNull() ?: 50,
                            gender = gender,
                            dob = "1972-01-01",
                            diabeticHistoryYears = dmDuration.toIntOrNull() ?: 5,
                            hba1c = if (hba1c.contains("%")) hba1c else "$hba1c%",
                            bloodPressure = bp,
                            studyDate = "2026-09-02 09:00 EST",
                            diagnosisName = "Moderate NPDR",
                            retinalGrade = 3,
                            retinalGradeLabel = "Grade 3: Moderate Nonproliferative Diabetic Retinopathy",
                            overallConfidence = 92,
                            leftEye = EyeScanData(
                                eye = EyeType.OS,
                                eyeLabel = "Left Eye (OS)",
                                status = "Moderate",
                                statusText = "Moderate - Ready",
                                imageUrl = sampleFundusUrl,
                                heatmapUrl = sampleHeatmapUrl,
                                capturedAt = "2026-09-02",
                                imageQualityScore = 96,
                                illuminationIndex = "Optimal (0.95)",
                                focusMetric = "Sharp Focus (1.03)"
                            ),
                            rightEye = EyeScanData(
                                eye = EyeType.OD,
                                eyeLabel = "Right Eye (OD)",
                                status = "Good",
                                statusText = "Good",
                                imageUrl = sampleNormalUrl,
                                heatmapUrl = sampleHeatmapUrl,
                                capturedAt = "2026-09-02",
                                imageQualityScore = 98,
                                illuminationIndex = "Optimal (0.96)",
                                focusMetric = "Sharp Focus (1.05)"
                            ),
                            lesions = listOf(
                                AnomalyItem("an-new-1", "Microaneurysms", "MA", "microaneurysm", Coordinates(120, 450, 20, 20, 28f, 35f, 7f, 7f), 89, "Critical", "#ba1a1a", "trip_origin", "Focal dilation of capillaries."),
                                AnomalyItem("an-new-2", "Cotton Wool Spots", "CWS", "cotton_wool_spot", Coordinates(190, 320, 30, 25, 48f, 42f, 10f, 9f), 93, "Critical", "#ba1a1a", "cloud", "Nerve fiber layer infarcts.")
                            ),
                            criticalFinding = CriticalFinding(
                                title = "Paramacular Ischemia Risk",
                                description = "Cotton wool spots and microaneurysms detected in temporal arcade.",
                                urgency = "Urgent",
                                actionNeeded = "Refer to vitreo-retinal specialist."
                            )
                        )
                        onAddPatient(newRecord)
                        onDismiss()
                    }
                },
                enabled = name.isNotBlank()
            ) {
                Text("Register Patient")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
