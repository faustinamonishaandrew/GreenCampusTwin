import React, { useState } from 'react';
import {
  FileText,
  FileDown,
  Download,
  Calendar,
  CheckCircle2,
  Building2,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { Building, SustainabilityScores, Anomaly, Recommendation } from '../types';
import { generateSustainabilityReportPDF } from '../utils/pdfGenerator';

interface ReportsViewProps {
  buildings: Building[];
  scores: SustainabilityScores;
  anomalies: Anomaly[];
  recommendations: Recommendation[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  buildings,
  scores,
  anomalies,
  recommendations,
}) => {
  const [reportPeriod, setReportPeriod] = useState<'Weekly' | 'Monthly' | 'Annual'>('Monthly');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');
  const [emailSchedule, setEmailSchedule] = useState<boolean>(true);

  // CSV Exporter
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Building Name,Code,Category,Energy (kWh),Water (Liters),Waste (kg),AQI,Carbon (kg CO2)\n';

    buildings.forEach((b) => {
      csvContent += `"${b.name}","${b.code}","${b.category}",${b.currentEnergyKwh},${b.currentWaterLiters},${b.currentWasteKg},${b.currentAqi},${b.currentCarbonKg}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Green_Campus_Telemetry_${reportPeriod}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGeneratePDF = () => {
    const targetBuildings = selectedBuildingId === 'all'
      ? buildings
      : buildings.filter((b) => b.id === selectedBuildingId);

    generateSustainabilityReportPDF(targetBuildings, scores, anomalies, recommendations, reportPeriod);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> ISO 14001 / LEED Compliant Exporter
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Sustainability Audit Reports & Data Export Engine
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Generate official PDF audit documents and raw telemetry CSV spreadsheets
          </p>
        </div>
      </div>

      {/* Main Report Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Report Customizer */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
            Report Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Audit Period */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Audit Time Period</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Weekly', 'Monthly', 'Annual'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setReportPeriod(p)}
                    className={`py-2.5 rounded-xl font-bold transition border ${
                      reportPeriod === p
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow'
                        : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope Selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Campus Building Scope</label>
              <select
                value={selectedBuildingId}
                onChange={(e) => setSelectedBuildingId(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-700/50 p-2.5 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All 8 Campus Blocks (Full Campus)</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-4">
            <button
              onClick={handleGeneratePDF}
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-105"
            >
              <FileDown className="h-4 w-4" />
              Download Official PDF Audit Report
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-5 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
            >
              <Download className="h-4 w-4" />
              Export Raw Telemetry (CSV)
            </button>
          </div>
        </div>

        {/* Right Col: Automated Email Schedule Tile */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Automated Email Dispatch
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Automatically compile and email PDF sustainability audits to campus administration on the 1st of every month.
          </p>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Monthly Dispatch Active
            </span>
            <input
              type="checkbox"
              checked={emailSchedule}
              onChange={(e) => setEmailSchedule(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
