import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { Member } from '../../types/family.types';

interface MemberCardProps {
  member: Member;
  onPress?: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Ông':
      case 'Bà':
        return { bg: '#FFF3E0', text: '#E65100' }; // Elder warm orange
      case 'Ba':
      case 'Mẹ':
        return { bg: COLORS.primaryLight, text: COLORS.primary }; // Parent calm blue
      default:
        return { bg: COLORS.secondaryLight, text: COLORS.secondary }; // Child soft green
    }
  };

  const roleStyle = getRoleColor(member.role);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: member.avatar }} style={styles.avatar} />
      
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{member.fullName}</Text>
          <View style={[styles.roleBadge, { backgroundColor: roleStyle.bg }]}>
            <Text style={[styles.roleText, { color: roleStyle.text }]}>{member.role}</Text>
          </View>
        </View>
        
        <View style={styles.birthdayRow}>
          <Ionicons name="calendar-outline" size={15} color={COLORS.textMuted} style={styles.infoIcon} />
          <Text style={styles.infoText}>Ngày sinh: {member.birthday}</Text>
        </View>
        
        <View style={styles.healthRow}>
          <View style={styles.healthBadge}>
            <Ionicons name="water" size={14} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.healthText}>Nhóm máu: {member.bloodType}</Text>
          </View>
          {member.allergies.length > 0 && member.allergies[0] !== 'Không dị ứng' && (
            <View style={[styles.healthBadge, styles.allergyBadge]}>
              <Ionicons name="warning-outline" size={14} color={COLORS.emergency} style={styles.infoIcon} />
              <Text style={styles.allergyText}>Dị ứng</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusLg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  content: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: FONTS.size.subtitle - 1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleText: {
    fontSize: FONTS.size.caption,
    fontWeight: FONTS.weight.bold,
    fontFamily: FONTS.family,
  },
  birthdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoText: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  healthRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginTop: 2,
  },
  healthText: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.textDark,
    fontWeight: FONTS.weight.semibold,
    fontFamily: FONTS.family,
  },
  allergyBadge: {
    backgroundColor: COLORS.emergencyLight,
  },
  allergyText: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.emergency,
    fontWeight: FONTS.weight.bold,
    fontFamily: FONTS.family,
  }
});

export default MemberCard;
