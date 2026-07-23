import React, { useState } from 'react';
import {
  LayoutDashboard,
  Box,
  MapPin,
  Building2,
  TrendingUp,
  AlertOctagon,
  Lightbulb,
  Award,
  Sliders,
  FileText,
  ShieldCheck,
  Settings,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Database,
  Network,
  Wrench,
  Trophy,
  Bot,
} from 'lucide-react';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAnomalyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openAnomalyCount,
}) => {
  const isPredictionsActive = [
    'predictions',
    'anomalies',
    'recommendations',
    'score',
    'simulator',
  ].includes(activeTab);

  const [isPredictionsExpanded, setIsPredictionsExpanded] = useState<boolean>(isPredictionsActive);

  // Auto expand when activeTab switches to predictions/children externally
  React.useEffect(() => {
    if (isPredictionsActive) {
      setIsPredictionsExpanded(true);
    }
  }, [activeTab, isPredictionsActive]);

  const mainNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'digital_twin', label: '🏛️ Digital Twin', icon: Box, highlight: true },
    { id: 'ai_insights', label: 'AI Insights', icon: Sparkles },
    { id: 'campus_map', label: 'Campus Map', icon: MapPin },
    { id: 'buildings', label: 'Buildings', icon: Building2 },
  ];

  const predictionsSubmenu = [
    { id: 'predictions', label: 'AI Forecasting', icon: TrendingUp },
    {
      id: 'anomalies',
      label: 'AI Anomalies & XAI',
      icon: AlertOctagon,
      badge: openAnomalyCount > 0 ? openAnomalyCount : undefined,
    },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'score', label: 'Sustainability Score', icon: Award },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
  ];

  const innovationNav = [
    { id: 'data_health', label: 'Data Fusion & Health', icon: Database },
    { id: 'environmental_engine', label: 'Causal Intelligence', icon: Network },
    { id: 'predictive_maintenance', label: 'Equipment Early Warning', icon: Wrench },
    { id: 'benchmarks', label: 'Varsity Benchmarks', icon: Trophy },
    { id: 'copilot', label: 'Greenie AI Assistant', icon: Bot },
    { id: 'reports', label: 'Audit Reports', icon: FileText },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-16 md:w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between py-4 px-2 md:px-3 select-none transition-all overflow-y-auto">
      {/* Navigation Links */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
            Twin Command Center
          </div>

          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                    : item.highlight
                    ? 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive
                        ? 'text-slate-950'
                        : item.highlight
                        ? 'text-cyan-400'
                        : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  />
                  <span className="hidden md:inline truncate">{item.label}</span>
                </div>

                <div className="hidden md:flex items-center gap-1.5">
                  {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}

          {/* Collapsible AI Predictions Parent */}
          <div className="space-y-1">
            <button
              onClick={() => setIsPredictionsExpanded(!isPredictionsExpanded)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isPredictionsActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
              title="AI Predictions"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp
                  className={`h-4 w-4 shrink-0 ${
                    isPredictionsActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                />
                <span className="hidden md:inline truncate">AI Predictions</span>
              </div>

              <div className="hidden md:flex items-center gap-1.5">
                {openAnomalyCount > 0 && !isPredictionsExpanded && (
                  <span className="rounded-full px-1.5 py-0.2 text-[10px] font-bold bg-orange-500 text-white animate-pulse">
                    {openAnomalyCount}
                  </span>
                )}
                {isPredictionsExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 opacity-80 text-slate-400" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 opacity-80 text-slate-400" />
                )}
              </div>
            </button>

            {/* Expandable Submenu Items */}
            {isPredictionsExpanded && (
              <div className="pl-1 md:pl-4 space-y-1 transition-all duration-200">
                {predictionsSubmenu.map((subitem) => {
                  const SubIcon = subitem.icon;
                  const isSubActive = activeTab === subitem.id;

                  return (
                    <button
                      key={subitem.id}
                      onClick={() => setActiveTab(subitem.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all group ${
                        isSubActive
                          ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm shadow-cyan-500/10'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      }`}
                      title={subitem.label}
                    >
                      <div className="flex items-center gap-2">
                        <SubIcon
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isSubActive ? 'text-slate-950' : 'text-slate-500 group-hover:text-cyan-400'
                          }`}
                        />
                        <span className="hidden md:inline truncate">{subitem.label}</span>
                      </div>

                      {subitem.badge !== undefined && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                            isSubActive ? 'bg-slate-950/20 text-slate-950' : 'bg-orange-500 text-white'
                          }`}
                        >
                          {subitem.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* AI Innovation Suite Section */}
        <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
            AI Innovation Features
          </div>

          {innovationNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  />
                  <span className="hidden md:inline truncate">{item.label}</span>
                </div>

                {isActive && <ChevronRight className="hidden md:block h-3.5 w-3.5 opacity-80" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer System Info Tile */}
      <div className="hidden md:block rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200/80 dark:border-slate-700/60 text-xs mt-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
          <span>AI Engine Status</span>
          <span className="text-emerald-500 font-mono">v2.4 Ready</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
          Isolation Forest & Gemini 2.5 syncing 1,420 IoT sensor feeds.
        </p>
      </div>
    </aside>
  );
};

