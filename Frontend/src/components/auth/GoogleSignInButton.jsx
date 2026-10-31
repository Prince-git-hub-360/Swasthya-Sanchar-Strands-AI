import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import { getRoleDefaultRoute, navigateTo } from '../../utils/routes';

export const GoogleSignInButton = ({ role = 'patient', onSuccess, text = 'continue_with' }) => {
  const { loginWithGoogle, theme, showToast } = useAuth();
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '194215168561-qmr5tm1n8dud53po23jab6et2ptp1c0p.apps.googleusercontent.com';

  // Handle Google Token Response
  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      showToast('No credential returned from Google.', 'error');
      return;
    }

    setLoading(true);
    try {
      const userData = await loginWithGoogle(response.credential, role);
      const userRole = userData?.role || role;
      const targetRoute = getRoleDefaultRoute(userRole);
      if (onSuccess) {
        onSuccess(targetRoute, userData);
      } else {
        navigateTo(targetRoute);
      }
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Google GSI Script if not present
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.warn('Google GSI script could not be loaded (offline or ad-blocker).');
    };
    document.body.appendChild(script);
  }, []);

  // Initialize and Render Google Button
  useEffect(() => {
    if (!scriptLoaded || !window.google?.accounts?.id || !buttonRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Clear previous button content to avoid duplicate renders
      buttonRef.current.innerHTML = '';

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: theme === 'dark' ? 'filled_black' : 'outline',
        size: 'large',
        type: 'standard',
        text: text, // 'signin_with', 'signup_with', or 'continue_with'
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 320,
      });
    } catch (err) {
      console.error('Error rendering Google button:', err);
    }
  }, [scriptLoaded, role, theme, text]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-3">
      {loading ? (
        <div className="flex items-center gap-2 py-2.5 px-6 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs font-semibold text-stone-600 dark:text-slate-300">
          <svg className="animate-spin h-4 w-4 text-[#0F766E]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Signing in with Google...
        </div>
      ) : (
        <div
          ref={buttonRef}
          className="min-h-[44px] flex items-center justify-center transition-opacity hover:opacity-95"
        />
      )}
    </div>
  );
};

export default GoogleSignInButton;

