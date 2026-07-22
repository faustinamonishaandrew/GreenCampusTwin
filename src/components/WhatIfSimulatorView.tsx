import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sun,
  TreePine,
  Zap,
  Droplet,
  Flame,
  DollarSign,
  TrendingUp,
  Sparkles,
  RotateCcw,
  Award,
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
} from 'recharts';
import { WhatIfParams, WhatIfResult, SustainabilityScores } from '../types';
import { runWhatIfSimulation, formatCurrencyINR } from '../utils/aiEngine';

interface WhatIfSimulatorViewProps {
  currentScores: SustainabilityScores;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  currentScores,
}) => {
  const [params, setParams] = useState<WhatIfParams>({
    solarKw: 150,
    treeCount: 500,
    ledRetrofitPct: 75,
    rainwaterHarvestingLiters: 40000,
    smartIrrigationEnabled: true,
    highEfficiencyAcCount: 30,
  });

  const [result, setResult] = useState<WhatIfResult>(() =>
    runWhatIfSimulation(params, currentScores)
  );

  useEffect(() => {
    setResult(runWhatIfSimulation(params, currentScores));
  }, [params, currentScores]);

  const handleReset = () => {
    setParams({
      solarKw: 0,
      treeCount: 0,
      ledRetrofitPct: 0,
      rainwaterHarvestingLiters: 0,
      smartIrrigationEnabled: false,
      highEfficiencyAcCount: 0,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" /> Interactive Eco Sandbox
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            What-If Sustainability Intervention Simulator
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Simulate capital investments in solar, LED, rainwater harvesting & smart IoT to model ROI & carbon reduction
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 border border-slate-700 transition"
        >
          <RotateCcw className="h-4 w-4" /> Reset Sliders
        </button>
      </div>

      {/* Main Grid: Intervention Sliders + Real-Time Financial/Environmental Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Parameter Sliders */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
            Configure Intervention Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Solar PV Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5 text-amber-500">
                  <Sun className="h-4 w-4" /> Solar PV Capacity
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {params.solarKw} kW
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={params.solarKw}
                onChange={(e) => setParams({ ...params, solarKw: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block">
                Generates ~{(params.solarKw * 1400).toLocaleString()} kWh clean energy / yr
              </span>
            </div>

            {/* Tree Plantation Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <TreePine className="h-4 w-4" /> Tree Sapling Plantation
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {params.treeCount} Trees
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={params.treeCount}
                onChange={(e) => setParams({ ...params, treeCount: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block">
                Absorbs ~{(params.treeCount * 22).toLocaleString()} kg CO2 / yr
              </span>
            </div>

            {/* LED Retrofit Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="h-4 w-4" /> LED Smart Lighting Upgrade
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {params.ledRetrofitPct}% Coverage
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={params.ledRetrofitPct}
                onChange={(e) => setParams({ ...params, ledRetrofitPct: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block">
                Reduces lighting energy load by up to 45%
              </span>
            </div>

            {/* Rainwater Harvesting Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5 text-blue-500">
                  <Droplet className="h-4 w-4" /> Rainwater Storage Capacity
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {params.rainwaterHarvestingLiters.toLocaleString()} L
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={params.rainwaterHarvestingLiters}
                onChange={(e) => setParams({ ...params, rainwaterHarvestingLiters: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block">
                Saves municipal water supply costs
              </span>
            </div>

            {/* High-Efficiency Inverter ACs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5 text-purple-500">
                  <Flame className="h-4 w-4" /> Inverter AC Retrofits
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {params.highEfficiencyAcCount} Units
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={params.highEfficiencyAcCount}
                onChange={(e) => setParams({ ...params, highEfficiencyAcCount: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Smart Irrigation Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                  Smart Soil Moisture Irrigation
                </span>
                <span className="text-[10px] text-slate-400">
                  Automated valves based on real-time soil telemetry
                </span>
              </div>
              <input
                type="checkbox"
                checked={params.smartIrrigationEnabled}
                onChange={(e) => setParams({ ...params, smartIrrigationEnabled: e.target.checked })}
                className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Real-time Projected Financial & Score Impact */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-green-700 p-6 text-white shadow-xl space-y-5">
          <div className="border-b border-emerald-500/40 pb-3">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider block">
              Simulated Outcome Matrix
            </span>
            <h3 className="text-xl font-extrabold">Estimated Financial & Eco ROI</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Total Capex */}
            <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-emerald-100 uppercase font-bold block">Estimated Capital Investment (Capex)</span>
              <span className="text-2xl font-black">{formatCurrencyINR(result.totalCapexInr)}</span>
            </div>

            {/* Annual Savings */}
            <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-emerald-100 uppercase font-bold block">Annual Utility Savings</span>
              <span className="text-2xl font-black text-emerald-200">{formatCurrencyINR(result.annualSavingsInr)} / yr</span>
            </div>

            {/* Payback Period */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md border border-white/10">
                <span className="text-[10px] text-emerald-100 uppercase font-bold block">ROI Payback</span>
                <span className="text-lg font-bold">{result.roiYears} Years</span>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md border border-white/10">
                <span className="text-[10px] text-emerald-100 uppercase font-bold block">CO2 Reduction</span>
                <span className="text-lg font-bold">{(result.carbonReductionKg / 1000).toFixed(1)} Tons</span>
              </div>
            </div>

            {/* Updated Score */}
            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-md border border-white/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-100 uppercase font-bold block">New Twin Score</span>
                <span className="text-3xl font-black">{result.newSustainabilityScore} / 100</span>
              </div>
              <span className="rounded-full bg-emerald-400 text-slate-900 px-2.5 py-1 text-xs font-black">
                +{result.scoreImprovementPoints} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Year Payback Cash Flow Chart */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          10-Year Cumulative Cash Flow & Break-Even Analysis
        </h2>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={result.paybackTimeline}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `Yr ${val}`} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#FFF',
                }}
              />
              <Bar dataKey="cumulativeSavingsInr" fill="#22C55E" radius={[6, 6, 0, 0]} name="Cumulative Savings (INR)" />
              <Line type="monotone" dataKey="netCashFlowInr" stroke="#3B82F6" strokeWidth={3} name="Net Break-Even Flow (INR)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
