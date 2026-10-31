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
} from 'react-native';
import {
  Hospital,
  AlertCircle,
  Ambulance,
  Check,
  X,
  User,
  MapPin,
  Building,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { SafeStorage } from '../../services/safeStorage';

interface CreateReferralModalProps {
  visible: boolean;
  onClose: () => void;
  defaultPatient?: any;
  onSuccess?: (referral: any) => void;
}

export const CreateReferralModal: React.FC<CreateReferralModalProps> = ({
  visible,
  onClose,
  defaultPatient,
  onSuccess,
}) => {
  const [patientName, setPatientName] = useState(defaultPatient?.name || defaultPatient?.full_name || 'Ram Charan Yadav');
  const [referredFacility, setReferredFacility] = useState('Rampur PHC (Dr. Ramesh Sharma)');
  const [reason, setReason] = useState('Uncontrolled Hypertension & Headache');
  const [priority, setPriority] = useState<'ROUTINE' | 'URGENT' | 'EMERGENCY'>('URGENT');
  const [transportNeeded, setTransportNeeded] = useState(false);

  if (!visible) return null;

  const handleCreate = async () => {
    if (!patientName.trim() || !reason.trim()) {
      Alert.alert('Required Fields', 'Please specify patient name and referral reason.');
      return;
    }

    const referral = {
      id: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      facility: referredFacility,
      reason,
      urgency: priority,
      status: 'UNDER_REVIEW',
      statusLabel: '🟡 Under Doctor Review',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      ambulance108: transportNeeded,
    };

    try {
      const storedStr = await SafeStorage.getItem('@swasthya_asha_referrals');
      const stored = storedStr ? JSON.parse(storedStr) : [];
      await SafeStorage.setItem(
        '@swasthya_asha_referrals',
        JSON.stringify([referral, ...stored])
      );
    } catch (e) {}

    if (onSuccess) onSuccess(referral);

    Alert.alert(
      '✅ PHC Referral Ticket Dispatched!',
      `Referral Slip issued for ${patientName} → ${referredFacility}.\nPriority: ${priority}${transportNeeded ? '\n🚨 108 Ambulance Dispatch Alerted.' : ''}`
    );

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconCircle}>
                <Hospital size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Issue PHC Referral Slip</Text>
                <Text style={styles.modalSub}>प्राथमिक स्वास्थ्य केंद्र रेफरल पर्ची</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 20 }}>
            {/* Patient Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Patient Name / रोगी का नाम</Text>
              <View style={styles.inputBox}>
                <User size={16} color="#64748B" />
                <TextInput
                  style={styles.textInput}
                  value={patientName}
                  onChangeText={setPatientName}
                  placeholder="Enter patient full name"
                />
              </View>
            </View>

            {/* Destination Facility */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Referred Facility / संदर्भित अस्पताल</Text>
              <View style={styles.facilityRow}>
                {[
                  'Rampur PHC (Dr. Ramesh Sharma)',
                  'Varanasi District Hospital',
                  'Community Health Centre (CHC)',
                ].map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.facilityChip, referredFacility === f && styles.facilityChipActive]}
                    onPress={() => setReferredFacility(f)}
                  >
                    <Building size={12} color={referredFacility === f ? '#0369A1' : '#64748B'} />
                    <Text style={[styles.facilityText, referredFacility === f && styles.facilityTextActive]}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Priority Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Triage Priority / प्राथमिकता</Text>
              <View style={styles.priorityRow}>
                {(['ROUTINE', 'URGENT', 'EMERGENCY'] as const).map((p) => {
                  const isActive = priority === p;
                  const isEmerg = p === 'EMERGENCY';
                  const isUrg = p === 'URGENT';
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityChip,
                        isActive && (isEmerg ? styles.priorityEmergActive : isUrg ? styles.priorityUrgActive : styles.priorityRoutineActive),
                      ]}
                      onPress={() => setPriority(p)}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          isActive && (isEmerg ? styles.priorityEmergText : isUrg ? styles.priorityUrgText : styles.priorityRoutineText),
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Clinical Reason */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Clinical Reason / रेफरल का कारण</Text>
              <View style={styles.inputBox}>
                <AlertCircle size={16} color="#64748B" />
                <TextInput
                  style={styles.textInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="E.g. Stage-2 BP, chest discomfort"
                />
              </View>
            </View>

            {/* 108 Ambulance Dispatch Checkbox */}
            <TouchableOpacity
              style={[styles.ambulanceCard, transportNeeded && styles.ambulanceCardActive]}
              onPress={() => setTransportNeeded(!transportNeeded)}
            >
              <Ambulance size={20} color={transportNeeded ? '#DC2626' : '#64748B'} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.ambulanceTitle, transportNeeded && styles.ambulanceTitleActive]}>
                  Request 108 Emergency Ambulance
                </Text>
                <Text style={styles.ambulanceSub}>108 आपातकालीन एम्बुलेंस परिवहन की आवश्यकता है</Text>
              </View>
              <View style={[styles.checkboxCircle, transportNeeded && styles.checkboxCircleActive]}>
                {transportNeeded && <Check size={12} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} activeOpacity={0.85}>
              <Check size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Issue Referral & Send to PHC Doctor</Text>
            </TouchableOpacity>
          </ScrollView>
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
    padding: SPACING.lg,
    maxHeight: '88%',
    ...SHADOWS.elevated,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  facilityRow: {
    gap: 6,
  },
  facilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  facilityChipActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0284C7',
  },
  facilityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  facilityTextActive: {
    color: '#0369A1',
    fontWeight: '700',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priorityRoutineActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  priorityUrgActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  priorityEmergActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  priorityRoutineText: {
    color: '#059669',
  },
  priorityUrgText: {
    color: '#D97706',
  },
  priorityEmergText: {
    color: '#DC2626',
  },
  ambulanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ambulanceCardActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  ambulanceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  ambulanceTitleActive: {
    color: '#DC2626',
  },
  ambulanceSub: {
    fontSize: 10,
    color: '#64748B',
  },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 6,
    ...SHADOWS.subtle,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
