import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Hospital,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Ambulance,
  Phone,
  Building,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { CreateReferralModal } from '../../components/asha/CreateReferralModal';
import { SafeStorage } from '../../services/safeStorage';

export const AshaReferralsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const storedStr = await SafeStorage.getItem('@swasthya_asha_referrals');
        if (storedStr) {
          const stored = JSON.parse(storedStr);
          if (Array.isArray(stored) && stored.length > 0) {
            setReferrals(stored);
            return;
          }
        }
      } catch (e) {}

      // Default sample referrals
      setReferrals([
        {
          id: 'REF-2026-819',
          patientName: 'Ram Charan Yadav',
          facility: 'Rampur PHC (Dr. Ramesh Sharma)',
          reason: 'Stage-2 Hypertension with persistent morning dizziness',
          urgency: 'URGENT',
          status: 'UNDER_REVIEW',
          statusLabel: '🟡 Under Doctor Review',
          createdAt: '09:30 AM',
          date: 'Today',
          ambulance108: false,
        },
        {
          id: 'REF-2026-712',
          patientName: 'Meena Kumari',
          facility: 'Varanasi District Hospital',
          reason: '3rd Trimester High-Risk Anemia (Hb 8.2)',
          urgency: 'EMERGENCY',
          status: 'ACCEPTED',
          statusLabel: '🟢 Doctor Accepted • Bed Allocated',
          createdAt: 'Yesterday',
          date: 'Yesterday',
          ambulance108: true,
        },
      ]);
    };

    loadReferrals();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>PHC Referral Slips</Text>
            <Text style={styles.headerSub}>Emergency & Specialist Hospital Referrals</Text>
          </View>

          <TouchableOpacity
            style={styles.newRefBtn}
            onPress={() => setCreateModalVisible(true)}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.newRefBtnText}>New Referral</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statTile}>
            <Text style={styles.statNum}>{referrals.length}</Text>
            <Text style={styles.statName}>Total Slips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statTile}>
            <Text style={[styles.statNum, { color: '#DC2626' }]}>
              {referrals.filter((r) => r.urgency === 'EMERGENCY').length}
            </Text>
            <Text style={styles.statName}>Emergency</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statTile}>
            <Text style={[styles.statNum, { color: '#059669' }]}>
              {referrals.filter((r) => r.status === 'ACCEPTED').length}
            </Text>
            <Text style={styles.statName}>Doctor Accepted</Text>
          </View>
        </View>
      </View>

      {/* Referrals List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {referrals.map((item) => {
          const isEmerg = item.urgency === 'EMERGENCY';
          return (
            <View
              key={item.id}
              style={[styles.referralCard, isEmerg && styles.referralCardEmerg]}
            >
              <View style={styles.cardTop}>
                <View style={styles.idBox}>
                  <Text style={styles.idText}>{item.id}</Text>
                  <Text style={styles.timeText}>{item.date} • {item.createdAt}</Text>
                </View>

                <View
                  style={[
                    styles.urgencyBadge,
                    isEmerg ? styles.urgencyEmerg : styles.urgencyUrgent,
                  ]}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      isEmerg ? styles.urgencyEmergText : styles.urgencyUrgentText,
                    ]}
                  >
                    {item.urgency}
                  </Text>
                </View>
              </View>

              <Text style={styles.patientName}>{item.patientName}</Text>
              <Text style={styles.facilityName}>🏥 {item.facility}</Text>
              <Text style={styles.reasonText}>🩺 Reason: {item.reason}</Text>

              {item.ambulance108 && (
                <View style={styles.ambulanceTag}>
                  <Ambulance size={14} color="#DC2626" />
                  <Text style={styles.ambulanceTagText}>108 Emergency Ambulance Dispatched</Text>
                </View>
              )}

              {/* Status Footer */}
              <View style={styles.statusFooter}>
                <Text style={styles.statusLabel}>{item.statusLabel || item.status}</Text>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => Alert.alert('PHC Hotline', 'Connecting to Rampur PHC Helpdesk...')}
                >
                  <Phone size={12} color="#0284C7" />
                  <Text style={styles.callBtnText}>Call PHC</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Create Referral Modal */}
      <CreateReferralModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={(newRef) => setReferrals((prev) => [newRef, ...prev])}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: '#0369A1',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11,
    color: '#BAE6FD',
    marginTop: 1,
  },
  newRefBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  newRefBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 8,
  },
  statTile: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statName: {
    fontSize: 9,
    color: '#E0F2FE',
    fontWeight: '600',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  listContent: {
    padding: SPACING.md,
    gap: 10,
    paddingBottom: SPACING.xxxl,
  },
  referralCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
    ...SHADOWS.subtle,
  },
  referralCardEmerg: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFBFB',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idBox: {
    gap: 1,
  },
  idText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    fontFamily: 'monospace',
  },
  timeText: {
    fontSize: 9,
    color: '#94A3B8',
  },
  urgencyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  urgencyUrgent: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  urgencyEmerg: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  urgencyText: {
    fontSize: 9,
    fontWeight: '800',
  },
  urgencyUrgentText: {
    color: '#D97706',
  },
  urgencyEmergText: {
    color: '#DC2626',
  },
  patientName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  facilityName: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  reasonText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  ambulanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 6,
    borderRadius: 6,
    marginTop: 2,
  },
  ambulanceTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  statusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  callBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
});
