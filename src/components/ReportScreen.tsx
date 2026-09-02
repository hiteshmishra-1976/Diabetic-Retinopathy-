import { useState } from 'react';
import { PatientRecord } from '../types';

interface ReportScreenProps {
  patient: PatientRecord;
  onOpenReferralModal: () => void;
}

export function ReportScreen({ patient, onOpenReferralModal }: ReportScreenProps) {
  const [isSigned, setIsSigned] = useState(false);
  const [signatureName, setSignatureName] = useState('Dr. J. Henderson, OD');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const handleDownloadPDF = () => {
    setDownloadSuccessToast('Generating clinical diagnostic PDF report...');
    setTimeout(() => {
      window.print();
      setDownloadSuccessToast('PDF Report ready for printing / archive.');
      setTimeout(() => setDownloadSuccessToast(null), 3000);
    }, 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 flex flex-col gap-6">
      {/* Print Toast */}
      {downloadSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-on-primary px-4 py-3 rounded-lg shadow-xl border border-primary-fixed flex items-center gap-3 no-print">
          <span className="material-symbols-outlined text-xl">print</span>
          <span className="font-label-lg text-sm">{downloadSuccessToast}</span>
        </div>
      )}

      {/* Alert Badge (Matching HTML #5 / Image 9.jpeg) */}
      <div className="bg-error-container border border-error rounded-lg p-4 md:p-6 flex items-center gap-4 shadow-xs">
        <span className="material-symbols-outlined text-error text-3xl md:text-4xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
          warning
        </span>
        <div>
          <h2 className="font-headline-md text-xl md:text-2xl font-bold text-error">
            Referral Recommended
          </h2>
          <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-0.5">
            Immediate specialist review advised based on scan results.
          </p>
        </div>
      </div>

      {/* Summary Cards (Matching HTML #5 / Image 9.jpeg) */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {/* Retinal Grade */}
        <div className="bg-surface-container-lowest rounded-lg p-4 md:p-6 border border-outline flex flex-col justify-between shadow-xs">
          <span className="font-label-lg text-xs md:text-sm text-on-surface-variant mb-2">
            Retinal Grade
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-md text-3xl md:text-4xl font-bold text-on-surface">
              {patient.retinalGrade}
            </span>
            <span className="text-xs font-bold text-secondary">Moderate NPDR</span>
          </div>
        </div>

        {/* Detected Lesions */}
        <div className="bg-surface-container-lowest rounded-lg p-4 md:p-6 border border-outline flex flex-col justify-between shadow-xs">
          <span className="font-label-lg text-xs md:text-sm text-on-surface-variant mb-2">
            Detected Lesions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-md text-3xl md:text-4xl font-bold text-on-surface">
              12
            </span>
            <span className="text-xs font-bold text-error">5 Critical Types</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Medical Diagnostic Document */}
      <div className="bg-surface-container-lowest rounded-lg p-6 md:p-8 border border-outline flex flex-col gap-6 shadow-xs">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-outline-variant pb-4 gap-2">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              RetinaScan AI • Official Diagnostic Report
            </span>
            <h3 className="font-headline-md text-xl md:text-2xl font-bold text-on-surface mt-0.5">
              Comprehensive Fundus Screening Summary
            </h3>
          </div>
          <div className="text-right text-xs text-on-surface-variant">
            <div>Report ID: <span className="font-mono font-bold text-on-surface">REP-20260902-8842</span></div>
            <div>Date: <span className="font-medium">{patient.studyDate}</span></div>
          </div>
        </div>

        {/* Patient Demographics Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant text-xs md:text-sm">
          <div>
            <span className="text-on-surface-variant block text-xs">Patient Name</span>
            <strong className="text-on-surface">{patient.name}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant block text-xs">MRN / ID</span>
            <strong className="text-on-surface font-mono">#{patient.patientIdNumber}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant block text-xs">Age / Gender</span>
            <strong className="text-on-surface">{patient.age} yrs / {patient.gender}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant block text-xs">HbA1c / BP</span>
            <strong className="text-on-surface">{patient.hba1c} • {patient.bloodPressure}</strong>
          </div>
        </div>

        {/* Diagnostic Assessment Section */}
        <div className="space-y-3">
          <h4 className="font-headline-md text-base font-bold text-on-surface border-b border-outline-variant pb-1 flex items-center justify-between">
            <span>Clinical Finding & Coding</span>
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
              ICD-10: E11.329
            </span>
          </h4>
          <p className="text-xs md:text-sm text-on-surface leading-relaxed">
            Automated deep-learning evaluation of macula-centered fundus photo (OS) confirms presence of{' '}
            <strong>Moderate Nonproliferative Diabetic Retinopathy</strong> with <strong>94% algorithmic confidence</strong>.
            Focal clusters of microaneurysms, dot hemorrhages, and cotton wool spots are detected predominantly in the paramacular and inferonasal arcades.
          </p>
        </div>

        {/* Lesion Breakdown Table */}
        <div className="space-y-2">
          <h4 className="font-headline-md text-base font-bold text-on-surface">
            Lesion Spatial Coordinates & Confidence Scores
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-outline-variant rounded overflow-hidden">
              <thead className="bg-surface-container border-b border-outline-variant text-on-surface font-bold">
                <tr>
                  <th className="p-2.5">Lesion Type</th>
                  <th className="p-2.5">Coordinates [X, Y, W, H]</th>
                  <th className="p-2.5">Confidence</th>
                  <th className="p-2.5">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                {patient.lesions.map((lesion) => (
                  <tr key={lesion.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-2.5 font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm" style={{ color: lesion.color }}>
                        {lesion.iconName}
                      </span>
                      {lesion.name}
                    </td>
                    <td className="p-2.5 font-mono text-on-surface-variant">
                      [{lesion.coordinates.x}, {lesion.coordinates.y}, {lesion.coordinates.w}, {lesion.coordinates.h}]
                    </td>
                    <td className="p-2.5 font-bold text-primary">{lesion.confidence}%</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lesion.severity === 'Critical'
                            ? 'bg-error-container text-error border border-error/50'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {lesion.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actionable Clinical Recommendations */}
        <div className="space-y-2 bg-surface-container-low p-4 rounded-lg border border-outline-variant">
          <h4 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-primary">assignment_turned_in</span>
            Recommended Clinical Management
          </h4>
          <ul className="text-xs md:text-sm text-on-surface-variant space-y-1.5 list-disc list-inside">
            <li>Referral to comprehensive retinal specialist / ophthalmologist within 2–4 weeks.</li>
            <li>Schedule Optical Coherence Tomography (OCT) to rule out subclinical Diabetic Macular Edema (DME).</li>
            <li>Primary Care Physician notification for systemic glycemic optimization (HbA1c target &lt; 7.0%).</li>
            <li>Repeat dilated fundus examination recommended within 6 months.</li>
          </ul>
        </div>

        {/* Electronic Signature Sign-off */}
        <div className="border-t border-outline-variant pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="sign-report-checkbox"
              checked={isSigned}
              onChange={(e) => setIsSigned(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-outline text-primary focus:ring-primary cursor-pointer accent-primary"
            />
            <label htmlFor="sign-report-checkbox" className="text-xs md:text-sm text-on-surface cursor-pointer select-none">
              Clinician Electronic Sign-off:{' '}
              <strong className="text-on-surface">{signatureName}</strong>
            </label>
          </div>

          {isSigned ? (
            <div className="text-xs text-primary font-bold bg-primary/10 border border-primary px-3 py-1 rounded flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span>
              Digitally Signed & Validated
            </div>
          ) : (
            <div className="text-xs text-on-surface-variant italic">
              Pending clinician signature
            </div>
          )}
        </div>
      </div>

      {/* Primary Report Actions (Matching HTML #5 / Image 9.jpeg) */}
      <div className="flex flex-col gap-3 mt-2 no-print">
        <button
          onClick={handleDownloadPDF}
          className="w-full h-12 md:h-14 bg-primary text-on-primary font-label-lg text-sm md:text-base rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-colors shadow-xs active:border active:border-outline"
        >
          <span className="material-symbols-outlined text-xl">download</span>
          Download PDF Report
        </button>

        <button
          onClick={onOpenReferralModal}
          className="w-full h-12 md:h-14 bg-surface-container-lowest border-2 border-outline text-on-surface font-label-lg text-sm md:text-base rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors shadow-xs active:bg-surface-container-highest"
        >
          <span className="material-symbols-outlined text-xl">share</span>
          Share to Remote Specialist Queue
        </button>
      </div>
    </div>
  );
}
