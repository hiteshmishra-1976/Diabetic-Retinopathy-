import { useState } from 'react';
import { PatientRecord, AnomalyItem, TabType } from '../types';

interface AnalysisScreenProps {
  patient: PatientRecord;
  onUpdatePatient: (updated: PatientRecord) => void;
  onNavigate: (tab: TabType) => void;
}

export function AnalysisScreen({
  patient,
  onUpdatePatient,
  onNavigate,
}: AnalysisScreenProps) {
  const [showGrid, setShowGrid] = useState(false);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [activeEye, setActiveEye] = useState<'OS' | 'OD'>(patient.activeEye);
  const [confirmationToast, setConfirmationToast] = useState<string | null>(null);

  const currentScan = activeEye === 'OS' ? patient.leftEye : patient.rightEye;

  const handleConfirmDiagnosis = () => {
    onUpdatePatient({
      ...patient,
      isConfirmed: true,
      isFlagged: false,
    });
    setConfirmationToast('Diagnosis confirmed by clinician. Record updated.');
    setTimeout(() => setConfirmationToast(null), 3500);
  };

  const handleFlagForReview = () => {
    onUpdatePatient({
      ...patient,
      isFlagged: true,
      isConfirmed: false,
    });
    setConfirmationToast('Scan flagged for senior retina specialist review.');
    setTimeout(() => setConfirmationToast(null), 3500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12">
      {/* Toast Notification */}
      {confirmationToast && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-on-primary px-4 py-3 rounded-lg shadow-xl border border-primary-fixed flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <span className="font-label-lg text-sm">{confirmationToast}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-outline-variant pb-6 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('capture')}
            className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors text-on-surface"
            title="Back to Capture"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface">
              Analysis Results
            </h1>
            <p className="text-sm text-on-surface-variant">
              Patient ID: #{patient.patientIdNumber} • {patient.name} • {activeEye === 'OS' ? 'Left Eye (OS)' : 'Right Eye (OD)'}
            </p>
          </div>
        </div>

        {/* View Controls: Eye Switcher + Coordinate Grid Toggle */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Eye Switcher */}
          <div className="inline-flex rounded-lg border border-outline-variant p-1 bg-surface-container-low">
            <button
              onClick={() => setActiveEye('OS')}
              className={`px-3 py-1 text-xs md:text-sm font-label-lg rounded ${
                activeEye === 'OS'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              OS (Left)
            </button>
            <button
              onClick={() => setActiveEye('OD')}
              className={`px-3 py-1 text-xs md:text-sm font-label-lg rounded ${
                activeEye === 'OD'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              OD (Right)
            </button>
          </div>

          {/* Coordinate Grid Toggle */}
          <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
            <label htmlFor="grid-toggle-switch" className="font-label-lg text-xs md:text-sm text-on-surface cursor-pointer select-none">
              Show Coordinate Grid
            </label>
            <button
              id="grid-toggle-switch"
              role="switch"
              aria-checked={showGrid}
              onClick={() => setShowGrid(!showGrid)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                showGrid ? 'bg-primary' : 'bg-surface-variant'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-surface-container-lowest transition-transform ${
                  showGrid ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Fundus Scan Viewer with Overlays (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Image Canvas Box */}
          <div className="relative w-full aspect-square md:aspect-[4/3] bg-black rounded-xl border-2 border-outline overflow-hidden shadow-sm flex items-center justify-center">
            {/* Base Retinal Fundus Photo */}
            <img
              src={currentScan.imageUrl}
              alt="Retinal fundus scan with diagnostic markers"
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
            />

            {/* Coordinate Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 w-full h-full grid-overlay pointer-events-none z-10 opacity-70">
                <div className="absolute top-2 left-2 text-[10px] font-mono text-primary-fixed bg-black/60 px-1 rounded">
                  Origin (0,0) - Scale: 100μm/div
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] font-mono text-primary-fixed bg-black/60 px-1 rounded">
                  800 x 800 px Matrix
                </div>
              </div>
            )}

            {/* Bounding Box Overlays (Synchronized with anomaly items) */}
            <div className="absolute inset-0 w-full h-full pointer-events-auto z-20">
              {patient.lesions.map((lesion) => {
                const isSelected = selectedAnomalyId === lesion.id;
                return (
                  <div
                    key={lesion.id}
                    onClick={() => setSelectedAnomalyId(isSelected ? null : lesion.id)}
                    className={`absolute cursor-pointer transition-all ${
                      isSelected ? 'ring-4 ring-primary ring-offset-1 scale-105 z-30' : 'hover:scale-105'
                    }`}
                    style={{
                      top: `${lesion.coordinates.topPct}%`,
                      left: `${lesion.coordinates.leftPct}%`,
                      width: `${lesion.coordinates.widthPct}%`,
                      height: `${lesion.coordinates.heightPct}%`,
                      border: `2px solid ${lesion.color}`,
                      backgroundColor: isSelected ? 'rgba(0, 82, 39, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {/* Bounding Box Label Tag */}
                    <div
                      className="absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap shadow-md flex items-center gap-1"
                      style={{ backgroundColor: lesion.color }}
                    >
                      <span>{lesion.shortCode || lesion.name}</span>
                      <span className="text-[9px] opacity-90">{lesion.confidence}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Inspection Toolbar under Scan */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">info</span>
              <span>Click on any bounding box or card below to highlight and inspect coordinates.</span>
            </div>
            {selectedAnomalyId && (
              <button
                onClick={() => setSelectedAnomalyId(null)}
                className="text-primary font-bold hover:underline"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* Right: Diagnostic Summary Card (5 cols on large screens) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Diagnostic Summary Panel (Matching HTML #1 / Image 1.jpeg) */}
          <div className="bg-surface-container-lowest rounded-xl border-2 border-outline p-6 flex flex-col gap-6 shadow-xs">
            {/* Header / Primary Diagnosis */}
            <div className="border-b-2 border-outline pb-4">
              <div className="inline-flex items-center gap-2 text-on-surface mb-1.5">
                <span className="material-symbols-outlined text-base text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  visibility
                </span>
                <span className="font-label-lg text-xs md:text-sm font-bold tracking-wide uppercase text-on-surface-variant">
                  Macula-Centered Fundus Photo
                </span>
              </div>
              <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-secondary">
                {patient.diagnosisName}
              </h2>
              <span className="text-xs text-on-surface-variant font-medium mt-1 block">
                {patient.retinalGradeLabel}
              </span>
            </div>

            {/* AI Confidence Meter */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="font-body-md text-sm md:text-base font-medium text-on-surface">
                  AI Diagnostic Confidence
                </span>
                <span className="font-headline-md text-xl md:text-2xl font-bold text-primary">
                  {patient.overallConfidence}%
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-4 overflow-hidden border border-outline">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${patient.overallConfidence}%` }}
                />
              </div>
            </div>

            {/* Detected Lesion Pills */}
            <div className="flex flex-col gap-3">
              <h3 className="font-headline-md text-base md:text-lg font-bold text-on-surface">
                Key Detected Lesions
              </h3>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-outline">
                  <span className="font-body-md text-xs md:text-sm text-on-surface font-medium">Microaneurysms</span>
                  <span className="font-label-lg text-xs font-bold text-primary">88%</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-outline">
                  <span className="font-body-md text-xs md:text-sm text-on-surface font-medium">Hard Exudates</span>
                  <span className="font-label-lg text-xs font-bold text-primary">91%</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-outline">
                  <span className="font-body-md text-xs md:text-sm text-on-surface font-medium">Cotton Wool Spots</span>
                  <span className="font-label-lg text-xs font-bold text-primary">85%</span>
                </div>
              </div>
            </div>

            {/* Confirmation / Review Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-outline-variant">
              <button
                onClick={handleConfirmDiagnosis}
                className={`flex-1 font-label-lg text-sm h-12 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  patient.isConfirmed
                    ? 'bg-status-success text-white ring-2 ring-status-success'
                    : 'bg-primary text-on-primary hover:bg-primary-fixed hover:text-on-primary-fixed'
                }`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  edit_document
                </span>
                {patient.isConfirmed ? 'Diagnosis Confirmed ✓' : 'Confirm Diagnosis'}
              </button>

              <button
                onClick={handleFlagForReview}
                className={`flex-1 font-label-lg text-sm h-12 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  patient.isFlagged
                    ? 'bg-error text-white ring-2 ring-error'
                    : 'bg-transparent border-2 border-primary text-primary hover:bg-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-lg">flag</span>
                {patient.isFlagged ? 'Flagged for Senior Review' : 'Flag for Review'}
              </button>
            </div>

            {/* Quick Navigation link to Compare */}
            <button
              onClick={() => onNavigate('compare')}
              className="w-full text-center text-xs text-primary font-bold hover:underline flex items-center justify-center gap-1 mt-1"
            >
              <span>View Grad-CAM AI Heatmap Side-by-Side</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detected Anomalies Detailed List (Matching HTML #3 / Image 5.jpeg) */}
      <section className="mt-10">
        <h2 className="font-headline-md text-xl md:text-2xl font-bold text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            manage_search
          </span>
          Detected Anomalies ({patient.lesions.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {patient.lesions.map((lesion) => {
            const isSelected = selectedAnomalyId === lesion.id;
            return (
              <div
                key={lesion.id}
                onClick={() => setSelectedAnomalyId(isSelected ? null : lesion.id)}
                className={`bg-surface-container-lowest rounded-lg border flex flex-col relative overflow-hidden transition-all cursor-pointer shadow-xs p-5 gap-3 ${
                  isSelected
                    ? 'border-2 border-primary ring-2 ring-primary/30 bg-surface-container-low'
                    : 'border-outline-variant hover:border-primary'
                }`}
              >
                {/* Critical / Review Status Badge */}
                <div className="absolute top-3 right-3">
                  {lesion.severity === 'Critical' ? (
                    <div className="bg-error-container border border-error text-error px-2 py-0.5 rounded text-[10px] font-label-lg flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[12px]">warning</span> Critical
                    </div>
                  ) : (
                    <div className="bg-secondary-container border border-secondary text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-label-lg flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[12px]">info</span> Review
                    </div>
                  )}
                </div>

                {/* Title & Icon */}
                <div className="flex items-center gap-2.5 pr-16">
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ color: lesion.color }}
                  >
                    {lesion.iconName}
                  </span>
                  <h3 className="font-headline-md text-base md:text-lg font-bold text-on-surface">
                    {lesion.name}
                  </h3>
                </div>

                {/* Precise Bounding Box Coordinates */}
                <div className="font-body-md text-on-surface-variant text-xs">
                  Coordinates:{' '}
                  <span className="text-on-surface font-mono bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant">
                    [X: {lesion.coordinates.x}, Y: {lesion.coordinates.y}, W: {lesion.coordinates.w}, H: {lesion.coordinates.h}]
                  </span>
                </div>

                {/* Description if available */}
                {lesion.description && (
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {lesion.description}
                  </p>
                )}

                {/* Confidence Bar */}
                <div className="mt-auto pt-2">
                  <div className="flex justify-between font-label-lg text-xs mb-1 text-on-surface">
                    <span>Confidence</span>
                    <span className="text-primary font-bold">{lesion.confidence}%</span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${lesion.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
