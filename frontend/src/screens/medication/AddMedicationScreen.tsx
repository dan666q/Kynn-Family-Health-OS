import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { useMedicationStore } from '../../store/medication.store';
import { useFamilyStore } from '../../store/family.store';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import axiosInstance from '../../api/axios';

export const AddMedicationScreen = ({ navigation }: any) => {
  const { addMedication } = useMedicationStore();
  const { members } = useFamilyStore();

  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  
  // Voice Instruction state
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | undefined>(undefined);
  const [recordTimer, setRecordTimer] = useState<any>(null);

  const handleStartRecord = async () => {
    try {
      if (isRecording) {
        // STOP RECORDING
        setIsRecording(false);
        clearInterval(recordTimer);
        
        if (recording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          setRecording(null);
          
          if (uri) {
            const formData = new FormData();
            formData.append('audio', {
              uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
              type: 'audio/m4a',
              name: `voice-${Date.now()}.m4a`,
            } as any);
            formData.append('duration', voiceDuration.toString());

            try {
              const res = await axiosInstance.post('/voice/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              if (res.data && res.data.status === 'success') {
                setRecordedVoiceUrl(res.data.data.url);
                Alert.alert('Thành công', `Đã lưu hướng dẫn thoại dài ${voiceDuration} giây.`);
              } else {
                throw new Error('Upload failed');
              }
            } catch (uploadErr) {
              console.log('Upload failed, saving local URI for offline use', uploadErr);
              setRecordedVoiceUrl(uri);
              Alert.alert('Ngoại tuyến', `Đã lưu hướng dẫn thoại cục bộ (${voiceDuration} giây) do mất kết nối.`);
            }
          }
        }
      } else {
        // START RECORDING
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status !== 'granted') {
          Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền truy cập Micro để ghi âm.');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await newRecording.startAsync();

        setRecording(newRecording);
        setIsRecording(true);
        setVoiceDuration(0);

        const timer = setInterval(() => {
          setVoiceDuration((prev) => prev + 1);
        }, 1000);
        setRecordTimer(timer);
      }
    } catch (err) {
      console.error('Recording error', err);
      Alert.alert('Lỗi', 'Không thể ghi âm hoặc khởi động micro.');
      setIsRecording(false);
      if (recordTimer) clearInterval(recordTimer);
    }
  };


  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên thuốc.');
      return;
    }
    if (!dosage.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập liều lượng thuốc.');
      return;
    }

    addMedication({
      memberId: selectedMemberId,
      name,
      dosage,
      frequency: 'daily',
      schedule: [scheduleTime],
      notes: notes.trim() ? notes : undefined,
      active: true,
      voiceNoteUrl: recordedVoiceUrl,
      voiceDuration: recordedVoiceUrl ? voiceDuration : undefined,
    });

    Alert.alert('Thành công', 'Đã thêm thuốc mới vào lịch trình chăm sóc gia đình.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <View style={styles.backBtnContent}>
              <Ionicons name="arrow-back" size={20} color={COLORS.primary} style={styles.backIcon} />
              <Text style={styles.backBtnText}>Quay lại</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Thêm Thuốc Mới</Text>
        </View>

        {/* Member Selector */}
        <Text style={styles.sectionLabel}>Người uống thuốc</Text>
        <View style={styles.memberSelectorRow}>
          {members.map(member => (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.memberChip,
                selectedMemberId === member.id && styles.memberChipSelected
              ]}
              onPress={() => setSelectedMemberId(member.id)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="person-outline" 
                size={16} 
                color={selectedMemberId === member.id ? COLORS.primary : COLORS.textDark} 
                style={styles.chipIcon}
              />
              <Text style={[
                styles.memberChipText,
                selectedMemberId === member.id && styles.memberChipTextSelected
              ]}>
                {member.fullName.split(' ')[2] || member.role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inputs */}
        <CustomInput 
          label="Tên thuốc"
          value={name}
          onChangeText={setName}
          placeholder="Ví dụ: Metformin 500mg, Panadol..."
        />

        <CustomInput 
          label="Liều lượng dùng"
          value={dosage}
          onChangeText={setDosage}
          placeholder="Ví dụ: 1 viên, 2 nhát xịt..."
        />

        {/* Time slot pickers (Mocked as options for simplicity) */}
        <Text style={styles.sectionLabel}>Giờ uống thuốc</Text>
        <View style={styles.timeSelectorRow}>
          {['08:00', '12:00', '16:00', '20:00', 'Khi khò khè / Khó thở'].map(time => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeChip,
                scheduleTime === time && styles.timeChipSelected
              ]}
              onPress={() => setScheduleTime(time)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.timeChipText,
                scheduleTime === time && styles.timeChipTextSelected
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <CustomInput 
          label="Lưu ý (Ghi chú y tế)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Ví dụ: Uống ngay sau ăn no, uống nhiều nước..."
          multiline
          numberOfLines={3}
        />

        {/* Voice Instructions Section (Voice-first Elder feature) */}
        <View style={styles.voiceSection}>
          <Text style={styles.sectionLabel}>Hướng dẫn bằng giọng nói (Voice Notes)</Text>
          <Text style={styles.voiceDescription}>
            Ghi âm lại giọng nói của bạn để hướng dẫn người thân lớn tuổi cách uống thuốc chính xác khi bạn vắng nhà.
          </Text>

          <TouchableOpacity 
            style={[styles.recordButton, isRecording && styles.recordButtonActive]} 
            onPress={handleStartRecord}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isRecording ? 'stop-circle' : 'mic'} 
              size={20} 
              color={isRecording ? COLORS.emergency : COLORS.primary} 
              style={styles.recordIcon}
            />
            <Text style={[styles.recordBtnLabel, isRecording && styles.recordBtnLabelActive]}>
              {isRecording ? `Đang ghi âm... ${voiceDuration}s` : 'Bắt đầu ghi âm hướng dẫn'}
            </Text>
          </TouchableOpacity>

          {recordedVoiceUrl && (
            <View style={styles.recordedBanner}>
              <Ionicons name="volume-high" size={18} color={COLORS.secondary} style={styles.bannerIcon} />
              <Text style={styles.recordedText}>Đã ghi âm hướng dẫn thành công ({voiceDuration} giây)</Text>
            </View>
          )}
        </View>

        <CustomButton 
          title="Lưu lịch uống thuốc"
          onPress={handleSave}
          style={styles.saveBtn}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  backBtn: {
    marginRight: SPACING.md,
  },
  backBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 4,
  },
  backBtnText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.primary,
  },
  title: {
    fontSize: FONTS.size.title,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
  },
  sectionLabel: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  memberSelectorRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusLg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: SPACING.xs,
  },
  memberChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  chipIcon: {
    marginRight: 6,
  },
  memberChipText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textDark,
  },
  memberChipTextSelected: {
    color: COLORS.primary,
  },
  timeSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
  },
  timeChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusLg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 6,
    marginBottom: 6,
  },
  timeChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  timeChipText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textDark,
  },
  timeChipTextSelected: {
    color: COLORS.primary,
  },
  voiceSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: SPACING.borderRadiusLg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  voiceDescription: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: SPACING.borderRadiusMd,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
  },
  recordButtonActive: {
    borderColor: COLORS.emergency,
    backgroundColor: COLORS.emergencyLight,
    borderStyle: 'solid',
  },
  recordIcon: {
    marginRight: 8,
  },
  recordBtnLabel: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primary,
  },
  recordBtnLabelActive: {
    color: COLORS.emergency,
  },
  recordedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    backgroundColor: COLORS.secondaryLight,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  bannerIcon: {
    marginRight: 8,
  },
  recordedText: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.secondary,
    fontWeight: FONTS.weight.bold,
  },
  saveBtn: {
    marginTop: SPACING.sm,
  }
});

export default AddMedicationScreen;
