import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  BrainCircuit,
  RotateCw,
  Plus,
  CheckCircle2,
  Sliders,
  Activity,
  UserCheck,
} from 'lucide-react';
import { Building, ModelMetrics, UserRole } from '../types';

interface AdminPanelViewProps {
  buildings: Building[];
  modelMetrics: ModelMetrics[];
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onRetrainModels: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  buildings,
  modelMetrics,
  currentRole,
  onChangeRole,
  onRetrainModels,
}) => {
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      onRetrainModels();
      setIsRetraining(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Control Room
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Twin Administration & Model Management
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Configure IoT sensor thresholds, manage user access permissions, and retrain ML models
          </p>
        </div>
      </div>

      {/* Role Switcher Toolbar */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-emerald-500" /> Switch Active Role Persona
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { id: 'admin', label: 'System Admin', desc: 'Full permissions' },
            { id: 'sustainability_officer', label: 'Sustainability Officer', desc: 'Audit & recommendations' },
            { id: 'facility_manager', label: 'Facility Manager', desc: 'Building telemetry & alerts' },
            { id: 'student_auditor', label: 'Student Auditor', desc: 'Read-only access' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => onChangeRole(r.id as UserRole)}
              className={`p-3 rounded-2xl text-left border transition ${
                currentRole === r.id
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-700/40 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <div className="font-bold">{r.label}</div>
              <div className={`text-[10px] ${currentRole === r.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                {r.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Models Performance & Re-training Suite */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-indigo-500" />
              Machine Learning Models Status & Re-Training
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Random Forest, XGBoost, and Isolation Forest models trained on 365-day dataset
            </p>
          </div>

          <button
            onClick={handleRetrain}
            disabled={isRetraining}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow transition hover:scale-105"
          >
            <RotateCw className={`h-4 w-4 ${isRetraining ? 'animate-spin' : ''}`} />
            {isRetraining ? 'Re-Training Models...' : 'Re-Train All ML Models'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modelMetrics.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-4 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{m.name}</span>
                <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 font-bold text-[10px]">
                  {m.status.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                {m.algorithm}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block">R² Score</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{m.r2Score}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">MAE Error</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.mae}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Dataset Rows</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.totalDatasetRows}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Buildings Manager List */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-500" />
            Registered Campus Blocks ({buildings.length})
          </h2>
        </div>

        <div className="space-y-2 text-xs">
          {buildings.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700/60"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{b.name}</span>
                <span className="text-slate-400 ml-2">({b.code})</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span>Solar: {b.solarCapacityKw} kW</span>
                <span>Rating: {b.efficiencyRating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
