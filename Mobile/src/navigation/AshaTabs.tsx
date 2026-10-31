import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Hospital,
  Camera,
  Settings,
} from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { AshaHomeScreen } from '../features/asha/AshaHomeScreen';
import { VillageRegistryScreen } from '../features/asha/VillageRegistryScreen';
import { AshaVisitsScreen } from '../features/asha/AshaVisitsScreen';
import { AshaReferralsScreen } from '../features/asha/AshaReferralsScreen';
import { PrescriptionScannerFlow } from '../features/scanner/PrescriptionScannerFlow';
import { ProfileScreen } from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AshaTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#047857',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 62,
          paddingBottom: 6,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AshaHomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Registry"
        component={VillageRegistryScreen}
        options={{
          tabBarLabel: 'Registry',
          tabBarIcon: ({ color }) => <Users size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Visits"
        component={AshaVisitsScreen}
        options={{
          tabBarLabel: 'Visits',
          tabBarIcon: ({ color }) => <ClipboardList size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Referrals"
        component={AshaReferralsScreen}
        options={{
          tabBarLabel: 'Referrals',
          tabBarIcon: ({ color }) => <Hospital size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={PrescriptionScannerFlow}
        options={{
          tabBarLabel: 'Field Scan',
          tabBarIcon: ({ color }) => <Camera size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Settings size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const AshaStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AshaTabs" component={AshaTabNavigator} />
    </Stack.Navigator>
  );
};
