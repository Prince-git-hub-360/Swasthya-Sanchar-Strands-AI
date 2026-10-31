import React, { useState } from 'react';
import { useAuth, LANGUAGES } from '../../../shared/context/AuthContext';
import { ROUTES } from '../../../utils/routes';
import { 
  HospitalIcon, UserIcon, ClockIcon, ActivityIcon, 
  DocumentIcon, PhoneIcon, SparklesIcon, PillIcon, TranslateIcon, CameraIcon
} from '../../../shared/icons/Icons';

export const PatientPortalLayout = ({ currentPath, onNavigate, onOpenChat, children }) => {
  const { user, logout, showToast, currentLang, updateLanguage } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLang || 'en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navGroups = [
    {
      label: 'MAIN MENU',
      items: [
        { id: ROUTES.APP.PATIENT.DASHBOARD, label: 'Home Dashboard', icon: HospitalIcon },
        { id: ROUTES.APP.PATIENT.TRANSLATE, label: 'Prescription AI', icon: TranslateIcon, badge: 'AI' },
        { id: ROUTES.APP.PATIENT.REMINDERS, label: 'Medications & Pillbox', icon: PillIcon },
        { id: ROUTES.APP.PATIENT.HEALTH_VAULT, label: 'Digital Health Vault', icon: DocumentIcon, badge: 'ABDM' },
        { id: ROUTES.APP.PATIENT.HEALTH_MAP, label: 'Gyan Kendra', icon: ActivityIcon, badge: 'LEARN' },
      ],
    },
    {
      label: 'EMERGENCY RESPONSE',
      items: [
        { id: ROUTES.APP.PATIENT.EMERGENCY, label: 'Emergency Care', icon: PhoneIcon, danger: true, badge: '108' },
      ],
    },
  ];

  const handleNav = (targetPath) => {
    onNavigate(targetPath);
    setMobileMenuOpen(false);
  };

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    if (updateLanguage) updateLanguage(newLang);
    if (showToast) {
      const langObj = LANGUAGES.find((l) => l.code === newLang);
      const langName = langObj ? `${langObj.native} (${langObj.name})` : newLang;
      showToast(`🌐 Interface & audio language changed to ${langName}`, 'info');
    }
  };

  const isActive = (path) => currentPath === path || (path === ROUTES.APP.PATIENT.DASHBOARD && currentPath === '/app/patient/care');

  const userName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || 'Prince Kumar';

  const userDistrict = user?.profile?.district || user?.district;
  const userState = user?.profile?.state || user?.state || 'Karnataka';
  const userVillage = user?.profile?.village_or_town || user?.village_or_town || '';

  const locationDisplay = userDistrict 
    ? `${userVillage ? `${userVillage}, ` : ''}${userDistrict} District, ${userState} • Primary Health Center Catchment`
    : (userVillage ? `${userVillage}, ${userState} • Primary Health Center Catchment` : `${userState} • Primary Health Center Catchment`);

  const shortLocationDisplay = userDistrict
    ? `${userDistrict}, ${userState} • Catchment Zone`
    : `${userState} • PHC Catchment`;

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F7FB] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 font-sans overflow-hidden select-none">
      
      {/* 🏛️ 1. FIXED TOP OFFICIAL GOVERNMENT HEADER (DOES NOT SCROLL) */}
      <header className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs z-30">
        
        {/* DESKTOP / TABLET HEADER (>= 768px) */}
        <div className="hidden md:flex max-w-[1650px] mx-auto px-4 sm:px-6 py-2.5 items-center justify-between gap-4">
          
          {/* Left: Government of India (MoHFW) + National Health Mission */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <img
                src="/images/nha_logo.jpg"
                alt="Government of India - Ministry of Health and Family Welfare"
                className="h-12 lg:h-14 w-auto object-contain drop-shadow-xs"
              />
            </div>

            <div className="hidden sm:block h-10 lg:h-12 w-[1px] bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <img
                src="/images/nhm_logo.png"
                alt="National Health Mission"
                className="h-12 lg:h-14 w-auto object-contain drop-shadow-xs"
              />
            </div>
          </div>

          {/* Center: Dedicated Swasthya Sanchar AI Logo & Branding */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/branding/swasthya-sanchar-mark.png"
              alt="Swasthya Sanchar Emblem"
              className="h-10 lg:h-12 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105 shrink-0"
            />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl lg:text-2xl font-black text-[#0B3B74] dark:text-sky-300 tracking-tight">
                  Swasthya Sanchar
                </span>
                <span className="text-[11px] font-black bg-emerald-100 text-[#00875A] dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                  AI
                </span>
              </div>
              <div className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-wide uppercase mt-0.5">
                Citizen Health Portal • <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 normal-case">नागरिक स्वास्थ्य पोर्टल</span>
              </div>
            </div>
          </div>

          {/* Right: Clean Digital India Vector Logo + Profile Pill */}
          <div className="flex items-center gap-4">
            <img
              src="/images/digital_india_logo.svg"
              alt="Digital India - Power To Empower"
              className="h-10 lg:h-12 w-auto object-contain hidden lg:block"
            />

            <div 
              onClick={() => handleNav(ROUTES.APP.PATIENT.PROFILE)}
              className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 p-1.5 pr-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#0B3B74] text-white flex items-center justify-center font-black text-base border-2 border-emerald-500 shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                  <span>{userName}</span>
                  <span className="text-[10px] text-slate-400">⌵</span>
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>ABHA Active</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono">14-Digit Health ID</div>
              </div>
            </div>
          </div>

        </div>

        {/* MOBILE COMPACT APP HEADER (< 768px) */}
        <div className="md:hidden px-3 py-2 flex items-center justify-between gap-2">
          {/* Left: Swasthya Sanchar Logo + Portal Title */}
          <div className="flex items-center gap-2 min-w-0" onClick={() => handleNav(ROUTES.APP.PATIENT.DASHBOARD)}>
            <img
              src="/assets/branding/swasthya-sanchar-mark.png"
              alt="Swasthya Sanchar"
              className="h-8 w-auto object-contain shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-[#0B3B74] dark:text-sky-300 tracking-tight truncate">
                  Swasthya Sanchar
                </span>
                <span className="text-[9px] font-black bg-emerald-100 text-[#00875A] dark:bg-emerald-950 dark:text-emerald-300 px-1 py-0.2 rounded border border-emerald-300">
                  AI
                </span>
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                Citizen Portal • नागरिक स्वास्थ्य
              </div>
            </div>
          </div>

          {/* Right: Language Selector Pill + Profile Avatar (tap opens mobile drawer) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick 22-language dropdown */}
            <select 
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-black text-[10px] rounded-lg px-2 py-1 outline-none cursor-pointer"
              title="Change Language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.native}
                </option>
              ))}
            </select>

            {/* Profile Avatar trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full bg-[#0B3B74] text-white flex items-center justify-center font-black text-xs border-2 border-emerald-500 shadow-xs cursor-pointer relative"
              title="Account & Settings"
            >
              {userName.charAt(0).toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" />
            </button>
          </div>
        </div>

      </header>

      {/* 🇮🇳 2. FIXED DEEP BLUE SUB-HEADER RIBBON (DOES NOT SCROLL) */}
      <div className="shrink-0 bg-[#0B3B74] text-white text-xs font-semibold px-3 sm:px-6 py-1.5 sm:py-2 shadow-xs z-20">
        <div className="max-w-[1650px] mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm shrink-0">📍</span>
            <span className="font-bold text-white tracking-wide text-[11px] sm:text-xs truncate">
              <span className="hidden sm:inline">{locationDisplay}</span>
              <span className="sm:hidden">{shortLocationDisplay}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-blue-100 shrink-0">
            {/* Desktop 22-language dropdown */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-lg">
              <span className="text-xs">🌐</span>
              <span className="text-[11px] font-bold">Language (22 Indian):</span>
              <select 
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-white font-black text-xs outline-none cursor-pointer max-w-[160px]"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-900">
                    {lang.flag} {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-300 font-black text-[10px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
              <span>Live Sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MAIN WORKSPACE: FIXED LEFT SIDEBAR + SCROLLABLE RIGHT AREA */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-row overflow-hidden max-w-[1650px] w-full mx-auto px-2 sm:px-6 py-2 sm:py-4 gap-6">
        
        {/* LEFT SIDEBAR (STICKY & INDEPENDENTLY SCROLLABLE ON DESKTOP) */}
        <aside className="w-[230px] shrink-0 h-full overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-xs space-y-4 hidden lg:flex flex-col justify-between scrollbar-none">
          <div className="space-y-4">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="text-[9px] font-black text-slate-400 tracking-wider px-3 uppercase">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item, iIdx) => {
                    const active = isActive(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        key={iIdx}
                        type="button"
                        onClick={() => handleNav(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                          item.danger
                            ? 'text-rose-600 hover:bg-rose-50'
                            : active
                              ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0B3B74] dark:text-sky-300 shadow-xs border-l-4 border-[#0B3B74]'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon size={16} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            item.danger 
                              ? 'bg-rose-100 text-rose-700' 
                              : item.badge === 'AI' 
                                ? 'bg-indigo-100 text-indigo-800'
                                : item.badge === 'LEARN'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            {/* ABDM Ecosystem Card */}
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl space-y-1 text-left">
              <div className="text-[8px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                National Digital Health Mission (ABDM)
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[10px] text-[#0B3B74] dark:text-sky-300">
                <div className="w-4 h-4 rounded bg-[#0B3B74] text-white flex items-center justify-center text-[7px] font-black shrink-0">
                  ABHA
                </div>
                <span className="truncate">Ayushman Bharat Digital Health</span>
              </div>
            </div>

            {/* Footer Navigation Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
              <button
                type="button"
                onClick={() => handleNav(ROUTES.APP.PATIENT.PROFILE)}
                className="w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                ⚙️ Settings &amp; ABHA Card
              </button>
              <button
                type="button"
                onClick={() => {
                  if (showToast) showToast('ℹ️ Citizen Health Helpline: Dial 104 or 1800-11-4477', 'info');
                }}
                className="w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                ❓ Help &amp; Support
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  handleNav(ROUTES.AUTH.LOGIN);
                }}
                className="w-full text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 py-1.5 px-3 rounded-lg cursor-pointer"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT CONTAINER (THE ONLY SCROLLABLE PANE) */}
        <main className="flex-1 h-full overflow-y-auto pr-1 pb-24 lg:pb-16 scrollbar-thin">
          {children}
        </main>

      </div>

      {/* 🏛️ 4. FIXED OFFICIAL BOTTOM FOOTER (DOES NOT SCROLL) */}
      <footer className="shrink-0 bg-[#0B3B74] text-white text-[10px] sm:text-[11px] font-medium py-1.5 sm:py-2 px-3 sm:px-6 shadow-xs z-20">
        <div className="max-w-[1650px] mx-auto flex flex-col md:flex-row items-center justify-between gap-1 text-center md:text-left">
          <div>© 2026 Government of India • National Health Authority (ABDM) | All Rights Reserved</div>
          <div className="font-mono text-[9px] sm:text-[10px] text-blue-200">{userDistrict || userVillage || 'National'} Health Catchment Zone • Ver: 1.0.0</div>
        </div>
      </footer>

      {/* 📱 5. FLOATING MOBILE BOTTOM NAVIGATION BAR (FIXED ON MOBILE ONLY) */}
      <nav 
        aria-label="Mobile Navigation" 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {/* Home */}
          <button
            type="button"
            onClick={() => handleNav(ROUTES.APP.PATIENT.DASHBOARD)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isActive(ROUTES.APP.PATIENT.DASHBOARD)
                ? 'text-[#0B3B74] dark:text-sky-300 font-black bg-blue-50/80 dark:bg-blue-950/60'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-semibold'
            }`}
          >
            <HospitalIcon size={18} />
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </button>

          {/* AI Prescription Scanner */}
          <button
            type="button"
            onClick={() => handleNav(ROUTES.APP.PATIENT.TRANSLATE)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
              isActive(ROUTES.APP.PATIENT.TRANSLATE)
                ? 'text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50/80 dark:bg-indigo-950/60'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-semibold'
            }`}
          >
            <div className="relative">
              <CameraIcon size={18} />
              <span className="absolute -top-1 -right-2 text-[8px] font-black bg-indigo-600 text-white px-1 rounded-full leading-tight">AI</span>
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">AI Scanner</span>
          </button>

          {/* Pillbox */}
          <button
            type="button"
            onClick={() => handleNav(ROUTES.APP.PATIENT.REMINDERS)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isActive(ROUTES.APP.PATIENT.REMINDERS)
                ? 'text-amber-700 dark:text-amber-400 font-black bg-amber-50/80 dark:bg-amber-950/60'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-semibold'
            }`}
          >
            <PillIcon size={18} />
            <span className="text-[10px] mt-0.5 tracking-tight">Pillbox</span>
          </button>

          {/* Vault */}
          <button
            type="button"
            onClick={() => handleNav(ROUTES.APP.PATIENT.HEALTH_VAULT)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isActive(ROUTES.APP.PATIENT.HEALTH_VAULT)
                ? 'text-teal-700 dark:text-teal-400 font-black bg-teal-50/80 dark:bg-teal-950/60'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-semibold'
            }`}
          >
            <DocumentIcon size={18} />
            <span className="text-[10px] mt-0.5 tracking-tight">Records</span>
          </button>

          {/* Emergency SOS */}
          <button
            type="button"
            onClick={() => handleNav(ROUTES.APP.PATIENT.EMERGENCY)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isActive(ROUTES.APP.PATIENT.EMERGENCY)
                ? 'text-rose-600 dark:text-rose-400 font-black bg-rose-50 dark:bg-rose-950/60'
                : 'text-rose-600 hover:text-rose-700 font-bold'
            }`}
          >
            <PhoneIcon size={18} className="animate-pulse" />
            <span className="text-[10px] mt-0.5 tracking-tight text-rose-600 font-black">108 SOS</span>
          </button>
        </div>
      </nav>

      {/* Floating Swasthya AI Health Companion Pill (docked safely above bottom nav on mobile) */}
      <button
        type="button"
        onClick={() => {
          if (onOpenChat) onOpenChat();
        }}
        className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-40 bg-[#E2A233] hover:bg-[#c88d28] active:scale-95 text-slate-950 text-xs font-black px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer border border-[#E2A233]/40"
        title="Ask Swasthya AI Assistant"
      >
        <SparklesIcon size={16} className="animate-pulse text-slate-950" />
        <span className="font-extrabold">✦ Ask Swasthya AI</span>
      </button>

      {/* 📱 6. MOBILE PROFILE & SETTINGS QUICK DRAWER MODAL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full sm:max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#0B3B74] text-white flex items-center justify-center font-black text-lg border-2 border-emerald-500 shadow-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{userName}</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>ABHA Active • 14-Digit ID</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{locationDisplay}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Language Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                🌐 Indian Language (22 Scheduled)
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded-xl p-2.5 cursor-pointer outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={() => handleNav(ROUTES.APP.PATIENT.PROFILE)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-900 dark:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span>⚙️</span>
                  <span>Settings &amp; ABHA Digital Card</span>
                </div>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleNav(ROUTES.APP.PATIENT.HEALTH_MAP)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-900 dark:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span>📚</span>
                  <span>Swasthya Gyan Kendra (Health Hub)</span>
                </div>
                <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">LEARN</span>
              </button>

              <a
                href="tel:104"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-xs font-bold text-[#0B3B74] dark:text-sky-300 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span>📞</span>
                  <span>Dial 104 National Health Helpline</span>
                </div>
                <span>Call Free</span>
              </a>
            </div>

            {/* Sign Out */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  logout();
                  handleNav(ROUTES.AUTH.LOGIN);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-black transition-all cursor-pointer text-center"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientPortalLayout;
