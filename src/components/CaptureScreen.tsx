import { useState } from 'react';
import { PatientRecord, TabType } from '../types';

interface CaptureScreenProps {
  patient: PatientRecord;
  onUpdatePatient: (updated: PatientRecord) => void;
  onNavigate: (tab: TabType) => void;
  onOpenUploadModal: (eye: 'OS' | 'OD') => void;
  onOpenAddPatient?: () => void;
}

export function CaptureScreen({
  patient,
  onNavigate,
  onOpenUploadModal,
  onOpenAddPatient,
}: CaptureScreenProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisStep('Pre-processing macula-centered fundus scans...');

    setTimeout(() => {
      setAnalysisProgress(45);
      setAnalysisStep('Segmenting retinal vasculature & optic disc...');
    }, 600);

    setTimeout(() => {
      setAnalysisProgress(80);
      setAnalysisStep('Detecting microvascular lesions & Grad-CAM activations...');
    }, 1200);

    setTimeout(() => {
      setAnalysisProgress(100);
      setAnalysisStep('Generating ICDR diagnostic classification...');
    }, 1800);

    setTimeout(() => {
      setIsAnalyzing(false);
      onNavigate('analysis');
    }, 2200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12">
      {/* Patient Intake Header Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-outline-variant pb-6 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface">
              Patient Intake & Image Capture
            </h1>
            <span className="bg-primary/10 border border-primary text-primary px-2.5 py-0.5 rounded text-xs font-bold">
              Active Session
            </span>
          </div>
          <p className="text-sm md:text-base text-on-surface-variant mt-1">
            Patient: <strong className="text-on-surface">{patient.name}</strong> • Age: {patient.age} • MRN: #{patient.patientIdNumber} • HbA1c: {patient.hba1c}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="text-xs text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant">
            Study Date: <span className="font-semibold text-on-surface">{patient.studyDate}</span>
          </div>
          {onOpenAddPatient && (
            <button
              onClick={onOpenAddPatient}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary rounded-lg font-bold text-xs hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>New Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Dual Eye Intake Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Eye (OS) Card */}
        <div className="bg-surface-container-lowest rounded-xl flex flex-col relative border-2 border-outline-variant overflow-hidden group hover:border-outline transition-colors shadow-xs">
          {/* Card Header */}
          <div className="p-4 md:p-6 border-b-2 border-outline-variant bg-surface-container-low flex justify-between items-center">
            <div>
              <h2 className="font-headline-md text-xl md:text-2xl font-bold text-on-surface">
                Left Eye (OS)
              </h2>
              <span className="text-xs text-on-surface-variant">Oculus Sinister</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/10 border-2 border-secondary rounded-full px-3 py-1">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <span className="font-label-lg text-xs md:text-sm font-bold text-secondary">
                {patient.leftEye.statusText}
              </span>
            </div>
          </div>

          {/* Card Body / Preview */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative min-h-[300px] md:min-h-[380px] bg-surface-container-lowest">
            {patient.leftEye.imageUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative group">
                <div className="relative w-full aspect-square max-h-[320px] bg-black rounded-lg overflow-hidden border-2 border-outline flex items-center justify-center">
                  <img
                    src={patient.leftEye.imageUrl}
                    alt="Left Eye (OS) Fundus Scan"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white p-4">
                    <button
                      onClick={() => onOpenUploadModal('OS')}
                      className="px-4 py-2 bg-primary text-on-primary rounded font-label-lg text-sm flex items-center gap-2 hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">photo_camera</span>
                      Retake / Replace Image
                    </button>
                    <button
                      onClick={() => onNavigate('analysis')}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded font-label-lg text-sm flex items-center gap-2 hover:bg-white/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">zoom_in</span>
                      View In Analysis
                    </button>
                  </div>
                </div>

                <div className="w-full mt-3 flex justify-between items-center text-xs text-on-surface-variant px-1">
                  <span>Quality Index: <strong className="text-primary">{patient.leftEye.imageQualityScore}%</strong></span>
                  <span>{patient.leftEye.focusMetric}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onOpenUploadModal('OS')}
                className="w-full h-64 md:h-80 border-2 border-dashed border-outline hover:border-primary rounded-lg flex flex-col items-center justify-center gap-4 text-on-surface-variant hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container-lowest hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-6xl text-on-surface group-hover:text-primary transition-colors">
                  photo_camera
                </span>
                <div className="text-center">
                  <span className="font-headline-md text-base md:text-lg font-bold text-on-surface block">
                    Tap to Capture Image
                  </span>
                  <span className="text-xs text-on-surface-variant mt-1 block">
                    Supports 45° - 50° fundus camera or digital file import
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Right Eye (OD) Card */}
        <div className="bg-surface-container-lowest rounded-xl flex flex-col relative border-2 border-outline-variant overflow-hidden group hover:border-outline transition-colors shadow-xs">
          {/* Card Header */}
          <div className="p-4 md:p-6 border-b-2 border-outline-variant bg-surface-container-low flex justify-between items-center">
            <div>
              <h2 className="font-headline-md text-xl md:text-2xl font-bold text-on-surface">
                Right Eye (OD)
              </h2>
              <span className="text-xs text-on-surface-variant">Oculus Dexter</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 border-2 border-primary rounded-full px-3 py-1">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="font-label-lg text-xs md:text-sm font-bold text-primary">
                {patient.rightEye.statusText}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative min-h-[300px] md:min-h-[380px] bg-surface-container-lowest">
            <div className="w-full h-full flex flex-col items-center justify-center relative group">
              <div className="relative w-full aspect-square max-h-[320px] bg-black rounded-lg overflow-hidden border-2 border-primary flex items-center justify-center">
                <img
                  src={patient.rightEye.imageUrl}
                  alt="Right Eye (OD) Fundus Scan"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white p-4">
                  <button
                    onClick={() => onOpenUploadModal('OD')}
                    className="px-4 py-2 bg-primary text-on-primary rounded font-label-lg text-sm flex items-center gap-2 hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">photo_camera</span>
                    Retake Image
                  </button>
                  <button
                    onClick={() => onNavigate('compare')}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded font-label-lg text-sm flex items-center gap-2 hover:bg-white/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                    Compare Scan
                  </button>
                </div>
              </div>

              <div className="w-full mt-3 flex justify-between items-center text-xs text-on-surface-variant px-1">
                <span>Quality Index: <strong className="text-primary">{patient.rightEye.imageQualityScore}%</strong></span>
                <span>{patient.rightEye.illuminationIndex}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Image Acquisition Checklist */}
      <div className="mt-8 bg-surface-container-low rounded-xl p-6 border border-outline-variant">
        <h3 className="font-headline-md text-base md:text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
          Standard Retinal Imaging Protocol
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs md:text-sm text-on-surface-variant">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-base mt-0.5">check</span>
            <span>Ensure 45° field centered on the fovea / macula</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-base mt-0.5">check</span>
            <span>Minimal pupil diameter ≥ 3.5mm without excessive glare</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-base mt-0.5">check</span>
            <span>Automatic focus lock verified (Focus Metric &gt; 0.90)</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button (FAB style) */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-30">
        <button
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
          className="h-14 px-6 md:px-8 bg-primary hover:bg-primary-fixed-dim active:bg-primary text-on-primary rounded-xl font-label-lg text-base md:text-lg flex items-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
              <span>Analyzing Scans ({analysisProgress}%)...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                analytics
              </span>
              <span>Analyze Retinal Images</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Loading Modal Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-md w-full border-2 border-primary shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-primary animate-spin">
                data_usage
              </span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2">
              Deep Learning Diagnostic Analysis
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">{analysisStep}</p>
            <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden border border-outline">
              <div
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <span className="font-bold text-primary mt-2 text-sm">{analysisProgress}% Complete</span>
          </div>
        </div>
      )}
    </div>
  );
}
