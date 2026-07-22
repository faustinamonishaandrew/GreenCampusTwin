import React, { useState } from 'react';
import {
  Lightbulb,
  DollarSign,
  Sparkles,
  Zap,
  Droplet,
  Sun,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Recommendation } from '../types';
import { formatCurrencyINR } from '../utils/aiEngine';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  onApplyRecommendation: (id: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  onApplyRecommendation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = recommendations.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  const totalPotentialSavingsInr = recommendations.reduce((acc, r) => acc + r.estimatedSavingsInr, 0);
  const totalPotentialCarbonSaved = recommendations.reduce((acc, r) => acc + r.estimatedCarbonSavedKg, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" /> Prescriptive AI Optimization Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            AI Sustainability Action Plan & ROI Recommendations
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Calculated financial savings in ₹ INR, carbon footprint reductions, and payback timelines
          </p>
        </div>

        {/* Aggregated Potential Stats */}
        <div className="flex items-center gap-4 bg-slate-800/80 rounded-2xl p-3 border border-slate-700 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Savings</span>
            <span className="text-lg font-extrabold text-emerald-400">
              {formatCurrencyINR(totalPotentialSavingsInr)}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-slate-700"></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">CO2 Offset</span>
            <span className="text-lg font-extrabold text-blue-300">
              {(totalPotentialCarbonSaved / 1000).toFixed(1)} Tons/yr
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white dark:bg-slate-800/90 p-3 border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
        <span className="font-bold text-slate-400 mr-2">Category:</span>
        {['all', 'energy', 'water', 'solar', 'hvac', 'waste'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold capitalize transition ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className={`rounded-3xl bg-white dark:bg-slate-800/90 p-5 border shadow-sm transition space-y-4 flex flex-col justify-between ${
              rec.applied
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-500/60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {rec.buildingName} • {rec.category.toUpperCase()}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    rec.priority === 'urgent' || rec.priority === 'high'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {rec.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {rec.description}
              </p>
            </div>

            {/* Financial & Environmental ROI Tile */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/40 p-2.5 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Money Saved</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyINR(rec.estimatedSavingsInr)}/yr
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/40 p-2.5 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Carbon Saved</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    {rec.estimatedCarbonSavedKg.toLocaleString()} kg
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/40 p-2.5 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Payback</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {rec.paybackPeriodMonths} Mo
                  </span>
                </div>
              </div>

              <button
                onClick={() => onApplyRecommendation(rec.id)}
                disabled={rec.applied}
                className={`w-full py-2.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                  rec.applied
                    ? 'bg-emerald-500/20 text-emerald-600 cursor-default'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                }`}
              >
                {rec.applied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Recommendation Applied to Digital Twin
                  </>
                ) : (
                  <>
                    Apply Automation & Strategy <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
