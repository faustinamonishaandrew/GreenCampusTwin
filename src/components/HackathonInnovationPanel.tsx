import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  TrendingUp,
  Wrench,
  Network,
  Database,
  BarChart3,
  Bot,
  CheckCircle2,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  Award,
} from 'lucide-react';
import { Building, Anomaly, SustainabilityScores } from '../types';

interface InnovationPanelProps {
  buildings: Building[];
  anomalies: Anomaly[];
  scores: SustainabilityScores;
  onNavigateTab: (tab: string) => void;
  onOpenCopilot: () => void;
}

export const HackathonInnovationPanel: React.FC<InnovationPanelProps> = ({
  buildings,
  anomalies,
  scores,
  onNavigateTab,
  onOpenCopilot,
}) => {
  const [activePillar, setActivePillar] = useState<string>('xai');

  const pillars = [
    {
      id: 'xai',
      title: '1. Explainable AI (XAI)',
      subtitle: 'Problem + Cause + Impact + Immediate Action',
      icon: ShieldAlert,
      tag: 'Core Innovation',
      desc: 'Replaces opaque black-box ML flags with structured human-interpretable reasoning, confidence scores, financial ₹ impact, and immediate corrective steps.',
      targetTab: 'anomalies',
      demoHighlights: [
        { label: 'Primary Feature', val: '6-Factor XAI Card Structure' },
        { label: 'Confidence Metrology', val: '96.8% Model Certainty' },
        { label: 'Financial Impact', val: '₹2,400 / day Excess Cost Calculated' },
      ],
    },
    {
      id: 'prediction',
      title: '2. Predictive Anomaly Engine',
      subtitle: 'Forecasting Abnormal Changes Before Exceeded',
      icon: TrendingUp,
      tag: 'Predictive AI',
      desc: 'Moves from reactive alert logging to probability-based pre-hazard warnings, giving facility managers 18h - 48h lead time before pipe bursts or HVAC trips occur.',
      targetTab: 'predictions',
      demoHighlights: [
        { label: 'Predictive Horizon', val: '24h - 72h Early Warning' },
        { label: 'Leak Probability', val: '87% Risk (Hostel Wing C)' },
        { label: 'Overheat Risk', val: '92% Risk (Mech Chiller #2)' },
      ],
    },
    {
      id: 'maintenance',
      title: '3. Early Warning Predictive Maintenance',
      subtitle: 'Equipment Health & Failure Timelines',
      icon: Wrench,
      tag: 'IoT Telemetry',
      desc: 'Continuous FFT vibration and thermal degradation modeling across 1,420 IoT nodes, predicting exact remaining days until equipment failure.',
      targetTab: 'predictive_maintenance',
      demoHighlights: [
        { label: 'Solar Inverter #2', val: 'Health 42% (Failure in 12 Days)' },
        { label: 'Chilled Water Pump #3', val: 'Health 58% (Failure in 19 Days)' },
        { label: 'Preventive Action', val: 'Automated Service Ticket Dispatch' },
      ],
    },
    {
      id: 'fusion',
      title: '4. Data Fusion & Health Scoring',
      subtitle: 'Multi-Source Validation & Anomaly Cleaning',
      icon: Database,
      tag: 'Sensor Health',
      desc: 'Validates raw incoming telemetry from 7 distinct sources (Energy, Water, Waste, Solar, Air, Weather, Manual) to detect missing readings, delays, and jumps.',
      targetTab: 'data_health',
      demoHighlights: [
        { label: 'Campus Data Health', val: '94 / 100 Score' },
        { label: 'Validated Sources', val: '7 Independent Sensor Feeds' },
        { label: 'Self-Healing Stream', val: 'Auto-flags LoRaWAN gateway delays' },
      ],
    },
    {
      id: 'intelligence',
      title: '5. Environmental Intelligence Engine',
      subtitle: 'Cross-Resource Dependency & Causal Graph',
      icon: Network,
      tag: 'Causal Graph',
      desc: 'Models interconnected campus physics: how ambient heat drives AC compressor load, which spikes grid energy, increasing Scope 2 carbon footprint.',
      targetTab: 'environmental_engine',
      demoHighlights: [
        { label: 'Dependency Graph', val: 'Interactive Causal Mesh' },
        { label: 'Cross-Impact', val: 'Temp → HVAC → Grid kWh → CO2' },
        { label: 'Solar Offset Netting', val: '38% Daytime Peak Coverage' },
      ],
    },
    {
      id: 'benchmark',
      title: '6. Institutional Benchmarking',
      subtitle: 'National, State & LEED Platinum Ranking',
      icon: Award,
      tag: 'SaaS Analytics',
      desc: 'Compares real-time campus performance against 140 regional universities, state averages, and green-certified institutions with ranked leaderboards.',
      targetTab: 'benchmarks',
      demoHighlights: [
        { label: 'Campus Overall Rank', val: '#3 out of 140 Regional Varsities' },
        { label: 'Carbon Efficiency Rank', val: '#2 in State' },
        { label: 'Gap to Top Campus', val: '8.0 Points (Action Plan Ready)' },
      ],
    },
    {
      id: 'forecast',
      title: '7. Multi-Horizon Forecasts',
      subtitle: 'Tomorrow, Next Week, Next Month Trends',
      icon: BarChart3,
      tag: 'Time-Series AI',
      desc: 'XGBoost regression models trained on 365 days of weather, occupancy, and solar irradiance data providing multi-horizon sustainability trajectory views.',
      targetTab: 'predictions',
      demoHighlights: [
        { label: 'Time-Series Horizons', val: 'Tomorrow, Next Week, Next Month' },
        { label: 'Target Alignment', val: 'Net Zero Pathway Offset' },
        { label: 'Confidence Level', val: '94.8% R² Accuracy' },
      ],
    },
    {
      id: 'copilot',
      title: '8. Greenie AI Assistant',
      subtitle: 'Natural Language Natural Intelligence',
      icon: Bot,
      tag: 'Gemini AI',
      desc: 'Server-side Gemini 2.5 AI agent answering complex operational questions using live campus telemetry, building physics, and financial ROI models.',
      targetTab: 'copilot',
      demoHighlights: [
        { label: 'Query Handling', val: 'Data-Backed Natural Language' },
        { label: 'Analytical Engine', val: 'Reasoning Chain & Step Highlights' },
        { label: 'Action Integration', val: 'Instant One-Click Implementation' },
      ],
    },
  ];

  const currentPillarData = pillars.find((p) => p.id === activePillar) || pillars[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 animate-spin text-emerald-300" />
              <span>HACKATHON INNOVATION HIGHLIGHT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Sustainability Command Center Innovations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore the 8 core AI innovation pillars built into Green Campus Digital Twin. Transforming static dashboards into an explainable, predictive, and autonomous sustainability engine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/30"
            >
              <Bot className="h-4 w-4" />
              <span>Launch Greenie AI</span>
            </button>
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-bold text-white transition border border-white/10"
            >
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Pillar Selector + Right Feature Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Innovation Pillar Navigation Cards */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
            Select Innovation Pillar (8 Core Pillars)
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {pillars.map((p) => {
              const Icon = p.icon;
              const isSelected = activePillar === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() => setActivePillar(p.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 hover:border-emerald-500/30'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-emerald-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {p.title}
                      </h4>
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 shrink-0">
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {p.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Feature Showcase Box */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <currentPillarData.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {currentPillarData.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentPillarData.subtitle}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {currentPillarData.tag}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentPillarData.desc}
            </p>

            {/* Key Metrics / Live Highlights Grid */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Live Demonstration Metrics
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentPillarData.demoHighlights.map((dh, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-3.5 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <div className="text-[10px] text-slate-400 font-medium">
                      {dh.label}
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {dh.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Impact Checklist */}
            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Hackathon Competitive Differentiation</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-6 list-disc">
                <li>Bypasses standard static chart dashboards by integrating real-time ML reasoning.</li>
                <li>Reduces campus operational overhead by linking prediction directly to action.</li>
                <li>Validated against 1,420 simulated IoT sensor nodes with full fault tolerance.</li>
              </ul>
            </div>
          </div>

          {/* Bottom Interactive Trigger */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Ready to test this innovation in action?
            </span>
            <button
              onClick={() => {
                if (currentPillarData.targetTab === 'copilot') {
                  onOpenCopilot();
                } else {
                  onNavigateTab(currentPillarData.targetTab);
                }
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold hover:bg-slate-800 dark:hover:bg-emerald-600 transition shadow-md"
            >
              <span>Explore Live {currentPillarData.title.split('.')[1]} View</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
