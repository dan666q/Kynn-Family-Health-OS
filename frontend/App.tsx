import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from './src/components/common/Logo';

// Import Screens
import HomeScreen from './src/screens/home/HomeScreen';
import MedicationScreen from './src/screens/medication/MedicationScreen';
import AddMedicationScreen from './src/screens/medication/AddMedicationScreen';
import EmergencyScreen from './src/screens/emergency/EmergencyScreen';
import DocumentsScreen from './src/screens/documents/DocumentsScreen';
import FamilyScreen from './src/screens/family/FamilyScreen';
import TimelineScreen from './src/screens/timeline/TimelineScreen';
import AuthScreen from './src/screens/auth/AuthScreen';

// Import Stores & Config
import COLORS from './src/constants/colors';
import FONTS from './src/constants/fonts';
import SPACING from './src/constants/spacing';
import useAuthStore from './src/store/auth.store';
import useFamilyStore from './src/store/family.store';
import useMedicationStore from './src/store/medication.store';
import useTimelineStore from './src/store/timeline.store';
import useSyncStore from './src/store/sync.store';
import axiosInstance from './src/api/axios';
import CustomButton from './src/components/common/CustomButton';
import socketService from './src/services/socket.service';
import notificationService from './src/services/notification.service';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'home' | 'medication' | 'add_medication' | 'emergency' | 'documents' | 'family' | 'timeline'>('home');

  // Zustand Store States
  const { isAuthenticated, user, checkAuth, logout, token } = useAuthStore();
  const { currentFamily, fetchFamily, fetchMembers, createFamily, joinFamily } = useFamilyStore();
  const { fetchMedications, fetchLogs } = useMedicationStore();
  const { fetchActivities } = useTimelineStore();

  // Local states for Create/Join family form
  const [newFamilyName, setNewFamilyName] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [familyLoading, setFamilyLoading] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const initApp = async () => {
      try {
        await checkAuth();
      } catch (err) {
        console.warn('Initial auth check failed', err);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  // Fetch family and workspaces when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadWorkspaceData = async () => {
        try {
          // Request local notification permissions on app/session load
          await notificationService.requestPermissions().catch(() => {});
          
          await fetchFamily();
          await fetchMembers();
          await fetchMedications();
          await fetchLogs();
          await fetchActivities();
        } catch (err) {
          console.warn('Failed to load family data after auth', err);
        }
      };
      loadWorkspaceData();
    } else {
      socketService.disconnect();
    }
  }, [isAuthenticated, token]);

  // Handle Socket.IO connection based on authentication and family presence
  useEffect(() => {
    if (isAuthenticated && currentFamily) {
      socketService.connect();
    }
    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, currentFamily]);

  // Active connectivity polling and sync queue processor
  const { queue, syncOfflineData, setOnlineStatus } = useSyncStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    let intervalId: any;

    const checkConnectivityAndSync = async () => {
      try {
        // Ping health endpoint to verify active server reachability
        await axiosInstance.get('/health', { timeout: 3000 });
        setOnlineStatus(true);

        if (queue.length > 0) {
          console.log(`[Sync Engine] Online detected. Syncing ${queue.length} items...`);
          await syncOfflineData();
          
          // Re-fetch all data to ensure local cache is updated with fresh database state
          await fetchFamily();
          await fetchMembers();
          await fetchMedications();
          await fetchLogs();
          await fetchActivities();
        }
      } catch (err) {
        setOnlineStatus(false);
        console.log('[Sync Engine] Server unreachable. Operating in Offline-first cached mode.');
      }
    };

    checkConnectivityAndSync();
    intervalId = setInterval(checkConnectivityAndSync, 15000); // Poll every 15s

    return () => clearInterval(intervalId);
  }, [queue.length, isAuthenticated]);



  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên gia đình');
      return;
    }
    setFamilyLoading(true);
    try {
      await createFamily(newFamilyName);
      Alert.alert('Thành công', `Đã tạo nhóm gia đình "${newFamilyName}"!`);
    } catch (err: any) {
      Alert.alert('Lỗi', err.response?.data?.message || 'Không thể tạo nhóm gia đình.');
    } finally {
      setFamilyLoading(false);
    }
  };

  const handleJoinFamily = async () => {
    if (!inviteCodeInput.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã mời');
      return;
    }
    setFamilyLoading(true);
    try {
      await joinFamily(inviteCodeInput.trim().toUpperCase());
      Alert.alert('Thành công', 'Đã tham gia nhóm gia đình thành công!');
    } catch (err: any) {
      Alert.alert('Lỗi', err.response?.data?.message || 'Mã mời không đúng hoặc gia đình không tồn tại.');
    } finally {
      setFamilyLoading(false);
    }
  };

  // Navigation Mocking for fallback compatibility
  const navigationMock = {
    navigate: (routePath: string, options?: any) => {
      if (routePath === 'MedicationTab' || routePath === 'Medication') {
        setCurrentTab('medication');
      } else if (routePath === 'AddMedication') {
        setCurrentTab('add_medication');
      } else if (routePath === 'EmergencyTab' || routePath === 'Emergency') {
        setCurrentTab('emergency');
      } else if (routePath === 'DocumentsTab' || routePath === 'Documents') {
        setCurrentTab('documents');
      } else if (routePath === 'FamilyTab' || routePath === 'Family') {
        setCurrentTab('family');
      } else if (routePath === 'Timeline') {
        setCurrentTab('timeline');
      } else {
        setCurrentTab('home');
      }
    },
    goBack: () => {
      setCurrentTab('home');
    }
  };

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'medication':
        return <MedicationScreen navigation={navigationMock} />;
      case 'add_medication':
        return <AddMedicationScreen navigation={navigationMock} />;
      case 'emergency':
        return <EmergencyScreen />;
      case 'documents':
        return <DocumentsScreen />;
      case 'family':
        return <FamilyScreen />;
      case 'timeline':
        return <TimelineScreen />;
      default:
        return <HomeScreen navigation={navigationMock} />;
    }
  };

  // 1. Render Splash Loading Screen
  if (isLoading) {
    return (
      <SafeAreaProvider style={styles.splashContainer}>
        <StatusBar style="dark" />
        <View style={styles.splashContent}>
          <Logo size={120} variant="white-on-blue" style={styles.splashLogo} />
          <Text style={styles.splashBrand}>Kynn</Text>
          <Text style={styles.splashSubtitle}>Keep Your Next of Kin Near</Text>
          <Text style={styles.splashSlogan}>giữ gia đình luôn kết nối</Text>
          <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
          <Text style={styles.syncText}>Đang khởi tạo Family Health OS...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // 2. Render Auth Screen if not logged in
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthScreen />
      </SafeAreaProvider>
    );
  }

  // 3. Render Create/Join Family screen if logged in but not linked to a family
  if (!currentFamily) {
    return (
      <SafeAreaProvider style={styles.familySelectContainer}>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.familySelectArea}>
          <ScrollView contentContainerStyle={styles.familySelectScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.welcomeBox}>
              <Text style={styles.welcomeText}>Chào {user?.name},</Text>
              <Text style={styles.welcomeSub}>Bạn chưa tham gia bất kỳ nhóm gia đình nào. Hãy tạo mới hoặc nhập mã mời để liên kết với người thân.</Text>
            </View>

            {/* Create Family Option */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tạo Nhóm Gia Đình Mới</Text>
              <Text style={styles.cardDesc}>Tạo nhóm để mời các thành viên khác vào cùng cập nhật tủ thuốc, hồ sơ khẩn cấp.</Text>
              <TextInput
                style={styles.input}
                placeholder="Tên nhóm gia đình (vd: Gia Đình Họ Hoàng)"
                placeholderTextColor={COLORS.textMuted}
                value={newFamilyName}
                onChangeText={setNewFamilyName}
              />
              <CustomButton
                title="Tạo Gia Đình"
                onPress={handleCreateFamily}
                loading={familyLoading}
              />
            </View>

            <Text style={styles.orText}>- HOẶC -</Text>

            {/* Join Family Option */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tham Gia Nhóm Bằng Mã Mời</Text>
              <Text style={styles.cardDesc}>Nhập mã gồm 6 ký tự nhận từ người thân sáng lập nhóm gia đình của bạn.</Text>
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="MÃ MỜI (Ví dụ: D3A7G8)"
                placeholderTextColor={COLORS.textMuted}
                value={inviteCodeInput}
                onChangeText={setInviteCodeInput}
                autoCapitalize="characters"
              />
              <CustomButton
                title="Tham Gia Gia Đình"
                onPress={handleJoinFamily}
                type="secondary"
                loading={familyLoading}
              />
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.emergency} />
              <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // 4. Render Main Dashboard Workspace
  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Screen Render */}
      <View style={styles.mainContent}>
        {renderActiveScreen()}
      </View>

      {/* Threads-style Bottom Tab Navigation Bar */}
      {currentTab !== 'add_medication' && (
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setCurrentTab('home')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={currentTab === 'home' ? 'home' : 'home-outline'} 
              size={24} 
              color={currentTab === 'home' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)'} 
            />
            {currentTab === 'home' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setCurrentTab('medication')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={currentTab === 'medication' ? 'medkit' : 'medkit-outline'} 
              size={24} 
              color={currentTab === 'medication' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)'} 
            />
            {currentTab === 'medication' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setCurrentTab('emergency')}
            activeOpacity={0.8}
          >
            <View style={[styles.emergencyIconContainer, currentTab === 'emergency' && styles.emergencyActive]}>
              <Ionicons 
                name={currentTab === 'emergency' ? 'alert-circle' : 'alert-circle-outline'} 
                size={26} 
                color={currentTab === 'emergency' ? COLORS.primary : '#FFFFFF'} 
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setCurrentTab('documents')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={currentTab === 'documents' ? 'document-text' : 'document-text-outline'} 
              size={24} 
              color={currentTab === 'documents' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)'} 
            />
            {currentTab === 'documents' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setCurrentTab('family')}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={currentTab === 'family' ? 'people' : 'people-outline'} 
              size={24} 
              color={currentTab === 'family' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)'} 
            />
            {currentTab === 'family' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContent: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderTopWidth: 0,
    height: 84,
    paddingBottom: 24,
    paddingTop: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 48,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  emergencyIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  emergencyActive: {
    backgroundColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  splashContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  splashLogo: {
    marginBottom: 20,
  },
  splashBrand: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  splashSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F7FD',
    marginTop: 6,
    textAlign: 'center',
    opacity: 0.95,
  },
  splashSlogan: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  spinner: {
    marginVertical: 48,
  },
  syncText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  familySelectContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  familySelectArea: {
    flex: 1,
  },
  familySelectScroll: {
    padding: SPACING.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  welcomeBox: {
    marginBottom: SPACING.xl,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  welcomeSub: {
    fontSize: FONTS.size.body,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    marginTop: SPACING.xs,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadiusLg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONTS.size.body + 2,
    fontWeight: FONTS.weight.bold,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
  },
  cardDesc: {
    fontSize: FONTS.size.caption + 2,
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    marginTop: 4,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SPACING.borderRadiusSm,
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.size.body,
    color: COLORS.textDark,
    fontFamily: FONTS.family,
    marginBottom: SPACING.md,
  },
  codeInput: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 2,
  },
  orText: {
    textAlign: 'center',
    fontSize: FONTS.size.caption + 1,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    fontFamily: FONTS.family,
    marginVertical: SPACING.sm,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: FONTS.size.body,
    fontWeight: FONTS.weight.bold,
    color: COLORS.emergency,
    marginLeft: SPACING.xs,
    fontFamily: FONTS.family,
  },
});
