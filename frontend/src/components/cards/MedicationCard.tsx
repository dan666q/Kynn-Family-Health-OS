import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { Medication } from '../../types/medication.types';

interface MedicationCardProps {
  medication: Medication;
  isTaken: boolean;
  timeSlot: string;
  onToggle: () => void;
  checkedBy?: string;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  isTaken,
  timeSlot,
  onToggle,
  checkedBy,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVoice = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
      }, (medication.voiceDuration || 5) * 1000);
    }
  };

  return (
    <View style={[
      styles.card, 
      isTaken ? styles.takenCard : styles.pendingCard
    ]}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.medName}>{medication.name}</Text>
          <Text style={styles.dosageText}>Liều lượng: <Text style={styles.boldText}>{medication.dosage}</Text></Text>
        </View>
        
        {/* Large touch target checkbox */}
        <TouchableOpacity 
          style={[styles.checkbox, isTaken ? styles.checkedBox : styles.uncheckedBox]} 
          onPress={onToggle}
          activeOpacity={0.7}
        >
          {isTaken && <Ionicons name="checkmark" size={24} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      {medication.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="warning-outline" size={16} color="#D84315" style={styles.noteIcon} />
          <Text style={styles.notesText}>{medication.notes}</Text>
        </View>
      )}

      {/* Time and Checked By */}
      <View style={styles.footerRow}>
        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={15} color={COLORS.primary} style={styles.timeIcon} />
          <Text style={styles.timeText}>{timeSlot}</Text>
        </View>
        {isTaken && checkedBy && (
          <Text style={styles.checkedByText}>Người cho uống: {checkedBy}</Text>
        )}
      </View>

      {/* Voice Care Instructions Section */}
      {medication.voiceNoteUrl && (
        <View style={styles.voiceSection}>
          <TouchableOpacity 
            style={[styles.voiceButton, isPlaying && styles.voiceButtonPlaying]}
            onPress={handlePlayVoice}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isPlaying ? 'pause-circle-outline' : 'volume-high-outline'} 
              size={18} 
              color={COLORS.primary} 
              style={styles.voiceIcon} 
            />
            <Text style={styles.voiceLabel}>
              {isPlaying ? 'Đang phát hướng dẫn...' : 'Nghe hướng dẫn của Con Gái'}
            </Text>
            <Text style={styles.voiceDuration}>
              {medication.voiceDuration}s
            </Text>
          </TouchableOpacity>
          {isPlaying && (
            <Text style={styles.transcriptText}>
              “Bố ơi thuốc này nhớ uống ngay sau khi ăn sáng no nhé!”
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SPACING.borderRadiusLg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    backgroundColor: COLORS.surface,
  },
  pendingCard: {
    borderColor: COLORS.border,
  },
  takenCard: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondaryLight,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  medName: {
    fontSize: FONTS.size.subtitle,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: 4,
  },
  dosageText: {
    fontSize: FONTS.size.body,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  boldText: {
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
  },
  checkbox: {
    width: 48,  // Large elder-friendly touch target
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
  },
  uncheckedBox: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  checkedBox: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: SPACING.sm,
    borderRadius: SPACING.borderRadiusSm,
    marginTop: SPACING.sm,
  },
  noteIcon: {
    marginRight: 6,
  },
  notesText: {
    flex: 1,
    fontSize: FONTS.size.body - 1,
    color: '#E65100',
    fontFamily: FONTS.family,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timeIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.primary,
    fontWeight: FONTS.weight.semibold,
    fontFamily: FONTS.family,
  },
  checkedByText: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    fontStyle: 'italic',
  },
  voiceSection: {
    marginTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: SPACING.borderRadiusSm,
  },
  voiceButtonPlaying: {
    backgroundColor: COLORS.primaryLight,
  },
  voiceIcon: {
    marginRight: 8,
  },
  voiceLabel: {
    flex: 1,
    fontSize: FONTS.size.body - 1,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    fontWeight: FONTS.weight.medium,
  },
  voiceDuration: {
    fontSize: FONTS.size.caption,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  transcriptText: {
    marginTop: 8,
    fontSize: FONTS.size.body - 1,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    fontStyle: 'italic',
    paddingLeft: SPACING.sm,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  }
});

export default MedicationCard;
