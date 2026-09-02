import { useState } from 'react';
import { TabType, PatientRecord } from './types';
import { SAMPLE_PATIENTS } from './data/samplePatients';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { CaptureScreen } from './components/CaptureScreen';
import { AnalysisScreen } from './components/AnalysisScreen';
import { CompareScreen } from './components/CompareScreen';
import { ReportScreen } from './components/ReportScreen';
import { SpecialistReferralModal } from './components/SpecialistReferralModal';
import { ImageUploadModal } from './components/ImageUploadModal';
import { AddPatientModal } from './components/AddPatientModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('analysis');
  const [patients, setPatients] = useState<PatientRecord[]>(SAMPLE_PATIENTS);
  const [currentPatientId, setCurrentPatientId] = useState<string>(SAMPLE_PATIENTS[0].id);
  const [isOffline, setIsOffline] = useState(false);

  // Modals
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [uploadModalState, setUploadModalState] = useState<{ isOpen: boolean; eye: 'OS' | 'OD' }>({
    isOpen: false,
    eye: 'OS',
  });
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentPatient =
    patients.find((p) => p.id === currentPatientId) || patients[0];

  const handleUpdatePatient = (updated: PatientRecord) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleAddPatient = (newPatient: PatientRecord) => {
    setPatients((prev) => [newPatient, ...prev]);
    setCurrentPatientId(newPatient.id);
    setActiveTab('capture');
    setToastMessage(`Patient #${newPatient.patientIdNumber} (${newPatient.name}) registered successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleImageSelected = (eye: 'OS' | 'OD', imageUrl: string) => {
    const updated = { ...currentPatient };
    if (eye === 'OS') {
      updated.leftEye = {
        ...updated.leftEye,
        imageUrl,
        statusText: 'Captured - Analysis Ready',
      };
    } else {
      updated.rightEye = {
        ...updated.rightEye,
        imageUrl,
        statusText: 'Captured - Good',
      };
    }
    handleUpdatePatient(updated);
  };

  const handleReferralSuccess = (specialistName: string, urgency: 'STAT' | 'Urgent' | 'Routine') => {
    const updated = {
      ...currentPatient,
      referralStatus: {
        isReferred: true,
        specialistName,
        urgency,
        referredAt: new Date().toISOString(),
      },
    };
    handleUpdatePatient(updated);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col antialiased selection:bg-primary selection:text-on-primary">
      {/* Top Clinical Application Bar */}
      <TopAppBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patient={currentPatient}
        patients={patients}
        onSelectPatient={(p) => setCurrentPatientId(p.id)}
        onOpenAddPatient={() => setIsAddPatientOpen(true)}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs md:text-sm font-bold animate-fade-in border border-primary-fixed">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pt-16 md:pt-20">
        {activeTab === 'capture' && (
          <CaptureScreen
            patient={currentPatient}
            onUpdatePatient={handleUpdatePatient}
            onNavigate={setActiveTab}
            onOpenUploadModal={(eye) => setUploadModalState({ isOpen: true, eye })}
            onOpenAddPatient={() => setIsAddPatientOpen(true)}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisScreen
            patient={currentPatient}
            onUpdatePatient={handleUpdatePatient}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'compare' && (
          <CompareScreen
            patient={currentPatient}
            onNavigate={setActiveTab}
            onOpenReferralModal={() => setIsReferralModalOpen(true)}
          />
        )}

        {activeTab === 'report' && (
          <ReportScreen
            patient={currentPatient}
            onOpenReferralModal={() => setIsReferralModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      {isAddPatientOpen && (
        <AddPatientModal
          onClose={() => setIsAddPatientOpen(false)}
          onAddPatient={handleAddPatient}
        />
      )}
      {isReferralModalOpen && (
        <SpecialistReferralModal
          patient={currentPatient}
          onClose={() => setIsReferralModalOpen(false)}
          onReferralSuccess={handleReferralSuccess}
        />
      )}

      {uploadModalState.isOpen && (
        <ImageUploadModal
          eye={uploadModalState.eye}
          onClose={() => setUploadModalState({ isOpen: false, eye: 'OS' })}
          onImageSelected={handleImageSelected}
        />
      )}
    </div>
  );
}
