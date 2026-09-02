export type TabType = 'capture' | 'analysis' | 'compare' | 'report';

export interface AnomalyItem {
  id: string;
  name: string;
  shortCode?: string;
  type: 'microaneurysm' | 'hemorrhage' | 'hard_exudate' | 'cotton_wool_spot' | 'neovascularization' | 'drusen';
  coordinates: {
    x: number;
    y: number;
    w: number;
    h: number;
    // Normalized percentage for responsive overlay rendering
    topPct: number;
    leftPct: number;
    widthPct: number;
    heightPct: number;
  };
  confidence: number;
  severity: 'Critical' | 'Review' | 'Normal';
  color: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
  description?: string;
}

export interface EyeScanData {
  eye: 'OS' | 'OD';
  eyeLabel: string;
  status: 'Good' | 'Moderate' | 'Severe' | 'Normal' | 'AI Regenerating' | 'Needs Capture';
  statusText: string;
  imageUrl: string;
  heatmapUrl: string;
  capturedAt: string;
  imageQualityScore: number;
  illuminationIndex: string;
  focusMetric: string;
}

export interface PatientRecord {
  id: string;
  patientIdNumber: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  dob: string;
  diabeticHistoryYears: number;
  hba1c: string;
  bloodPressure: string;
  studyDate: string;
  leftEye: EyeScanData;
  rightEye: EyeScanData;
  activeEye: 'OS' | 'OD';
  diagnosisName: string;
  retinalGrade: number; // e.g., 3 for Moderate NPDR
  retinalGradeLabel: string;
  overallConfidence: number;
  lesions: AnomalyItem[];
  criticalFinding: {
    title: string;
    description: string;
    urgency: 'STAT' | 'Urgent' | 'Routine';
    actionNeeded: string;
  };
  clinicalNotes: string;
  isConfirmed: boolean;
  isFlagged: boolean;
  referralStatus?: {
    isReferred: boolean;
    specialistName?: string;
    urgency?: 'STAT' | 'Urgent' | 'Routine';
    referredAt?: string;
    notes?: string;
  };
}

export interface ReferralSubmission {
  id: string;
  patientId: string;
  patientName: string;
  specialistName: string;
  urgency: 'STAT' | 'Urgent' | 'Routine';
  notes: string;
  submittedAt: string;
  status: 'Pending Review' | 'In Review' | 'Accepted';
}
