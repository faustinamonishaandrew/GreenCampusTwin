import React, { useState } from 'react';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Leaf,
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string) => void;
  onGuestLogin: () => void;
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onGuestLogin,
  themeMode,
  setThemeMode,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate 1.5 second loading authentication delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email.trim());
    }, 1500);
  };

  const handleGuest = () => {
    onGuestLogin();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 transition-colors relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Controls: Theme Mode Switcher */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shadow-sm z-10">
        <button
          onClick={() => setThemeMode('light')}
          title="Light Mode"
          className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            themeMode === 'light'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">Light</span>
        </button>

        <button
          onClick={() => setThemeMode('dark')}
          title="Dark Mode"
          className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            themeMode === 'dark'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Dark</span>
        </button>

        <button
          onClick={() => setThemeMode('system')}
          title="System Mode"
          className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            themeMode === 'system'
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Laptop className="h-4 w-4" />
          <span className="hidden sm:inline">System</span>
        </button>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[28px] p-6 sm:p-8 space-y-6 relative z-10 my-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Logo & App Name Branding */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/20 animate-pulse">
            <Leaf className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Green Campus Digital Twin
            </h1>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI Sustainability Command Center
            </p>
          </div>
        </div>

        {/* Error Alert Message */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              University / Corporate Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="sustainability@greencampus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition font-medium disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">
                Password
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Demo Mode (Any password)</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition font-medium disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/70 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Authenticating Command Center...</span>
              </>
            ) : (
              <>
                <span>Log In to Command Center</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
            OR
          </span>
        </div>

        {/* Continue as Guest Button */}
        <button
          type="button"
          onClick={handleGuest}
          disabled={isLoading}
          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <div className="text-left">
            <span className="block leading-none">Continue as Guest</span>
          </div>
        </button>

        {/* Demo Footer Info */}
        <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1 border-t border-slate-100 dark:border-slate-800/80">
          <p className="flex items-center justify-center gap-1 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Hackathon MVP Simulation Mode
          </p>
          <p className="text-[10px]">No real backend auth required • Instant Access</p>
        </div>
      </div>
    </div>
  );
};
