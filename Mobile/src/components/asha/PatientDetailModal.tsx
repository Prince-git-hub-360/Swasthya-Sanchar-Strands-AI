import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {
  User,
  ShieldCheck,
  Phone,
  Calendar,
  Activity,
  Heart,
  FileText,
  X,
  MapPin,
  Sparkles,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface PatientDetailModalProps {
  visible: boolean;
  onClose: () => void;
  patient: any;
  onOpenRecordVitals?: () => void;
  onOpenReferral?: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  visible,
  onClose,
  patient,
  onOpenRecordVitals,
  onOpenReferral,
}) => {
  if (!visible || !patient) return null;

  const handleCall = () => {
    if (patient.phone) {
      Linking.openURL(`tel:${patient.phone}`);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.headerTop}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>
                  {patient.gender === 'Female' ? '👩' : '👨'}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.patientName}>{patient.name || patient.full_name}</Text>
                <View style={styles.abhaRow}>
                  <ShieldCheck size={12} color="#059669" />
                  <Text style={styles.abhaIdText}>{patient.abhaId || '91-4820-9921-7740'}</Text>
                </View>
                <Text style={styles.subMeta}>
                  {patient.age} yrs • {patient.gender} • {patient.ward || 'Ward 3'}, {patient.village || 'Rampur'}
                </Text>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Adherence & Streak Bar */}
            <View style={styles.adherenceRow}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{patient.adherenceRate || 92}%</Text>
                <Text style={styles.statLabel}>Adherence</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statVal}>🔥 {patient.streakDays || 5} Days</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statVal, { color: patient.status === 'ATTENTION_NEEDED' ? '#DC2626' : '#059669' }]}>
                  {patient.status === 'ATTENTION_NEEDED' ? '⚠️ Attention' : '✅ On Track'}
                </Text>
                <Text style={styles.statLabel}>Status</Text>
              </View>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 12 }}>
            {/* AI Clinical Summary */}
            <View style={styles.aiBox}>
              <View style={styles.aiHeader}>
                <Sparkles size={14} color="#047857" />
                <Text style={styles.aiTitle}>AI Health Summary & Risk Profile</Text>
              </View>
              <Text style={styles.aiText}>
                Chronic care monitoring for {patient.conditions?.join(', ') || 'Hypertension & Type 2 Diabetes'}. Adherence is high. Recent BP is within target range.
              </Text>
            </View>

            {/* Active Conditions */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Chronic Conditions & Care Plans</Text>
              <View style={styles.conditionTags}>
                {(patient.conditions || ['Hypertension', 'Routine Checkup']).map((c: string) => (
                  <View key={c} style={styles.condPill}>
                    <Text style={styles.condText}>{c}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Recent Vitals */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Latest Doorstep Vitals</Text>
              <View style={styles.vitalsGrid}>
                <View style={styles.vitalTile}>
                  <Heart size={14} color="#E11D48" />
                  <Text style={styles.vitalVal}>124/82</Text>
                  <Text style={styles.vitalUnit}>mmHg (BP)</Text>
                </View>
                <View style={styles.vitalTile}>
                  <Activity size={14} color="#D97706" />
                  <Text style={styles.vitalVal}>112</Text>
                  <Text style={styles.vitalUnit}>mg/dL (Sugar)</Text>
                </View>
                <View style={styles.vitalTile}>
                  <Activity size={14} color="#0284C7" />
                  <Text style={styles.vitalVal}>98%</Text>
                  <Text style={styles.vitalUnit}>SpO2</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons Row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() => {
                  onClose();
                  if (onOpenRecordVitals) onOpenRecordVitals();
                }}
              >
                <Activity size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnPrimaryText}>Record Vitals</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnSecondary}
                onPress={() => {
                  onClose();
                  if (onOpenReferral) onOpenReferral();
                }}
              >
                <FileText size={16} color="#0284C7" />
                <Text style={styles.actionBtnSecondaryText}>Refer to PHC</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtnPhone} onPress={handleCall}>
                <Phone size={16} color="#047857" />
              </TouchableOpacity>
            </View>
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
    padding: SPACING.md,
    maxHeight: '88%',
    ...SHADOWS.elevated,
  },
  headerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  abhaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  abhaIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    fontFamily: 'monospace',
  },
  subMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adherenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E1',
  },
  aiBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  aiTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  aiText: {
    fontSize: 11,
    color: '#047857',
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
  },
  conditionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  condPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  condText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  vitalTile: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vitalVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  vitalUnit: {
    fontSize: 9,
    color: '#64748B',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtnPrimary: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBtnSecondary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  actionBtnPhone: {
    padding: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
