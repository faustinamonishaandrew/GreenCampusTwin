import React, { useEffect, useState } from 'react';
import { Leaf, Sparkles, Loader2 } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2500,
}) => {
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    // Start fade out slightly before completion
    const fadeOutTimer = setTimeout(() => {
      setFadeState('out');
    }, Math.max(durationMs - 400, 1000));

    const finishTimer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 transition-opacity duration-500 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white select-none ${
        fadeState === 'out' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Spacer */}
      <div className="h-10" />

      {/* Center Content: Animated Logo & Title */}
      <div className="flex flex-col items-center text-center space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Animated Official Green Campus Logo */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-emerald-500/30 blur-2xl animate-ping" />
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-2xl shadow-emerald-500/40 ring-4 ring-emerald-500/20 transform transition duration-500 hover:scale-105">
            <Leaf className="h-12 w-12 sm:h-14 sm:w-14 animate-bounce" />
          </div>
        </div>

        {/* Branding Typography */}
        <div className="space-y-2 max-w-lg">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Green Campus Digital Twin
          </h1>
          <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            AI Sustainability Command Center
          </p>
        </div>

        {/* Circular Loading Animation */}
        <div className="pt-4 flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <div className="absolute h-6 w-6 rounded-full bg-emerald-500/10 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
            Initializing Command Center...
          </span>
        </div>
      </div>

      {/* Bottom Footer Text */}
      <div className="text-center space-y-1 relative z-10 text-xs font-medium text-slate-500 dark:text-slate-400">
        <p className="font-mono text-[11px] tracking-wider text-slate-600 dark:text-slate-300 font-bold">
          Version 1.0
        </p>
        <p className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
          Powered by Greenie AI 🌿
        </p>
      </div>
    </div>
  );
};
