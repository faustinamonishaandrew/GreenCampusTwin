import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  AlertCircle,
  ShieldCheck,
  Building2,
  Wrench,
  User,
  Check,
  Leaf,
  HelpCircle,
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, role?: string) => void;
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
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    onLogin(email.trim(), 'admin');
  };

  const handleQuickDemoRole = (demoEmail: string, roleKey: string) => {
    setEmail(demoEmail);
    setPassword('demo123456');
    setError(null);
    onLogin(demoEmail, roleKey);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 p-4 transition-colors relative overflow-hidden select-none">
      {/* Background Glow Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar: Theme Toggle */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-md shadow-emerald-500/20">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-extrabold tracking-tight text-sm text-slate-900 dark:text-white">
            LICET COMMAND CENTER
          </span>
        </div>

        {/* Theme Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-1 rounded-2xl text-xs font-bold shadow-sm">
          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              themeMode === 'light'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Light</span>
          </button>
          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              themeMode === 'dark'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Dark</span>
          </button>
          <button
            type="button"
            onClick={() => setThemeMode('system')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              themeMode === 'system'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">System</span>
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 shadow-2xl rounded-3xl p-6 sm:p-8 space-y-5 relative z-10 my-6 animate-in fade-in zoom-in-95 duration-300 backdrop-blur-xl">
        {/* Logo & Header Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/20 transform transition hover:scale-105">
            <Leaf className="h-8 w-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Green Campus Digital Twin
            </h1>
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              AI Sustainability Command Center
            </p>
          </div>

          <div className="pt-2">
            <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to access your campus sustainability dashboard.
            </p>
          </div>
        </div>

        {/* Validation Error Alert */}
        {error && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="admin@licet.ac.in"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
            >
              Forgot Password? (Demo)
            </button>
          </div>

          {/* Primary Login Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            <span>LOGIN TO COMMAND CENTER</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest absolute">
            QUICK DEMO ACCESS
          </span>
        </div>

        {/* Quick Demo Role Buttons Grid */}
        <div className="space-y-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemoRole('admin@licet.ac.in', 'admin')}
            className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold transition flex items-center gap-3"
          >
            <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <div className="font-extrabold">Login as Administrator</div>
              <div className="text-[10px] text-slate-400 font-mono">admin@licet.ac.in</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoRole('manager@licet.ac.in', 'sustainability_officer')}
            className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold transition flex items-center gap-3"
          >
            <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <div className="font-extrabold">Login as Campus Manager</div>
              <div className="text-[10px] text-slate-400 font-mono">manager@licet.ac.in</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoRole('facility@licet.ac.in', 'facility_manager')}
            className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold transition flex items-center gap-3"
          >
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <div className="font-extrabold">Login as Facility Manager</div>
              <div className="text-[10px] text-slate-400 font-mono">facility@licet.ac.in</div>
            </div>
          </button>

          <button
            type="button"
            onClick={onGuestLogin}
            className="w-full p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold transition flex items-center gap-3"
          >
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-500 shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left flex-1">
              <div className="font-extrabold">Continue as Guest</div>
              <div className="text-[10px] opacity-80">Explore with LICET sample telemetry data</div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Copyright */}
      <footer className="text-center text-xs text-slate-400 font-medium py-2 z-10">
        © 2026 Green Campus Digital Twin
      </footer>

      {/* Forgot Password Demo Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <HelpCircle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Demo Mode Notice
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Password recovery is simulated for this national hackathon demonstration. You may enter any non-empty password or use the Quick Demo Login buttons above.
              </p>
            </div>

            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
