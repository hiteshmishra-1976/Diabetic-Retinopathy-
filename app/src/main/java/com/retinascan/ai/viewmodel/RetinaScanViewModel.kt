package com.retinascan.ai.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.retinascan.ai.data.SampleDataProvider
import com.retinascan.ai.model.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

enum class ScreenTab {
    CAPTURE, ANALYSIS, COMPARE, REPORT
}

class RetinaScanViewModel : ViewModel() {

    private val _currentTab = MutableStateFlow(ScreenTab.CAPTURE)
    val currentTab: StateFlow<ScreenTab> = _currentTab.asStateFlow()

    private val _patients = MutableStateFlow(SampleDataProvider.INITIAL_PATIENTS)
    val patients: StateFlow<List<PatientRecord>> = _patients.asStateFlow()

    private val _currentPatient = MutableStateFlow(SampleDataProvider.INITIAL_PATIENTS.first())
    val currentPatient: StateFlow<PatientRecord> = _currentPatient.asStateFlow()

    private val _activeEye = MutableStateFlow(EyeType.OS)
    val activeEye: StateFlow<EyeType> = _activeEye.asStateFlow()

    private val _selectedLesionFilter = MutableStateFlow<String?>("ALL")
    val selectedLesionFilter: StateFlow<String?> = _selectedLesionFilter.asStateFlow()

    private val _isAnalyzing = MutableStateFlow(false)
    val isAnalyzing: StateFlow<Boolean> = _isAnalyzing.asStateFlow()

    val specialists: List<Specialist> = SampleDataProvider.SPECIALISTS

    fun setTab(tab: ScreenTab) {
        _currentTab.value = tab
    }

    fun selectPatient(patient: PatientRecord) {
        _currentPatient.value = patient
        _activeEye.value = patient.activeEye
    }

    fun addPatient(newPatient: PatientRecord) {
        _patients.update { listOf(newPatient) + it }
        _currentPatient.value = newPatient
        _activeEye.value = newPatient.activeEye
        _currentTab.value = ScreenTab.CAPTURE
    }

    fun setActiveEye(eye: EyeType) {
        _activeEye.value = eye
        _currentPatient.update { it.copy(activeEye = eye) }
    }

    fun updateEyeScanImage(eye: EyeType, imageUri: String) {
        _currentPatient.update { patient ->
            val updatedScan = if (eye == EyeType.OS) {
                patient.leftEye.copy(
                    imageUrl = imageUri,
                    status = "Uploaded",
                    statusText = "Ready for Analysis",
                    imageQualityScore = 98,
                    illuminationIndex = "Optimal (0.95)",
                    focusMetric = "Sharp Focus (1.02)"
                )
            } else {
                patient.rightEye.copy(
                    imageUrl = imageUri,
                    status = "Uploaded",
                    statusText = "Ready for Analysis",
                    imageQualityScore = 98,
                    illuminationIndex = "Optimal (0.95)",
                    focusMetric = "Sharp Focus (1.02)"
                )
            }
            if (eye == EyeType.OS) {
                patient.copy(leftEye = updatedScan, activeEye = eye)
            } else {
                patient.copy(rightEye = updatedScan, activeEye = eye)
            }
        }
        updatePatientInList(_currentPatient.value)
    }

    fun setLesionFilter(filter: String?) {
        _selectedLesionFilter.value = filter
    }

    fun confirmDiagnosis() {
        _currentPatient.update { it.copy(isConfirmed = true) }
        updatePatientInList(_currentPatient.value)
    }

    fun flagForReview() {
        _currentPatient.update { it.copy(isFlagged = true) }
        updatePatientInList(_currentPatient.value)
    }

    fun updateNotes(notes: String) {
        _currentPatient.update { it.copy(clinicalNotes = notes) }
        updatePatientInList(_currentPatient.value)
    }

    fun referToSpecialist(specialistName: String, urgency: String) {
        _currentPatient.update {
            it.copy(
                referralStatus = ReferralStatus(
                    isReferred = true,
                    specialistName = specialistName,
                    urgency = urgency,
                    referredAt = "2026-09-05"
                )
            )
        }
        updatePatientInList(_currentPatient.value)
    }

    fun runAiAnalysis() {
        viewModelScope.launch {
            _isAnalyzing.value = true
            delay(1200) // Simulated deep inference latency
            _isAnalyzing.value = false
            _currentTab.value = ScreenTab.ANALYSIS
        }
    }

    private fun updatePatientInList(updated: PatientRecord) {
        _patients.update { list ->
            list.map { if (it.id == updated.id) updated else it }
        }
    }
}
