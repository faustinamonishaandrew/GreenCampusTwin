import React, { useState } from 'react';
import {
  MapPin,
  Zap,
  Droplet,
  Sun,
  Wind,
  Trash2,
  Sparkles,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Focus,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ChevronRight,
  Gauge,
  X,
  ShieldCheck,
  Cpu,
  Users,
} from 'lucide-react';
import { Building, Recommendation } from '../types';

interface CampusMapViewProps {
  buildings: Building[];
  recommendations: Recommendation[];
  onSelectBuilding: (buildingId: string) => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({
  buildings,
  recommendations,
  onSelectBuilding,
}) => {
  // Primary LICET Main Building reference
  const licetBuilding = buildings.find((b) => b.code.includes('LICET')) || buildings[0];

  // Camera State Controls
  const [zoom, setZoom] = useState<number>(1.1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  // Simulated Health Status Override
  const [simulatedStatus, setSimulatedStatus] = useState<'green' | 'yellow' | 'orange' | 'red'>('green');

  // Inspector Drawer Modal State
  const [showInspector, setShowInspector] = useState<boolean>(false);

  // Floating Overlay Layer Toggles
  const [showOverlays, setShowOverlays] = useState({
    energy: true,
    water: true,
    aqi: true,
    solar: true,
    waste: true,
    carbon: true,
  });

  // Camera Handler Functions
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetCamera = () => {
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
    setRotation(0);
  };
  const handleFocusMainBuilding = () => {
    setZoom(1.4);
    setPanX(0);
    setPanY(15);
    setRotation(0);
  };

  // Status Styling Colors
  const getStatusColor = () => {
    switch (simulatedStatus) {
      case 'green':
        return {
          bg: 'fill-emerald-500/20 stroke-emerald-500',
          glow: 'rgba(34, 197, 94, 0.4)',
          text: 'text-emerald-500',
          border: 'border-emerald-500/40',
          badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
          label: 'NORMAL HEALTH',
        };
      case 'yellow':
        return {
          bg: 'fill-amber-500/25 stroke-amber-500',
          glow: 'rgba(234, 179, 8, 0.4)',
          text: 'text-amber-500',
          border: 'border-amber-500/40',
          badge: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
          label: 'MODERATE WARNING',
        };
      case 'orange':
        return {
          bg: 'fill-orange-500/30 stroke-orange-500',
          glow: 'rgba(249, 115, 22, 0.4)',
          text: 'text-orange-500',
          border: 'border-orange-500/40',
          badge: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
          label: 'HIGH CONSUMPTION',
        };
      case 'red':
        return {
          bg: 'fill-red-500/35 stroke-red-500',
          glow: 'rgba(239, 68, 68, 0.5)',
          text: 'text-red-500',
          border: 'border-red-500/40',
          badge: 'bg-red-500/10 text-red-500 border-red-500/30',
          label: 'CRITICAL ALERT',
        };
    }
  };

  const statusStyle = getStatusColor();

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-wider">
              LICET DIGITAL TWIN 2.0
            </span>
            <span className="text-xs text-slate-400 font-mono">13.0618° N, 80.2337° E</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
            <MapPin className="h-6 w-6 text-emerald-500" />
            Loyola-ICAM College of Engineering & Technology (LICET)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive IoT spatial model of the LICET Main Academic Block, Rooftop PV Array & Surrounding Campus
          </p>
        </div>

        {/* Health Status Override Selector */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 px-1">
            <Activity className="h-4 w-4 text-emerald-500" />
            Simulate Status:
          </span>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSimulatedStatus('green')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition flex items-center gap-1 ${
                simulatedStatus === 'green'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              Normal
            </button>

            <button
              onClick={() => setSimulatedStatus('yellow')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition flex items-center gap-1 ${
                simulatedStatus === 'yellow'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                  : 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Warning
            </button>

            <button
              onClick={() => setSimulatedStatus('orange')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition flex items-center gap-1 ${
                simulatedStatus === 'orange'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-orange-300" />
              High Load
            </button>

            <button
              onClick={() => setSimulatedStatus('red')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition flex items-center gap-1 ${
                simulatedStatus === 'red'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                  : 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-50'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-300 animate-ping" />
              Critical
            </button>
          </div>
        </div>
      </div>

      {/* Main Digital Twin Container */}
      <div className="relative rounded-3xl bg-slate-950 p-4 border border-slate-800 shadow-2xl overflow-hidden min-h-[580px] flex flex-col justify-between">
        {/* Top Floating Camera & Layer Controls Toolbar */}
        <div className="z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900/90 backdrop-blur-md p-3 border border-slate-800 text-xs text-white">
          {/* Camera Actions */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono font-bold mr-1">CAMERA:</span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1 font-bold"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4 text-emerald-400" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1 font-bold"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4 text-emerald-400" />
            </button>
            <span className="px-2 py-1 rounded-lg bg-slate-800/80 font-mono text-[11px] font-bold text-emerald-400 border border-slate-700">
              {Math.round(zoom * 100)}%
            </span>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            <button
              onClick={() => setRotation((r) => (r + 30) % 360)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1 font-bold"
              title="Rotate Camera"
            >
              <RotateCw className="h-4 w-4 text-cyan-400" />
            </button>
            <span className="px-2 py-1 rounded-lg bg-slate-800/80 font-mono text-[11px] font-bold text-cyan-400 border border-slate-700">
              {rotation}°
            </span>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            <button
              onClick={handleFocusMainBuilding}
              className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition flex items-center gap-1.5 font-extrabold"
            >
              <Focus className="h-4 w-4" />
              Focus Main Building
            </button>

            <button
              onClick={handleResetCamera}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 font-bold"
              title="Reset View"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* Floating Metric Layer Toggles */}
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <span className="text-slate-400 font-mono mr-1">OVERLAYS:</span>
            <button
              onClick={() => setShowOverlays((p) => ({ ...p, energy: !p.energy }))}
              className={`px-2.5 py-1.5 rounded-lg border transition ${
                showOverlays.energy
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-500'
              }`}
            >
              ⚡ Energy
            </button>
            <button
              onClick={() => setShowOverlays((p) => ({ ...p, water: !p.water }))}
              className={`px-2.5 py-1.5 rounded-lg border transition ${
                showOverlays.water
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-500'
              }`}
            >
              💧 Water
            </button>
            <button
              onClick={() => setShowOverlays((p) => ({ ...p, solar: !p.solar }))}
              className={`px-2.5 py-1.5 rounded-lg border transition ${
                showOverlays.solar
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-500'
              }`}
            >
              ☀ Solar
            </button>
            <button
              onClick={() => setShowOverlays((p) => ({ ...p, aqi: !p.aqi }))}
              className={`px-2.5 py-1.5 rounded-lg border transition ${
                showOverlays.aqi
                  ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-500'
              }`}
            >
              🌬 AQI
            </button>
          </div>
        </div>

        {/* Interactive SVG Digital Twin Canvas */}
        <div className="relative w-full h-[520px] my-auto overflow-hidden rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-center p-2 cursor-grab active:cursor-grabbing">
          {/* Ambient Canvas Lighting Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

          {/* SVG Viewport with Camera Transforms */}
          <svg
            viewBox="0 0 900 650"
            className="w-full h-full max-h-[500px] transition-transform duration-500 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${panX}px, ${panY}px) rotate(${rotation}deg)`,
            }}
          >
            <defs>
              {/* Technical Campus Blueprint Grid Pattern */}
              <pattern id="licetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" />
              </pattern>

              {/* Glass Window Gradient */}
              <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
              </linearGradient>

              {/* Solar PV Cell Pattern */}
              <pattern id="solarGrid" width="12" height="8" patternUnits="userSpaceOnUse">
                <rect width="11" height="7" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="0.5" />
              </pattern>

              {/* Roof Shading Gradient */}
              <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <rect width="900" height="650" fill="url(#licetGrid)" />

            {/* Loyola Campus Entrance Pathway & Boulevard */}
            <path
              d="M 450 650 L 450 480 M 150 480 L 750 480"
              stroke="#334155"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M 450 650 L 450 480 M 150 480 L 750 480"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeDasharray="10 10"
              strokeLinecap="round"
            />

            {/* Entrance Gate & Security Checkpoint */}
            <g transform="translate(410, 580)">
              <rect x="0" y="0" width="80" height="12" rx="3" fill="#475569" />
              <text x="40" y="-5" textAnchor="middle" fill="#22C55E" fontSize="9" fontWeight="bold">
                LICET MAIN ENTRANCE GATE
              </text>
            </g>

            {/* Green Landscaping, Lawns & Trees */}
            {/* Front Lawn Left */}
            <rect x="180" y="400" width="180" height="65" rx="16" fill="#059669" fillOpacity="0.25" stroke="#10B981" strokeWidth="1" />
            <circle cx="210" cy="425" r="14" fill="#10B981" fillOpacity="0.4" />
            <circle cx="250" cy="435" r="18" fill="#059669" fillOpacity="0.5" />
            <circle cx="320" cy="420" r="15" fill="#10B981" fillOpacity="0.4" />

            {/* Front Lawn Right */}
            <rect x="540" y="400" width="180" height="65" rx="16" fill="#059669" fillOpacity="0.25" stroke="#10B981" strokeWidth="1" />
            <circle cx="580" cy="430" r="16" fill="#059669" fillOpacity="0.5" />
            <circle cx="640" cy="420" r="18" fill="#10B981" fillOpacity="0.4" />
            <circle cx="690" cy="435" r="14" fill="#059669" fillOpacity="0.4" />

            {/* Central Courtyard Fountain */}
            <circle cx="450" cy="435" r="22" fill="#0284C7" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="450" cy="435" r="8" fill="#38BDF8" className="animate-ping" />

            {/* Parking Area & EV Charging Stations */}
            <g transform="translate(70, 360)">
              <rect x="0" y="0" width="90" height="100" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              <text x="45" y="16" textAnchor="middle" fill="#94A3B8" fontSize="8" fontX="bold">
                EV PARKING
              </text>
              <rect x="15" y="28" width="24" height="12" rx="3" fill="#22C55E" />
              <rect x="50" y="28" width="24" height="12" rx="3" fill="#38BDF8" />
              <rect x="15" y="52" width="24" height="12" rx="3" fill="#64748B" />
              <rect x="50" y="52" width="24" height="12" rx="3" fill="#22C55E" />
            </g>

            {/* ======================================================= */}
            {/* LOYOLA-ICAM (LICET) MAIN ACADEMIC BUILDING STRUCTURE */}
            {/* ======================================================= */}
            <g
              onClick={() => setShowInspector(true)}
              className="cursor-pointer group transition-transform duration-300 hover:scale-[1.01]"
            >
              {/* Ground Isometric Shadow */}
              <ellipse cx="450" cy="270" rx="310" ry="120" fill="#000" fillOpacity="0.5" />

              {/* Status Glow Aura Halo */}
              <rect
                x="170"
                y="130"
                width="560"
                height="250"
                rx="24"
                fill="none"
                stroke={statusStyle.glow}
                strokeWidth="6"
                className="animate-pulse"
              />

              {/* Main Building Base Envelope */}
              <rect
                x="180"
                y="140"
                width="540"
                height="230"
                rx="20"
                strokeWidth="3"
                className={`${statusStyle.bg} transition-all duration-300`}
              />

              {/* Architectural Sections & Wings */}
              {/* West Wing - Mechanical & Civil Labs */}
              <rect x="195" y="155" width="120" height="200" rx="12" fill="url(#roofGrad)" stroke="#475569" strokeWidth="1.5" />
              {/* East Wing - Computer Science & Electrical Labs */}
              <rect x="585" y="155" width="120" height="200" rx="12" fill="url(#roofGrad)" stroke="#475569" strokeWidth="1.5" />
              {/* Central Block - Dean Office, Classrooms & Auditorium */}
              <rect x="330" y="150" width="240" height="210" rx="16" fill="#1E293B" stroke="#64748B" strokeWidth="2" />

              {/* Windows Matrix - Multi-story Classroom Facade */}
              {/* Left Wing Windows */}
              <g transform="translate(205, 170)">
                {[0, 1, 2, 3].map((row) => (
                  <g key={`l-row-${row}`} transform={`translate(0, ${row * 42})`}>
                    <rect x="0" y="0" width="22" height="28" rx="4" fill="url(#windowGradient)" />
                    <rect x="28" y="0" width="22" height="28" rx="4" fill="url(#windowGradient)" />
                    <rect x="56" y="0" width="22" height="28" rx="4" fill="url(#windowGradient)" />
                  </g>
                ))}
              </g>

              {/* Right Wing Windows */}
              <g transform="translate(595, 170)">
                {[0, 1, 2, 3].map((row) => (
                  <g key={`r-row-${row}`} transform={`translate(0, ${row * 42})`}>
                    <rect x="0" y="0" width="22" height="28" rx="4" fill="url(#windowGradient)" />
                    <rect x="28" y="0" width="22" height="28" rx="4" fill="url(#windowGradient)" />
                    <rect x="56" y="0" width="22" height="28" rx="4" fill="url(#windowGradient)" />
                  </g>
                ))}
              </g>

              {/* Central Facade Columns & Main Portico Entrance */}
              <g transform="translate(340, 260)">
                {/* Portico Pillars */}
                <rect x="20" y="0" width="14" height="90" fill="#94A3B8" rx="2" />
                <rect x="60" y="0" width="14" height="90" fill="#94A3B8" rx="2" />
                <rect x="140" y="0" width="14" height="90" fill="#94A3B8" rx="2" />
                <rect x="180" y="0" width="14" height="90" fill="#94A3B8" rx="2" />

                {/* Main Entrance Glass Archway */}
                <path d="M 85 30 Q 110 0 135 30 L 135 90 L 85 90 Z" fill="#38BDF8" fillOpacity="0.7" stroke="#0284C7" strokeWidth="2" />
                {/* Entrance Stairs */}
                <rect x="70" y="80" width="80" height="15" fill="#64748B" rx="3" />
                <rect x="60" y="90" width="100" height="10" fill="#475569" rx="3" />
              </g>

              {/* LICET Official Header Banner */}
              <g transform="translate(340, 160)">
                <rect x="0" y="0" width="220" height="32" rx="8" fill="#0F172A" stroke="#22C55E" strokeWidth="1.5" />
                <text x="110" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" letterSpacing="0.5">
                  LOYOLA-ICAM (LICET)
                </text>
                <text x="110" y="26" textAnchor="middle" fill="#4ADE80" fontSize="7" fontWeight="bold">
                  MAIN ACADEMIC BUILDING
                </text>
              </g>

              {/* ROOFTOP SOLAR PV PANELS GRID */}
              <g transform="translate(345, 198)">
                <rect x="0" y="0" width="210" height="52" rx="6" fill="url(#solarGrid)" stroke="#3B82F6" strokeWidth="1.5" />
                {/* Glowing Solar Ray Effects */}
                <circle cx="30" cy="26" r="4" fill="#F59E0B" className="animate-ping" />
                <circle cx="100" cy="26" r="4" fill="#F59E0B" className="animate-ping" />
                <circle cx="170" cy="26" r="4" fill="#F59E0B" className="animate-ping" />
                <text x="105" y="-4" textAnchor="middle" fill="#FBBF24" fontSize="8" fontWeight="bold">
                  140 kW ROOFTOP SOLAR PV ARRAY
                </text>
              </g>

              {/* Interactive Click Prompt Badge */}
              <g transform="translate(450, 110)">
                <rect x="-90" y="0" width="180" height="24" rx="12" fill="#10B981" />
                <text x="0" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="extrabold">
                  👆 CLICK TO INSPECT TWIN
                </text>
              </g>
            </g>

            {/* ======================================================= */}
            {/* FLOATING METRIC OVERLAYS OVER LICET BUILDING */}
            {/* ======================================================= */}
            {showOverlays.energy && (
              <g transform="translate(140, 160)">
                <rect x="0" y="0" width="110" height="38" rx="12" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" className="drop-shadow-xl" />
                <text x="12" y="16" fill="#F59E0B" fontSize="10" fontWeight="black">⚡ ENERGY</text>
                <text x="12" y="30" fill="#FFFFFF" fontSize="11" fontWeight="bold">180 kWh</text>
              </g>
            )}

            {showOverlays.water && (
              <g transform="translate(650, 160)">
                <rect x="0" y="0" width="110" height="38" rx="12" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" className="drop-shadow-xl" />
                <text x="12" y="16" fill="#3B82F6" fontSize="10" fontWeight="black">💧 WATER</text>
                <text x="12" y="30" fill="#FFFFFF" fontSize="11" fontWeight="bold">4,200 Liters</text>
              </g>
            )}

            {showOverlays.solar && (
              <g transform="translate(390, 70)">
                <rect x="0" y="0" width="120" height="38" rx="12" fill="#0F172A" stroke="#EAB308" strokeWidth="2" className="drop-shadow-xl" />
                <text x="12" y="16" fill="#EAB308" fontSize="10" fontWeight="black">☀ SOLAR GEN</text>
                <text x="12" y="30" fill="#FFFFFF" fontSize="11" fontWeight="bold">112 kW Active</text>
              </g>
            )}

            {showOverlays.aqi && (
              <g transform="translate(140, 310)">
                <rect x="0" y="0" width="110" height="38" rx="12" fill="#0F172A" stroke="#14B8A6" strokeWidth="2" className="drop-shadow-xl" />
                <text x="12" y="16" fill="#14B8A6" fontSize="10" fontWeight="black">🌬 AIR QUALITY</text>
                <text x="12" y="30" fill="#FFFFFF" fontSize="11" fontWeight="bold">AQI 42 (Good)</text>
              </g>
            )}

            {showOverlays.carbon && (
              <g transform="translate(650, 310)">
                <rect x="0" y="0" width="110" height="38" rx="12" fill="#0F172A" stroke="#A855F7" strokeWidth="2" className="drop-shadow-xl" />
                <text x="12" y="16" fill="#A855F7" fontSize="10" fontWeight="black">🌍 CARBON</text>
                <text x="12" y="30" fill="#FFFFFF" fontSize="11" fontWeight="bold">280 kg CO2</text>
              </g>
            )}
          </svg>
        </div>

        {/* Bottom Legend & Quick Inspector Trigger */}
        <div className="z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900/90 backdrop-blur-md p-3 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-emerald-400">Status: {statusStyle.label}</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-300">Occupancy: 980 / 1200 Capacity</span>
          </div>

          <button
            onClick={() => setShowInspector(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
          >
            <span>INSPECT LICET TELEMETRY</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ======================================================= */}
      {/* DETAILED INTERACTIVE BUILDING INSPECTOR DRAWER / MODAL */}
      {/* ======================================================= */}
      {showInspector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusStyle.badge}`}>
                    {statusStyle.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">CODE: LICET-MAIN</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Loyola-ICAM College of Engineering & Technology (LICET)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Main Academic Block • 4 Floors • 65,000 sq.ft
                </p>
              </div>

              <button
                onClick={() => setShowInspector(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 dark:text-slate-400 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Environmental Health Score Badge */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-4 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white font-black text-xl shadow-lg shadow-emerald-500/30">
                  94
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Environmental Health Score
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Calculated live across 24 IoT telemetry sensors
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  GRADE A+
                </span>
                <span className="text-[10px] text-slate-400">Top 5% University Rank</span>
              </div>
            </div>

            
            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowInspector(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
              >
                Close Inspector
              </button>

              <button
                onClick={() => {
                  setShowInspector(false);
                  onSelectBuilding(licetBuilding.id);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center gap-1.5"
              >
                <span>OPEN FULL BUILDING ANALYTICS</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
