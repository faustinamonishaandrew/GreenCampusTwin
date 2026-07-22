import React, { useEffect, useState } from 'react';
import { Leaf, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

const LOADING_STEPS = [
  'Connecting to Green Campus...',
  'Loading environmental data...',
  'Initializing Greenie AI...',
  'Preparing Digital Twin...',
  'Generating Dashboard...',
  'Loading complete.',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  durationMs = 2500,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const stepIntervalMs = durationMs / LOADING_STEPS.length;

    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex < LOADING_STEPS.length - 1) {
          return prevIndex + 1;
        }
        return prevIndex;
      });
    }, stepIntervalMs);

    const completionTimer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(completionTimer);
    };
  }, [durationMs, onComplete]);

  const currentStepText = LOADING_STEPS[currentStepIndex];
  const progressPct = Math.round(((currentStepIndex + 1) / LOADING_STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white select-none transition-colors">
      {/* Background Decorative Glow */}
      <div className="absolute w-[450px] h-[450px] bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute w-72 h-72 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Center Card */}
      <div className="w-full max-w-sm rounded-3xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 relative z-10 animate-in zoom-in-95 duration-300">
        {/* Animated Logo */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/20 animate-pulse">
          <Leaf className="h-10 w-10 animate-bounce" />
        </div>

        {/* Status Messaging */}
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <span>Green Campus Twin</span>
          </h2>

          <div className="min-h-[28px] flex items-center justify-center">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono transition-all duration-300 flex items-center gap-1.5">
              {currentStepIndex === LOADING_STEPS.length - 1 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              )}
              {currentStepText}
            </span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 pt-2">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
            <span>Initializing Engine</span>
            <span className="text-emerald-500">{progressPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
