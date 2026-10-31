import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { 
  HospitalIcon, PlusIcon, SearchIcon, CheckIcon, AlertIcon, 
  SpeakerIcon, ShieldIcon, ClockIcon, DocumentIcon, PhoneIcon,
  SparklesIcon, UserIcon, HeartIcon, ActivityIcon, ArrowRightIcon,
  QrCodeIcon
} from '../../../../shared/icons/Icons';
import { ROUTES } from '../../../../utils/routes';
import { AbhaRegistrationModal } from '../../components/AbhaRegistrationModal';
import { RecordVitalsModal } from '../../components/RecordVitalsModal';
import { CreateReferralModal } from '../../components/CreateReferralModal';
import { VisitRouteMapModal } from '../../components/VisitRouteMapModal';
import { DoctorTeleChatModal } from '../../components/DoctorTeleChatModal';
import { UploadDocumentModal } from '../../components/UploadDocumentModal';
import { PatientDetailModal } from '../../components/PatientDetailModal';

export const AshaDashboardPage = ({ setCurrentView }) => {
  const { user, showToast } = useAuth();
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [showPatientDetailModal, setShowPatientDetailModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showRecordVitalsModal, setShowRecordVitalsModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showRouteMapModal, setShowRouteMapModal] = useState(false);
  const [showDoctorChatModal, setShowDoctorChatModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);

  // Dynamic persistent state from localStorage
  const [priorityPatients, setPriorityPatients] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [visitPlan, setVisitPlan] = useState([]);
  const [referralsCount, setReferralsCount] = useState(0);

  const loadAshaData = () => {
    try {
      const storedPatients = JSON.parse(localStorage.getItem('swasthya_asha_patients') || '[]');
      setPriorityPatients(storedPatients);
      const storedActs = JSON.parse(localStorage.getItem('swasthya_asha_activities') || '[]');
      setRecentActivities(storedActs);
      const storedVisits = JSON.parse(localStorage.getItem('swasthya_asha_visits') || '[]');
      setVisitPlan(storedVisits);
      const storedRefs = JSON.parse(localStorage.getItem('swasthya_asha_referrals') || '[]');
      setReferralsCount(storedRefs.length);
    } catch {
      setPriorityPatients([]);
      setRecentActivities([]);
      setVisitPlan([]);
      setReferralsCount(0);
    }
  };

  useEffect(() => {
    loadAshaData();
    window.addEventListener('swasthya_asha_updated', loadAshaData);
    window.addEventListener('storage', loadAshaData);
    return () => {
      window.removeEventListener('swasthya_asha_updated', loadAshaData);
      window.removeEventListener('storage', loadAshaData);
    };
  }, []);

  const handleOpenPatient = (p) => {
    setSelectedPatientData({
      patient_id: p.patient_id || p.id || Date.now(),
      full_name: p.full_name || p.name,
      abha_id: p.abha_id || p.abhaId || '12-3456-7890-0000',
      phone_number: p.mobile || p.phone || '+91 98000 00000',
      village: p.village || 'Gejjalagere, Mandya',
      age: parseInt(p.age) || 45,
      gender: p.gender || 'Female',
      blood_group: p.blood_group || 'B +ve',
      chronic_conditions: p.chronic || p.reason || 'Doorstep Screening Active',
      adherence_rate: p.adherence_rate || '92%',
      triage_badge: p.triage === 'high_risk' || p.priority === 'HIGH' ? 'high_risk' : 'stable',
      ai_summary: {
        overview: `${p.full_name || p.name}, ${p.age} y/o ${p.gender} from ${p.village || 'Mandya'}.`,
        adherence_rate: '92%',
        red_flags: [p.chronic || p.reason || 'Screening Active'],
        recent_vitals: p.vitals || { bp: '120/80 mmHg', sugar: '110 mg/dL', pulse: '72 bpm' },
      }
    });
    setShowPatientDetailModal(true);
  };

  const highRiskCount = priorityPatients.filter(p => p.triage === 'high_risk' || p.priority === 'HIGH').length;
  const ancCount = priorityPatients.filter(p => p.program === 'anc').length;

  const ashaName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim() 
    : (user?.username || 'ASHA Sister');
  const ashaState = user?.profile?.state || user?.state || 'Karnataka';
  const ashaDistrict = user?.profile?.district || user?.district || 'Mandya';
  const ashaVillage = user?.profile?.village_or_town || user?.village_or_town || user?.profile?.village || 'Gejjalagere';
  const ashaSubCentre = user?.profile?.sub_centre || user?.sub_centre || `${ashaVillage} Sub-Centre`;
  const ashaWard = user?.profile?.ward_no || user?.profile?.ward_number || user?.ward_no;
  const sectorName = ashaWard 
    ? `${ashaVillage} (Ward #${ashaWard}), ${ashaDistrict}` 
    : `${ashaVillage}, ${ashaDistrict}`;

  return (
    <div className="space-y-6 font-sans">
      
      {/* GREETING BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>नमस्कार, {ashaName}</span>
            <span>👋</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Here is your live field operations overview for {sectorName}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddPatientModal(true)}
          className="bg-[#0B3B74] hover:bg-[#072448] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span>
          <span>Register New Citizen</span>
        </button>
      </div>

      {/* 5 TOP METRIC STATS CARDS (DYNAMIC METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* 1. Total Registered Citizens */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0B3B74] dark:text-sky-300 flex items-center justify-center text-xl shrink-0">
            👥
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{priorityPatients.length}</div>
            <div className="text-[11px] font-bold text-slate-500">Registered Citizens</div>
          </div>
        </div>

        {/* 2. High Priority Patients */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-xl shrink-0">
            ⚠️
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-rose-600">{highRiskCount}</div>
            <div className="text-[11px] font-bold text-slate-500">High Risk Patients</div>
          </div>
        </div>

        {/* 3. ANC / PNC Follow-ups */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center text-xl shrink-0">
            🤰
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-purple-700 dark:text-purple-300">{ancCount}</div>
            <div className="text-[11px] font-bold text-slate-500">ANC / PNC Cases</div>
          </div>
        </div>

        {/* 4. Visits Due Today */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center text-xl shrink-0">
            🏠
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-amber-600">{visitPlan.length}</div>
            <div className="text-[11px] font-bold text-slate-500">Visits Scheduled</div>
          </div>
        </div>

        {/* 5. Active PHC Referrals */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all col-span-2 sm:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            🏥
          </div>
          <div className="leading-tight">
            <div className="text-2xl font-black text-emerald-600">{referralsCount}</div>
            <div className="text-[11px] font-bold text-slate-500">Active Referrals</div>
          </div>
        </div>

      </div>

      {/* TWO-COLUMN OFFICIAL HEALTHCARE PORTAL GRID (8 COLS WORKSPACE : 4 COLS SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (8 COLS): CLINICAL DATA, CENSUS & FIELD ACTIVITY WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CARD 1: पंजीकृत नागरिक (Registered Village Citizens) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📇</span>
                <span>पंजीकृत नागरिक <span className="text-slate-400 font-bold">(Registered Village Citizens)</span></span>
              </h2>
              <button 
                onClick={() => {
                  window.history.pushState({}, '', ROUTES.APP.ASHA.PATIENTS);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="text-xs font-bold text-[#0B3B74] dark:text-sky-400 hover:underline cursor-pointer"
              >
                View Full Census →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2.5 px-4">Patient Name</th>
                    <th className="py-2.5 px-3">Age/Sex</th>
                    <th className="py-2.5 px-3">Village</th>
                    <th className="py-2.5 px-3">Health Status</th>
                    <th className="py-2.5 px-3 text-center">Priority</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                  {priorityPatients.length > 0 ? (
                    priorityPatients.map((p, idx) => (
                      <tr key={p.patient_id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#0B3B74] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {(p.full_name || p.name || 'P').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap block">{p.full_name || p.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{p.abha_id || p.abhaId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {p.gender_code || `${p.age || 45} / ${p.gender === 'Female' ? 'F' : 'M'}`}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{p.village || 'Mandya'}</td>
                        <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium min-w-[150px]">
                          {p.chronic || p.reason || 'Screening Active'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                            p.triage === 'high_risk' || p.priority === 'HIGH'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {p.triage === 'high_risk' || p.priority === 'HIGH' ? 'HIGH' : 'STABLE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenPatient(p)}
                            className="bg-[#0B3B74] hover:bg-[#072448] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer whitespace-nowrap"
                          >
                            View Patient
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <span className="text-3xl">📇</span>
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No citizens registered in this sector yet</div>
                          <p className="text-xs text-slate-400 max-w-sm">Click "+ Register New Citizen" above to create an official ABDM household record.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span>ℹ️</span>
                <span>{ashaSubCentre} Catchment • Live ABDM Sync Active</span>
              </div>
              <span className="font-mono font-bold text-[10px] text-slate-400">{priorityPatients.length} Active Records</span>
            </div>
          </div>

          {/* CARD 2: मेरा क्षेत्र स्वास्थ्य सारांश (Village Health Summary) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📊</span>
                <span>मेरा क्षेत्र स्वास्थ्य सारांश <span className="text-slate-400 font-bold">(Village Health Summary & Census)</span></span>
              </h3>
              <span className="text-[10px] font-bold text-[#0B3B74] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800">
                {ashaVillage} Catchment
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-blue-600">👥</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">428</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">कुल पंजीकृत<br/>(Registered)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-amber-500">⚠️</div>
                <div className="text-lg font-black text-amber-600">24</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">उच्च जोखिम<br/>(High Risk)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-purple-600">🤰</div>
                <div className="text-lg font-black text-purple-700 dark:text-purple-300">8</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">गर्भवती महिलाएं<br/>(ANC/PNC)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-emerald-600">👶</div>
                <div className="text-lg font-black text-emerald-600">19</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">बच्चे (0-5)<br/>(0-5 Yrs)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-purple-600">💉</div>
                <div className="text-lg font-black text-purple-600">9</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">टीकाकरण लंबित<br/>(Vaccine Due)</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                <div className="text-base text-blue-700">👵</div>
                <div className="text-lg font-black text-blue-700 dark:text-sky-300">14</div>
                <div className="text-[9px] font-bold text-slate-500 leading-tight">वरिष्ठ नागरिक<br/>(Elderly 60+)</div>
              </div>
            </div>
          </div>

          {/* CARD 3: हाल की गतिविधि (Recent Activity) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>⏱️</span>
                <span>हाल की गतिविधि <span className="text-slate-400 font-bold">(Recent Doorstep Activity)</span></span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                ● Live Field Activity
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 py-1">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 3).map((act, i) => (
                  <div key={i} className="py-3 px-2 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {act.time}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#0B3B74] dark:text-sky-300 border border-blue-200/60 dark:border-blue-800 max-w-[220px] truncate">
                        📍 {act.village}
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-base shrink-0 mt-0.5">{act.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white text-xs break-words">
                          {act.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5 break-words">
                          {act.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 text-slate-400">
                  <span className="text-2xl">📋</span>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">No field activities recorded yet today</div>
                  <p className="text-[10px] text-slate-400 max-w-xs">Logs appear automatically as you record vitals, register citizens, or issue referrals.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>🔄 Real-time Doorstep Activity</span>
              <span className="text-emerald-600 font-bold">● Active Sync</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4 COLS): QUICK ACTIONS, VISIT PLAN, PHC COORDINATION */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CARD 1: त्वरित कार्य (Quick Actions) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              ⚡ त्वरित कार्य <span className="text-slate-400 font-bold">(Quick Actions)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddPatientModal(true)}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-[#0B3B74]">➕</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Add Patient</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.history.pushState({}, '', ROUTES.APP.ASHA.FOLLOW_UPS);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-emerald-600">🏠</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Home Visit</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRecordVitalsModal(true)}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 hover:border-purple-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-purple-600">📈</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Record Vitals</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUploadDocModal(true)}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-[#0B3B74]">📤</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Upload Rx</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReferralModal(true)}
                className="bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-[#0B3B74]">👥</span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Referral</span>
              </button>

              <a
                href="tel:108"
                className="bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="text-xl text-rose-600">📞</span>
                <span className="text-[11px] font-black text-rose-700 dark:text-rose-300">108 Care</span>
              </a>
            </div>
          </div>

          {/* CARD 2: आज का दौरा कार्यक्रम (Today's Visit Plan) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🗺️</span>
                  <span>आज का दौरा <span className="text-slate-400 font-bold">(Visit Plan)</span></span>
                </h3>
                <button 
                  onClick={() => setShowRouteMapModal(true)}
                  className="text-xs font-bold text-[#0B3B74] dark:text-sky-400 hover:underline cursor-pointer"
                >
                  View Map
                </button>
              </div>

              <div className="py-3 space-y-3">
                {visitPlan.length > 0 ? (
                  visitPlan.slice(0, 3).map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50/60 dark:bg-slate-800/40">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-6 h-6 rounded-full ${step.color || 'bg-[#0B3B74]'} text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs`}>
                          {step.step || idx + 1}
                        </span>
                        <div className="leading-tight min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white text-xs block truncate">{step.title}</span>
                          {step.subtitle && <span className="text-[11px] text-slate-400 font-medium block truncate mt-0.5">{step.subtitle}</span>}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-500 font-bold shrink-0 ml-2">{step.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 text-slate-400">
                    <span className="text-2xl">🗺️</span>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">No visits scheduled today</div>
                    <p className="text-[10px] text-slate-400 max-w-xs">Visits can be added from patient records.</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRouteMapModal(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0B3B74] dark:text-sky-300 text-xs font-black py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs mt-1"
            >
              <span>🗺️</span>
              <span>Open Doorstep Route Map</span>
            </button>
          </div>

          {/* CARD 3: PHC समन्वय (PHC Coordination) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-white">
                🏥 PHC समन्वय <span className="text-slate-400 font-bold">(PHC Coordination)</span>
              </h3>
              <span className="text-[10px] font-bold text-[#0B3B74] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                {user?.profile?.assigned_facility || `${ashaDistrict} PHC`}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="leading-tight">
                  <div className="text-lg font-black text-amber-600">3</div>
                  <div className="text-[9px] font-bold text-slate-500">लंबित रेफरल<br/>(Pending)</div>
                </div>

                <div className="leading-tight">
                  <div className="text-lg font-black text-blue-600">2</div>
                  <div className="text-[9px] font-bold text-slate-500">डॉक्टर समीक्षा<br/>(Reviews)</div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-[9px] font-bold text-slate-500">Dr. Vikram Sharma</div>
                <a
                  href="tel:+919876500999"
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1 shadow-xs"
                >
                  <PhoneIcon size={11} />
                  <span>Call PHC</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold">
              <button 
                onClick={() => {
                  window.history.pushState({}, '', ROUTES.APP.ASHA.FOLLOW_UPS);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="text-[#0B3B74] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>All Referrals</span>
                <span>➔</span>
              </button>
              <button 
                onClick={() => setShowDoctorChatModal(true)}
                className="text-[#0B3B74] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Send Message</span>
                <span>➔</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ALL INTERACTIVE FIELD MODALS */}
      <AbhaRegistrationModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onRegisterSuccess={(newCitizen) => {
          if (showToast) showToast(`✅ Registered ${newCitizen.full_name} under ABDM!`, 'success');
        }}
        showToast={showToast}
      />

      <RecordVitalsModal
        isOpen={showRecordVitalsModal}
        onClose={() => setShowRecordVitalsModal(false)}
        showToast={showToast}
      />

      <CreateReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        showToast={showToast}
      />

      <VisitRouteMapModal
        isOpen={showRouteMapModal}
        onClose={() => setShowRouteMapModal(false)}
        showToast={showToast}
      />

      <DoctorTeleChatModal
        isOpen={showDoctorChatModal}
        onClose={() => setShowDoctorChatModal(false)}
        showToast={showToast}
      />

      <UploadDocumentModal
        isOpen={showUploadDocModal}
        onClose={() => setShowUploadDocModal(false)}
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

export default AshaDashboardPage;
