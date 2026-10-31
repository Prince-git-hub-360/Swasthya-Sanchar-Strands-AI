import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Vibration,
} from 'react-native';
import {
  PhoneCall,
  PhoneOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  Pill,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceAssistantService } from '../../services/speechService';
import { MockMedicine } from '../../mock/healthData';

interface IvrCallSimulatorModalProps {
  visible: boolean;
  onClose: () => void;
  medicine?: MockMedicine | null;
  onConfirmDoseTaken?: (medicineId: string) => void;
}

export const IvrCallSimulatorModal: React.FC<IvrCallSimulatorModalProps> = ({
  visible,
  onClose,
  medicine,
  onConfirmDoseTaken,
}) => {
  const { currentLanguage } = useLanguage();
  const [callState, setCallState] = useState<'RINGING' | 'CONNECTED' | 'ENDED'>('RINGING');
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const medName = medicine?.name || 'Pantoprazole 40mg';
  const medDose = medicine?.dosage || '1 Tablet (1 गोली)';
  const medTiming = medicine?.foodInstructionHindi || 'सुबह खाली पेट गुनगुने पानी के साथ';

  // Ringing state timer & audio trigger
  useEffect(() => {
    let timer: any = null;
    if (visible) {
      setCallState('RINGING');
      setCallDurationSeconds(0);

      // Vibrate pattern if supported
      try {
        Vibration.vibrate([400, 800, 400, 800], false);
      } catch (e) {}
    } else {
      VoiceAssistantService.stop();
      setCallState('ENDED');
    }

    return () => {
      if (timer) clearInterval(timer);
      VoiceAssistantService.stop();
    };
  }, [visible]);

  // Call timer when connected
  useEffect(() => {
    let interval: any = null;
    if (callState === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);

      // Speak IVR voice prompt in Hindi/Vernacular
      const ivrSpeech =
        currentLanguage === 'hi'
          ? `नमस्ते! यह रामपूर प्राथमिक स्वास्थ्य केंद्र से स्वचालित टेली-केयर रिमाइंडर कॉल है। आपकी दवा ${medName}, ${medDose} लेने का समय हो गया है। इसे ${medTiming} लें। यदि आपने दवा ले ली है, तो स्क्रीन पर हरा बटन दबाएं। स्वस्थ रहें!`
          : `Hello! This is an automated tele-care reminder call from Rampur Primary Health Centre. It is time to take your medicine ${medName}, ${medDose}. Please take it as instructed. Press the green button on your screen to confirm you have taken your dose. Stay healthy!`;

      VoiceAssistantService.speak(ivrSpeech, currentLanguage);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState, currentLanguage, medName, medDose, medTiming]);

  const handleAcceptCall = () => {
    try {
      Vibration.cancel();
    } catch (e) {}
    setCallState('CONNECTED');
  };

  const handleDeclineCall = () => {
    try {
      Vibration.cancel();
    } catch (e) {}
    VoiceAssistantService.stop();
    setCallState('ENDED');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleConfirmDose = () => {
    VoiceAssistantService.stop();
    if (medicine && onConfirmDoseTaken) {
      onConfirmDoseTaken(medicine.id);
    }
    setCallState('ENDED');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.callScreenContainer}>
          {/* Top Status Header */}
          <View style={styles.callHeader}>
            <View style={styles.shieldBadge}>
              <ShieldCheck size={14} color="#10B981" />
              <Text style={styles.shieldBadgeText}>Govt. PHC Tele-Health Line</Text>
            </View>
            <Text style={styles.callStateLabel}>
              {callState === 'RINGING'
                ? 'INCOMING CALL • कॉल आ रही है...'
                : callState === 'CONNECTED'
                ? `ON CALL • ${formatTimer(callDurationSeconds)}`
                : 'CALL ENDED'}
            </Text>
          </View>

          {/* Caller Identity Block */}
          <View style={styles.callerIdentityBlock}>
            <View style={styles.callerAvatarOuter}>
              <View style={styles.callerAvatarPulse}>
                <Building2 size={38} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.callerName}>Rampur PHC Tele-Care</Text>
            <Text style={styles.callerSub}>रामपूर प्राथमिक स्वास्थ्य केंद्र (वार्ड ३)</Text>
            <Text style={styles.callerNumber}>+91 542 222 1080 (Automated IVR)</Text>
          </View>

          {/* Medicine Card Alert inside Call */}
          <View style={styles.medAlertCard}>
            <View style={styles.medAlertHeader}>
              <Pill size={18} color="#059669" />
              <Text style={styles.medAlertTitle}>Medication Reminder / दवाई की खुराक</Text>
            </View>
            <Text style={styles.medAlertName}>{medName}</Text>
            <Text style={styles.medAlertDose}>{medDose}</Text>
            <Text style={styles.medAlertTiming}>📋 {medTiming}</Text>
          </View>

          {/* Connected Call Content & Interactive IVR Options */}
          {callState === 'CONNECTED' ? (
            <View style={styles.ivrActionBox}>
              <Text style={styles.ivrAudioPromptText}>
                {currentLanguage === 'hi'
                  ? '🔊 कॉल पर आवाज सुनिए एवं खुराक की पुष्टि करें'
                  : '🔊 Listening to automated clinical IVR instructions...'}
              </Text>

              <TouchableOpacity
                style={styles.confirmTakenBtn}
                onPress={handleConfirmDose}
                activeOpacity={0.85}
              >
                <Check size={22} color="#FFFFFF" />
                <Text style={styles.confirmTakenBtnText}>
                  {currentLanguage === 'hi' ? '✓ खुराक ले ली (Confirm Taken)' : '✓ Mark Dose as Taken'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Bottom Actions Bar */}
          <View style={styles.callControlsContainer}>
            {callState === 'RINGING' ? (
              <View style={styles.ringingButtonsRow}>
                {/* Decline Button */}
                <TouchableOpacity
                  style={[styles.callCircleBtn, styles.declineBtn]}
                  onPress={handleDeclineCall}
                  activeOpacity={0.85}
                >
                  <PhoneOff size={28} color="#FFFFFF" />
                  <Text style={styles.btnLabel}>Decline / काटें</Text>
                </TouchableOpacity>

                {/* Accept Button */}
                <TouchableOpacity
                  style={[styles.callCircleBtn, styles.acceptBtn]}
                  onPress={handleAcceptCall}
                  activeOpacity={0.85}
                >
                  <PhoneCall size={28} color="#FFFFFF" />
                  <Text style={styles.btnLabel}>Accept / उठाएं</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.connectedButtonsRow}>
                <TouchableOpacity
                  style={[styles.smallControlBtn, isMuted && styles.controlBtnActive]}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff size={22} color="#FFFFFF" /> : <Mic size={22} color="#FFFFFF" />}
                  <Text style={styles.smallControlLabel}>Mute</Text>
                </TouchableOpacity>

                {/* End Call Button */}
                <TouchableOpacity
                  style={[styles.callCircleBtn, styles.declineBtn]}
                  onPress={handleDeclineCall}
                  activeOpacity={0.85}
                >
                  <PhoneOff size={28} color="#FFFFFF" />
                  <Text style={styles.btnLabel}>End Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.smallControlBtn, isSpeakerOn && styles.controlBtnActive]}
                  onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                >
                  {isSpeakerOn ? <Volume2 size={22} color="#FFFFFF" /> : <VolumeX size={22} color="#FFFFFF" />}
                  <Text style={styles.smallControlLabel}>Speaker</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  callScreenContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...SHADOWS.card,
  },
  callHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 8,
  },
  shieldBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  callStateLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  callerIdentityBlock: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  callerAvatarOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  callerAvatarPulse: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  callerName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  callerSub: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  callerNumber: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  medAlertCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: SPACING.lg,
  },
  medAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  medAlertTitle: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  medAlertName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  medAlertDose: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  medAlertTiming: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: '500',
  },
  ivrActionBox: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  ivrAudioPromptText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  confirmTakenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: 24,
    width: '100%',
    ...SHADOWS.card,
  },
  confirmTakenBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  callControlsContainer: {
    marginTop: SPACING.sm,
  },
  ringingButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  connectedButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  callCircleBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  acceptBtn: {
    backgroundColor: '#10B981',
  },
  declineBtn: {
    backgroundColor: '#EF4444',
  },
  btnLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    position: 'absolute',
    bottom: -22,
    width: 80,
    textAlign: 'center',
  },
  smallControlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  smallControlLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    position: 'absolute',
    bottom: -18,
  },
});
