import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Share, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { useFamilyStore } from '../../store/family.store';
import useAuthStore from '../../store/auth.store';
import MemberCard from '../../components/cards/MemberCard';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';
import Header from '../../components/common/Header';

export const FamilyScreen = () => {
  const { currentFamily, members, addMember } = useFamilyStore();
  const { logout, changePassword, user } = useAuthStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Ông');
  const [birthday, setBirthday] = useState('1970-01-01');
  const [bloodType, setBloodType] = useState('O+');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [chronicInput, setChronicInput] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelationship, setContactRelationship] = useState('');
  const [loading, setLoading] = useState(false);

  // Change password modal states
  const [changePwModalVisible, setChangePwModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: async () => {
          try {
            await logout();
          } catch (err) {
            console.error('Logout failed:', err);
          }
        }
      }
    ]);
  };

  const handleChangePasswordSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Lỗi mật khẩu', 'Mật khẩu mới phải dài ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Lỗi mật khẩu', 'Mật khẩu xác nhận mới không trùng khớp.');
      return;
    }

    setPwLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
      setChangePwModalVisible(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc xảy ra lỗi kết nối.';
      Alert.alert('Lỗi đổi mật khẩu', errMsg);
    } finally {
      setPwLoading(false);
    }
  };

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

  const handleAddMember = async () => {
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên thành viên.');
      return;
    }
    if (!role.trim()) {
      Alert.alert('Lỗi', 'Vui lòng chọn vai trò.');
      return;
    }

    const bdayDate = new Date(birthday);
    if (isNaN(bdayDate.getTime())) {
      Alert.alert('Lỗi', 'Ngày sinh không hợp lệ. Vui lòng điền định dạng YYYY-MM-DD.');
      return;
    }

    setLoading(true);
    try {
      const allergies = allergiesInput
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
      const chronicDiseases = chronicInput
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x.length > 0);

      await addMember({
        fullName: fullName.trim(),
        role: role.trim() as any,
        birthday: bdayDate.toISOString(),
        bloodType: bloodType as any,
        allergies,
        chronicDiseases,
        emergencyContact: {
          name: contactName.trim(),
          phone: contactPhone.trim(),
          relationship: contactRelationship.trim(),
        },
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // Default placeholder avatar
      });

      Alert.alert('Thành công', `Đã thêm thành viên "${fullName}" thành công.`);
      setModalVisible(false);
      
      // Reset inputs
      setFullName('');
      setRole('Ông');
      setBirthday('1970-01-01');
      setBloodType('O+');
      setAllergiesInput('');
      setChronicInput('');
      setContactName('');
      setContactPhone('');
      setContactRelationship('');
    } catch (err: any) {
      Alert.alert('Lỗi', err.response?.data?.message || err.message || 'Không thể tạo hồ sơ thành viên.');
    } finally {
      setLoading(false);
    }
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

        {/* Account settings card */}
        {user && (
          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Tài khoản: {user.name} ({user.username})</Text>
            
            <TouchableOpacity style={styles.settingsRow} onPress={() => setChangePwModalVisible(true)} activeOpacity={0.7}>
              <View style={styles.settingsRowLeft}>
                <Ionicons name="key-outline" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
                <Text style={styles.settingsRowText}>Đổi mật khẩu tài khoản</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>

            <View style={styles.settingsDivider} />

            <TouchableOpacity style={styles.settingsRow} onPress={handleLogout} activeOpacity={0.7}>
              <View style={styles.settingsRowLeft}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.missed} style={{ marginRight: 10 }} />
                <Text style={[styles.settingsRowText, { color: COLORS.missed }]}>Đăng xuất khỏi app</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Thành viên gia đình ({members.length})</Text>

        {/* Member cards */}
        {members.map(member => (
          <MemberCard 
            key={member.id || (member as any)._id} 
            member={member} 
            onPress={() => {
              const bdayStr = member.birthday ? new Date(member.birthday).toLocaleDateString('vi-VN') : 'Không rõ';
              Alert.alert(
                `Hồ sơ: ${member.fullName}`, 
                `Quan hệ: ${member.role}\nNgày sinh: ${bdayStr}\nNhóm máu: ${member.bloodType}\nDị ứng: ${member.allergies.length > 0 ? member.allergies.join(', ') : 'Không'}\nBệnh nền: ${member.chronicDiseases.length > 0 ? member.chronicDiseases.join(', ') : 'Không'}`,
                [{ text: 'Đóng' }]
              );
            }}
          />
        ))}

        <CustomButton 
          title="Thêm thành viên mới"
          onPress={() => setModalVisible(true)}
          type="outline"
          style={styles.addBtn}
        />

      </ScrollView>

      {/* Add Member Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Thành Viên Mới</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              
              <CustomInput 
                label="Họ và Tên"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Ví dụ: Nguyễn Văn A..."
              />

              {/* Role Chip Selector */}
              <Text style={styles.label}>Vai trò (Quan hệ)</Text>
              <View style={styles.selectorRow}>
                {['Ông', 'Bà', 'Ba', 'Mẹ', 'Anh', 'Chị', 'Em', 'Bé'].map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.selectorChip,
                      role === r && styles.selectorChipActive
                    ]}
                    onPress={() => setRole(r)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.selectorChipText,
                      role === r && styles.selectorChipTextActive
                    ]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <CustomInput 
                label="Ngày sinh (YYYY-MM-DD)"
                value={birthday}
                onChangeText={setBirthday}
                placeholder="Ví dụ: 1945-10-12"
              />

              {/* Blood Type Selector */}
              <Text style={styles.label}>Nhóm máu</Text>
              <View style={styles.selectorRow}>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Không rõ'].map(bt => (
                  <TouchableOpacity
                    key={bt}
                    style={[
                      styles.selectorChip,
                      bloodType === bt && styles.selectorChipActive
                    ]}
                    onPress={() => setBloodType(bt)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.selectorChipText,
                      bloodType === bt && styles.selectorChipTextActive
                    ]}>{bt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <CustomInput 
                label="Dị ứng (cách nhau bằng dấu phẩy)"
                value={allergiesInput}
                onChangeText={setAllergiesInput}
                placeholder="Ví dụ: Penicillin, Cua biển, Đậu phộng..."
              />

              <CustomInput 
                label="Bệnh nền (cách nhau bằng dấu phẩy)"
                value={chronicInput}
                onChangeText={setChronicInput}
                placeholder="Ví dụ: Cao huyết áp, Tiểu đường Type 2..."
              />

              <Text style={styles.sectionDivider}>Liên hệ Khẩn cấp (Giám hộ chính)</Text>

              <CustomInput 
                label="Tên Người liên hệ"
                value={contactName}
                onChangeText={setContactName}
                placeholder="Ví dụ: Nguyễn Thị B..."
              />

              <CustomInput 
                label="Số Điện Thoại"
                value={contactPhone}
                onChangeText={setContactPhone}
                placeholder="Ví dụ: 0987654321"
                keyboardType="phone-pad"
              />

              <CustomInput 
                label="Mối quan hệ"
                value={contactRelationship}
                onChangeText={setContactRelationship}
                placeholder="Ví dụ: Con gái, Vợ, Mẹ..."
              />

              <View style={styles.modalButtons}>
                <CustomButton 
                  title="Hủy bỏ"
                  onPress={() => setModalVisible(false)}
                  type="outline"
                  style={styles.halfBtn}
                />
                <CustomButton 
                  title="Lưu hồ sơ"
                  onPress={handleAddMember}
                  loading={loading}
                  style={styles.halfBtn}
                />
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePwModalVisible}
        onRequestClose={() => setChangePwModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi Mật Khẩu Tài Khoản</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomInput 
                label="Mật khẩu hiện tại"
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Nhập mật khẩu đang dùng"
                secureTextEntry
              />

              <CustomInput 
                label="Mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Tối thiểu 6 ký tự"
                secureTextEntry
              />

              <CustomInput 
                label="Xác nhận mật khẩu mới"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry
              />

              <View style={styles.modalButtons}>
                <CustomButton 
                  title="Hủy bỏ"
                  onPress={() => setChangePwModalVisible(false)}
                  type="outline"
                  style={styles.halfBtn}
                />
                <CustomButton 
                  title="Cập nhật"
                  onPress={handleChangePasswordSubmit}
                  loading={pwLoading}
                  style={styles.halfBtn}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginBottom: SPACING.md,
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
  // Settings Card UI
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusLg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  settingsTitle: {
    fontSize: FONTS.size.body,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: SPACING.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsRowText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: '600',
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: COLORS.border,
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
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SPACING.borderRadiusLg + 4,
    borderTopRightRadius: SPACING.borderRadiusLg + 4,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: FONTS.size.title,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: SPACING.xs,
    marginTop: SPACING.xs,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  selectorChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SPACING.borderRadiusSm,
    backgroundColor: COLORS.background,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  selectorChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  selectorChipText: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  selectorChipTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  sectionDivider: {
    fontSize: FONTS.size.body + 1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  halfBtn: {
    width: '48%',
  }
});

export default FamilyScreen;
