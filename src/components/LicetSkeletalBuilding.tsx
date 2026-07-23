import React, { useState } from 'react';
import {
  Zap,
  Droplet,
  Sun,
  Wind,
  Trash2,
  Leaf,
  Sparkles,
  X,
  ChevronRight,
  CheckCircle2,
  Activity,
  Cpu,
  Info,
} from 'lucide-react';

interface LicetSkeletalBuildingProps {
  onNavigateToTab: (tab: string) => void;
}

interface Hotspot {
  id: string;
  name: string;
  category: 'energy' | 'water' | 'solar' | 'aqi' | 'waste' | 'carbon';
  icon: string;
  iconLucide: React.ElementType;
  x: number; // Percentage X position (0-100) on the illustration SVG canvas
  y: number; // Percentage Y position (0-100)
  currentUsage: string;
  predictedValue: string;
  efficiency: string;
  aiRecommendation: string;
  tabKey: string;
}

export const LicetSkeletalBuilding: React.FC<LicetSkeletalBuildingProps> = ({
  onNavigateToTab,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Hotspots mapped onto the LICET building blueprint
  const hotspots: Hotspot[] = [
    {
      id: 'hs-solar',
      name: 'Rooftop Solar PV Panels (140 kW)',
      category: 'solar',
      icon: '☀',
      iconLucide: Sun,
      x: 50,
      y: 18,
      currentUsage: '112 kW Active Generation',
      predictedValue: '128 kW Peak at 1:30 PM',
      efficiency: '98.4%',
      aiRecommendation: 'Pre-cool Seminar Hall A using excess midday solar generation to cut grid peak charges.',
      tabKey: 'solar',
    },
    {
      id: 'hs-energy',
      name: 'West Wing Mechanical & Civil Labs',
      category: 'energy',
      icon: '⚡',
      iconLucide: Zap,
      x: 24,
      y: 42,
      currentUsage: '185 kWh/day',
      predictedValue: '198 kWh/day',
      efficiency: '91.2%',
      aiRecommendation: 'Shift heavy fluid mechanics testing load to 12 PM - 2 PM peak solar window.',
      tabKey: 'energy',
    },
    {
      id: 'hs-aqi',
      name: 'East Wing Electrical & CS Labs',
      category: 'aqi',
      icon: '🌬',
      iconLucide: Wind,
      x: 76,
      y: 42,
      currentUsage: 'AQI 42 (Good)',
      predictedValue: 'AQI 46 (Optimal)',
      efficiency: '96.5%',
      aiRecommendation: 'HEPA filtration operating at optimal airflow rate. Zero particulate warnings.',
      tabKey: 'air_quality',
    },
    {
      id: 'hs-water',
      name: 'Underground Hydro Sump & Booster Pumps',
      category: 'water',
      icon: '💧',
      iconLucide: Droplet,
      x: 28,
      y: 78,
      currentUsage: '4,200 Liters Today',
      predictedValue: '4,500 Liters Forecast',
      efficiency: '95.0%',
      aiRecommendation: 'Hydro booster pump VFD running at efficient 1,420 RPM. No pressure leaks.',
      tabKey: 'water',
    },
    {
      id: 'hs-waste',
      name: 'Biogas & Organic Waste Processing Unit',
      category: 'waste',
      icon: '♻',
      iconLucide: Trash2,
      x: 72,
      y: 78,
      currentUsage: '140 kg Processed Today',
      predictedValue: '160 kg Capacity',
      efficiency: '92.8%',
      aiRecommendation: 'Methane digestor feeding 12 kWh supplementary power into hostel lighting grid.',
      tabKey: 'waste',
    },
    {
      id: 'hs-carbon',
      name: 'Main Entrance & Quad Carbon Offset',
      category: 'carbon',
      icon: '🌍',
      iconLucide: Leaf,
      x: 50,
      y: 84,
      currentUsage: '280 kg CO2 / day',
      predictedValue: '-110 kg CO2 Offset',
      efficiency: '94.0%',
      aiRecommendation: 'On-track for 100% Carbon Neutrality target by Q4 2026.',
      tabKey: 'carbon',
    },
  ];

  return (
    <div className="relative w-full rounded-2xl bg-slate-950 border border-emerald-500/30 overflow-hidden shadow-2xl p-4 sm:p-6 text-white min-h-[500px] flex flex-col justify-between group">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf615_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf615_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top Banner Header Controls */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900/80 backdrop-blur-md p-3 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-black text-white tracking-wide uppercase text-[11px] flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            LICET DIGITAL TWIN • SKELETAL ARCHITECTURAL BLUEPRINT
          </span>
        </div>

        {/* Category Filter Quick Highlights */}
        <div className="flex items-center gap-1 text-[11px] font-bold overflow-x-auto py-0.5">
          {hotspots.map((spot) => {
            const isHovered = hoveredCategory === spot.category;
            return (
              <button
                key={spot.id}
                onMouseEnter={() => setHoveredCategory(spot.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => setActiveHotspot(spot)}
                className={`px-2.5 py-1 rounded-lg transition border flex items-center gap-1 shrink-0 ${
                  isHovered || activeHotspot?.id === spot.id
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30 scale-105'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-emerald-500/50'
                }`}
              >
                <span>{spot.icon}</span>
                <span className="hidden sm:inline">{spot.category.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* VECTOR SKELETAL BLUEPRINT SVG OF LICET MAIN BUILDING */}
      {/* ========================================================= */}
      <div className="relative w-full h-[380px] my-auto flex items-center justify-center p-2">
        <svg
          viewBox="0 0 1000 550"
          className="w-full h-full max-h-[440px] drop-shadow-[0_0_15px_rgba(139,92,246,0.25)]"
        >
          <defs>
            {/* Glowing Stroke Filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Shimmer Gradient for Energy Flow */}
            <linearGradient id="energyStream" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#6ee7b7" stopOpacity="1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>

            {/* Solar Panel Cell Shimmer Pattern */}
            <pattern id="solarGridPattern" width="16" height="12" patternUnits="userSpaceOnUse">
              <rect width="14" height="10" fill="#17142e" stroke="#6ee7b7" strokeWidth="0.8" opacity="0.7" />
            </pattern>
          </defs>

          {/* ======================================= */}
          {/* BASE LANDSCAPE & ACCESS PATHWAYS */}
          {/* ======================================= */}
          {/* Ground Lawn Contour Ring */}
          <ellipse
            cx="500"
            cy="360"
            rx="460"
            ry="150"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            className="animate-pulse"
          />

          {/* Main Central Boulevard & Driveway Pathway */}
          <path
            d="M 500 550 L 500 390 M 200 390 L 800 390"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeDasharray="12 8"
            opacity="0.6"
          />

          {/* Front Entrance Security Gate Skeletal Outline */}
          <g transform="translate(450, 480)">
            <rect x="0" y="0" width="100" height="18" rx="4" fill="none" stroke="#8b5cf6" strokeWidth="1.5" filter="url(#neonGlow)" />
            <text x="50" y="12" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="900" letterSpacing="1">
              LICET GATE
            </text>
          </g>

          {/* Front Courtyard Fountain Outline */}
          <g transform="translate(500, 390)">
            <circle cx="0" cy="0" r="28" fill="none" stroke="#6ee7b7" strokeWidth="2" />
            <circle cx="0" cy="0" r="14" fill="none" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
            <circle cx="0" cy="0" r="4" fill="#6ee7b7" className="animate-ping" />
          </g>

          {/* Landscaping Trees Skeletal Vectors */}
          {[
            [120, 360], [180, 400], [240, 430],
            [880, 360], [820, 400], [760, 430],
            [160, 240], [840, 240]
          ].map(([tx, ty], i) => (
            <g key={`tree-${i}`} transform={`translate(${tx}, ${ty})`}>
              {/* Tree Trunk */}
              <line x1="0" y1="0" x2="0" y2="-18" stroke="#34d399" strokeWidth="1.5" />
              {/* Tree Canopy Circles */}
              <circle cx="0" cy="-28" r="14" fill="none" stroke="#6ee7b7" strokeWidth="1" opacity="0.8" />
              <circle cx="0" cy="-28" r="8" fill="none" stroke="#a7f3d0" strokeWidth="0.8" strokeDasharray="2 2" />
            </g>
          ))}

          {/* ======================================= */}
          {/* LICET MAIN BUILDING SKELETAL ARCHITECTURE */}
          {/* ======================================= */}
          <g className="transition-all duration-300">
            {/* Ground Base Foundation Glow */}
            <rect
              x="180"
              y="110"
              width="640"
              height="240"
              rx="24"
              fill="none"
              stroke={hoveredCategory ? '#6ee7b7' : '#8b5cf6'}
              strokeWidth="2"
              strokeDasharray="8 8"
              opacity="0.4"
            />

            {/* 1. WEST WING (MECHANICAL & CIVIL ACADEMIC BLOCK) */}
            <g transform="translate(190, 130)">
              {/* Outer Skeletal Box */}
              <rect
                x="0"
                y="0"
                width="180"
                height="200"
                rx="14"
                fill="none"
                stroke={hoveredCategory === 'energy' ? '#6ee7b7' : '#8b5cf6'}
                strokeWidth={hoveredCategory === 'energy' ? '3' : '2'}
                filter={hoveredCategory === 'energy' ? 'url(#neonGlow)' : undefined}
              />

              {/* Classroom Window Matrix Wireframe */}
              {[20, 60, 100, 140].map((xOffset) =>
                [20, 65, 110, 155].map((yOffset) => (
                  <rect
                    key={`w-win-${xOffset}-${yOffset}`}
                    x={xOffset}
                    y={yOffset}
                    width="22"
                    height="32"
                    rx="3"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                ))
              )}

              {/* Wing Header Label */}
              <text x="90" y="-8" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="800">
                WEST WING (LABS)
              </text>
            </g>

            {/* 2. EAST WING (COMPUTER SCIENCE & ELECTRICAL BLOCK) */}
            <g transform="translate(630, 130)">
              {/* Outer Skeletal Box */}
              <rect
                x="0"
                y="0"
                width="180"
                height="200"
                rx="14"
                fill="none"
                stroke={hoveredCategory === 'aqi' ? '#6ee7b7' : '#8b5cf6'}
                strokeWidth={hoveredCategory === 'aqi' ? '3' : '2'}
                filter={hoveredCategory === 'aqi' ? 'url(#neonGlow)' : undefined}
              />

              {/* Classroom Window Matrix Wireframe */}
              {[20, 60, 100, 140].map((xOffset) =>
                [20, 65, 110, 155].map((yOffset) => (
                  <rect
                    key={`e-win-${xOffset}-${yOffset}`}
                    x={xOffset}
                    y={yOffset}
                    width="22"
                    height="32"
                    rx="3"
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                ))
              )}

              {/* Wing Header Label */}
              <text x="90" y="-8" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="800">
                EAST WING (CS & EEE)
              </text>
            </g>

            {/* 3. CENTRAL ACADEMIC CORE (DEAN OFFICE & AUDITORIUM) */}
            <g transform="translate(380, 100)">
              {/* Core Building Box */}
              <rect
                x="0"
                y="0"
                width="240"
                height="250"
                rx="18"
                fill="#17142e"
                fillOpacity="0.8"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                filter="url(#neonGlow)"
              />

              {/* 3 Arched Windows on Top Floor (Matching LICET Real Architecture) */}
              {[30, 105, 180].map((archX, idx) => (
                <path
                  key={`arch-${idx}`}
                  d={`M ${archX} 65 L ${archX} 35 A 15 15 0 0 1 ${archX + 30} 35 L ${archX + 30} 65 Z`}
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="1.8"
                />
              ))}

              {/* Official "LICET" Header Text Board */}
              <rect x="50" y="80" width="140" height="28" rx="6" fill="#221c3d" stroke="#6ee7b7" strokeWidth="1.5" />
              <text x="120" y="98" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" letterSpacing="2">
                L I C E T
              </text>

              {/* Central Entrance Columns & Portico */}
              <g transform="translate(35, 170)">
                {/* Portico Pillars */}
                <rect x="10" y="0" width="12" height="80" fill="none" stroke="#F8FAFC" strokeWidth="1.5" />
                <rect x="50" y="0" width="12" height="80" fill="none" stroke="#F8FAFC" strokeWidth="1.5" />
                <rect x="108" y="0" width="12" height="80" fill="none" stroke="#F8FAFC" strokeWidth="1.5" />
                <rect x="148" y="0" width="12" height="80" fill="none" stroke="#F8FAFC" strokeWidth="1.5" />

                {/* Central Arch Doorway */}
                <path d="M 65 80 L 65 40 A 20 20 0 0 1 105 40 L 105 80 Z" fill="none" stroke="#6ee7b7" strokeWidth="2" />
              </g>

              {/* Gable Triangular Roof Canopy over Portico */}
              <path d="M 15 170 L 120 135 L 225 170 Z" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
            </g>

            {/* 4. ROOFTOP SOLAR PV ARRAY GRID (140 kW System) */}
            <g transform="translate(390, 45)">
              <rect
                x="0"
                y="0"
                width="220"
                height="45"
                rx="6"
                fill="url(#solarGridPattern)"
                stroke={hoveredCategory === 'solar' ? '#6ee7b7' : '#8b5cf6'}
                strokeWidth={hoveredCategory === 'solar' ? '3' : '1.8'}
                filter={hoveredCategory === 'solar' ? 'url(#neonGlow)' : undefined}
              />
              <text x="110" y="-6" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="900">
                ☀ 140 kW ROOFTOP SOLAR PV ARRAY
              </text>

              {/* Animated Solar Ray Pulses */}
              <circle cx="30" cy="22" r="3" fill="#6ee7b7" className="animate-ping" />
              <circle cx="110" cy="22" r="3" fill="#6ee7b7" className="animate-ping" />
              <circle cx="190" cy="22" r="3" fill="#6ee7b7" className="animate-ping" />
            </g>

            {/* 5. ANIMATED ENERGY FLOW STREAM LINES */}
            <path
              d="M 500 90 L 500 370 M 280 230 L 720 230 M 370 480 L 630 480"
              fill="none"
              stroke="url(#energyStream)"
              strokeWidth="3"
              strokeDasharray="20 10"
              className="animate-pulse"
            />
          </g>
        </svg>

        {/* ========================================================= */}
        {/* INTERACTIVE HOTSPOT BUTTON OVERLAYS */}
        {/* ========================================================= */}
        {hotspots.map((spot) => {
          const isSelected = activeHotspot?.id === spot.id;
          const isHovered = hoveredCategory === spot.category;

          return (
            <div
              key={spot.id}
              style={{
                position: 'absolute',
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="z-20 group"
            >
              <button
                onClick={() => setActiveHotspot(spot)}
                onMouseEnter={() => setHoveredCategory(spot.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black backdrop-blur-md transition-all duration-300 transform hover:scale-115 cursor-pointer shadow-xl ${
                  isSelected || isHovered
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/40 scale-110 shadow-[0_0_20px_rgba(110,231,183,0.8)]'
                    : 'bg-slate-900/90 text-white border border-slate-700 hover:border-emerald-400'
                }`}
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span>{spot.icon}</span>
                <span className="hidden sm:inline font-bold">{spot.category.toUpperCase()}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* FLOATING HOTSPOT INFORMATION CARD MODAL */}
      {/* ========================================================= */}
      {activeHotspot && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 bg-slate-900/95 border border-emerald-500/50 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-white space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          {/* Card Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-extrabold text-xl border border-emerald-500/30">
                {activeHotspot.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">{activeHotspot.name}</h3>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  LIVE TELEMETRY NODE
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveHotspot(null)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Current Usage</span>
              <span className="text-sm font-extrabold text-emerald-400">{activeHotspot.currentUsage}</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Today's AI Forecast</span>
              <span className="text-sm font-extrabold text-cyan-400">{activeHotspot.predictedValue}</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Efficiency</span>
              <span className="text-sm font-extrabold text-amber-400">{activeHotspot.efficiency}</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Status Badge</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Optimal Health
              </span>
            </div>
          </div>

          {/* Greenie AI Recommendation */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
            <div className="font-extrabold text-emerald-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Greenie AI Recommendation
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{activeHotspot.aiRecommendation}</p>
          </div>

          {/* Card Action Button */}
          <button
            onClick={() => {
              onNavigateToTab(activeHotspot.tabKey);
              setActiveHotspot(null);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-1.5"
          >
            <span>VIEW DETAILED {activeHotspot.category.toUpperCase()} ANALYTICS</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Footer Info Legend */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">STATUS: 100% OPERATIONAL</span>
          <span>•</span>
          <span>BUILDING FACADE: LICET MAIN BLOCK</span>
        </div>
        <span className="text-slate-500">CLICK ANY HOTSPOT FOR LIVE TELEMETRY</span>
      </div>
    </div>
  );
};
