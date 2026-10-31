import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface AppSafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Universal hook providing guaranteed safe area insets across all Android devices
 * (notches, punch-hole cameras, curved screens, Xiaomi/Samsung/Pixel) and iOS devices (Dynamic Island).
 */
export const useAppSafeArea = (): AppSafeAreaInsets => {
  const insets = useSafeAreaInsets();

  // Modern Android notch/punch-hole cameras (Xiaomi, Samsung, Pixel, OnePlus) need at least 36dp clearance
  const androidStatusBarHeight = StatusBar.currentHeight || 0;
  const androidTop = Math.max(insets.top || 0, androidStatusBarHeight, 36);

  // iOS notch / Dynamic Island provides insets.top (44-59dp); non-notch devices have 20dp
  const iosTop = insets.top > 0 ? insets.top : 24;

  const top = Platform.OS === 'android' ? androidTop : iosTop;
  const bottom = Math.max(insets.bottom || 0, Platform.OS === 'ios' ? 20 : 12);

  return {
    top,
    bottom,
    left: insets.left || 0,
    right: insets.right || 0,
  };
};
