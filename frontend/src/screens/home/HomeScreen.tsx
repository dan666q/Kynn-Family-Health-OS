import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import ROUTES from '../../constants/routes';
import { useMedicationStore } from '../../store/medication.store';
import { useFamilyStore } from '../../store/family.store';
import { useTimelineStore } from '../../store/timeline.store';
import { useAuthStore } from '../../store/auth.store';
import MedicationCard from '../../components/cards/MedicationCard';
import TimelineItem from '../../components/cards/TimelineItem';

export const HomeScreen = ({ navigation }: any) => {
  const { medications, logs, toggleTaken } = useMedicationStore();
  const { members } = useFamilyStore();
  const { activities } = useTimelineStore();
  const { user } = useAuthStore();

  const getTodayDateString = () => new Date().toISOString().split('T')[0];
  const todayStr = getTodayDateString();

  const dailyMeds = medications.filter(m => m.active);

  const scheduleItems: Array<{ med: typeof medications[0]; slot: string; isTaken: boolean; checkedBy?: string }> = [];

  dailyMeds.forEach(med => {
    med.schedule.forEach(slot => {
      const log = logs.find(
        l => l.medicationId === med.id && 
             l.takenAt.startsWith(todayStr) && 
             l.timeSlot === slot
      );
      
      scheduleItems.push({
        med,
        slot,
        isTaken: !!log,
        checkedBy: log?.checkedBy
      });
    });
  });

  scheduleItems.sort((a, b) => {
    if (a.slot.includes('Khi') || b.slot.includes('Khi')) return 1;
    return a.slot.localeCompare(b.slot);
  });

  const handleToggleMed = (medicationId: string, slot: string) => {
    const actorName = user ? `${user.name} (Con gái)` : 'Người chăm sóc';
    toggleTaken(medicationId, slot, actorName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Header */}
        <View style={styles.welcomeSection}>
          <View>
            <View style={styles.titleWithIcon}>
              <Text style={styles.welcomeTitle}>Chào Lan</Text>
              <Ionicons name="heart" size={26} color={COLORS.emergency} style={styles.welcomeHeart} />
            </View>
            <Text style={styles.welcomeSubtitle}>Hôm nay mọi việc đều ổn định!</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileBadge}
            onPress={() => navigation.navigate(ROUTES.FAMILY_TAB, { screen: ROUTES.FAMILY })}
          >
            <Ionicons name="person-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Emergency Shortcut (Calm but Urgent Red Button) */}
        <TouchableOpacity 
          style={styles.emergencyPanicButton}
          onPress={() => navigation.navigate(ROUTES.EMERGENCY_TAB, { screen: ROUTES.EMERGENCY })}
          activeOpacity={0.9}
        >
          <View style={styles.panicContainer}>
            <View style={styles.panicIconBox}>
              <Ionicons name="alert-circle" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.panicTextCol}>
              <Text style={styles.panicTitle}>NÚT KHẨN CẤP (PANIC)</Text>
              <Text style={styles.panicSub}>Xem nhanh Nhóm máu, Dị ứng, SĐT Cấp cứu</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Today's Medications checklist */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch uống thuốc hôm nay</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.MEDICATION_TAB, { screen: ROUTES.MEDICATION })}>
            <Text style={styles.seeAllText}>Xem tất cả ➔</Text>
          </TouchableOpacity>
        </View>

        {scheduleItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Hôm nay không có lịch uống thuốc nào.</Text>
          </View>
        ) : (
          scheduleItems.map((item, index) => {
            const member = members.find(m => m.id === item.med.memberId);
            return (
              <View key={`${item.med.id}-${item.slot}-${index}`} style={styles.medRow}>
                {/* Small indicator tag for who the medicine is for */}
                <View style={styles.memberTagRow}>
                  <Ionicons name="person-outline" size={14} color={COLORS.textMuted} style={styles.tagIcon} />
                  <Text style={styles.memberTag}>{member ? member.fullName : 'Thành viên'}</Text>
                </View>
                <MedicationCard 
                  medication={item.med}
                  isTaken={item.isTaken}
                  timeSlot={item.slot}
                  onToggle={() => handleToggleMed(item.med.id, item.slot)}
                  checkedBy={item.checkedBy}
                />
              </View>
            );
          })
        )}

        {/* Care Timeline Summary */}
        <View style={[styles.sectionHeader, { marginTop: SPACING.md }]}>
          <Text style={styles.sectionTitle}>Nhật ký chăm sóc gần đây</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.HOME_TAB, { screen: ROUTES.TIMELINE })}>
            <Text style={styles.seeAllText}>Chi tiết ➔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timelineCard}>
          {activities.slice(0, 3).map((act, index) => (
            <TimelineItem 
              key={act.id} 
              activity={act} 
              isLast={index === Math.min(activities.length, 3) - 1} 
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: FONTS.size.headline,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  welcomeHeart: {
    marginLeft: 6,
  },
  welcomeSubtitle: {
    fontSize: FONTS.size.body,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    marginTop: 2,
  },
  profileBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyPanicButton: {
    backgroundColor: COLORS.emergency,
    borderRadius: SPACING.borderRadiusLg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.emergency,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  panicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  panicIconBox: {
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panicTextCol: {
    flex: 1,
  },
  panicTitle: {
    fontSize: FONTS.size.body + 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.surface,
    fontFamily: FONTS.family,
    letterSpacing: 0.5,
  },
  panicSub: {
    fontSize: FONTS.size.caption + 1,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: FONTS.family,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.size.title - 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  seeAllText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.primary,
    fontFamily: FONTS.family,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: SPACING.borderRadiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.size.body,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  medRow: {
    marginBottom: 4,
  },
  memberTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingLeft: 4,
  },
  tagIcon: {
    marginRight: 4,
  },
  memberTag: {
    fontSize: FONTS.size.caption + 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  timelineCard: {
    backgroundColor: 'transparent',
  }
});

export default HomeScreen;
