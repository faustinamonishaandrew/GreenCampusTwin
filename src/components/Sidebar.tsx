import React from 'react';
import {
  LayoutDashboard,
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
  const mainNav = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'ai_insights', label: 'AI Insights', icon: Sparkles, highlight: true },
    { id: 'campus_map', label: 'Campus Map', icon: MapPin },
    { id: 'buildings', label: 'Buildings', icon: Building2 },
    { id: 'predictions', label: 'AI Predictions', icon: TrendingUp },
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
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : item.highlight
                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-emerald-500'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-emerald-500'
                    }`}
                  />
                  <span className="hidden md:inline truncate">{item.label}</span>
                </div>

                <div className="hidden md:flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
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
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-emerald-500'
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

