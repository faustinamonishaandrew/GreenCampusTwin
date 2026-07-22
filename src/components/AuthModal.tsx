import React, { useState } from 'react';
import { Shield, Mail, Lock, X, CheckCircle2, UserCheck, KeyRound } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectRole: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectRole,
}) => {
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [isForgot, setIsForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-2">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Firebase Authentication Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Green Campus Digital Twin Command Center
          </p>
        </div>

        {isForgot ? (
          <div className="space-y-4 text-xs">
            {resetSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-center font-bold">
                Password reset link dispatched to {email}!
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-300">
                  Enter your university email address to receive password reset instructions.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-700/50 p-3 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="admin@greencampus.edu"
                />
                <button
                  onClick={() => setResetSent(true)}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition shadow"
                >
                  Send Reset Link
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setIsForgot(false);
                setResetSent(false);
              }}
              className="w-full text-center text-slate-400 hover:underline pt-2"
            >
              ← Return to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Demo Role Switcher */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Demo Switcher
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { role: 'admin', label: 'Admin' },
                  { role: 'sustainability_officer', label: 'Eco Officer' },
                  { role: 'facility_manager', label: 'Facility Mgr' },
                  { role: 'student_auditor', label: 'Auditor' },
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      onSelectRole(item.role as UserRole);
                      onClose();
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border transition text-left ${
                      currentUser.role === item.role
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow'
                        : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-700/50 p-2.5 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-700/50 p-2.5 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setIsForgot(true)}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  Forgot Password?
                </button>
                <span className="text-slate-400">Firebase Auth Secured</span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition shadow-lg shadow-emerald-500/20"
              >
                Sign In & Launch Command Center
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
