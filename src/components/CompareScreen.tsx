import { useState } from 'react';
import { PatientRecord, TabType } from '../types';

interface CompareScreenProps {
  patient: PatientRecord;
  onNavigate: (tab: TabType) => void;
  onOpenReferralModal: () => void;
}

export function CompareScreen({
  patient,
  onNavigate,
  onOpenReferralModal,
}: CompareScreenProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const handleExport = () => {
    setExportToast('Exporting high-resolution DICOM / PDF diagnostic package...');
    setTimeout(() => {
      setExportToast('Diagnostic package exported successfully.');
      setTimeout(() => setExportToast(null), 3000);
    }, 1200);
  };

  const handleShare = () => {
    onOpenReferralModal();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12">
      {/* Toast */}
      {exportToast && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-on-primary px-4 py-3 rounded-lg shadow-xl border border-primary-fixed flex items-center gap-3">
          <span className="material-symbols-outlined text-xl">file_download_done</span>
          <span className="font-label-lg text-sm">{exportToast}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-outline-variant pb-6 mb-6 gap-4">
        <div>
          <h1 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface">
            Analysis Results
          </h1>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant mt-1">
            Patient ID: <strong className="text-on-surface">#{patient.patientIdNumber}</strong> • {patient.name} • {patient.leftEye.eyeLabel}
          </p>
        </div>

        {/* Action Buttons & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-outline-variant p-1 bg-surface-container-low">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 text-xs font-label-lg rounded flex items-center gap-1.5 ${
                viewMode === 'side-by-side'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm">view_column</span>
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 text-xs font-label-lg rounded flex items-center gap-1.5 ${
                viewMode === 'slider'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-sm">compare</span>
              Split Overlay Slider
            </button>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 border-2 border-outline text-on-surface font-label-lg text-sm rounded hover:bg-surface-container-low transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 bg-primary text-on-primary font-label-lg text-sm rounded hover:bg-primary-fixed-dim transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share
          </button>
        </div>
      </div>

      {/* Comparison Display Area */}
      {viewMode === 'side-by-side' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Card 1: Original Image */}
          <div className="bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col h-full border-2 border-outline shadow-xs">
            <div className="p-3 md:p-4 border-b-2 border-outline flex justify-between items-center bg-surface-container">
              <h3 className="font-label-lg text-sm md:text-base font-bold text-on-surface">
                Original Retina Scan
              </h3>
              <span className="material-symbols-outlined text-on-surface-variant" title="High Resolution Available">
                image
              </span>
            </div>
            <div className="relative w-full aspect-square md:aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={patient.rightEye.imageUrl}
                alt="Original Retina Scan"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Card 2: Grad-CAM AI Heatmap */}
          <div className="bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col h-full border-2 border-outline relative shadow-xs">
            {/* Status Badge Overlay */}
            <div className="absolute top-16 right-4 z-10 bg-error-container border-2 border-error text-on-error-container px-3 py-1 rounded font-label-lg text-xs md:text-sm font-bold flex items-center gap-2 shadow-md">
              <span className="material-symbols-outlined text-[16px] animate-pulse">warning</span>
              High Risk Detected
            </div>

            <div className="p-3 md:p-4 border-b-2 border-outline flex justify-between items-center bg-surface-container">
              <h3 className="font-label-lg text-sm md:text-base font-bold text-on-surface">
                Grad-CAM AI Heatmap
              </h3>
              <span className="material-symbols-outlined text-on-surface" title="AI Overlay Active">
                visibility
              </span>
            </div>

            <div className="relative w-full aspect-square md:aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={patient.leftEye.heatmapUrl}
                alt="AI Heatmap Overlay"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </section>
      ) : (
        /* Interactive Split Curtain Slider */
        <section className="bg-surface-container-lowest rounded-lg overflow-hidden border-2 border-outline p-4 mb-6 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <span className="font-label-lg text-sm text-on-surface">
              Curtain Comparison: <strong className="text-primary">{sliderPosition}% Heatmap</strong>
            </span>
            <span className="text-xs text-on-surface-variant">Drag the slider below or move cursor to inspect alignment</span>
          </div>

          <div className="relative w-full aspect-square md:aspect-[16/9] bg-black rounded-lg overflow-hidden border border-outline select-none">
            {/* Base Original Scan */}
            <img
              src={patient.rightEye.imageUrl}
              alt="Original Fundus"
              className="absolute inset-0 w-full h-full object-contain"
              crossOrigin="anonymous"
            />

            {/* Heatmap Clipped Overlay */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src={patient.leftEye.heatmapUrl}
                alt="Heatmap Overlay"
                className="absolute inset-0 w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg border-2 border-white text-xs font-bold">
                ↔
              </div>
            </div>

            {/* Top Labels */}
            <div className="absolute top-3 left-3 z-10 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
              Original Scan
            </div>
            <div className="absolute top-3 right-3 z-10 bg-error/90 text-white px-2 py-1 rounded text-xs font-bold">
              Grad-CAM Heatmap
            </div>
          </div>

          {/* Slider input */}
          <div className="mt-4 px-2">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </section>
      )}

      {/* Intensity Scale Legend */}
      <section className="bg-surface-container-low rounded-lg flex flex-col gap-2 border border-outline-variant p-4 md:p-6 mb-6 shadow-xs">
        <div className="flex justify-between items-center">
          <span className="font-label-lg text-xs md:text-sm font-bold text-on-surface-variant">
            Intensity Scale
          </span>
          <span className="font-label-lg text-xs md:text-sm font-bold text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">info</span>
            AI Confidence Threshold: {patient.overallConfidence}%
          </span>
        </div>
        <div className="w-full h-4 rounded-full heatmap-gradient border border-outline-variant" />
        <div className="flex justify-between font-label-lg text-xs md:text-sm font-bold text-on-surface">
          <span>Normal (Low Risk)</span>
          <span className="text-error">High Risk (Anomalies)</span>
        </div>
      </section>

      {/* Clinical Explanation Card (Matching HTML #2 / Image 3.jpeg) */}
      <section className="bg-surface-container-lowest border-l-4 border-error rounded-r-lg flex flex-col sm:flex-row gap-4 sm:gap-6 items-start shadow-xs border border-outline-variant p-6 md:p-8">
        <div className="bg-error-container p-3 rounded-full shrink-0">
          <span className="material-symbols-outlined text-on-error-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            medical_information
          </span>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <h4 className="font-headline-md text-xl font-bold text-error">
            {patient.criticalFinding.title}
          </h4>
          <p className="font-body-lg text-sm md:text-base text-on-surface leading-relaxed">
            {patient.criticalFinding.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('report')}
              className="bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded font-label-lg text-xs md:text-sm border border-outline-variant transition-colors"
            >
              View Detailed Report
            </button>
            <button
              onClick={onOpenReferralModal}
              className="bg-error text-on-error hover:bg-error/90 px-4 py-2.5 rounded font-label-lg text-xs md:text-sm transition-colors flex items-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add_alert</span>
              Flag for Specialist
            </button>
          </div>
        </div>
      </section>

      {/* Historical Data & Analysis Timeline */}
      <div className="relative rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low p-6 mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary animate-spin">data_usage</span>
            <div>
              <span className="font-label-lg text-sm font-bold text-on-surface block">
                Historical Progression Comparison
              </span>
              <span className="text-xs text-on-surface-variant">
                Previous screening (12 months ago): Grade 2 (Mild NPDR) • +22% Lesion Expansion
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="text-primary font-bold text-xs md:text-sm hover:underline"
          >
            Review Longitudinal Chart →
          </button>
        </div>
      </div>
    </div>
  );
}
