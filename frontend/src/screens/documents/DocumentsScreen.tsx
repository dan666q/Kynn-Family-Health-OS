import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { useTimelineStore } from '../../store/timeline.store';
import { useFamilyStore } from '../../store/family.store';
import DocumentCard from '../../components/cards/DocumentCard';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';
import Header from '../../components/common/Header';

const PRESET_DOCS = [
  {
    id: 'preset-presc',
    label: 'Toa Thuốc Mẫu',
    fileName: 'Toa thuốc Tim mạch BV Bạch Mai',
    type: 'toa_thuoc',
    fileUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
  },
  {
    id: 'preset-lab',
    label: 'Xét Nghiệm Mẫu',
    fileName: 'Xét nghiệm máu & HbA1c định kỳ',
    type: 'xet_nghiem',
    fileUrl: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600',
  },
  {
    id: 'preset-bhyt',
    label: 'Thẻ BHYT Mẫu',
    fileName: 'Thẻ BHYT Hộ gia đình',
    type: 'bhyt',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
  }
];

export const DocumentsScreen = () => {
  const { documents, addDocument, deleteDocument, fetchDocuments } = useTimelineStore();
  const { members } = useFamilyStore();
  
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [docType, setDocType] = useState<string>('toa_thuoc');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('preset-presc');
  const [expiryDate, setExpiryDate] = useState('');

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Set default member
  useEffect(() => {
    if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0].id);
    }
  }, [members]);

  const handleSelectPreset = (preset: typeof PRESET_DOCS[0]) => {
    setSelectedPresetId(preset.id);
    setFileName(preset.fileName);
    setDocType(preset.type);
  };

  const handleUploadSimulate = async () => {
    if (!fileName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên tài liệu.');
      return;
    }
    if (!selectedMemberId) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn thành viên sở hữu.');
      return;
    }

    const preset = PRESET_DOCS.find(p => p.id === selectedPresetId) || PRESET_DOCS[0];

    try {
      await addDocument({
        memberId: selectedMemberId,
        type: docType,
        fileName: fileName.trim(),
        notes: notes.trim(),
        expiryDate: expiryDate.trim() ? expiryDate : undefined,
        localUri: preset.fileUrl
      });

      setFileName('');
      setNotes('');
      setExpiryDate('');
      setModalVisible(false);
      
      Alert.alert('Thành công', 'Đã tải hồ sơ y tế lên và chia sẻ tới gia đình.');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể thêm tài liệu.');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa tài liệu "${name}" không?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
          try {
            await deleteDocument(id);
          } catch (err) {
            Alert.alert('Lỗi', 'Không thể xóa tài liệu.');
          }
        } 
      }
    ]);
  };

  const filteredDocs = selectedType === 'all'
    ? documents
    : documents.filter(doc => doc.type === selectedType);

  const getTabIcon = (tabId: string, isActive: boolean) => {
    const iconColor = isActive ? '#FFFFFF' : COLORS.textDark;
    switch (tabId) {
      case 'prescription':
        return <Ionicons name="medkit-outline" size={16} color={iconColor} style={styles.tabIcon} />;
      case 'lab_result':
        return <Ionicons name="analytics-outline" size={16} color={iconColor} style={styles.tabIcon} />;
      case 'insurance':
        return <Ionicons name="card-outline" size={16} color={iconColor} style={styles.tabIcon} />;
      default:
        return <Ionicons name="grid-outline" size={16} color={iconColor} style={styles.tabIcon} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Hồ Sơ Y Tế" 
        subtitle="Lưu trữ BHYT, CCCD, Toa thuốc & Xét nghiệm"
        rightAction={{
          icon: 'cloud-upload-outline',
          onPress: () => {
            // Reset modal state with default preset
            const defaultPreset = PRESET_DOCS[0];
            setSelectedPresetId(defaultPreset.id);
            setFileName(defaultPreset.fileName);
            setDocType(defaultPreset.type);
            setModalVisible(true);
          }
        }}
      />

      {/* Categories Horizontal Scroll */}
      <View style={styles.tabSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'prescription', label: 'Toa thuốc' },
            { id: 'lab_result', label: 'Xét nghiệm' },
            { id: 'insurance', label: 'Bảo hiểm/CCCD' }
          ].map(tab => {
            const isActive = selectedType === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabChip,
                  isActive && styles.tabChipActive
                ]}
                onPress={() => setSelectedType(tab.id)}
                activeOpacity={0.7}
              >
                <View style={styles.tabChipContent}>
                  {getTabIcon(tab.id, isActive)}
                  <Text style={[
                    styles.tabChipText,
                    isActive && styles.tabChipTextActive
                  ]}>
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredDocs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={60} color={COLORS.textMuted} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Thư mục trống</Text>
            <Text style={styles.emptySubtitle}>Chưa có tài liệu nào thuộc danh mục này.</Text>
          </View>
        ) : (
          filteredDocs.map(doc => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              onDelete={() => handleDelete(doc.id, doc.fileName)}
              onPress={() => Alert.alert('Chi tiết Tài Liệu', `Tên: ${doc.fileName}\nNgười tải: ${doc.uploadedBy}\nGhi chú: ${doc.notes || 'Không có'}${doc.expiryDate ? `\nHạn dùng: ${doc.expiryDate}` : ''}`)}
            />
          ))
        )}
      </ScrollView>

      {/* Simulation Upload Dialog Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tải Lên Hồ Sơ Y Khoa</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              
              {/* Member Target */}
              <Text style={styles.label}>Hồ sơ này của ai?</Text>
              <View style={styles.memberSelector}>
                {members.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberChip,
                      selectedMemberId === member.id && styles.memberChipActive
                    ]}
                    onPress={() => setSelectedMemberId(member.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.memberChipText,
                      selectedMemberId === member.id && styles.memberChipTextActive
                    ]}>{member.fullName}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Preset Document Pickers */}
              <Text style={styles.label}>Chọn tài liệu để tải lên</Text>
              <View style={styles.presetSelector}>
                {PRESET_DOCS.map(preset => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[
                        styles.presetCard,
                        isSelected && styles.presetCardActive
                      ]}
                      onPress={() => handleSelectPreset(preset)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: preset.fileUrl }} style={styles.presetThumbnail} />
                      <Text style={[
                        styles.presetText,
                        isSelected && styles.presetTextActive
                      ]} numberOfLines={1}>{preset.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Document Type Selector */}
              <Text style={styles.label}>Phân loại hệ thống</Text>
              <View style={styles.typeSelector}>
                {[
                  { id: 'toa_thuoc', label: 'Toa thuốc' },
                  { id: 'xet_nghiem', label: 'Xét nghiệm' },
                  { id: 'bhyt', label: 'BHYT/CCCD' }
                ].map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeChip,
                      docType === type.id && styles.typeChipActive
                    ]}
                    onPress={() => setDocType(type.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.typeChipText,
                      docType === type.id && styles.typeChipTextActive
                    ]}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <CustomInput 
                label="Tên tài liệu/Hồ sơ"
                value={fileName}
                onChangeText={setFileName}
                placeholder="Ví dụ: Đơn thuốc định kỳ tim mạch..."
              />

              <CustomInput 
                label="Thời hạn sử dụng / Hết hạn (nếu có)"
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="Ví dụ: 2026-12-31"
              />

              <CustomInput 
                label="Ghi chú thêm"
                value={notes}
                onChangeText={setNotes}
                placeholder="Ví dụ: Uống giảm liều tối, khám lại sau 1 tháng..."
                multiline
                numberOfLines={2}
              />

              <View style={styles.modalButtons}>
                <CustomButton 
                  title="Hủy bỏ"
                  onPress={() => setModalVisible(false)}
                  type="outline"
                  style={styles.halfBtn}
                />
                <CustomButton 
                  title="Tải lên"
                  onPress={handleUploadSimulate}
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
  tabSection: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabScroll: {
    paddingHorizontal: SPACING.md,
  },
  tabChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: SPACING.xs,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  tabChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabChipText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  tabChipTextActive: {
    color: COLORS.surface,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
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
    fontFamily: FONTS.family,
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
  presetSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  presetCard: {
    width: '31%',
    backgroundColor: COLORS.background,
    borderRadius: SPACING.borderRadiusSm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 6,
    alignItems: 'center',
  },
  presetCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  presetThumbnail: {
    width: '100%',
    height: 60,
    borderRadius: 4,
    marginBottom: 4,
  },
  presetText: {
    fontSize: 10,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  presetTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: SPACING.borderRadiusSm,
    backgroundColor: COLORS.background,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  typeChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  typeChipText: {
    fontSize: FONTS.size.body - 1,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textDark,
  },
  typeChipTextActive: {
    color: COLORS.primary,
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

export default DocumentsScreen;
