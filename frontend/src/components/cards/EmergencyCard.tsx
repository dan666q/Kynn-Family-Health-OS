import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { Member } from '../../types/family.types';

interface EmergencyCardProps {
  member: Member;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({ member }) => {
  const handleCall = () => {
    const phoneNumber = member.emergencyContact.phone.replace(/[^0-9]/g, '');
    const url = Platform.OS === 'android' ? `tel:${phoneNumber}` : `telprompt:${phoneNumber}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  return (
    <View style={styles.card}>
      {/* Title Header */}
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <Ionicons name="alert-circle" size={18} color={COLORS.emergency} style={styles.badgeIcon} />
          <Text style={styles.roleBadge}>HỒ SƠ KHẨN CẤP</Text>
        </View>
        <Text style={styles.name}>{member.fullName.toUpperCase()}</Text>
      </View>

      {/* Blood Type Badge & Primary Illness */}
      <View style={styles.bloodRow}>
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodLabel}>NHÓM MÁU</Text>
          <Text style={styles.bloodValue}>{member.bloodType}</Text>
        </View>
        
        <View style={styles.diseaseContainer}>
          <Text style={styles.sectionLabel}>BỆNH NỀN CHỦ YẾU</Text>
          {member.chronicDiseases.map((disease, idx) => (
            <Text key={idx} style={styles.diseaseText}>• {disease}</Text>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* Allergies - Extremely Important */}
      <View style={styles.section}>
        <View style={styles.alertHeader}>
          <Ionicons name="warning" size={16} color={COLORS.emergency} style={styles.badgeIcon} />
          <Text style={[styles.sectionLabel, { color: COLORS.emergency }]}>DỊ ỨNG NGUY HIỂM</Text>
        </View>
        <View style={styles.allergyContainer}>
          {member.allergies.map((allergy, idx) => (
            <View key={idx} style={styles.allergyItem}>
              <Text style={styles.allergyText}>{allergy.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* Emergency Contact */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionLabel}>NGƯỜI LIÊN HỆ KHẨN CẤP</Text>
        <View style={styles.contactRow}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{member.emergencyContact.name}</Text>
            <Text style={styles.contactRelation}>Mối quan hệ: {member.emergencyContact.relationship}</Text>
          </View>
          
          <TouchableOpacity style={styles.callButton} onPress={handleCall} activeOpacity={0.8}>
            <Ionicons name="call" size={18} color="#FFFFFF" style={styles.callIcon} />
            <Text style={styles.callButtonIcon}>CALL</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Health Insurance & ID Card Info */}
      <View style={styles.insuranceRow}>
        <View style={styles.metaField}>
          <Text style={styles.metaLabel}>MÃ SỐ BHYT</Text>
          <Text style={styles.metaVal}>{member.insuranceId || 'N/A'}</Text>
        </View>
        <View style={styles.metaField}>
          <Text style={styles.metaLabel}>MÃ SỐ CCCD</Text>
          <Text style={styles.metaVal}>{member.idCardNumber || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.emergencyLight,
    borderRadius: SPACING.borderRadiusLg + 4,
    borderWidth: 3,
    borderColor: COLORS.emergency,
    padding: SPACING.md + 4,
    shadowColor: COLORS.emergency,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.emergency,
    marginBottom: 8,
  },
  badgeIcon: {
    marginRight: 6,
  },
  roleBadge: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.emergency,
  },
  name: {
    fontSize: FONTS.size.title + 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    textAlign: 'center',
    fontFamily: FONTS.family,
  },
  bloodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bloodBadge: {
    backgroundColor: COLORS.emergency,
    padding: SPACING.sm,
    borderRadius: SPACING.borderRadiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    marginRight: SPACING.md,
  },
  bloodLabel: {
    fontSize: FONTS.size.caption - 1,
    color: COLORS.surface,
    fontWeight: FONTS.weight.bold,
  },
  bloodValue: {
    fontSize: FONTS.size.giant,
    fontWeight: FONTS.weight.bold,
    color: COLORS.surface,
  },
  diseaseContainer: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textMuted,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  diseaseText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    marginBottom: 2,
    fontFamily: FONTS.family,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#FFCCBC',
    marginVertical: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.sm,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allergyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  allergyItem: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.emergency,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: SPACING.borderRadiusSm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  allergyText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.emergency,
    fontFamily: FONTS.family,
  },
  contactSection: {
    marginBottom: SPACING.sm,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  contactName: {
    fontSize: FONTS.size.subtitle,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.emergency,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderRadius: SPACING.borderRadiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.emergency,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  callIcon: {
    marginRight: 6,
  },
  callButtonIcon: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.surface,
  },
  insuranceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  metaField: {
    flex: 0.48,
  },
  metaLabel: {
    fontSize: FONTS.size.caption - 1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  metaVal: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  }
});

export default EmergencyCard;
