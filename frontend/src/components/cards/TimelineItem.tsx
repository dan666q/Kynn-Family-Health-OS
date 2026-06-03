import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { CareActivity } from '../../types/timeline.types';

interface TimelineItemProps {
  activity: CareActivity;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ activity, isLast = false }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'medication_taken':
        return { name: 'checkmark-circle' as const, color: COLORS.secondary, bg: COLORS.secondaryLight };
      case 'medication_missed':
        return { name: 'warning' as const, color: COLORS.missed, bg: COLORS.missedLight };
      case 'voice_note_added':
        return { name: 'volume-high' as const, color: COLORS.primary, bg: COLORS.primaryLight };
      case 'document_uploaded':
        return { name: 'document-text' as const, color: '#8E24AA', bg: '#F3E5F5' };
      default:
        return { name: 'pin' as const, color: COLORS.textMuted, bg: COLORS.border };
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  const itemIcon = getIcon();

  return (
    <View style={styles.container}>
      {/* Left line & Circle */}
      <View style={styles.leftCol}>
        <View style={[styles.iconCircle, { backgroundColor: itemIcon.bg, borderColor: itemIcon.color }]}>
          <Ionicons name={itemIcon.name} size={20} color={itemIcon.color} />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Right content card */}
      <View style={styles.rightCol}>
        <View style={styles.headerRow}>
          <Text style={styles.subjectName}>{activity.subjectName}</Text>
          <Text style={styles.timeText}>{formatTime(activity.createdAt)}</Text>
        </View>
        
        <Text style={styles.messageText}>{activity.message}</Text>
        
        {activity.metadata?.text && (
          <View style={styles.metaBox}>
            <Text style={styles.metaText}>{activity.metadata.text}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  leftCol: {
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1.5,
  },
  line: {
    width: 3,
    backgroundColor: COLORS.border,
    flex: 1,
    marginVertical: 4,
  },
  rightCol: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusMd,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectName: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  timeText: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.textMuted,
    fontWeight: FONTS.weight.medium,
    fontFamily: FONTS.family,
  },
  messageText: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textDark,
    lineHeight: 22,
    fontFamily: FONTS.family,
  },
  metaBox: {
    marginTop: 8,
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: SPACING.borderRadiusSm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  metaText: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    fontFamily: FONTS.family,
  }
});

export default TimelineItem;
