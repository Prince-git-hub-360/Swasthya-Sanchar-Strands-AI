import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {
  Heart,
  PhoneCall,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Flame,
  AlertTriangle,
  Sparkles,
  User,
  ShoppingBag,
  ShieldAlert,
  MapPin,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { MOCK_PATIENT, MOCK_TODAY_MEDICINES } from '../../mock/healthData';
import { Header } from '../../components/common/Header';
import { MobileEmergencySosModal } from '../../components/emergency/MobileEmergencySosModal';
import { SwasthyaMitrAiModal } from '../../components/ai/SwasthyaMitrAiModal';
import { SafeStorage } from '../../services/safeStorage';
import { EmergencySosService } from '../../services/emergencySosService';

export const CaregiverHomeScreen: React.FC<{ navigation?: any }> = () => {
  const [selectedDependent, setSelectedDependent] = useState<'mother' | 'father'>('mother');
  const [nudgeSent, setNudgeSent] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [todayMeds, setTodayMeds] = useState<any[]>(MOCK_TODAY_MEDICINES);
  const [activeSos, setActiveSos] = useState<any | null>(null);

  useEffect(() => {
    const checkSos = async () => {
      const alert = await EmergencySosService.getActiveSosAlert();
      setActiveSos(alert);
    };
    checkSos();
  }, []);

  useEffect(() => {
    const loadMeds = async () => {
      try {
        const storedStr = await SafeStorage.getItem('@swasthya_active_medications');
        if (storedStr) {
          const stored = JSON.parse(storedStr);
          if (Array.isArray(stored) && stored.length > 0) {
            setTodayMeds(stored);
            return;
          }
        }
      } catch (e) {}
    };
    loadMeds();
  }, []);

  const currentPerson =
    selectedDependent === 'mother'
      ? {
          name: 'Lakshmi Devi (Mother)',
          age: 58,
          village: 'Rampur Gram (Ward 3)',
          abhaId: '91-4820-9921-7740',
          adherenceRate: 92,
          streakDays: 5,
          phone: '+91 98765 43210',
          conditions: ['Type 2 Diabetes', 'Hypertension'],
        }
      : {
          name: 'Ram Charan Yadav (Father)',
          age: 64,
          village: 'Rampur Gram (Ward 1)',
          abhaId: '91-3310-8812-4011',
          adherenceRate: 68,
          streakDays: 1,
          phone: '+91 98111 22334',
          conditions: ['Stage-2 Hypertension', 'Arthritis'],
        };

  const handleCall = () => {
    Alert.alert(`Calling ${currentPerson.name}`, `Initiating direct voice call to ${currentPerson.phone}...`);
  };

  const handleSendNudge = () => {
    setNudgeSent(true);
    Alert.alert(
      'Voice Nudge Sent / आवाज में संदेश भेजा गया',
      `A gentle regional Hindi voice reminder has been played on ${currentPerson.name}'s phone for their scheduled afternoon dose.`
    );
  };

  const handleOrderRefill = () => {
    Alert.alert(
      '📦 Jan Aushadhi Refill Requested!',
      `Monthly chronic care medicine refill dispatched to Rampur Jan Aushadhi Kendra for ${currentPerson.name}. Delivery in 24 hours.`
    );
  };

  return (
    <View style={styles.container}>
      <Header roleBadge="Caregiver" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Greeting Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Family Caregiver Portal</Text>
          <Text style={styles.subGreeting}>Remote Chronic Care & Medication Monitor</Text>
        </View>

        {/* Active Emergency SOS Distress Banner */}
        {activeSos && (
          <View style={styles.emergencySosBanner}>
            <View style={styles.emergencySosHeaderRow}>
              <View style={styles.sosAlertCircle}>
                <ShieldAlert size={22} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.emergencySosTitle}>🚨 ACTIVE SOS DISTRESS BEACON!</Text>
                <Text style={styles.emergencySosSub}>
                  {activeSos.patientName || 'Lakshmi Devi'} triggered an emergency distress alert from {activeSos.village || 'Rampur Gram'}!
                </Text>
              </View>
            </View>

            <View style={styles.sosActionRow}>
              <TouchableOpacity
                style={styles.sosCallBtn}
                onPress={() => Linking.openURL('tel:9008802105')}
                activeOpacity={0.85}
              >
                <PhoneCall size={14} color="#FFFFFF" />
                <Text style={styles.sosCallBtnText}>Call Patient</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sosMapBtn}
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${activeSos.latitude || 25.3176},${activeSos.longitude || 82.9739}`)}
                activeOpacity={0.85}
              >
                <MapPin size={14} color="#FFFFFF" />
                <Text style={styles.sosMapBtnText}>Live GPS Map</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sosDismissBtn}
                onPress={async () => {
                  await EmergencySosService.clearActiveSosAlert();
                  setActiveSos(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.sosDismissText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Dependent Switcher Tabs */}
        <View style={styles.dependentSwitcher}>
          <TouchableOpacity
            style={[styles.depTab, selectedDependent === 'mother' && styles.depTabActive]}
            onPress={() => setSelectedDependent('mother')}
          >
            <Text style={{ fontSize: 16 }}>👵</Text>
            <Text style={[styles.depTabText, selectedDependent === 'mother' && styles.depTabTextActive]}>
              Lakshmi Devi (Mother)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.depTab, selectedDependent === 'father' && styles.depTabActive]}
            onPress={() => setSelectedDependent('father')}
          >
            <Text style={{ fontSize: 16 }}>👴</Text>
            <Text style={[styles.depTabText, selectedDependent === 'father' && styles.depTabTextActive]}>
              Ram Charan (Father)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Patient Health Overview Hero Card */}
        <View style={styles.patientHeroCard}>
          <View style={styles.patientHeroTop}>
            <View style={styles.patientAvatarCircle}>
              <Heart size={24} color={COLORS.emergency} />
            </View>
            <View style={styles.patientHeroDetails}>
              <Text style={styles.patientName}>{currentPerson.name}</Text>
              <Text style={styles.patientLocation}>
                {currentPerson.village} • ABHA: {currentPerson.abhaId}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  { color: currentPerson.adherenceRate >= 80 ? COLORS.success : COLORS.emergency },
                ]}
              >
                {currentPerson.adherenceRate}%
              </Text>
              <Text style={styles.statLabel}>Adherence Rate</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.streakRow}>
                <Flame size={14} color="#EA580C" />
                <Text style={styles.statValue}>{currentPerson.streakDays} Days</Text>
              </View>
              <Text style={styles.statLabel}>Daily Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {selectedDependent === 'mother' ? '1 / 3' : '0 / 2'}
              </Text>
              <Text style={styles.statLabel}>Doses Taken</Text>
            </View>
          </View>

          {/* Action Button Row */}
          <View style={styles.actionButtonRow}>
            <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.85}>
              <PhoneCall size={16} color={COLORS.textInverse} />
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nudgeBtn, nudgeSent && styles.nudgeBtnSent]}
              onPress={handleSendNudge}
              activeOpacity={0.85}
            >
              <Bell size={16} color={nudgeSent ? COLORS.success : COLORS.primaryDark} />
              <Text style={[styles.nudgeBtnText, nudgeSent && styles.nudgeBtnTextSent]}>
                {nudgeSent ? 'Nudge Sent ✓' : 'Send Voice Nudge'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.refillBtn} onPress={handleOrderRefill}>
              <ShoppingBag size={16} color="#0369A1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Medication Schedule */}
        <Text style={styles.sectionHeader}>Today's Live Medication Schedule</Text>

        <View style={styles.medList}>
          {todayMeds.map((med, idx) => {
            const isTaken = med.status === 'TAKEN';
            return (
              <View key={med.id || idx} style={[styles.medCard, isTaken && styles.medCardTaken]}>
                <View style={[styles.timeBadge, isTaken && styles.timeBadgeTaken]}>
                  <Clock size={12} color={isTaken ? '#047857' : '#64748B'} />
                  <Text style={[styles.timeText, isTaken && styles.timeTextTaken]}>
                    {med.scheduledTime || med.time || '08:00 AM'}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.medName, isTaken && styles.medNameTaken]}>
                    {med.name}
                  </Text>
                  <Text style={styles.medMeta}>
                    {med.dosage} • {med.foodInstructionHindi || med.foodInstruction}
                  </Text>
                </View>

                <View style={[styles.statusPill, isTaken ? styles.pillTaken : styles.pillPending]}>
                  <Text style={[styles.statusPillText, isTaken ? styles.pillTextTaken : styles.pillTextPending]}>
                    {isTaken ? 'Taken ✓' : 'Pending'}
                  </Text>
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
          style={styles.floatingSos}
          onPress={() => setSosModalVisible(true)}
          activeOpacity={0.85}
        >
          <AlertTriangle size={16} color="#FFFFFF" />
          <Text style={styles.floatingBtnText}>SOS Escalation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.floatingAi}
          onPress={() => setAiModalVisible(true)}
          activeOpacity={0.85}
        >
          <Sparkles size={16} color="#FFFFFF" />
          <Text style={styles.floatingBtnText}>Caregiver AI</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <MobileEmergencySosModal
        visible={sosModalVisible}
        onClose={() => setSosModalVisible(false)}
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
  dependentSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: SPACING.md,
    gap: 4,
  },
  depTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 9,
  },
  depTabActive: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.subtle,
  },
  depTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  depTabTextActive: {
    color: '#047857',
  },
  patientHeroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  patientHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  patientAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientHeroDetails: {
    flex: 1,
  },
  patientName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  patientLocation: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  statLabel: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  actionButtonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  callBtnText: {
    ...TYPOGRAPHY.button,
    color: COLORS.textInverse,
  },
  nudgeBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  nudgeBtnSent: {
    backgroundColor: '#DCFCE7',
    borderColor: COLORS.success,
  },
  nudgeBtnText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primaryDark,
  },
  nudgeBtnTextSent: {
    color: COLORS.success,
  },
  refillBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: SPACING.sm,
  },
  medList: {
    gap: 8,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...SHADOWS.subtle,
  },
  medCardTaken: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeBadgeTaken: {
    backgroundColor: '#DCFCE7',
  },
  timeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  timeTextTaken: {
    color: '#047857',
  },
  medName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  medNameTaken: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  medMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillTaken: {
    backgroundColor: '#DCFCE7',
  },
  pillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  pillTextTaken: {
    color: '#047857',
  },
  pillTextPending: {
    color: '#D97706',
  },
  floatingBtnsRow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 999,
  },
  floatingSos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
    ...SHADOWS.sos,
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
  emergencySosBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#F87171',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  emergencySosHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.sm,
  },
  sosAlertCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencySosTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#DC2626',
    letterSpacing: 0.3,
  },
  emergencySosSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7F1D1D',
    marginTop: 2,
  },
  sosActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  sosCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    paddingVertical: 9,
    borderRadius: 8,
  },
  sosCallBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sosMapBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#0284C7',
    paddingVertical: 9,
    borderRadius: 8,
  },
  sosMapBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sosDismissBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
  },
  sosDismissText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7F1D1D',
  },
});
