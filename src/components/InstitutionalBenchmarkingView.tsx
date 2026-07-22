import React from 'react';
import {
  Award,
  Trophy,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { InstitutionalBenchmarkData, SustainabilityScores } from '../types';
import { SAMPLE_BENCHMARK_DATA } from '../data/mockData';
import { formatCurrencyINR } from '../utils/aiEngine';

interface BenchmarkingProps {
  scores: SustainabilityScores;
}

export const InstitutionalBenchmarkingView: React.FC<BenchmarkingProps> = ({ scores }) => {
  const benchmark: InstitutionalBenchmarkData = {
    ...SAMPLE_BENCHMARK_DATA,
    campusScore: scores.overall,
  };

  const benchmarksList = [
    { name: 'Your Campus (Green Twin)', score: benchmark.campusScore, isCurrent: true, color: 'emerald' },
    { name: 'Top Green Certified Campus (LEED Platinum)', score: benchmark.topGreenCertifiedScore, isCurrent: false, color: 'purple' },
    { name: 'Similar Regional Universities', score: benchmark.similarCollegesScore, isCurrent: false, color: 'blue' },
    { name: 'National University Average', score: benchmark.nationalAverageScore, isCurrent: false, color: 'amber' },
    { name: 'State Academic Average', score: benchmark.stateAverageScore, isCurrent: false, color: 'slate' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/20">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Institutional Sustainability Benchmarking
              </h2>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Ranked #3 Regional
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compare campus sustainability scores against 140 regional institutions, national averages & LEED Platinum top campuses.
            </p>
          </div>
        </div>
      </div>

      {/* Ranks Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Overall Rank
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            #{benchmark.rankings.overallRank} <span className="text-xs font-normal text-slate-400">/ 140</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Energy Rank
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            #{benchmark.rankings.energyRank}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Carbon Rank
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            #{benchmark.rankings.carbonRank}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Water Rank
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            #{benchmark.rankings.waterRank}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Waste Rank
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            #{benchmark.rankings.wasteRank}
          </div>
        </div>
      </div>

      {/* Benchmarking Comparison Chart / Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Comparison Leaderboard */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional Peer Score Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your campus leads state and national averages by +16.0 points.
            </p>
          </div>

          <div className="space-y-4">
            {benchmarksList.map((bm, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className={bm.isCurrent ? 'text-emerald-500 font-extrabold flex items-center gap-1' : 'text-slate-700 dark:text-slate-300'}>
                    {bm.name} {bm.isCurrent && '(Your Twin)'}
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white">{bm.score} / 100</span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      bm.isCurrent
                        ? 'bg-emerald-500 shadow-md shadow-emerald-500/50'
                        : bm.color === 'purple'
                        ? 'bg-purple-500'
                        : bm.color === 'blue'
                        ? 'bg-blue-500'
                        : bm.color === 'amber'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${bm.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Path to #1 Rank Action Plan */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Roadmap to #1 LEED Platinum Rank
                </h3>
                <p className="text-[11px] text-slate-500">
                  Gap to top campus: <span className="font-bold text-amber-500">8.0 Points</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {benchmark.requiredActionsToReachNextRank.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span>{act.title}</span>
                    <span className="text-emerald-500 font-mono">+{act.scoreGain} pts</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Est. Capex: {formatCurrencyINR(act.estimatedCostInr)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-semibold flex items-center justify-between">
            <span>Executing these 3 steps elevates campus score to 92.5/100</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
