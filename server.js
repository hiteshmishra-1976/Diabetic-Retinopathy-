const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const APK_PATH = '/app/applet/app/build/outputs/apk/debug/app-debug.apk';

const FUNDUS_OS_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuC5bjNVcgdDYH01pc0tsdxaVwYCOXsqkyjwjKVGDn8tSmhTbqQWqTSkKBp1bfYT1WHJBF_pR9wMOQ170W9hcxPwqX45sgoTmJZCUGBQlCeNdHtobFVw-o-G8v4fLPdiNYScu5DQhMdOdl0-CjoKMHlO2ujQKZc2rYDcZvgrT2PDPr5mcJngbKag7oQzpalJTc5iYmF13G2QJSOgZnrZQFMTUJ6xjILWfSMrRvOn9QZ_M5rMRLtz9LYm9w";
const FUNDUS_OD_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuCXT0aonMTlX4eTa7iL8wSon6e657zOjV4ecKMNfIpCU5lZKNyU79uQzuwPB_SXDnpeG2vAqhLD5FgugHrKFGxNeu4SL-RrORHvp-au6B_U1rzStnf5fErczfUnAp-E-Oi0v25TW0chME0UfmmEEKZbJzXVmLPd9-KD3nCwHZCN5k3HCkwojA13ATOTpktWOxCcVXO4L8HfLGDFd6E9FI6MIpGNFK094WXPaZFx7u_RwRmeCL6LbGYHQA";
const HEATMAP_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuCnaGVurj-kMh5s9oQj-rdaDnMDj7zZ1G708m4aLW6_asA0ZyqV3qTOfpyziFiG6wInaFvqv7ewNeEJ8-_AfHeSGTMzoH4irpV6p3Koqk_vLvepxMVn-ZrQem0cYyxKfbkI99JUzZCx7bHOVTpCQMo_6ZQFWUrZJaLiVd2FSO1z4yM66fHvt2NZYQfUot3aVtxsGa6mPSchHq1GgJSepRyoc7qGL-1qUn7zDUFwTsnYgYVIuHu5-GtTJw";

const PATIENTS = [
  {
    id: "pt-8842",
    patientIdNumber: "RH-8842",
    name: "Eleanor Vance",
    age: 58,
    gender: "Female",
    dob: "1968-04-12",
    diabeticHistoryYears: 12,
    hba1c: "8.4%",
    bloodPressure: "138/86 mmHg",
    studyDate: "2026-09-02 08:30 EST",
    activeEye: "OS",
    diagnosisName: "Moderate NPDR",
    retinalGrade: 3,
    retinalGradeLabel: "Grade 3: Moderate Nonproliferative Diabetic Retinopathy",
    overallConfidence: 94,
    leftEye: {
      eyeLabel: "Left Eye (OS)",
      statusText: "Moderate NPDR",
      imageUrl: FUNDUS_OS_URL,
      heatmapUrl: HEATMAP_URL,
      capturedAt: "2026-09-02 08:24:12",
      imageQualityScore: 98,
      illuminationIndex: "Optimal (0.94)",
      focusMetric: "Sharp Focus (1.02)"
    },
    rightEye: {
      eyeLabel: "Right Eye (OD)",
      statusText: "Mild / Normal",
      imageUrl: FUNDUS_OD_URL,
      heatmapUrl: HEATMAP_URL,
      capturedAt: "2026-09-02 08:21:40",
      imageQualityScore: 99,
      illuminationIndex: "Optimal (0.97)",
      focusMetric: "Sharp Focus (1.06)"
    },
    lesions: [
      { id: "an-1", name: "Microaneurysms", shortCode: "MA", type: "microaneurysm", leftPct: 25, topPct: 30, widthPct: 8, heightPct: 8, confidence: 88, severity: "Critical", color: "#BA1A1A", description: "Focal dilation of retinal capillaries located in the superotemporal vascular arcade." },
      { id: "an-2", name: "Hemorrhages", shortCode: "HEM", type: "hemorrhage", leftPct: 40, topPct: 60, widthPct: 10, heightPct: 8, confidence: 92, severity: "Critical", color: "#BA1A1A", description: "Dot-and-blot intraretinal hemorrhages evident in middle retinal layers." },
      { id: "an-3", name: "Hard Exudates", shortCode: "HEX", type: "hard_exudate", leftPct: 60, topPct: 45, widthPct: 8, heightPct: 6, confidence: 91, severity: "Review", color: "#7D5700", description: "Lipid deposits originating from vascular leakage near the inferior macula." },
      { id: "an-4", name: "Cotton Wool Spots", shortCode: "CWS", type: "cotton_wool_spot", leftPct: 30, topPct: 70, widthPct: 12, heightPct: 10, confidence: 85, severity: "Review", color: "#B45309", description: "Nerve fiber layer micro-infarctions in the paramacular region indicating localized ischemia." },
      { id: "an-5", name: "Neovascularization", shortCode: "NV", type: "neovascularization", leftPct: 75, topPct: 20, widthPct: 14, heightPct: 12, confidence: 95, severity: "Critical", color: "#9C3F4E", description: "Abnormal frond of new blood vessel growth near the inferonasal arcade." }
    ],
    criticalFinding: {
      title: "Critical Finding",
      description: "AI identifies high concentration of cotton wool spots in the macular region, suggesting urgent review.",
      urgency: "Urgent",
      actionNeeded: "Dilated specialist evaluation within 14 days and OCT scan to rule out macular edema."
    },
    clinicalNotes: "Patient presents for annual diabetic eye screening. Visual acuity is 20/30 in OS and 20/20 in OD. No previous laser therapy or anti-VEGF injections. AI detection marks multiple high-confidence vascular lesions in left eye.",
    isConfirmed: false,
    isFlagged: false
  },
  {
    id: "pt-9104",
    patientIdNumber: "RH-9104",
    name: "Marcus Thorne",
    age: 64,
    gender: "Male",
    dob: "1962-11-03",
    diabeticHistoryYears: 19,
    hba1c: "9.2%",
    bloodPressure: "144/92 mmHg",
    studyDate: "2026-09-02 09:15 EST",
    activeEye: "OS",
    diagnosisName: "Severe NPDR",
    retinalGrade: 4,
    retinalGradeLabel: "Grade 4: Severe Nonproliferative Diabetic Retinopathy",
    overallConfidence: 96,
    leftEye: {
      eyeLabel: "Left Eye (OS)",
      statusText: "Severe Risk - High Priority",
      imageUrl: FUNDUS_OS_URL,
      heatmapUrl: HEATMAP_URL,
      capturedAt: "2026-09-02 09:05:14",
      imageQualityScore: 95,
      illuminationIndex: "Optimal (0.92)",
      focusMetric: "Sharp Focus (0.98)"
    },
    rightEye: {
      eyeLabel: "Right Eye (OD)",
      statusText: "Moderate NPDR",
      imageUrl: FUNDUS_OD_URL,
      heatmapUrl: HEATMAP_URL,
      capturedAt: "2026-09-02 09:08:22",
      imageQualityScore: 97,
      illuminationIndex: "Optimal (0.95)",
      focusMetric: "Sharp Focus (1.00)"
    },
    lesions: [
      { id: "an-201", name: "Extensive Hemorrhages", shortCode: "HEM-EXT", type: "hemorrhage", leftPct: 35, topPct: 45, widthPct: 15, heightPct: 13, confidence: 97, severity: "Critical", color: "#BA1A1A", description: "Multi-quadrant deep blot hemorrhages fulfilling 4-2-1 criteria for severe NPDR." },
      { id: "an-202", name: "Venous Beading", shortCode: "VB", type: "neovascularization", leftPct: 22, topPct: 58, widthPct: 13, heightPct: 9, confidence: 93, severity: "Critical", color: "#9C3F4E", description: "Localized caliber variation in superior temporal venules." }
    ],
    criticalFinding: {
      title: "High Risk Finding",
      description: "Severe 4-quadrant retinal hemorrhages with venous beading. Elevated progression risk to PDR within 12 months.",
      urgency: "STAT",
      actionNeeded: "Urgent retina specialist consultation within 48-72 hours."
    },
    clinicalNotes: "Severe NPDR stage verified. Immediate specialist queue escalation initiated.",
    isConfirmed: false,
    isFlagged: false
  }
];

const SPECIALISTS = [
  {
    id: "sp-1",
    name: "Dr. Sarah Vance, MD",
    title: "Vitreoretinal Surgeon & Medical Retina Specialist",
    clinic: "Metropolitan Eye Institute - Retina Center",
    distance: "2.4 miles",
    availability: "Tomorrow 09:30 AM"
  },
  {
    id: "sp-2",
    name: "Dr. James Chen, MD, PhD",
    title: "Director of Diabetic Retinopathy Clinical Research",
    clinic: "University Ophthalmic Associates",
    distance: "4.8 miles",
    availability: "Thursday 02:00 PM"
  },
  {
    id: "sp-3",
    name: "Dr. Amara Patel, MD",
    title: "Comprehensive Ophthalmologist & Retinal Diseases",
    clinic: "Westside Vision & Surgical Clinic",
    distance: "6.1 miles",
    availability: "Friday 11:15 AM"
  }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/health' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', app: 'RetinaScan AI' }));
    return;
  }

  if (pathname === '/api/download-apk' || pathname === '/download/app-debug.apk') {
    if (fs.existsSync(APK_PATH)) {
      const stat = fs.statSync(APK_PATH);
      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename="RetinaScan-AI-debug.apk"',
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(APK_PATH).pipe(res);
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'APK not compiled yet' }));
      return;
    }
  }

  if (pathname === '/api/patients') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(PATIENTS));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(getHtmlContent());
});

function getHtmlContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RetinaScan AI</title>
  <meta name="description" content="High-contrast clinical medical diagnostic system for automated retinal scan analysis, anomaly detection, Grad-CAM heatmaps, and specialist referral workflows.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #F8FAFC;
      color: #1A1C1E;
    }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    /* Material 3 Color Tokens */
    :root {
      --md-primary: #0061A4;
      --md-on-primary: #FFFFFF;
      --md-primary-container: #D1E4FF;
      --md-on-primary-container: #001D36;
      --md-surface: #F8FAFC;
      --md-surface-container: #FFFFFF;
      --md-surface-variant: #F1F5F9;
      --md-outline: #CBD5E1;
      --md-error: #BA1A1A;
      --md-error-container: #FFDAD6;
      --md-on-error-container: #410002;
    }
    .fundus-viewport {
      background-color: #000000;
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      user-select: none;
    }
    .lesion-box {
      position: absolute;
      border: 2px solid #BA1A1A;
      background-color: rgba(186, 26, 26, 0.25);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: flex-start;
      padding: 2px;
    }
    .lesion-box.selected {
      border-color: #F59E0B;
      background-color: rgba(245, 158, 11, 0.45);
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.4);
      z-index: 20;
    }
    .lesion-badge {
      font-size: 10px;
      font-weight: 700;
      color: #FFFFFF;
      background-color: #BA1A1A;
      padding: 1px 4px;
      border-radius: 2px;
      line-height: 1;
    }
    .lesion-box.selected .lesion-badge {
      background-color: #D97706;
      color: #000000;
    }
    .grid-line-overlay {
      position: absolute;
      inset: 0;
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(0, 229, 255, 0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 229, 255, 0.15) 1px, transparent 1px);
      pointer-events: none;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">

  <!-- Top AppBar (Clean Light Material 3 Style) -->
  <header id="main-header" class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      
      <!-- Title & Patient Info -->
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg bg-[#0061A4] text-white flex items-center justify-center font-bold shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div>
          <h1 class="text-base font-bold text-slate-900 leading-tight">RetinaScan AI</h1>
          <p id="top-patient-badge" class="text-xs text-slate-500 font-medium">Eleanor Vance • MRN RH-8842</p>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="flex items-center space-x-3">
        
        <!-- Switch Patient Selector -->
        <div class="relative">
          <select id="patient-selector" onchange="switchPatient(this.value)" class="text-xs font-semibold bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0061A4] cursor-pointer appearance-none">
            <option value="pt-8842">Eleanor Vance (RH-8842)</option>
            <option value="pt-9104">Marcus Thorne (RH-9104)</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        <!-- Add Patient Button -->
        <button onclick="openAddPatientModal()" class="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0061A4] bg-[#D1E4FF] hover:bg-[#b8d5ff] px-3 py-2 rounded-lg transition">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>New Patient</span>
        </button>

        <!-- Download Android APK -->
        <a id="btn-apk-download" href="/api/download-apk" class="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-3 py-2 rounded-lg transition" title="Download compiled native APK">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993s-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m11.4045-6.02l1.996-3.4572c.156-.2701.063-.6158-.2071-.7718-.2701-.156-.6158-.063-.7718.2071l-2.0232 3.5042c-1.4556-.6645-3.084-.103-4.8754-1.03-1.7914 0-3.4198.3655-4.8754 1.03l-2.0232-3.5042c-.156-.2701-.5017-.3631-.7718-.2071-.2701.156-.3631.5017-.2071.7718l1.996 3.4572C3.5134 10.9856 1.5 13.9015 1.5 17.3482h21c0-3.4467-2.0134-6.3626-4.6185-8.0268"/></svg>
          <span>APK (19.9MB)</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Navigation Bar (Material 3 Style) -->
  <nav class="bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-2 py-2 overflow-x-auto">
      <button id="nav-analysis" onclick="navigate('analysis')" class="px-4 py-2 rounded-lg text-xs font-bold transition bg-[#D1E4FF] text-[#001D36] flex items-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        <span>Analysis</span>
      </button>
      <button id="nav-capture" onclick="navigate('capture')" class="px-4 py-2 rounded-lg text-xs font-medium transition text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <span>Capture</span>
      </button>
      <button id="nav-compare" onclick="navigate('compare')" class="px-4 py-2 rounded-lg text-xs font-medium transition text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
        <span>Compare</span>
      </button>
      <button id="nav-report" onclick="navigate('report')" class="px-4 py-2 rounded-lg text-xs font-medium transition text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span>Report</span>
      </button>
    </div>
  </nav>

  <!-- Main Viewport Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">

    <!-- TAB 1: ANALYSIS SCREEN -->
    <div id="screen-analysis" class="space-y-6">

      <!-- Diagnosis Overview Banner Card -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="diag-title" class="text-xl font-bold text-[#0061A4]">Moderate NPDR</h2>
            <p id="diag-subtitle" class="text-xs text-slate-600 mt-0.5">Grade 3: Moderate Nonproliferative Diabetic Retinopathy</p>
          </div>
          <div class="flex items-center space-x-3">
            <span id="diag-conf-badge" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D1E4FF] text-[#0061A4]">
              94% Confidence
            </span>
            <span id="eye-badge" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Left Eye (OS)
            </span>
          </div>
        </div>
      </div>

      <!-- Retinal Image Viewport Card -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        
        <!-- Viewport Controls -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <label class="inline-flex items-center text-xs font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" id="grid-toggle" checked onchange="toggleGrid(this.checked)" class="rounded border-slate-300 text-[#0061A4] focus:ring-[#0061A4] mr-2">
              Coordinate Grid Overlay
            </label>
            <span class="text-slate-300">•</span>
            <div class="flex space-x-1">
              <button onclick="selectEye('OS')" id="btn-select-os" class="text-xs px-2.5 py-1 rounded font-bold bg-[#0061A4] text-white">OS</button>
              <button onclick="selectEye('OD')" id="btn-select-od" class="text-xs px-2.5 py-1 rounded font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">OD</button>
            </div>
          </div>

          <button onclick="navigate('compare')" class="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0061A4] hover:underline">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            <span>Compare Heatmap</span>
          </button>
        </div>

        <!-- The Viewport Container -->
        <div class="fundus-viewport w-full h-[420px] flex items-center justify-center">
          <img id="fundus-img" src="${FUNDUS_OS_URL}" alt="Retinal Fundus Optical Scan" class="max-h-full max-w-full object-contain">
          
          <!-- Coordinate Grid -->
          <div id="grid-overlay" class="grid-line-overlay"></div>

          <!-- Bounding Boxes Container -->
          <div id="lesion-boxes-container" class="absolute inset-0 pointer-events-auto">
            <!-- Injected via JavaScript -->
          </div>
        </div>

        <p class="text-[11px] text-slate-500 mt-2">
          Click any bounding box above or select from the list below to inspect individual lesion coordinates.
        </p>
      </div>

      <!-- Pathology Filter Chips -->
      <div class="flex items-center space-x-2 overflow-x-auto pb-1">
        <button onclick="filterPathology('ALL')" id="chip-ALL" class="chip-btn px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0061A4] text-white transition">All (5)</button>
        <button onclick="filterPathology('MA')" id="chip-MA" class="chip-btn px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Microaneurysms</button>
        <button onclick="filterPathology('HEM')" id="chip-HEM" class="chip-btn px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Hemorrhages</button>
        <button onclick="filterPathology('CWS')" id="chip-CWS" class="chip-btn px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Cotton Wool</button>
        <button onclick="filterPathology('HEX')" id="chip-HEX" class="chip-btn px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Hard Exudates</button>
      </div>

      <!-- Detected Pathologies List -->
      <div class="space-y-3">
        <h3 id="pathology-heading" class="text-sm font-bold text-slate-900">Detected Pathologies (5)</h3>
        
        <div id="lesion-cards-container" class="space-y-2">
          <!-- Injected via JS -->
        </div>
      </div>

      <!-- Clinical Action Confirmation Bar -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div class="text-xs text-slate-600">
          <span class="font-bold text-slate-800">Diagnostic Decision Support:</span> Review complete. Findings are ready for clinical confirmation or escalation.
        </div>
        <div class="flex items-center space-x-3">
          <button onclick="flagReview()" class="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition">
            Flag for Review
          </button>
          <button onclick="confirmDiagnosis()" class="px-5 py-2 bg-[#1B6C30] hover:bg-[#145324] text-white text-xs font-bold rounded-lg shadow-sm transition">
            Confirm Diagnosis
          </button>
        </div>
      </div>

    </div>

    <!-- TAB 2: CAPTURE SCREEN -->
    <div id="screen-capture" class="hidden space-y-6">
      
      <!-- Patient Header Card -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex justify-between items-center">
        <div>
          <h2 id="cap-patient-name" class="text-lg font-bold text-slate-900">Eleanor Vance</h2>
          <p id="cap-patient-sub" class="text-xs text-slate-500">MRN #RH-8842 • Female, 58y</p>
        </div>
        <button onclick="openAddPatientModal()" class="px-3 py-1.5 text-xs font-semibold text-[#0061A4] bg-[#D1E4FF] hover:bg-[#b8d5ff] rounded-lg">
          Add New Patient
        </button>
      </div>

      <!-- Camera Acquisition Card -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl mx-auto space-y-5">
        <div>
          <h3 class="text-base font-bold text-slate-900">Fundus Image Acquisition</h3>
          <p class="text-xs text-slate-500">Align digital ophthalmoscope reticle or upload retinal imagery for automated analysis.</p>
        </div>

        <div class="border-2 border-dashed border-slate-300 hover:border-[#0061A4] rounded-xl p-10 text-center cursor-pointer bg-slate-50/60 transition" onclick="document.getElementById('file-upload').click()">
          <input type="file" id="file-upload" class="hidden" accept="image/*" onchange="handleImageUpload(event)">
          <div class="w-14 h-14 rounded-full bg-[#D1E4FF] text-[#0061A4] flex items-center justify-center mx-auto mb-3">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <p class="text-sm font-bold text-slate-800">Select or drop retinal fundus photography</p>
          <p class="text-xs text-slate-500 mt-1">Supports high-res TIFF, PNG, JPEG, DICOM</p>
        </div>

        <!-- Optical Alignment Verification -->
        <div class="grid grid-cols-3 gap-3">
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span class="text-[11px] text-slate-500 block">Focus Metric</span>
            <span class="text-xs font-bold text-[#1B6C30]">Sharp Focus (1.02)</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span class="text-[11px] text-slate-500 block">Illumination</span>
            <span class="text-xs font-bold text-[#1B6C30]">Optimal (0.94)</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span class="text-[11px] text-slate-500 block">Quality Score</span>
            <span class="text-xs font-bold text-[#0061A4]">98 / 100</span>
          </div>
        </div>

      </div>
    </div>

    <!-- TAB 3: COMPARE SCREEN -->
    <div id="screen-compare" class="hidden space-y-6">
      
      <div>
        <h2 class="text-lg font-bold text-slate-900">Grad-CAM Activation & Raw Fundus Comparison</h2>
        <p class="text-xs text-slate-500">Visualize model attention weights against standard fundus baseline.</p>
      </div>

      <!-- Critical Finding Callout Card -->
      <div id="compare-alert-card" class="bg-[#FFDAD6] border border-[#ffb4ab] rounded-xl p-4 text-[#410002] flex items-start space-x-3">
        <svg class="w-5 h-5 text-[#BA1A1A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <div>
          <h4 id="alert-title" class="font-bold text-xs text-[#410002]">Critical Finding • Urgent</h4>
          <p id="alert-desc" class="text-xs text-[#410002]/90 mt-0.5 leading-relaxed">
            AI identifies high concentration of cotton wool spots in the macular region, suggesting urgent review.
          </p>
        </div>
      </div>

      <!-- Split Viewer Comparison -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <span class="text-xs font-bold text-slate-700 block">Raw Fundus Optical Photography</span>
          <div class="w-full h-80 bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <img id="compare-raw-img" src="${FUNDUS_OS_URL}" alt="Raw Fundus" class="max-h-full max-w-full object-contain">
          </div>
          <p class="text-[11px] text-slate-500">Original 45° macular field without diagnostic augmentation.</p>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <span class="text-xs font-bold text-[#0061A4] block">Grad-CAM Neural Attention Heatmap</span>
          <div class="w-full h-80 bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <img src="${HEATMAP_URL}" alt="Grad-CAM Activation" class="max-h-full max-w-full object-contain">
          </div>
          <p class="text-[11px] text-slate-500">Highlights localized microvascular features weighting classification.</p>
        </div>

      </div>

    </div>

    <!-- TAB 4: REPORT SCREEN -->
    <div id="screen-report" class="hidden space-y-6">
      
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-4xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="flex justify-between items-start border-b border-slate-200 pb-5">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Ophthalmic Diagnostic Report</h2>
            <p class="text-xs text-slate-500 mt-0.5">Automated Clinical Decision Support • Study Date: <span id="rep-study-date">2026-09-02 08:30 EST</span></p>
          </div>
          <span class="text-xs font-bold bg-[#D1E4FF] text-[#0061A4] px-3 py-1.5 rounded-lg">
            CONFIRMED STUDY
          </span>
        </div>

        <!-- Clinical Details Grid -->
        <div class="grid grid-cols-2 gap-6 text-xs">
          <div class="space-y-2">
            <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider">Patient Demographics</h4>
            <p><strong class="text-slate-600">Name:</strong> <span id="rep-pname" class="text-slate-900 font-semibold">Eleanor Vance</span></p>
            <p><strong class="text-slate-600">MRN:</strong> <span id="rep-mrn" class="text-slate-900 font-mono">RH-8842</span></p>
            <p><strong class="text-slate-600">Age / Gender:</strong> <span id="rep-age">58 / Female</span></p>
            <p><strong class="text-slate-600">Diabetic History:</strong> <span id="rep-dur">12 Years</span></p>
          </div>

          <div class="space-y-2">
            <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider">Clinical Vitals</h4>
            <p><strong class="text-slate-600">HbA1c:</strong> <span id="rep-hba1c" class="font-bold text-[#BA1A1A]">8.4%</span></p>
            <p><strong class="text-slate-600">Blood Pressure:</strong> <span id="rep-bp">138/86 mmHg</span></p>
            <p><strong class="text-slate-600">Examined Eye:</strong> <span id="rep-eye">Left Eye (OS)</span></p>
            <p><strong class="text-slate-600">Image Quality:</strong> <span class="text-[#1B6C30] font-semibold">98% (Optimal)</span></p>
          </div>
        </div>

        <!-- Diagnosis Box -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Diagnosis</span>
          <h4 id="rep-diagnosis" class="text-base font-bold text-[#0061A4]">Grade 3: Moderate Nonproliferative Diabetic Retinopathy</h4>
          <p id="rep-action" class="text-xs text-slate-600 mt-1">Dilated specialist evaluation within 14 days and OCT scan to rule out macular edema.</p>
        </div>

        <!-- Clinical Notes Editable -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-800">Physician Clinical Notes</label>
          <textarea id="clinical-notes-input" rows="4" class="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0061A4]">Patient presents for annual diabetic eye screening. Visual acuity is 20/30 in OS and 20/20 in OD. No previous laser therapy or anti-VEGF injections. AI detection marks multiple high-confidence vascular lesions in left eye.</textarea>
        </div>

        <!-- Report Buttons -->
        <div class="flex justify-end space-x-3 pt-3 border-t border-slate-200">
          <button onclick="window.print()" class="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition">
            Print Report
          </button>
          <button onclick="openReferralDialog()" class="px-5 py-2 bg-[#0061A4] hover:bg-[#004d84] text-white text-xs font-bold rounded-lg shadow-sm transition">
            Refer to Specialist
          </button>
        </div>

      </div>

    </div>

  </main>

  <!-- Specialist Referral Dialog -->
  <div id="referral-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200">
      <div class="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 class="text-base font-bold text-slate-900">Specialist Referral Dispatch</h3>
        <button onclick="closeReferralDialog()" class="text-slate-400 hover:text-slate-700 text-lg font-bold">&times;</button>
      </div>

      <p class="text-xs text-slate-600">Select retina sub-specialist for immediate consultation:</p>

      <div class="space-y-2">
        <div onclick="dispatchReferral('Dr. Sarah Vance, MD')" class="p-3 rounded-lg border border-slate-200 hover:border-[#0061A4] hover:bg-slate-50 cursor-pointer transition">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-xs font-bold text-slate-900 block">Dr. Sarah Vance, MD</span>
              <span class="text-[11px] text-slate-500 block">Vitreoretinal Surgeon • Metro Eye Institute</span>
            </div>
            <span class="text-xs text-[#0061A4] font-bold">Select &rarr;</span>
          </div>
        </div>

        <div onclick="dispatchReferral('Dr. James Chen, MD, PhD')" class="p-3 rounded-lg border border-slate-200 hover:border-[#0061A4] hover:bg-slate-50 cursor-pointer transition">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-xs font-bold text-slate-900 block">Dr. James Chen, MD, PhD</span>
              <span class="text-[11px] text-slate-500 block">Director of Diabetic Retinopathy Research • Univ Ophthalmic</span>
            </div>
            <span class="text-xs text-[#0061A4] font-bold">Select &rarr;</span>
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-200 flex justify-end">
        <button onclick="closeReferralDialog()" class="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg">Cancel</button>
      </div>
    </div>
  </div>

  <!-- Add Patient Dialog -->
  <div id="add-patient-modal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
      <div class="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 class="text-base font-bold text-slate-900">Add New Patient</h3>
        <button onclick="closeAddPatientModal()" class="text-slate-400 hover:text-slate-700 text-lg font-bold">&times;</button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-medium text-slate-700 mb-1">Full Name</label>
          <input type="text" id="new-patient-name" placeholder="e.g. Robert Hansen" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0061A4] focus:outline-none">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-medium text-slate-700 mb-1">MRN Number</label>
            <input type="text" id="new-patient-mrn" placeholder="RH-5520" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0061A4] focus:outline-none">
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Age</label>
            <input type="number" id="new-patient-age" placeholder="62" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0061A4] focus:outline-none">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-medium text-slate-700 mb-1">HbA1c</label>
            <input type="text" id="new-patient-hba1c" placeholder="7.8%" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0061A4] focus:outline-none">
          </div>
          <div>
            <label class="block font-medium text-slate-700 mb-1">Blood Pressure</label>
            <input type="text" id="new-patient-bp" placeholder="130/84 mmHg" class="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0061A4] focus:outline-none">
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-200 flex justify-end space-x-2">
        <button onclick="closeAddPatientModal()" class="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg">Cancel</button>
        <button onclick="saveNewPatient()" class="px-4 py-2 bg-[#0061A4] text-white text-xs font-bold rounded-lg shadow-sm">Save Patient</button>
      </div>
    </div>
  </div>

  <script>
    const patients = ${JSON.stringify(PATIENTS)};
    let activePatient = patients[0];
    let selectedLesionId = null;
    let selectedFilter = 'ALL';
    let currentEye = 'OS';

    function renderScreen() {
      // Top badge
      document.getElementById('top-patient-badge').textContent = activePatient.name + ' • MRN ' + activePatient.patientIdNumber;
      
      // Analysis view
      document.getElementById('diag-title').textContent = activePatient.diagnosisName;
      document.getElementById('diag-subtitle').textContent = activePatient.retinalGradeLabel;
      document.getElementById('diag-conf-badge').textContent = activePatient.overallConfidence + '% Confidence';
      document.getElementById('eye-badge').textContent = currentEye === 'OS' ? 'Left Eye (OS)' : 'Right Eye (OD)';
      document.getElementById('fundus-img').src = currentEye === 'OS' ? activePatient.leftEye.imageUrl : activePatient.rightEye.imageUrl;

      // Render Bounding Boxes
      renderBoxes();
      renderLesionCards();

      // Capture Screen
      document.getElementById('cap-patient-name').textContent = activePatient.name;
      document.getElementById('cap-patient-sub').textContent = 'MRN #' + activePatient.patientIdNumber + ' • ' + activePatient.gender + ', ' + activePatient.age + 'y';

      // Compare Screen
      if (activePatient.criticalFinding) {
        document.getElementById('alert-title').textContent = activePatient.criticalFinding.title + ' • ' + activePatient.criticalFinding.urgency;
        document.getElementById('alert-desc').textContent = activePatient.criticalFinding.description;
        document.getElementById('compare-alert-card').classList.remove('hidden');
      } else {
        document.getElementById('compare-alert-card').classList.add('hidden');
      }

      // Report Screen
      document.getElementById('rep-study-date').textContent = activePatient.studyDate;
      document.getElementById('rep-pname').textContent = activePatient.name;
      document.getElementById('rep-mrn').textContent = activePatient.patientIdNumber;
      document.getElementById('rep-age').textContent = activePatient.age + ' / ' + activePatient.gender;
      document.getElementById('rep-dur').textContent = activePatient.diabeticHistoryYears + ' Years';
      document.getElementById('rep-hba1c').textContent = activePatient.hba1c;
      document.getElementById('rep-bp').textContent = activePatient.bloodPressure;
      document.getElementById('rep-eye').textContent = currentEye === 'OS' ? 'Left Eye (OS)' : 'Right Eye (OD)';
      document.getElementById('rep-diagnosis').textContent = activePatient.retinalGradeLabel;
      document.getElementById('rep-action').textContent = activePatient.criticalFinding ? activePatient.criticalFinding.actionNeeded : 'Maintain routine annual screening.';
      document.getElementById('clinical-notes-input').value = activePatient.clinicalNotes;
    }

    function getFilteredLesions() {
      if (selectedFilter === 'ALL') return activePatient.lesions;
      return activePatient.lesions.filter(l => l.shortCode === selectedFilter || l.type === selectedFilter);
    }

    function renderBoxes() {
      const container = document.getElementById('lesion-boxes-container');
      const lesions = getFilteredLesions();
      container.innerHTML = lesions.map(l => {
        const isSel = l.id === selectedLesionId;
        return \`
          <div 
            onclick="selectLesion('\${l.id}')"
            class="lesion-box \${isSel ? 'selected' : ''}"
            style="left: \${l.leftPct}%; top: \${l.topPct}%; width: \${l.widthPct}%; height: \${l.heightPct}%;">
            <span class="lesion-badge">\${l.shortCode}</span>
          </div>
        \`;
      }).join('');
    }

    function renderLesionCards() {
      const container = document.getElementById('lesion-cards-container');
      const lesions = getFilteredLesions();
      document.getElementById('pathology-heading').textContent = 'Detected Pathologies (' + lesions.length + ')';

      container.innerHTML = lesions.map(l => {
        const isSel = l.id === selectedLesionId;
        return \`
          <div 
            onclick="selectLesion('\${l.id}')"
            class="p-3 rounded-lg border transition cursor-pointer flex justify-between items-center \${isSel ? 'bg-[#D1E4FF]/60 border-[#0061A4]' : 'bg-white border-slate-200 hover:bg-slate-50'}">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-bold text-slate-900">\${l.name} (\${l.shortCode})</span>
                <span class="text-[10px] px-2 py-0.5 rounded font-semibold \${l.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}">\${l.severity}</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5">\${l.description}</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-[#0061A4]">\${l.confidence}%</span>
              <span class="text-[10px] text-slate-400 block">Confidence</span>
            </div>
          </div>
        \`;
      }).join('');
    }

    function selectLesion(id) {
      selectedLesionId = selectedLesionId === id ? null : id;
      renderBoxes();
      renderLesionCards();
    }

    function filterPathology(code) {
      selectedFilter = code;
      ['ALL', 'MA', 'HEM', 'CWS', 'HEX'].forEach(c => {
        const btn = document.getElementById('chip-' + c);
        if (btn) {
          if (c === code) {
            btn.className = 'chip-btn px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0061A4] text-white transition';
          } else {
            btn.className = 'chip-btn px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition';
          }
        }
      });
      renderBoxes();
      renderLesionCards();
    }

    function toggleGrid(show) {
      document.getElementById('grid-overlay').style.display = show ? 'block' : 'none';
    }

    function selectEye(eye) {
      currentEye = eye;
      document.getElementById('btn-select-os').className = eye === 'OS' ? 'text-xs px-2.5 py-1 rounded font-bold bg-[#0061A4] text-white' : 'text-xs px-2.5 py-1 rounded font-medium bg-slate-100 text-slate-700 hover:bg-slate-200';
      document.getElementById('btn-select-od').className = eye === 'OD' ? 'text-xs px-2.5 py-1 rounded font-bold bg-[#0061A4] text-white' : 'text-xs px-2.5 py-1 rounded font-medium bg-slate-100 text-slate-700 hover:bg-slate-200';
      renderScreen();
    }

    function navigate(tab) {
      ['analysis', 'capture', 'compare', 'report'].forEach(t => {
        const screen = document.getElementById('screen-' + t);
        const nav = document.getElementById('nav-' + t);
        if (t === tab) {
          screen.classList.remove('hidden');
          nav.className = 'px-4 py-2 rounded-lg text-xs font-bold transition bg-[#D1E4FF] text-[#001D36] flex items-center space-x-2';
        } else {
          screen.classList.add('hidden');
          nav.className = 'px-4 py-2 rounded-lg text-xs font-medium transition text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center space-x-2';
        }
      });
    }

    function switchPatient(id) {
      activePatient = patients.find(p => p.id === id) || patients[0];
      selectedLesionId = null;
      renderScreen();
    }

    function confirmDiagnosis() {
      alert('Diagnosis confirmed for ' + activePatient.name + '. Report filed into Electronic Health Record (EHR).');
    }

    function flagReview() {
      alert('Study for ' + activePatient.name + ' flagged for priority vitreoretinal review queue.');
    }

    function openReferralDialog() {
      document.getElementById('referral-modal').classList.remove('hidden');
    }

    function closeReferralDialog() {
      document.getElementById('referral-modal').classList.add('hidden');
    }

    function dispatchReferral(doctorName) {
      alert('Referral order transmitted to ' + doctorName + ' with full retinal imaging packet and Grad-CAM telemetry.');
      closeReferralDialog();
    }

    function openAddPatientModal() {
      document.getElementById('add-patient-modal').classList.remove('hidden');
    }

    function closeAddPatientModal() {
      document.getElementById('add-patient-modal').classList.add('hidden');
    }

    function saveNewPatient() {
      const name = document.getElementById('new-patient-name').value.trim();
      const mrn = document.getElementById('new-patient-mrn').value.trim();
      const age = parseInt(document.getElementById('new-patient-age').value) || 50;
      const hba1c = document.getElementById('new-patient-hba1c').value.trim() || '7.5%';
      const bp = document.getElementById('new-patient-bp').value.trim() || '120/80 mmHg';

      if (!name || !mrn) {
        alert('Please enter patient name and MRN.');
        return;
      }

      const newP = {
        id: 'pt-' + Date.now(),
        patientIdNumber: mrn,
        name: name,
        age: age,
        gender: 'Patient',
        dob: '1970-01-01',
        diabeticHistoryYears: 8,
        hba1c: hba1c,
        bloodPressure: bp,
        studyDate: '2026-09-05 08:00 EST',
        activeEye: 'OS',
        diagnosisName: 'Mild NPDR',
        retinalGrade: 1,
        retinalGradeLabel: 'Grade 1: Mild Nonproliferative Diabetic Retinopathy',
        overallConfidence: 91,
        leftEye: activePatient.leftEye,
        rightEye: activePatient.rightEye,
        lesions: [
          { id: 'an-new-1', name: 'Microaneurysms', shortCode: 'MA', type: 'microaneurysm', leftPct: 35, topPct: 40, widthPct: 8, heightPct: 8, confidence: 90, severity: 'Review', color: '#BA1A1A', description: 'Early capillary dilation.' }
        ],
        criticalFinding: null,
        clinicalNotes: 'Initial scan for newly admitted patient.',
        isConfirmed: false,
        isFlagged: false
      };

      patients.push(newP);
      const sel = document.getElementById('patient-selector');
      const opt = document.createElement('option');
      opt.value = newP.id;
      opt.textContent = newP.name + ' (' + newP.patientIdNumber + ')';
      sel.appendChild(opt);
      sel.value = newP.id;
      switchPatient(newP.id);
      closeAddPatientModal();
    }

    function handleImageUpload(e) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(evt) {
          const imgUrl = evt.target.result;
          activePatient.imageUrl = imgUrl;
          const fundusImg = document.getElementById('fundus-img');
          if (fundusImg) fundusImg.src = imgUrl;
          const compareRawImg = document.getElementById('compare-raw-img');
          if (compareRawImg) compareRawImg.src = imgUrl;
          
          alert('Retinal scan "' + file.name + '" ingested! Focus: 1.02 (Sharp), Illumination: 0.95 (Optimal). Navigating to Analysis screen.');
          navigate('analysis');
        };
        reader.readAsDataURL(file);
      }
    }

    // Initialize
    renderScreen();
  </script>
</body>
</html>`;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`RetinaScan AI web companion running on http://0.0.0.0:${PORT}`);
});
