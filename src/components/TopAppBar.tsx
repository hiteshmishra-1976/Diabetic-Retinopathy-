import { TabType, PatientRecord } from '../types';

interface TopAppBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  patient: PatientRecord;
  patients: PatientRecord[];
  onSelectPatient: (patient: PatientRecord) => void;
  onOpenAddPatient: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export function TopAppBar({
  activeTab,
  setActiveTab,
  patient,
  patients,
  onSelectPatient,
  onOpenAddPatient,
  isOffline,
  onToggleOffline,
}: TopAppBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-surface-container-lowest border-b-2 border-outline-variant h-14 md:h-16 flex items-center justify-between px-3 md:px-6 transition-colors shadow-xs">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => setActiveTab('capture')}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-primary"
          title="RetinaScan AI Home"
        >
          <span className="material-symbols-outlined text-2xl md:text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            clinical_notes
          </span>
          <span className="font-headline-md text-lg md:text-xl font-bold text-primary tracking-tight">
            RetinaScan AI
          </span>
        </button>
      </div>

      {/* Center: Desktop Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-2 bg-surface-container-low p-1 rounded-lg border border-outline-variant">
        <button
          onClick={() => setActiveTab('capture')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-label-lg text-sm transition-all ${
            activeTab === 'capture'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'capture' ? "'FILL' 1" : "'FILL' 0" }}>
            add_a_photo
          </span>
          Capture
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-label-lg text-sm transition-all ${
            activeTab === 'analysis'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'analysis' ? "'FILL' 1" : "'FILL' 0" }}>
            analytics
          </span>
          Analysis
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-label-lg text-sm transition-all ${
            activeTab === 'compare'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'compare' ? "'FILL' 1" : "'FILL' 0" }}>
            compare
          </span>
          Compare
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-label-lg text-sm transition-all ${
            activeTab === 'report'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'report' ? "'FILL' 1" : "'FILL' 0" }}>
            description
          </span>
          Report
        </button>
      </nav>

      {/* Right: Patient Switcher & Clinical Status */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Patient Selector & Add Button */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded border border-outline-variant">
            <span className="font-label-lg text-xs md:text-sm text-on-surface-variant hidden sm:inline">Patient:</span>
            <select
              value={patient.id}
              onChange={(e) => {
                const found = patients.find((p) => p.id === e.target.value);
                if (found) onSelectPatient(found);
              }}
              className="bg-transparent text-on-surface font-bold text-xs md:text-sm cursor-pointer outline-none max-w-[120px] sm:max-w-[180px] truncate"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.patientIdNumber} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenAddPatient}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-primary text-on-primary rounded font-bold text-xs hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors shadow-2xs"
            title="Register New Patient"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span className="hidden xl:inline">New Patient</span>
          </button>
        </div>

        {/* Offline / Online Mode Toggle */}
        <button
          onClick={onToggleOffline}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
            isOffline
              ? 'bg-secondary/15 text-secondary border border-secondary/40'
              : 'bg-primary/10 text-primary border border-primary/30'
          }`}
          title={isOffline ? 'Offline Mode Active (Local Processing)' : 'Online Cloud Connected'}
        >
          <span
            className="material-symbols-outlined text-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isOffline ? 'cloud_off' : 'cloud_done'}
          </span>
          <span className="font-label-lg text-xs hidden md:inline">
            {isOffline ? 'Offline Mode' : 'Cloud Sync'}
          </span>
        </button>
      </div>
    </header>
  );
}
