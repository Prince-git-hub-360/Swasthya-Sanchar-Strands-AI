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
  Pill,
  X,
  Check,
  Sunrise,
  Sun,
  Moon,
  Clock,
  Utensils,
  Calendar,
  Sparkles,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { SafeStorage } from '../../services/safeStorage';
import { MockMedicine } from '../../mock/healthData';

interface AddCustomMedicineModalProps {
  visible: boolean;
  onClose: () => void;
  onMedicineAdded?: (newMed: MockMedicine) => void;
}

export const AddCustomMedicineModal: React.FC<AddCustomMedicineModalProps> = ({
  visible,
  onClose,
  onMedicineAdded,
}) => {
  const { currentLanguage } = useLanguage();

  const [medName, setMedName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet (1 गोली)');
  const [timeSlot, setTimeSlot] = useState<'MORNING' | 'AFTERNOON' | 'NIGHT'>('MORNING');
  const [scheduledTime, setScheduledTime] = useState('08:00 AM');
  const [foodInstruction, setFoodInstruction] = useState<'BEFORE_FOOD' | 'AFTER_FOOD'>('AFTER_FOOD');
  const [durationDays, setDurationDays] = useState('7');
  const [purpose, setPurpose] = useState('');

  const timeOptions = {
    MORNING: '08:00 AM',
    AFTERNOON: '01:30 PM',
    NIGHT: '09:00 PM',
  };

  const handleSelectTimeSlot = (slot: 'MORNING' | 'AFTERNOON' | 'NIGHT') => {
    setTimeSlot(slot);
    setScheduledTime(timeOptions[slot]);
  };

  const handleSaveMedicine = async () => {
    const trimmedName = medName.trim();
    if (!trimmedName) {
      Alert.alert('Required Field', 'Please enter the medicine name (दवाई का नाम लिखें).');
      return;
    }

    const foodInstructionHindi =
      foodInstruction === 'BEFORE_FOOD'
        ? 'खाली पेट गुनगुने पानी के साथ'
        : 'भोजन के 20 मिनट बाद पानी के साथ';

    const newMed: MockMedicine = {
      id: `custom_med_${Date.now()}`,
      name: trimmedName,
      genericName: genericName.trim() || trimmedName,
      dosage: dosage.trim() || '1 Tablet (1 गोली)',
      timeSlot,
      scheduledTime,
      foodInstruction,
      foodInstructionHindi,
      status: 'PENDING',
      form: 'tablet',
      prescribedBy: 'Self / Rampur PHC',
      duration: `${durationDays} Days`,
      purpose: purpose.trim() || 'Daily Health Maintenance',
      color: timeSlot === 'MORNING' ? '#E0F2FE' : timeSlot === 'AFTERNOON' ? '#FEF3C7' : '#DCFCE7',
    };

    try {
      const stored = await SafeStorage.getItem('@swasthya_active_medications');
      const existing: MockMedicine[] = stored ? JSON.parse(stored) : [];
      const updatedList = [newMed, ...existing];
      await SafeStorage.setItem('@swasthya_active_medications', JSON.stringify(updatedList));

      if (onMedicineAdded) {
        onMedicineAdded(newMed);
      }

      Alert.alert(
        'Medicine Added! / दवाई जोड़ी गई 🎉',
        `"${newMed.name}" has been added to your daily schedule at ${newMed.scheduledTime}.`
      );

      // Reset fields
      setMedName('');
      setGenericName('');
      setPurpose('');
      onClose();
    } catch (err) {
      console.warn('[AddCustomMedicineModal] Error saving:', err);
      Alert.alert('Error', 'Could not save medicine to local storage.');
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Pill size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.modalTitle}>Add Medicine / दवाई जोड़ें</Text>
                <Text style={styles.modalSubtitle}>Custom reminder & schedule setup</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Medicine Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Medicine Name (दवाई का नाम) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Metformin 500mg, Paracetamol 650mg"
                placeholderTextColor={COLORS.textMuted}
                value={medName}
                onChangeText={setMedName}
              />
            </View>

            {/* Generic / Local Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Generic Name / Brand (वैकल्पिक)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Calpol / Dolo 650"
                placeholderTextColor={COLORS.textMuted}
                value={genericName}
                onChangeText={setGenericName}
              />
            </View>

            {/* Dosage */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Dosage / खुराक (मात्रा)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 1 tablet (1 गोली), 2 spoons (2 चम्मच)"
                placeholderTextColor={COLORS.textMuted}
                value={dosage}
                onChangeText={setDosage}
              />
            </View>

            {/* Time Slot Picker */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Time of Day (दिन का समय)</Text>
              <View style={styles.slotRow}>
                <TouchableOpacity
                  style={[styles.slotCard, timeSlot === 'MORNING' && styles.slotCardActive]}
                  onPress={() => handleSelectTimeSlot('MORNING')}
                >
                  <Sunrise size={18} color={timeSlot === 'MORNING' ? COLORS.primary : '#D97706'} />
                  <Text style={[styles.slotCardText, timeSlot === 'MORNING' && styles.slotCardTextActive]}>
                    Morning (सुबह)
                  </Text>
                  <Text style={styles.slotSub}>08:00 AM</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.slotCard, timeSlot === 'AFTERNOON' && styles.slotCardActive]}
                  onPress={() => handleSelectTimeSlot('AFTERNOON')}
                >
                  <Sun size={18} color={timeSlot === 'AFTERNOON' ? COLORS.primary : '#F59E0B'} />
                  <Text style={[styles.slotCardText, timeSlot === 'AFTERNOON' && styles.slotCardTextActive]}>
                    Noon (दोपहर)
                  </Text>
                  <Text style={styles.slotSub}>01:30 PM</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.slotCard, timeSlot === 'NIGHT' && styles.slotCardActive]}
                  onPress={() => handleSelectTimeSlot('NIGHT')}
                >
                  <Moon size={18} color={timeSlot === 'NIGHT' ? COLORS.primary : '#6366F1'} />
                  <Text style={[styles.slotCardText, timeSlot === 'NIGHT' && styles.slotCardTextActive]}>
                    Night (रात)
                  </Text>
                  <Text style={styles.slotSub}>09:00 PM</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Meal Instruction */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Meal Rule (भोजन निर्देश)</Text>
              <View style={styles.mealRuleRow}>
                <TouchableOpacity
                  style={[styles.mealCard, foodInstruction === 'BEFORE_FOOD' && styles.mealCardActive]}
                  onPress={() => setFoodInstruction('BEFORE_FOOD')}
                >
                  <Utensils size={16} color={foodInstruction === 'BEFORE_FOOD' ? '#FFFFFF' : '#047857'} />
                  <Text style={[styles.mealCardText, foodInstruction === 'BEFORE_FOOD' && styles.mealCardTextActive]}>
                    Before Food (खाली पेट)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mealCard, foodInstruction === 'AFTER_FOOD' && styles.mealCardActive]}
                  onPress={() => setFoodInstruction('AFTER_FOOD')}
                >
                  <Utensils size={16} color={foodInstruction === 'AFTER_FOOD' ? '#FFFFFF' : '#047857'} />
                  <Text style={[styles.mealCardText, foodInstruction === 'AFTER_FOOD' && styles.mealCardTextActive]}>
                    After Food (भोजन के बाद)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Course Duration */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Course Duration (कितने दिन लेनी है?)</Text>
              <View style={styles.durationRow}>
                {['3', '5', '7', '14', '30'].map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[styles.durationChip, durationDays === days && styles.durationChipActive]}
                    onPress={() => setDurationDays(days)}
                  >
                    <Text style={[styles.durationText, durationDays === days && styles.durationTextActive]}>
                      {days} Days
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Purpose */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Health Condition / Purpose (किस बीमारी के लिए?)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Blood Sugar, Fever, Gas & Acidity"
                placeholderTextColor={COLORS.textMuted}
                value={purpose}
                onChangeText={setPurpose}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel / रद्द करें</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveMedicine} activeOpacity={0.85}>
              <Check size={18} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save Medicine / जोड़ें</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.md,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  slotRow: {
    flexDirection: 'row',
    gap: 8,
  },
  slotCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 3,
  },
  slotCardActive: {
    backgroundColor: '#ECFDF5',
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  slotCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  slotCardTextActive: {
    color: COLORS.primary,
  },
  slotSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  mealRuleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mealCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
  },
  mealCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mealCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  mealCardTextActive: {
    color: '#FFFFFF',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    alignItems: 'center',
  },
  durationChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  durationTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.subtle,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
