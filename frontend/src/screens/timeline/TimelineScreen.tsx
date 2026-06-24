import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { useTimelineStore } from '../../store/timeline.store';
import { useAppointmentStore } from '../../store/appointment.store';
import { useFamilyStore } from '../../store/family.store';
import TimelineItem from '../../components/cards/TimelineItem';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';

const PREDEFINED_SYMPTOMS = ['Sốt', 'Ho', 'Đau đầu', 'Đau họng', 'Khó thở', 'Mệt mỏi', 'Đau bụng', 'Buồn nôn'];

export const TimelineScreen = () => {
  const { activities, fetchActivities, addSymptomLog } = useTimelineStore();
  const { appointments, fetchAppointments, addAppointment, deleteAppointment } = useAppointmentStore();
  const { members } = useFamilyStore();

  const [appointmentsCollapsed, setAppointmentsCollapsed] = useState(false);
  
  // Modals visibility
  const [symptomModalVisible, setSymptomModalVisible] = useState(false);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);

  // Symptom Form State
  const [selectedSymptomMemberId, setSelectedSymptomMemberId] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [temperature, setTemperature] = useState('');
  const [symptomNotes, setSymptomNotes] = useState('');

  // Appointment Form State
  const [selectedAppMemberId, setSelectedAppMemberId] = useState('');
  const [hospital, setHospital] = useState('');
  const [doctor, setDoctor] = useState('');
  const [appDate, setAppDate] = useState(''); // input format e.g. YYYY-MM-DD HH:MM
  const [appNotes, setAppNotes] = useState('');

  // Initial Fetching
  useEffect(() => {
    fetchActivities();
    fetchAppointments();
  }, []);

  // Sync member selections
  useEffect(() => {
    if (members.length > 0) {
      if (!selectedSymptomMemberId) setSelectedSymptomMemberId(members[0].id);
      if (!selectedAppMemberId) setSelectedAppMemberId(members[0].id);
    }
  }, [members]);

  // Handle symptoms selection
  const toggleSymptomSelect = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Submit Symptom Log
  const handleLogSymptomSubmit = async () => {
    if (!selectedSymptomMemberId) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn thành viên.');
      return;
    }
    if (selectedSymptoms.length === 0 && !symptomNotes.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn triệu chứng hoặc nhập ghi chú mô tả.');
      return;
    }

    try {
      const parsedTemp = temperature.trim() ? parseFloat(temperature) : undefined;
      
      await addSymptomLog({
        memberId: selectedSymptomMemberId,
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : [symptomNotes.trim()],
        temperature: parsedTemp,
        notes: symptomNotes.trim()
      });

      // Reset
      setSelectedSymptoms([]);
      setTemperature('');
      setSymptomNotes('');
      setSymptomModalVisible(false);

      Alert.alert('Thành công', 'Đã lưu trữ nhật ký triệu chứng sức khỏe.');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể ghi nhận triệu chứng.');
    }
  };

  // Submit Appointment
  const handleAppointmentSubmit = async () => {
    if (!selectedAppMemberId || !hospital.trim() || !appDate.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn thành viên, bệnh viện và thời gian.');
      return;
    }

    // Basic date parsing validation (expects YYYY-MM-DD HH:MM or ISO format)
    const dateParsed = new Date(appDate);
    if (isNaN(dateParsed.getTime())) {
      Alert.alert('Sai định dạng', 'Định dạng ngày hẹn khám không hợp lệ. Ví dụ đúng: 2026-06-25T09:00:00Z hoặc 2026-06-25 09:00');
      return;
    }

    try {
      await addAppointment({
        memberId: selectedAppMemberId,
        hospital: hospital.trim(),
        doctor: doctor.trim(),
        appointmentDate: dateParsed.toISOString(),
        notes: appNotes.trim()
      });

      // Reset
      setHospital('');
      setDoctor('');
      setAppDate('');
      setAppNotes('');
      setAppointmentModalVisible(false);

      Alert.alert('Thành công', 'Đã thêm lịch hẹn tái khám.');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tạo lịch hẹn khám.');
    }
  };

  // Handle appointment deletion
  const handleDeleteAppointment = (id: string, hospitalName: string) => {
    Alert.alert('Hủy lịch hẹn', `Bạn có chắc muốn hủy lịch hẹn khám tại ${hospitalName}?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xác nhận', style: 'destructive', onPress: () => deleteAppointment(id) }
    ]);
  };

  const getMemberName = (id: string) => {
    const member = members.find(m => m.id === id);
    return member ? member.fullName : 'Thành viên';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Nhật Ký Realtime" 
        subtitle="Theo dõi phối hợp chăm sóc gia đình trực tuyến"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Appointments Section */}
        <View style={styles.appointmentCard}>
          <TouchableOpacity 
            style={styles.appointmentHeader} 
            onPress={() => setAppointmentsCollapsed(!appointmentsCollapsed)}
            activeOpacity={0.8}
          >
            <View style={styles.appointmentHeaderLeft}>
              <Ionicons name="calendar-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.appointmentTitle}>Lịch Hẹn Khám Sắp Tới</Text>
              {appointments.length > 0 && (
                <View style={styles.appointmentBadge}>
                  <Text style={styles.appointmentBadgeText}>{appointments.length}</Text>
                </View>
              )}
            </View>
            <Ionicons 
              name={appointmentsCollapsed ? 'chevron-down-outline' : 'chevron-up-outline'} 
              size={20} 
              color={COLORS.textMuted} 
            />
          </TouchableOpacity>

          {!appointmentsCollapsed && (
            <View style={styles.appointmentBody}>
              {appointments.length === 0 ? (
                <Text style={styles.noAppointmentsText}>Chưa có lịch hẹn khám nào.</Text>
              ) : (
                appointments.map(app => {
                  const dateObj = new Date(app.appointmentDate);
                  const formattedDate = dateObj.toLocaleDateString('vi-VN') + ' ' + dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                  const mName = app.memberId?.fullName || getMemberName(app.memberId);

                  return (
                    <View key={app.id} style={[styles.appointmentItem, app.isOfflinePending && styles.offlinePendingApp]}>
                      <View style={styles.appLeft}>
                        <Text style={styles.appMember}>{mName}</Text>
                        <Text style={styles.appDetails}>{app.hospital} {app.doctor ? `- Bác sĩ: ${app.doctor}` : ''}</Text>
                        <Text style={styles.appDate}>{formattedDate}</Text>
                        {app.notes ? <Text style={styles.appNotes}>Ghi chú: {app.notes}</Text> : null}
                      </View>
                      <TouchableOpacity 
                        style={styles.appDeleteBtn}
                        onPress={() => handleDeleteAppointment(app.id, app.hospital)}
                      >
                        <Ionicons name="trash-outline" size={18} color={COLORS.missed} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#FCE4EC', borderColor: '#F8BBD0' }]}
            onPress={() => {
              // Set current date placeholder
              const defaultDate = new Date();
              defaultDate.setDate(defaultDate.getDate() + 1); // tomorrow as default
              defaultDate.setHours(9, 0, 0, 0); // 09:00
              const strDate = defaultDate.toISOString().replace('T', ' ').substring(0, 16);
              setAppDate(strDate);
              setAppointmentModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={24} color="#D81B60" style={{ marginBottom: 6 }} />
            <Text style={[styles.actionBtnText, { color: '#C2185B' }]}>Lên Lịch Khám</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#E0F2F1', borderColor: '#B2DFDB' }]}
            onPress={() => setSymptomModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="thermometer" size={24} color="#00897B" style={{ marginBottom: 6 }} />
            <Text style={[styles.actionBtnText, { color: '#00695C' }]}>Ghi Triệu Chứng</Text>
          </TouchableOpacity>
        </View>

        {/* Timeline Activities Feed */}
        <View style={styles.timelineLabelRow}>
          <Text style={styles.timelineLabel}>Hoạt động hôm nay</Text>
          <View style={styles.realtimePulse}>
            <View style={styles.pulseDot} />
            <Text style={styles.pulseText}>Realtime</Text>
          </View>
        </View>

        {activities.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Chưa có hoạt động chăm sóc nào.</Text>
          </View>
        ) : (
          <View style={styles.timelineContainer}>
            {activities.map((act, index) => (
              <TimelineItem 
                key={act.id} 
                activity={act} 
                isLast={index === activities.length - 1} 
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* MODAL: GHI NHẬN TRIỆU CHỨNG */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={symptomModalVisible}
        onRequestClose={() => setSymptomModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhật Ký Triệu Chứng Sức Khỏe</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              <Text style={styles.label}>Nhật ký cho thành viên nào?</Text>
              <View style={styles.memberSelector}>
                {members.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberChip,
                      selectedSymptomMemberId === member.id && styles.memberChipActive
                    ]}
                    onPress={() => setSelectedSymptomMemberId(member.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.memberChipText,
                      selectedSymptomMemberId === member.id && styles.memberChipTextActive
                    ]}>{member.fullName}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Các triệu chứng biểu hiện (Chọn nhanh)</Text>
              <View style={styles.symptomsGrid}>
                {PREDEFINED_SYMPTOMS.map(symptom => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <TouchableOpacity
                      key={symptom}
                      style={[
                        styles.symptomChip,
                        isSelected && styles.symptomChipActive
                      ]}
                      onPress={() => toggleSymptomSelect(symptom)}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.symptomChipText,
                        isSelected && styles.symptomChipTextActive
                      ]}>{symptom}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <CustomInput 
                label="Đo thân nhiệt (°C) - Nếu có"
                value={temperature}
                onChangeText={setTemperature}
                placeholder="Ví dụ: 37.8, 38.5..."
                keyboardType="numeric"
              />

              <CustomInput 
                label="Chi tiết triệu chứng / Ghi chú bổ sung"
                value={symptomNotes}
                onChangeText={setSymptomNotes}
                placeholder="Ví dụ: Bắt đầu ho nhiều từ chiều, tức ngực nhẹ..."
                multiline
                numberOfLines={2}
              />

              <View style={styles.modalButtons}>
                <CustomButton 
                  title="Hủy bỏ"
                  onPress={() => setSymptomModalVisible(false)}
                  type="outline"
                  style={styles.halfBtn}
                />
                <CustomButton 
                  title="Ghi nhận"
                  onPress={handleLogSymptomSubmit}
                  style={styles.halfBtn}
                />
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: LÊN LỊCH KHÁM */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={appointmentModalVisible}
        onRequestClose={() => setAppointmentModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lên Lịch Hẹn Khám Bệnh</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              <Text style={styles.label}>Đặt lịch khám cho ai?</Text>
              <View style={styles.memberSelector}>
                {members.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberChip,
                      selectedAppMemberId === member.id && styles.memberChipActive
                    ]}
                    onPress={() => setSelectedAppMemberId(member.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.memberChipText,
                      selectedAppMemberId === member.id && styles.memberChipTextActive
                    ]}>{member.fullName}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <CustomInput 
                label="Bệnh viện / Phòng khám"
                value={hospital}
                onChangeText={setHospital}
                placeholder="Ví dụ: Bệnh viện Bạch Mai, Tâm Anh..."
              />

              <CustomInput 
                label="Bác sĩ khám (Nếu có)"
                value={doctor}
                onChangeText={setDoctor}
                placeholder="Ví dụ: ThS. BS Nguyễn Văn A..."
              />

              <CustomInput 
                label="Ngày giờ hẹn khám (Định dạng: YYYY-MM-DD HH:MM)"
                value={appDate}
                onChangeText={setAppDate}
                placeholder="Ví dụ: 2026-06-25 09:00"
              />

              <CustomInput 
                label="Ghi chú lịch tái khám"
                value={appNotes}
                onChangeText={setAppNotes}
                placeholder="Ví dụ: Mang theo đơn thuốc cũ & xét nghiệm máu gần nhất..."
                multiline
                numberOfLines={2}
              />

              <View style={styles.modalButtons}>
                <CustomButton 
                  title="Hủy bỏ"
                  onPress={() => setAppointmentModalVisible(false)}
                  type="outline"
                  style={styles.halfBtn}
                />
                <CustomButton 
                  title="Lưu lịch hẹn"
                  onPress={handleAppointmentSubmit}
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
  appointmentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusLg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight + '22',
  },
  appointmentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTitle: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  appointmentBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  appointmentBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  appointmentBody: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  noAppointmentsText: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: SPACING.sm,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  offlinePendingApp: {
    backgroundColor: '#FFEBEE',
    borderRadius: SPACING.borderRadiusSm,
    paddingHorizontal: 4,
  },
  appLeft: {
    flex: 1,
  },
  appMember: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  appDetails: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.textDark,
    marginTop: 2,
  },
  appDate: {
    fontSize: FONTS.size.caption,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  appNotes: {
    fontSize: FONTS.size.caption,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  appDeleteBtn: {
    padding: 6,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  actionBtn: {
    flex: 1,
    borderRadius: SPACING.borderRadiusLg,
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionBtnText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: 'bold',
    fontFamily: FONTS.family,
  },
  timelineLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  timelineLabel: {
    fontSize: FONTS.size.title - 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  realtimePulse: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginRight: 6,
  },
  pulseText: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.secondary,
    fontWeight: FONTS.weight.bold,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: SPACING.borderRadiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  emptyText: {
    fontSize: FONTS.size.body,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  timelineContainer: {
    paddingLeft: 4,
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
  },
  memberSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  memberChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: SPACING.borderRadiusSm,
    backgroundColor: COLORS.background,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  memberChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  memberChipText: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  memberChipTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  symptomChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  symptomChipActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondaryLight,
  },
  symptomChipText: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  symptomChipTextActive: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    paddingBottom: 20
  },
  halfBtn: {
    width: '48%',
  }
});

export default TimelineScreen;
