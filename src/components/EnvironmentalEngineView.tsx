import React, { useState } from 'react';
import {
  Network,
  Sun,
  Zap,
  Droplets,
  Wind,
  Flame,
  Award,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Building, EnvironmentalDependencyNode, SustainabilityScores } from '../types';
import { SAMPLE_ENVIRONMENTAL_NODES } from '../data/mockData';

interface EnvironmentalEngineViewProps {
  buildings: Building[];
  scores: SustainabilityScores;
}

export const EnvironmentalEngineView: React.FC<EnvironmentalEngineViewProps> = ({
  buildings,
  scores,
}) => {
  const [nodes, setNodes] = useState<EnvironmentalDependencyNode[]>(SAMPLE_ENVIRONMENTAL_NODES);
  const [activeNodeId, setActiveNodeId] = useState<string>('node-weather');

  const categoryIcons: Record<string, React.ElementType> = {
    Weather: Sun,
    Solar: Sun,
    'HVAC/Energy': Zap,
    Water: Droplets,
    'Air Quality': Wind,
    Carbon: Flame,
    Score: Award,
  };

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];
  const connectedNodes = nodes.filter((n) => activeNode.connectedTo.includes(n.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <Network className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Unified Environmental Intelligence Engine
              </h2>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Cross-Resource Causal Mesh
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Maps multi-domain relationships between Weather, Solar Generation, HVAC Power Load, Water Pumping, Scope 2 Carbon & Campus Sustainability Score.
            </p>
          </div>
        </div>
      </div>

      {/* Main Causal Mesh Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Dependency Nodes List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Environmental Dependency Graph Nodes
          </div>

          <div className="space-y-2">
            {nodes.map((node) => {
              const Icon = categoryIcons[node.category] || Layers;
              const isSelected = activeNodeId === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeId(node.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                        isSelected
                          ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-purple-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {node.name}
                      </h4>
                      <p className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                        {node.currentValue}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className={`h-4 w-4 transition ${isSelected ? 'text-purple-500 translate-x-1' : 'text-slate-300 dark:text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Causal Cascade Deep-Dive */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeNode.name}
                  </h3>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                    Category: {activeNode.category}
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {activeNode.currentValue}
              </span>
            </div>

            {/* Impact Description Box */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-4 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Info className="h-4 w-4 text-purple-500" />
                <span>Environmental Impact & Physics Behavior</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeNode.impactDescription}
              </p>
            </div>

            {/* Downstream Connected Nodes */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Downstream Cascade Effects ({connectedNodes.length} Directly Influenced)
              </div>

              {connectedNodes.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  This node represents the final aggregate endpoint (Campus Sustainability Score).
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {connectedNodes.map((cn) => (
                    <div
                      key={cn.id}
                      onClick={() => setActiveNodeId(cn.id)}
                      className="cursor-pointer p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 hover:border-purple-500/50 transition group"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                        <span>{cn.name}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-purple-500 group-hover:translate-x-1 transition" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {cn.impactDescription}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Environmental AI Summary Tile */}
          <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-purple-300 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block text-white">Cross-Resource Balance Optimal</span>
                <span className="text-slate-300 text-[11px]">Solar PV offset buffering daytime peak HVAC load by 38%.</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-300 shrink-0 ml-2">
              Score: {scores.overall}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
