import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Shield,
  Search,
  Activity,
  UserCheck,
  Building2,
  AlertTriangle,
  X,
  CheckCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { User, UserRole, Anomaly } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  anomalies: Anomaly[];
  onSelectBuilding: (buildingId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenAuth: () => void;
  isGuestMode?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  currentUser,
  setCurrentUserRole,
  anomalies,
  onSelectBuilding,
  onNavigateToTab,
  onOpenAuth,
  isGuestMode = false,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const openAnomalies = anomalies.filter((a) => a.status === 'open' || a.status === 'investigating');

  const roleLabels: Record<UserRole, string> = {
    admin: 'System Administrator',
    sustainability_officer: 'Sustainability Officer',
    facility_manager: 'Campus Facility Manager',
    student_auditor: 'Student Auditor',
  };

  const roleBadgeColors: Record<UserRole, string> = {
    admin: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    sustainability_officer: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    facility_manager: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    student_auditor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 transition-colors">
      {/* Left: Brand Identity & Live Sensor Health Badge */}
      <div className="flex items-center gap-3">
        {/* LICET Crest Badge */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/20 font-black text-xs tracking-tighter">
          LICET
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm sm:text-base lg:text-lg">
              LOYOLA-ICAM COLLEGE OF ENGINEERING & TECHNOLOGY
            </span>
            <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-black text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 tracking-wider">
              DIGITAL TWIN
            </span>
          </div>
          <p className="hidden md:block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            AI-Powered Green Campus Sustainability Command Center
          </p>
        </div>

        {/* Live System Ticker */}
        <div className="hidden xl:flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1 text-xs border border-slate-200/80 dark:border-slate-700/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            1,420 IoT Sensors
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono">14ms latency</span>
        </div>

        {/* Guest Mode Indicator Badge */}
        {isGuestMode && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-3 py-1 text-xs font-extrabold shadow-2xs animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>Guest Mode – Demo Data</span>
          </div>
        )}
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="relative hidden md:block w-72 lg:w-96">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search buildings, anomalies, AI insights..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.trim().length > 0);
            }}
            onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/90 pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Search Dropdown */}
        {showSearchResults && (
          <div className="absolute top-12 left-0 right-0 z-50 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-2 max-h-80 overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Quick Jump
            </div>
            <button
              onClick={() => {
                onSelectBuilding('bldg-1');
                setShowSearchResults(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 text-left text-xs transition"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Academic Block
                </span>
              </div>
              <span className="text-slate-400 text-[10px]">A Rating</span>
            </button>
            <button
              onClick={() => {
                onNavigateToTab('anomalies');
                setShowSearchResults(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 text-left text-xs transition"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  HVAC Compressor Spike (Mech Block)
                </span>
              </div>
              <span className="text-red-500 text-[10px] font-bold">Critical</span>
            </button>
          </div>
        )}
      </div>

      {/* Right: Controls & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Weather & Time Status Header Widget */}
        <div className="hidden lg:flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-200 font-bold">
            <span className="text-emerald-500 font-extrabold">10:30 AM</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 dark:text-slate-400">23 May 2026</span>
          </div>
          <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <span className="text-amber-500">☀️</span>
            <span>32°C</span>
            <span className="text-slate-400 text-[10px] hidden xl:inline">Chennai, IN</span>
          </div>
        </div>

        {/* Dark/Light Mode Switcher */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
        </button>

        {/* Notifications Popover Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Bell className="h-5 w-5" />
            {openAnomalies.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {openAnomalies.length}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-4 transition-all animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Live System Alerts ({openAnomalies.length})
                  </h4>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {openAnomalies.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    All twin sensors normal. No active anomalies.
                  </div>
                ) : (
                  openAnomalies.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        onNavigateToTab('anomalies');
                        setShowNotifications(false);
                      }}
                      className="group cursor-pointer rounded-xl bg-slate-50 dark:bg-slate-700/40 p-3 border border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-500 dark:hover:border-emerald-500 transition"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {a.buildingName}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            a.severity === 'critical'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {a.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                        {a.title}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {a.timestamp} • {a.detectedBy}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  onNavigateToTab('anomalies');
                  setShowNotifications(false);
                }}
                className="w-full mt-3 py-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline border-t border-slate-100 dark:border-slate-700 pt-2"
              >
                View All Anomalies in AI Center →
              </button>
            </div>
          )}
        </div>

        {/* User Role Badge & Profile Quick Button */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <div className="hidden xl:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser.name}
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                    roleBadgeColors[currentUser.role]
                  }`}
                >
                  {roleLabels[currentUser.role]}
                </span>
              </div>
            </div>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Logout Session"
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition flex items-center gap-1 text-xs font-semibold"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
