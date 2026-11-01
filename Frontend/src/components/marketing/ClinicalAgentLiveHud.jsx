import React, { useState } from 'react';
import { 
  SpeakerIcon, ShieldIcon, CheckIcon, AlertIcon, SparklesIcon, 
  PillIcon, PhoneIcon, ArrowRightIcon, BrainIcon 
} from '../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../shared/utils/speech';

export const ClinicalAgentLiveHud = () => {
  const [activeScenarioKey, setActiveScenarioKey] = useState('lakshmi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const scenarios = {
    lakshmi: {
      id: 'lakshmi',
      title: 'Lakshmi Devi (52y)',
      condition: 'Viral Bronchitis & Acidity',
      badge: 'VERIFIED REGIMEN',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      facility: 'PHC Rampur (Rural Clinic)',
      confidence: '98%',
      sop: 'CDSCO Pharmacovigilance & ABDM Schedule H Regimen Protocol',
      actionPriority: '5-Day Visual Pillbox & Regional Voice Schedule Active',
      medicines: [
        { name: 'Dolo 650mg', visual: 'White Round', slot: 'Morning & Night (after food)', pillBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
        { name: 'Amoxicillin 500mg', visual: 'Red-Yellow Capsule', slot: 'Morning & Night (after food)', pillBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
        { name: 'Pantocid 40mg', visual: 'Yellow Round', slot: 'Morning (before breakfast)', pillBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300' },
      ],
      sentinelStatus: 'CLEARED: Zero drug-drug interactions. Safe for rural patient.',
      sentinelRisk: 'SAFE',
      lang: 'hi',
      langName: 'Hindi (हिंदी)',
      script: 'नमस्ते Smt. Lakshmi Devi ji! Dolo (white goli) aur Amoxicillin (red-yellow capsule) subah aur raat khane ke baad lein. Pantocid subah khali pet lein!',
      pillboxDays: '5-Day Course'
    },
    venkat: {
      id: 'venkat',
      title: 'Venkat Rao (64y)',
      condition: 'Overdose & Acute Chest Pain',
      badge: 'CRITICAL TOXICITY INTERCEPT',
      badgeColor: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse',
      facility: 'Kurnool Sub-Centre',
      confidence: '99%',
      sop: 'Emergency Medical Dispatch Protocol & Drug Overdose Guardrail',
      actionPriority: 'HALT Medication & Dispatch Immediate SOS to Frontline ASHA',
      medicines: [
        { name: 'Dolo 650mg TDS', visual: 'Paracetamol 1950mg/24h', slot: 'Morning, Noon, Night', pillBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
        { name: 'Calpol 500mg TDS', visual: 'Paracetamol 1500mg/24h', slot: 'Morning, Noon, Night', pillBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
      ],
      sentinelStatus: '[!] CRITIC SENTINEL INTERCEPT: Duplicate paracetamol overdose (>3450mg/24h) + acute chest pain. SOS emergency routed to registered ASHA!',
      sentinelRisk: 'CRITICAL_HAZARD',
      lang: 'te',
      langName: 'Telugu (తెలుగు)',
      script: 'హెచ్చరిక: వెంకట్ రావు గారూ, వెంటనే ఆశా వర్కర్ లేదా డాక్టర్‌ను సంప్రదించండి. ఛాతీ నొప్పి మరియు అధిక పారాసిటమాల్ ప్రమాదం గుర్తించబడింది!',
      pillboxDays: 'HOLD - SOS Active'
    },
    aarav: {
      id: 'aarav',
      title: 'Baby Aarav (6y)',
      condition: 'Pediatric Throat Infection',
      badge: 'PEDIATRIC VERIFIED',
      badgeColor: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      facility: 'Nashik Rural Clinic',
      confidence: '96%',
      sop: 'Indian Academy of Pediatrics (IAP) Weight-Dosing Protocols',
      actionPriority: 'Dispense Pediatric Liquid Measure (5ml) with Mother Audio Guide',
      medicines: [
        { name: 'Amoxicillin Oral Liquid', visual: 'Pink Liquid (5ml)', slot: 'Twice daily after food (7 days)', pillBg: 'bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300' },
        { name: 'Paracetamol 120mg/5ml', visual: 'Clear Syrup (5ml)', slot: 'Only during high fever (>100°F)', pillBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
      ],
      sentinelStatus: 'CLEARED: Dosage calibrated to 18kg patient body weight. Safe for child.',
      sentinelRisk: 'SAFE',
      lang: 'mr',
      langName: 'Marathi (मराठी)',
      script: 'आरवच्या आई, हे अँटीबायोटिक सिरप दिवसातून २ वेळा ५ml (१ चमचा) जेवणानंतर ७ दिवस पूर्ण पाजा. काळजी घ्या!',
      pillboxDays: '7-Day Course'
    },
    ramesh: {
      id: 'ramesh',
      title: 'Ramesh Gowda (48y)',
      condition: 'Type 2 Diabetes & High BP',
      badge: 'CHRONIC CARE VERIFIED',
      badgeColor: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      facility: 'Mandya Taluk Hospital',
      confidence: '97%',
      sop: 'ICMR National Guidelines for Type 2 Diabetes & Hypertension',
      actionPriority: 'Schedule 30-Day Dual Morning/Night Pillbox with Meal Alarms',
      medicines: [
        { name: 'Metformin 500mg', visual: 'White Oval', slot: 'Morning & Night (before meals)', pillBg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' },
        { name: 'Telmisartan 40mg', visual: 'Orange Round', slot: 'Morning (fixed time after tea)', pillBg: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300' },
      ],
      sentinelStatus: 'CLEARED: Dual chronic regimen verified. Non-interacting active salts.',
      sentinelRisk: 'SAFE',
      lang: 'kn',
      langName: 'Kannada (ಕನ್ನಡ)',
      script: 'ನಮಸ್ಕಾರ ರಮೇಶ್ ಅವರೇ, ಮೆಟ್‌ಫಾರ್ಮಿನ್ ಬೆಳಿಗ್ಗೆ ಮತ್ತು ರಾತ್ರಿ ಊಟಕ್ಕೆ ಮುಂಚೆ ತೆಗೆದುಕೊಳ್ಳಿ, ಮತ್ತು ತೆಲ್ಮಾ ಬೆಳಿಗ್ಗೆ ಮಾತ್ರ ಸೇವಿಸಿ!',
      pillboxDays: '30-Day Course'
    }
  };

  const current = scenarios[activeScenarioKey];

  const handleSelectScenario = (key) => {
    stopNativeAudio();
    setIsPlayingAudio(false);
    setActiveScenarioKey(key);
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
    <div className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-5 text-slate-900 dark:text-white shadow-xl space-y-4 transition-colors">
      
      {/* Top Header: Title & Swarm Latency */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 flex items-center justify-center text-sm font-bold shrink-0">
            🤖
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black tracking-wide text-slate-900 dark:text-white truncate">
              Strands 4-Agent Swarm Live Trace
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Facility: {current.facility}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
            ⚡ ~3ms p50
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${current.badgeColor}`}>
            {current.badge}
          </span>
        </div>
      </div>

      {/* 4-Agent Pipeline Step Trace */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2 border border-slate-200/70 dark:border-slate-700/60">
        <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-bold">
          <div className="bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-400 shadow-2xs">
            1. RxVision
          </div>
          <div className="bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-400 shadow-2xs">
            2. Pharmacology
          </div>
          <div className={`p-1.5 rounded-lg border shadow-2xs ${
            current.sentinelRisk === 'CRITICAL_HAZARD'
              ? 'bg-rose-100 dark:bg-rose-950 border-rose-300 text-rose-700 dark:text-rose-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-400'
          }`}>
            3. Sentinel
          </div>
          <div className="bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-400 shadow-2xs">
            4. Voice Engine
          </div>
        </div>
      </div>

      {/* 1-Tap Scenario Selector Tabs */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select Clinical Scenario to Test:
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(scenarios).map(([key, sc]) => {
            const isSelected = activeScenarioKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectScenario(key)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/80 border-teal-500 dark:border-teal-400 text-teal-950 dark:text-teal-200 shadow-xs ring-1 ring-teal-500/30'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="text-[11px] font-black truncate flex items-center justify-between">
                  <span>{sc.title}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />}
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {sc.condition}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Regimen & Actions Display */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-3.5 space-y-2.5">
        
        {/* Extracted Medicines List */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
            <span>Prescribed Regimen ({current.pillboxDays}):</span>
            <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">Confidence: {current.confidence}</span>
          </div>

          <div className="space-y-1">
            {current.medicines.map((m, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-xl p-2 flex items-center justify-between text-xs gap-2 shadow-2xs"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-extrabold text-slate-900 dark:text-white truncate">{m.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${m.pillBg}`}>
                    {m.visual}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">
                  {m.slot}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentinel Safety Verdict Card */}
        <div className={`p-2.5 rounded-xl text-xs font-bold leading-snug border ${
          current.sentinelRisk === 'CRITICAL_HAZARD'
            ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            : 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
        }`}>
          <div className="flex items-start gap-1.5">
            <span className="text-sm shrink-0">{current.sentinelRisk === 'CRITICAL_HAZARD' ? '🚨' : '🛡️'}</span>
            <div className="text-[11px] font-medium leading-relaxed">
              <strong className="font-extrabold">{current.sentinelRisk === 'CRITICAL_HAZARD' ? 'Critic Intercept: ' : 'Safety Guardrail: '}</strong>
              {current.sentinelStatus}
            </div>
          </div>
        </div>

        {/* Vernacular Spoken Audio Preview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>🎙️ Voice Guidance:</span>
              <span className="text-teal-700 dark:text-teal-300 font-extrabold">{current.langName}</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 italic truncate font-sans mt-0.5">
              "{current.script}"
            </div>
          </div>

          <button
            onClick={handlePlayVoice}
            className="bg-[#0F766E] hover:bg-[#095650] dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95 shrink-0"
            title="Listen to regional spoken instructions"
          >
            <SpeakerIcon size={13} color="#fff" />
            <span>{isPlayingAudio ? 'Playing...' : 'Listen Audio'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalAgentLiveHud;
