import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import { MedicalDocument } from '../../types/timeline.types';

interface DocumentCardProps {
  document: MedicalDocument;
  onPress?: () => void;
  onDelete?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onPress, onDelete }) => {
  const getDocTypeInfo = (type: string) => {
    switch (type) {
      case 'prescription':
        return { label: 'Toa thuốc', color: '#1E88E5', bg: '#E3F2FD' };
      case 'lab_result':
        return { label: 'Xét nghiệm', color: '#43A047', bg: '#E8F5E9' };
      case 'insurance':
        return { label: 'Bảo hiểm', color: '#FB8C00', bg: '#FFF3E0' };
      case 'id_card':
        return { label: 'Căn cước/Khai sinh', color: '#6D4C41', bg: '#EFEBE9' };
      default:
        return { label: 'Tài liệu khác', color: '#757575', bg: '#F5F5F5' };
    }
  };

  const getFileUri = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://')) {
      return url;
    }
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `http://192.168.2.4:5000${cleanPath}`;
  };

  const typeInfo = getDocTypeInfo(document.type);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: getFileUri(document.fileUrl) }} style={styles.thumbnail} />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg, marginRight: 8 }]}>
              <Text style={[styles.typeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
            </View>
            {document.isOfflinePending && (
              <View style={styles.offlineBadge}>
                <Ionicons name="cloud-offline-outline" size={12} color="#D32F2F" style={{ marginRight: 3 }} />
                <Text style={styles.offlineText}>Chờ đồng bộ</Text>
              </View>
            )}
          </View>
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
              <Ionicons name="close-outline" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.fileName} numberOfLines={2}>{document.fileName}</Text>
        
        {document.notes && (
          <Text style={styles.notes} numberOfLines={2}>{document.notes}</Text>
        )}

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} style={styles.dateIcon} />
          <Text style={styles.dateText}>Tải lên: {new Date(document.createdAt).toLocaleDateString('vi-VN')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusLg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 100,
    borderRadius: SPACING.borderRadiusSm,
    marginRight: SPACING.md,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: FONTS.size.caption,
    fontWeight: FONTS.weight.bold,
    fontFamily: FONTS.family,
  },
  deleteBtn: {
    padding: 4,
  },
  fileName: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: 4,
  },
  notes: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: FONTS.size.caption,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  offlineText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D32F2F',
  }
});

export default DocumentCard;
