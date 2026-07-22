import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ShieldAlert,
  Wrench,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Anomaly, AnomalySeverity } from '../types';

interface AnomaliesViewProps {
  anomalies: Anomaly[];
  onResolveAnomaly: (id: string) => void;
  onSimulateAnomalyTrigger: () => void;
}

export const AnomaliesView: React.FC<AnomaliesViewProps> = ({
  anomalies,
  onResolveAnomaly,
  onSimulateAnomalyTrigger,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = anomalies.filter((a) => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const criticalCount = anomalies.filter((a) => a.severity === 'critical' && a.status !== 'resolved').length;
  const highCount = anomalies.filter((a) => a.severity === 'high' && a.status !== 'resolved').length;

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Isolation Forest Anomaly Matrix
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            AI Anomaly & Fault Detection Center
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Real-time automated detection for electricity surges, water leaks, HVAC trips & carbon spikes
          </p>
        </div>

        {/* Live Trigger Action for Demo */}
        <button
          onClick={onSimulateAnomalyTrigger}
          className="flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/30 transition hover:scale-105"
        >
          <Zap className="h-4 w-4" />
          Trigger Test Anomaly (Demo)
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white dark:bg-slate-800/90 p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Severity:
          </span>
          {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition ${
                filterSeverity === sev
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400">Status:</span>
          {['all', 'open', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition ${
                filterStatus === st
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies Card Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-500">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              No anomalies found matching current filter parameters.
            </h3>
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className={`rounded-3xl bg-white dark:bg-slate-800/90 p-5 border transition shadow-sm space-y-3 ${
                a.status === 'resolved'
                  ? 'opacity-60 border-slate-200 dark:border-slate-800'
                  : a.severity === 'critical'
                  ? 'border-red-500/50 shadow-red-500/5'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-2xl ${
                      a.severity === 'critical'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-base">
                        {a.buildingName}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                          a.severity === 'critical'
                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {a.severity}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {a.title}
                    </h3>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">ML Confidence</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {(a.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {a.description}
              </p>

              {/* Explainable AI (XAI) Deep-Dive Card */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-4 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-600/60 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Explainable AI (XAI) Reasoning Model</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    Confidence: {(a.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase block">Problem Identified:</span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold">{a.problem || a.title}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase block">Root Cause Analysis:</span>
                    <p className="text-slate-700 dark:text-slate-300">{a.cause || a.description}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase block">Calculated Financial & Carbon Impact:</span>
                    <p className="text-amber-600 dark:text-amber-400 font-extrabold">{a.impact || 'Excess load calculated'}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400 text-[10px] uppercase block">Immediate Action Step:</span>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">{a.immediateAction || 'Dispatch technician'}</p>
                  </div>
                </div>

                {a.longTermAction && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-600/60 text-xs">
                    <span className="font-bold text-slate-400 text-[10px] uppercase block">Long-Term Preventive Recommendation:</span>
                    <p className="text-slate-600 dark:text-slate-300 italic">{a.longTermAction}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    Observed: <strong className="text-slate-800 dark:text-slate-200">{a.valueObserved}</strong>
                  </span>
                  <span>
                    Baseline: <strong className="text-slate-800 dark:text-slate-200">{a.thresholdExpected}</strong>
                  </span>
                  <span className="hidden md:inline">• {a.detectedBy}</span>
                </div>

                <div className="flex items-center gap-2">
                  {a.status !== 'resolved' ? (
                    <button
                      onClick={() => onResolveAnomaly(a.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition shadow"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Dispatch & Resolve
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="h-4 w-4" /> Resolved & Cleared
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
