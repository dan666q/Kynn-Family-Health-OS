import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import Logo from '../../components/common/Logo';
import useAuthStore from '../../store/auth.store';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Form errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const { login, register } = useAuthStore();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setNameError('');

    if (!email) {
      setEmailError('Email không được để trống');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Định dạng email không hợp lệ');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Mật khẩu không được để trống');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải dài ít nhất 6 ký tự');
      isValid = false;
    }

    if (!isLogin && !name) {
      setNameError('Họ tên không được để trống');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      const errMsg = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng kiểm tra lại kết nối mạng.';
      Alert.alert('Lỗi xác thực', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Logo size={100} variant="white-on-blue" style={styles.logo} />
          <Text style={styles.brandName}>Kynn</Text>
          <Text style={styles.slogan}>Calm Family Caregiving OS</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Đăng nhập tài khoản' : 'Đăng ký tài khoản'}
          </Text>

          {!isLogin && (
            <CustomInput
              label="Họ và tên"
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ tên của bạn"
              error={nameError}
            />
          )}

          <CustomInput
            label="Địa chỉ Email"
            value={email}
            onChangeText={setEmail}
            placeholder="example@kynn.vn"
            keyboardType="email-address"
            error={emailError}
          />

          <CustomInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            secureTextEntry
            error={passwordError}
          />

          <CustomButton
            title={isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitBtn}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>
              {isLogin ? 'Chưa có tài khoản gia đình?' : 'Đã có tài khoản trước đó?'}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchLink}>
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    marginBottom: SPACING.sm,
  },
  brandName: {
    fontSize: 32,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primary,
    fontFamily: FONTS.family,
    letterSpacing: 1,
  },
  slogan: {
    fontSize: FONTS.size.body,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusLg,
    padding: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  formTitle: {
    fontSize: FONTS.size.title - 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  switchText: {
    fontSize: FONTS.size.caption + 2,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    marginRight: 6,
  },
  switchLink: {
    fontSize: FONTS.size.caption + 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primary,
    fontFamily: FONTS.family,
  },
});

export default AuthScreen;
