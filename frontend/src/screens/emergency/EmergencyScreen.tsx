import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { useFamilyStore } from '../../store/family.store';
import EmergencyCard from '../../components/cards/EmergencyCard';
import Header from '../../components/common/Header';

export const EmergencyScreen = () => {
  const { members } = useFamilyStore();
  
  const grandpaMember = members.find(m => m.role === 'Ông') || members[0];
  const [selectedMemberId, setSelectedMemberId] = useState(grandpaMember?.id || '');

  const activeMember = members.find(m => m.id === selectedMemberId) || grandpaMember;

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Thẻ Cấp Cứu" 
        subtitle="Thông tin y tế khẩn cấp, hoạt động mượt mà offline"
      />

      {/* Profile Swapper tabs for emergency details */}
      <View style={styles.tabBar}>
        {members.map(m => (
          <TouchableOpacity
            key={m.id}
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
  }
});

export default EmergencyScreen;
