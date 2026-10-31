import React, { useState, useEffect, useRef } from 'react';
import { HospitalIcon, MenuIcon, CloseIcon, UserIcon, ArrowRightIcon, ChevronDownIcon, SparklesIcon } from '../../shared/icons/Icons';
import { ROUTES, navigateTo } from '../../utils/routes';
import { useAuth } from '../../shared/context/AuthContext';
import SwasthyaLogo from '../branding/SwasthyaLogo';

export const PublicNavbar = ({ onNavigate, onOpenChat }) => {
  const { theme, toggleTheme } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [solutionsMobileOpen, setSolutionsMobileOpen] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSolutionsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    const sectionIds = [
      'home', 'problem', 'solutions', 'how-it-works', 'prescription-demo',
      'difference', 'ai-technology', 'care-chain', 'safety', 'testimonials', 'faq', 'about'
    ];

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNav = (targetPath, sectionId) => {
    setMobileMenuOpen(false);
    setSolutionsDropdownOpen(false);
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
        return;
      }
    }

    if (onNavigate) {
      onNavigate(targetPath, sectionId);
    } else {
      navigateTo(targetPath);
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const solutionItems = [
    { label: 'For Patients', sectionId: 'care-chain', icon: '👤', desc: 'Prescriptions, Audio & Reminders' },
    { label: 'For ASHA Workers', sectionId: 'care-chain', icon: '👩‍⚕️', desc: 'Village Patient Registry & Visits' },
    { label: 'For Doctors', sectionId: 'care-chain', icon: '🩺', desc: 'Digital Consultations & Records' },
  ];

  const isSolutionsActive = ['solutions', 'care-chain'].includes(activeSection);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_8px_24px_-16px_rgba(20,40,43,0.35)] py-2'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 py-2.5'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LEFT: Brand Logo */}
        <div 
          className="flex items-center cursor-pointer group shrink-0" 
          onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'home')}
        >
          <div className="hidden sm:block">
            <SwasthyaLogo variant={theme === 'dark' ? 'dark' : 'full'} height={42} />
          </div>
          <div className="sm:hidden">
            <SwasthyaLogo variant={theme === 'dark' ? 'dark' : 'full'} height={32} />
          </div>
        </div>

        {/* CENTER: Compact Startup Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'home')}
            className={`transition-all cursor-pointer py-1 ${
              activeSection === 'home'
                ? 'text-[#0F766E] dark:text-teal-300 font-bold border-b-2 border-[#0F766E] dark:border-teal-400'
                : 'hover:text-[#0F766E] dark:hover:text-teal-300'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'how-it-works')}
            className={`transition-all cursor-pointer py-1 ${
              activeSection === 'how-it-works'
                ? 'text-[#0F766E] dark:text-teal-300 font-bold border-b-2 border-[#0F766E] dark:border-teal-400'
                : 'hover:text-[#0F766E] dark:hover:text-teal-300'
            }`}
          >
            How It Works
          </button>

          {/* Solutions Dropdown Trigger */}
          <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setSolutionsDropdownOpen(true)}
            onMouseLeave={() => setSolutionsDropdownOpen(false)}
          >
            <button
              onClick={() => {
                setSolutionsDropdownOpen(!solutionsDropdownOpen);
                handleNav(ROUTES.PUBLIC.HOME, 'solutions');
              }}
              className={`flex items-center gap-1 transition-all cursor-pointer py-1 ${
                isSolutionsActive
                  ? 'text-[#0F766E] dark:text-teal-300 font-bold border-b-2 border-[#0F766E] dark:border-teal-400'
                  : 'hover:text-[#0F766E] dark:hover:text-teal-300'
              }`}
            >
              <span>Solutions</span>
              <ChevronDownIcon size={12} className={`transition-transform duration-200 ${solutionsDropdownOpen ? 'rotate-180 text-[#0F766E] dark:text-teal-300' : ''}`} />
            </button>

            {/* Dropdown Floating Card */}
            {solutionsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-2 space-y-1 z-50">
                {solutionItems.map((item) => (
                  <button
                    key={item.sectionId}
                    onClick={() => handleNav(ROUTES.PUBLIC.HOME, item.sectionId)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors cursor-pointer group"
                  >
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0F766E] dark:group-hover:text-teal-300">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'ai-technology')}
            className={`transition-all cursor-pointer py-1 ${
              activeSection === 'ai-technology'
                ? 'text-[#0F766E] dark:text-teal-300 font-bold border-b-2 border-[#0F766E] dark:border-teal-400'
                : 'hover:text-[#0F766E] dark:hover:text-teal-300'
            }`}
          >
            AI Technology
          </button>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'about')}
            className={`transition-all cursor-pointer py-1 ${
              activeSection === 'about'
                ? 'text-[#0F766E] dark:text-teal-300 font-bold border-b-2 border-[#0F766E] dark:border-teal-400'
                : 'hover:text-[#0F766E] dark:hover:text-teal-300'
            }`}
          >
            About
          </button>
        </nav>

        {/* RIGHT: Auth & Theme CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle Theme Mode"
          >
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span className="hidden sm:inline text-[11px]">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          {/* Swasthya Mitr AI Companion Button - Hidden on mobile, shown on sm+ */}
          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer border border-amber-300 ring-2 ring-amber-400/20 active:scale-95"
              title="Open Swasthya Mitr Autonomous AI Assistant"
            >
              <SparklesIcon size={14} className="text-slate-950 animate-pulse" />
              <span>✦ AI Assistant</span>
            </button>
          )}

          {/* Login Button - Shown on md+ */}
          <button 
            onClick={() => handleNav(ROUTES.AUTH.LOGIN)} 
            className="hidden md:inline-flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <UserIcon size={14} className="text-[#0F766E] dark:text-teal-400" />
            <span>Login</span>
          </button>

          {/* Get Started Button - Hidden on mobile, shown on sm+ */}
          <button 
            onClick={() => handleNav(ROUTES.AUTH.REGISTER)} 
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#095650] dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRightIcon size={13} color="#fff" />
          </button>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 cursor-pointer flex items-center justify-center transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE RESPONSIVE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-[1240px] mx-auto mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xl transition-all">
          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'home')}
            className="w-full text-left font-bold text-xs text-slate-800 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800"
          >
            Home
          </button>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'how-it-works')}
            className="w-full text-left font-bold text-xs text-slate-800 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800"
          >
            How It Works
          </button>

          <div className="border-b border-slate-100 dark:border-slate-800 py-1 space-y-1">
            <button
              onClick={() => setSolutionsMobileOpen(!solutionsMobileOpen)}
              className="w-full flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-200 py-1"
            >
              <span className="text-[#0F766E] dark:text-teal-400">Solutions</span>
              <ChevronDownIcon size={12} className={`transition-transform duration-200 ${solutionsMobileOpen ? 'rotate-180' : ''}`} />
            </button>

            {solutionsMobileOpen && (
              <div className="pl-3 space-y-1 pt-1">
                {solutionItems.map((item) => (
                  <button
                    key={item.sectionId}
                    onClick={() => handleNav(ROUTES.PUBLIC.HOME, item.sectionId)}
                    className="w-full text-left text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0F766E] dark:hover:text-teal-300 py-1.5 flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'ai-technology')}
            className="w-full text-left font-bold text-xs text-slate-800 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800"
          >
            AI Technology
          </button>

          <button
            onClick={() => handleNav(ROUTES.PUBLIC.HOME, 'about')}
            className="w-full text-left font-bold text-xs text-slate-800 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800"
          >
            About
          </button>

          <div className="pt-2 flex flex-col gap-2">
            {onOpenChat && (
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); onOpenChat(); }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 py-2.5 rounded-xl font-black text-xs text-center shadow-md transition-all flex items-center justify-center gap-2 border border-amber-300"
              >
                <SparklesIcon size={14} className="text-slate-950 animate-pulse" />
                <span>✦ Talk to Swasthya Mitr (AI)</span>
              </button>
            )}
            <button 
              onClick={() => handleNav(ROUTES.AUTH.LOGIN)} 
              className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-2 rounded-xl font-bold text-xs text-center border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => handleNav(ROUTES.AUTH.REGISTER)} 
              className="w-full bg-[#0F766E] hover:bg-[#095650] dark:bg-teal-600 dark:hover:bg-teal-500 text-white py-2 rounded-xl font-bold text-xs text-center shadow-md transition-colors"
            >
              Get Started Free →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
