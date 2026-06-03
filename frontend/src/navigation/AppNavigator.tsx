import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import ROUTES from '../constants/routes';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import MedicationScreen from '../screens/medication/MedicationScreen';
import EmergencyScreen from '../screens/emergency/EmergencyScreen';
import DocumentsScreen from '../screens/documents/DocumentsScreen';
import FamilyScreen from '../screens/family/FamilyScreen';

const Tab = createBottomTabNavigator();

const TabBarIcon = (routeName: string, focused: boolean) => {
  let iconName: any = 'home';
  if (routeName === ROUTES.HOME) {
    iconName = focused ? 'home' : 'home-outline';
  } else if (routeName === ROUTES.MEDICATION) {
    iconName = focused ? 'medkit' : 'medkit-outline';
  } else if (routeName === ROUTES.EMERGENCY) {
    iconName = focused ? 'alert-circle' : 'alert-circle-outline';
  } else if (routeName === ROUTES.DOCUMENTS) {
    iconName = focused ? 'document-text' : 'document-text-outline';
  } else if (routeName === ROUTES.FAMILY) {
    iconName = focused ? 'people' : 'people-outline';
  }

  const iconColor = focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)';

  return (
    <View style={styles.iconContainer}>
      {routeName === ROUTES.EMERGENCY ? (
        <View style={[styles.emergencyIconContainer, focused && styles.emergencyActive]}>
          <Ionicons 
            name={iconName} 
            size={26} 
            color={focused ? COLORS.primary : '#FFFFFF'} 
          />
        </View>
      ) : (
        <>
          <Ionicons name={iconName} size={24} color={iconColor} style={focused && styles.iconActive} />
          {focused && <View style={styles.activeDot} />}
        </>
      )}
    </View>
  );
};

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // Completely hide text labels to match Threads minimalist design and solve screen curvature cuts
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.55)',
        tabBarStyle: {
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
        },
        tabBarIcon: ({ focused }) => TabBarIcon(route.name, focused)
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.MEDICATION} component={MedicationScreen} />
      <Tab.Screen name={ROUTES.EMERGENCY} component={EmergencyScreen} />
      <Tab.Screen name={ROUTES.DOCUMENTS} component={DocumentsScreen} />
      <Tab.Screen name={ROUTES.FAMILY} component={FamilyScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF', // Elegant minimal dot under active tab like Threads
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
  }
});

export default AppNavigator;
