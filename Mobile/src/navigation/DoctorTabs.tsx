import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Stethoscope,
  Hospital,
  Camera,
  Settings,
} from 'lucide-react-native';
import { DoctorHomeScreen } from '../features/doctor/DoctorHomeScreen';
import { AshaReferralsScreen } from '../features/asha/AshaReferralsScreen';
import { PrescriptionScannerFlow } from '../features/scanner/PrescriptionScannerFlow';
import { ProfileScreen } from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DoctorTabNavigator: React.FC = () => {
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
        name="OPDQueue"
        component={DoctorHomeScreen}
        options={{
          tabBarLabel: 'OPD Queue',
          tabBarIcon: ({ color }) => <Stethoscope size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="AshaReferrals"
        component={AshaReferralsScreen}
        options={{
          tabBarLabel: 'ASHA Hub',
          tabBarIcon: ({ color }) => <Hospital size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="FieldScan"
        component={PrescriptionScannerFlow}
        options={{
          tabBarLabel: 'OCR Scanner',
          tabBarIcon: ({ color }) => <Camera size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="DoctorProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Settings size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const DoctorStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorTabs" component={DoctorTabNavigator} />
    </Stack.Navigator>
  );
};
