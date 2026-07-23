import React, { useState } from 'react';
import { LicetSkeletalBuilding } from './LicetSkeletalBuilding';
import {
  Zap,
  Droplet,
  Trash2,
  Wind,
  Sun,
  Award,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Sliders,
  FileDown,
  CheckCircle2,
  Building2,
  Sparkles,
  Clock,
  Activity,
  Calendar,
  ChevronRight,
  MapPin,
  Car,
  Trees,
  Users,
  ShieldCheck,
  Check,
  Info,
  Layers,
  PieChart as PieIcon,
  Bot,
  Compass,
  FileText,
  Settings,
  Leaf,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Building,
  Anomaly,
  PredictionSummary,
  SustainabilityScores,
  WeatherData,
} from '../types';

interface DashboardViewProps {
  buildings: Building[];
  anomalies: Anomaly[];
  prediction: PredictionSummary;
  scores: SustainabilityScores;
  weather: WeatherData;
  onNavigateToTab: (tab: string) => void;
  onSelectBuilding: (buildingId: string) => void;
  onExportPDF: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  buildings,
  anomalies,
  prediction,
  scores,
  weather,
  onNavigateToTab,
  onSelectBuilding,
  onExportPDF,
}) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('bldg-1');
  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  // Energy Breakdown Donut Chart Data
  const energyBreakdownData = [
    { name: 'HVAC', value: 40, color: '#8B5CF6' },
    { name: 'Lighting', value: 25, color: '#6EE7B7' },
    { name: 'Labs', value: 20, color: '#A855F7' },
    { name: 'IT & Servers', value: 10, color: '#C084FC' },
    { name: 'Others', value: 5, color: '#34D399' },
  ];

  // Carbon Weekly Bar Chart Data
  const carbonWeeklyData = [
    { day: 'Mon', co2: 2.5 },
    { day: 'Tue', co2: 2.8 },
    { day: 'Wed', co2: 2.4 },
    { day: 'Thu', co2: 2.6 },
    { day: 'Fri', co2: 2.3 },
    { day: 'Sat', co2: 1.6 },
    { day: 'Sun', co2: 1.4 },
  ];

  // 30-Day Trend Sparkline Data for Sustainability Score
  const trend30DaysData = [
    { day: '1', score: 81 },
    { day: '5', score: 83 },
    { day: '10', score: 82 },
    { day: '15', score: 85 },
    { day: '20', score: 86 },
    { day: '25', score: 88 },
    { day: '30', score: 89 },
  ];

  // Greenie AI Insights Cards Data
  const aiInsights = [
    {
      id: 'insight-1',
      icon: Sun,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Solar Generation Forecast',
      message: 'Solar generation may drop by 15% tomorrow due to predicted cloudy weather.',
      confidence: 94,
    },
    {
      id: 'insight-2',
      icon: Droplet,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      title: 'Water Consumption Trend',
      message: 'Water usage is 8% higher than usual pattern across Main Block Wing B.',
      confidence: 91,
    },
    {
      id: 'insight-3',
      icon: Zap,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'EV Charging Load Peak',
      message: 'EV charging demand will peak between 4 PM - 7 PM today.',
      confidence: 96,
    },
    {
      id: 'insight-4',
      icon: Leaf,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      title: 'Carbon Footprint Reduction',
      message: 'Carbon emissions reduced by 8% this week thanks to rooftop solar PV.',
      confidence: 98,
    },
    {
      id: 'insight-5',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'System Health Status',
      message: 'No critical alerts detected across 1,420 campus IoT telemetry nodes.',
      confidence: 99,
    },
  ];

  // Bottom Navigation Links
  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'campus_map', label: 'Campus Map', icon: MapPin },
    { id: 'buildings', label: 'Buildings', icon: Building2 },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'water', label: 'Water', icon: Droplet },
    { id: 'air_quality', label: 'Air Quality', icon: Wind },
    { id: 'solar', label: 'Solar', icon: Sun },
    { id: 'waste', label: 'Waste', icon: Trash2 },
    { id: 'carbon', label: 'Carbon', icon: Leaf },
    { id: 'copilot', label: 'Greenie AI', icon: Bot, highlight: true },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-5 pb-10 animate-in fade-in duration-300">
      {/* ==========================================
          MISSION CONTROL BANNER HEADER
      ========================================== */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 p-4 sm:p-5 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-[11px] font-black text-cyan-400 border border-cyan-500/40 tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                LICET DIGITAL TWIN COMMAND CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Chennai, India • Lat 13.0618° N
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              LOYOLA-ICAM COLLEGE OF ENGINEERING & TECHNOLOGY
            </h1>
            <p className="text-xs sm:text-sm text-cyan-300 font-medium max-w-3xl">
              AI-Powered Green Campus Sustainability Command Center • Real-Time Telemetry & Predictor
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToTab('copilot')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="h-4 w-4 animate-bounce" />
              <span>Ask Greenie AI 🌿</span>
            </button>
            <button
              onClick={onExportPDF}
              className="flex items-center gap-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-200 border border-slate-700 transition"
            >
              <FileDown className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">Export Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          MAIN COMMAND CENTER 3-COLUMN GRID
      ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ==========================================
            LEFT PANEL: CAMPUS OVERVIEW & SCORE (Col 1-3)
        ========================================== */}
        <div className="lg:col-span-3 space-y-4">
          {/* CAMPUS OVERVIEW CARD */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-500" />
                Campus Overview
              </h3>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                LICET
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Campus Area</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">12.5 Acres</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Buildings</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">16 Facilities</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Floors</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">G + 3</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Established</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">2010</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Trees</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">450+ Trees</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Solar Panels</span>
                <span className="font-extrabold text-amber-500 text-sm">320 Panels</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Parking Area</span>
                <span className="font-extrabold text-blue-500 text-sm">120 Slots</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Students & Staff</span>
                <span className="font-extrabold text-cyan-400 text-sm">2,500 / 220</span>
              </div>
            </div>
          </div>
        </div>

          {/* ==========================================
            CENTERPIECE: AERIAL CAMPUS INTERACTIVE TWIN (Col 4-9)
        ========================================== */}
        <div className="lg:col-span-9 space-y-4">
          <LicetSkeletalBuilding onNavigateToTab={onNavigateToTab} />
        </div>
      </div>

        {/* ==========================================
          BOTTOM ROW: 4 SECTIONS (Nav, Blueprint, Pie Chart, Greenie AI Insights)
      ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
        {/* SECTION 1: BOTTOM NAVIGATION MENU (Col 1-3) */}
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-3">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-black text-slate-900 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-emerald-500" />
              Navigation Menu
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateToTab(item.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left font-bold transition ${
                    item.highlight
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-emerald-500'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: GREENIE AI INSIGHTS & ALERTS (Col 5-12) */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-black text-slate-900 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              Greenie AI Insights
            </h3>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Live AI
            </span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
            {aiInsights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.id}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2 group hover:border-emerald-500/40 transition"
                >
                  <div className={`p-1 rounded-lg ${insight.color} shrink-0 mt-0.5`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                        {insight.title}
                      </span>
                      <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        {insight.confidence}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                      {insight.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
