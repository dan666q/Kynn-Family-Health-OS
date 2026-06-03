import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from './src/components/common/Logo';

// Import Screens (Fallback navigation for sandbox environments)
import HomeScreen from './src/screens/home/HomeScreen';
import MedicationScreen from './src/screens/medication/MedicationScreen';
import AddMedicationScreen from './src/screens/medication/AddMedicationScreen';
import EmergencyScreen from './src/screens/emergency/EmergencyScreen';
import DocumentsScreen from './src/screens/documents/DocumentsScreen';
import FamilyScreen from './src/screens/family/FamilyScreen';
import TimelineScreen from './src/screens/timeline/TimelineScreen';

import COLORS from './src/constants/colors';
import FONTS from './src/constants/fonts';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  // We use a robust tab switcher state directly in the root to ensure immediate
  // runnability in any Expo sandbox without crashing on missing native navigation bindings.
  const [currentTab, setCurrentTab] = useState<'home' | 'medication' | 'add_medication' | 'emergency' | 'documents' | 'family' | 'timeline'>('home');

  useEffect(() => {
    // Simulate premium offline database sync & loading experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Custom Navigation stack implementation
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

  // Render Splash Loading Screen
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
          
          <Text style={styles.syncText}>Đang đồng bộ dữ liệu chăm sóc sức khỏe...</Text>
          <Text style={styles.offlineNotice}>Chế độ offline đã sẵn sàng</Text>

          <Text style={styles.versionTag}>ver 0.1 by @dan666q</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Screen Render */}
      <View style={styles.mainContent}>
        {renderActiveScreen()}
      </View>

      {/* Threads-style Minimalist Bottom Tab Navigation Bar */}
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
    backgroundColor: COLORS.primary, // Solid premium sky-pastel blue theme color!
    borderTopWidth: 0, // Borderless for a modern seamless design
    height: 84, // iPhone 14 Pro Max screen curvature clearance
    paddingBottom: 24, // Safe Area home indicator clearance
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
    backgroundColor: '#FFFFFF', // High-contrast clean white dot like Threads
    marginTop: 6,
  },
  emergencyIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
  },
  emergencyActive: {
    backgroundColor: '#FFFFFF', // Clean high-contrast white active circle
    transform: [{ scale: 1.05 }],
  },
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.primary, // Gorgeous healthcare pastel blue background
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
    color: '#FFFFFF', // High-contrast crisp white brand text
    letterSpacing: 1.5,
  },
  splashSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F7FD', // Soft white-blue text
    marginTop: 6,
    textAlign: 'center',
    opacity: 0.95,
  },
  splashSlogan: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // White translucent badge
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
  offlineNotice: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Highly clean white pill
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden',
  },
  versionTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 36,
    fontFamily: FONTS.family,
    opacity: 0.75,
  }
});
