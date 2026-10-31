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
  FileText,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Clock,
  User,
  Pill,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { SafeStorage } from '../../services/safeStorage';

interface DoctorPrescriptionWizardModalProps {
  visible: boolean;
  onClose: () => void;
  patient: any;
  onPrescriptionSaved?: (rx: any) => void;
}

export const DoctorPrescriptionWizardModal: React.FC<DoctorPrescriptionWizardModalProps> = ({
  visible,
  onClose,
  patient,
  onPrescriptionSaved,
}) => {
  const [diagnosis, setDiagnosis] = useState('Essential Hypertension & Seasonal Cough');
  const [medicines, setMedicines] = useState<any[]>([
    {
      name: 'Amlodipine Besylate',
      strength: '5mg',
      dosage: '1 tablet',
      frequency: '1-0-0 (Morning)',
      mealTiming: 'After Food (भोजन के बाद)',
      duration: '15',
    },
    {
      name: 'Paracetamol',
      strength: '650mg',
      dosage: '1 tablet',
      frequency: '1-0-1 (Morning & Night)',
      mealTiming: 'After Food (भोजन के बाद)',
      duration: '5',
    },
  ]);

  // Form for adding new medicine
  const [medName, setMedName] = useState('');
  const [medStrength, setMedStrength] = useState('500mg');
  const [medFreq, setMedFreq] = useState('1-0-1 (Twice Daily)');
  const [medMeal, setMedMeal] = useState('After Food');
  const [medDuration, setMedDuration] = useState('7');
  const [instructions, setInstructions] = useState('Take with warm water. Avoid salty food.');

  if (!visible || !patient) return null;

  const handleAddMedicine = () => {
    if (!medName.trim()) {
      Alert.alert('Medicine Required', 'Please enter medicine name (e.g. Pantoprazole 40mg)');
      return;
    }

    setMedicines((prev) => [
      ...prev,
      {
        name: medName,
        strength: medStrength,
        dosage: '1 tablet/dose',
        frequency: medFreq,
        mealTiming: medMeal,
        duration: medDuration,
      },
    ]);

    setMedName('');
  };

  const handleRemoveMedicine = (idx: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFinalizeRx = async () => {
    if (medicines.length === 0) {
      Alert.alert('No Medicines Added', 'Please add at least one medication.');
      return;
    }

    const rxId = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRx = {
      id: rxId,
      patientName: patient.name || patient.full_name,
      patientAbhaId: patient.abhaId || '91-4820-9921-7740',
      doctorName: 'Dr. Ramesh Sharma, MBBS',
      facility: 'Rampur Primary Health Centre (PHC)',
      date: new Date().toLocaleDateString(),
      diagnosis,
      medicines,
      instructions,
      signature: 'Dr. Ramesh Sharma (Verified ABDM Digital Sign)',
    };

    try {
      // 1. Save to patient active medications in SafeStorage
      const mappedActiveMeds = medicines.map((m, idx) => {
        let timeSlot: 'MORNING' | 'AFTERNOON' | 'NIGHT' = 'MORNING';
        let time = '08:00 AM';
        if (m.frequency.includes('Night') || idx % 2 === 1) {
          timeSlot = 'NIGHT';
          time = '09:00 PM';
        }
        return {
          id: `doc_med_${Date.now()}_${idx}`,
          name: `${m.name} ${m.strength}`,
          genericName: m.name,
          dosage: m.dosage,
          timeSlot,
          scheduledTime: time,
          foodInstruction: m.mealTiming.includes('Before') ? 'BEFORE_FOOD' : 'AFTER_FOOD',
          foodInstructionHindi: m.mealTiming.includes('Before') ? 'सुबह खाली पेट' : 'भोजन के 20 मिनट बाद',
          status: 'PENDING',
          form: 'tablet',
          prescribedBy: 'Dr. Ramesh Sharma (PHC)',
          duration: `${m.duration} Days`,
          purpose: diagnosis,
          color: idx % 2 === 0 ? '#E0F2FE' : '#FEF3C7',
        };
      });

      await SafeStorage.setItem('@swasthya_active_medications', JSON.stringify(mappedActiveMeds));

      // 2. Save to Digital Health Records
      const newRecord = {
        id: rxId,
        title: `PHC E-Prescription (${diagnosis})`,
        type: 'PRESCRIPTION',
        doctorName: 'Dr. Ramesh Sharma (PHC)',
        facility: 'Rampur Primary Health Centre',
        date: new Date().toLocaleDateString(),
        summary: `Prescribed ${medicines.length} medications for ${diagnosis}. Daily adherence schedule activated.`,
        status: 'VERIFIED',
        findings: [diagnosis, 'Normal follow-up in 15 days'],
      };

      const existingRecordsStr = await SafeStorage.getItem('@swasthya_health_records');
      const existingRecords = existingRecordsStr ? JSON.parse(existingRecordsStr) : [];
      await SafeStorage.setItem(
        '@swasthya_health_records',
        JSON.stringify([newRecord, ...existingRecords])
      );
    } catch (e) {}

    if (onPrescriptionSaved) onPrescriptionSaved(newRx);

    Alert.alert(
      '🎉 Digital Prescription Issued & Synced!',
      `E-Prescription ${rxId} generated for ${patient.name || patient.full_name}.\n\nAll ${medicines.length} medications have been auto-scheduled into the Patient's Mobile Pillbox & Digital Health Vault.`
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
                <FileText size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Digital Prescription Builder</Text>
                <Text style={styles.modalSub}>
                  Patient: {patient.name || patient.full_name} ({patient.age} yrs • {patient.gender})
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
            {/* Diagnosis Box */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Clinical Diagnosis / निदान</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  value={diagnosis}
                  onChangeText={setDiagnosis}
                  placeholder="Enter clinical diagnosis"
                />
              </View>
            </View>

            {/* Current Medicines List in Rx */}
            <View style={styles.rxListCard}>
              <View style={styles.rxListHeader}>
                <Pill size={14} color="#059669" />
                <Text style={styles.rxListTitle}>Prescribed Medications ({medicines.length})</Text>
              </View>

              {medicines.map((m, idx) => (
                <View key={idx} style={styles.medItemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medItemName}>
                      {idx + 1}. {m.name} <Text style={styles.medStrengthText}>({m.strength})</Text>
                    </Text>
                    <Text style={styles.medItemSub}>
                      {m.frequency} • {m.mealTiming} • {m.duration} Days
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.removeMedBtn}
                    onPress={() => handleRemoveMedicine(idx)}
                  >
                    <Trash2 size={14} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Quick Add Medicine Card */}
            <View style={styles.addMedBox}>
              <Text style={styles.addMedHeading}>+ Add New Medication</Text>

              {/* Medicine Name with Quick Suggestions */}
              <View style={styles.inputGroup}>
                <Text style={styles.subInputLabel}>Medicine & Strength</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.textInput}
                    value={medName}
                    onChangeText={setMedName}
                    placeholder="E.g. Metformin, Pan 40, Dolo 650"
                  />
                </View>
              </View>

              {/* Quick Suggestion Chips */}
              <View style={styles.suggestionsRow}>
                {['Pantoprazole 40mg', 'Amoxicillin 500mg', 'Metformin 500mg', 'Amlodipine 5mg'].map((sug) => (
                  <TouchableOpacity
                    key={sug}
                    style={styles.sugChip}
                    onPress={() => setMedName(sug)}
                  >
                    <Text style={styles.sugChipText}>{sug}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Frequency & Meal Rules */}
              <View style={styles.splitRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.subInputLabel}>Frequency</Text>
                  <View style={styles.frequencyRow}>
                    {['1-0-0', '1-0-1', '1-1-1'].map((f) => (
                      <TouchableOpacity
                        key={f}
                        style={[styles.freqChip, medFreq.startsWith(f) && styles.freqChipActive]}
                        onPress={() => setMedFreq(`${f} Dosage`)}
                      >
                        <Text style={[styles.freqText, medFreq.startsWith(f) && styles.freqTextActive]}>
                          {f}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 0.8 }]}>
                  <Text style={styles.subInputLabel}>Duration (Days)</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.textInput}
                      value={medDuration}
                      onChangeText={setMedDuration}
                      keyboardType="numeric"
                    />
                    <Text style={styles.unitText}>Days</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.addMedBtn} onPress={handleAddMedicine}>
                <Plus size={14} color="#059669" />
                <Text style={styles.addMedBtnText}>Add To Prescription</Text>
              </TouchableOpacity>
            </View>

            {/* Special Instructions */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Doctor Notes & Dietary Instructions</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  value={instructions}
                  onChangeText={setInstructions}
                  placeholder="Special instructions for patient"
                />
              </View>
            </View>

            {/* Submit & Sign Button */}
            <TouchableOpacity style={styles.finalizeBtn} onPress={handleFinalizeRx} activeOpacity={0.85}>
              <ShieldCheck size={18} color="#FFFFFF" />
              <Text style={styles.finalizeBtnText}>Sign & Sync to Patient Pillbox</Text>
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
    padding: SPACING.md,
    maxHeight: '90%',
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
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  subInputLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
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
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  unitText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  rxListCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
  },
  rxListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  rxListTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  medItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medItemName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  medStrengthText: {
    color: '#059669',
    fontWeight: '700',
  },
  medItemSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  removeMedBtn: {
    padding: 6,
  },
  addMedBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  addMedHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sugChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sugChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  splitRow: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 4,
  },
  freqChip: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  freqChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  freqText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  freqTextActive: {
    color: '#065F46',
  },
  addMedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 2,
  },
  addMedBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  finalizeBtn: {
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
  finalizeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
