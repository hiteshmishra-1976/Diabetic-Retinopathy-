package com.retinascan.ai.data

import com.retinascan.ai.model.*

object SampleDataProvider {

    const val FUNDUS_OS_URL =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC5bjNVcgdDYH01pc0tsdxaVwYCOXsqkyjwjKVGDn8tSmhTbqQWqTSkKBp1bfYT1WHJBF_pR9wMOQ170W9hcxPwqX45sgoTmJZCUGBQlCeNdHtobFVw-o-G8v4fLPdiNYScu5DQhMdOdl0-CjoKMHlO2ujQKZc2rYDcZvgrT2PDPr5mcJngbKag7oQzpalJTc5iYmF13G2QJSOgZnrZQFMTUJ6xjILWfSMrRvOn9QZ_M5rMRLtz9LYm9w"

    const val FUNDUS_OD_URL =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCXT0aonMTlX4eTa7iL8wSon6e657zOjV4ecKMNfIpCU5lZKNyU79uQzuwPB_SXDnpeG2vAqhLD5FgugHrKFGxNeu4SL-RrORHvp-au6B_U1rzStnf5fErczfUnAp-E-Oi0v25TW0chME0UfmmEEKZbJzXVmLPd9-KD3nCwHZCN5k3HCkwojA13ATOTpktWOxCcVXO4L8HfLGDFd6E9FI6MIpGNFK094WXPaZFx7u_RwRmeCL6LbGYHQA"

    const val HEATMAP_URL =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCnaGVurj-kMh5s9oQj-rdaDnMDj7zZ1G708m4aLW6_asA0ZyqV3qTOfpyziFiG6wInaFvqv7ewNeEJ8-_AfHeSGTMzoH4irpV6p3Koqk_vLvepxMVn-ZrQem0cYyxKfbkI99JUzZCx7bHOVTpCQMo_6ZQFWUrZJaLiVd2FSO1z4yM66fHvt2NZYQfUot3aVtxsGa6mPSchHq1GgJSepRyoc7qGL-1qUn7zDUFwTsnYgYVIuHu5-GtTJw"

    val SPECIALISTS = listOf(
        Specialist(
            id = "sp-1",
            name = "Dr. Sarah Vance, MD",
            title = "Vitreoretinal Surgeon & Medical Retina Specialist",
            clinic = "Metropolitan Eye Institute - Retina Center",
            distance = "2.4 miles",
            availability = "Next Available: Tomorrow 09:30 AM"
        ),
        Specialist(
            id = "sp-2",
            name = "Dr. James Chen, MD, PhD",
            title = "Director of Diabetic Retinopathy Clinical Research",
            clinic = "University Ophthalmic Associates",
            distance = "4.8 miles",
            availability = "Next Available: Thursday 02:00 PM"
        ),
        Specialist(
            id = "sp-3",
            name = "Dr. Amara Patel, MD",
            title = "Comprehensive Ophthalmologist & Retinal Diseases",
            clinic = "Westside Vision & Surgical Clinic",
            distance = "6.1 miles",
            availability = "Next Available: Friday 11:15 AM"
        )
    )

    val INITIAL_PATIENTS = listOf(
        PatientRecord(
            id = "pt-8842",
            patientIdNumber = "RH-8842",
            name = "Eleanor Vance",
            age = 58,
            gender = "Female",
            dob = "1968-04-12",
            diabeticHistoryYears = 12,
            hba1c = "8.4%",
            bloodPressure = "138/86 mmHg",
            studyDate = "2026-09-02 08:30 EST",
            activeEye = EyeType.OS,
            diagnosisName = "Moderate NPDR",
            retinalGrade = 3,
            retinalGradeLabel = "Grade 3: Moderate Nonproliferative Diabetic Retinopathy",
            overallConfidence = 94,
            leftEye = EyeScanData(
                eye = EyeType.OS,
                eyeLabel = "Left Eye (OS)",
                status = "Moderate",
                statusText = "Moderate NPDR",
                imageUrl = FUNDUS_OS_URL,
                heatmapUrl = HEATMAP_URL,
                capturedAt = "2026-09-02 08:24:12",
                imageQualityScore = 98,
                illuminationIndex = "Optimal (0.94)",
                focusMetric = "Sharp Focus (1.02)"
            ),
            rightEye = EyeScanData(
                eye = EyeType.OD,
                eyeLabel = "Right Eye (OD)",
                status = "Good",
                statusText = "Mild / Normal",
                imageUrl = FUNDUS_OD_URL,
                heatmapUrl = HEATMAP_URL,
                capturedAt = "2026-09-02 08:21:40",
                imageQualityScore = 99,
                illuminationIndex = "Optimal (0.97)",
                focusMetric = "Sharp Focus (1.06)"
            ),
            lesions = listOf(
                AnomalyItem("an-1", "Microaneurysms", "MA", "microaneurysm", Coordinates(120, 450, 20, 20, 25f, 30f, 7f, 7f), 88, "Critical", "#BA1A1A", "trip_origin", "Focal dilation of retinal capillaries located in the superotemporal vascular arcade."),
                AnomalyItem("an-2", "Hemorrhages", "HEM", "hemorrhage", Coordinates(240, 180, 45, 30, 40f, 60f, 9f, 7f), 92, "Critical", "#BA1A1A", "water_drop", "Dot-and-blot intraretinal hemorrhages evident in middle retinal layers."),
                AnomalyItem("an-3", "Hard Exudates", "HEX", "hard_exudate", Coordinates(310, 520, 15, 10, 60f, 45f, 7f, 5f), 91, "Review", "#7D5700", "scatter_plot", "Lipid deposits originating from vascular leakage near the inferior macula."),
                AnomalyItem("an-4", "Cotton Wool Spots", "CWS", "cotton_wool_spot", Coordinates(400, 220, 60, 45, 30f, 70f, 10f, 9f), 85, "Review", "#F4BE5D", "cloud", "Nerve fiber layer micro-infarctions in the paramacular region indicating localized ischemia."),
                AnomalyItem("an-5", "Neovascularization", "NV", "neovascularization", Coordinates(90, 600, 80, 75, 75f, 20f, 13f, 11f), 95, "Critical", "#9C3F4E", "hub", "Abnormal frond of new blood vessel growth near the inferonasal arcade.")
            ),
            criticalFinding = CriticalFinding(
                title = "Critical Finding",
                description = "AI identifies high concentration of cotton wool spots in the macular region, suggesting urgent review.",
                urgency = "Urgent",
                actionNeeded = "Dilated specialist evaluation within 14 days and OCT scan to rule out macular edema."
            ),
            clinicalNotes = "Patient presents for annual diabetic eye screening. Visual acuity is 20/30 in OS and 20/20 in OD. No previous laser therapy or anti-VEGF injections. AI detection marks multiple high-confidence vascular lesions in left eye.",
            isConfirmed = false,
            isFlagged = false
        ),
        PatientRecord(
            id = "pt-9104",
            patientIdNumber = "RH-9104",
            name = "Marcus Thorne",
            age = 64,
            gender = "Male",
            dob = "1962-11-03",
            diabeticHistoryYears = 19,
            hba1c = "9.2%",
            bloodPressure = "144/92 mmHg",
            studyDate = "2026-09-02 09:15 EST",
            activeEye = EyeType.OS,
            diagnosisName = "Severe NPDR",
            retinalGrade = 4,
            retinalGradeLabel = "Grade 4: Severe Nonproliferative Diabetic Retinopathy",
            overallConfidence = 96,
            leftEye = EyeScanData(
                eye = EyeType.OS,
                eyeLabel = "Left Eye (OS)",
                status = "Severe",
                statusText = "Severe Risk - High Priority",
                imageUrl = FUNDUS_OS_URL,
                heatmapUrl = HEATMAP_URL,
                capturedAt = "2026-09-02 09:05:14",
                imageQualityScore = 95,
                illuminationIndex = "Optimal (0.92)",
                focusMetric = "Sharp Focus (0.98)"
            ),
            rightEye = EyeScanData(
                eye = EyeType.OD,
                eyeLabel = "Right Eye (OD)",
                status = "Moderate",
                statusText = "Moderate NPDR",
                imageUrl = FUNDUS_OD_URL,
                heatmapUrl = HEATMAP_URL,
                capturedAt = "2026-09-02 09:08:22",
                imageQualityScore = 97,
                illuminationIndex = "Optimal (0.95)",
                focusMetric = "Sharp Focus (1.00)"
            ),
            lesions = listOf(
                AnomalyItem("an-201", "Extensive Hemorrhages", "HEM-EXT", "hemorrhage", Coordinates(210, 350, 70, 55, 35f, 45f, 14f, 12f), 97, "Critical", "#BA1A1A", "water_drop", "Multi-quadrant deep blot hemorrhages fulfilling 4-2-1 criteria for severe NPDR."),
                AnomalyItem("an-202", "Venous Beading", "VB", "neovascularization", Coordinates(380, 150, 60, 30, 22f, 58f, 12f, 8f), 93, "Critical", "#9C3F4E", "hub", "Localized caliber variation in superior temporal venules.")
            ),
            criticalFinding = CriticalFinding(
                title = "High Risk Finding",
                description = "Severe 4-quadrant retinal hemorrhages with venous beading. Elevated progression risk to PDR within 12 months.",
                urgency = "STAT",
                actionNeeded = "Urgent retina specialist consultation within 48-72 hours."
            ),
            clinicalNotes = "Severe NPDR stage verified. Immediate specialist queue escalation initiated.",
            isConfirmed = false,
            isFlagged = false
        )
    )
}
