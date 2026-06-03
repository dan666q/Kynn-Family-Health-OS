import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Share, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { useFamilyStore } from '../../store/family.store';
import MemberCard from '../../components/cards/MemberCard';
import CustomButton from '../../components/common/CustomButton';
import Header from '../../components/common/Header';

export const FamilyScreen = () => {
  const { currentFamily, members } = useFamilyStore();

  const handleShareInvite = async () => {
    try {
      if (!currentFamily) return;
      await Share.share({
        message: `Tham gia gia đình chăm sóc sức khỏe "${currentFamily.name}" của tôi trên Kynn Family Health OS. Sử dụng Mã mời: ${currentFamily.inviteCode}`,
      });
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  const showQRDetail = () => {
    Alert.alert(
      'Mã QR Gia Đình',
      `Mã mời: ${currentFamily?.inviteCode}\n\nHướng dẫn: Các thành viên khác tải app Kynn, quét mã QR này để tham gia nhóm chăm sóc sức khỏe gia đình bạn instantly.`,
      [{ text: 'Đóng' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Gia Đình Tôi" 
        subtitle="Quản lý thành viên & phân chia lịch chăm sóc"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Family Meta Card */}
        {currentFamily && (
          <View style={styles.familyHeaderCard}>
            <Image source={{ uri: currentFamily.avatar }} style={styles.familyAvatar} />
            <Text style={styles.familyName}>{currentFamily.name}</Text>
            
            <View style={styles.inviteContainer}>
              <Text style={styles.inviteLabel}>Mã mời gia đình:</Text>
              <Text style={styles.inviteCode}>{currentFamily.inviteCode}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleShareInvite} activeOpacity={0.8}>
                <Ionicons name="share-social-outline" size={16} color={COLORS.textDark} style={styles.actionIcon} />
                <Text style={styles.actionBtnText}>Chia sẻ mã mời</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.qrBtn]} onPress={showQRDetail} activeOpacity={0.8}>
                <Ionicons name="qr-code-outline" size={16} color={COLORS.textDark} style={styles.actionIcon} />
                <Text style={styles.actionBtnText}>Quét QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Thành viên ({members.length})</Text>

        {/* Member cards */}
        {members.map(member => (
          <MemberCard 
            key={member.id || (member as any)._id} 
            member={member} 
            onPress={() => Alert.alert(
              `Hồ sơ: ${member.fullName}`, 
              `Nhóm máu: ${member.bloodType}\nDị ứng: ${member.allergies.join(', ')}\nBệnh nền: ${member.chronicDiseases.join(', ')}`,
              [{ text: 'Đóng' }]
            )}
          />
        ))}

        <CustomButton 
          title="Thêm thành viên mới"
          onPress={() => Alert.alert('Đang phát triển', 'Tính năng phân quyền và thêm thành viên mới đang được đồng bộ.')}
          type="outline"
          style={styles.addBtn}
        />

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
  familyHeaderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusLg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
  },
  familyAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  familyName: {
    fontSize: FONTS.size.title,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: SPACING.sm,
  },
  inviteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: SPACING.borderRadiusSm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inviteLabel: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    marginRight: 6,
  },
  inviteCode: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primary,
    fontFamily: FONTS.family,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    borderRadius: SPACING.borderRadiusMd,
  },
  qrBtn: {
    backgroundColor: COLORS.secondaryLight,
  },
  actionIcon: {
    marginRight: 6,
  },
  actionBtnText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  sectionTitle: {
    fontSize: FONTS.size.title - 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: SPACING.md,
  },
  addBtn: {
    marginTop: SPACING.sm,
  }
});

export default FamilyScreen;
