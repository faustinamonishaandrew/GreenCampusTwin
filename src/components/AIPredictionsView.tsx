import React, { useState } from 'react';
import {
  TrendingUp,
  Zap,
  Droplet,
  Trash2,
  Sparkles,
  BarChart3,
  Cpu,
  BrainCircuit,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { PredictionSummary, ModelMetrics } from '../types';
import { SAMPLE_PREDICTED_ANOMALIES, SAMPLE_MULTI_HORIZON_FORECASTS } from '../data/mockData';

interface AIPredictionsViewProps {
  prediction: PredictionSummary;
  modelMetrics: ModelMetrics[];
}

export const AIPredictionsView: React.FC<AIPredictionsViewProps> = ({
  prediction,
  modelMetrics,
}) => {
  const [forecastHorizon, setForecastHorizon] = useState<'24h' | '7d' | '30d'>('24h');

  // Simulated 7-day & 30-day forecast data
  const multiHorizon = SAMPLE_MULTI_HORIZON_FORECASTS;

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5" /> XGBoost & Random Forest ML Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            AI Predictive Forecasting & Pre-Hazard Warning
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Multi-horizon forecasts (Tomorrow, Next Week, Next Month) and early anomaly predictions before faults occur.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 rounded-2xl p-3 border border-slate-700 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Model R² Score</div>
            <div className="text-lg font-extrabold text-emerald-400">{prediction.modelAccuracyR2}</div>
          </div>
          <div className="h-8 w-[1px] bg-slate-700"></div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Confidence Band</div>
            <div className="text-lg font-extrabold text-indigo-300">± 7.8%</div>
          </div>
        </div>
      </div>

      {/* Predicted Anomalies Section (Req #4) */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Predictive Anomaly Warnings (Pre-Hazard Lead Time: 18h – 48h)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Predicting abnormal consumption shifts & component trips before thresholds are breached.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {SAMPLE_PREDICTED_ANOMALIES.length} Pre-Hazard Risks Flagged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_PREDICTED_ANOMALIES.map((pa) => (
            <div
              key={pa.id}
              className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 hover:border-amber-500/40 transition"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  {pa.buildingName}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">
                  {pa.probabilityPct}% Risk
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {pa.anomalyType}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-amber-500/10">
                <span>Predicted Timeframe: <strong className="text-slate-700 dark:text-slate-300">{pa.expectedTimeframe}</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{pa.preventiveAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Tomorrow Prediction KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tomorrow Energy */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tomorrow Energy</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {prediction.tomorrowEnergyKwh.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">kWh</span>
          </div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {prediction.energyChangePct > 0 ? `+${prediction.energyChangePct}%` : `${prediction.energyChangePct}%`} shift predicted
          </div>
        </div>

        {/* Tomorrow Water */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tomorrow Water</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Droplet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {prediction.tomorrowWaterLiters.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {prediction.waterChangePct > 0 ? `+${prediction.waterChangePct}%` : `${prediction.waterChangePct}%`} shift predicted
          </div>
        </div>

        {/* Tomorrow Waste */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tomorrow Waste</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Trash2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {prediction.tomorrowWasteKg.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {prediction.wasteChangePct > 0 ? `+${prediction.wasteChangePct}%` : `${prediction.wasteChangePct}%`} shift predicted
          </div>
        </div>

        {/* Tomorrow Carbon */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tomorrow Carbon</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {prediction.tomorrowCarbonKg.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">kg CO₂</span>
          </div>
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
            {prediction.carbonChangePct > 0 ? `+${prediction.carbonChangePct}%` : `${prediction.carbonChangePct}%`} shift predicted
          </div>
        </div>
      </div>

      {/* Main Forecast Chart (24h or 7 Days) */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              ML Projected Load & Confidence Upper/Lower Bounds
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing XGBoost forecasted consumption vs 95% upper and lower error bounds
            </p>
          </div>

          <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setForecastHorizon('24h')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                forecastHorizon === '24h'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              24h Hourly Curve
            </button>
            <button
              onClick={() => setForecastHorizon('7d')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                forecastHorizon === '7d'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              7-Day Horizon
            </button>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {forecastHorizon === '24h' ? (
              <ComposedChart data={prediction.hourlyForecast}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" kWh" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172033',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#F9FAFB',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="upperBoundKwh" stroke="none" fill="#06B6D4" fillOpacity={0.15} name="Upper Bound (kWh)" />
                <Line type="monotone" dataKey="predictedEnergyKwh" stroke="#06B6D4" strokeWidth={3} dot={false} name="Forecasted kWh" />
                <Line type="monotone" dataKey="lowerBoundKwh" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Lower Bound (kWh)" />
              </ComposedChart>
            ) : (
              <BarChart data={multiHorizon[0]?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="period" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" kWh" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#172033',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#F9FAFB',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="predicted" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Forecasted kWh" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Importance Breakdown */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-500" />
          XGBoost Model Feature Importance Analysis
        </h2>

        <div className="space-y-3">
          {prediction.featuresUsed.map((feat) => (
            <div key={feat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{feat.name}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{feat.importancePct}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                  style={{ width: `${feat.importancePct}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
