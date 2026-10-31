import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Stethoscope,
  Users,
  FileCheck2,
  AlertCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  CheckCircle2,
  Search,
  FileText,
  Activity,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Hospital,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { MOCK_DOCTOR_DATA } from '../../mock/healthData';
import { Header } from '../../components/common/Header';
import { DoctorPrescriptionWizardModal } from '../../components/doctor/DoctorPrescriptionWizardModal';
import { PatientDetailModal } from '../../components/asha/PatientDetailModal';
import { DoctorTeleChatModal } from '../../components/asha/DoctorTeleChatModal';
import { SwasthyaMitrAiModal } from '../../components/ai/SwasthyaMitrAiModal';

export const DoctorHomeScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'asha_referrals'>('queue');
  const [queueList, setQueueList] = useState(MOCK_DOCTOR_DATA.queue);
  const [selectedPatientForRx, setSelectedPatientForRx] = useState<any>(null);
  const [rxWizardVisible, setRxWizardVisible] = useState(false);
  const [selectedPatientForEmr, setSelectedPatientForEmr] = useState<any>(null);
  const [emrModalVisible, setEmrModalVisible] = useState(false);
  const [teleChatVisible, setTeleChatVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  const handleAdvanceStatus = (idx: number) => {
    setQueueList((prev) =>
      prev.map((item, i) => {
        if (i === idx) {
          const nextStatus =
            item.status === 'WAITING'
              ? 'NEXT'
              : item.status === 'NEXT'
              ? 'IN_CONSULTATION'
              : 'COMPLETED';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleStartPrescription = (patient: any) => {
    setSelectedPatientForRx(patient);
    setRxWizardVisible(true);
  };

  const handleOpenEmr = (patient: any) => {
    setSelectedPatientForEmr({
      ...patient,
      adherenceRate: 92,
      streakDays: 5,
      conditions: ['Hypertension Care', 'Seasonal Follow-up'],
      phone: '+91 98765 43210',
      village: 'Rampur Gram',
      ward: 'Ward 3',
    });
    setEmrModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header roleBadge="PHC Doctor" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Greeting Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{MOCK_DOCTOR_DATA.doctorName} 🩺</Text>
            <Text style={styles.subGreeting}>{MOCK_DOCTOR_DATA.hospital}</Text>
          </View>
        </View>

        {/* OPD Daily Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricVal}>{MOCK_DOCTOR_DATA.totalOpdToday}</Text>
            <Text style={styles.metricLabel}>Total OPD</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: COLORS.success }]}>
              {queueList.filter((q) => q.status === 'COMPLETED').length + 16}
            </Text>
            <Text style={styles.metricLabel}>Consulted</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricVal, { color: COLORS.accent }]}>
              {queueList.filter((q) => q.status !== 'COMPLETED').length}
            </Text>
            <Text style={styles.metricLabel}>In Queue</Text>
          </View>
        </View>

        {/* Tab Switcher: OPD Queue vs ASHA Referrals */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'queue' && styles.tabBtnActive]}
            onPress={() => setActiveTab('queue')}
          >
            <Users size={14} color={activeTab === 'queue' ? '#047857' : '#64748B'} />
            <Text style={[styles.tabBtnText, activeTab === 'queue' && styles.tabBtnTextActive]}>
              Live OPD Queue ({queueList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'asha_referrals' && styles.tabBtnActive]}
            onPress={() => setActiveTab('asha_referrals')}
          >
            <Hospital size={14} color={activeTab === 'asha_referrals' ? '#047857' : '#64748B'} />
            <Text style={[styles.tabBtnText, activeTab === 'asha_referrals' && styles.tabBtnTextActive]}>
              ASHA Referrals (3)
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'queue' ? (
          <>
            {/* Prescription Review Banner */}
            <View style={styles.rxReviewBanner}>
              <View style={styles.rxReviewLeft}>
                <FileCheck2 size={20} color="#059669" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rxReviewTitle}>3 AI Prescription Reviews Pending</Text>
                  <Text style={styles.rxReviewSub}>
                    OCR digitized prescriptions from ASHA field visits awaiting doctor digital signature.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.reviewBtn}
                onPress={() => handleStartPrescription(queueList[0])}
              >
                <Text style={styles.reviewBtnText}>Review & Sign</Text>
              </TouchableOpacity>
            </View>

            {/* Live Queue Cards */}
            <Text style={styles.sectionHeader}>Active Patient Queue</Text>

            <View style={styles.queueList}>
              {queueList.map((item, idx) => {
                const isInConsult = item.status === 'IN_CONSULTATION';
                const isCompleted = item.status === 'COMPLETED';
                return (
                  <View key={idx} style={[styles.queueCard, isInConsult && styles.queueCardActive]}>
                    <View style={styles.cardTopRow}>
                      <View style={[styles.tokenBox, isInConsult && styles.tokenBoxActive]}>
                        <Text style={[styles.tokenText, isInConsult && styles.tokenTextActive]}>
                          {item.token}
                        </Text>
                        <Text style={[styles.tokenStatus, isInConsult && styles.tokenStatusActive]}>
                          {item.status.replace('_', ' ')}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.patientName}>{item.name}</Text>
                        <Text style={styles.patientMeta}>{item.age} yrs • {item.gender} • ABHA: {item.abhaId}</Text>
                        <Text style={styles.complaintText}>🩺 {item.complaint}</Text>
                        <Text style={styles.vitalsText}>📈 Vitals: {item.vitals}</Text>
                      </View>
                    </View>

                    {/* Actions Row */}
                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity
                        style={styles.emrBtn}
                        onPress={() => handleOpenEmr(item)}
                      >
                        <Activity size={12} color="#0284C7" />
                        <Text style={styles.emrBtnText}>View EMR</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.rxBtn}
                        onPress={() => handleStartPrescription(item)}
                      >
                        <FileText size={12} color="#FFFFFF" />
                        <Text style={styles.rxBtnText}>Write Rx</Text>
                      </TouchableOpacity>

                      {!isCompleted && (
                        <TouchableOpacity
                          style={styles.nextBtn}
                          onPress={() => handleAdvanceStatus(idx)}
                        >
                          <Text style={styles.nextBtnText}>
                            {isInConsult ? 'Done ✓' : 'Call Next →'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          /* ASHA Coordination Hub Tab */
          <View style={styles.referralsContainer}>
            <Text style={styles.sectionHeader}>Incoming Field Referrals</Text>

            {[
              {
                id: 'REF-819',
                patient: 'Ram Charan Yadav (Ward 1)',
                asha: 'Sunita Bai (ASHA)',
                reason: 'Persistent Morning Dizziness & BP 168/104 mmHg',
                priority: 'URGENT',
                time: '09:30 AM',
              },
              {
                id: 'REF-712',
                patient: 'Meena Kumari (Ward 2)',
                asha: 'Sunita Bai (ASHA)',
                reason: 'Antenatal Checkup • Low Hemoglobin (Hb 8.2)',
                priority: 'EMERGENCY',
                time: '08:45 AM',
              },
            ].map((refItem) => (
              <View key={refItem.id} style={styles.refCard}>
                <View style={styles.refCardTop}>
                  <Text style={styles.refPatient}>{refItem.patient}</Text>
                  <View
                    style={[
                      styles.urgBadge,
                      refItem.priority === 'EMERGENCY' ? styles.urgEmerg : styles.urgUrgent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.urgBadgeText,
                        refItem.priority === 'EMERGENCY' ? styles.urgEmergText : styles.urgUrgentText,
                      ]}
                    >
                      {refItem.priority}
                    </Text>
                  </View>
                </View>

                <Text style={styles.refAsha}>👩‍⚕️ Field Worker: {refItem.asha} • {refItem.time}</Text>
                <Text style={styles.refReason}>🩺 Note: {refItem.reason}</Text>

                <View style={styles.refActionsRow}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => Alert.alert('Referral Accepted', `Patient ${refItem.patient} added to priority OPD queue.`)}
                  >
                    <CheckCircle2 size={12} color="#FFFFFF" />
                    <Text style={styles.acceptBtnText}>Accept Case</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.teleChatBtn}
                    onPress={() => setTeleChatVisible(true)}
                  >
                    <MessageSquare size={12} color="#0369A1" />
                    <Text style={styles.teleChatBtnText}>Reply ASHA</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.floatingBtnsRow}>
        <TouchableOpacity
          style={styles.floatingDocChat}
          onPress={() => setTeleChatVisible(true)}
          activeOpacity={0.85}
        >
          <MessageSquare size={16} color="#FFFFFF" />
          <Text style={styles.floatingBtnText}>ASHA Hub</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.floatingAi}
          onPress={() => setAiModalVisible(true)}
          activeOpacity={0.85}
        >
          <Sparkles size={16} color="#FFFFFF" />
          <Text style={styles.floatingBtnText}>Clinical AI</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <DoctorPrescriptionWizardModal
        visible={rxWizardVisible}
        onClose={() => setRxWizardVisible(false)}
        patient={selectedPatientForRx}
      />

      <PatientDetailModal
        visible={emrModalVisible}
        onClose={() => setEmrModalVisible(false)}
        patient={selectedPatientForEmr}
      />

      <DoctorTeleChatModal
        visible={teleChatVisible}
        onClose={() => setTeleChatVisible(false)}
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
  metricsRow: {
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
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: SPACING.md,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    ...SHADOWS.subtle,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#047857',
  },
  rxReviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: SPACING.md,
    gap: 8,
  },
  rxReviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  rxReviewTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#064E3B',
  },
  rxReviewSub: {
    fontSize: 9,
    color: '#047857',
    marginTop: 1,
  },
  reviewBtn: {
    backgroundColor: '#047857',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reviewBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: SPACING.sm,
  },
  queueList: {
    gap: 10,
  },
  queueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...SHADOWS.subtle,
  },
  queueCardActive: {
    borderColor: '#34D399',
    backgroundColor: '#F0FDF4',
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tokenBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tokenBoxActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  tokenText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  tokenTextActive: {
    color: '#FFFFFF',
  },
  tokenStatus: {
    fontSize: 8,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  tokenStatusActive: {
    color: '#D1FAE5',
  },
  patientName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  patientMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  complaintText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    marginTop: 2,
  },
  vitalsText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
    marginTop: 1,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  emrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  emrBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
  rxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#047857',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  rxBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nextBtn: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  nextBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  referralsContainer: {
    gap: 10,
  },
  refCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
    ...SHADOWS.subtle,
  },
  refCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refPatient: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  urgBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgUrgent: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  urgEmerg: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  urgBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  urgUrgentText: {
    color: '#D97706',
  },
  urgEmergText: {
    color: '#DC2626',
  },
  refAsha: {
    fontSize: 10,
    color: '#64748B',
  },
  refReason: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  refActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 4,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#047857',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  acceptBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  teleChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  teleChatBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
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
