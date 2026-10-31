import React from 'react';

// 🇮🇳 Tricolor Ribbon Wave Vector
export const IndianFlagWaveSwoosh = () => (
  <svg width="120" height="42" viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-xs">
    <path d="M0 8 Q 45 0, 85 14 T 140 6 L 140 20 Q 95 28, 55 14 T 0 22 Z" fill="#FF9933" />
    <path d="M0 20 Q 45 12, 85 26 T 140 18 L 140 32 Q 95 40, 55 26 T 0 34 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
    <circle cx="70" cy="27" r="4.5" fill="none" stroke="#000080" strokeWidth="1" />
    <path d="M0 32 Q 45 24, 85 38 T 140 30 L 140 44 Q 95 52, 55 38 T 0 46 Z" fill="#138808" />
  </svg>
);

export const GovtHeaderBanner = ({ 
  subtitle = "Swasthya Sanchar ABDM Village Registry | स्वास्थ्य संचार ABDM ग्राम रजिस्ट्री",
  showSisterProfile = true,
  rightCustomBadge = null
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      
      {/* 🏛️ 1. TOP OFFICIAL GOVERNMENT LOGOS STRIP */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: 3 Official Government Logos + Swasthya Sanchar Dedicated Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-5 flex-wrap">
          
          {/* Logo 1: National Health Authority & Ministry of Health & Family Welfare (with Ashoka Lion) */}
          <div className="flex items-center gap-2">
            <img
              src="/images/nha_logo.jpg"
              alt="National Health Authority, Ministry of Health and Family Welfare, Government of India"
              className="h-9 sm:h-12 md:h-14 w-auto object-contain drop-shadow-xs"
            />
          </div>

          <div className="hidden sm:block h-10 md:h-12 w-[1.5px] bg-slate-200 dark:bg-slate-700" />

          {/* Logo 2: National Health Mission (NHM) */}
          <div className="flex items-center gap-2">
            <img
              src="/images/nhm_logo.png"
              alt="National Health Mission - राष्ट्रीय स्वास्थ्य मिशन"
              className="h-9 sm:h-12 md:h-14 w-auto object-contain drop-shadow-xs"
            />
          </div>

          <div className="hidden sm:block h-10 md:h-12 w-[1.5px] bg-slate-200 dark:bg-slate-700" />

          {/* Logo 3: Dedicated Swasthya Sanchar Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <img
              src="/assets/branding/swasthya-sanchar-mark.png"
              alt="Swasthya Sanchar Emblem"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain drop-shadow-xs transition-transform hover:scale-105"
            />
            <div className="hidden md:block leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-[#0B3B74] dark:text-sky-300 tracking-tight">Swasthya Sanchar</span>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-300">AI</span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold">स्वास्थ संचार • National Health Portal</div>
            </div>
          </div>

          <div className="hidden lg:block h-10 md:h-12 w-[1.5px] bg-slate-200 dark:bg-slate-700" />

          {/* Logo 4: Ayushman Bharat PM-JAY / Digital India */}
          <div className="hidden sm:flex items-center gap-2">
            <img
              src="/images/digital_india_logo.svg"
              alt="Digital India - Power to Empower"
              className="h-8 sm:h-11 md:h-12 w-auto object-contain"
            />
          </div>

        </div>

        {/* Right: Indian Flag Wave + Sister Lakshmi Devi Profile Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block">
            <IndianFlagWaveSwoosh />
          </div>

          {rightCustomBadge ? (
            rightCustomBadge
          ) : showSisterProfile ? (
            <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-50 dark:bg-slate-800 p-1 sm:p-1.5 pr-2.5 sm:pr-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <img
                src="/images/asha_sister_action.jpg"
                alt="Sister Lakshmi Devi"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div className="text-left leading-tight">
                <div className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white">Sister Lakshmi Devi</div>
                <div className="text-[9px] sm:text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">ASHA Worker</div>
                <div className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 hidden xs:block">PHC Mandya (KA)</div>
              </div>
            </div>
          ) : null}
        </div>

      </div>

      {/* 🇮🇳 2. DEEP BLUE OFFICIAL SUB-BANNER */}
      <div className="bg-[#0B3B74] text-white px-4 md:px-6 py-2.5 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-wide">
            {subtitle}
          </h1>
          <div className="text-[11px] font-bold text-blue-100 flex items-center gap-2">
            <span>Mandya Catchment Area #2</span>
            <span>•</span>
            <span className="text-emerald-300 font-black">● Live ABDM &amp; NHM Sync</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GovtHeaderBanner;
