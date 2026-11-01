import React, { useState } from 'react';
import { 
  SpeakerIcon, ShieldIcon, CheckIcon, AlertIcon, SparklesIcon, 
  PillIcon, PhoneIcon, ArrowRightIcon 
} from '../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../shared/utils/speech';

export const ClinicalAgentLiveHud = () => {
  const [activeScenarioKey, setActiveScenarioKey] = useState('lakshmi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const scenarios = {
    lakshmi: {
      id: 'lakshmi',
      title: 'Lakshmi Devi (52y)',
      condition: 'Viral Bronchitis & Acidity',
      badge: 'VERIFIED REGIMEN',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
      facility: 'Primary Health Centre (PHC) Rampur',
      doctor: 'Dr. R. K. Sharma, MBBS (Medical Officer)',
      confidence: '98%',
      sop: 'CDSCO Pharmacovigilance & ABDM Schedule H Regimen Protocol (2024)',
      actionPriority: '[Priority 1 Clinical Action]: Schedule 5-Day Visual Pillbox with Vernacular Voice Prompts',
      medicines: [
        { name: 'Dolo 650mg', visual: 'White Round', slot: 'Morning & Night (after meals)', color: 'bg-slate-100 text-slate-800' },
        { name: 'Amoxicillin 500mg', visual: 'Red-Yellow Capsule', slot: 'Morning & Night (after meals)', color: 'bg-amber-100 text-amber-900' },
        { name: 'Pantocid 40mg', visual: 'Yellow Round', slot: 'Morning (empty stomach)', color: 'bg-yellow-100 text-yellow-900' },
      ],
      sentinelStatus: 'CLEARED: Zero drug-drug interactions detected. Regimen safe for rural patient.',
      sentinelRisk: 'SAFE',
      lang: 'hi',
      langName: 'Hindi (हिंदी)',
      script: 'नमस्ते Smt. Lakshmi Devi ji! Aapki dawai: Dolo (white goli), Amoxicillin (red-yellow capsule) subah aur raat khane ke baad. Pantocid subah khali pet lein!',
      pillboxStatus: '5-Day Visual Pillbox Matrix Generated (Day 1 - Day 5)'
    },
    venkat: {
      id: 'venkat',
      title: 'Venkat Rao (64y)',
      condition: 'Overdose & Acute Chest Pain',
      badge: 'CRITICAL TOXICITY INTERCEPT',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse',
      facility: 'Kurnool Rural Health Sub-Centre',
      doctor: 'Dr. A. Srinivas, MBBS',
      confidence: '99%',
      sop: 'National Emergency Medical Dispatch Protocol & Drug Overdose Guardrail',
      actionPriority: '[Priority 1 Emergency Action]: HALT Medication & Dispatch Immediate SOS to ASHA Worker',
      medicines: [
        { name: 'Dolo 650mg TDS', visual: 'Paracetamol 1950mg/24h', slot: 'Morning, Noon, Night', color: 'bg-rose-100 text-rose-900' },
        { name: 'Calpol 500mg TDS', visual: 'Paracetamol 1500mg/24h', slot: 'Morning, Noon, Night', color: 'bg-rose-100 text-rose-900' },
      ],
      sentinelStatus: '[!] CRITIC SENTINEL INTERCEPT: Multiple paracetamol products (>3450mg/24h) + acute chest pain. SOS emergency routed to frontline ASHA!',
      sentinelRisk: 'CRITICAL_HAZARD',
      lang: 'te',
      langName: 'Telugu (తెలుగు)',
      script: 'హెచ్చరిక: వెంకట్ రావు గారూ, వెంటనే ఆశా వర్కర్ లేదా డాక్టర్‌ను సంప్రదించండి. ఛాతీ నొప్పి మరియు అధిక పారాసిటమాల్ ప్రమాదం గుర్తించబడింది!',
      pillboxStatus: 'HOLD - Emergency SOS Dispatch Activated'
    },
    aarav: {
      id: 'aarav',
      title: 'Baby Aarav (6y)',
      condition: 'Pediatric Throat Infection',
      badge: 'PEDIATRIC DOSAGE VERIFIED',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/40',
      facility: 'Nashik Rural Primary Clinic',
      doctor: 'Dr. Sunita Deshmukh, MD (Pediatrics)',
      confidence: '96%',
      sop: 'Indian Academy of Pediatrics (IAP) Weight-Calibrated Antibiotic Protocols',
      actionPriority: '[Priority 1 Clinical Action]: Dispense Pediatric Liquid Measure (5ml) with Mother Audio Guidance',
      medicines: [
        { name: 'Amoxicillin Oral Suspension', visual: 'Pink Liquid (1 Measuring Spoon - 5ml)', slot: 'Twice daily after food (7 days)', color: 'bg-pink-100 text-pink-900' },
        { name: 'Paracetamol 120mg/5ml', visual: 'Clear Syrup (5ml as needed)', slot: 'Only during high fever (>100°F)', color: 'bg-purple-100 text-purple-900' },
      ],
      sentinelStatus: 'CLEARED: Dosage calibrated to 18kg patient body weight. Safe for child.',
      sentinelRisk: 'SAFE',
      lang: 'mr',
      langName: 'Marathi (मराठी)',
      script: 'आरवच्या आई, हे अँटीबायोटिक सिरप दिवसातून २ वेळा ५ml (१ चमचा) जेवणानंतर ७ दिवस पूर्ण पाजा. ताप आल्यास पॅरासिटामॉल द्या.',
      pillboxStatus: '7-Day Pediatric Liquid Regimen Scheduled'
    },
    ramesh: {
      id: 'ramesh',
      title: 'Ramesh Gowda (48y)',
      condition: 'Type 2 Diabetes & High BP',
      badge: 'CHRONIC REGIMEN VERIFIED',
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-500/40',
      facility: 'Mandya Taluk Hospital',
      doctor: 'Dr. K. Manjunath, MD',
      confidence: '97%',
      sop: 'ICMR National Guidelines for Management of Type 2 Diabetes & Hypertension',
      actionPriority: '[Priority 1 Clinical Action]: Schedule 30-Day Dual Morning/Night Pillbox with Meal Reminders',
      medicines: [
        { name: 'Metformin 500mg', visual: 'White Oval', slot: 'Morning & Night (before food)', color: 'bg-slate-100 text-slate-900' },
        { name: 'Telmisartan 40mg', visual: 'Orange Round', slot: 'Morning (fixed time after tea)', color: 'bg-orange-100 text-orange-900' },
      ],
      sentinelStatus: 'CLEARED: Dual chronic regimen verified. Non-interacting active salts.',
      sentinelRisk: 'SAFE',
      lang: 'kn',
      langName: 'Kannada (ಕನ್ನಡ)',
      script: 'ನಮಸ್ಕಾರ ರಮೇಶ್ ಅವರೇ, ಮೆಟ್‌ಫಾರ್ಮಿನ್ ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಊಟಕ್ಕೆ ಮುಂಚೆ ತೆಗೆದುಕೊಳ್ಳಿ, ಮತ್ತು ತೆಲ್ಮಾ ಬೆಳಿಗ್ಗೆ ಮಾತ್ರ ಸೇವಿಸಿ!',
      pillboxStatus: '30-Day Chronic Treatment Vault Active'
    }
  };

  const current = scenarios[activeScenarioKey];

  const handleSelectScenario = (key) => {
    stopNativeAudio();
    setIsPlayingAudio(false);
    setIsProcessing(true);
    setActiveScenarioKey(key);
    setTimeout(() => {
      setIsProcessing(false);
    }, 180);
  };

  const handlePlayVoice = async () => {
    if (isPlayingAudio) {
      stopNativeAudio();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    await speakNativeAudio(current.script, current.lang);
    setIsPlayingAudio(false);
  };

  return (
    <div className="w-full bg-[#0B1120] border-2 border-slate-800 rounded-3xl p-4 sm:p-5 text-white shadow-2xl space-y-3.5 relative overflow-hidden">
      {/* Top Header: Live Pulse & Status */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <span className="text-xs font-black tracking-wider uppercase text-slate-200 font-mono">
            LIVE CLINICAL AGENT HUD
          </span>
          <span className="hidden sm:inline-flex text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
            ~3ms p50
          </span>
        </div>

        <div className={`text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
          {current.badge}
        </div>
      </div>

      {/* Main HUD Body Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5 transition-all">
        {/* Patient / Facility Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-black text-white flex items-center gap-1.5">
              <span>{current.title}</span>
              <span className="text-slate-400 font-normal text-xs">({current.condition})</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Facility: {current.facility}
            </div>
          </div>
          <div className="bg-blue-950/80 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0">
            Confidence: {current.confidence}
          </div>
        </div>

        {/* Statutory SOP Grounding */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-2.5 text-[11px] space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Statutory Guardrail Grounding:
          </div>
          <div className="text-slate-300 font-mono text-[11px] leading-tight">
            {current.sop}
          </div>
        </div>

        {/* Priority Tactical / Clinical Action */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-extrabold text-teal-400">
            {current.actionPriority}
          </div>

          {/* Medicines Display */}
          <div className="space-y-1">
            {current.medicines.map((m, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs">💊</span>
                  <span className="font-bold text-slate-200 truncate">{m.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                    {m.visual}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{m.slot}</span>
              </div>
            ))}
          </div>

          {/* Sentinel Verdict */}
          <div className={`p-2 rounded-xl text-[11px] font-bold leading-snug border ${
            current.sentinelRisk === 'CRITICAL_HAZARD'
              ? 'bg-rose-950/70 border-rose-500/50 text-rose-300'
              : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
          }`}>
            <span className="mr-1">{current.sentinelRisk === 'CRITICAL_HAZARD' ? '🚨' : '🛡️'}</span>
            {current.sentinelStatus}
          </div>

          {/* Spoken Vernacular Script Audio Preview */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
                <span>🔊 Regional Voice:</span>
                <span className="text-amber-400">{current.langName}</span>
              </div>
              <div className="text-xs text-slate-200 italic truncate font-sans mt-0.5">
                "{current.script}"
              </div>
            </div>

            <button
              onClick={handlePlayVoice}
              className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
              title="Speak audio in regional language"
            >
              <SpeakerIcon size={13} color="#fff" />
              <span>{isPlayingAudio ? 'Speaking...' : 'Listen Audio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1-TAP CLINICAL SCENARIO SIMULATOR (Just like JalRakshak's 1-Tap Disaster Simulator) */}
      <div className="space-y-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase font-mono">
            1-TAP CLINICAL SCENARIO SIMULATOR:
          </span>
          <span className="text-[10px] font-mono text-teal-400 font-bold animate-pulse">
            CLICK TO TEST PIPELINE
          </span>
        </div>

        {/* 4 Interactive One-Click Chips */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(scenarios).map(([key, sc]) => {
            const isSelected = activeScenarioKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectScenario(key)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-800/90 border-teal-500 ring-2 ring-teal-500/30 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="text-xs font-black text-white group-hover:text-teal-300 truncate">
                    {sc.title}
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {sc.condition}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClinicalAgentLiveHud;
