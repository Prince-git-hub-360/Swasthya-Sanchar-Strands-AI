import React, { useState } from 'react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { 
  ClockIcon, CheckIcon, MapPinIcon, PhoneIcon, 
  SparklesIcon, UserIcon, ActivityIcon 
} from '../../../../shared/icons/Icons';
import { RecordVitalsModal } from '../../components/RecordVitalsModal';
import { VisitRouteMapModal } from '../../components/VisitRouteMapModal';

export const AshaVisitsPage = () => {
  const { user, showToast } = useAuth();
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'PENDING', 'COMPLETED'
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showRouteMapModal, setShowRouteMapModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [visits, setVisits] = useState([]);

  const userDistrict = user?.profile?.district || user?.district || 'Mandya';
  const userVillage = user?.profile?.village_or_town || user?.village_or_town || user?.profile?.village || 'Gejjalagere';
  const userSubCentre = user?.profile?.sub_centre || user?.sub_centre || `${userVillage} Sub-Centre`;
  const userWard = user?.profile?.ward_no || user?.profile?.ward_number || user?.ward_no;

  const loadVisits = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('swasthya_asha_visits') || '[]');
      setVisits(stored);
    } catch {
      setVisits([]);
    }
  };

  React.useEffect(() => {
    loadVisits();
    window.addEventListener('swasthya_asha_updated', loadVisits);
    window.addEventListener('storage', loadVisits);
    return () => {
      window.removeEventListener('swasthya_asha_updated', loadVisits);
      window.removeEventListener('storage', loadVisits);
    };
  }, []);

  const handleToggleComplete = (id) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, completed: !v.completed } : v))
    );
    showToast('✅ Visit status updated!', 'success');
  };

  const filteredVisits = visits.filter((v) => {
    if (filter === 'PENDING') return !v.completed;
    if (filter === 'COMPLETED') return v.completed;
    return true;
  });

  const completedCount = visits.filter((v) => v.completed).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0B3B74] dark:text-sky-400 tracking-wider">
            <ClockIcon size={16} />
            <span>National Health Mission • Doorstep Field Operations</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            आज का दौरा कार्यक्रम (Today's Scheduled Home Visits)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {userVillage} Sector • 12 Assigned Households • Progress: {completedCount} of {visits.length} Completed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRouteMapModal(true)}
            className="px-4 py-2.5 bg-[#0B3B74] hover:bg-[#0B3B74]/90 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>🗺️</span>
            <span>Open GPS Route Map</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {['ALL', 'PENDING', 'COMPLETED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === f
                  ? 'bg-[#0B3B74] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {f === 'ALL' ? `All Visits (${visits.length})` : f === 'PENDING' ? `Pending (${visits.length - completedCount})` : `Completed (${completedCount})`}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-500">
          📍 {userDistrict} PHC Catchment • {userSubCentre}
        </div>
      </div>

      {/* Visits Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVisits.map((visit) => (
          <div
            key={visit.id}
            className={`p-5 rounded-3xl border transition-all space-y-3 bg-white dark:bg-slate-900 ${
              visit.completed
                ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/20'
                : 'border-slate-200 dark:border-slate-800 shadow-xs hover:border-[#0B3B74]/40'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${
                  visit.completed 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-[#0B3B74] text-white'
                }`}>
                  {visit.completed ? '✓' : visit.id}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {visit.patient_name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {visit.age_gender} • {visit.time}
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                visit.priority === 'HIGH'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {visit.due_text}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-1 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Purpose of Visit:</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {visit.purpose}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                <span>📍</span>
                <span>{visit.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 gap-2">
              <a
                href={`tel:${visit.phone}`}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <PhoneIcon size={12} />
                <span>Call Patient</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedPatient({ name: visit.patient_name });
                    setShowVitalsModal(true);
                  }}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-[#0B3B74] dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-xs font-bold rounded-xl hover:bg-blue-100 cursor-pointer"
                >
                  Record Vitals
                </button>

                <button
                  onClick={() => handleToggleComplete(visit.id)}
                  className={`px-3.5 py-1.5 text-xs font-black rounded-xl cursor-pointer transition-all ${
                    visit.completed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-[#0B3B74] text-white hover:bg-[#0B3B74]/90 shadow-xs'
                  }`}
                >
                  {visit.completed ? 'Completed ✓' : 'Mark Done'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showVitalsModal && (
        <RecordVitalsModal
          isOpen={showVitalsModal}
          onClose={() => setShowVitalsModal(false)}
          patientName={selectedPatient?.name || 'Lakshmi Devi'}
        />
      )}

      {showRouteMapModal && (
        <VisitRouteMapModal
          isOpen={showRouteMapModal}
          onClose={() => setShowRouteMapModal(false)}
        />
      )}

    </div>
  );
};

export default AshaVisitsPage;
