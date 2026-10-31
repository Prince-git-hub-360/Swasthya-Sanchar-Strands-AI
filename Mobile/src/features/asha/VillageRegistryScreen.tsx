import React, { useState, useEffect } from 'react';
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
  Plus,
  ShieldCheck,
  Activity,
  Heart,
  AlertTriangle,
  ChevronRight,
  Phone,
  QrCode,
  Sparkles,
  Filter,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ASHA_DATA, AshaPatientRecord } from '../../mock/healthData';
import { SafeStorage } from '../../services/safeStorage';
import { RecordVitalsModal } from '../../components/asha/RecordVitalsModal';
import { AbhaRegistrationModal } from '../../components/asha/AbhaRegistrationModal';
import { CreateReferralModal } from '../../components/asha/CreateReferralModal';
import { PatientDetailModal } from '../../components/asha/PatientDetailModal';

export const VillageRegistryScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<AshaPatientRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH_RISK' | 'ELDERLY' | 'MATERNAL' | 'CHILDREN'>('ALL');

  // Modals state
  const [selectedPatient, setSelectedPatient] = useState<AshaPatientRecord | null>(null);
  const [vitalsModalVisible, setVitalsModalVisible] = useState(false);
  const [abhaModalVisible, setAbhaModalVisible] = useState(false);
  const [referralModalVisible, setReferralModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const storedStr = await SafeStorage.getItem('@swasthya_asha_patients');
        if (storedStr) {
          const stored = JSON.parse(storedStr);
          if (Array.isArray(stored) && stored.length > 0) {
            setPatients(stored);
            return;
          }
        }
      } catch (e) {}

      // Default patients list
      setPatients(MOCK_ASHA_DATA.patients);
    };

    loadPatients();
  }, []);

  const filters = [
    { id: 'ALL', label: 'All Citizens (सभी)' },
    { id: 'HIGH_RISK', label: '⚠️ High Risk (जोखिम)' },
    { id: 'ELDERLY', label: '👴 Elderly (60+)' },
    { id: 'MATERNAL', label: '🤰 Maternal Care' },
    { id: 'CHILDREN', label: '👶 Children / Tika' },
  ];

  const filteredPatients = patients.filter((p) => {
    // Search match
    const nameMatch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const abhaMatch = (p.abhaId || '').includes(searchQuery);
    const villageMatch = (p.village || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = nameMatch || abhaMatch || villageMatch;

    if (!matchesSearch) return false;

    // Filter match
    if (selectedFilter === 'HIGH_RISK') {
      return p.status === 'ATTENTION_NEEDED' || p.adherenceRate < 80;
    }
    if (selectedFilter === 'ELDERLY') {
      return p.age >= 60;
    }
    if (selectedFilter === 'MATERNAL') {
      return p.gender === 'Female' && p.age < 35;
    }
    if (selectedFilter === 'CHILDREN') {
      return p.age <= 12;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.screenTitle}>Village Health Registry</Text>
            <Text style={styles.screenSub}>
              Rampur Gram Panchayat • {patients.length} Registered Citizens
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addAbhaBtn}
            onPress={() => setAbhaModalVisible(true)}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addAbhaBtnText}>Add ABHA</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={16} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by Name, ABHA ID, or Ward..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Filter Chips Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {filters.map((f) => {
            const isActive = selectedFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedFilter(f.id as any)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Patient Cards List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsCount}>
          Showing {filteredPatients.length} Citizens in Registry
        </Text>

        {filteredPatients.map((item) => {
          const isAttention = item.status === 'ATTENTION_NEEDED';
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.patientCard, isAttention && styles.patientCardAttention]}
              onPress={() => {
                setSelectedPatient(item);
                setDetailModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.avatarMini}>
                  <Text style={{ fontSize: 18 }}>{item.gender === 'Female' ? '👩' : '👨'}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.patientName}>{item.name}</Text>
                    <View style={[styles.statusBadge, isAttention ? styles.badgeAttention : styles.badgeOptimal]}>
                      <Text style={[styles.statusBadgeText, isAttention ? styles.textAttention : styles.textOptimal]}>
                        {isAttention ? '⚠️ Attention' : '✅ On Track'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.patientSub}>
                    {item.age} yrs • {item.gender} • {item.ward}, {item.village}
                  </Text>

                  <View style={styles.abhaRow}>
                    <ShieldCheck size={11} color="#059669" />
                    <Text style={styles.abhaText}>{item.abhaId}</Text>
                  </View>
                </View>
              </View>

              {/* Conditions Tags */}
              <View style={styles.conditionsRow}>
                {item.conditions.map((c) => (
                  <View key={c} style={styles.conditionTag}>
                    <Text style={styles.conditionTagText}>{c}</Text>
                  </View>
                ))}
              </View>

              {/* Quick Actions Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.adherenceBox}>
                  <Text style={styles.adherenceLabel}>Adherence</Text>
                  <Text style={styles.adherenceValue}>{item.adherenceRate}%</Text>
                </View>

                <View style={styles.footerActions}>
                  <TouchableOpacity
                    style={styles.actionBtnVitals}
                    onPress={() => {
                      setSelectedPatient(item);
                      setVitalsModalVisible(true);
                    }}
                  >
                    <Activity size={12} color="#047857" />
                    <Text style={styles.actionBtnVitalsText}>Vitals</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnReferral}
                    onPress={() => {
                      setSelectedPatient(item);
                      setReferralModalVisible(true);
                    }}
                  >
                    <Text style={styles.actionBtnReferralText}>Refer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modals */}
      <RecordVitalsModal
        visible={vitalsModalVisible}
        onClose={() => setVitalsModalVisible(false)}
        defaultPatient={selectedPatient}
      />

      <AbhaRegistrationModal
        visible={abhaModalVisible}
        onClose={() => setAbhaModalVisible(false)}
        onSuccess={(newCit) => {
          setPatients((prev) => [newCit, ...prev]);
        }}
      />

      <CreateReferralModal
        visible={referralModalVisible}
        onClose={() => setReferralModalVisible(false)}
        defaultPatient={selectedPatient}
      />

      <PatientDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        patient={selectedPatient}
        onOpenRecordVitals={() => setVitalsModalVisible(true)}
        onOpenReferral={() => setReferralModalVisible(true)}
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  screenSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  addAbhaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#047857',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addAbhaBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '500',
    padding: 0,
  },
  filtersScroll: {
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  filterChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: SPACING.md,
    gap: 10,
    paddingBottom: SPACING.xxxl,
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    ...SHADOWS.subtle,
  },
  patientCardAttention: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFBFB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeOptimal: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeAttention: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  textOptimal: {
    color: '#047857',
  },
  textAttention: {
    color: '#DC2626',
  },
  patientSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  abhaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  abhaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    fontFamily: 'monospace',
  },
  conditionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  conditionTag: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  conditionTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  adherenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adherenceLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  adherenceValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtnVitals: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  actionBtnVitalsText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  actionBtnReferral: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  actionBtnReferralText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
});
