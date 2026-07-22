import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Search,
  Building2,
  AlertTriangle,
  X,
  CheckCircle,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Box,
  TrendingUp,
  Award,
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
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  currentUser,
  anomalies,
  onSelectBuilding,
  onNavigateToTab,
  onOpenAuth,
  isGuestMode = false,
  onLogout,
  activeTab = 'dashboard',
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const openAnomalies = anomalies.filter((a) => a.status === 'open' || a.status === 'investigating');

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    sustainability_officer: 'Sustainability Officer',
    facility_manager: 'Facility Manager',
    student_auditor: 'Student Auditor',
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'digital_twin', label: '3D Model', icon: Box },
    { id: 'predictions', label: 'Analytics', icon: TrendingUp },
    { id: 'ai_insights', label: 'AI Insights', icon: Sparkles },
    { id: 'score', label: 'Sustainability', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xs transition-colors">
      <div className="mx-auto flex h-20 sm:h-22 items-center justify-between px-4 sm:px-6 lg:px-10 gap-4 sm:gap-6 lg:gap-8">
        
        {/* LEFT SIDE: Clean minimal branding */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* LICET Emblem Logo */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-500/25 ring-1 ring-white/30 font-black text-xs tracking-wider">
            LICET
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Smart Campus Digital Twin
              </h1>
              {isGuestMode && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                  <Sparkles className="h-3 w-3" /> Demo Mode
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
              Loyola-ICAM College of Engineering & Technology
            </p>
          </div>
        </div>

        {/* CENTER: Navigation Tabs with equal spacing */}
        <nav className="hidden md:flex items-center justify-center gap-1.5 lg:gap-2 px-3 py-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigateToTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT SIDE: Search, Dark Mode, Notifications & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Universal Quick Search */}
          <div className="relative hidden xl:block w-48 lg:w-56">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search campus..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.trim().length > 0);
                }}
                onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
                className="w-full rounded-xl bg-slate-100/90 dark:bg-slate-800/80 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Search Dropdown */}
            {showSearchResults && (
              <div className="absolute top-11 left-0 right-0 z-50 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-2 max-h-80 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
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
                      HVAC Spike
                    </span>
                  </div>
                  <span className="text-red-500 text-[10px] font-bold">Critical</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition shadow-2xs"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-slate-700" />
            )}
          </button>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition shadow-2xs"
              title="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              {openAnomalies.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 shadow-xs">
                  {openAnomalies.length}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
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

          {/* User Profile / Icon Section */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2.5 rounded-2xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition text-left"
              title="User Account Settings"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
              />
              <div className="hidden lg:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {roleLabels[currentUser.role]}
                </div>
              </div>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Logout Session"
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE RESPONSIVE CENTER TABS ROW */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigateToTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition ${
                isActive
                  ? 'bg-emerald-500 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

