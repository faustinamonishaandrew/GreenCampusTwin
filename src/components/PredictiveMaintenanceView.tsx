import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Cpu,
  Zap,
  Droplets,
  Radio,
  Search,
  Check,
} from 'lucide-react';
import { EquipmentPredictiveMaintenance } from '../types';
import { SAMPLE_PREDICTIVE_MAINTENANCE } from '../data/mockData';

export const PredictiveMaintenanceView: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<EquipmentPredictiveMaintenance[]>(SAMPLE_PREDICTIVE_MAINTENANCE);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const equipmentTypeIcons: Record<string, React.ElementType> = {
    'Smart Meter': Zap,
    'Solar Inverter': Cpu,
    'Water Pump': Droplets,
    'Storage Tank': Activity,
    'Air Quality Sensor': Radio,
    'HVAC Chiller': Wrench,
  };

  const handleScheduleService = (id: string) => {
    setEquipmentList((prev) =>
      prev.map((eq) =>
        eq.id === id
          ? {
              ...eq,
              status: 'optimal',
              healthPct: 98,
              predictedFailureDays: 180,
              failureRiskReason: 'Serviced & recalibrated',
            }
          : eq
      )
    );
  };

  const filteredList = selectedStatus === 'all'
    ? equipmentList
    : equipmentList.filter((eq) => eq.status === selectedStatus);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-lg shadow-amber-500/20">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Predictive Equipment Maintenance & Failure Warning
              </h2>
              <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-400 border border-red-500/20">
                Early Warning Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Continuous FFT vibration, thermal gradient & pressure drop telemetry predicting equipment failures before breakdown occurs.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`p-5 rounded-3xl border text-left transition-all ${
            selectedStatus === 'all'
              ? 'bg-slate-900 text-white border-slate-800 shadow-xl ring-2 ring-slate-700'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider block mb-1">
            Monitored Infrastructure
          </span>
          <div className="text-2xl font-black font-mono">
            {equipmentList.length} Units
          </div>
          <span className="text-xs opacity-80 mt-1 block">Full campus coverage</span>
        </button>

        <button
          onClick={() => setSelectedStatus('critical')}
          className={`p-5 rounded-3xl border text-left transition-all ${
            selectedStatus === 'critical'
              ? 'bg-red-500 text-white border-red-600 shadow-xl ring-2 ring-red-400'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider block mb-1">
            Critical Failure Risks
          </span>
          <div className="text-2xl font-black text-red-600 dark:text-red-400 font-mono">
            {equipmentList.filter((e) => e.status === 'critical').length} Urgent
          </div>
          <span className="text-xs text-red-500 font-medium mt-1 block">Requires action within 14 days</span>
        </button>

        <button
          onClick={() => setSelectedStatus('warning')}
          className={`p-5 rounded-3xl border text-left transition-all ${
            selectedStatus === 'warning'
              ? 'bg-amber-500 text-white border-amber-600 shadow-xl ring-2 ring-amber-400'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1">
            Early Warnings
          </span>
          <div className="text-2xl font-black text-amber-500 font-mono">
            {equipmentList.filter((e) => e.status === 'warning').length} Warning
          </div>
          <span className="text-xs text-amber-500 font-medium mt-1 block">Inspect during routine maintenance</span>
        </button>
      </div>

      {/* Equipment List Cards */}
      <div className="space-y-4">
        {filteredList.map((eq) => {
          const Icon = equipmentTypeIcons[eq.equipmentType] || Wrench;

          return (
            <div
              key={eq.id}
              className={`p-6 rounded-3xl border bg-white dark:bg-slate-800 transition-all shadow-xl space-y-4 ${
                eq.status === 'critical'
                  ? 'border-red-500/50 ring-1 ring-red-500/20'
                  : eq.status === 'warning'
                  ? 'border-amber-500/50'
                  : 'border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      eq.status === 'critical'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : eq.status === 'warning'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {eq.name}
                      </h3>
                      <span className="text-xs font-semibold text-slate-400">
                        ({eq.buildingName})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>Type: {eq.equipmentType}</span>
                      <span>•</span>
                      <span>Last Serviced: {eq.lastServiceDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Predicted Failure
                    </span>
                    <span
                      className={`text-sm font-extrabold font-mono ${
                        eq.status === 'critical'
                          ? 'text-red-500'
                          : eq.status === 'warning'
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      {eq.predictedFailureDays > 90 ? 'Healthy' : `In ${eq.predictedFailureDays} Days`}
                    </span>
                  </div>

                  <span
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase border ${
                      eq.status === 'critical'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                        : eq.status === 'warning'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {eq.status}
                  </span>
                </div>
              </div>

              {/* Health Progress Bar & Risk Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Equipment Health Index</span>
                    <span
                      className={
                        eq.healthPct < 50
                          ? 'text-red-500 font-mono'
                          : eq.healthPct < 75
                          ? 'text-amber-500 font-mono'
                          : 'text-emerald-500 font-mono'
                      }
                    >
                      {eq.healthPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        eq.healthPct < 50
                          ? 'bg-red-500'
                          : eq.healthPct < 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${eq.healthPct}%` }}
                    />
                  </div>
                </div>

                <div className="md:col-span-5 text-xs space-y-0.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    Telemetry Trigger Reason:
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">
                    {eq.failureRiskReason}
                  </p>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  {eq.status === 'optimal' ? (
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Equipment Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleScheduleService(eq.id)}
                      className="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-emerald-600 transition shadow-md"
                    >
                      Dispatch Work Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
