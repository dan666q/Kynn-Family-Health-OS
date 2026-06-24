import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { useFamilyStore } from '../../store/family.store';
import EmergencyCard from '../../components/cards/EmergencyCard';
import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';

export const EmergencyScreen = () => {
  const { members, updateMember } = useFamilyStore();
  
  const grandpaMember = members.find(m => m.role === 'Ông') || members[0];
  const [selectedMemberId, setSelectedMemberId] = useState(grandpaMember?.id || '');

  const activeMember = members.find(m => m.id === selectedMemberId) || grandpaMember;

  // Edit states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [bloodType, setBloodType] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [chronicInput, setChronicInput] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelationship, setContactRelationship] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenEditModal = () => {
    if (!activeMember) {
      Alert.alert('Thông báo', 'Không tìm thấy thành viên để chỉnh sửa.');
      return;
    }
    setBloodType(activeMember.bloodType || 'Không rõ');
    setAllergiesInput(activeMember.allergies ? activeMember.allergies.join(', ') : '');
    setChronicInput(activeMember.chronicDiseases ? activeMember.chronicDiseases.join(', ') : '');
    setContactName(activeMember.emergencyContact?.name || '');
    setContactPhone(activeMember.emergencyContact?.phone || '');
    setContactRelationship(activeMember.emergencyContact?.relationship || '');
    setEditModalVisible(true);
  };

  const handleSaveEmergencyInfo = async () => {
    if (!activeMember) return;
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

      await updateMember(activeMember.id || (activeMember as any)._id, {
        bloodType: bloodType as any,
        allergies,
        chronicDiseases,
        emergencyContact: {
          name: contactName.trim(),
          phone: contactPhone.trim(),
          relationship: contactRelationship.trim(),
        },
      });

      Alert.alert('Thành công', `Đã cập nhật thông tin y tế khẩn cấp cho ${activeMember.fullName}.`);
      setEditModalVisible(false);
    } catch (err: any) {
      Alert.alert('Lỗi', err.response?.data?.message || err.message || 'Không thể cập nhật thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Thẻ Cấp Cứu" 
        subtitle="Thông tin y tế khẩn cấp, hoạt động mượt mà offline"
        rightAction={activeMember ? {
          icon: 'create-outline',
          onPress: handleOpenEditModal
        } : undefined}
      />

      {/* Profile Swapper tabs for emergency details */}
      <View style={styles.tabBar}>
        {members.map(m => (
          <TouchableOpacity
            key={m.id || (m as any)._id}
            style={[
              styles.tabItem,
              selectedMemberId === m.id && styles.tabItemActive
            ]}
            onPress={() => setSelectedMemberId(m.id)}
            activeOpacity={0.8}
          >
            <View style={styles.tabContent}>
              <Ionicons 
                name="person-outline" 
                size={16} 
                color={selectedMemberId === m.id ? COLORS.emergency : COLORS.textMuted} 
                style={styles.tabIcon}
              />
              <Text style={[
                styles.tabText,
                selectedMemberId === m.id && styles.tabTextActive
              ]}>
                {m.fullName.split(' ')[2] || m.role}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.offlineNotice}>
          <Ionicons name="cloud-offline-outline" size={16} color={COLORS.secondary} style={styles.offlineIcon} />
          <Text style={styles.offlineNoticeText}>Đã lưu cache offline thiết bị để truy cập tức thì</Text>
        </View>

        {activeMember ? (
          <EmergencyCard member={activeMember} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Chưa có thông tin y tế khẩn cấp nào.</Text>
          </View>
        )}

        <View style={styles.instructionsBox}>
          <View style={styles.instructionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.textDark} style={styles.infoIcon} />
            <Text style={styles.instructionTitle}>Hướng dẫn Khẩn cấp</Text>
          </View>
          <Text style={styles.instructionBody}>
            1. Khi xảy ra sự cố khẩn cấp, đưa màn hình này cho nhân viên y tế xem ngay.{'\n'}
            2. Nút <Text style={styles.boldText}>CALL</Text> sẽ gọi điện trực tiếp cho người liên hệ giám hộ chính.{'\n'}
            3. Dữ liệu bệnh nền và dị ứng luôn được cập nhật bởi gia đình.
          </Text>
        </View>
      </ScrollView>

      {/* Edit Emergency Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập Nhật Thông Tin Y Tế</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              
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
                placeholder="Ví dụ: Penicillin, Cua biển..."
              />

              <CustomInput 
                label="Bệnh nền (cách nhau bằng dấu phẩy)"
                value={chronicInput}
                onChangeText={setChronicInput}
                placeholder="Ví dụ: Cao huyết áp, Hen phế quản..."
              />

              <Text style={styles.sectionDivider}>Người liên hệ Khẩn cấp (Giám hộ)</Text>

              <CustomInput 
                label="Họ và Tên"
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
                label="Quan hệ"
                value={contactRelationship}
                onChangeText={setContactRelationship}
                placeholder="Ví dụ: Con gái, Vợ..."
              />

              <View style={styles.modalButtons}>
                <CustomButton 
                  title="Hủy bỏ"
                  onPress={() => setEditModalVisible(false)}
                  type="outline"
                  style={styles.halfBtn}
                />
                <CustomButton 
                  title="Lưu thay đổi"
                  onPress={handleSaveEmergencyInfo}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.emergency,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  tabTextActive: {
    color: COLORS.emergency,
    fontWeight: FONTS.weight.bold,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryLight,
    borderRadius: SPACING.borderRadiusSm,
    paddingVertical: 10,
    marginBottom: SPACING.md,
  },
  offlineIcon: {
    marginRight: 6,
  },
  offlineNoticeText: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.secondary,
    fontWeight: FONTS.weight.bold,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.size.body,
    color: COLORS.textMuted,
  },
  instructionsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusMd,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  infoIcon: {
    marginRight: 6,
  },
  instructionTitle: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
  },
  instructionBody: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textMuted,
    lineHeight: 22,
    fontFamily: FONTS.family,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.emergency,
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

export default EmergencyScreen;
