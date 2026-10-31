import React, { useState, useEffect, useRef } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import {
  MicIcon, CameraIcon, SendIcon, CloseIcon, SpeakerIcon,
  SparklesIcon, PillIcon
} from '../../../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../../../shared/utils/speech';
import { api } from '../../../../services/api';

export const SwasthyaMitrChatModal = ({ isOpen, onClose, initialMedicine = null }) => {
  const { currentLang, showToast } = useAuth();
  
  const [selectedMedicine, setSelectedMedicine] = useState(initialMedicine);
  const [selectedLang, setSelectedLang] = useState(currentLang || 'hi');
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);
  const [lastAiMsg, setLastAiMsg] = useState(null);

  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop audio when modal closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      stopNativeAudio();
      setSpeakingMsgId(null);
    }
    return () => {
      stopNativeAudio();
    };
  }, [isOpen]);

  const handleCloseModal = () => {
    stopNativeAudio();
    setSpeakingMsgId(null);
    onClose();
  };

  // Sync initial medicine when passed as prop
  useEffect(() => {
    if (initialMedicine) {
      setSelectedMedicine(initialMedicine);
    }
  }, [initialMedicine]);

  // Initial welcome message setup based on selected medicine & language
  useEffect(() => {
    if (!isOpen) return;

    const langName = LANGUAGES.find(l => l.code === selectedLang)?.name || 'your language';
    
    const GREETINGS = {
      kn: "ನಮಸ್ಕಾರ! 🙏 ನಾನು ಸ್ವಾಸ್ಥ್ಯ ಮಿತ್ರ, ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ನಿಮ್ಮ ಔಷಧಿಗಳ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಏನಾದರೂ ಕೇಳಿ!",
      te: "నమస్కారం! 🙏 నేను స్వాస్థ్య మిత్ర, మీ AI ఆరోగ్య సహాయకుడిని. మీ మందుల గురించి తెలుగులో ఏదైనా అడగండి!",
      ta: "வணக்கம்! 🙏 நான் ஸ்வஸ்த்ய மித்ரா, உங்கள் AI மருத்துவ உதவியாளர். உங்கள் மருந்துகள் பற்றி தமிழில் எதையும் கேளுங்கள்!",
      hi: "नमस्ते! 🙏 मैं आपका स्वास्थ्य मित्र हूँ। अपनी दवाओं के बारे में मुझसे हिंदी में कुछ भी पूछें!",
      en: "Hello! 🙏 I am Swasthya Mitr, your AI Health Assistant. Ask me anything about your medicines in English!"
    };

    let welcomeText = GREETINGS[selectedLang] || `Namaste! 🙏 I am Swasthya Mitr, your AI Medicine Assistant. Ask me anything about your medicines in ${langName}!`;
    if (selectedMedicine && selectedMedicine.name) {
      welcomeText = `Namaste! 🙏 I am ready to answer your questions about **${selectedMedicine.name}** (${selectedMedicine.dosage || 'Prescribed dose'} • ${selectedMedicine.frequency || 'As directed'}). What would you like to know?`;
    }

    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: welcomeText,
        language: selectedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [isOpen, selectedMedicine, selectedLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  if (!isOpen) return null;

  const handleMicToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast?.('Voice input is not supported in this browser. Please type your query.', 'error');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const langMap = {
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      pa: 'pa-IN',
      ml: 'ml-IN',
      en: 'en-IN',
    };

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langMap[selectedLang] || 'hi-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        const lObj = LANGUAGES.find(l => l.code === selectedLang);
        showToast?.(`Listening in ${lObj ? lObj.name : selectedLang}... Speak now!`, 'info');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript && transcript.trim()) {
          setInputQuery(transcript);
          // Auto-send immediately for natural voice conversation
          handleSendMessage(null, transcript.trim());
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast?.('Could not capture voice. Please try again.', 'error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      showToast?.('Voice recording error. Please type your message.', 'error');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e, directQuery = null, isProactive = false) => {
    if (e) e.preventDefault();
    
    const queryToUse = directQuery || inputQuery;
    if (!queryToUse.trim() && !attachedImage && !isProactive) return;

    const currentImg = attachedImage;
    const currentText = queryToUse.trim();

    if (!isProactive) {
      const userMsg = {
        id: Date.now(),
        sender: 'user',
        text: currentText || 'Uploaded Prescription Photo',
        image: currentImg?.preview,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
    }

    setInputQuery('');
    setAttachedImage(null);
    setIsProcessing(true);

    let aiAnswerText = '';
    let executedAction = null;

    try {
      // 1. If photo attached, analyze prescription document first in selected language
      if (currentImg?.file) {
        const langObj = LANGUAGES.find(l => l.code === selectedLang);
        showToast?.(`Scanning prescription in ${langObj ? langObj.name : 'selected language'}...`, 'info');
        const formData = new FormData();
        formData.append('original_file', currentImg.file);
        formData.append('document_type', 'prescription');
        formData.append('title', currentImg.file.name || 'Prescription Document');
        formData.append('target_language', selectedLang);
        formData.append('language', selectedLang);

        const ocrRes = await api.uploadMedicalDocument(formData, selectedLang);
        if (ocrRes?.translated_text || ocrRes?.simplified_text || ocrRes?.text_content) {
          const resultText = ocrRes.translated_text || ocrRes.simplified_text || ocrRes.text_content;
          aiAnswerText = `📷 **Prescription Photo Analysis:**\n\n` + resultText;
        }
      }

      // 2. Query Swasthya Mitr Autonomous Agentic Brain (Meta Llama ReAct Loop)
      if (!aiAnswerText) {
        const langObj = LANGUAGES.find(l => l.code === selectedLang);
        const languageName = langObj ? langObj.name : 'English';

        try {
          const agentPayload = {
            message: currentText || '',
            language: selectedLang,
            is_proactive: isProactive,
            context: selectedMedicine
          };
          const agentRes = await api.queryAgenticAssistant(agentPayload);
          if (agentRes && (agentRes.reply || agentRes.conversational_reply)) {
            aiAnswerText = agentRes.reply || agentRes.conversational_reply;
            executedAction = agentRes.action_executed;
          }
        } catch (agentErr) {
          console.warn("Agentic API fallback:", agentErr);
        }

        // Graceful fallback to legacy queryMedicineAssistant if agent response empty
        if (!aiAnswerText) {
          const convHistory = messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text
          }));

          const payload = {
            question: currentText || 'Please explain this prescription medicine.',
            medicine: selectedMedicine ? {
              name: selectedMedicine.name || selectedMedicine.medicine_name || '',
              medicine_name: selectedMedicine.name || selectedMedicine.medicine_name || '',
              dosage: selectedMedicine.dosage || selectedMedicine.strength || '',
              frequency: selectedMedicine.frequency || selectedMedicine.timing || '',
              duration: selectedMedicine.duration || '',
              instructions: selectedMedicine.instructions || '',
              prescription_context: selectedMedicine.prescription_context || ''
            } : null,
            language: languageName,
            conversation_history: convHistory
          };

          const response = await api.queryMedicineAssistant(payload);
          aiAnswerText = response?.answer || "I'm unable to retrieve information right now. Please check your prescription.";
        }
      }
    } catch (err) {
      console.error("AI Assistant API error:", err);
      aiAnswerText = "I'm unable to connect to the AI assistant right now. Please try again or consult your doctor/pharmacist.";
    } finally {
      setIsProcessing(false);
    }

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: aiAnswerText,
      action: executedAction,
      language: selectedLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);

    setLastAiMsg(aiMsg);

    // Automatically speak aloud in native audio for non-literate rural patients
    if (autoSpeakEnabled || isProactive) {
      handleToggleSpeech(aiMsg);
    }
  };

  const handleToggleSpeech = async (msg) => {
    if (speakingMsgId === msg.id) {
      stopNativeAudio();
      setSpeakingMsgId(null);
      return;
    }

    stopNativeAudio();
    setSpeakingMsgId(msg.id);
    await speakNativeAudio(msg.text, selectedLang);
    setSpeakingMsgId(null);
  };

  // Dynamic suggestion chips based on whether medicine is selected
  const medicineQuestions = selectedMedicine ? [
    `What is ${selectedMedicine.name} used for?`,
    `When should I take ${selectedMedicine.name}?`,
    `Should I take it before or after food?`,
    `What are the common side effects?`,
    `What should I do if I miss a dose?`,
  ] : [
    'What is Sizodon Plus used for?',
    'When should I take my prescription medicine?',
    'Should Paracetamol be taken after food?',
    'What happens if I miss a dose?',
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6">
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md" onClick={handleCloseModal} />

      <div className="relative z-[100000] w-full max-w-2xl h-[90vh] max-h-[750px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden font-sans transition-colors">
        
        {/* HEADER BAR */}
        <div className="bg-[#0F766E] text-white p-4 md:p-4.5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-teal-600/90 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              <SparklesIcon size={22} color="#ffffff" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-base tracking-tight truncate">Swasthya Mitr AI</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  MEDICINE ASSISTANT
                </span>
              </div>
              <p className="text-[11px] text-teal-100 truncate">
                Prescription-Aware • Multilingual Health AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* PROACTIVE CHECK-IN DEMO BUTTON */}
            <button
              type="button"
              onClick={() => handleSendMessage(null, '', true)}
              className="hidden sm:flex bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-[11px] font-black px-2.5 py-1.5 rounded-xl shadow-xs items-center gap-1 transition-all cursor-pointer"
              title="Simulate 8:30 AM autonomous voice check-in"
            >
              <span>⚡ Check-In</span>
            </button>

            {/* GLOBAL STOP AUDIO BUTTON WHEN SPEAKING */}
            {speakingMsgId && (
              <button
                type="button"
                onClick={() => {
                  stopNativeAudio();
                  setSpeakingMsgId(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-all cursor-pointer animate-pulse"
                title="Stop speech playback"
              >
                <span>🛑 Stop</span>
              </button>
            )}

            {/* AUTO-SPEAK ICON TOGGLE */}
            <button
              type="button"
              onClick={() => {
                if (autoSpeakEnabled) {
                  stopNativeAudio();
                  setSpeakingMsgId(null);
                }
                setAutoSpeakEnabled(!autoSpeakEnabled);
              }}
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                autoSpeakEnabled
                  ? 'bg-teal-700 text-emerald-300 ring-1 ring-emerald-400/40 shadow-xs'
                  : 'bg-teal-900/60 text-slate-300 hover:bg-teal-900'
              }`}
              title={autoSpeakEnabled ? "Auto-Voice ON: Speaks answers aloud" : "Auto-Voice OFF"}
            >
              <span>{autoSpeakEnabled ? '🔊 ON' : '🔈 OFF'}</span>
            </button>

            {/* LANGUAGE SELECTOR */}
            <select
              className="bg-teal-900/90 border border-teal-700/80 text-white text-xs font-semibold px-2 py-1.5 rounded-xl outline-none cursor-pointer hover:bg-teal-900 max-w-[110px] sm:max-w-none"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleCloseModal}
              className="p-2 rounded-xl text-teal-100 hover:bg-teal-700/80 transition-colors cursor-pointer"
              title="Close Assistant"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {/* ACTIVE SELECTED MEDICINE BADGE / CONTEXT BANNER */}
        {selectedMedicine && selectedMedicine.name && (
          <div className="bg-teal-50 dark:bg-teal-950/80 border-b border-teal-200 dark:border-teal-900/80 px-4 py-2.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-100 flex items-center justify-center text-xs shrink-0 font-bold">
                💊
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-teal-200 truncate">
                    {selectedMedicine.name}
                  </span>
                  {selectedMedicine.dosage && (
                    <span className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {selectedMedicine.dosage}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium truncate">
                  {[selectedMedicine.frequency, selectedMedicine.duration].filter(Boolean).join(' • ') || 'Prescription Context Active'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedMedicine(null)}
              className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-white underline shrink-0 cursor-pointer"
              title="Switch to general health assistant mode"
            >
              Clear Context
            </button>
          </div>
        )}

        {/* CHAT MESSAGES BODY */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/70 dark:bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-3xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0F766E] text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Prescription"
                    className="w-full max-h-48 object-cover rounded-2xl mb-2.5 border border-slate-200 dark:border-slate-700"
                  />
                )}
                
                {/* Formatted Text with basic Markdown line breaks & bold text */}
                <div className="space-y-1.5 whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>

                {/* AUTONOMOUS AGENT ACTION BADGE (TOOL EXECUTION PROOF) */}
                {msg.action && (
                  <div className="mt-3 p-3 rounded-2xl text-xs font-semibold border transition-all">
                    {msg.action.tool === 'confirm_dose' && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 p-2.5 rounded-xl flex items-center gap-2">
                        <span className="text-base">✅</span>
                        <div>
                          <div className="font-extrabold text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            Action: Dose Marked TAKEN in PostgreSQL
                          </div>
                          <div>{msg.action.message || `${msg.action.medicine_name} recorded as TAKEN at ${msg.action.timestamp}`}</div>
                        </div>
                      </div>
                    )}
                    {msg.action.tool === 'trigger_sos' && (
                      <div className="bg-rose-50 dark:bg-rose-950/80 border-rose-400 dark:border-rose-800 text-rose-900 dark:text-rose-200 p-2.5 rounded-xl flex items-center gap-2 animate-pulse">
                        <span className="text-base">🚨</span>
                        <div>
                          <div className="font-extrabold text-[11px] uppercase tracking-wider text-rose-700 dark:text-rose-400">
                            Emergency SOS Beacon Dispatched
                          </div>
                          <div>{msg.action.message || 'ASHA Worker & emergency contacts notified with live coordinates.'}</div>
                        </div>
                      </div>
                    )}
                    {msg.action.tool === 'check_contraindication' && (
                      <div className="bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 p-2.5 rounded-xl flex items-center gap-2">
                        <span className="text-base">🛡️</span>
                        <div>
                          <div className="font-extrabold text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            Clinical Safety Check Grounded in Doctor Rx
                          </div>
                          <div>{msg.action.clinical_safety_note}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {msg.sender === 'ai' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleToggleSpeech(msg)}
                      className={`font-bold text-[11px] px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                        speakingMsgId === msg.id
                          ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 animate-pulse shadow-xs'
                          : 'bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                      }`}
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <span className="w-2 h-2 rounded-xs bg-white inline-block animate-ping"></span>
                          <span>🛑 Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <SpeakerIcon size={14} color="#0F766E" />
                          <span>🔊 Listen Voice</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* THINKING INDICATOR */}
          {isProcessing && (
            <div className="flex items-center gap-2.5 text-xs text-teal-800 dark:text-teal-300 font-bold bg-teal-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-teal-200 dark:border-slate-700 w-fit animate-pulse shadow-2xs">
              <SparklesIcon size={18} className="animate-spin text-[#0F766E] dark:text-teal-400" />
              <span>Swasthya Mitr is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK CONTEXTUAL SUGGESTION CHIPS */}
        <div className="px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <span className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
            ACTIONS:
          </span>
          {selectedLang === 'kn' ? (
            <>
              <button
                type="button"
                onClick={() => handleSendMessage(null, '', true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ⚡ 8:30 AM ಮುಂಜಾನೆ ಪರಿಶೀಲನೆ
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'ಹೌದು, ನಾನು ಊಟದ ನಂತರ Augmentin ಮಾತ್ರೆ ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ✅ ಹೌದು, ಮಾತ್ರೆ ತೆಗೆದುಕೊಂಡಿದ್ದೇನೆ
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'ನನಗೆ ತಲೆಸುತ್ತು ಬರುತ್ತಿದೆ ಮತ್ತು ತುಂಬಾ ನೋವಿದೆ')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                🚨 ತಲೆಸುತ್ತು (ತುರ್ತು SOS)
              </button>
            </>
          ) : selectedLang === 'te' ? (
            <>
              <button
                type="button"
                onClick={() => handleSendMessage(null, '', true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ⚡ 8:30 AM ఉదయం చెక్-ఇన్
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'అవును, నేను టిఫిన్ తర్వాత Augmentin మాత్ర వేసుకున్నాను')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ✅ అవును, మాత్ర వేసుకున్నాను
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'నాకు చాలా కళ్ళు తిరుగుతున్నాయి, అత్యవసర సహాయం కావాలి')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                🚨 అత్యవసర సహాయం (SOS)
              </button>
            </>
          ) : selectedLang === 'ta' ? (
            <>
              <button
                type="button"
                onClick={() => handleSendMessage(null, '', true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ⚡ 8:30 AM காலை பரிசோதனை
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'ஆம், காலை உணவுக்குப் பிறகு Augmentin மாத்திரை சாப்பிட்டேன்')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ✅ ஆம், மாத்திரை சாப்பிட்டேன்
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'எனக்கு மயக்கம் வருகிறது, அவசர உதவி தேவை')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                🚨 அவசர உதவி (SOS)
              </button>
            </>
          ) : selectedLang === 'en' ? (
            <>
              <button
                type="button"
                onClick={() => handleSendMessage(null, '', true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ⚡ 8:30 AM Morning Check-In
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'Yes, I took Augmentin after breakfast')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ✅ Yes, took after breakfast
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'I am feeling severe dizziness and pain')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                🚨 Severe Dizziness (Emergency SOS)
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleSendMessage(null, '', true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ⚡ 8:30 AM Morning Check-In
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'हाँ, नाश्ते के बाद Augmentin दवा ले ली')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                ✅ हाँ, नाश्ते के बाद ले ली
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(null, 'चक्कर आ रहे हैं और बहुत तेज दर्द है')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
              >
                🚨 चक्कर आ रहे हैं (Emergency SOS)
              </button>
            </>
          )}
          {medicineQuestions.slice(0, 2).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(null, q)}
              className="bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-200 hover:text-teal-900 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors shadow-2xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* LIVE SPEAKING AUDIO NOTIFICATION BAR (Only shows while audio is playing) */}
        {speakingMsgId && (
          <div className="mx-3 my-1 p-2 px-3.5 rounded-2xl bg-gradient-to-r from-teal-800 to-emerald-800 text-white flex items-center justify-between text-xs shadow-md shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>🔊 {selectedLang === 'kn' ? 'ಉತ್ತರವನ್ನು ಮಾತನಾಡುತ್ತಿದೆ...' : selectedLang === 'hi' ? 'उत्तर बोलकर सुना रहा हूँ...' : 'Speaking reply aloud...'}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                stopNativeAudio();
                setSpeakingMsgId(null);
              }}
              className="px-2.5 py-0.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-[11px] font-black cursor-pointer transition-colors shadow-xs"
            >
              🛑 {selectedLang === 'kn' ? 'ನಿಲ್ಲಿಸಿ' : 'Stop'}
            </button>
          </div>
        )}

        {/* INPUT FORM: SINGLE UNIFIED VOICE-FIRST DOCK */}
        <form onSubmit={(e) => handleSendMessage(e)} className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-2xl border transition-colors cursor-pointer shrink-0 ${
              attachedImage 
                ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-900 dark:text-amber-200' 
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Attach Prescription or Medicine Photo"
          >
            <CameraIcon size={20} />
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isProcessing}
              placeholder={
                isListening
                  ? (selectedLang === 'kn' ? "ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ! 🎙️" : "Listening... Speak now! 🎙️")
                  : (selectedLang === 'kn' ? "ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಮಾತನಾಡಿ..." : `Ask medicine question in ${LANGUAGES.find(l => l.code === selectedLang)?.name || 'English'}...`)
              }
              className={`w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all ${
                isListening 
                  ? 'border-rose-500 ring-2 ring-rose-400/40 animate-pulse text-rose-600 font-bold'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500 text-slate-900 dark:text-white'
              }`}
            />
          </div>

          {/* DYNAMIC PRIMARY ACTION: If text typed -> Send; If empty -> Big 1-Tap Voice Button */}
          {inputQuery.trim() || attachedImage ? (
            <button
              type="submit"
              disabled={isProcessing}
              className="p-2.5 px-4 bg-[#0F766E] hover:bg-teal-800 text-white rounded-2xl font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              title="Send Query"
            >
              <span>Send</span>
              <SendIcon size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMicToggle}
              disabled={isProcessing}
              className={`p-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse'
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white ring-2 ring-teal-400/30'
              }`}
              title="Tap to speak in your language"
            >
              <MicIcon size={20} className={isListening ? 'animate-bounce' : ''} />
              <span className="font-extrabold whitespace-nowrap">
                {isListening
                  ? (selectedLang === 'kn' ? 'ಆಲಿಸುತ್ತಿದೆ...' : 'Listening...')
                  : (selectedLang === 'kn' ? '🎙️ ಮಾತನಾಡಿ' : selectedLang === 'hi' ? '🎙️ बोलिए' : selectedLang === 'te' ? '🎙️ మాట్లాడండి' : selectedLang === 'ta' ? '🎙️ பேசுங்கள்' : '🎙️ Speak')}
              </span>
            </button>
          )}

          {/* REPLAY LAST AUDIO BUTTON */}
          {lastAiMsg && !isListening && (
            <button
              type="button"
              onClick={() => handleToggleSpeech(lastAiMsg)}
              className="p-2.5 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 hover:bg-teal-100 transition-colors cursor-pointer shrink-0"
              title="Replay Voice Audio"
            >
              <SpeakerIcon size={18} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SwasthyaMitrChatModal;
