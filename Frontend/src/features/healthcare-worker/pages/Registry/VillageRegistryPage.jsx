import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { GovtHeaderBanner } from '../../../../components/layout/GovtHeaderBanner';
import { healthcareWorkerApi } from '../../../../services/api/healthcareWorker';
import { AbhaScannerModal } from '../../components/AbhaScannerModal';
import { AbhaRegistrationModal } from '../../components/AbhaRegistrationModal';
import { PatientDetailModal } from '../../components/PatientDetailModal';
import { 
  PlusIcon, PhoneIcon, SearchIcon, QrCodeIcon, SparklesIcon, 
  ShieldIcon, CheckIcon, SpeakerIcon, ClockIcon, DocumentIcon, AlertIcon,
  HeartIcon, ActivityIcon, HospitalIcon
} from '../../../../shared/icons/Icons';

export const VillageRegistryPage = ({ setCurrentView }) => {
  const { user, showToast } = useAuth();
  const [fieldPatients, setFieldPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [showPatientDetailModal, setShowPatientDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Geographic Hierarchy Filters (Dynamic from Logged-in ASHA Worker Profile)
  const userDistrict = user?.profile?.district || user?.district || 'Mandya';
  const userState = user?.profile?.state || user?.state || 'Karnataka';
  const userVillage = user?.profile?.village_or_town || user?.village_or_town || user?.profile?.village || 'Gejjalagere';
  const userSubCentre = user?.profile?.sub_centre || user?.sub_centre || `${userVillage} Sub-Centre`;
  const userWard = user?.profile?.ward_no || user?.profile?.ward_number || user?.ward_no;

  const [selectedDistrict, setSelectedDistrict] = useState(userDistrict);
  const [selectedBlock, setSelectedBlock] = useState(userSubCentre.replace('Sub-Centre', '').trim() || `${userVillage} Sector`);
  const [selectedVillage, setSelectedVillage] = useState(userVillage);
  const [selectedSector, setSelectedSector] = useState('all');

  // Clinical Program Filter
  const [programFilter, setProgramFilter] = useState('all');
  const [triageFilter, setTriageFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const stored = JSON.parse(localStorage.getItem('swasthya_asha_patients') || '[]');
      setFieldPatients(stored);
    } catch (err) {
      setFieldPatients([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('swasthya_asha_updated', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('swasthya_asha_updated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, [user, triageFilter]);

  const handleOpenPatientAbha = (patient) => {
    let realBlood = patient.blood_group || patient.bloodGroup || 'B+';
    let realDob = patient.date_of_birth || patient.dob || '2007-10-05';
    try {
      const registry = JSON.parse(localStorage.getItem('swasthya_abdm_registry') || '[]');
      const cleanAbha = (patient.abha_id || '').replace(/[^0-9]/g, '');
      const match = registry.find(r => r.abhaId && r.abhaId.replace(/[^0-9]/g, '') === cleanAbha);
      if (match) {
        if (match.blood_group) realBlood = match.blood_group;
        if (match.date_of_birth) realDob = match.date_of_birth;
      }
    } catch {}

    setSelectedPatientData({
      patient_id: patient.patient_id || 101,
      full_name: patient.full_name,
      name_hi: patient.name_hi,
      abha_id: patient.abha_id,
      phone_number: patient.mobile || patient.phone_number,
      village: patient.village || patient.village_or_town || userVillage,
      age: patient.age || 18,
      gender: patient.gender || 'Male',
      date_of_birth: realDob,
      blood_group: realBlood,
      chronic_conditions: patient.chronic || patient.chronic_conditions || 'None',
      adherence_rate: '100%',
      triage_badge: patient.triage_type || 'stable',
      ai_summary: {
        overview: `${patient.full_name}, ${patient.age || 18} yrs • Blood Group ${realBlood}. Registered under Ayushman Bharat ABDM (${patient.village || userDistrict}).`,
        adherence_rate: '100%',
        red_flags: [patient.chronic || 'General health monitoring active.'],
        recent_vitals: { bp: '120/80', sugar: '110 mg/dL', pulse: '74 bpm', weight: '65 kg' },
      }
    });
    setShowPatientDetailModal(true);
  };

  const cleanQuery = searchQuery.trim().toLowerCase().replace(/[-+\s]/g, '');
  const filteredCitizens = fieldPatients.filter(p => {
    const matchesProgram = programFilter === 'all' || p.program === programFilter;
    const matchesSector = selectedSector === 'all' || (p.sector && p.sector.toLowerCase().includes(selectedSector.toLowerCase()));
    
    const cleanPhone = (p.mobile || p.phone_number || '').replace(/[-+\s]/g, '');
    const cleanAbha = (p.abha_id || '').replace(/[-+\s]/g, '');
    const cleanName = (p.full_name || '').toLowerCase();

    const matchesSearch = !cleanQuery || 
                          cleanPhone.includes(cleanQuery) ||
                          cleanAbha.includes(cleanQuery) ||
                          cleanName.includes(cleanQuery);
    return matchesProgram && matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. 4-TIER GEOGRAPHIC HIERARCHY FILTER BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <span>🗺️ Geographic Catchment Filter</span>
              <span className="text-[10px] font-medium text-slate-400">({userDistrict} Health Catchment)</span>
            </span>
            <button 
              type="button" 
              onClick={() => { setSelectedSector('all'); setSelectedVillage(userVillage); }}
              className="text-[11px] font-bold text-[#0B3B74] dark:text-sky-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">1. District (जिला)</label>
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value={userDistrict}>{userDistrict} ({userState})</option>
                <option value="Mandya">Mandya (Karnataka)</option>
                <option value="Mysuru">Mysuru</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">2. Block / Taluk (प्रखंड)</label>
              <select 
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value={selectedBlock}>{selectedBlock}</option>
                <option value="South Taluk">{userDistrict} South Block</option>
                <option value="North Taluk">{userDistrict} North Block</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">3. Gram Panchayat / Town (ग्राम)</label>
              <select 
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value={userVillage}>{userVillage} ({userDistrict})</option>
                <option value="Sector 1 Area">Sector 1 Area</option>
                <option value="Sector 2 Area">Sector 2 Area</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">4. Sector / Ward (वार्ड)</label>
              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#0B3B74]"
              >
                <option value="all">All Wards / Sectors</option>
                <option value="Sector 1">Sector 1 - Main Catchment</option>
                <option value="Sector 2">Sector 2 - Market Area</option>
                <option value="Sector 3">Sector 3 - Extended Belt</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. PROGRAM FILTER PILLS & SEARCH BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📇 Main Village Registry &amp; Census Directory</span>
                <span className="bg-[#0B3B74] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {filteredCitizens.length} Citizens
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {userDistrict}: <strong>{userSubCentre}</strong> • Realistic high-resolution ABDM citizen records
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddPatientModal(true)}
              className="bg-[#00875A] hover:bg-emerald-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <PlusIcon size={16} />
              <span>+ Register Household Citizen</span>
            </button>
          </div>

          {/* Clinical Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: '🌐 All Registered Citizens' },
              { id: 'anc', label: '🤰 Maternal Care (ANC 1-3)' },
              { id: 'ncd', label: '💊 NCD: BP & Diabetes' },
              { id: 'tb', label: '🫁 Nikshay: TB DOTS' },
              { id: 'uip', label: '💉 Child Immunization' },
              { id: 'geriatric', label: '👵 Geriatric Care' },
            ].map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={() => setProgramFilter(prog.id)}
                className={`text-xs font-black px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                  programFilter === prog.id
                    ? 'bg-[#0B3B74] text-white border-[#0B3B74] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{prog.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, 14-digit ABHA (12-3456-7890-1122), or mobile number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0B3B74]"
            />
          </div>

          {/* 🪪 CITIZEN CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredCitizens.map((citizen) => (
              <div
                key={citizen.patient_id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleOpenPatientAbha(citizen)}
              >
                <div className="p-4 space-y-3">
                  {/* Top Row: Initial / Portrait, Name, Age Code, QR Code */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {citizen.avatar && !citizen.avatar.includes('manjunath') && !citizen.avatar.includes('savithri') ? (
                        <img
                          src={citizen.avatar}
                          alt={citizen.full_name}
                          style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}
                          className="rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#0B3B74] to-teal-600 text-white flex items-center justify-center font-black text-2xl border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                          {citizen.full_name ? citizen.full_name.charAt(0).toUpperCase() : 'P'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-black text-xs text-slate-900 dark:text-white leading-tight truncate">
                          {citizen.full_name}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 truncate">
                          {citizen.name_hi}
                        </div>
                        <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300 mt-1">
                          ABHA ID:<br/>
                          <strong className="text-slate-950 dark:text-white font-bold">{citizen.abha_id}</strong>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Box & Age Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                        {citizen.gender_code || `${citizen.age || 18} M`}
                      </span>
                      <img
                        src={citizen.qr_pattern}
                        alt="ABHA QR Code"
                        className="w-10 h-10 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5"
                      />
                    </div>
                  </div>

                  {/* Contact & Demographics */}
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 border-t border-slate-100 dark:border-slate-800 pt-2">
                    <div>Age Code: <strong>{citizen.age || 18}, {citizen.gender || 'Male'}</strong> • Blood: <strong>{citizen.blood_group || 'B+'}</strong></div>
                    <div>Mobile Number: <strong>{citizen.mobile || citizen.phone_number || '+91 90088 02105'}</strong></div>
                  </div>
                </div>

                {/* Bottom Status Ribbon */}
                <div className={`py-1.5 px-4 text-center text-[10px] font-black uppercase tracking-wider ${citizen.status_color || 'bg-[#00875A] text-white'}`}>
                  {citizen.status_label || 'ACTIVE MONITORED | ABDM VERIFIED'}
                </div>
              </div>
            ))}
          </div>

        </div>

      {/* MODALS */}
      <AbhaScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onSelectAbha={(abhaId) => {
          const match = fieldPatients.find(p => p.abha_id === abhaId) || fieldPatients[0];
          handleOpenPatientAbha(match);
        }}
      />

      {/* ALL INTERACTIVE FIELD MODALS */}
      <AbhaRegistrationModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onRegisterSuccess={(newRecord) => {
          setFieldPatients([newRecord, ...fieldPatients]);
        }}
        showToast={showToast}
      />

      <PatientDetailModal
        isOpen={showPatientDetailModal}
        onClose={() => setShowPatientDetailModal(false)}
        patientData={selectedPatientData}
        onRefresh={() => {}}
      />

    </div>
  );
};

export default VillageRegistryPage;
