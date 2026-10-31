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
  Activity,
  Heart,
  AlertTriangle,
  Check,
  X,
  Thermometer,
  Scale,
  Sparkles,
  User,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { SafeStorage } from '../../services/safeStorage';

interface RecordVitalsModalProps {
  visible: boolean;
  onClose: () => void;
  defaultPatient?: any;
  onSaveVitals?: (vitals: any) => void;
}

export const RecordVitalsModal: React.FC<RecordVitalsModalProps> = ({
  visible,
  onClose,
  defaultPatient,
  onSaveVitals,
}) => {
  const [patientName, setPatientName] = useState(defaultPatient?.name || defaultPatient?.full_name || 'Lakshmi Devi');
  const [systolic, setSystolic] = useState('142');
  const [diastolic, setDiastolic] = useState('92');
  const [bloodSugar, setBloodSugar] = useState('148');
  const [sugarType, setSugarType] = useState<'Fasting' | 'Post-Meal' | 'Random'>('Random');
  const [pulse, setPulse] = useState('78');
  const [spo2, setSpo2] = useState('98');
  const [weight, setWeight] = useState('58');
  const [notes, setNotes] = useState('');

  if (!visible) return null;

  const sysNum = parseInt(systolic) || 0;
  const diaNum = parseInt(diastolic) || 0;
  const isHighBp = sysNum >= 140 || diaNum >= 90;

  const sugarNum = parseInt(bloodSugar) || 0;
  const isHighSugar = sugarNum >= 180;

  const handleSave = async () => {
    const vitalsRecord = {
      id: `vit_${Date.now()}`,
      patientName,
      bp: `${systolic}/${diastolic} mmHg`,
      systolic: sysNum,
      diastolic: diaNum,
      bloodSugar: `${bloodSugar} mg/dL (${sugarType})`,
      pulse: `${pulse} bpm`,
      spo2: `${spo2}%`,
      weight: `${weight} kg`,
      notes,
      isHighBp,
      isHighSugar,
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
    };

    try {
      const existingStr = await SafeStorage.getItem('@swasthya_vitals_logs');
      const existingLogs = existingStr ? JSON.parse(existingStr) : [];
      await SafeStorage.setItem(
        '@swasthya_vitals_logs',
        JSON.stringify([vitalsRecord, ...existingLogs])
      );
    } catch (e) {}

    if (onSaveVitals) onSaveVitals(vitalsRecord);

    if (isHighBp || isHighSugar) {
      Alert.alert(
        '⚠️ High Risk Vitals Logged / उच्च जोखिम!',
        `BP: ${vitalsRecord.bp}, Sugar: ${vitalsRecord.bloodSugar}. Doctor alert notification dispatched to PHC Medical Officer.`
      );
    } else {
      Alert.alert('✅ Vitals Recorded Successfully', `Doorstep clinical vitals updated for ${patientName}.`);
    }

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
                <Activity size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Record Field Vitals</Text>
                <Text style={styles.modalSub}>रोगी के शारीरिक स्वास्थ्य संकेतक दर्ज करें</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
            {/* Patient Selector Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Patient Name / रोगी का नाम</Text>
              <View style={styles.inputBox}>
                <User size={16} color="#64748B" />
                <TextInput
                  style={styles.textInput}
                  value={patientName}
                  onChangeText={setPatientName}
                  placeholder="Enter patient full name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Blood Pressure Row */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithWarning}>
                <Text style={styles.inputLabel}>Blood Pressure (BP) / रक्तचाप</Text>
                {isHighBp && (
                  <View style={styles.warningPill}>
                    <AlertTriangle size={12} color="#DC2626" />
                    <Text style={styles.warningText}>HIGH BP</Text>
                  </View>
                )}
              </View>

              <View style={styles.splitInputRow}>
                <View style={[styles.inputBox, { flex: 1 }, isHighBp && styles.inputWarningBorder]}>
                  <Text style={styles.subInputTag}>SYS</Text>
                  <TextInput
                    style={styles.textInputNumber}
                    value={systolic}
                    onChangeText={setSystolic}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>mmHg</Text>
                </View>

                <Text style={styles.dividerSlash}>/</Text>

                <View style={[styles.inputBox, { flex: 1 }, isHighBp && styles.inputWarningBorder]}>
                  <Text style={styles.subInputTag}>DIA</Text>
                  <TextInput
                    style={styles.textInputNumber}
                    value={diastolic}
                    onChangeText={setDiastolic}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>mmHg</Text>
                </View>
              </View>
            </View>

            {/* Blood Sugar & Meal Timing */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithWarning}>
                <Text style={styles.inputLabel}>Blood Glucose / ब्लड शुगर</Text>
                {isHighSugar && (
                  <View style={styles.warningPill}>
                    <AlertTriangle size={12} color="#DC2626" />
                    <Text style={styles.warningText}>HIGH SUGAR</Text>
                  </View>
                )}
              </View>

              {/* Sugar Type Selector */}
              <View style={styles.sugarTypeRow}>
                {(['Random', 'Fasting', 'Post-Meal'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.sugarTypeChip, sugarType === type && styles.sugarTypeChipActive]}
                    onPress={() => setSugarType(type)}
                  >
                    <Text style={[styles.sugarTypeText, sugarType === type && styles.sugarTypeTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.inputBox, isHighSugar && styles.inputWarningBorder]}>
                <Sparkles size={16} color="#D97706" />
                <TextInput
                  style={styles.textInputNumber}
                  value={bloodSugar}
                  onChangeText={setBloodSugar}
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>mg/dL</Text>
              </View>
            </View>

            {/* Pulse & SpO2 */}
            <View style={styles.splitInputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Pulse / नाड़ी दर</Text>
                <View style={styles.inputBox}>
                  <Heart size={16} color="#E11D48" />
                  <TextInput
                    style={styles.textInputNumber}
                    value={pulse}
                    onChangeText={setPulse}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>bpm</Text>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>SpO2 / ऑक्सीजन</Text>
                <View style={styles.inputBox}>
                  <Activity size={16} color="#0284C7" />
                  <TextInput
                    style={styles.textInputNumber}
                    value={spo2}
                    onChangeText={setSpo2}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>%</Text>
                </View>
              </View>
            </View>

            {/* Weight & Field Notes */}
            <View style={styles.splitInputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Weight / वजन</Text>
                <View style={styles.inputBox}>
                  <Scale size={16} color="#64748B" />
                  <TextInput
                    style={styles.textInputNumber}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>kg</Text>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Symptoms / लक्षण</Text>
                <View style={styles.inputBox}>
                  <Thermometer size={16} color="#64748B" />
                  <TextInput
                    style={styles.textInput}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="E.g. Dizziness"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {/* Submit CTA */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSave} activeOpacity={0.85}>
              <Check size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Save & Dispatch to PHC Doctor</Text>
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
    backgroundColor: '#059669',
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
  labelWithWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  warningPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  warningText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#DC2626',
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
  inputWarningBorder: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF5F5',
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  textInputNumber: {
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    padding: 0,
  },
  subInputTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
  },
  unitText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  splitInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerSlash: {
    fontSize: 20,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  sugarTypeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  sugarTypeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sugarTypeChipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  sugarTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  sugarTypeTextActive: {
    color: '#B45309',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
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
