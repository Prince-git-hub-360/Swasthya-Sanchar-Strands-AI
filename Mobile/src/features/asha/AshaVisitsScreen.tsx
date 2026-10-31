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
  ClipboardCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  Activity,
  Plus,
  Navigation,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { RecordVitalsModal } from '../../components/asha/RecordVitalsModal';

export const AshaVisitsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [vitalsModalVisible, setVitalsModalVisible] = useState(false);
  const [selectedPatientForVitals, setSelectedPatientForVitals] = useState<any>(null);

  const [tasks, setTasks] = useState([
    {
      id: 'task_1',
      patientName: 'Lakshmi Devi',
      ward: 'Ward 3, House #14',
      task: 'Blood Pressure Check & Amlodipine Adherence',
      priority: 'HIGH',
      time: '09:00 AM',
      completed: true,
    },
    {
      id: 'task_2',
      patientName: 'Ram Charan Yadav',
      ward: 'Ward 1, House #22',
      task: 'Blood Glucose Test & Follow-up for Dizziness',
      priority: 'HIGH',
      time: '10:30 AM',
      completed: false,
    },
    {
      id: 'task_3',
      patientName: 'Meena Kumari',
      ward: 'Ward 2, House #08',
      task: 'Antenatal Checkup (2nd Trimester Hb & Calcium)',
      priority: 'MEDIUM',
      time: '11:45 AM',
      completed: false,
    },
    {
      id: 'task_4',
      patientName: 'Savitri Bai',
      ward: 'Ward 2, House #41',
      task: 'Post-discharge recovery check & arthritis advice',
      priority: 'ROUTINE',
      time: '02:00 PM',
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doorstep Visits & Tasks</Text>
        <Text style={styles.headerSub}>Daily Village Route: Rampur Gram (Wards 1–3)</Text>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>Today's Home Visits Completed</Text>
            <Text style={styles.progressCount}>{completedCount} of {tasks.length} ({progress}%)</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      {/* Task List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {/* Route Optimization Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeIconBox}>
            <Navigation size={18} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeTitle}>Optimized Village Route Active</Text>
            <Text style={styles.routeSub}>Estimated 2.4 km walking circuit • 4 Target Households</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Schedule & Action Items</Text>

        {tasks.map((item) => (
          <View
            key={item.id}
            style={[styles.taskCard, item.completed && styles.taskCardDone]}
          >
            <TouchableOpacity
              style={[styles.checkCircle, item.completed && styles.checkCircleDone]}
              onPress={() => toggleTask(item.id)}
            >
              {item.completed && <CheckCircle2 size={16} color="#FFFFFF" />}
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <View style={styles.taskTopRow}>
                <Text style={[styles.patientName, item.completed && styles.textDone]}>
                  {item.patientName}
                </Text>
                <View
                  style={[
                    styles.priorityBadge,
                    item.priority === 'HIGH' ? styles.badgeHigh : styles.badgeRoutine,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      item.priority === 'HIGH' ? styles.textHigh : styles.textRoutine,
                    ]}
                  >
                    {item.priority}
                  </Text>
                </View>
              </View>

              <Text style={styles.wardText}>📍 {item.ward} • ⏰ {item.time}</Text>
              <Text style={styles.taskDesc}>{item.task}</Text>

              {/* Action Buttons */}
              <View style={styles.taskActionsRow}>
                <TouchableOpacity
                  style={styles.vitalsActionBtn}
                  onPress={() => {
                    setSelectedPatientForVitals({ name: item.patientName });
                    setVitalsModalVisible(true);
                  }}
                >
                  <Activity size={12} color="#047857" />
                  <Text style={styles.vitalsActionText}>Record Vitals</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.callActionBtn}
                  onPress={() => Alert.alert('Calling Patient', `Dialing ${item.patientName}...`)}
                >
                  <Phone size={12} color="#0284C7" />
                  <Text style={styles.callActionText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Record Vitals Modal */}
      <RecordVitalsModal
        visible={vitalsModalVisible}
        onClose={() => setVitalsModalVisible(false)}
        defaultPatient={selectedPatientForVitals}
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
    backgroundColor: '#064E3B',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11,
    color: '#A7F3D0',
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
    gap: 6,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressCount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  listContent: {
    padding: SPACING.md,
    gap: 10,
    paddingBottom: SPACING.xxxl,
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  routeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  routeSub: {
    fontSize: 10,
    color: '#047857',
    marginTop: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginTop: 4,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...SHADOWS.subtle,
  },
  taskCardDone: {
    backgroundColor: '#F8FAFC',
    opacity: 0.75,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkCircleDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeHigh: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  badgeRoutine: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
  },
  textHigh: {
    color: '#DC2626',
  },
  textRoutine: {
    color: '#64748B',
  },
  wardText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  taskDesc: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    marginTop: 4,
  },
  taskActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  vitalsActionBtn: {
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
  vitalsActionText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  callActionBtn: {
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
  callActionText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
});
