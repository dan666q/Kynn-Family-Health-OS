import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Share, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { useFamilyStore } from '../../store/family.store';
import MemberCard from '../../components/cards/MemberCard';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';
import Header from '../../components/common/Header';

export const FamilyScreen = () => {
  const { currentFamily, members, addMember } = useFamilyStore();

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

        <Text style={styles.sectionTitle}>Thành viên ({members.length})</Text>

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
                placeholder="Ví dụ: Hoàng Văn Nội..."
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
                placeholder="Ví dụ: Lê Hoàng Lan"
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

