import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  X,
  Bot,
  User,
  Mic,
  RefreshCw,
  HelpCircle,
  Pill,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { VoiceAssistantService } from '../../services/speechService';
import { apiClient } from '../../api/client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isSpeaking?: boolean;
}

const RURAL_CLINICAL_KNOWLEDGE: Record<string, { hi: string; en: string }> = {
  snakebite: {
    hi: '🚨 **सर्पदंश (सांप काटने पर) आपातकालीन प्राथमिक चिकित्सा:**\n\n1. **मरीज को शांत रखें और बिल्कुल हिलने-डुलने न दें** — घबराने से जहर तेजी से फैलता है।\n2. **काटे गए अंग को दिल के स्तर से नीचे रखें** और खपच्ची (लकड़ी) से स्थिर करें।\n3. ❌ चीरा न लगाएं, मुंह से जहर न चूसें, और तंग रस्सी न बांधें।\n4. अंगूठियां, कड़े या तंग कपड़े तुरंत उतार लें।\n5. **बिना समय गंवाए 108 एम्बुलेंस बुलाएं या सीधे रामपूर पीएचसी (PHC) ले जाएं**, जहां एंटी-स्नेक वेनम (ASV) उपलब्ध है।',
    en: '🚨 **Snakebite Emergency First Aid Protocol:**\n\n1. **Keep the patient calm and completely still** — movement spreads venom faster.\n2. **Keep the bitten limb below heart level** and immobilize with a splint or sling.\n3. ❌ Do NOT cut the wound, suck venom, or tie tight tourniquets.\n4. Remove rings, watches, or tight clothes before swelling begins.\n5. **Immediately call 108 Ambulance or rush to Rampur PHC**, where Anti-Snake Venom (ASV) is stocked 24x7.',
  },
  ors: {
    hi: '💧 **उल्टी-दस्त में ओआरएस (ORS) घोल बनाने की सही विधि:**\n\n1. **1 लीटर पीने योग्य साफ या उबला हुआ ठंडा पानी लें।**\n2. पूरा 1 पैकेट WHO-प्रमाणित ORS घोलें (अथवा 1 लीटर पानी में 6 चम्मच चीनी + आधा चम्मच नमक)।\n3. हर बार दस्त या उल्टी होने के बाद 1 कप (वयस्क) या आधा कप (शिशु) घूंट-घूंट करके पिलाएं।\n4. जिंक की गोली 14 दिनों तक रोज दें।\n5. यदि बच्चा सुस्त पड़े या पेशाब बंद हो जाए, तो तुरंत नजदीकी स्वास्थ्य केंद्र ले जाएं।',
    en: '💧 **How to Prepare and Administer ORS for Diarrhea & Dehydration:**\n\n1. **Take 1 liter of clean, boiled and cooled drinking water.**\n2. Dissolve the complete WHO ORS packet (or 6 teaspoons sugar + 1/2 teaspoon salt).\n3. Give sips after every loose stool (1 cup for adults, 1/2 cup for children).\n4. Administer daily Zinc tablet for 14 days.\n5. If severe dehydration occurs (sunken eyes, no urine), visit Rampur PHC immediately.',
  },
  bp: {
    hi: '🩸 **हाई ब्लड प्रेशर (140/90 से अधिक) होने पर आवश्यक कदम:**\n\n1. शांत होकर बैठ जाएं या आराम करें।\n2. यदि डॉक्टर ने दवा (जैसे Amlodipine 5mg या Telmisartan) दी है, तो तुरंत लें।\n3. **भोजन में नमक की मात्रा कम करें** (अचार, पापड़ से परहेज करें)।\n4. तंबाकू और बीड़ी का सेवन बंद करें।\n5. यदि सिर में तेज दर्द, चक्कर, छाती में भारीपन या धुंधला दिखे, तो 108 पर कॉल करें।',
    en: '🩸 **Steps to Take for High Blood Pressure (>140/90 mmHg):**\n\n1. Sit down quietly and rest in a calm position.\n2. Take your prescribed anti-hypertensive medication (e.g. Amlodipine 5mg) without delay.\n3. **Strictly reduce salt and sodium intake** (avoid pickles and processed snacks).\n4. Avoid tobacco, beedi, and caffeine.\n5. If severe headache, chest tightness, or blurry vision occurs, seek immediate PHC care or dial 108.',
  },
  empty_stomach: {
    hi: '🌅 **खाली पेट कौन सी दवाइयां लेनी चाहिए?**\n\n1. **गैस व एसिडिटी की दवाएं** (Pantoprazole, Omeprazole, Rabeprazole) — सुबह नाश्ते से 30–45 मिनट पहले एक गिलास ताजे पानी के साथ लें।\n2. **थायरॉइड की दवा** (Thyronorm / Eltroxin) — सुबह उठते ही खाली पेट लें और 45 मिनट तक चाय या भोजन न लें।\n3. अधिकांश दर्द निवारक और एंटीबायोटिक भोजन के बाद ही लेने चाहिए।',
    en: '🌅 **Which Medicines Must Strictly Be Taken on an Empty Stomach?**\n\n1. **Antacids / PPIs** (Pantoprazole 40mg, Omeprazole) — take 30 to 45 minutes before morning breakfast with clean water.\n2. **Thyroid Hormone** (Thyroxine) — take immediately upon waking with water, wait 45 mins before tea or food.\n3. Painkillers and antibiotics should generally be taken AFTER meals to protect the stomach lining.',
  },
  paracetamol: {
    hi: '💊 **पैरासिटामोल 650mg के उपयोग और सावधानियां:**\n\n1. **उपयोग:** बुखार, सिरदर्द, बदन दर्द और जोड़ों के दर्द में राहत।\n2. **समय:** भोजन के 20 मिनट बाद गुनगुने पानी से लें।\n3. **खुराक अंतराल:** दो खुराकों के बीच कम से कम 6 घंटे का अंतर रखें।\n4. ⚠️ 24 घंटे में 4 गोलियों (2600mg) से अधिक कभी न लें, अन्यथा लीवर पर असर पड़ सकता है।',
    en: '💊 **Paracetamol 650mg Clinical Guidelines & Safety:**\n\n1. **Indication:** Relief from fever, headache, body aches, and mild infection pain.\n2. **Timing:** Take after food with a full glass of water.\n3. **Interval:** Maintain at least a 6 to 8 hour gap between doses.\n4. ⚠️ Never exceed 4 tablets (2600mg) in 24 hours to prevent liver toxicity.',
  },
};

const QUICK_PROMPTS: Record<string, string[]> = {
  hi: [
    '🐍 सर्पदंश (सांप काटने पर) तुरंत क्या करें?',
    '💧 उल्टी-दस्त में ओआरएस (ORS) घोल कैसे बनाएं?',
    '🩸 ब्लड प्रेशर और शुगर कैसे नियंत्रित करें?',
    '🌅 खाली पेट कौन सी दवाइयां लेनी चाहिए?',
    '💊 पैरासिटामोल 650mg कब और कैसे लें?',
    'आभा (ABHA) हेल्थ कार्ड के क्या लाभ हैं?',
  ],
  en: [
    '🐍 Snakebite Emergency First Aid Protocol?',
    '💧 How to prepare and give ORS for dehydration?',
    '🩸 How to manage high blood pressure & blood sugar?',
    '🌅 Which medicines should strictly be taken on empty stomach?',
    '💊 Safe usage & dosage for Paracetamol 650mg?',
    'What benefits does the ABHA Ayushman Health Card provide?',
  ],
};

export const SwasthyaMitrAiModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  activeMedicineContext?: string;
}> = ({ visible, onClose, activeMedicineContext }) => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<any>(null);

  // Initialize greeting on open
  useEffect(() => {
    if (visible && messages.length === 0) {
      const patientName = user?.first_name || 'मरीज';
      const initialGreeting: ChatMessage = {
        id: 'msg_welcome',
        sender: 'ai',
        text:
          currentLanguage === 'hi'
            ? `नमस्ते ${patientName} जी! 🙏 मैं **स्वास्थ मित्र** (Swasthya Mitr) हूँ — आपका AI स्वास्थ्य सहायक।\n\nआप मुझसे अपनी दवाइयों, खुराक के समय, साइड-इफेक्ट्स, बुखार, बीपी, शुगर, या किसी भी स्वास्थ्य समस्या के बारे में पूछ सकते हैं।`
            : `Hello ${patientName}! 🙏 I am **Swasthya Mitr** — your personal AI Healthcare Companion.\n\nYou can ask me about medicine dosages, meal timings, side effects, blood pressure, sugar, or any symptoms in your native language.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialGreeting]);
    }
  }, [visible, currentLanguage, user]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Fast match against localized clinical knowledge
    const lower = query.toLowerCase();
    let localMatch: string | null = null;
    const langKey = currentLanguage === 'hi' ? 'hi' : 'en';

    if (lower.includes('सांप') || lower.includes('सर्पदंश') || lower.includes('snake')) {
      localMatch = RURAL_CLINICAL_KNOWLEDGE.snakebite[langKey];
    } else if (
      lower.includes('ors') ||
      lower.includes('ओआरएस') ||
      lower.includes('दस्त') ||
      lower.includes('diarrhea') ||
      lower.includes('उल्टी')
    ) {
      localMatch = RURAL_CLINICAL_KNOWLEDGE.ors[langKey];
    } else if (
      lower.includes('bp') ||
      lower.includes('ब्लड प्रेशर') ||
      lower.includes('blood pressure') ||
      lower.includes('बीपी')
    ) {
      localMatch = RURAL_CLINICAL_KNOWLEDGE.bp[langKey];
    } else if (
      lower.includes('खाली पेट') ||
      lower.includes('empty stomach') ||
      lower.includes('पैंटोप्राजोल') ||
      lower.includes('pantoprazole')
    ) {
      localMatch = RURAL_CLINICAL_KNOWLEDGE.empty_stomach[langKey];
    } else if (
      lower.includes('पैरासिटामोल') ||
      lower.includes('paracetamol') ||
      lower.includes('dolo') ||
      lower.includes('बुखार')
    ) {
      localMatch = RURAL_CLINICAL_KNOWLEDGE.paracetamol[langKey];
    }

    if (localMatch) {
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: localMatch!,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
      }, 350);
      return;
    }

    try {
      const targetLang = currentLanguage === 'hi' ? 'Hindi' : 'English';
      const response = await apiClient.post(
        '/ai-assistant/medicine/',
        {
          question: query,
          language: targetLang,
          medicine: activeMedicineContext ? { name: activeMedicineContext } : {},
          conversation_history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        },
        { timeout: 25000 }
      );

      const aiAnswer =
        response.data?.answer ||
        (currentLanguage === 'hi'
          ? 'दवाइयों का सही समय पर सेवन करें और डॉक्टर की सलाह का पालन करें।'
          : 'Please follow your prescribed medication routine and consult your doctor.');

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('[SwasthyaMitr] API error, loading local AI medical knowledge:', err);
      // Fallback local intelligence
      const fallbackMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text:
          currentLanguage === 'hi'
            ? `दवाइयों को हमेशा साफ पानी के साथ लें। एंटीबायोटिक्स का कोर्स बीच में न छोड़ें। यदि कोई गंभीर लक्षण महसूस हो तो तुरंत 108 एम्बुलेंस या नजदीकी पीएचसी (PHC) से संपर्क करें।`
            : `Always take prescribed medicines with clean water. Do not stop antibiotic courses midway. If you experience severe symptoms, contact 108 Ambulance or your nearest PHC immediately.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  const handleSpeak = (msg: ChatMessage) => {
    if (speakingMsgId === msg.id) {
      VoiceAssistantService.stop();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msg.id);
      // Clean markdown stars before speech
      const cleanText = msg.text.replace(/\*\*/g, '').replace(/#/g, '');
      VoiceAssistantService.speak(cleanText, currentLanguage, () => {
        setSpeakingMsgId(null);
      });
    }
  };

  const prompts = QUICK_PROMPTS[currentLanguage] || QUICK_PROMPTS.en;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.aiHeaderTitleRow}>
              <View style={styles.aiAvatarCircle}>
                <Sparkles size={20} color="#FFFFFF" />
              </View>
              <View>
                <View style={styles.badgeRow}>
                  <Text style={styles.aiTitle}>Swasthya Mitr (स्वास्थ मित्र)</Text>
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>AI Active</Text>
                  </View>
                </View>
                <Text style={styles.aiSubtitle}>24x7 Multilingual AI Health Assistant</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Chat Messages Body */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.msgRow,
                  msg.sender === 'user' ? styles.msgRowUser : styles.msgRowAi,
                ]}
              >
                {msg.sender === 'ai' && (
                  <View style={styles.msgAvatarAi}>
                    <Bot size={16} color="#047857" />
                  </View>
                )}

                <View
                  style={[
                    styles.msgBubble,
                    msg.sender === 'user' ? styles.msgBubbleUser : styles.msgBubbleAi,
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      msg.sender === 'user' ? styles.msgTextUser : styles.msgTextAi,
                    ]}
                  >
                    {msg.text}
                  </Text>

                  <View style={styles.msgFooter}>
                    <Text style={styles.msgTimestamp}>{msg.timestamp}</Text>
                    {msg.sender === 'ai' && (
                      <TouchableOpacity
                        style={styles.speakIconBtn}
                        onPress={() => handleSpeak(msg)}
                      >
                        {speakingMsgId === msg.id ? (
                          <VolumeX size={14} color="#DC2626" />
                        ) : (
                          <Volume2 size={14} color="#047857" />
                        )}
                        <Text style={[styles.speakBtnText, speakingMsgId === msg.id && { color: '#DC2626' }]}>
                          {speakingMsgId === msg.id ? 'Stop' : 'Listen'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {msg.sender === 'user' && (
                  <View style={styles.msgAvatarUser}>
                    <User size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}

            {isLoading && (
              <View style={[styles.msgRow, styles.msgRowAi]}>
                <View style={styles.msgAvatarAi}>
                  <Bot size={16} color="#047857" />
                </View>
                <View style={[styles.msgBubble, styles.msgBubbleAi, { paddingVertical: 12 }]}>
                  <ActivityIndicator size="small" color="#047857" />
                  <Text style={styles.thinkingText}>
                    Swasthya Mitr is analyzing your medical query...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Prompt Chips */}
          <View style={styles.quickPromptsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: SPACING.md }}>
              {prompts.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  onPress={() => handleSendMessage(p)}
                >
                  <Text style={styles.promptChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Bar */}
          <View style={styles.inputBarContainer}>
            <TextInput
              style={styles.textInput}
              value={inputQuery}
              onChangeText={setInputQuery}
              placeholder={
                currentLanguage === 'hi'
                  ? 'अपनी दवा या बीमारी के बारे में पूछें...'
                  : 'Ask about medicine dosage, side effects, symptoms...'
              }
              placeholderTextColor="#94A3B8"
              onSubmitEditing={() => handleSendMessage()}
              returnKeyType="send"
            />

            <TouchableOpacity
              style={[styles.sendBtn, (!inputQuery.trim() || isLoading) && styles.sendBtnDisabled]}
              onPress={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isLoading}
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 440,
    height: '88%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
  },
  aiHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#064E3B',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  onlineText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  aiSubtitle: {
    fontSize: 11,
    color: '#047857',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
  },
  chatScrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAi: {
    justifyContent: 'flex-start',
  },
  msgAvatarAi: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  msgAvatarUser: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgBubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...SHADOWS.subtle,
  },
  msgBubbleUser: {
    backgroundColor: '#0284C7',
    borderBottomRightRadius: 4,
  },
  msgBubbleAi: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  msgTextUser: {
    color: '#FFFFFF',
  },
  msgTextAi: {
    color: '#0F172A',
  },
  msgFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 8,
  },
  msgTimestamp: {
    fontSize: 10,
    color: '#94A3B8',
  },
  speakIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  speakBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  thinkingText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
  },
  quickPromptsContainer: {
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  promptChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
    ...SHADOWS.subtle,
  },
  promptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
  },
  inputBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
});
