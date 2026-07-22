import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  ShieldAlert,
  Zap,
  Droplet,
  Trash2,
  Wind,
  Layers,
  ArrowRight,
  Filter,
  BarChart3,
  Lightbulb,
  Clock,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import {
  Building,
  Anomaly,
  SustainabilityScores,
  Recommendation,
  MultiHorizonForecast,
} from '../types';
import { formatCurrencyINR } from '../utils/aiEngine';

interface AIInsightsViewProps {
  buildings: Building[];
  anomalies: Anomaly[];
  scores: SustainabilityScores;
  recommendations: Recommendation[];
  onApplyRecommendation: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  buildings,
  anomalies,
  scores,
  recommendations,
  onApplyRecommendation,
  onNavigateTab,
}) => {
  const [forecastHorizon, setForecastHorizon] = useState<'tomorrow' | 'nextWeek' | 'nextMonth'>('tomorrow');
  const [forecastMetric, setForecastMetric] = useState<'energy' | 'water' | 'waste' | 'carbon' | 'aqi'>('energy');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [appliedRecIds, setAppliedRecIds] = useState<Set<string>>(new Set());

  // Environmental Health Score Calculations
  const healthScore = Math.round((scores.energy + scores.water + scores.waste + scores.airQuality + scores.carbon) / 5);
  
  const factors = [
    { label: 'Energy Efficiency', score: scores.energy, weight: '25%', color: '#F59E0B', icon: Zap },
    { label: 'Water Recycling', score: scores.water, weight: '20%', color: '#3B82F6', icon: Droplet },
    { label: 'Air Quality (AQI)', score: scores.airQuality, weight: '20%', color: '#06B6D4', icon: Wind },
    { label: 'Solid Waste Diverted', score: scores.waste, weight: '15%', color: '#10B981', icon: Trash2 },
    { label: 'Carbon Neutrality', score: scores.carbon, weight: '20%', color: '#8B5CF6', icon: Sparkles },
  ];

  // Top AI Findings
  const aiFindings = [
    {
      id: 'f-1',
      title: 'High Electricity Consumption Detected',
      location: 'Server Lab B (Academic Block)',
      type: 'warning',
      changePct: '+34%',
      impact: '₹1,850/day excess cost',
      icon: Zap,
      color: 'amber',
    },
    {
      id: 'f-2',
      title: 'Water Usage Spike & Potential Pipe Leak',
      location: 'Hostel Block A (South Wing)',
      type: 'critical',
      changePct: '+18%',
      impact: '2,400 Liters wasted daily',
      icon: Droplet,
      color: 'blue',
    },
    {
      id: 'f-3',
      title: 'Solar Generation Decreased (Dust Cover)',
      location: 'Central Library Rooftop',
      type: 'warning',
      changePct: '-12%',
      impact: '42 kWh/day generation loss',
      icon: Sparkles,
      color: 'purple',
    },
    {
      id: 'f-4',
      title: 'Carbon Footprint Improving',
      location: 'Campus-wide LED Retrofit',
      type: 'positive',
      changePct: '-8.4%',
      impact: '820 kg CO₂ saved this month',
      icon: CheckCircle2,
      color: 'emerald',
    },
  ];

  // Explainable AI (XAI) Cards
  const xaiFindings = [
    {
      id: 'xai-1',
      problem: 'High Energy Surge in Server Lab B',
      reason: 'Unscheduled GPU cluster batch processing running without dynamic HVAC chiller throttling.',
      impact: '₹2,100/month additional energy expenditure (+380 kg CO₂e).',
      recommendation: 'Enable occupancy-based smart thermal bypass on HVAC Chiller 3.',
      confidence: 96,
      severity: 'critical',
      buildingName: 'Academic Block B',
    },
    {
      id: 'xai-2',
      problem: 'Nighttime Continuous Water Flow',
      reason: 'Sub-surface solenoid valve leakage detected in Hostel Block A ground reservoir.',
      impact: '2,400 Liters of treated water lost every 24 hours.',
      recommendation: 'Dispatch maintenance to replace pressure seal on Valve #4.',
      confidence: 94,
      severity: 'high',
      buildingName: 'Hostel Block A',
    },
    {
      id: 'xai-3',
      problem: 'Solar Panel Output Degraded',
      reason: 'Particulate dust accumulation on Library rooftop PV arrays reduced irradiance efficiency by 14%.',
      impact: 'Loss of ₹850 daily solar credit offset.',
      recommendation: 'Trigger automated robotic sprinkler wash cycle for PV Array Section 2.',
      confidence: 91,
      severity: 'medium',
      buildingName: 'Central Library',
    },
    {
      id: 'xai-4',
      problem: 'Elevated CO₂ Levels in Auditorium',
      reason: 'HVAC fresh air damper closed at 85% restriction during high occupancy event.',
      impact: 'Indoor air quality dropped to AQI 128 (Moderate hazard).',
      recommendation: 'Open fresh air intake dampers to 40% minimum threshold.',
      confidence: 98,
      severity: 'high',
      buildingName: 'Student Union & Center',
    },
  ];

  // Forecast chart data based on selected horizon and metric
  const forecastDataMap = {
    energy: {
      tomorrow: [
        { time: '00:00', actual: 120, predicted: 125, target: 110 },
        { time: '04:00', actual: 95, predicted: 92, target: 90 },
        { time: '08:00', actual: 310, predicted: 325, target: 280 },
        { time: '12:00', actual: 480, predicted: 490, target: 420 },
        { time: '16:00', actual: 440, predicted: 435, target: 400 },
        { time: '20:00', actual: 260, predicted: 250, target: 230 },
      ],
      nextWeek: [
        { time: 'Mon', actual: 4200, predicted: 4150, target: 3900 },
        { time: 'Tue', actual: 4350, predicted: 4400, target: 3900 },
        { time: 'Wed', actual: 4500, predicted: 4480, target: 3900 },
        { time: 'Thu', actual: 4100, predicted: 4250, target: 3900 },
        { time: 'Fri', actual: 4600, predicted: 4550, target: 3900 },
        { time: 'Sat', actual: 2800, predicted: 2750, target: 2500 },
        { time: 'Sun', actual: 2200, predicted: 2150, target: 2000 },
      ],
      nextMonth: [
        { time: 'Week 1', actual: 29500, predicted: 29000, target: 27000 },
        { time: 'Week 2', actual: 31200, predicted: 30800, target: 27000 },
        { time: 'Week 3', actual: 30100, predicted: 29800, target: 27000 },
        { time: 'Week 4', actual: 28400, predicted: 28000, target: 27000 },
      ],
    },
    water: {
      tomorrow: [
        { time: '00:00', actual: 800, predicted: 820, target: 700 },
        { time: '04:00', actual: 600, predicted: 580, target: 500 },
        { time: '08:00', actual: 3200, predicted: 3400, target: 2900 },
        { time: '12:00', actual: 4100, predicted: 4050, target: 3500 },
        { time: '16:00', actual: 3800, predicted: 3750, target: 3300 },
        { time: '20:00', actual: 2400, predicted: 2350, target: 2100 },
      ],
      nextWeek: [
        { time: 'Mon', actual: 28000, predicted: 28500, target: 25000 },
        { time: 'Tue', actual: 29500, predicted: 29200, target: 25000 },
        { time: 'Wed', actual: 31000, predicted: 30800, target: 25000 },
        { time: 'Thu', actual: 27800, predicted: 28000, target: 25000 },
        { time: 'Fri', actual: 30200, predicted: 29900, target: 25000 },
        { time: 'Sat', actual: 18500, predicted: 18200, target: 16000 },
        { time: 'Sun', actual: 15400, predicted: 15100, target: 14000 },
      ],
      nextMonth: [
        { time: 'Week 1', actual: 195000, predicted: 192000, target: 175000 },
        { time: 'Week 2', actual: 204000, predicted: 201000, target: 175000 },
        { time: 'Week 3', actual: 198000, predicted: 195000, target: 175000 },
        { time: 'Week 4', actual: 189000, predicted: 186000, target: 175000 },
      ],
    },
    waste: {
      tomorrow: [
        { time: '00:00', actual: 20, predicted: 18, target: 15 },
        { time: '04:00', actual: 10, predicted: 12, target: 10 },
        { time: '08:00', actual: 85, predicted: 90, target: 70 },
        { time: '12:00', actual: 160, predicted: 155, target: 130 },
        { time: '16:00', actual: 140, predicted: 138, target: 110 },
        { time: '20:00', actual: 65, predicted: 62, target: 50 },
      ],
      nextWeek: [
        { time: 'Mon', actual: 480, predicted: 470, target: 400 },
        { time: 'Tue', actual: 510, predicted: 500, target: 400 },
        { time: 'Wed', actual: 530, predicted: 525, target: 400 },
        { time: 'Thu', actual: 490, predicted: 485, target: 400 },
        { time: 'Fri', actual: 560, predicted: 550, target: 400 },
        { time: 'Sat', actual: 320, predicted: 310, target: 250 },
        { time: 'Sun', actual: 240, predicted: 230, target: 200 },
      ],
      nextMonth: [
        { time: 'Week 1', actual: 3400, predicted: 3350, target: 2800 },
        { time: 'Week 2', actual: 3600, predicted: 3550, target: 2800 },
        { time: 'Week 3', actual: 3480, predicted: 3420, target: 2800 },
        { time: 'Week 4', actual: 3250, predicted: 3200, target: 2800 },
      ],
    },
    carbon: {
      tomorrow: [
        { time: '00:00', actual: 45, predicted: 42, target: 35 },
        { time: '04:00', actual: 30, predicted: 28, target: 25 },
        { time: '08:00', actual: 180, predicted: 175, target: 140 },
        { time: '12:00', actual: 290, predicted: 280, target: 220 },
        { time: '16:00', actual: 250, predicted: 245, target: 200 },
        { time: '20:00', actual: 110, predicted: 105, target: 90 },
      ],
      nextWeek: [
        { time: 'Mon', actual: 1420, predicted: 1390, target: 1150 },
        { time: 'Tue', actual: 1480, predicted: 1450, target: 1150 },
        { time: 'Wed', actual: 1520, predicted: 1490, target: 1150 },
        { time: 'Thu', actual: 1390, predicted: 1370, target: 1150 },
        { time: 'Fri', actual: 1590, predicted: 1560, target: 1150 },
        { time: 'Sat', actual: 880, predicted: 860, target: 700 },
        { time: 'Sun', actual: 690, predicted: 670, target: 550 },
      ],
      nextMonth: [
        { time: 'Week 1', actual: 9800, predicted: 9600, target: 8000 },
        { time: 'Week 2', actual: 10400, predicted: 10200, target: 8000 },
        { time: 'Week 3', actual: 9900, predicted: 9700, target: 8000 },
        { time: 'Week 4', actual: 9200, predicted: 9000, target: 8000 },
      ],
    },
    aqi: {
      tomorrow: [
        { time: '00:00', actual: 42, predicted: 44, target: 50 },
        { time: '04:00', actual: 38, predicted: 40, target: 50 },
        { time: '08:00', actual: 68, predicted: 72, target: 50 },
        { time: '12:00', actual: 55, predicted: 58, target: 50 },
        { time: '16:00', actual: 48, predicted: 50, target: 50 },
        { time: '20:00', actual: 45, predicted: 46, target: 50 },
      ],
      nextWeek: [
        { time: 'Mon', actual: 48, predicted: 50, target: 50 },
        { time: 'Tue', actual: 52, predicted: 54, target: 50 },
        { time: 'Wed', actual: 58, predicted: 60, target: 50 },
        { time: 'Thu', actual: 46, predicted: 48, target: 50 },
        { time: 'Fri', actual: 62, predicted: 65, target: 50 },
        { time: 'Sat', actual: 42, predicted: 44, target: 50 },
        { time: 'Sun', actual: 38, predicted: 40, target: 50 },
      ],
      nextMonth: [
        { time: 'Week 1', actual: 49, predicted: 51, target: 50 },
        { time: 'Week 2', actual: 54, predicted: 56, target: 50 },
        { time: 'Week 3', actual: 47, predicted: 49, target: 50 },
        { time: 'Week 4', actual: 42, predicted: 44, target: 50 },
      ],
    },
  };

  const chartData = forecastDataMap[forecastMetric][forecastHorizon];

  // Risk Analysis Matrix Items
  const riskAnalysisList = [
    {
      id: 'risk-1',
      level: 'critical',
      probabilityPct: 88,
      estimatedTime: 'Within 24 Hours',
      title: 'HVAC Chiller Compressor Thermal Shutdown',
      description: 'Chiller #2 pressure telemetry indicates thermal overload under peak afternoon heat.',
      action: 'Isolate Chiller #2 loop and activate auxiliary chilled water thermal storage tank.',
      building: 'Mechanical Engineering Block',
    },
    {
      id: 'risk-2',
      level: 'high',
      probabilityPct: 74,
      estimatedTime: 'Within 48 Hours',
      title: 'Ground Water Tank Overspill Risk',
      description: 'Hostel Block water inlet pump automation logic failure during automated refill schedule.',
      action: 'Re-calibrate float sensor thresholds and force manual override limiters.',
      building: 'Hostel Block A & B',
    },
    {
      id: 'risk-3',
      level: 'medium',
      probabilityPct: 56,
      estimatedTime: 'Next 3-5 Days',
      title: 'Solar Inverter Grid Feed Phase Imbalance',
      description: 'Grid-tie inverter Phase B showing harmonic distortion exceeding 4.2% THD.',
      action: 'Schedule grid filter capacitor maintenance check with campus electrical team.',
      building: 'Solar Farm North',
    },
    {
      id: 'risk-4',
      level: 'low',
      probabilityPct: 22,
      estimatedTime: 'Next 10 Days',
      title: 'Solid Waste Compactor Bin Capacity Limit',
      description: 'Cafeteria waste stream volume trending slightly above weekly baseline.',
      action: 'Adjust municipal pickup frequency from bi-weekly to tri-weekly schedule.',
      building: 'Central Cafeteria',
    },
  ];

  const filteredRisks = riskAnalysisList.filter((r) =>
    riskFilter === 'all' ? true : r.level === riskFilter
  );

  const handleApply = (id: string) => {
    setAppliedRecIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    onApplyRecommendation(id);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white shadow-xl border border-emerald-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 animate-pulse" />
              AI Intelligence Center
            </span>
            <span className="text-xs text-slate-400">• Gemini 2.5 Engine Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Insights & Executive Diagnosis
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time causal analysis, predictive risk modeling, explainable AI recommendations, and multi-horizon forecasting across all 8 campus blocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('copilot')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
          >
            <Sparkles className="h-4 w-4" />
            Launch Greenie AI Assistant
          </button>
        </div>
      </div>

      {/* SECTION 1: Environmental Health Score */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              1. Overall Campus Health Index
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              Environmental Health Score
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Weighted score calculated across 1,420 IoT telemetry points
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Large Circular Gauge */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 relative">
            <div className="relative flex items-center justify-center h-48 w-48">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-200 dark:stroke-slate-700"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - healthScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {healthScore}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">/ 100 Health</span>
                <span className="mt-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  OPTIMAL
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs">
              Campus is operating at top <strong className="text-slate-700 dark:text-slate-200">5% efficiency</strong> compared to regional higher education standards.
            </p>
          </div>

          {/* Breakdown Factors Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sub-System Factor Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {factors.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.label}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2 hover:border-emerald-500/50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 rounded-xl text-white"
                          style={{ backgroundColor: f.color }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {f.label}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
                        {f.score} / 100
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${f.score}%`,
                            backgroundColor: f.color,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Weight: {f.weight}</span>
                        <span>{f.score >= 90 ? 'Excellent' : f.score >= 80 ? 'Good' : 'Needs Focus'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Top AI Findings */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              2. Key Real-Time Discoveries
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Top AI Findings
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Auto-detected 5 mins ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiFindings.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2.5 rounded-xl ${
                      f.color === 'emerald'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : f.color === 'blue'
                        ? 'bg-blue-500/10 text-blue-500'
                        : f.color === 'amber'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-purple-500/10 text-purple-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                      f.type === 'positive'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : f.type === 'critical'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {f.changePct}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {f.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {f.location}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-300">
                  Impact: <span className="text-emerald-600 dark:text-emerald-400">{f.impact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Explainable AI (XAI) Cards */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            3. Transparency & Causal Attribution
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-500" />
            Explainable AI (XAI) Diagnostic Cards
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Every AI deduction discloses explicit root causes, economic & environmental impact, suggested remedy, and model confidence score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {xaiFindings.map((xai) => (
            <div
              key={xai.id}
              className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-5 border border-slate-200 dark:border-slate-700 space-y-4 hover:border-emerald-500/60 transition shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {xai.buildingName}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {xai.problem}
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                  {xai.confidence}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                    🔍 Root Cause / Reason:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {xai.reason}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <span className="font-bold text-red-600 dark:text-red-400 block mb-0.5">
                    📉 Cost & Environmental Impact:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">
                    {xai.impact}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                    💡 Suggested Action:
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {xai.recommendation}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Future Forecast */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              4. Predictive Time-Series Horizon
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Future Forecast Analytics
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Horizon Selector */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              {(['tomorrow', 'nextWeek', 'nextMonth'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setForecastHorizon(h)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    forecastHorizon === h
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {h === 'tomorrow' ? 'Tomorrow' : h === 'nextWeek' ? 'Next Week' : 'Next Month'}
                </button>
              ))}
            </div>

            {/* Metric Selector */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              {(['energy', 'water', 'waste', 'carbon', 'aqi'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setForecastMetric(m)}
                  className={`px-2.5 py-1.5 rounded-lg uppercase transition ${
                    forecastMetric === m
                      ? 'bg-slate-800 dark:bg-slate-700 text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#forecastGrad)"
                name="AI Predicted Load"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Sustainability Target Limit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 5: Risk Analysis */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              5. Pre-Hazard Prevention
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Risk Analysis & Early Warning Matrix
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-1.5 focus:outline-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRisks.map((risk) => (
            <div
              key={risk.id}
              className={`p-5 rounded-2xl border space-y-3 transition ${
                risk.level === 'critical'
                  ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                  : risk.level === 'high'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    risk.level === 'critical'
                      ? 'bg-red-500 text-white'
                      : risk.level === 'high'
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {risk.level} Risk ({risk.probabilityPct}% Probability)
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {risk.estimatedTime}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {risk.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {risk.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">
                  Recommended Preventative Action:
                </strong>
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {risk.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Smart Recommendations */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              6. Actionable Interventions
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Smart AI Recommendations
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {recommendations.length} Active Suggestions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => {
            const isApplied = appliedRecIds.has(rec.id) || rec.applied;

            return (
              <div
                key={rec.id}
                className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-5 border border-slate-200 dark:border-slate-700 space-y-4 hover:border-emerald-500 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        rec.priority === 'urgent'
                          ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {rec.buildingName}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {rec.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Savings</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatCurrencyINR(rec.estimatedSavingsInr)}/yr
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Carbon Saved</span>
                      <span className="font-extrabold text-purple-600 dark:text-purple-400">
                        {rec.estimatedCarbonSavedKg} kg CO₂
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApply(rec.id)}
                    disabled={isApplied}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                      isApplied
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:scale-[1.02]'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Intervention Applied
                      </>
                    ) : (
                      <>
                        <span>Apply Smart Recommendation</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
