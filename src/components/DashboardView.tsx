import React, { useState } from 'react';
import {
  Zap,
  Droplet,
  Trash2,
  Wind,
  CloudSun,
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
  Brain,
  Activity,
  Calendar,
  ChevronRight,
  ShieldAlert,
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
  CartesianGrid,
  Legend,
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
  const [trendView, setTrendView] = useState<'weekly' | 'monthly'>('weekly');

  const totalEnergy = buildings.reduce((acc, b) => acc + b.currentEnergyKwh, 0);
  const totalWater = buildings.reduce((acc, b) => acc + b.currentWaterLiters, 0);
  const totalWaste = buildings.reduce((acc, b) => acc + b.currentWasteKg, 0);
  const avgAqi = Math.round(buildings.reduce((acc, b) => acc + b.currentAqi, 0) / buildings.length);
  const totalCarbon = buildings.reduce((acc, b) => acc + b.currentCarbonKg, 0);
  const healthScore = Math.round((scores.energy + scores.water + scores.waste + scores.airQuality + scores.carbon) / 5);

  const openAnomalies = anomalies.filter((a) => a.status === 'open' || a.status === 'investigating');

  // Weekly Trend Data
  const weeklyTrendData = [
    { day: 'Mon', energy: 4100, water: 26000, carbon: 1350 },
    { day: 'Tue', energy: 4300, water: 27500, carbon: 1410 },
    { day: 'Wed', energy: 4500, water: 29000, carbon: 1480 },
    { day: 'Thu', energy: 4200, water: 26800, carbon: 1390 },
    { day: 'Fri', energy: 4600, water: 28400, carbon: 1510 },
    { day: 'Sat', energy: 2800, water: 18000, carbon: 890 },
    { day: 'Sun', energy: 2300, water: 15200, carbon: 720 },
  ];

  // Monthly Trend Data
  const monthlyTrendData = [
    { month: 'Jan', energy: 125000, water: 820000, carbon: 41000 },
    { month: 'Feb', energy: 118000, water: 790000, carbon: 38500 },
    { month: 'Mar', energy: 132000, water: 850000, carbon: 43000 },
    { month: 'Apr', energy: 128000, water: 810000, carbon: 41800 },
    { month: 'May', energy: 141000, water: 890000, carbon: 46200 },
    { month: 'Jun', energy: 135000, water: 840000, carbon: 44000 },
    { month: 'Jul', energy: 129000, water: 815000, carbon: 42100 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white shadow-xl border border-emerald-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              Campus Live Digital Twin
            </span>
            <span className="text-xs text-slate-400">• Updated 1 min ago</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Sustainability Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time IoT telemetry across 8 campus blocks. XGBoost & Gemini 2.5 confidence at{' '}
            <span className="text-emerald-400 font-bold">{prediction.predictionConfidencePct}%</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateToTab('ai_insights')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
          >
            <Sparkles className="h-4 w-4" />
            AI Insights & Diagnosis
          </button>
          <button
            onClick={onExportPDF}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
          >
            <FileDown className="h-4 w-4 text-emerald-400" />
            Export Audit PDF
          </button>
        </div>
      </div>

      {/* TOP 6 KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Sustainability Score */}
        <div
          onClick={() => onNavigateToTab('score')}
          className="cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-4 text-white shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-100">Green Score</span>
            <Award className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold">{scores.overall}</span>
            <span className="text-xs text-emerald-100">/ 100</span>
          </div>
          <div className="mt-1 text-[11px] font-bold text-emerald-100">
            Grade {scores.grade} • Top 5%
          </div>
        </div>

        {/* 2. Environmental Health */}
        <div
          onClick={() => onNavigateToTab('ai_insights')}
          className="cursor-pointer rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Env Health
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
              <Brain className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {healthScore} <span className="text-xs font-medium text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            Optimal Mesh Health
          </div>
        </div>

        {/* 3. Today's Energy */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Today's Energy
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {totalEnergy.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-400">kWh</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span>-3.2% vs average</span>
          </div>
        </div>

        {/* 4. Water Usage */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Water Usage
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Droplet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {totalWater.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-400">Liters</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] font-bold text-amber-600 dark:text-amber-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+4.1% (Hostel leak)</span>
          </div>
        </div>

        {/* 5. Carbon Emissions */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Carbon Emissions
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {totalCarbon.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-400">kg CO₂e</span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            -820 kg Solar Offset
          </div>
        </div>

        {/* 6. Active Alerts */}
        <div
          onClick={() => onNavigateToTab('anomalies')}
          className="cursor-pointer rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Active Alerts
            </span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {openAnomalies.length}{' '}
            <span className="text-xs font-medium text-red-500 font-bold">Unresolved</span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400">
            Isolation Forest Active
          </div>
        </div>
      </div>

      {/* SECOND ROW: AI Summary Card + Weather Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gemini 2.5 AI Summary Card */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-lg space-y-4 border border-emerald-500/20">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold">Gemini 2.5 Real-Time Executive AI Summary</h3>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              Auto-Synthesized
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            "Campus sustainability health is currently <strong className="text-emerald-400">Optimal (91/100)</strong>. Total daily power consumption is down by 3.2% due to solar offset generation on the Central Library rooftop. However, <strong className="text-amber-300">Hostel Block A</strong> exhibits an unexplained 18% water flow surge indicative of sub-surface pipe valve leakage. Immediate attention is recommended on <strong className="text-red-300">Server Lab B</strong> where unscheduled GPU workload runs lack dynamic HVAC chiller bypass."
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Est. Cost Risk</span>
              <span className="font-extrabold text-amber-400">₹2,450 / day</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Solar Credit Offset</span>
              <span className="font-extrabold text-emerald-400">+340 kWh generated</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Top Priority</span>
              <span className="font-extrabold text-cyan-300">Hostel Water Leak</span>
            </div>
          </div>
        </div>

        {/* Weather Card */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-blue-500/40 pb-3">
            <span className="text-xs font-bold text-blue-200">Campus Weather & Irradiance</span>
            <CloudSun className="h-6 w-6 text-amber-300" />
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-4xl font-extrabold">{weather.tempC}°C</div>
              <div className="text-xs text-blue-100 font-medium">{weather.condition}</div>
            </div>
            <div className="text-right text-xs space-y-1 text-blue-100">
              <div>Humidity: <strong className="text-white">{weather.humidityPct}%</strong></div>
              <div>Solar Rad: <strong className="text-white">{weather.solarRadiationWm2} W/m²</strong></div>
              <div>Campus AQI: <strong className="text-emerald-300">{avgAqi} (Good)</strong></div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-xs text-blue-100">
            ☀️ Excellent solar radiation expected until 17:30. Solar inverters operating at peak capacity.
          </div>
        </div>
      </div>

      {/* THIRD ROW: Weekly & Monthly Trends */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Consolidated Consumption & Emission Trends
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track multi-resource usage patterns across daily and monthly historical timelines
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setTrendView('weekly')}
              className={`px-4 py-1.5 rounded-lg transition ${
                trendView === 'weekly'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Weekly Trends
            </button>
            <button
              onClick={() => setTrendView('monthly')}
              className={`px-4 py-1.5 rounded-lg transition ${
                trendView === 'monthly'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Trends
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {trendView === 'weekly' ? (
              <BarChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="energy" fill="#F59E0B" name="Energy (kWh)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="carbon" fill="#8B5CF6" name="Carbon (kg CO₂)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="monthlyEnergyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="energy"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#monthlyEnergyGrad)"
                  name="Monthly Energy (kWh)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* FOURTH ROW: Recent Alerts Timeline + Campus Blocks Quick Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts Timeline */}
        <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Alerts Timeline
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('anomalies')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {anomalies.slice(0, 4).map((a, idx) => (
              <div
                key={a.id}
                onClick={() => onNavigateToTab('anomalies')}
                className="group cursor-pointer relative pl-5 border-l-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition space-y-1"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[7px] top-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-800 ${
                    a.severity === 'critical'
                      ? 'bg-red-500'
                      : a.severity === 'high'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                ></div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {a.buildingName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{a.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                  {a.title}
                </p>

                <p className="text-[11px] text-slate-400 line-clamp-2">{a.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Blocks Digital Telemetry Grid */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-500" />
                Campus Blocks Digital Telemetry Snapshot
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any building to view detailed health, energy, solar & AI predictions
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('campus_map')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Open Interactive Map →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildings.map((b) => (
              <div
                key={b.id}
                onClick={() => onSelectBuilding(b.id)}
                className="group cursor-pointer rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-4 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                    {b.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      b.status === 'green'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : b.status === 'yellow'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}
                  >
                    Rating {b.efficiencyRating}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Energy Load</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {b.currentEnergyKwh} kWh
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Water Flow</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {b.currentWaterLiters.toLocaleString()} L
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
