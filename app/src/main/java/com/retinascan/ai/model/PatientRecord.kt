package com.retinascan.ai.model

enum class EyeType {
    OS, OD
}

data class Coordinates(
    val x: Int,
    val y: Int,
    val w: Int,
    val h: Int,
    val topPct: Float,
    val leftPct: Float,
    val widthPct: Float,
    val heightPct: Float
)

data class AnomalyItem(
    val id: String,
    val name: String,
    val shortCode: String,
    val type: String,
    val coordinates: Coordinates,
    val confidence: Int,
    val severity: String,
    val colorHex: String,
    val iconName: String,
    val description: String
)

data class EyeScanData(
    val eye: EyeType,
    val eyeLabel: String,
    val status: String,
    val statusText: String,
    val imageUrl: String,
    val heatmapUrl: String,
    val capturedAt: String,
    val imageQualityScore: Int,
    val illuminationIndex: String,
    val focusMetric: String
)

data class CriticalFinding(
    val title: String,
    val description: String,
    val urgency: String,
    val actionNeeded: String
)

data class ReferralStatus(
    val isReferred: Boolean = false,
    val specialistName: String = "",
    val urgency: String = "Routine",
    val referredAt: String = ""
)

data class Specialist(
    val id: String,
    val name: String,
    val title: String,
    val clinic: String,
    val distance: String,
    val availability: String
)

data class PatientRecord(
    val id: String,
    val patientIdNumber: String,
    val name: String,
    val age: Int,
    val gender: String,
    val dob: String,
    val diabeticHistoryYears: Int,
    val hba1c: String,
    val bloodPressure: String,
    val studyDate: String,
    val activeEye: EyeType = EyeType.OS,
    val diagnosisName: String,
    val retinalGrade: Int,
    val retinalGradeLabel: String,
    val overallConfidence: Int,
    val leftEye: EyeScanData,
    val rightEye: EyeScanData,
    val lesions: List<AnomalyItem> = emptyList(),
    val criticalFinding: CriticalFinding? = null,
    val referralStatus: ReferralStatus? = null,
    val clinicalNotes: String = "",
    val isConfirmed: Boolean = false,
    val isFlagged: Boolean = false
)
