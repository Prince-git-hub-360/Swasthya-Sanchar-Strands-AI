import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { AlertTriangle, PhoneCall, ShieldAlert, MapPin, X, MessageSquare, Send, Users } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { EmergencySosService, EmergencyContact } from '../../services/emergencySosService';

export const SosButton: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [contact, setContact] = useState<EmergencyContact>({
    name: 'Ramesh Kumar (Family)',
    phone: '9008802105',
    relationship: 'Son / बेटा',
  });

  const loadData = async () => {
    const savedContact = await EmergencySosService.getEmergencyContact();
    setContact(savedContact);
    const loc = await EmergencySosService.getLiveLocation();
    setCoords(loc);
  };

  const handleOpenSos = async () => {
    setModalVisible(true);
    await loadData();
  };

  const patientName = user?.first_name || (user?.username && !/^\d+$/.test(user.username) ? user.username : 'Prince Kumar');
  const village = user?.village_or_town || 'Rampur Gram, Ward 3';

  const handleSendSms = async () => {
    const loc = coords || (await EmergencySosService.getLiveLocation());
    const msg = EmergencySosService.generateDistressMessage({
      patientName,
      village,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    // Sync with backend beacon
    EmergencySosService.broadcastToBackendAndCaregiver({
      patientName,
      village,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    await EmergencySosService.sendNativeSms(contact.phone, msg);
    setModalVisible(false);
  };

  const handleSendWhatsApp = async () => {
    const loc = coords || (await EmergencySosService.getLiveLocation());
    const msg = EmergencySosService.generateDistressMessage({
      patientName,
      village,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    // Sync with backend beacon
    EmergencySosService.broadcastToBackendAndCaregiver({
      patientName,
      village,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    await EmergencySosService.sendWhatsApp(contact.phone, msg);
    setModalVisible(false);
  };

  const handleCallFamily = async () => {
    await EmergencySosService.callFamily(contact.phone);
  };

  const handleCall108 = async () => {
    await EmergencySosService.call108Ambulance();
  };

  const handleSendEmergencyAlert = async () => {
    setIsSending(true);
    try {
      const loc = coords || (await EmergencySosService.getLiveLocation());
      await EmergencySosService.broadcastToBackendAndCaregiver({
        patientName,
        village,
        latitude: loc.latitude,
        longitude: loc.longitude,
      });

      Alert.alert(
        '🚨 Emergency Beacon Activated / आपातकालीन सूचना',
        `Live GPS distress signal recorded for ${contact.name} (${contact.phone}) and 108 Emergency Ambulance.\n\nChoose how to dispatch directly:`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: '💬 Send Native SMS', onPress: handleSendSms },
          { text: '🟢 Send WhatsApp', onPress: handleSendWhatsApp },
        ]
      );
    } catch (err) {
      handleSendSms();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleOpenSos}
        activeOpacity={0.85}
      >
        <AlertTriangle size={24} color={COLORS.textInverse} />
        <Text style={styles.sosText}>{t('emergency_sos') || 'SOS'}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.headerRow}>
              <View style={styles.alertIconCircle}>
                <ShieldAlert size={32} color={COLORS.emergency} />
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.emergencyHeading}>Emergency Assistance / आपातकालीन सहायता</Text>
            <Text style={styles.emergencySub}>
              Instantly sends your live GPS coordinates and emergency distress alert to your registered family member.
            </Text>

            {/* Registered Family Contact Card */}
            <View style={styles.contactCard}>
              <View style={styles.contactLeft}>
                <Users size={16} color={COLORS.primary} />
                <View>
                  <Text style={styles.contactTitle}>Emergency Family Member</Text>
                  <Text style={styles.contactPhone}>{contact.name} • +91 {contact.phone}</Text>
                </View>
              </View>
            </View>

            {/* Quick 1-Tap Real Emergency Dispatch Row */}
            <View style={styles.quickDispatchRow}>
              <TouchableOpacity style={styles.quickSmsBtn} onPress={handleSendSms} activeOpacity={0.85}>
                <MessageSquare size={18} color="#047857" />
                <Text style={styles.quickSmsText}>SMS with GPS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickWaBtn} onPress={handleSendWhatsApp} activeOpacity={0.85}>
                <Send size={18} color="#15803D" />
                <Text style={styles.quickWaText}>WhatsApp SOS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickCallBtn} onPress={handleCall108} activeOpacity={0.85}>
                <PhoneCall size={18} color="#DC2626" />
                <Text style={styles.quickCallText}>Call 108</Text>
              </TouchableOpacity>
            </View>

            {coords && (
              <View style={styles.gpsBanner}>
                <MapPin size={16} color={COLORS.primaryDark} />
                <Text style={styles.gpsText}>
                  GPS: {coords.latitude.toFixed(4)}° N, {coords.longitude.toFixed(4)}° E (Rampur, Varanasi)
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.confirmSosButton}
              onPress={handleSendEmergencyAlert}
              disabled={isSending}
              activeOpacity={0.9}
            >
              {isSending ? (
                <ActivityIndicator color={COLORS.textInverse} />
              ) : (
                <>
                  <ShieldAlert size={22} color={COLORS.textInverse} />
                  <Text style={styles.confirmSosText}>BROADCAST DISTRESS ALERT NOW</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel / वापस जाएं</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: COLORS.emergency,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
    shadowColor: COLORS.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  sosText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertIconCircle: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.emergencyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 8,
  },
  emergencyHeading: {
    ...TYPOGRAPHY.h2,
    color: COLORS.emergencyDark,
    marginTop: SPACING.md,
  },
  emergencySub: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
    textTransform: 'uppercase',
  },
  contactPhone: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  quickDispatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  quickSmsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  quickSmsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  quickWaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  quickWaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  quickCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  quickCallText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySurface,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  gpsText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  confirmSosButton: {
    backgroundColor: COLORS.emergency,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  confirmSosText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
    fontSize: 16,
  },
  cancelButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textSecondary,
  },
});
