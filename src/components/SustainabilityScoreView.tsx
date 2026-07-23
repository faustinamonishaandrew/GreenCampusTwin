import React from 'react';
import {
  Award,
  Zap,
  Droplet,
  Trash2,
  Wind,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { SustainabilityScores } from '../types';

interface SustainabilityScoreViewProps {
  scores: SustainabilityScores;
}

export const SustainabilityScoreView: React.FC<SustainabilityScoreViewProps> = ({
  scores,
}) => {
  const radarData = [
    { dimension: 'Energy', campus: scores.energy, nationalAvg: 68 },
    { dimension: 'Water', campus: scores.water, nationalAvg: 70 },
    { dimension: 'Waste', campus: scores.waste, nationalAvg: 62 },
    { dimension: 'Air Quality', campus: scores.airQuality, nationalAvg: 75 },
    { dimension: 'Carbon Offset', campus: scores.carbon, nationalAvg: 60 },
  ];

  const historicalData = [
    { month: 'Jan', score: 74 },
    { month: 'Feb', score: 76 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 79 },
    { month: 'May', score: 81 },
    { month: 'Jun', score: scores.overall },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" /> ISO 50001 & AASHE STARS Standard
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Campus Sustainability Score Hub
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Integrated evaluation across energy efficiency, water recycling, zero waste, air quality & net-zero carbon
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Benchmark Rating</span>
            <span className="text-xl font-extrabold text-emerald-400">+{scores.benchmarkComparisonPct}% Superior</span>
          </div>
        </div>
      </div>

      {/* Main Score Overview: Radial Score Gauge + 5 Dimension Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Circular Progress Hero Tile */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-800 p-8 text-white shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-100">
            Overall Twin Score
          </span>

          <div className="relative flex items-center justify-center h-44 w-44">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="10"
                className="text-emerald-900/40"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="10"
                className="text-white transition-all duration-1000 ease-out"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * scores.overall) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black tracking-tighter">{scores.overall}</span>
              <span className="text-xs text-emerald-100 font-bold">OUT OF 100</span>
            </div>
          </div>

          <div className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white border border-white/30 backdrop-blur-md">
            Grade {scores.grade} • Exemplary Green Rating
          </div>
        </div>

        {/* Right 2 Cols: 5 Dimension Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Energy */}
          <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Zap className="h-4 w-4 text-amber-500" /> Energy Efficiency (30%)
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">{scores.energy}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${scores.energy}%` }}></div>
            </div>
          </div>

          {/* Water */}
          <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Droplet className="h-4 w-4 text-blue-500" /> Water Recycling (20%)
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">{scores.water}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${scores.water}%` }}></div>
            </div>
          </div>

          {/* Waste */}
          <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Trash2 className="h-4 w-4 text-emerald-500" /> Zero Waste Diversion (15%)
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">{scores.waste}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${scores.waste}%` }}></div>
            </div>
          </div>

          {/* Air Quality */}
          <div className="rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Wind className="h-4 w-4 text-cyan-500" /> Indoor AQI Cleanliness (15%)
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">{scores.airQuality}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${scores.airQuality}%` }}></div>
            </div>
          </div>

          {/* Carbon */}
          <div className="sm:col-span-2 rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Sparkles className="h-4 w-4 text-purple-500" /> Net-Zero Carbon Offset Factor (20%)
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">{scores.carbon}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-purple-500" style={{ width: `${scores.carbon}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart & Benchmark Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Comparison Chart */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-500" />
            Global & Regional Green Campus Benchmarks
          </h2>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" strokeDasharray="3 3" opacity={0.3} />
                <PolarAngleAxis dataKey="dimension" stroke="#94A3B8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" fontSize={10} />
                <Radar name="This Campus" dataKey="campus" stroke="#6EE7B7" fill="#6EE7B7" fillOpacity={0.4} />
                <Radar name="National Avg" dataKey="nationalAvg" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Score Progression */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            6-Month Twin Score Improvement Path
          </h2>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17142e',
                    borderColor: '#2b2450',
                    borderRadius: '12px',
                    color: '#FFF',
                  }}
                />
                <Bar dataKey="score" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Score / 100" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
