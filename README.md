# RetinaScan AI — Android App

A native Android app for AI-assisted diabetic retinopathy screening and reporting. Clinicians can capture or upload retinal images, run AI-based analysis, compare scans over time, generate reports, and refer patients to specialists.

## Features

- **Patient management** — add and switch between patient records
- **Image capture** — capture fundus (retinal) images directly via CameraX
- **AI analysis** — automated grading of diabetic retinopathy severity
- **Comparison view** — track changes in a patient's retinal scans across visits
- **Report generation** — produce a shareable clinical report
- **Specialist referral** — flag and refer cases that need specialist attention

## Tech Stack

- **Kotlin**
- **Jetpack Compose** — UI toolkit (Material 3)
- **CameraX** — fundus image capture
- **Coil** — image loading
- **AndroidX Navigation Compose** — in-app navigation
- **ViewModel + StateFlow** — state management (MVVM)
- **Gradle Kotlin DSL** — build configuration

## Project Structure

```
app/src/main/java/com/retinascan/ai/
├── MainActivity.kt                     # App entry point, hosts the Compose scaffold
├── model/
│   └── PatientRecord.kt                # Patient data model
├── data/
│   └── SampleDataProvider.kt           # Sample/demo patient data
├── viewmodel/
│   └── RetinaScanViewModel.kt          # App state and business logic
└── ui/
    ├── theme/
    │   └── Theme.kt                    # App theme and styling
    ├── components/
    │   ├── AddPatientDialog.kt
    │   └── SpecialistReferralDialog.kt
    └── screens/
        ├── CaptureScreen.kt            # Fundus image capture
        ├── AnalysisScreen.kt           # AI analysis results
        ├── CompareScreen.kt            # Compare scans across visits
        └── ReportScreen.kt             # Clinical report generation
```

## Requirements

- Android Studio (latest stable)
- Android SDK 35 (compile/target), min SDK 26
- JDK 17

## Getting Started

1. Open the project in Android Studio (`File → Open` → select this folder).
2. Let Gradle sync finish (dependencies are declared in `app/build.gradle.kts`).
3. Run the app on an emulator or physical device (`Shift+F10` or the Run button).

Alternatively, build from the command line:

```bash
./gradlew assembleDebug
```

The debug APK will be output to `app/build/outputs/apk/debug/`.

## Branch Structure

This branch (`app-frontend`) contains the native Android app. Related work in this repo:
- `frontend` — React/Vite web frontend
- `models` — diabetic retinopathy grading model (ConvNeXt + Grad-CAM), training scripts, and inference code
