import React, { useState, useEffect } from 'react';

export const VernacularLanguageSlider = () => {
  const [logoRevealed, setLogoRevealed] = useState(false);

  useEffect(() => {
    // Trigger logo creation animation on mount
    const timer = setTimeout(() => {
      setLogoRevealed(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // 🌟 Track 1: First 11 Scheduled Languages (Eighth Schedule of the Constitution of India)
  const scheduledLanguagesGroup1 = [
    { script: 'हिंदी', eng: 'Hindi', region: 'North & Central India', color: 'from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200' },
    { script: 'বাংলা', eng: 'Bengali', region: 'West Bengal & Tripura', color: 'from-rose-500/10 to-pink-500/10 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200' },
    { script: 'मराठी', eng: 'Marathi', region: 'Maharashtra', color: 'from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-900/60 text-orange-900 dark:text-orange-200' },
    { script: 'తెలుగు', eng: 'Telugu', region: 'Andhra & Telangana', color: 'from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200' },
    { script: 'தமிழ்', eng: 'Tamil', region: 'Tamil Nadu & Puducherry', color: 'from-teal-500/10 to-emerald-500/10 border-teal-200 dark:border-teal-900/60 text-teal-900 dark:text-teal-200' },
    { script: 'ગુજરાતી', eng: 'Gujarati', region: 'Gujarat', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200' },
    { script: 'اردو', eng: 'Urdu', region: 'Pan-India', color: 'from-emerald-500/10 to-green-500/10 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200' },
    { script: 'ಕನ್ನಡ', eng: 'Kannada', region: 'Karnataka', color: 'from-purple-500/10 to-violet-500/10 border-purple-200 dark:border-purple-900/60 text-purple-900 dark:text-purple-200' },
    { script: 'ଓଡ଼ିଆ', eng: 'Odia', region: 'Odisha', color: 'from-teal-500/10 to-cyan-500/10 border-teal-200 dark:border-teal-900/60 text-teal-900 dark:text-teal-200' },
    { script: 'മലയാളം', eng: 'Malayalam', region: 'Kerala & Lakshadweep', color: 'from-cyan-500/10 to-sky-500/10 border-cyan-200 dark:border-cyan-900/60 text-cyan-900 dark:text-cyan-200' },
    { script: 'ਪੰਜਾਬੀ', eng: 'Punjabi', region: 'Punjab & Chandigarh', color: 'from-amber-500/10 to-yellow-500/10 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200' },
  ];

  // 🌟 Track 2: Remaining 11 Scheduled Languages + Prominent Regional Mother Tongues
  const scheduledLanguagesGroup2 = [
    { script: 'অসমীয়া', eng: 'Assamese', region: 'Assam', color: 'from-indigo-500/10 to-blue-500/10 border-indigo-200 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200' },
    { script: 'मैथिली', eng: 'Maithili', region: 'Bihar & Mithilanchal', color: 'from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-900/60 text-purple-900 dark:text-purple-200' },
    { script: 'संताली', eng: 'Santali', region: 'Jharkhand, Odisha & WB', color: 'from-amber-500/10 to-stone-500/10 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200' },
    { script: 'کٲشُر', eng: 'Kashmiri', region: 'Jammu & Kashmir', color: 'from-sky-500/10 to-teal-500/10 border-sky-200 dark:border-sky-900/60 text-sky-900 dark:text-sky-200' },
    { script: 'नेपाली', eng: 'Nepali', region: 'Sikkim & West Bengal', color: 'from-rose-500/10 to-red-500/10 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200' },
    { script: 'कोंकणी', eng: 'Konkani', region: 'Goa & Coastal Karnataka', color: 'from-teal-500/10 to-emerald-500/10 border-teal-200 dark:border-teal-900/60 text-teal-900 dark:text-teal-200' },
    { script: 'سنڌي', eng: 'Sindhi', region: 'Pan-India', color: 'from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-900/60 text-orange-900 dark:text-orange-200' },
    { script: 'डोगरी', eng: 'Dogri', region: 'Jammu & HP', color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200' },
    { script: 'बर’', eng: 'Bodo', region: 'Bodoland & Assam', color: 'from-emerald-500/10 to-green-500/10 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200' },
    { script: 'মৈতৈলোন্', eng: 'Manipuri', region: 'Manipur', color: 'from-violet-500/10 to-purple-500/10 border-violet-200 dark:border-violet-900/60 text-violet-900 dark:text-violet-200' },
    { script: 'संस्कृतम्', eng: 'Sanskrit', region: 'Classical Heritage', color: 'from-amber-500/10 to-yellow-500/10 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200' },
    { script: 'भोजपुरी', eng: 'Bhojpuri', region: 'Eastern UP & Bihar', color: 'from-rose-500/10 to-orange-500/10 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200' },
    { script: 'मारवाड़ी', eng: 'Marwari', region: 'Rajasthan', color: 'from-amber-500/10 to-red-500/10 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200' },
  ];

  // 🌟 Track 3: Clinical Actions & Vernacular Medical Terminology
  const clinicalActions = [
    { icon: '💊', hindi: 'खुराक निर्देश', eng: 'Vernacular Dosage Guide' },
    { icon: '🩺', hindi: 'डॉक्टर की पर्ची', eng: 'Doctor Slip Vision OCR' },
    { icon: '🔊', hindi: 'मातृभाषा ऑडियो', eng: 'Dialect Spoken Audio' },
    { icon: '🏥', hindi: 'जन औषधि बचत', eng: 'Jan Aushadhi 70%+ Savings' },
    { icon: '☀️', hindi: 'सुबह-शाम खुराक', eng: 'Morning & Night Pillbox' },
    { icon: '📱', hindi: '2G फोन कॉल', eng: 'IVR Voice Call Reminders' },
    { icon: '⚡', hindi: '100% बायो-इक्विवेलेंट', eng: 'ABDM Privacy Compliant' },
    { icon: '🧪', hindi: 'दवा संरचना', eng: 'Active Chemical Salt Breakdown' },
    { icon: '⚠️', hindi: 'भोजन व परहेज', eng: 'Food Timing & Precautions' },
  ];

  // 🌟 Track 4: Frontline Rural Healthcare & Emergency Ecosystem
  const ruralEcosystem = [
    { icon: '👩‍⚕️', hindi: 'आशा कार्यकर्ता सिंक', eng: 'ASHA Worker Mobile Portal' },
    { icon: '🚨', hindi: '108 आपातकालीन सेवा', eng: '2G Offline Emergency SOS' },
    { icon: '🏥', hindi: 'प्राथमिक स्वास्थ्य केंद्र', eng: 'PHC Doctor Verification' },
    { icon: '👵', hindi: 'बुजुर्ग मरीज सहायता', eng: 'Elderly 1-Tap Voice Mode' },
    { icon: '👶', hindi: 'मातृ-शिशु स्वास्थ्य', eng: 'ANC Pregnancy Guidelines' },
    { icon: '📋', hindi: 'आयुष्मान भारत कार्ड', eng: 'ABHA Health ID Integration' },
    { icon: '💬', hindi: 'स्वास्थ्य मित्र एआई', eng: 'Interactive Swasthya Mitr' },
    { icon: '📶', hindi: 'बिना इंटरनेट पर्ची', eng: 'Offline-First Local Storage' },
  ];

  // Duplicate for seamless infinite loop
  const row1 = [...scheduledLanguagesGroup1, ...scheduledLanguagesGroup1];
  const row2 = [...scheduledLanguagesGroup2, ...scheduledLanguagesGroup2];
  const row3 = [...clinicalActions, ...clinicalActions];
  const row4 = [...ruralEcosystem, ...ruralEcosystem];

  return (
    <section className="relative py-16 overflow-hidden font-sans border-y border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* ======================================================== */}
      {/* 🌟 CINEMATIC BACKGROUND LOGO ASSEMBLY ANIMATION          */}
      {/* Logo sweeps from Right to Left into Center to Assemble   */}
      {/* ======================================================== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        
        {/* Soft Radial Ambient Aura */}
        <div className="w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-teal-400/25 via-emerald-300/20 to-amber-300/25 dark:from-teal-800/35 dark:via-emerald-900/30 dark:to-amber-900/20 blur-[80px]" />

        {/* The Animated Logo Emblem Converging from Right to Center */}
        <div className={`transition-all duration-1000 ease-out transform flex flex-col items-center justify-center ${
          logoRevealed 
            ? 'opacity-45 dark:opacity-60 translate-x-0 scale-100' 
            : 'opacity-0 translate-x-80 scale-75'
        }`}>
          <div className="relative">
            <img 
              src="/assets/branding/swasthya-sanchar-mark.png" 
              alt="Swasthya Sanchar AI Emblem"
              className="w-56 sm:w-72 h-56 sm:h-72 object-contain filter drop-shadow-[0_0_50px_rgba(15,118,110,0.6)]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            {/* Glowing Heartbeat Pulse Trail */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-64 h-64 rounded-full border-2 border-teal-500/50 animate-ping opacity-40" />
            </div>
          </div>

          <div className="text-center mt-3">
            <span className="text-xs sm:text-sm font-black tracking-widest text-[#0F766E] dark:text-teal-300 uppercase font-mono bg-white/70 dark:bg-slate-900/70 px-3 py-1 rounded-full border border-teal-200/80 dark:border-teal-800/80 shadow-xs">
              स्वास्थ्य संचार AI • SWASTHYA SANCHAR AI
            </span>
          </div>
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4 mb-9 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-black tracking-widest uppercase shadow-2xs">
          <span>🇮🇳 ALL 22 CONSTITUTIONAL LANGUAGES + DIALECTS</span>
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Pan-India Healthcare Communication for 1.4 Billion Citizens
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Every doctor prescription, dosage timing, and safety precaution decoded into your mother tongue with authentic voice audio.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 🌟 4 COMPACT ALTERNATING SLIDING TRACKS ("OCEAN OF INTELLIGENCE") */}
      {/* ======================================================== */}
      <div className="relative z-10 space-y-3">
        
        {/* ROW 1: SCHEDULED LANGUAGES 1-11 (SLIDING LEFT ➔ RIGHT) */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee-left py-0.5 flex items-center gap-3 w-max">
            {row1.map((lang, idx) => (
              <div
                key={`r1-${lang.eng}-${idx}`}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-md ${lang.color}`}
              >
                <span className="text-sm font-black tracking-tight">{lang.script}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">• {lang.eng}</span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">({lang.region})</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: SCHEDULED LANGUAGES 12-22 + DIALECTS (SLIDING RIGHT ➔ LEFT) */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee-right py-0.5 flex items-center gap-3 w-max">
            {row2.map((lang, idx) => (
              <div
                key={`r2-${lang.eng}-${idx}`}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-md ${lang.color}`}
              >
                <span className="text-sm font-black tracking-tight">{lang.script}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">• {lang.eng}</span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">({lang.region})</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: CLINICAL ACTIONS & MEDICAL TERMS (SLIDING LEFT ➔ RIGHT) */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee-left py-0.5 flex items-center gap-3 w-max">
            {row3.map((feat, idx) => (
              <div
                key={`r3-${feat.eng}-${idx}`}
                className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-400 hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-md"
              >
                <span className="text-sm">{feat.icon}</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">{feat.hindi}</span>
                <span className="text-[11px] font-medium text-[#0F766E] dark:text-teal-300 font-mono">• {feat.eng}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4: FRONTLINE HEALTHCARE & EMERGENCY (SLIDING RIGHT ➔ LEFT) */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee-right py-0.5 flex items-center gap-3 w-max">
            {row4.map((feat, idx) => (
              <div
                key={`r4-${feat.eng}-${idx}`}
                className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-400 hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-md"
              >
                <span className="text-sm">{feat.icon}</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">{feat.hindi}</span>
                <span className="text-[11px] font-medium text-[#0F766E] dark:text-teal-300 font-mono">• {feat.eng}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};

export default VernacularLanguageSlider;
