import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../../services/api';

const AuthContext = createContext();

export const LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', flag: '🇮🇳' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳' },
  { code: 'ks', name: 'Kashmiri', native: 'کٲشُر', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇮🇳' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', flag: '🇮🇳' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇮🇳' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', flag: '🇮🇳' },
  { code: 'brx', name: 'Bodo', native: 'बड़ो', flag: '🇮🇳' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্', flag: '🇮🇳' },
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('app_lang') || 'hi');
  const [theme, setTheme] = useState(localStorage.getItem('swasthya_theme') || 'light');
  const [toast, setToast] = useState(null);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [largeText, setLargeText] = useState(localStorage.getItem('swasthya_large_text') === 'true');
  const [highContrast, setHighContrast] = useState(localStorage.getItem('swasthya_high_contrast') === 'true');
  const [voiceReminders, setVoiceReminders] = useState(localStorage.getItem('swasthya_voice_reminders') !== 'false');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('swasthya_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text-mode');
    } else {
      document.documentElement.classList.remove('large-text-mode');
    }
    localStorage.setItem('swasthya_large_text', largeText);
  }, [largeText]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
    localStorage.setItem('swasthya_high_contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('swasthya_voice_reminders', voiceReminders);
  }, [voiceReminders]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    showToast(`Theme changed to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const toggleLargeText = () => {
    const next = !largeText;
    setLargeText(next);
    showToast(next ? 'Large Text Mode Activated 🔍' : 'Standard Text Size Restored', 'info');
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    showToast(next ? 'High Contrast Mode Activated 👁️' : 'Standard Contrast Restored', 'info');
  };

  const toggleVoiceReminders = () => {
    const next = !voiceReminders;
    setVoiceReminders(next);
    showToast(next ? 'Voice Reminders Enabled 🔊' : 'Voice Reminders Disabled 🔇', 'info');
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check Backend Health
  const checkHealth = async () => {
    try {
      const res = await api.healthCheck();
      if (res && (res.status === 'healthy' || res.status === 'ok')) {
        setBackendHealthy(true);
      } else {
        setBackendHealthy(false);
      }
    } catch {
      setBackendHealthy(false);
    }
  };

  // Load profile if token exists
  useEffect(() => {
    checkHealth();

    const handleSessionExpired = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setToken(null);
      setUser(null);
      showToast('Session expired. Please sign in again.', 'error');
    };

    window.addEventListener('auth:session_expired', handleSessionExpired);

    const initAuth = async () => {
      if (token) {
        try {
          const profileData = await api.getProfile();
          if (profileData) {
            profileData.role = profileData.profile?.role || profileData.role || 'patient';
            setUser(profileData);
            if (profileData?.profile?.preferred_language) {
              setCurrentLang(profileData.profile.preferred_language);
              localStorage.setItem('app_lang', profileData.profile.preferred_language);
            }
          }
        } catch (err) {
          // Attempt refresh if token expired
          const refreshTok = localStorage.getItem('refresh_token');
          if (refreshTok) {
            try {
              const res = await api.refreshToken(refreshTok);
              localStorage.setItem('access_token', res.access);
              setToken(res.access);
              const profileData = await api.getProfile();
              if (profileData) {
                profileData.role = profileData.profile?.role || profileData.role || 'patient';
                setUser(profileData);
                if (profileData?.profile?.preferred_language) {
                  setCurrentLang(profileData.profile.preferred_language);
                  localStorage.setItem('app_lang', profileData.profile.preferred_language);
                }
              }
            } catch {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              setToken(null);
              setUser(null);
            }
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    initAuth();

    return () => {
      window.removeEventListener('auth:session_expired', handleSessionExpired);
    };
  }, [token]);

  const refreshProfile = async () => {
    try {
      const profileData = await api.getProfile();
      if (profileData) {
        profileData.role = profileData.profile?.role || profileData.role || 'patient';
        setUser(profileData);
        if (profileData?.profile?.preferred_language) {
          setCurrentLang(profileData.profile.preferred_language);
          localStorage.setItem('app_lang', profileData.profile.preferred_language);
        }
      }
      return profileData;
    } catch (err) {
      return null;
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.login(username, password);
      localStorage.setItem('access_token', res.tokens.access);
      localStorage.setItem('refresh_token', res.tokens.refresh);
      setToken(res.tokens.access);
      let userData = res.user?.profile ? res.user : await refreshProfile();
      if (!userData) {
        userData = res.user;
      }
      if (userData) {
        userData.role = userData.profile?.role || userData.role || 'patient';
      }
      setUser(userData);
      if (userData?.profile?.preferred_language) {
        setCurrentLang(userData.profile.preferred_language);
        localStorage.setItem('app_lang', userData.profile.preferred_language);
      }
      showToast(`Welcome back, ${userData?.first_name || userData?.username}!`, 'success');
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Login failed. Check credentials.', 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      if (res && res.tokens) {
        localStorage.setItem('access_token', res.tokens.access);
        localStorage.setItem('refresh_token', res.tokens.refresh);
        setToken(res.tokens.access);
        const userObj = res.user || {};
        userObj.role = userObj.profile?.role || userObj.role || userData.role || 'patient';
        setUser(userObj);
      }
      setLoading(false);
      showToast(`Account created successfully! Welcome, ${userData.username || 'User'}.`, 'success');
      return res;
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Registration failed.', 'error');
      throw err;
    }
  };

  const loginWithGoogle = async (credential, role = 'patient') => {
    setLoading(true);
    try {
      const res = await api.googleAuth(credential, role, currentLang);
      if (res && res.tokens) {
        localStorage.setItem('access_token', res.tokens.access);
        localStorage.setItem('refresh_token', res.tokens.refresh);
        setToken(res.tokens.access);
        let userData = res.user?.profile ? res.user : await refreshProfile();
        if (!userData) {
          userData = res.user;
        }
        if (userData) {
          userData.role = userData.profile?.role || userData.role || role || 'patient';
        }
        setUser(userData);
        if (userData?.profile?.preferred_language) {
          setCurrentLang(userData.profile.preferred_language);
          localStorage.setItem('app_lang', userData.profile.preferred_language);
        }
        showToast(`Welcome, ${userData?.first_name || userData?.username || 'User'}! 🎉`, 'success');
        setLoading(false);
        return userData;
      }
      throw new Error(res?.message || 'Google Sign-In failed.');
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Google Sign-In failed.', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const updateLanguage = (code) => {
    setCurrentLang(code);
    localStorage.setItem('app_lang', code);
    if (user && token) {
      api.updateProfile({ preferred_language: code }).then(async () => {
        await refreshProfile();
        showToast(`Language updated to ${LANGUAGES.find((l) => l.code === code)?.name}`, 'info');
      }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        currentLang,
        theme,
        toggleTheme,
        largeText,
        highContrast,
        voiceReminders,
        toggleLargeText,
        toggleHighContrast,
        toggleVoiceReminders,
        toast,
        backendHealthy,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshProfile,
        updateLanguage,
        showToast,
        checkHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
