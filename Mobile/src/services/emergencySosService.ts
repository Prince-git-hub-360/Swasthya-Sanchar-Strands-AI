import { Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { SafeStorage } from './safeStorage';
import { apiClient } from '../api/client';

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export const DEFAULT_EMERGENCY_CONTACT: EmergencyContact = {
  name: 'Ramesh Kumar (Son / बेटा)',
  phone: '9008802105',
  relationship: 'Son',
};

const EMERGENCY_CONTACT_STORAGE_KEY = '@swasthya_emergency_contact';
const ACTIVE_SOS_STORAGE_KEY = '@swasthya_active_sos_alert';

export class EmergencySosService {
  /**
   * Fetch currently saved emergency family contact or return default
   */
  static async getEmergencyContact(): Promise<EmergencyContact> {
    try {
      const stored = await SafeStorage.getItem(EMERGENCY_CONTACT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.phone) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[EmergencySosService] Failed to load emergency contact:', e);
    }
    return DEFAULT_EMERGENCY_CONTACT;
  }

  /**
   * Save or update the emergency family contact
   */
  static async saveEmergencyContact(contact: EmergencyContact): Promise<void> {
    try {
      await SafeStorage.setItem(EMERGENCY_CONTACT_STORAGE_KEY, JSON.stringify(contact));
    } catch (e) {
      console.error('[EmergencySosService] Failed to save emergency contact:', e);
    }
  }

  /**
   * Acquire high-precision or balanced GPS coordinates with timeout fallback
   */
  static async getLiveLocation(): Promise<{ latitude: number; longitude: number }> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Promise.race([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500)),
        ]);
        if (location && (location as any).coords) {
          return {
            latitude: (location as any).coords.latitude,
            longitude: (location as any).coords.longitude,
          };
        }
      }
    } catch (e) {
      console.warn('[EmergencySosService] Location fetch error, using default coordinates:', e);
    }
    // Reliable fallback for Rampur Gram, Varanasi Primary Health sector
    return { latitude: 25.3176, longitude: 82.9739 };
  }

  /**
   * Generate vernacular distress message containing live Google Maps pin
   */
  static generateDistressMessage(params: {
    patientName: string;
    village: string;
    latitude: number;
    longitude: number;
  }): string {
    const mapsLink = `https://maps.google.com/?q=${params.latitude.toFixed(4)},${params.longitude.toFixed(4)}`;
    return `🚨 EMERGENCY MEDICAL SOS! 🚨
रोगी: ${params.patientName}
गाँव/पता: ${params.village}
तत्काल सहायता की आवश्यकता है! (URGENT MEDICAL HELP NEEDED)

📍 लाइव जीपीएस लोकेशन (Live GPS):
${mapsLink}

भेजा गया: स्वास्थ्य संचार ग्रामीण स्वास्थ्य नेटवर्क (Swasthya Sanchar)`;
  }

  /**
   * Trigger native SMS on device prefilled to family contact
   */
  static async sendNativeSms(phone: string, text: string): Promise<boolean> {
    const cleanNumber = phone.replace(/[^0-9+]/g, '');
    const encodedBody = encodeURIComponent(text);
    const smsUrl = Platform.OS === 'ios'
      ? `sms:${cleanNumber}&body=${encodedBody}`
      : `sms:${cleanNumber}?body=${encodedBody}`;

    try {
      const canOpen = await Linking.canOpenURL(smsUrl);
      if (canOpen) {
        await Linking.openURL(smsUrl);
        return true;
      }
      // Direct open attempt
      await Linking.openURL(smsUrl);
      return true;
    } catch (err) {
      console.warn('[EmergencySosService] Native SMS open failed:', err);
      // Fallback: simple sms url
      try {
        await Linking.openURL(`sms:${cleanNumber}`);
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  /**
   * Trigger WhatsApp message prefilled to family contact with live location
   */
  static async sendWhatsApp(phone: string, text: string): Promise<boolean> {
    let cleanNumber = phone.replace(/[^0-9]/g, '');
    // Ensure India country code 91 if 10-digit number
    if (cleanNumber.length === 10) {
      cleanNumber = '91' + cleanNumber;
    }

    const encodedBody = encodeURIComponent(text);
    const appUrl = `whatsapp://send?phone=${cleanNumber}&text=${encodedBody}`;
    const webUrl = `https://wa.me/${cleanNumber}?text=${encodedBody}`;

    try {
      const canOpen = await Linking.canOpenURL(appUrl);
      if (canOpen) {
        await Linking.openURL(appUrl);
        return true;
      }
      await Linking.openURL(webUrl);
      return true;
    } catch {
      try {
        await Linking.openURL(webUrl);
        return true;
      } catch (e) {
        console.warn('[EmergencySosService] WhatsApp open failed:', e);
        return false;
      }
    }
  }

  /**
   * Direct phone call to family member
   */
  static async callFamily(phone: string): Promise<void> {
    const cleanNumber = phone.replace(/[^0-9+]/g, '');
    try {
      await Linking.openURL(`tel:${cleanNumber}`);
    } catch (e) {
      console.warn('[EmergencySosService] Phone dial error:', e);
    }
  }

  /**
   * Direct phone call to 108 National Ambulance Helpline
   */
  static async call108Ambulance(): Promise<void> {
    try {
      await Linking.openURL('tel:108');
    } catch (e) {
      console.warn('[EmergencySosService] Dial 108 error:', e);
    }
  }

  /**
   * Synchronize emergency session with backend and local Caregiver Portal
   */
  static async broadcastToBackendAndCaregiver(params: {
    patientName: string;
    village: string;
    latitude: number;
    longitude: number;
  }): Promise<{ success: boolean; token?: string }> {
    try {
      // 1. Mark active alert in local storage for instant Caregiver Portal reflection
      await SafeStorage.setItem(
        ACTIVE_SOS_STORAGE_KEY,
        JSON.stringify({
          active: true,
          patientName: params.patientName,
          village: params.village,
          latitude: params.latitude,
          longitude: params.longitude,
          timestamp: new Date().toISOString(),
        })
      );

      // 2. Post to Backend emergency start endpoint
      const response = await apiClient.post('/medical/emergency/start/', {
        latitude: params.latitude,
        longitude: params.longitude,
        accuracy: 15,
        emergency_type: 'Severe Medical Distress',
        address: params.village,
      });

      const token = response.data?.token;

      // 3. Notify trusted contacts in backend
      if (token) {
        apiClient.post('/medical/emergency/notify-contacts/', { token }).catch(() => {});
      }

      return { success: true, token };
    } catch (err) {
      console.warn('[EmergencySosService] Backend emergency sync error:', err);
      return { success: false };
    }
  }

  /**
   * Check if there is an active SOS distress beacon (for Caregiver banner)
   */
  static async getActiveSosAlert(): Promise<any | null> {
    try {
      const stored = await SafeStorage.getItem(ACTIVE_SOS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.active) {
          return parsed;
        }
      }
    } catch (e) {}
    return null;
  }

  /**
   * Dismiss active SOS beacon
   */
  static async clearActiveSosAlert(): Promise<void> {
    try {
      await SafeStorage.removeItem(ACTIVE_SOS_STORAGE_KEY);
    } catch (e) {}
  }
}
