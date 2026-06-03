import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import ROUTES from '../../constants/routes';
import { useMedicationStore } from '../../store/medication.store';
import { useFamilyStore } from '../../store/family.store';
import MedicationCard from '../../components/cards/MedicationCard';
import Header from '../../components/common/Header';

export const MedicationScreen = ({ navigation }: any) => {
  const { medications, logs, toggleTaken } = useMedicationStore();
  const { members } = useFamilyStore();
  
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  const getTodayDateString = () => new Date().toISOString().split('T')[0];
  const todayStr = getTodayDateString();

  const handleToggleMed = (medicationId: string, slot: string) => {
    toggleTaken(medicationId, slot, 'Lê Hoàng Lan (Con gái)');
  };

  const filteredMeds = selectedMemberId
    ? medications.filter(m => m.memberId === selectedMemberId && m.active)
    : medications.filter(m => m.active);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Tủ Thuốc Gia Đình" 
        subtitle="Quản lý lịch trình & hướng dẫn giọng nói"
        rightAction={{
          icon: 'add',
          onPress: () => navigation.navigate(ROUTES.ADD_MEDICATION)
        }}
      />
      
      {/* Horizontal filter chips of family members */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.chip, selectedMemberId === '' && styles.chipActive]}
            onPress={() => setSelectedMemberId('')}
            activeOpacity={0.7}
          >
            <View style={styles.chipContent}>
              <Ionicons 
                name="grid-outline" 
                size={16} 
                color={selectedMemberId === '' ? '#FFFFFF' : COLORS.textDark} 
                style={styles.chipIcon}
              />
              <Text style={[styles.chipText, selectedMemberId === '' && styles.chipTextActive]}>Tất cả</Text>
            </View>
          </TouchableOpacity>
          {members.map(member => (
            <TouchableOpacity 
              key={member.id}
              style={[styles.chip, selectedMemberId === member.id && styles.chipActive]}
              onPress={() => setSelectedMemberId(member.id)}
              activeOpacity={0.7}
            >
              <View style={styles.chipContent}>
                <Ionicons 
                  name="person-outline" 
                  size={16} 
                  color={selectedMemberId === member.id ? '#FFFFFF' : COLORS.textDark} 
                  style={styles.chipIcon}
                />
                <Text style={[styles.chipText, selectedMemberId === member.id && styles.chipTextActive]}>
                  {member.fullName.split(' ')[2] || member.role}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredMeds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medkit-outline" size={64} color={COLORS.textMuted} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Chưa có thuốc nào</Text>
            <Text style={styles.emptySubtitle}>Bấm nút cộng phía trên góc phải để thêm thuốc mới cho gia đình.</Text>
          </View>
        ) : (
          filteredMeds.map(med => {
            const member = members.find(m => m.id === med.memberId);
            return (
              <View key={med.id} style={styles.medCardGroup}>
                <View style={styles.memberTagHeader}>
                  <Ionicons name="person-outline" size={16} color={COLORS.textDark} style={styles.tagIcon} />
                  <Text style={styles.memberTagText}>
                    Thuốc của: {member ? member.fullName : 'Thành viên'}
                  </Text>
                </View>
                {med.schedule.map((slot, index) => {
                  const isTaken = logs.some(
                    l => l.medicationId === med.id && 
                         l.takenAt.startsWith(todayStr) && 
                         (slot === 'Khi khò khè / Khó thở' || new Date(l.takenAt).getUTCHours() === parseInt(slot.split(':')[0]))
                  );
                  const log = logs.find(
                    l => l.medicationId === med.id && 
                         l.takenAt.startsWith(todayStr) && 
                         (slot === 'Khi khò khè / Khó thở' || new Date(l.takenAt).getUTCHours() === parseInt(slot.split(':')[0]))
                  );
                  return (
                    <MedicationCard 
                      key={`${med.id}-${slot}-${index}`}
                      medication={med}
                      isTaken={isTaken}
                      timeSlot={slot}
                      onToggle={() => handleToggleMed(med.id, slot)}
                      checkedBy={log?.checkedBy}
                    />
                  );
                })}
              </View>
            );
          })
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
  filterSection: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterScroll: {
    paddingHorizontal: SPACING.md,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: SPACING.xs,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  chipTextActive: {
    color: COLORS.surface,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.size.title,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: FONTS.size.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    fontFamily: FONTS.family,
    lineHeight: 22,
  },
  medCardGroup: {
    marginBottom: SPACING.lg,
  },
  memberTagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    paddingLeft: 4,
  },
  tagIcon: {
    marginRight: 6,
  },
  memberTagText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  }
});

export default MedicationScreen;
