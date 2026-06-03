import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'emergency' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const getButtonStyles = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryBtn;
      case 'emergency':
        return styles.emergencyBtn;
      case 'outline':
        return styles.outlineBtn;
      default:
        return styles.primaryBtn;
    }
  };

  const getTextStyles = () => {
    switch (type) {
      case 'outline':
        return styles.outlineText;
      default:
        return styles.filledText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyles(), style, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={type === 'outline' ? COLORS.primary : COLORS.surface} size="small" />
      ) : (
        <Text style={[styles.text, getTextStyles()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56, // Large touch target for senior accessibility
    borderRadius: SPACING.borderRadiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
  },
  secondaryBtn: {
    backgroundColor: COLORS.secondary,
  },
  emergencyBtn: {
    backgroundColor: COLORS.emergency,
    height: 64, // Extra large for emergency button
    shadowColor: COLORS.emergency,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    fontSize: FONTS.size.body + 1,
    fontWeight: FONTS.weight.bold,
    fontFamily: FONTS.family,
  },
  filledText: {
    color: COLORS.surface,
  },
  outlineText: {
    color: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
