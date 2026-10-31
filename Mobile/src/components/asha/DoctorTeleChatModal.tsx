import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {
  Phone,
  Send,
  Mic,
  X,
  Sparkles,
  User,
  CheckCheck,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface DoctorTeleChatModalProps {
  visible: boolean;
  onClose: () => void;
  doctorName?: string;
  facility?: string;
}

export const DoctorTeleChatModal: React.FC<DoctorTeleChatModalProps> = ({
  visible,
  onClose,
  doctorName = 'Dr. Ramesh Sharma, MBBS',
  facility = 'Medical Officer • Rampur PHC',
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'doctor',
      time: '08:45 AM',
      text: 'Good morning Sister Sunita. Please check Lakshmi Devi BP today. She reported dizziness yesterday.',
    },
    {
      id: 2,
      sender: 'asha',
      time: '09:15 AM',
      text: 'Good morning Doctor. Visited Lakshmi Devi at Ward 3. BP recorded 142/92 mmHg. Administered morning Amlodipine 5mg.',
    },
    {
      id: 3,
      sender: 'doctor',
      time: '09:20 AM',
      text: 'Good. Keep her on low sodium diet. If headache continues, send referral to PHC OPD.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  if (!visible) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'asha',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleVoiceNote = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      const voiceMsg = {
        id: Date.now(),
        sender: 'asha',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: '🎙️ [Hindi Voice Note]: "डॉक्टर साहब, राम चरण यादव जी का शुगर 160 आया है, दवा नियमित ले रहे हैं।"',
      };
      setMessages((prev) => [...prev, voiceMsg]);
      Alert.alert('🎙️ Voice Note Dispatched', 'Spoken audio note delivered to Dr. Ramesh Sharma.');
    }, 1200);
  };

  const handleCallDoctor = () => {
    Linking.openURL('tel:+919876543210');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarEmoji}>👨‍⚕️</Text>
                <View style={styles.onlineDot} />
              </View>
              <View>
                <Text style={styles.docName}>{doctorName}</Text>
                <Text style={styles.docFacility}>{facility}</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.callBtn} onPress={handleCallDoctor}>
                <Phone size={16} color="#047857" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages Scroll Area */}
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m) => {
              const isMe = m.sender === 'asha';
              return (
                <View key={m.id} style={[styles.bubbleWrapper, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
                  <View style={[styles.bubble, isMe ? styles.bubbleAsha : styles.bubbleDoctor]}>
                    <Text style={[styles.bubbleText, isMe ? styles.textAsha : styles.textDoctor]}>
                      {m.text}
                    </Text>
                    <View style={styles.timeRow}>
                      <Text style={[styles.bubbleTime, isMe ? styles.timeAsha : styles.timeDoctor]}>
                        {m.time}
                      </Text>
                      {isMe && <CheckCheck size={12} color="#A7F3D0" />}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Quick clinical prompt chips */}
          <View style={styles.quickChipsRow}>
            {[
              'BP Checked Normal ✅',
              'Severe Dizziness Reported ⚠️',
              'Need Medicine Refill 💊',
            ].map((chip) => (
              <TouchableOpacity
                key={chip}
                style={styles.quickChip}
                onPress={() => setInputText(chip)}
              >
                <Text style={styles.quickChipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chat Input Bar */}
          <View style={styles.inputBar}>
            <TouchableOpacity
              style={[styles.voiceBtn, isRecordingVoice && styles.voiceBtnActive]}
              onPress={handleVoiceNote}
            >
              <Mic size={18} color={isRecordingVoice ? '#DC2626' : '#64748B'} />
            </TouchableOpacity>

            <TextInput
              style={styles.chatInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message Dr. Ramesh Sharma..."
              placeholderTextColor="#94A3B8"
              onSubmitEditing={handleSend}
            />

            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={16} color="#FFFFFF" />
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
  modalSheet: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.md,
    height: '82%',
    ...SHADOWS.elevated,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  docName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  docFacility: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callBtn: {
    padding: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  bubbleWrapper: {
    width: '100%',
  },
  bubbleRight: {
    alignItems: 'flex-end',
  },
  bubbleLeft: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
  },
  bubbleAsha: {
    backgroundColor: '#047857',
    borderBottomRightRadius: 2,
  },
  bubbleDoctor: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 12,
    lineHeight: 18,
  },
  textAsha: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textDoctor: {
    color: '#0F172A',
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 3,
  },
  bubbleTime: {
    fontSize: 9,
  },
  timeAsha: {
    color: '#A7F3D0',
  },
  timeDoctor: {
    color: '#94A3B8',
  },
  quickChipsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  quickChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quickChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  voiceBtn: {
    padding: 6,
  },
  voiceBtnActive: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
  },
  chatInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '500',
    padding: 0,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
});
