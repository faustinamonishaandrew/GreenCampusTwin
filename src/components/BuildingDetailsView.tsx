import React, { useState } from 'react';
import {
  Building2,
  Zap,
  Droplet,
  Trash2,
  Wind,
  Sun,
  Flame,
  Award,
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Building, TelemetryDataPoint, Recommendation, Anomaly } from '../types';
import { formatCurrencyINR } from '../utils/aiEngine';

interface BuildingDetailsViewProps {
  building: Building;
  telemetryHistory: TelemetryDataPoint[];
  recommendations: Recommendation[];
  anomalies: Anomaly[];
  onBack: () => void;
  onApplyRecommendation: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const BuildingDetailsView: React.FC<BuildingDetailsViewProps> = ({
  building,
  telemetryHistory,
  recommendations,
  anomalies,
  onBack,
  onApplyRecommendation,
  onNavigateToTab,
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | 'weekly' | 'monthly' | '365d'>('monthly');

  // Filter telemetry history based on selected time range
  const filteredData = React.useMemo(() => {
    if (!telemetryHistory.length) return [];
    if (timeRange === '24h') return telemetryHistory.slice(-24);
    if (timeRange === 'weekly') return telemetryHistory.slice(-7);
    if (timeRange === 'monthly') return telemetryHistory.slice(-30);
    return telemetryHistory; // 365 days
  }, [telemetryHistory, timeRange]);

  const buildingAnomalies = anomalies.filter((a) => a.buildingId === building.id);
  const buildingRecs = recommendations.filter((r) => r.buildingId === building.id);

  return (
    <div className="space-y-6 pb-8">
      {/* Back Button & Building Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
            title="Return to Overview"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {building.code} • {building.category}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  building.status === 'green'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}
              >
                Status: {building.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {building.name} Digital Telemetry
            </h1>
          </div>
        </div>

        {/* Building Specs Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 px-3.5 py-2 border border-slate-200/80 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Area Sq Ft</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {building.areaSqFt.toLocaleString()} sq.ft
            </span>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 px-3.5 py-2 border border-slate-200/80 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Floors & Age</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {building.floors} Floors (Built {building.yearBuilt})
            </span>
          </div>
          <div className="rounded-2xl bg-emerald-500 text-white px-4 py-2 font-bold shadow-md shadow-emerald-500/20">
            Efficiency Rating {building.efficiencyRating}
          </div>
        </div>
      </div>

      {/* 8 Live Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Energy Load</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {building.currentEnergyKwh} kWh
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Droplet className="h-3.5 w-3.5 text-blue-500" />
            <span>Water Inflow</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {building.currentWaterLiters.toLocaleString()} L
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Trash2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Solid Waste</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {building.currentWasteKg} kg
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Wind className="h-3.5 w-3.5 text-cyan-500" />
            <span>Air AQI</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {building.currentAqi} AQI
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            <span>Solar Cap</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {building.solarCapacityKw} kW
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>Carbon</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {building.currentCarbonKg} kg
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Flame className="h-3.5 w-3.5 text-red-400" />
            <span>Indoor Temp</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {building.currentTemperatureC}°C
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Occupancy</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {building.currentOccupancy} / {building.occupancyCapacity}
          </div>
        </div>
      </div>

      {/* Historical Telemetry Recharts Multi-Axis Chart */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Historical Consumption & Carbon Telemetry Trends
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive multi-axis time-series chart showing energy (kWh), water (L), and solar output
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                timeRange === '24h'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                timeRange === 'weekly'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                timeRange === 'monthly'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('365d')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                timeRange === '365d'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              365 Days
            </button>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#F59E0B" fontSize={11} tickLine={false} unit=" kWh" />
              <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" fontSize={11} tickLine={false} unit=" L" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="energyKwh" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Energy (kWh)" />
              <Line yAxisId="right" type="monotone" dataKey="waterLiters" stroke="#3B82F6" strokeWidth={2.5} name="Water (Liters)" />
              <Line yAxisId="left" type="monotone" dataKey="solarGenerationKwh" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="Solar Gen (kWh)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Building Specific AI Recommendations & Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Prescriptions */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Building Specific AI Prescriptions
          </h2>

          <div className="space-y-3">
            {buildingRecs.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 text-xs text-slate-500">
                All telemetry within optimal limits. No active building recommendations needed.
              </div>
            ) : (
              buildingRecs.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-4 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {r.title}
                    </span>
                    <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {r.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {r.description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Est. Savings: {formatCurrencyINR(r.estimatedSavingsInr)} / year
                    </span>
                    <button
                      onClick={() => onApplyRecommendation(r.id)}
                      disabled={r.applied}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                        r.applied
                          ? 'bg-emerald-500/20 text-emerald-600 cursor-default'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow'
                      }`}
                    >
                      {r.applied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Applied
                        </>
                      ) : (
                        'Execute Rule'
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Active Anomalies Log */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Active Isolation Forest Alerts
          </h2>

          <div className="space-y-3">
            {buildingAnomalies.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-700/30 rounded-2xl">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                No active anomalies recorded for this building block.
              </div>
            ) : (
              buildingAnomalies.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-4 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{a.title}</span>
                    <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-red-500/10 text-red-600">
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{a.description}</p>
                  <div className="text-[11px] font-mono text-slate-400">
                    Observed: {a.valueObserved} (Baseline: {a.thresholdExpected})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
