import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          multiline && styles.textArea,
          error ? styles.borderError : styles.borderNormal
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.semibold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: SPACING.xs,
  },
  input: {
    height: 54,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusSm,
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.size.body,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  textArea: {
    height: 100,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  borderNormal: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  borderError: {
    borderWidth: 1.5,
    borderColor: COLORS.emergency,
  },
  errorText: {
    fontSize: FONTS.size.caption,
    color: COLORS.emergency,
    marginTop: 4,
    fontFamily: FONTS.family,
  },
});

export default CustomInput;
