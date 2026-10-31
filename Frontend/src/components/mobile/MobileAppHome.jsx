import React, { useState } from 'react';
import { 
  SparklesIcon, SpeakerIcon, ShieldIcon, UserIcon, ArrowRightIcon,
  PlayIcon, CheckIcon, HeartIcon, PhoneIcon, BellIcon, PillIcon
} from '../../shared/icons/Icons';
import { ROUTES, navigateTo } from '../../utils/routes';
import { speakNativeAudio } from '../../shared/utils/speech';
import SwasthyaLogo from '../branding/SwasthyaLogo';
import { useAuth } from '../../shared/context/AuthContext';

export const MobileAppHome = ({ onNavigate, onOpenChat }) => {
  const { theme, toggleTheme } = useAuth();

  // Active Language State
  const [activeLang, setActiveLang] = useState('Hindi');
  const languages = [
    { name: 'Hindi', label: 'हिंदी' },
    { name: 'Tamil', label: 'தமிழ்' },
    { name: 'Telugu', label: 'తెలుగు' },
    { name: 'Marathi', label: 'मराठी' },
    { name: 'Bengali', label: 'বাংলা' },
    { name: 'English', label: 'English' },
  ];

  // Prescription Demo State
  const [selectedMed, setSelectedMed] = useState('Paracetamol');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [medsTaken, setMedsTaken] = useState({ morning: true, noon: false, night: false });

  const prescriptions = {
    'Paracetamol': {
      note: 'Tab Paracetamol 500mg 1-0-1 (3 days) PC',
      instruction: 'Take 1 pill morning & night after food. (3 Days)',
      hindi: 'सुबह और रात को भोजन के बाद 1-1 गोली लें। (3 दिन)',
    },
    'Amoxicillin': {
      note: 'Cap Amoxicillin 250mg 1-1-1 (5 days) PC',
      instruction: 'Take 1 capsule morning, noon & night after meals.',
      hindi: 'सुबह, दोपहर और रात को खाने के बाद 1-1 कैप्सूल लें।',
    },
    'Metformin': {
      note: 'Tab Metformin 500mg 1-0-1 (7 days) AC',
      instruction: 'Take 1 pill morning & night before food.',
      hindi: 'सुबह और शाम को खाने से पहले 1-1 गोली लें।',
    },
  };

  const currentMed = prescriptions[selectedMed];

  const handlePlayVoice = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    speakNativeAudio(currentMed.hindi, 'Hindi', () => {
      setIsPlayingAudio(false);
    });
  };

  const handleNav = (route) => {
    if (onNavigate) onNavigate(route);
    else navigateTo(route);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#080E14] text-slate-900 dark:text-slate-100 flex flex-col pb-24 font-sans selection:bg-teal-500/20">
      
      {/* 1. NATIVE MOBILE APP TOP BAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B131E]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <SwasthyaLogo variant={theme === 'dark' ? 'dark' : 'full'} height={32} />
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Language Dropdown/Pill */}
          <select
            value={activeLang}
            onChange={(e) => setActiveLang(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold py-1.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l.name} value={l.name}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs"
            title="Toggle Theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>

          {/* Login / Portal Link */}
          <button
            onClick={() => handleNav(ROUTES.AUTH.LOGIN)}
            className="p-1.5 rounded-xl bg-[#0F766E]/10 dark:bg-teal-950 text-[#0F766E] dark:text-teal-400 border border-[#0F766E]/20 text-xs font-bold"
            title="User Portal"
          >
            <UserIcon size={16} />
          </button>
        </div>
      </header>

      {/* 2. PATIENT WELCOME & BADGES */}
      <section className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#0F766E] dark:text-teal-400 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Rural Health Communication Portal</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
              नमस्ते, Rural Health Seeker 👋
            </h1>
          </div>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-300/40 shrink-0">
            PHC Verified
          </span>
        </div>
      </section>

      {/* 3. PRIMARY MOBILE HERO ACTIONS (2 Big Touch Cards) */}
      <section className="px-4 py-2 space-y-3">
        {/* Card A: Scan Doctor Prescription */}
        <div 
          onClick={() => handleNav(ROUTES.AUTH.REGISTER)}
          className="rounded-2xl p-4 bg-gradient-to-br from-[#0F766E] to-[#0A4D48] text-white shadow-lg active:scale-[0.98] transition-all cursor-pointer border border-teal-500/30 relative overflow-hidden"
        >
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-15 pointer-events-none text-7xl font-serif">
            ℞
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] bg-white/20 text-white uppercase font-black tracking-wider px-2 py-0.5 rounded-full">
              Vision OCR + LLM
            </span>
            <span className="text-xs bg-white text-[#0F766E] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
              Instant
            </span>
          </div>
          <h2 className="text-lg font-black leading-tight">
            Scan Doctor Prescription
          </h2>
          <p className="text-xs text-teal-100/90 mt-1 leading-snug">
            Snap doctor's handwriting & get simple instructions in {activeLang}.
          </p>
          <div className="mt-3 flex items-center gap-2 font-bold text-xs bg-white/15 px-3 py-2 rounded-xl backdrop-blur-xs w-fit">
            <span>📷 Open Camera / Upload Slip</span>
            <ArrowRightIcon size={14} color="#fff" />
          </div>
        </div>

        {/* Card B: Swasthya Mitr (AI Voice Assistant) */}
        {onOpenChat && (
          <div 
            onClick={onOpenChat}
            className="rounded-2xl p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-lg active:scale-[0.98] transition-all cursor-pointer border border-amber-300 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] bg-slate-950/15 uppercase font-black tracking-wider px-2 py-0.5 rounded-full text-slate-950">
                ✦ Autonomous Voice AI
              </span>
              <SparklesIcon size={16} className="text-slate-950 animate-pulse" />
            </div>
            <h2 className="text-lg font-black leading-tight text-slate-950">
              Talk to Swasthya Mitr (AI)
            </h2>
            <p className="text-xs text-slate-900/90 mt-1 leading-snug font-medium">
              अपनी भाषा में बोलें और बीमारी या दवा के बारे में तुरंत सलाह पाएं।
            </p>
            <div className="mt-3 flex items-center gap-2 font-extrabold text-xs bg-slate-950 text-amber-300 px-3 py-2 rounded-xl shadow-xs w-fit">
              <span>🎙️ Start Voice / Audio Chat</span>
              <ArrowRightIcon size={14} color="#fcd34d" />
            </div>
          </div>
        )}
      </section>

      {/* 4. INTERACTIVE LIVE PRESCRIPTION READER (Mobile Optimized) */}
      <section className="px-4 py-2">
        <div className="bg-white dark:bg-[#0B131E] rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-900 dark:text-white">
              <SparklesIcon size={14} color="#0F766E" />
              <span>Interactive Prescription Reader</span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              100% Parsed
            </span>
          </div>

          {/* Medicine Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {Object.keys(prescriptions).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedMed(key)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  selectedMed === key
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Simplified Results Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60 space-y-2">
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="truncate">Doctor Note: <i>{currentMed.note}</i></span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
              {currentMed.instruction}
            </div>
            <div className="text-xs font-semibold text-[#0F766E] dark:text-teal-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              {currentMed.hindi}
            </div>
          </div>

          {/* Large Touch Audio Button */}
          <button
            onClick={handlePlayVoice}
            className="w-full bg-[#0F766E] hover:bg-[#095650] active:scale-98 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <SpeakerIcon size={14} color="#fff" />
            <span>{isPlayingAudio ? '🔊 Playing Audio Guidance...' : `🔊 Listen in ${activeLang}`}</span>
          </button>
        </div>
      </section>

      {/* 5. TODAY'S MEDICINE SCHEDULE / PILLBOX (Mobile Card) */}
      <section className="px-4 py-2">
        <div className="bg-white dark:bg-[#0B131E] rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-900 dark:text-white">
              <PillIcon size={14} color="#059669" />
              <span>Smart Pillbox Schedule</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold">Today</span>
          </div>

          <div className="space-y-2">
            {/* Morning */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">☀️</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Paracetamol 500mg</div>
                  <div className="text-[10px] text-slate-500">Morning (After Breakfast)</div>
                </div>
              </div>
              <button
                onClick={() => setMedsTaken({ ...medsTaken, morning: !medsTaken.morning })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  medsTaken.morning
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {medsTaken.morning ? '✓ Taken' : 'Mark Taken'}
              </button>
            </div>

            {/* Afternoon */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🌤️</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Amoxicillin 250mg</div>
                  <div className="text-[10px] text-slate-500">Afternoon (After Lunch)</div>
                </div>
              </div>
              <button
                onClick={() => setMedsTaken({ ...medsTaken, noon: !medsTaken.noon })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  medsTaken.noon
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {medsTaken.noon ? '✓ Taken' : 'Mark Taken'}
              </button>
            </div>

            {/* Night */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🌙</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Metformin 500mg</div>
                  <div className="text-[10px] text-slate-500">Night (Before Sleep)</div>
                </div>
              </div>
              <button
                onClick={() => setMedsTaken({ ...medsTaken, night: !medsTaken.night })}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  medsTaken.night
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {medsTaken.night ? '✓ Taken' : 'Mark Taken'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EMERGENCY HELPLINE BAR */}
      <section className="px-4 py-2">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 flex items-center justify-center font-bold text-sm shrink-0">
              🚨
            </div>
            <div>
              <div className="text-xs font-bold text-red-900 dark:text-red-200">Emergency Village SOS</div>
              <div className="text-[10px] text-red-700 dark:text-red-300">ASHA Alert • Ambulance 108</div>
            </div>
          </div>
          <a
            href="tel:108"
            className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs"
          >
            Call 108
          </a>
        </div>
      </section>

      {/* 7. PINNED NATIVE MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0B131E]/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-[#0F766E] dark:text-teal-400 font-bold text-[10px]"
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNav(ROUTES.AUTH.REGISTER)}
          className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold text-[10px]"
        >
          <span className="text-base">📷</span>
          <span>Scan Rx</span>
        </button>

        {onOpenChat && (
          <button
            onClick={onOpenChat}
            className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xl flex items-center justify-center font-bold border-2 border-white dark:border-[#0B131E] active:scale-95 transition-transform"
            title="Ask Swasthya Mitr (AI)"
          >
            <SparklesIcon size={20} className="text-slate-950 animate-pulse" />
          </button>
        )}

        <button
          onClick={() => handleNav(ROUTES.AUTH.LOGIN)}
          className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold text-[10px]"
        >
          <span className="text-base">💊</span>
          <span>Meds</span>
        </button>

        <button
          onClick={() => handleNav(ROUTES.AUTH.LOGIN)}
          className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold text-[10px]"
        >
          <span className="text-base">👤</span>
          <span>Portal</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileAppHome;
