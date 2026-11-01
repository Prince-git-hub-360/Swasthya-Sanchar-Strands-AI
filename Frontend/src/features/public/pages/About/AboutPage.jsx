import React from 'react';
import { ShieldIcon, HospitalIcon, BrainIcon, SparklesIcon, CheckIcon, SpeakerIcon } from '../../../../shared/icons/Icons';

export const AboutPage = ({ setCurrentView, openAuthModal, onNavigate }) => {
  const handleRegister = () => {
    if (onNavigate) onNavigate('/register');
    else if (openAuthModal) openAuthModal('register');
  };

  const handleHome = () => {
    if (onNavigate) onNavigate('/');
    else if (setCurrentView) setCurrentView('landing');
  };

  return (
    <div className="landing-section max-w-5xl mx-auto px-4 sm:px-6 font-sans" style={{ paddingTop: '16px', minHeight: '80vh' }}>
      <div className="section-header text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-2xs">
          ABOUT SWASTHYA SANCHAR AI
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Bridging the Healthcare Communication Gap for Rural India
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Swasthya Sanchar AI was founded with a single mission: to ensure that every patient, regardless of literacy level or geographic location, can understand their medical instructions, take their medicines correctly, and live a healthier life.
        </p>
      </div>

      {/* Mission & Vision Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="card-surface bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-[#0B4F42] dark:text-teal-400">
            <HospitalIcon size={28} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            The Rural Health Challenge
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            In many rural communities across India, healthcare delivery ends when a doctor writes a handwritten prescription. Patients face steep hurdles—unreadable handwriting, complex medical terminology, and language barriers. Misunderstood instructions lead to missed doses, treatment drop-offs, and avoidable health complications.
          </p>
        </div>

        <div className="card-surface bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BrainIcon size={28} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Our AI-Powered Solution
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Swasthya Sanchar AI acts as a human-centric communication bridge. Using Optical Character Recognition (OCR), specialized Medical NLP, and multilingual clinical AI simplification, complex medical notes are converted into simple, regional-language explanations delivered as both clear visual pillboxes and spoken audio.
          </p>
        </div>
      </div>

      {/* Official Hackathon & Statutory Architecture Context (Purged of legacy team/student names) */}
      <div className="bg-gradient-to-br from-teal-50/80 to-blue-50/80 dark:from-slate-900 dark:to-slate-950 border border-teal-200 dark:border-teal-900/60 rounded-3xl p-6 sm:p-10 shadow-md mb-12 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
            AWS BUILDER CENTER HACKATHON 2026 • HEALTH TRACK
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Engineered for Rural Healthcare Equity
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Swasthya Sanchar AI was engineered as an autonomous multi-agent healthcare platform powered by the <strong>AWS Strands Agents SDK</strong> to empower frontline ASHA workers and underserved rural patients across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 p-4 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-extrabold text-xs">
              <SparklesIcon size={16} />
              <span>AWS Strands Agents SDK</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
              Autonomous 4-agent DAG swarm executing in ~3 ms p50 with Bedrock Claude 3 Haiku cloud fallback.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 p-4 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
              <ShieldIcon size={16} />
              <span>ABDM &amp; CDSCO Grounded</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
              Statutory pharmacovigilance guardrails preventing drug-drug interactions and dosage hallucinations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 p-4 rounded-2xl space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-xs">
              <SpeakerIcon size={16} />
              <span>12+ Indic Dialects Voice</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
              Spoken native vernacular audio synthesis for 100% literacy-free patient comprehension.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4 pb-8">
        <button 
          className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#095650] dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer" 
          onClick={handleRegister}
        >
          Get Started Free →
        </button>
        <button 
          className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all cursor-pointer shadow-xs" 
          onClick={handleHome}
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
