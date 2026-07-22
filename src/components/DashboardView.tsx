import React, { useState } from 'react';
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
    { name: 'HVAC', value: 40, color: '#3B82F6' },
    { name: 'Lighting', value: 25, color: '#10B981' },
    { name: 'Labs', value: 20, color: '#F59E0B' },
    { name: 'IT & Servers', value: 10, color: '#8B5CF6' },
    { name: 'Others', value: 5, color: '#06B6D4' },
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

          {/* LARGE SUSTAINABILITY SCORE CARD */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md text-center space-y-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-500" />
              Sustainability Score
            </h3>

            {/* Circular Gauge / Score Ring */}
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeDasharray="89, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                  89<span className="text-xs font-normal text-slate-400">/100</span>
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                  Excellent
                </span>
              </div>
            </div>

            {/* 30-Day Sparkline Trend Chart */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>TREND (Last 30 Days)</span>
                <span className="text-emerald-500 flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" /> +8% improvement
                </span>
              </div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend30DaysData}>
                    <defs>
                      <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#scoreGlow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            CENTERPIECE: AERIAL CAMPUS INTERACTIVE TWIN (Col 4-9)
        ========================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl bg-slate-950 border border-cyan-500/40 overflow-hidden shadow-2xl group min-h-[480px]">
            {/* High-Res Aerial Campus Imagery */}
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80"
              alt="LICET Campus Digital Twin Aerial View"
              className="w-full h-[520px] object-cover opacity-85 transition-all duration-700 group-hover:scale-105 filter brightness-90 contrast-110"
            />

            {/* Dark Digital Overlay & Scan Grid */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d410_1px,transparent_1px),linear-gradient(to_bottom,#06b6d410_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Top Overlay Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 px-3 py-1.5 backdrop-blur-md shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black text-white">LIVE CAMPUS TWIN</span>
              <span className="text-[10px] text-cyan-400 font-mono">1,420 Nodes</span>
            </div>

            {/* FLOATING OVERLAY CARDS ON CAMPUS BUILDINGS */}

            {/* 1. ENERGY MONITORING OVERLAY CARD */}
            <div
              onClick={() => onNavigateToTab('energy')}
              className="absolute top-[22%] left-[45%] -translate-x-1/2 z-20 cursor-pointer group/card transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-cyan-500/50 p-2.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white text-xs">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Zap className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <div className="font-extrabold flex items-center gap-1 text-[11px] text-cyan-300">
                    ENERGY MONITORING
                  </div>
                  <div className="text-xs font-black text-white">Consumption: 180 kW</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Status: Normal</div>
                </div>
              </div>
            </div>

            {/* 2. WATER MANAGEMENT OVERLAY CARD */}
            <div
              onClick={() => onNavigateToTab('water')}
              className="absolute top-[68%] left-[20%] z-20 cursor-pointer group/card transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-blue-500/50 p-2.5 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white text-xs">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <Droplet className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-blue-300">WATER MANAGEMENT</div>
                  <div className="text-xs font-black text-white">Usage Today: 4,200 L</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Status: Normal</div>
                </div>
              </div>
            </div>

            {/* 3. AIR QUALITY OVERLAY CARD */}
            <div
              onClick={() => onNavigateToTab('air_quality')}
              className="absolute top-[62%] right-[18%] z-20 cursor-pointer group/card transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-emerald-500/50 p-2.5 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white text-xs">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Wind className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-emerald-300">AIR QUALITY</div>
                  <div className="text-xs font-black text-white">AQI: 42 (Good)</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Status: Good</div>
                </div>
              </div>
            </div>

            {/* 4. SOLAR PV SYSTEM OVERLAY CARD */}
            <div
              onClick={() => onNavigateToTab('solar')}
              className="absolute top-[12%] left-[18%] z-20 cursor-pointer group/card transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-amber-500/50 p-2.5 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.3)] text-white text-xs">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Sun className="h-4 w-4 animate-spin-slow" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-amber-300">SOLAR PV SYSTEM</div>
                  <div className="text-xs font-black text-white">Capacity: 350 kWp</div>
                  <div className="text-[10px] text-amber-400 font-semibold">Status: Generating (142 kW)</div>
                </div>
              </div>
            </div>

            {/* 5. WEATHER STATION OVERLAY CARD */}
            <div className="absolute top-[12%] right-[12%] z-20 cursor-pointer group/card transition-all hover:scale-105">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-cyan-500/50 p-2.5 backdrop-blur-md text-white text-xs">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-cyan-300">WEATHER STATION</div>
                  <div className="text-xs font-black text-white">32°C • Humidity: 62%</div>
                  <div className="text-[10px] text-slate-300">Wind: 12 km/h</div>
                </div>
              </div>
            </div>

            {/* 6. PARKING SYSTEM OVERLAY CARD */}
            <div className="absolute bottom-[10%] left-[42%] -translate-x-1/2 z-20 cursor-pointer group/card transition-all hover:scale-105">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-purple-500/50 p-2.5 backdrop-blur-md text-white text-xs">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Car className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-extrabold text-[11px] text-purple-300">PARKING SYSTEM</div>
                  <div className="text-xs font-black text-white">Occupied: 78 / 120</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Availability: 35%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT PANEL: REAL-TIME METRICS & CARBON (Col 10-12)
        ========================================== */}
        <div className="lg:col-span-3 space-y-4">
          {/* REAL-TIME METRICS CARD */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-500" />
                Real-Time Metrics
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Energy Consumption</span>
                </div>
                <span className="font-black text-slate-900 dark:text-white">180 kW</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Solar Generation</span>
                </div>
                <span className="font-black text-amber-500">142 kW</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Water Usage</span>
                </div>
                <span className="font-black text-slate-900 dark:text-white">4,200 L</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-purple-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">EV Chargers</span>
                </div>
                <span className="font-black text-emerald-400">4 Active</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-teal-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Air Quality Index</span>
                </div>
                <span className="font-black text-emerald-400">42 (Good)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-slate-400" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Waste Generated</span>
                </div>
                <span className="font-black text-slate-900 dark:text-white">120 kg</span>
              </div>
            </div>
          </div>

          {/* CARBON FOOTPRINT CARD WITH WEEKLY BAR CHART */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-teal-400" />
                Carbon Footprint
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                -8% This Week
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  2.3 <span className="text-xs font-normal text-slate-400">tCO₂e Today</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Daily Target: &lt; 3.0 t</span>
            </div>

            <div className="h-28 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carbonWeeklyData}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Bar dataKey="co2" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
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

        {/* SECTION 2: CAMPUS BLUEPRINT & SELECTED BUILDING (Col 4-6) */}
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-black text-slate-900 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-cyan-400" />
              Campus Blueprint & Building
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Status: Optimal
            </span>
          </div>

          {/* Blueprint SVG Diagram */}
          <div className="relative h-28 rounded-xl bg-slate-950 border border-cyan-500/30 p-2 flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full text-cyan-500/40" viewBox="0 0 200 100">
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="100" y="10" width="90" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <rect x="100" y="55" width="90" height="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="15" fill="#06B6D420" stroke="#06B6D4" strokeWidth="1" />
              <text x="50" y="53" textAnchor="middle" fill="#06B6D4" fontSize="8" fontWeight="bold">MAIN</text>
            </svg>
            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-cyan-400">
              LICET BLUEPRINT v2.4
            </div>
          </div>

          {/* Selected Building Details */}
          <div className="space-y-1 text-xs">
            <div className="font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{selectedBuilding.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{selectedBuilding.code}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
              <div>Floors: <span className="font-bold text-slate-900 dark:text-white">G + 3</span></div>
              <div>Built-up: <span className="font-bold text-slate-900 dark:text-white">65,000 sq.ft</span></div>
              <div>Function: <span className="font-bold text-slate-900 dark:text-white">Academic & Admin</span></div>
              <div>Health: <span className="font-bold text-emerald-400">100% Optimal</span></div>
            </div>
          </div>
        </div>

        {/* SECTION 3: ENERGY BREAKDOWN PIE CHART (Col 7-9) */}
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-black text-slate-900 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <PieIcon className="h-4 w-4 text-amber-400" />
              Energy Breakdown
            </h3>
            <span className="text-xs font-black text-emerald-400">Total 180 kW</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Donut Chart */}
            <div className="h-28 w-28 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={energyBreakdownData}
                    innerRadius={28}
                    outerRadius={42}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {energyBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-black text-slate-900 dark:text-white">180</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">kW</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1 text-[11px] w-full">
              {energyBreakdownData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: GREENIE AI INSIGHTS & ALERTS (Col 10-12) */}
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md space-y-3 flex flex-col justify-between">
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
