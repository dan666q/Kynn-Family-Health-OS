import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { useTimelineStore } from '../../store/timeline.store';
import TimelineItem from '../../components/cards/TimelineItem';
import Header from '../../components/common/Header';

export const TimelineScreen = () => {
  const { activities } = useTimelineStore();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Nhật Ký Realtime" 
        subtitle="Theo dõi phối hợp chăm sóc gia đình trực tuyến"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.timelineLabelRow}>
          <Text style={styles.timelineLabel}>Hôm nay</Text>
          <View style={styles.realtimePulse}>
            <View style={styles.pulseDot} />
            <Text style={styles.pulseText}>Realtime</Text>
          </View>
        </View>

        {activities.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Chưa có sự kiện chăm sóc nào được ghi nhận.</Text>
          </View>
        ) : (
          <View style={styles.timelineContainer}>
            {activities.map((act, index) => (
              <TimelineItem 
                key={act.id} 
                activity={act} 
                isLast={index === activities.length - 1} 
              />
            ))}
          </View>
        )}
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
  timelineLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  timelineLabel: {
    fontSize: FONTS.size.title - 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  realtimePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginRight: 6,
  },
  pulseText: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.secondary,
    fontWeight: FONTS.weight.bold,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: SPACING.borderRadiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  emptyText: {
    fontSize: FONTS.size.body,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  timelineContainer: {
    paddingLeft: 4,
  }
});

export default TimelineScreen;
