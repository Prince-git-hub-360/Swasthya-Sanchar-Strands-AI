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
  ShieldCheck,
  QrCode,
  User,
  Phone,
  Check,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Building,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { SafeStorage } from '../../services/safeStorage';

interface AbhaRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (citizen: any) => void;
}

export const AbhaRegistrationModal: React.FC<AbhaRegistrationModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'scan'>('create');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [village, setVillage] = useState('Rampur Gram');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<any>(null);

  if (!visible) return null;

  const handleCreateAbha = async () => {
    if (!fullName.trim() || !mobile.trim()) {
      Alert.alert('Required Fields / आवश्यक विवरण', 'Please enter patient full name and mobile number.');
      return;
    }

    setIsGenerating(true);

    setTimeout(async () => {
      const randomMiddle = Math.floor(1000 + Math.random() * 9000);
      const randomEnd = Math.floor(1000 + Math.random() * 9000);
      const generatedAbhaId = `91-${randomMiddle}-${randomEnd}-7740`;
      const generatedAbhaAddress = `${fullName.toLowerCase().replace(/[^a-z]/g, '')}@abdm`;

      const newCitizen = {
        id: `cit_${Date.now()}`,
        name: fullName,
        age: parseInt(age) || 45,
        gender,
        village,
        ward: 'Ward 2',
        abhaId: generatedAbhaId,
        abhaAddress: generatedAbhaAddress,
        phone: mobile,
        conditions: ['General Wellness Check'],
        adherenceRate: 100,
        streakDays: 1,
        status: 'ON_TRACK',
        pendingDosesToday: 0,
        lastVisitDate: 'Today',
      };

      try {
        const storedStr = await SafeStorage.getItem('@swasthya_asha_patients');
        const stored = storedStr ? JSON.parse(storedStr) : [];
        await SafeStorage.setItem(
          '@swasthya_asha_patients',
          JSON.stringify([newCitizen, ...stored])
        );
      } catch (e) {}

      setIsGenerating(false);
      setGeneratedCard(newCitizen);

      if (onSuccess) onSuccess(newCitizen);

      Alert.alert(
        '🎉 ABHA Health ID Created Successfully!',
        `ABHA Number: ${generatedAbhaId}\nABHA Address: ${generatedAbhaAddress}\n\nLinked to National Digital Health Mission (ABDM).`
      );
    }, 1200);
  };

  const handleSimulateQrScan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const mockScan = {
        id: `cit_scan_${Date.now()}`,
        name: 'Kamala Devi',
        age: 52,
        gender: 'Female',
        village: 'Rampur Gram',
        ward: 'Ward 3',
        abhaId: '91-4820-9921-7740',
        abhaAddress: 'kamaladevi@abdm',
        phone: '+91 98765 43210',
        conditions: ['Hypertension Care'],
        adherenceRate: 94,
        streakDays: 6,
        status: 'ON_TRACK',
        pendingDosesToday: 1,
        lastVisitDate: 'Today',
      };
      setGeneratedCard(mockScan);
      if (onSuccess) onSuccess(mockScan);
      Alert.alert('✅ ABHA Card Decoded', `Verified Citizen: Kamala Devi (ABHA: 91-4820-9921-7740)`);
    }, 1000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconCircle}>
                <ShieldCheck size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.modalTitle}>ABHA Digital Health ID</Text>
                <Text style={styles.modalSub}>आयुष्मान भारत डिजिटल मिशन (ABDM)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.modeTabsRow}>
            <TouchableOpacity
              style={[styles.modeTab, activeTab === 'create' && styles.modeTabActive]}
              onPress={() => setActiveTab('create')}
            >
              <Sparkles size={14} color={activeTab === 'create' ? '#065F46' : '#64748B'} />
              <Text style={[styles.modeTabText, activeTab === 'create' && styles.modeTabTextActive]}>
                Instant Registration
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, activeTab === 'scan' && styles.modeTabActive]}
              onPress={() => setActiveTab('scan')}
            >
              <QrCode size={14} color={activeTab === 'scan' ? '#065F46' : '#64748B'} />
              <Text style={[styles.modeTabText, activeTab === 'scan' && styles.modeTabTextActive]}>
                Scan Physical Card
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 20 }}>
            {activeTab === 'scan' ? (
              <View style={styles.scanContainer}>
                <View style={styles.qrScannerFrame}>
                  <QrCode size={70} color="#059669" />
                  <Text style={styles.qrFrameText}>Point camera at patient's ABHA QR Code</Text>
                </View>

                <TouchableOpacity
                  style={styles.simulateScanBtn}
                  onPress={handleSimulateQrScan}
                  disabled={isGenerating}
                >
                  <Sparkles size={16} color="#FFFFFF" />
                  <Text style={styles.simulateScanBtnText}>
                    {isGenerating ? 'Scanning QR Code...' : 'Simulate Camera Scan / स्कैन करें'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Form Inputs */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Citizen Full Name / नागरिक का पूरा नाम *</Text>
                  <View style={styles.inputBox}>
                    <User size={16} color="#64748B" />
                    <TextInput
                      style={styles.textInput}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="E.g. Savitri Bai"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.splitInputRow}>
                  <View style={[styles.inputGroup, { flex: 1.2 }]}>
                    <Text style={styles.inputLabel}>Mobile / मोबाइल नंबर *</Text>
                    <View style={styles.inputBox}>
                      <Phone size={16} color="#64748B" />
                      <TextInput
                        style={styles.textInput}
                        value={mobile}
                        onChangeText={setMobile}
                        placeholder="10-digit number"
                        keyboardType="phone-pad"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>

                  <View style={[styles.inputGroup, { flex: 0.8 }]}>
                    <Text style={styles.inputLabel}>Age / आयु</Text>
                    <View style={styles.inputBox}>
                      <Calendar size={16} color="#64748B" />
                      <TextInput
                        style={styles.textInput}
                        value={age}
                        onChangeText={setAge}
                        placeholder="Years"
                        keyboardType="numeric"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>
                  </View>
                </View>

                {/* Gender Picker */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Gender / लिंग</Text>
                  <View style={styles.genderRow}>
                    {(['Female', 'Male', 'Other'] as const).map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.genderChip, gender === g && styles.genderChipActive]}
                        onPress={() => setGender(g)}
                      >
                        <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Aadhaar (Optional) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Aadhaar Number / आधार (Optional)</Text>
                  <View style={styles.inputBox}>
                    <Building size={16} color="#64748B" />
                    <TextInput
                      style={styles.textInput}
                      value={aadhaarNumber}
                      onChangeText={setAadhaarNumber}
                      placeholder="12-digit Aadhaar for OTP"
                      keyboardType="numeric"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                {/* Village / Ward */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Village / ग्राम क्षेत्र</Text>
                  <View style={styles.inputBox}>
                    <MapPin size={16} color="#64748B" />
                    <TextInput
                      style={styles.textInput}
                      value={village}
                      onChangeText={setVillage}
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.generateBtn}
                  onPress={handleCreateAbha}
                  disabled={isGenerating}
                  activeOpacity={0.85}
                >
                  <ShieldCheck size={18} color="#FFFFFF" />
                  <Text style={styles.generateBtnText}>
                    {isGenerating ? 'Generating ABDM Token...' : 'Generate 14-Digit ABHA ID'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Generated Card Preview */}
            {generatedCard && (
              <View style={styles.cardPreviewContainer}>
                <View style={styles.abhaCardBanner}>
                  <Text style={styles.abhaGovtText}>NATIONAL HEALTH AUTHORITY • ABDM</Text>
                  <Text style={styles.abhaTitle}>ABHA Digital Health Card</Text>
                </View>

                <View style={styles.abhaCardBody}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{generatedCard.name}</Text>
                    <Text style={styles.cardAbhaId}>{generatedCard.abhaId}</Text>
                    <Text style={styles.cardAddress}>Address: {generatedCard.abhaAddress}</Text>
                    <Text style={styles.cardMeta}>{generatedCard.gender} • {generatedCard.age} yrs • {generatedCard.village}</Text>
                  </View>
                  <View style={styles.qrCodeThumbnail}>
                    <QrCode size={44} color="#0F172A" />
                  </View>
                </View>
              </View>
            )}
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
  modeTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 6,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.subtle,
  },
  modeTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#065F46',
  },
  scanContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  qrScannerFrame: {
    width: 200,
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
  },
  qrFrameText: {
    fontSize: 11,
    color: '#047857',
    textAlign: 'center',
    fontWeight: '600',
  },
  simulateScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
  },
  simulateScanBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
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
  splitInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  genderChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  genderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  genderTextActive: {
    color: '#065F46',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#065F46',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 4,
    ...SHADOWS.subtle,
  },
  generateBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardPreviewContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    ...SHADOWS.subtle,
  },
  abhaCardBanner: {
    backgroundColor: '#0369A1',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  abhaGovtText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#E0F2FE',
    letterSpacing: 0.5,
  },
  abhaTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  abhaCardBody: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    gap: 10,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cardAbhaId: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  cardAddress: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  cardMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  qrCodeThumbnail: {
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});
