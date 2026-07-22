import React, { useState } from 'react';
import {
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Wifi,
  Radio,
  Server,
  Zap,
  Wrench,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Building, DataHealthReport, TelemetrySource } from '../types';
import { SAMPLE_DATA_HEALTH_REPORT } from '../data/mockData';

interface DataHealthViewProps {
  buildings: Building[];
}

export const DataHealthView: React.FC<DataHealthViewProps> = ({ buildings }) => {
  const [report, setReport] = useState<DataHealthReport>(SAMPLE_DATA_HEALTH_REPORT);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('all');

  const sourceIcons: Record<TelemetrySource, React.ElementType> = {
    'Smart Energy Meters': Zap,
    'Water Sensors': Activity,
    'Waste Management': Server,
    'Solar Panels': Cpu,
    'Air Quality Sensors': Radio,
    'Weather API': Wifi,
    'Manual Inputs': Database,
  };

  const handleFixIssue = (issueId: string) => {
    setReport((prev) => ({
      ...prev,
      issues: prev.issues.map((iss) => (iss.id === issueId ? { ...iss, status: 'resolved' } : iss)),
    }));
  };

  const handleRefreshSensors = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setReport((prev) => ({
        ...prev,
        campusOverallHealthScore: Math.min(100, prev.campusOverallHealthScore + 1),
      }));
    }, 1200);
  };

  const filteredIssues = selectedSource === 'all'
    ? report.issues
    : report.issues.filter((iss) => iss.source === selectedSource);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Intelligent Data Fusion & Health Center
              </h2>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                AI Validation v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Continuously cross-validating 1,420 IoT telemetry streams from 7 distinct sources to eliminate missing data, delayed pings & duplicate readings.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshSensors}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold hover:bg-slate-800 dark:hover:bg-emerald-600 transition shrink-0 shadow-md"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing Telemetry Mesh...' : 'Re-Validate All Sensors'}</span>
        </button>
      </div>

      {/* KPI Row: Score & Sensor Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Campus Data Health Score */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 shadow-xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="h-20 w-20 text-emerald-400" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Campus Data Health Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {report.campusOverallHealthScore}%
            </span>
            <span className="text-xs font-semibold text-emerald-300/80">Optimal</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${report.campusOverallHealthScore}%` }}
            />
          </div>
        </div>

        {/* Total Active Sensors */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Telemetry Sensors
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {report.totalActiveSensors.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{report.onlineSensors} Online ({((report.onlineSensors / report.totalActiveSensors) * 100).toFixed(1)}%)</span>
          </p>
        </div>

        {/* Validated Ingestion Rate */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Ingestion Throughput
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            4,280 <span className="text-xs text-slate-400 font-normal">pings/min</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Average Latency: <span className="font-mono text-emerald-500 font-bold">14 ms</span>
          </p>
        </div>

        {/* Active Data Anomalies */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-5 border border-slate-200 dark:border-slate-700 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Detected Sensor Inconsistencies
          </span>
          <div className="text-3xl font-black text-amber-500 font-mono">
            {report.issues.filter((i) => i.status === 'active').length}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Auto-corrective actions generated
          </p>
        </div>
      </div>

      {/* 7 Telemetry Sources Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            7 Multi-Source Sensor Feeds
          </h3>
          <span className="text-xs text-slate-500">Click source to filter detected issues</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {report.sources.map((s) => {
            const Icon = sourceIcons[s.source] || Database;
            const isSelected = selectedSource === s.source;

            return (
              <button
                key={s.source}
                onClick={() => setSelectedSource(isSelected ? 'all' : s.source)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-blue-500/30'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 hover:border-blue-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-4 w-4 text-blue-500" />
                  <span
                    className={`h-2 w-2 rounded-full ${
                      s.status === 'optimal'
                        ? 'bg-emerald-500'
                        : s.status === 'degraded'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
                <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                  {s.source}
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                  Health: <span className="font-bold">{s.healthPct}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Issues & Corrective Actions Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Data Inconsistency Detection & Self-Healing Stream
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detects missing sensor pings, delayed updates, duplicate readings, conflicting values & sudden jumps.
            </p>
          </div>

          {selectedSource !== 'all' && (
            <button
              onClick={() => setSelectedSource('all')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
            >
              Clear Filter ({selectedSource})
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              All telemetry sources for selected filter are operating with 100% data fidelity.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-4 rounded-2xl border transition-all ${
                  issue.status === 'resolved'
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-amber-500/5 border-amber-500/30'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {issue.buildingName}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {issue.source}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {issue.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto sm:ml-0">
                        Detected {issue.detectedAt}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {issue.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                      <Wrench className="h-3.5 w-3.5 shrink-0" />
                      <span>Recommended Action: {issue.correctiveRecommendation}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {issue.status === 'resolved' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4" />
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleFixIssue(issue.id)}
                        className="w-full lg:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-md"
                      >
                        Execute Self-Healing Fix
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
