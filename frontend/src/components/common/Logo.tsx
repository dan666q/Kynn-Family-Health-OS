import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';

interface LogoProps {
  size?: number;
  variant?: 'white-on-blue' | 'blue-on-white' | 'minimal';
  style?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 100, 
  variant = 'blue-on-white', 
  style 
}) => {
  const isWhiteOnBlue = variant === 'white-on-blue';
  const isMinimal = variant === 'minimal';

  // Dynamic sizing calculations
  const badgeSize = size;
  const borderRadius = size * 0.26; // Smooth squircle border radius
  const fontSize = size * 0.42;     // Size of the central K letter

  const getContainerStyle = () => {
    if (isMinimal) {
      return [styles.minimalContainer, { width: badgeSize, height: badgeSize }];
    }
    return [
      styles.container,
      {
        width: badgeSize,
        height: badgeSize,
        borderRadius: borderRadius,
        backgroundColor: isWhiteOnBlue ? 'rgba(255, 255, 255, 0.15)' : '#FFFFFF',
        borderColor: isWhiteOnBlue ? 'rgba(255, 255, 255, 0.25)' : COLORS.border,
        borderWidth: 1.5,
      }
    ];
  };

  const getTextColor = () => {
    if (isWhiteOnBlue) return '#FFFFFF';
    return COLORS.textDark; // Slate-navy for clear premium contrast
  };

  const getHeartColor = () => {
    if (isWhiteOnBlue) return '#FFFFFF';
    return '#FF6B6B'; // Soothing coral-red vector heart
  };

  const getHandColor = () => {
    if (isWhiteOnBlue) return 'rgba(255, 255, 255, 0.75)';
    return COLORS.primary; // Main Sky-Pastel Blue
  };

  // Dimensions for hugging arms
  const handSize = size * 0.72;
  const armBottom = size * 0.1;
  const armSideOffset = size * 0.14;

  return (
    <View style={[getContainerStyle(), style]}>
      {/* 
        The logo is a premium, vector-based corporate brand identity:
        1. Central Letter 'K' representing Kynn (Keep Your Next of Kin Near).
        2. Clean Vector Heart lồng ghép vào nét xiên của chữ K biểu thị tình yêu thương & y tế.
        3. Hai cánh tay ôm nhau cách điệu (Hugging Hands/Caring Arms) tạo thành từ các nét cong 
           vector tròn xoay đối xứng bảo bọc toàn bộ logo, biểu trưng cho gia đình kết nối bền chặt.
      */}
      <View style={styles.logoWrapper}>
        {/* Hugging hands / Protective arms */}
        {!isMinimal && (
          <>
            {/* Left curved arm */}
            <View style={[
              styles.huggingArm,
              {
                width: handSize,
                height: handSize,
                borderRadius: handSize / 2,
                borderColor: 'transparent',
                borderBottomColor: getHandColor(),
                borderLeftColor: getHandColor(),
                borderWidth: Math.max(2, size * 0.03),
                bottom: armBottom,
                left: armSideOffset,
                transform: [{ rotate: '-35deg' }]
              }
            ]} />
            
            {/* Right curved arm */}
            <View style={[
              styles.huggingArm,
              {
                width: handSize,
                height: handSize,
                borderRadius: handSize / 2,
                borderColor: 'transparent',
                borderBottomColor: getHandColor(),
                borderRightColor: getHandColor(),
                borderWidth: Math.max(2, size * 0.03),
                bottom: armBottom,
                right: armSideOffset,
                transform: [{ rotate: '35deg' }]
              }
            ]} />
          </>
        )}

        {/* Central K & Heart Emblem */}
        <View style={styles.kLetterRow}>
          <Text style={[styles.kText, { fontSize, color: getTextColor() }]}>K</Text>
          
          {/* Vector heart nested in the diagonal branch of the letter K */}
          <View style={[
            styles.heartWrapper, 
            { 
              top: size * 0.12, 
              left: size * 0.35,
              transform: [{ rotate: '12deg' }]
            }
          ]}>
            <Ionicons name="heart" size={size * 0.28} color={getHeartColor()} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  minimalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  huggingArm: {
    position: 'absolute',
    opacity: 0.85,
  },
  kLetterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  kText: {
    fontWeight: '900',
    fontFamily: FONTS.family,
    textAlign: 'center',
    marginRight: 4,
  },
  heartWrapper: {
    position: 'absolute',
  }
});

export default Logo;

