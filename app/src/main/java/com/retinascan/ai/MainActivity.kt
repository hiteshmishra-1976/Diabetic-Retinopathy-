package com.retinascan.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.retinascan.ai.ui.components.AddPatientDialog
import com.retinascan.ai.ui.screens.*
import com.retinascan.ai.ui.theme.RetinaScanTheme
import com.retinascan.ai.viewmodel.RetinaScanViewModel
import com.retinascan.ai.viewmodel.ScreenTab

class MainActivity : ComponentActivity() {
    private val viewModel: RetinaScanViewModel by viewModels()

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RetinaScanTheme {
                val currentTab by viewModel.currentTab.collectAsState()
                val currentPatient by viewModel.currentPatient.collectAsState()
                val patients by viewModel.patients.collectAsState()
                var showAddPatientDialog by remember { mutableStateOf(false) }
                var showPatientMenu by remember { mutableStateOf(false) }

                Scaffold(
                    topBar = {
                        TopAppBar(
                            title = {
                                Column {
                                    Text("RetinaScan AI", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                                    Text(
                                        "${currentPatient.name} • MRN ${currentPatient.patientIdNumber}",
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            },
                            actions = {
                                Box {
                                    IconButton(onClick = { showPatientMenu = true }) {
                                        Icon(Icons.Default.People, contentDescription = "Switch Patient")
                                    }
                                    DropdownMenu(
                                        expanded = showPatientMenu,
                                        onDismissRequest = { showPatientMenu = false }
                                    ) {
                                        patients.forEach { patient ->
                                            DropdownMenuItem(
                                                text = {
                                                    Column {
                                                        Text(patient.name, fontWeight = FontWeight.SemiBold)
                                                        Text("${patient.patientIdNumber} • ${patient.diagnosisName}", fontSize = 11.sp)
                                                    }
                                                },
                                                onClick = {
                                                    viewModel.selectPatient(patient)
                                                    showPatientMenu = false
                                                }
                                            )
                                        }
                                    }
                                }
                                IconButton(onClick = { showAddPatientDialog = true }) {
                                    Icon(Icons.Default.PersonAdd, contentDescription = "New Patient")
                                }
                            }
                        )
                    },
                    bottomBar = {
                        NavigationBar {
                            NavigationBarItem(
                                selected = currentTab == ScreenTab.CAPTURE,
                                onClick = { viewModel.setTab(ScreenTab.CAPTURE) },
                                icon = { Icon(Icons.Default.CameraAlt, contentDescription = "Capture") },
                                label = { Text("Capture") }
                            )
                            NavigationBarItem(
                                selected = currentTab == ScreenTab.ANALYSIS,
                                onClick = { viewModel.setTab(ScreenTab.ANALYSIS) },
                                icon = { Icon(Icons.Default.Search, contentDescription = "Analysis") },
                                label = { Text("Analysis") }
                            )
                            NavigationBarItem(
                                selected = currentTab == ScreenTab.COMPARE,
                                onClick = { viewModel.setTab(ScreenTab.COMPARE) },
                                icon = { Icon(Icons.Default.Compare, contentDescription = "Compare") },
                                label = { Text("Compare") }
                            )
                            NavigationBarItem(
                                selected = currentTab == ScreenTab.REPORT,
                                onClick = { viewModel.setTab(ScreenTab.REPORT) },
                                icon = { Icon(Icons.Default.Description, contentDescription = "Report") },
                                label = { Text("Report") }
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        when (currentTab) {
                            ScreenTab.CAPTURE -> CaptureScreen(
                                patient = currentPatient,
                                onNavigateToAnalysis = { viewModel.setTab(ScreenTab.ANALYSIS) },
                                onOpenAddPatient = { showAddPatientDialog = true },
                                onUploadScan = { eye, uri -> viewModel.updateEyeScanImage(eye, uri) }
                            )
                            ScreenTab.ANALYSIS -> AnalysisScreen(
                                patient = currentPatient,
                                onConfirm = { viewModel.confirmDiagnosis() },
                                onFlagReview = { viewModel.flagForReview() },
                                onNavigateToCompare = { viewModel.setTab(ScreenTab.COMPARE) }
                            )
                            ScreenTab.COMPARE -> CompareScreen(
                                patient = currentPatient,
                                onNavigateToReport = { viewModel.setTab(ScreenTab.REPORT) }
                            )
                            ScreenTab.REPORT -> ReportScreen(
                                patient = currentPatient,
                                onReferSpecialist = { specialist, urgency, notes ->
                                    viewModel.referToSpecialist(specialist, urgency)
                                    viewModel.updateNotes(notes)
                                },
                                onUpdateNotes = { notes ->
                                    viewModel.updateNotes(notes)
                                }
                            )
                        }
                    }
                }

                if (showAddPatientDialog) {
                    AddPatientDialog(
                        onDismiss = { showAddPatientDialog = false },
                        onAddPatient = { newPatient ->
                            viewModel.addPatient(newPatient)
                        }
                    )
                }
            }
        }
    }
}
