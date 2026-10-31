import React, { useState, useEffect, useRef } from 'react';
import { 
  DocumentIcon, BrainIcon, TranslateIcon, SpeakerIcon, 
  ClockIcon, BellIcon, SparklesIcon, CheckIcon, HeartIcon, ArrowRightIcon
} from '../../shared/icons/Icons';



export const InteractiveProductShowcase = ({ onOpenChat }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const sectionRef = useRef(null);

  const steps = [
    {
      id: 1,
      num: '1',
      stepperLabel: 'Intake Slip',
      title: "Select a Prescription",
      desc: 'Digitally capture doctor slip via smartphone camera or ASHA worker tablet with instant edge-detection.',
      icon: DocumentIcon,
      badge: '01 INTAKE',
      ambientGlow: 'radial-gradient(circle, rgba(15,118,110,0.22) 0%, rgba(20,184,166,0.06) 70%, transparent 100%)',
      badgeGradient: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-teal-500/25',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
    {
      id: 2,
      num: '2',
      stepperLabel: 'Vision OCR',
      title: 'Clinical Vision OCR',
      desc: 'Neural optical model decodes complex doctor handwriting, medicine dosages (1-0-1, PC, TDS) & durations.',
      icon: BrainIcon,
      badge: '02 VISION OCR',
      ambientGlow: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(5,150,105,0.06) 70%, transparent 100%)',
      badgeGradient: 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/25',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 3,
      num: '3',
      stepperLabel: 'Simplify',
      title: 'Medical Simplification',
      desc: 'Converts pharmaceutical jargon and Latin abbreviations into plain, clear mother-tongue instructions.',
      icon: TranslateIcon,
      badge: '03 SIMPLIFY',
      ambientGlow: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(14,165,233,0.06) 70%, transparent 100%)',
      badgeGradient: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/25',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      id: 4,
      num: '4',
      stepperLabel: 'Voice Audio',
      title: 'Transcribe to Native Audio',
      desc: 'Natural synthesized voice playback in Hindi, Tamil, Telugu, Marathi & more for non-readers & elderly.',
      icon: SpeakerIcon,
      badge: '04 VOICE',
      ambientGlow: 'radial-gradient(circle, rgba(139,92,246,0.24) 0%, rgba(124,58,237,0.06) 70%, transparent 100%)',
      badgeGradient: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-purple-500/25',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      id: 5,
      num: '5',
      stepperLabel: 'Talk to Slip',
      title: 'Talk to Prescription (AI)',
      desc: 'Engage in real-time multilingual dialogue answering food timing, interactions, and precautions.',
      icon: SparklesIcon,
      badge: '05 SWASTHYA MITR',
      ambientGlow: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(239,68,68,0.08) 70%, transparent 100%)',
      badgeGradient: 'bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-amber-500/25',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 6,
      num: '6',
      stepperLabel: 'Pillbox',
      title: 'Smart Pillbox & Caregiver',
      desc: 'Visual treatment schedules with SMS alerts, 2G IVR automated voice calls, and village ASHA sync.',
      icon: BellIcon,
      badge: '06 ADHERENCE',
      ambientGlow: 'radial-gradient(circle, rgba(244,63,94,0.24) 0%, rgba(225,29,72,0.06) 70%, transparent 100%)',
      badgeGradient: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/25',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  // Auto-cycle through steps unless user hovers
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 6 ? 1 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay]);

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef}
      className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans relative py-16"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >



      {/* SECTION HEADER (Directly Over Fused Official Brand Logo) */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-black tracking-wider uppercase shadow-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CONNECTED HEALTHCARE PIPELINE</span>
          <span className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded shadow-2xs">
            Swasthya Sanchar AI™
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          From Doctor’s Slip to Everyday Understanding
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          A seamless 6-step communication journey engineered specifically for rural citizens, elderly patients, and ASHA health workers.
        </p>
      </div>

      {/* 3-COLUMN SHOWCASE WRAPPER WITH DYNAMIC FLOATING CLINICAL VITALS BADGES */}
      <div className="relative">
        
        {/* Floating Healthcare Badge 1: Auscultation / Stethoscope (Top Left) */}
        <div className="absolute -top-7 left-0 lg:-left-4 pointer-events-none z-20 animate-float-1 hidden md:flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-teal-500/30 shadow-[0_8px_24px_-4px_rgba(15,118,110,0.18)]">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-700/60 flex items-center justify-center text-teal-600 dark:text-teal-300 text-base shadow-2xs">
            🩺
          </div>
          <div className="text-left leading-tight">
            <div className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
              Auscultation
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-white">
              Clear Vitals • S1/S2 Normal
            </div>
          </div>
        </div>

        {/* Floating Healthcare Badge 2: Cardiac ECG Pulse Rhythm (Top Right) */}
        <div className="absolute -top-7 right-0 lg:-right-4 pointer-events-none z-20 animate-float-2 hidden md:flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-emerald-500/30 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.18)]">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-700/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300 text-base shadow-2xs animate-pulse">
            💓
          </div>
          <div className="text-left leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                Cardiac Rhythm
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
              <span>72 BPM</span>
              <svg className="w-10 h-3 stroke-emerald-500 fill-none ml-1" viewBox="0 0 50 15">
                <path d="M0,7 L12,7 L16,1 L20,13 L24,4 L28,9 L32,7 L50,7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Floating Healthcare Badge 3: Blood Pressure (BP) Monitor (Bottom Left) */}
        <div className="absolute -bottom-6 left-0 lg:-left-4 pointer-events-none z-20 animate-float-2 hidden lg:flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-rose-500/25 shadow-[0_8px_24px_-4px_rgba(244,63,94,0.15)]">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-700/60 flex items-center justify-center text-rose-600 dark:text-rose-300 text-base shadow-2xs">
            🩸
          </div>
          <div className="text-left leading-tight">
            <div className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">
              Blood Pressure (BP)
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>120/80 mmHg</span>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                Optimal
              </span>
            </div>
          </div>
        </div>

        {/* Floating Healthcare Badge 4: Smart Rx Intake / ASHA Sync (Bottom Right) */}
        <div className="absolute -bottom-6 right-0 lg:-right-4 pointer-events-none z-20 animate-float-1 hidden lg:flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-amber-500/25 shadow-[0_8px_24px_-4px_rgba(245,158,11,0.15)]">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-300 text-base shadow-2xs">
            💊
          </div>
          <div className="text-left leading-tight">
            <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
              Prescription Rx Sync
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>Paracetamol 650mg</span>
              <span className="bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                ASHA ✓
              </span>
            </div>
          </div>
        </div>

        {/* 3-COLUMN SHOWCASE: LEFT 3 CARDS | CENTER LEVITATING PHONE | RIGHT 3 CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* ======================================================== */}
        {/* LEFT FLANK: Steps 1, 2, 3                                */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-5">
          {steps.slice(0, 3).map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className="group relative cursor-pointer text-left"
              >
                {/* 🌟 Soft Ambient Pastel Backlight Aura */}
                <div 
                  className={`absolute -inset-1.5 rounded-3xl transition-all duration-500 blur-xl pointer-events-none ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-75 scale-95'
                  }`}
                  style={{ background: s.ambientGlow }}
                />

                {/* Card Surface - with overflow-hidden to prevent active bar bleed */}
                <div className={`relative p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 border-[#0F766E] dark:border-teal-400 shadow-[0_16px_36px_-6px_rgba(15,118,110,0.18)] -translate-y-1.5'
                    : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 group-hover:border-slate-300 dark:group-hover:border-slate-700'
                }`}>
                  {/* Active Indicator Bar - clipped cleanly inside rounded-3xl */}
                  {isActive && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#0F766E] to-emerald-400" />
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-xs transition-transform group-hover:scale-105 ${s.badgeGradient}`}>
                        {s.num}
                      </span>
                      <Icon size={20} className={s.iconColor} />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className={`text-base sm:text-lg font-black tracking-tight transition-colors ${
                    isActive ? 'text-[#0F766E] dark:text-teal-300' : 'text-slate-900 dark:text-white'
                  }`}>
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5 font-normal">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* CENTER: LEVITATING 3D PHONE (Clean Backlight, No Bleed) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 flex justify-center py-2 relative">
          
          {/* 🌟 Strictly Contained Ambient Radial Halo Behind Phone */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-300/25 via-teal-300/20 to-emerald-300/15 blur-3xl rounded-[60px] transform scale-95 pointer-events-none -z-0" />

          {/* ======================================================== */}
          {/* 🌟 LEVITATING 3D SMARTPHONE (Slow Up-Down Floating Motion) */}
          {/* ======================================================== */}
          <div className="relative z-10 animate-phone-float">
            
            {/* Premium Metallic Titanium-Gold Chassis */}
            <div className="relative w-[315px] sm:w-[335px] rounded-[48px] p-1.5 bg-gradient-to-b from-[#EAD5A8] via-[#D4B36D] to-[#996F33] shadow-[0_28px_65px_-12px_rgba(180,130,50,0.4),0_15px_30px_-6px_rgba(15,118,110,0.25)] border border-[#F8ECD2]">
              
              {/* Thin Black Bezel Ring */}
              <div className="rounded-[44px] p-0.5 bg-black shadow-inner">
                
                {/* 🌟 BRIGHT, RADIANT LIGHT HEALTHCARE SCREEN */}
                <div className="w-full h-[630px] rounded-[42px] bg-gradient-to-b from-[#FAF8F5] via-[#FFFFFF] to-[#F1F5F9] text-slate-900 flex flex-col overflow-hidden relative font-sans shadow-inner border border-slate-200/60">
                  
                  {/* Dynamic Island Notch */}
                  <div className="w-22 h-4 bg-black rounded-full mx-auto mt-2 mb-1 flex items-center justify-between px-2.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  {/* Status Bar */}
                  <div className="px-5 py-0.5 flex items-center justify-between text-[10px] font-mono text-slate-500 font-bold">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-sans font-bold">5G</span>
                      <span className="text-[11px]">🔋</span>
                    </div>
                  </div>

                  {/* Full Brand Name: Swasthya Sanchar AI™ with Official Logo Mark */}
                  <div className="pt-1.5 pb-2 px-3 text-center border-b border-slate-100 flex items-center justify-center gap-1.5 bg-white/90">
                    <img 
                      src="/assets/branding/swasthya-sanchar-mark.png" 
                      alt="Swasthya Sanchar Mark" 
                      className="w-5 h-5 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-black tracking-tight text-slate-900">
                        Swasthya <span className="text-[#0F766E]">Sanchar</span>
                      </span>
                      <span className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                        AI
                      </span>
                      <sup className="text-[8px] font-bold text-slate-400">™</sup>
                    </div>
                  </div>

                  {/* Connected Stepper Timeline with Micro-Labels */}
                  <div className="px-3 pt-2 pb-2 bg-slate-50/80 border-b border-slate-200/60 relative">
                    <div className="absolute top-[18px] left-6 right-6 h-[1.5px] bg-slate-200 -z-0" />
                    <div className="relative flex items-start justify-between z-10">
                      {steps.map((st) => {
                        const isCurrent = activeStep === st.id;
                        const isPassed = activeStep > st.id;
                        return (
                          <div 
                            key={st.id} 
                            onClick={() => setActiveStep(st.id)}
                            className="flex flex-col items-center cursor-pointer group"
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                              isCurrent
                                ? 'bg-white border-2 border-[#0F766E] text-[#0F766E] ring-2 ring-teal-400/40 scale-120 shadow-sm'
                                : isPassed
                                ? 'bg-[#0F766E] text-white border border-[#0F766E]'
                                : 'bg-white text-slate-400 border border-slate-300 group-hover:border-slate-400'
                            }`}>
                              {isPassed ? '✓' : st.num}
                            </div>
                            <span className={`text-[8px] font-bold tracking-tight text-center mt-1 max-w-[44px] leading-tight transition-colors ${
                              isCurrent ? 'text-[#0F766E] font-black' : 'text-slate-500'
                            }`}>
                              {st.stepperLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Pill Badge */}
                  <div className="flex justify-center pt-1.5">
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-teal-700 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-2xs">
                      <span>Prescription to Conversational</span>
                      <span className="bg-white/25 px-1 rounded text-[9px]">AI</span>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* HYPER-REALISTIC DOCTOR PRESCRIPTION SLIP GRAPHIC         */}
                  {/* & DYNAMIC VISION OCR EXTRACTION HUD                      */}
                  {/* ======================================================== */}
                  <div className="flex-1 px-3 py-1.5 flex flex-col justify-between overflow-y-auto no-scrollbar">
                    
                    {/* Authentic Medical Slip with Pen Cursive & Rubber Stamp */}
                    <div className="relative bg-[#FFFDF9] rounded-2xl p-2.5 text-slate-900 border border-amber-200/80 shadow-xs overflow-hidden">
                      
                      {/* Clinic Header */}
                      <div className="border-b border-slate-200/80 pb-1.5 mb-1.5 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-serif font-black text-teal-950 flex items-center gap-1">
                            <span>℞ PRIMARY HEALTH CENTRE (PHC)</span>
                            <span className="text-[8px] bg-teal-100 text-teal-800 px-1 rounded font-sans font-bold">GOVT OF INDIA</span>
                          </div>
                          <div className="text-[8px] text-slate-500 font-mono">
                            Dr. S. K. Sharma, MBBS • Reg No: 48921-UP
                          </div>
                        </div>
                        <div className="text-[8px] font-mono text-slate-400 text-right">
                          Date: 24-Oct<br />Pt: Ramesh (58/M)
                        </div>
                      </div>

                      {/* Handwritten Prescriptions with Dynamic OCR Bounding Boxes */}
                      <div className="space-y-1 font-serif text-[10.5px] relative">
                        
                        {/* Medicine 1: Paracetamol */}
                        <div className="relative p-1 rounded transition-colors group">
                          <div className="text-slate-800 font-bold italic">
                            1. Tab. Paracetamol 650mg — 1-0-1 PC (3d)
                          </div>
                          {/* Live Dynamic Vision OCR Bounding Box */}
                          <div className="absolute inset-0 border border-emerald-500/80 bg-emerald-500/10 rounded flex items-center justify-end px-1 pointer-events-none">
                            <span className="text-[7.5px] bg-emerald-600 text-white font-mono font-bold px-1 rounded shadow-2xs">
                              99.4% OCR
                            </span>
                          </div>
                        </div>

                        {/* Medicine 2: Amoxicillin */}
                        <div className="relative p-1 rounded transition-colors group">
                          <div className="text-slate-800 font-bold italic">
                            2. Cap. Amoxicillin 500mg — 1-1-1 PC (5d)
                          </div>
                          <div className="absolute inset-0 border border-cyan-500/80 bg-cyan-500/10 rounded flex items-center justify-end px-1 pointer-events-none">
                            <span className="text-[7.5px] bg-cyan-600 text-white font-mono font-bold px-1 rounded shadow-2xs">
                              98.8% OCR
                            </span>
                          </div>
                        </div>

                        {/* Medicine 3: Cetirizine */}
                        <div className="relative p-1 rounded transition-colors group">
                          <div className="text-slate-800 font-bold italic">
                            3. Tab. Cetirizine 10mg — 0-0-1 HS (3d)
                          </div>
                          <div className="absolute inset-0 border border-amber-500/80 bg-amber-500/10 rounded flex items-center justify-end px-1 pointer-events-none">
                            <span className="text-[7.5px] bg-amber-600 text-white font-mono font-bold px-1 rounded shadow-2xs">
                              99.1% OCR
                            </span>
                          </div>
                        </div>

                        {/* Clinic Stamp & Doctor Signature */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[8px] font-sans">
                          {/* Circular Government PHC Stamp */}
                          <div className="border border-rose-400 text-rose-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90 -rotate-3 bg-rose-50/50">
                            ✓ PHC CLINIC SEAL
                          </div>
                          {/* Doctor Script Signature */}
                          <div className="font-serif italic text-slate-500 font-bold">
                            Signed: Dr. S.K. Sharma
                          </div>
                        </div>

                      </div>

                      {/* Animated Luminous Laser Scan Bar */}
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0F766E] to-transparent shadow-[0_0_12px_#14b8a6] animate-laser-scan pointer-events-none" />
                    </div>

                    {/* DYNAMIC CONTEXTUAL EXTRACTION CARDS (Based on activeStep) */}

                    {/* STEP 1: INTAKE & AUTO-EDGE DETECTION */}
                    {activeStep === 1 && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="bg-teal-50/90 p-2 rounded-xl border border-teal-200 text-center">
                          <span className="text-[10.5px] font-mono text-[#0F766E] font-bold flex items-center justify-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-ping" />
                            <span>Prescription Auto-Detection Active (300 DPI)</span>
                          </span>
                        </div>
                        <div 
                          onClick={() => setActiveStep(2)}
                          className="bg-white hover:bg-slate-50 p-2 rounded-xl border border-slate-200 text-left cursor-pointer shadow-2xs transition-colors flex items-center justify-between"
                        >
                          <span className="text-[10px] font-medium text-slate-700">📄 What does this prescription describe?</span>
                          <span className="text-teal-600 font-bold text-xs">➔</span>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: CLINICAL OCR & JAN AUSHADHI GENERIC MATCH */}
                    {activeStep === 2 && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-left">
                          <div>
                            <div className="text-[11px] font-extrabold text-slate-900">Paracetamol 650mg</div>
                            <div className="text-[9px] text-teal-700 font-bold">1-0-1 • Twice daily after meals</div>
                          </div>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                            99.4% Match
                          </span>
                        </div>

                        {/* Jan Aushadhi Savings Badge */}
                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[10px]">
                          <span className="font-bold text-emerald-900">Jan Aushadhi Generic: ₹12</span>
                          <span className="bg-emerald-600 text-white font-mono font-black px-1.5 py-0.5 rounded text-[8.5px]">
                            Save 70%+
                          </span>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: MEDICAL SIMPLIFICATION IN MOTHER TONGUE */}
                    {activeStep === 3 && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-2.5 rounded-xl border border-teal-200 space-y-1 shadow-2xs">
                          <div className="text-[9.5px] font-mono text-[#0F766E] font-black uppercase tracking-wider">
                            💊 सरल खुराक निर्देश (Hindi):
                          </div>
                          <div className="text-[11px] font-bold text-slate-800 leading-snug">
                            सुबह नाश्ते के बाद और रात को खाने के बाद 1-1 गोली पानी से लें।
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-1.5 text-center text-xs">
                          <div className="p-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex-1">
                            <span className="text-base">☀️</span>
                            <div className="text-[9.5px] font-bold text-slate-800">सुबह 1 गोली</div>
                            <div className="text-[8.5px] text-slate-500">नाश्ते के बाद</div>
                          </div>
                          <div className="p-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex-1">
                            <span className="text-base">🌙</span>
                            <div className="text-[9.5px] font-bold text-slate-800">रात 1 गोली</div>
                            <div className="text-[8.5px] text-slate-500">भोजन के बाद</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: TRANSCRIBE TO NATIVE AUDIO */}
                    {activeStep === 4 && (
                      <div className="space-y-1.5 animate-fadeIn text-center">
                        <div className="p-2 bg-amber-50/90 rounded-xl border border-amber-200 space-y-1 shadow-2xs">
                          <div className="flex items-center justify-center gap-1.5 h-7">
                            {[10, 20, 32, 18, 28, 36, 22, 12].map((h, i) => (
                              <div
                                key={i}
                                className="w-1.5 bg-gradient-to-t from-amber-500 to-amber-600 rounded-full animate-pulse"
                                style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                              />
                            ))}
                          </div>
                          <div className="text-[10px] font-bold text-amber-900 leading-tight">
                            "नमस्ते, अपनी सुबह की दवा नाश्ते के बाद 1 गोली पानी से लें।"
                          </div>
                        </div>

                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-full bg-[#0F766E] hover:bg-[#0A4D48] text-white font-black text-xs py-1.5 rounded-xl shadow-xs flex items-center justify-center gap-2"
                        >
                          <SpeakerIcon size={13} color="#fff" />
                          <span>{isPlayingAudio ? 'Playing Spoken Voice...' : '🔊 Listen Audio Guidance'}</span>
                        </button>
                      </div>
                    )}

                    {/* STEP 5: TALK TO PRESCRIPTION (AI SWASTHYA MITR) */}
                    {activeStep === 5 && (
                      <div className="space-y-1.5 animate-fadeIn text-xs">
                        <div className="space-y-1">
                          <div className="bg-slate-100 p-2 rounded-xl rounded-tl-xs max-w-[85%] text-slate-800 font-medium text-[10.5px]">
                            क्या मैं यह दवा खाली पेट ले सकता हूँ?
                          </div>
                          <div className="bg-[#0F766E] p-2 rounded-xl rounded-tr-xs max-w-[90%] ml-auto text-white leading-relaxed font-semibold text-[10.5px] shadow-2xs">
                            नहीं, डॉक्टर की सलाह के अनुसार यह दवा हमेशा भोजन के बाद ही लें ताकि पेट में जलन न हो।
                          </div>
                        </div>

                        {onOpenChat && (
                          <button
                            onClick={onOpenChat}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[11px] py-1.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <SparklesIcon size={13} />
                            <span>Ask Live AI Medical Assistant</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* STEP 6: SMART PILLBOX & ASHA WORKER SYNC */}
                    {activeStep === 6 && (
                      <div className="space-y-1.5 animate-fadeIn text-xs">
                        <div className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                          <span className="font-semibold text-slate-800 text-[10.5px]">☀️ Morning Dose (8:30 AM)</span>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[9.5px]">✓ Taken</span>
                        </div>
                        <div className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                          <span className="font-semibold text-slate-800 text-[10.5px]">🌙 Night Dose (9:00 PM)</span>
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[9.5px]">⏰ Pending</span>
                        </div>
                        <div className="p-1.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                          <span className="text-[9.5px] font-bold text-rose-900">ASHA Worker: Sunita Devi Notified</span>
                          <span className="text-xs">👩‍⚕️</span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Conversational Input Bar */}
                    <div className="pt-2 border-t border-slate-200/80 mt-auto">
                      <div 
                        onClick={onOpenChat}
                        className="bg-white rounded-full px-3 py-1.5 border border-slate-300 shadow-sm flex items-center justify-between text-xs text-slate-500 cursor-pointer hover:border-[#0F766E] transition-colors"
                      >
                        <span className="truncate text-[10.5px] font-medium">Ask Swasthya Mitr...</span>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            हि ▾
                          </span>
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-2xs">
                            🎙️
                          </div>
                          <div className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
                            ➔
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Phone Bottom Home Bar Indicator */}
                  <div className="w-24 h-1 bg-slate-400 rounded-full mx-auto my-1.5" />
                </div>
              </div>
            </div>

            {/* Subtle Synchronized Ground Shadow below Levitating Phone */}
            <div className="w-48 h-3.5 bg-slate-900/15 dark:bg-teal-950/40 rounded-full blur-md mx-auto mt-3" />
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT FLANK: Steps 4, 5, 6                               */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-5">
          {steps.slice(3, 6).map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className="group relative cursor-pointer text-left"
              >
                {/* 🌟 Soft Ambient Pastel Backlight Aura */}
                <div 
                  className={`absolute -inset-1.5 rounded-3xl transition-all duration-500 blur-xl pointer-events-none ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-75 scale-95'
                  }`}
                  style={{ background: s.ambientGlow }}
                />

                {/* Card Surface - with overflow-hidden to prevent active bar bleed */}
                <div className={`relative p-6 rounded-3xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 border-[#0F766E] dark:border-teal-400 shadow-[0_16px_36px_-6px_rgba(15,118,110,0.18)] -translate-y-1.5'
                    : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 group-hover:border-slate-300 dark:group-hover:border-slate-700'
                }`}>
                  {/* Active Indicator Bar - clipped cleanly inside rounded-3xl */}
                  {isActive && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#0F766E] to-emerald-400" />
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-xs transition-transform group-hover:scale-105 ${s.badgeGradient}`}>
                        {s.num}
                      </span>
                      <Icon size={20} className={s.iconColor} />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className={`text-base sm:text-lg font-black tracking-tight transition-colors ${
                    isActive ? 'text-[#0F766E] dark:text-teal-300' : 'text-slate-900 dark:text-white'
                  }`}>
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-1.5 font-normal">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
      </div>
    </section>
  );
};

export default InteractiveProductShowcase;
