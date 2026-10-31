import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  Users,
  Search,
  Camera,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Activity,
  Hospital,
  MessageSquare,
  Sparkles,
  Plus,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { MOCK_ASHA_DATA } from '../../mock/healthData';
import { Header } from '../../components/common/Header';
import { RecordVitalsModal } from '../../components/asha/RecordVitalsModal';
import { AbhaRegistrationModal } from '../../components/asha/AbhaRegistrationModal';
import { CreateReferralModal } from '../../components/asha/CreateReferralModal';
import { DoctorTeleChatModal } from '../../components/asha/DoctorTeleChatModal';
import { SwasthyaMitrAiModal } from '../../components/ai/SwasthyaMitrAiModal';

export const AshaHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [vitalsModalVisible, setVitalsModalVisible] = useState(false);
  const [abhaModalVisible, setAbhaModalVisible] = useState(false);
  const [referralModalVisible, setReferralModalVisible] = useState(false);
  const [teleChatModalVisible, setTeleChatModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert('Offline Data Synchronized', 'All local field visit notes & patient profiles synced with PHC Central Server.');
    }, 1200);
  };

  const filteredPatients = MOCK_ASHA_DATA.patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.ward.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header roleBadge="ASHA Worker" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Greeting Banner */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, Sunita 👋</Text>
            <Text style={styles.subGreeting}>
              ASHA Sector: Rampur Gram Panchayat (Ward 1–4)
            </Text>
          </View>
        </View>

        {/* Offline Sync Status Banner */}
        <View style={styles.syncBanner}>
          <View style={styles.syncBannerLeft}>
            <ShieldCheck size={16} color={COLORS.primary} />
            <Text style={styles.syncBannerText}>{MOCK_ASHA_DATA.syncStatus}</Text>
          </View>
          <TouchableOpacity onPress={handleSync} style={styles.syncIconBtn} activeOpacity={0.7}>
            <RefreshCw size={14} color={COLORS.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionTile}
            onPress={() => setVitalsModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Activity size={20} color="#059669" />
            </View>
            <Text style={styles.actionTileTitle}>Record Vitals</Text>
            <Text style={styles.actionTileSub}>रोगी जांच</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionTile}
            onPress={() => setAbhaModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <ShieldCheck size={20} color="#2563EB" />
            </View>
            <Text style={styles.actionTileTitle}>Add ABHA</Text>
            <Text style={styles.actionTileSub}>नया कार्ड</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionTile}
            onPress={() => setReferralModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Hospital size={20} color="#047857" />
            </View>
            <Text style={styles.actionTileTitle}>PHC Referral</Text>
            <Text style={styles.actionTileSub}>रेफरल पर्ची</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionTile}
            onPress={() => setTeleChatModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FFFBEB' }]}>
              <MessageSquare size={20} color="#D97706" />
            </View>
            <Text style={styles.actionTileTitle}>Doctor Chat</Text>
            <Text style={styles.actionTileSub}>डॉक्टर सलाह</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Field Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>4</Text>
            <Text style={styles.metricLabel}>Today's Visits</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: COLORS.accent }]}>18</Text>
            <Text style={styles.metricLabel}>Assigned Patients</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: COLORS.success }]}>88%</Text>
            <Text style={styles.metricLabel}>Avg Adherence</Text>
          </View>
        </View>

        {/* Critical Alerts Banner */}
        <View style={styles.criticalAlertCard}>
          <View style={styles.alertTopRow}>
            <AlertTriangle size={18} color={COLORS.emergency} />
            <Text style={styles.alertHeading}>Critical Missed Dose Alert</Text>
            <Text style={styles.alertTime}>11:15 AM</Text>
          </View>
          <Text style={styles.alertBody}>
            Ram Charan Yadav (Ward 1) has not logged his morning Amlodipine BP dose. Needs home check-in.
          </Text>
          <TouchableOpacity
            style={styles.alertActionBtn}
            onPress={() => {
              Alert.alert('Visit Scheduled', 'Home visit added to priority itinerary.');
            }}
          >
            <Text style={styles.alertActionBtnText}>Schedule Visit Now →</Text>
          </TouchableOpacity>
        </View>

        {/* Household Roster Section Header */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Household Patient Roster</Text>
            <Text style={styles.sectionSub}>Daily visual adherence & condition monitor</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation?.navigate && navigation.navigate('Registry')}
            style={styles.viewRegistryBtn}
          >
            <Text style={styles.viewRegistryText}>View All ({MOCK_ASHA_DATA.patients.length}) →</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patient by name or ward..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Patient Cards List */}
        <View style={styles.patientList}>
          {filteredPatients.map((patient) => {
            const isAttention = patient.status === 'ATTENTION_NEEDED';
            return (
              <View
                key={patient.id}
                style={[
                  styles.patientCard,
                  isAttention && styles.patientCardAttention,
                ]}
              >
                <View style={styles.patientCardTop}>
                  <View style={styles.patientAvatarBox}>
                    <Text style={styles.avatarEmoji}>
                      {patient.gender === 'Female' ? '👩' : '👨'}
                    </Text>
                  </View>

                  <View style={styles.patientInfo}>
                    <View style={styles.patientNameRow}>
                      <Text style={styles.patientNameText}>{patient.name}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          isAttention ? styles.badgeAttention : styles.badgeNormal,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            isAttention ? styles.textAttention : styles.textNormal,
                          ]}
                        >
                          {isAttention ? 'Needs Attention' : 'On Track'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.patientMetaText}>
                      {patient.age} yrs • {patient.gender} • {patient.ward}
                    </Text>

                    <View style={styles.abhaRow}>
                      <ShieldCheck size={12} color={COLORS.primary} />
                      <Text style={styles.abhaIdText}>{patient.abhaId}</Text>
                    </View>
                  </View>
                </View>

                {/* Condition Pills */}
                <View style={styles.conditionRow}>
                  {patient.conditions.map((cond, idx) => (
                    <View key={idx} style={styles.conditionPill}>
                      <Text style={styles.conditionPillText}>{cond}</Text>
                    </View>
                  ))}
                </View>

                {/* Adherence Rate & Actions */}
                <View style={styles.patientCardFooter}>
                  <View style={styles.adherenceContainer}>
                    <Text style={styles.adherenceLabel}>Adherence Rate:</Text>
                    <Text
                      style={[
                        styles.adherenceVal,
                        { color: patient.adherenceRate >= 80 ? COLORS.success : COLORS.emergency },
                      ]}
                    >
                      {patient.adherenceRate}% ({patient.streakDays} Day Streak 🔥)
                    </Text>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.vitalsBtn}
                      onPress={() => setVitalsModalVisible(true)}
                    >
                      <Activity size={13} color="#047857" />
                      <Text style={styles.vitalsBtnText}>Vitals</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.callIconBtn}
                      onPress={() => Alert.alert('Dialing', `Calling ${patient.phone}...`)}
                    >
                      <Phone size={14} color={COLORS.primaryDark} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.floatingBtnsRow}>
        <TouchableOpacity
          style={styles.floatingDocChat}
          onPress={() => setTeleChatModalVisible(true)}
          activeOpacity={0.85}
        >
          <MessageSquare size={16} color="#FFFFFF" />
          <Text style={styles.floatingBtnText}>Dr. Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.floatingAi}
          onPress={() => setAiModalVisible(true)}
          activeOpacity={0.85}
        >
          <Sparkles size={16} color="#FFFFFF" />
          <Text style={styles.floatingBtnText}>AI Guide</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <RecordVitalsModal
        visible={vitalsModalVisible}
        onClose={() => setVitalsModalVisible(false)}
      />

      <AbhaRegistrationModal
        visible={abhaModalVisible}
        onClose={() => setAbhaModalVisible(false)}
      />

      <CreateReferralModal
        visible={referralModalVisible}
        onClose={() => setReferralModalVisible(false)}
      />

      <DoctorTeleChatModal
        visible={teleChatModalVisible}
        onClose={() => setTeleChatModalVisible(false)}
      />

      <SwasthyaMitrAiModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
      />
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
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  subGreeting: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  syncBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  syncBannerText: {
    ...TYPOGRAPHY.captionSmall,
    fontWeight: '700',
    color: COLORS.secondaryDark,
  },
  syncIconBtn: {
    padding: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
  },
  quickActionTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionTileTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  actionTileSub: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.subtle,
  },
  metricVal: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
  },
  metricLabel: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  criticalAlertCard: {
    backgroundColor: '#FEF2F2',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  alertTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  alertHeading: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.emergency,
    flex: 1,
  },
  alertTime: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textMuted,
  },
  alertBody: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  alertActionBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  alertActionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  sectionSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  viewRegistryBtn: {
    paddingVertical: 4,
  },
  viewRegistryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    padding: 0,
  },
  patientList: {
    gap: SPACING.md,
  },
  patientCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.subtle,
  },
  patientCardAttention: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFBFB',
  },
  patientCardTop: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  patientAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  patientInfo: {
    flex: 1,
  },
  patientNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientNameText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeNormal: {
    backgroundColor: '#DCFCE7',
  },
  badgeAttention: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    ...TYPOGRAPHY.captionSmall,
    fontWeight: '700',
  },
  textNormal: {
    color: COLORS.success,
  },
  textAttention: {
    color: COLORS.emergency,
  },
  patientMetaText: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  abhaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  abhaIdText: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.primaryDark,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  conditionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  conditionPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  conditionPillText: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  patientCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  adherenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adherenceLabel: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
  },
  adherenceVal: {
    ...TYPOGRAPHY.captionSmall,
    fontWeight: '700',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vitalsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  vitalsBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  callIconBtn: {
    padding: 6,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.secondaryLight,
  },
  floatingBtnsRow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 999,
  },
  floatingDocChat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0369A1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    ...SHADOWS.elevated,
  },
  floatingAi: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#047857',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    ...SHADOWS.elevated,
  },
  floatingBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
