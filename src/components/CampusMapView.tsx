import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Zap,
  Droplet,
  Flame,
  Building2,
  Maximize2,
  Info,
  Sun,
  ShieldCheck,
  ChevronRight,
  X,
  Sparkles,
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
  const [mapMode, setMapMode] = useState<'svg' | 'leaflet'>('svg');
  const [heatmapMode, setHeatmapMode] = useState<'status' | 'energy' | 'water' | 'carbon'>('status');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(buildings[0]);

  // Color helper based on selected heatmap mode
  const getBuildingColor = (b: Building) => {
    if (heatmapMode === 'status') {
      if (b.status === 'green') return 'fill-emerald-500/20 stroke-emerald-500 hover:fill-emerald-500/40';
      if (b.status === 'yellow') return 'fill-amber-500/20 stroke-amber-500 hover:fill-amber-500/40';
      return 'fill-red-500/20 stroke-red-500 hover:fill-red-500/40';
    }
    if (heatmapMode === 'energy') {
      if (b.currentEnergyKwh > 2000) return 'fill-red-500/30 stroke-red-500';
      if (b.currentEnergyKwh > 1000) return 'fill-amber-500/30 stroke-amber-500';
      return 'fill-emerald-500/30 stroke-emerald-500';
    }
    if (heatmapMode === 'water') {
      if (b.currentWaterLiters > 10000) return 'fill-blue-600/40 stroke-blue-500';
      if (b.currentWaterLiters > 4000) return 'fill-cyan-500/30 stroke-cyan-400';
      return 'fill-emerald-500/30 stroke-emerald-500';
    }
    // Carbon
    if (b.currentCarbonKg > 1200) return 'fill-purple-600/30 stroke-purple-500';
    return 'fill-emerald-500/30 stroke-emerald-500';
  };

  const bldgRecs = selectedBuilding
    ? recommendations.filter((r) => r.buildingId === selectedBuilding.id)
    : [];

  return (
    <div className="space-y-6 pb-8">
      {/* Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-slate-800/90 p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-6 w-6 text-emerald-500" />
            Interactive Campus Digital Twin 2D/3D Map
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time IoT building footprints, solar rooftops & spatial telemetry layers
          </p>
        </div>

        {/* View Controls & Heatmap Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Heatmap Layer Selectors */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setHeatmapMode('status')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
                heatmapMode === 'status'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Status
            </button>
            <button
              onClick={() => setHeatmapMode('energy')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
                heatmapMode === 'energy'
                  ? 'bg-amber-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Energy
            </button>
            <button
              onClick={() => setHeatmapMode('water')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
                heatmapMode === 'water'
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Water
            </button>
            <button
              onClick={() => setHeatmapMode('carbon')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition ${
                heatmapMode === 'carbon'
                  ? 'bg-purple-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Carbon
            </button>
          </div>

          {/* Map Vector vs Leaflet Mode Switcher */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setMapMode('svg')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                mapMode === 'svg'
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Vector Twin
            </button>
            <button
              onClick={() => setMapMode('leaflet')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                mapMode === 'leaflet'
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              GIS Satellite Map
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Map Stage + Selected Building Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map Canvas */}
        <div className="lg:col-span-2 relative rounded-3xl bg-slate-900 p-4 border border-slate-800 shadow-xl min-h-[520px] flex flex-col justify-between overflow-hidden">
          {/* Map Header Legend Bar */}
          <div className="z-10 flex items-center justify-between rounded-2xl bg-slate-800/80 backdrop-blur-md px-4 py-2 border border-slate-700/60 text-xs text-slate-200">
            <div className="flex items-center gap-4">
              <span className="font-bold text-emerald-400">Layer: {heatmapMode.toUpperCase()}</span>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Normal
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Moderate
                <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span> High Load
              </div>
            </div>
            <span className="hidden sm:inline text-slate-400">Scale 1:5000 • 8 Blocks</span>
          </div>

          {/* SVG Vector Campus Digital Twin Layout */}
          {mapMode === 'svg' ? (
            <div className="relative w-full h-[450px] my-auto overflow-hidden rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-center p-2">
              <svg viewBox="0 0 720 560" className="w-full h-full max-h-[440px]">
                {/* Background Grid & Campus Road Net */}
                <defs>
                  <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="720" height="560" fill="url(#campusGrid)" />

                {/* Campus Roads */}
                <path
                  d="M 260 20 L 260 540 M 20 180 L 700 180 M 20 370 L 700 370"
                  stroke="#334155"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 260 20 L 260 540 M 20 180 L 700 180 M 20 370 L 700 370"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                />

                {/* Greenery / Eco Zones */}
                <circle cx="210" cy="110" r="32" fill="#059669" fillOpacity="0.15" />
                <circle cx="480" cy="460" r="45" fill="#059669" fillOpacity="0.15" />

                {/* Render Building Footprints */}
                {buildings.map((b) => {
                  const isSelected = selectedBuilding?.id === b.id;
                  const colorClass = getBuildingColor(b);

                  return (
                    <g
                      key={b.id}
                      onClick={() => setSelectedBuilding(b)}
                      className="cursor-pointer group transition-all"
                    >
                      {/* Outer Glow on Selection */}
                      {isSelected && (
                        <rect
                          x={b.svgPath.x - 4}
                          y={b.svgPath.y - 4}
                          width={b.svgPath.width + 8}
                          height={b.svgPath.height + 8}
                          rx={16}
                          fill="none"
                          stroke="#22C55E"
                          strokeWidth="2.5"
                          className="animate-pulse"
                        />
                      )}

                      {/* Building Polygon Card */}
                      <rect
                        x={b.svgPath.x}
                        y={b.svgPath.y}
                        width={b.svgPath.width}
                        height={b.svgPath.height}
                        rx={12}
                        strokeWidth="2"
                        className={`${colorClass} transition-all duration-300 group-hover:scale-[1.01]`}
                      />

                      {/* Solar Rooftop Icon Indicator */}
                      {b.solarCapacityKw > 0 && (
                        <g transform={`translate(${b.svgPath.x + 8}, ${b.svgPath.y + 8})`}>
                          <rect width="20" height="14" rx="3" fill="#F59E0B" fillOpacity="0.9" />
                          <path d="M2 7 h16 M10 0 v14" stroke="#FFF" strokeWidth="0.8" />
                        </g>
                      )}

                      {/* Label & Primary Metric */}
                      <text
                        x={b.svgPath.labelX}
                        y={b.svgPath.labelY - 6}
                        textAnchor="middle"
                        fill="#FFF"
                        fontSize="12"
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {b.name}
                      </text>
                      <text
                        x={b.svgPath.labelX}
                        y={b.svgPath.labelY + 10}
                        textAnchor="middle"
                        fill="#94A3B8"
                        fontSize="10"
                        className="pointer-events-none"
                      >
                        {heatmapMode === 'energy'
                          ? `${b.currentEnergyKwh} kWh`
                          : heatmapMode === 'water'
                          ? `${b.currentWaterLiters} L`
                          : heatmapMode === 'carbon'
                          ? `${b.currentCarbonKg} kg CO2`
                          : `Occupancy: ${b.currentOccupancy}`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            /* Leaflet OpenStreetMap Fallback Simulation */
            <div className="relative w-full h-[450px] my-auto overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <iframe
                title="Campus GIS Satellite Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.5850%2C12.9650%2C77.6050%2C12.9800&amp;layer=mapnik"
                className="w-full h-full border-0 opacity-80 filter contrast-125 brightness-90"
              />
              <div className="absolute bottom-4 left-4 rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-2 text-xs text-white border border-slate-700">
                <span className="font-bold text-emerald-400">OpenStreetMap GIS Twin Layer Active</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Selected Building Quick Inspector Panel */}
        {selectedBuilding && (
          <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {selectedBuilding.code} • {selectedBuilding.category.toUpperCase()}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedBuilding.name}
                </h2>
              </div>
              <button
                onClick={() => onSelectBuilding(selectedBuilding.id)}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1"
                title="Open Full Building Details"
              >
                Inspect <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-3 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Energy Load</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedBuilding.currentEnergyKwh} kWh
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-3 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                  <Droplet className="h-3.5 w-3.5 text-blue-500" />
                  <span>Water Inflow</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedBuilding.currentWaterLiters.toLocaleString()} L
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-3 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Solar Rooftop</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedBuilding.solarCapacityKw} kW
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-3 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                  <span>CO2 Footprint</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedBuilding.currentCarbonKg} kg
                </div>
              </div>
            </div>

            {/* Targeted AI Recommendations */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Building AI Prescriptions ({bldgRecs.length})
              </h4>
              {bldgRecs.length === 0 ? (
                <div className="text-xs text-slate-400 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                  No critical AI prescriptions required for this block.
                </div>
              ) : (
                bldgRecs.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl bg-slate-50 dark:bg-slate-700/50 p-3 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1"
                  >
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {r.title}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {r.description}
                    </p>
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                      Est. Savings: ₹{r.estimatedSavingsInr.toLocaleString()}/yr
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
