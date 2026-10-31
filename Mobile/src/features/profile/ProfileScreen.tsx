import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {
  User,
  ShieldCheck,
  Globe,
  LogOut,
  ChevronRight,
  Heart,
  Phone,
  MapPin,
  Calendar,
  Building,
  Mail,
  Users,
  MessageSquare,
  Edit3,
  CheckCircle2,
  ShieldAlert,
  X,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AbhaCardView } from '../../components/health/AbhaCardView';
import { useAppSafeArea } from '../../hooks/useAppSafeArea';
import { EmergencySosService, EmergencyContact, DEFAULT_EMERGENCY_CONTACT } from '../../services/emergencySosService';

export const ProfileScreen: React.FC = () => {
  const insets = useAppSafeArea();
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage, languages } = useLanguage();

  const [contact, setContact] = React.useState<EmergencyContact>(DEFAULT_EMERGENCY_CONTACT);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editName, setEditName] = React.useState(DEFAULT_EMERGENCY_CONTACT.name);
  const [editPhone, setEditPhone] = React.useState(DEFAULT_EMERGENCY_CONTACT.phone);
  const [editRelation, setEditRelation] = React.useState(DEFAULT_EMERGENCY_CONTACT.relationship);

  React.useEffect(() => {
    EmergencySosService.getEmergencyContact().then((c) => {
      setContact(c);
      setEditName(c.name);
      setEditPhone(c.phone);
      setEditRelation(c.relationship);
    });
  }, []);

  const displayName = user?.first_name || (user?.username && !/^\d+$/.test(user.username) ? user.username : 'Prince Kumar');
  const displayPhone = user?.phone_number || (user?.username && /^\d+$/.test(user.username) ? user.username : '9008802105');
  const displayVillage = user?.village_or_town || 'Rampur Gram, Ward 3';
  const displayDistrict = user?.district || 'Varanasi';
  const displayState = user?.state || 'Uttar Pradesh';
  const displayPincode = user?.pincode || '221001';
  const displayAge = user?.age || 28;
  const displayGender = user?.gender || 'Male';

  const handleSaveContact = async () => {
    if (!editPhone || editPhone.trim().length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    const updated: EmergencyContact = {
      name: editName.trim() || 'Family Member',
      phone: editPhone.trim(),
      relationship: editRelation.trim() || 'Caregiver',
    };
    await EmergencySosService.saveEmergencyContact(updated);
    setContact(updated);
    setEditModalVisible(false);
    Alert.alert('Updated 🎉', `Family emergency contact updated to ${updated.name} (+91 ${updated.phone}).`);
  };

  const handleTestSms = async () => {
    const loc = await EmergencySosService.getLiveLocation();
    const msg = EmergencySosService.generateDistressMessage({
      patientName: displayName,
      village: displayVillage,
      latitude: loc.latitude,
      longitude: loc.longitude,
    });
    await EmergencySosService.sendNativeSms(contact.phone, msg);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Settings & Profile / प्रोफ़ाइल</Text>
          <Text style={styles.screenSubtitle}>
            Ayushman Bharat Digital Health Card & Registered Profile Details
          </Text>
        </View>

        {/* User Profile Identity Hero Card */}
        <View style={styles.profileUserCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfoCol}>
            <Text style={styles.profileName}>{displayName}</Text>
            <View style={styles.userMetaRow}>
              <Phone size={13} color={COLORS.textSecondary} />
              <Text style={styles.userMetaText}>+91 {displayPhone}</Text>
            </View>
            <View style={styles.userMetaRow}>
              <MapPin size={13} color={COLORS.textSecondary} />
              <Text style={styles.userMetaText}>{displayVillage}, {displayDistrict}, {displayState}</Text>
            </View>
          </View>
          <View style={styles.roleBadgePrimary}>
            <Text style={styles.roleBadgeText}>Patient</Text>
          </View>
        </View>

        {/* Registered Demographic Information */}
        <Text style={styles.sectionHeader}>Registered Personal Details / व्यक्तिगत विवरण</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name (पूरा नाम)</Text>
            <Text style={styles.detailValue}>{displayName}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile Number (मोबाइल नंबर)</Text>
            <Text style={styles.detailValue}>+91 {displayPhone}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Age & Gender (उम्र / लिंग)</Text>
            <Text style={styles.detailValue}>{displayAge} yrs • {displayGender}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>State (राज्य)</Text>
            <Text style={styles.detailValue}>{displayState}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>District (जिला)</Text>
            <Text style={styles.detailValue}>{displayDistrict}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Village / Ward (ग्राम / वार्ड)</Text>
            <Text style={styles.detailValue}>{displayVillage}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>PIN Code (पिन कोड)</Text>
            <Text style={styles.detailValue}>{displayPincode}</Text>
          </View>
        </View>

        {/* Emergency Family Contact Card */}
        <Text style={styles.sectionHeader}>Emergency Family Member / आपातकालीन संपर्क</Text>
        <View style={styles.emergencyContactCard}>
          <View style={styles.emergencyContactTop}>
            <View style={styles.emergencyIconCircle}>
              <Users size={20} color="#047857" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyContactName}>{contact.name} ({contact.relationship})</Text>
              <Text style={styles.emergencyContactPhone}>+91 {contact.phone}</Text>
              <Text style={styles.emergencyContactSub}>Receives 1-tap SOS SMS with live Google Maps link</Text>
            </View>
            <TouchableOpacity
              style={styles.editContactButton}
              onPress={() => setEditModalVisible(true)}
              activeOpacity={0.8}
            >
              <Edit3 size={14} color="#047857" />
              <Text style={styles.editContactBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emergencyActionRow}>
            <TouchableOpacity style={styles.testSmsBtn} onPress={handleTestSms} activeOpacity={0.85}>
              <MessageSquare size={14} color="#047857" />
              <Text style={styles.testSmsText}>Test Emergency SMS / टेस्ट एसएमएस</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Official ABHA Card Component */}
        <Text style={styles.sectionHeader}>My ABHA Digital Health Card</Text>
        <AbhaCardView />

        {/* Regional Language Switcher */}
        <Text style={styles.sectionHeader}>Preferred Language / भाषा चुनें</Text>
        <View style={styles.langGrid}>
          {languages.map((l) => {
            const isSelected = currentLanguage === l.code;
            return (
              <TouchableOpacity
                key={l.code}
                style={[styles.langCard, isSelected && styles.langCardActive]}
                onPress={() => setLanguage(l.code)}
                activeOpacity={0.8}
              >
                <Text style={[styles.langNative, isSelected && styles.langNativeActive]}>
                  {l.nativeName}
                </Text>
                <Text style={[styles.langName, isSelected && styles.langNameActive]}>
                  {l.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <LogOut size={18} color={COLORS.emergency} />
          <Text style={styles.logoutBtnText}>Sign Out / लॉग आउट करें</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Contact Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Update Family Emergency Contact</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Contact Name / नाम</Text>
            <TextInput
              style={styles.fieldInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="e.g. Ramesh Kumar"
            />

            <Text style={styles.fieldLabel}>Relationship / रिश्ता</Text>
            <TextInput
              style={styles.fieldInput}
              value={editRelation}
              onChangeText={setEditRelation}
              placeholder="e.g. Son, Daughter, Brother"
            />

            <Text style={styles.fieldLabel}>10-Digit Mobile Number / मोबाइल नंबर</Text>
            <TextInput
              style={styles.fieldInput}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="e.g. 9008802105"
              keyboardType="phone-pad"
              maxLength={13}
            />

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveContact}>
              <CheckCircle2 size={18} color="#FFFFFF" />
              <Text style={styles.modalSaveText}>Save Emergency Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  header: {
    marginBottom: SPACING.md,
  },
  screenTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    fontSize: 20,
  },
  screenSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfoCol: {
    flex: 1,
  },
  profileName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userMetaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  roleBadgePrimary: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  sectionHeader: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  langCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  langCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySurface,
  },
  langNative: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  langNativeActive: {
    color: COLORS.primaryDark,
  },
  langName: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  langNameActive: {
    color: COLORS.primary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.emergency,
  },
  emergencyContactCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emergencyContactTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emergencyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyContactName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  emergencyContactPhone: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
    marginTop: 1,
  },
  emergencyContactSub: {
    fontSize: 10,
    color: '#059669',
    marginTop: 2,
  },
  editContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  editContactBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  emergencyActionRow: {
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
    paddingTop: SPACING.xs,
  },
  testSmsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 8,
    paddingVertical: 8,
  },
  testSmsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: SPACING.lg,
    ...SHADOWS.elevated,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    marginTop: 8,
  },
  fieldInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  modalSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
