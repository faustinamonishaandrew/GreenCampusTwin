import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Laptop,
  User,
  Bell,
  Globe,
  Info,
  ShieldCheck,
  Check,
  Sparkles,
  Sliders,
  Key,
  Database,
  Radio,
  LogOut,
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface SettingsViewProps {
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  currentUser: UserType;
  setCurrentUserRole: (role: UserRole) => void;
  onOpenAuth: () => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  themeMode,
  setThemeMode,
  currentUser,
  setCurrentUserRole,
  onOpenAuth,
  onLogout,
}) => {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushAnomalies: true,
    weeklyDigest: true,
    maintenanceWarnings: true,
  });

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const roleLabels: Record<UserRole, string> = {
    admin: 'System Administrator',
    sustainability_officer: 'Sustainability Officer',
    facility_manager: 'Campus Facility Manager',
    student_auditor: 'Student Auditor',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Preferences & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure appearance theme mode, user role profiles, notification channels, and platform options.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            Preferences Saved!
          </div>
        )}
      </div>

      {/* SECTION 1: Theme Mode Switcher */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Sun className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Appearance & Theme Mode
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose your visual experience. Preferences are remembered in your browser state.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Light Mode */}
          <button
            onClick={() => setThemeMode('light')}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition ${
              themeMode === 'light'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 mb-2">
              <Sun className="h-6 w-6" />
            </div>
            <span className="text-sm font-extrabold">Light Mode</span>
            <span className="text-[11px] text-slate-400 mt-1">
              Clean white background with soft shadows & high contrast
            </span>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => setThemeMode('dark')}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition ${
              themeMode === 'dark'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
              <Moon className="h-6 w-6" />
            </div>
            <span className="text-sm font-extrabold">Dark Mode (#0F172A)</span>
            <span className="text-[11px] text-slate-400 mt-1">
              Glassmorphism dark slate canvas with emerald accents
            </span>
          </button>

          {/* System Theme */}
          <button
            onClick={() => setThemeMode('system')}
            className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition ${
              themeMode === 'system'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 mb-2">
              <Laptop className="h-6 w-6" />
            </div>
            <span className="text-sm font-extrabold">System Default</span>
            <span className="text-[11px] text-slate-400 mt-1">
              Automatically match your operating system theme settings
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 2: Profile & Role Settings */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <User className="h-5 w-5 text-emerald-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            User Profile & Authorization Role
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-16 w-16 rounded-full object-cover ring-4 ring-emerald-500/30"
          />
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {currentUser.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
            <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Active Role: {roleLabels[currentUser.role]}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={onOpenAuth}
              className="rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white transition"
            >
              Switch Active Role
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 px-4 py-2 text-xs font-bold transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout Session</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Notification Toggles */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Bell className="h-5 w-5 text-blue-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Notification & Alert Dispatch
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'emailAlerts',
              label: 'Critical Anomaly Email Warnings',
              desc: 'Send instant email notifications when Isolation Forest detects severe surge anomalies.',
            },
            {
              key: 'pushAnomalies',
              label: 'Real-Time Browser Push Alerts',
              desc: 'Pop-up notification on web desktop when equipment early warning triggers.',
            },
            {
              key: 'weeklyDigest',
              label: 'Executive Weekly Audit Digest',
              desc: 'Receive automated PDF reports on Monday morning summarizing campus sustainability scores.',
            },
            {
              key: 'maintenanceWarnings',
              label: 'Equipment Failure Risk Warnings',
              desc: 'Predictive maintenance alerts 14 days prior to estimated sensor or pump breakdown.',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60"
            >
              <div className="pr-4">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.desc}
                </span>
              </div>
              <input
                type="checkbox"
                checked={(notifications as any)[item.key]}
                onChange={(e) =>
                  setNotifications({ ...notifications, [item.key]: e.target.checked })
                }
                className="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Language & Regional Settings */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Globe className="h-5 w-5 text-purple-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Language & Region
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Display Language
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Select platform language for UI labels, reports, and AI explanations.
            </span>
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 px-4 py-2.5 focus:outline-none"
          >
            <option value="en">English (US)</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="de">German (Deutsch)</option>
          </select>
        </div>
      </div>

      {/* SECTION 5: Platform & System Information */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Info className="h-5 w-5 text-emerald-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            About Green Campus Digital Twin
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 block font-semibold">Platform Version</span>
            <span className="font-extrabold text-slate-900 dark:text-white font-mono text-sm">
              v2.4.0 (Hackathon Gold Release)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 block font-semibold">AI Intelligence Engine</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
              Gemini 2.5 & Isolation Forest ML
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 block font-semibold">Active Sensor Mesh</span>
            <span className="font-extrabold text-slate-900 dark:text-white font-mono text-sm">
              1,420 IoT Nodes (14ms Latency)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 block font-semibold">Design System</span>
            <span className="font-extrabold text-slate-900 dark:text-white font-mono text-sm">
              Material Design 3 & Glassmorphism
            </span>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Check className="h-4 w-4" />
            Save All Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
