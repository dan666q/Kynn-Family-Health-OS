import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Modal } from 'react-native';
import COLORS from '../../constants/colors';
import FONTS from '../../constants/fonts';
import SPACING from '../../constants/spacing';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import Logo from '../../components/common/Logo';
import useAuthStore from '../../store/auth.store';
import authApi from '../../api/auth.api';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotInviteCode, setForgotInviteCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Form errors
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const { login, register } = useAuthStore();

  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNameError('');

    if (!username.trim()) {
      setUsernameError('Tên đăng nhập không được để trống');
      isValid = false;
    } else if (username.trim().length < 3) {
      setUsernameError('Tên đăng nhập phải dài ít nhất 3 ký tự');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Mật khẩu không được để trống');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải dài ít nhất 6 ký tự');
      isValid = false;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setNameError('Họ tên không được để trống');
        isValid = false;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError('Mật khẩu xác nhận không khớp');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password, name.trim());
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      const errMsg = err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.';
      Alert.alert('Lỗi xác thực', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotUsername.trim() || !forgotInviteCode.trim() || !forgotNewPassword || !forgotConfirmPassword) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường thông tin.');
      return;
    }

    if (forgotNewPassword.length < 6) {
      Alert.alert('Lỗi mật khẩu', 'Mật khẩu mới phải dài ít nhất 6 ký tự.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      Alert.alert('Lỗi mật khẩu', 'Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await authApi.forgotPassword(
        forgotUsername.trim(),
        forgotInviteCode.trim(),
        forgotNewPassword
      );
      
      if (res.status === 'success') {
        Alert.alert('Thành công', 'Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay.');
        setForgotModalVisible(false);
        // Reset inputs
        setForgotUsername('');
        setForgotInviteCode('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Mã mời gia đình hoặc tên đăng nhập không chính xác.';
      Alert.alert('Lỗi khôi phục', errMsg);
    } finally {
      setForgotLoading(false);
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
              placeholder="Ví dụ: Nguyễn Văn A"
              error={nameError}
            />
          )}

          <CustomInput
            label="Tên đăng nhập (Username)"
            value={username}
            onChangeText={setUsername}
            placeholder="Ví dụ: ba_son, me_lan..."
            autoCapitalize="none"
            error={usernameError}
          />

          <CustomInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            secureTextEntry
            error={passwordError}
          />

          {!isLogin && (
            <CustomInput
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••"
              secureTextEntry
              error={confirmPasswordError}
            />
          )}

          {isLogin && (
            <TouchableOpacity 
              style={styles.forgotBtn} 
              onPress={() => setForgotModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          )}

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

      {/* FORGOT PASSWORD MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={forgotModalVisible}
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Khôi Phục Mật Khẩu (Cục bộ)</Text>
            <Text style={styles.modalDescription}>
              Nhập tên đăng nhập của bạn và mã mời của gia đình bạn để đặt lại mật khẩu mới.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomInput
                label="Tên đăng nhập (Username)"
                value={forgotUsername}
                onChangeText={setForgotUsername}
                placeholder="Ví dụ: ba_son, me_lan..."
                autoCapitalize="none"
              />

              <CustomInput
                label="Mã mời gia đình của bạn"
                value={forgotInviteCode}
                onChangeText={setForgotInviteCode}
                placeholder="Ví dụ: KYNN99"
                autoCapitalize="characters"
              />

              <CustomInput
                label="Mật khẩu mới"
                value={forgotNewPassword}
                onChangeText={setForgotNewPassword}
                placeholder="Tối thiểu 6 ký tự"
                secureTextEntry
              />

              <CustomInput
                label="Xác nhận mật khẩu mới"
                value={forgotConfirmPassword}
                onChangeText={setForgotConfirmPassword}
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry
              />

              <View style={styles.modalButtons}>
                <CustomButton
                  title="Hủy bỏ"
                  onPress={() => setForgotModalVisible(false)}
                  type="outline"
                  style={styles.halfBtn}
                />
                <CustomButton
                  title="Đặt lại mật khẩu"
                  onPress={handleForgotPasswordSubmit}
                  loading={forgotLoading}
                  style={styles.halfBtn}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.sm,
  },
  forgotText: {
    fontSize: FONTS.size.caption + 1,
    color: COLORS.textMuted,
    fontWeight: '600',
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
  // Modal layout
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
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: FONTS.size.body - 1,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 20,
    paddingHorizontal: SPACING.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    paddingBottom: 20,
  },
  halfBtn: {
    width: '48%',
  }
});

export default AuthScreen;
