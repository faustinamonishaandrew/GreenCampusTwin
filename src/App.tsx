/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CampusMapView } from './components/CampusMapView';
import { BuildingDetailsView } from './components/BuildingDetailsView';
import { AIPredictionsView } from './components/AIPredictionsView';
import { AnomaliesView } from './components/AnomaliesView';
import { RecommendationsView } from './components/RecommendationsView';
import { SustainabilityScoreView } from './components/SustainabilityScoreView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { ReportsView } from './components/ReportsView';
import { AdminPanelView } from './components/AdminPanelView';
import { AuthModal } from './components/AuthModal';

import { AIInsightsView } from './components/AIInsightsView';
import { SettingsView } from './components/SettingsView';
import { DataHealthView } from './components/DataHealthView';
import { EnvironmentalEngineView } from './components/EnvironmentalEngineView';
import { PredictiveMaintenanceView } from './components/PredictiveMaintenanceView';
import { InstitutionalBenchmarkingView } from './components/InstitutionalBenchmarkingView';
import { CopilotWidget } from './components/CopilotWidget';
import { LoginView } from './components/LoginView';

import {
  Building,
  TelemetryDataPoint,
  Anomaly,
  Recommendation,
  PredictionSummary,
  SustainabilityScores,
  WeatherData,
  ModelMetrics,
  User,
  UserRole,
} from './types';

import {
  SAMPLE_BUILDINGS,
  SAMPLE_ANOMALIES,
  SAMPLE_RECOMMENDATIONS,
  SAMPLE_MODEL_METRICS,
  CURRENT_WEATHER,
  CURRENT_USER,
  generate365DaysData,
} from './data/mockData';

import {
  calculateSustainabilityScores,
  predictTomorrowUsage,
} from './utils/aiEngine';

import { generateSustainabilityReportPDF } from './utils/pdfGenerator';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  // Theme state
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('dark');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Tab & Selection State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [showCopilotModal, setShowCopilotModal] = useState<boolean>(false);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Login Simulation & Local Storage Persistence State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('gcdt_logged_in') === 'true';
  });
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    return localStorage.getItem('gcdt_guest_mode') === 'true';
  });
  const [welcomeSnackbar, setWelcomeSnackbar] = useState<string | null>(null);

  const triggerWelcomeSnackbar = () => {
    setWelcomeSnackbar('Welcome to Green Campus Digital Twin!');
    setTimeout(() => {
      setWelcomeSnackbar(null);
    }, 4000);
  };

  const handleLogin = (email: string) => {
    localStorage.setItem('gcdt_logged_in', 'true');
    localStorage.setItem('gcdt_guest_mode', 'false');
    localStorage.setItem('gcdt_user_email', email);
    setIsLoggedIn(true);
    setIsGuestMode(false);
    setCurrentUser((prev) => ({ ...prev, email }));
    setActiveTab('dashboard');
    triggerWelcomeSnackbar();
  };

  const handleGuestLogin = () => {
    localStorage.setItem('gcdt_logged_in', 'true');
    localStorage.setItem('gcdt_guest_mode', 'true');
    setIsLoggedIn(true);
    setIsGuestMode(true);
    setActiveTab('dashboard');
    triggerWelcomeSnackbar();
  };

  const handleLogout = () => {
    localStorage.removeItem('gcdt_logged_in');
    localStorage.removeItem('gcdt_guest_mode');
    localStorage.removeItem('gcdt_user_email');
    setIsLoggedIn(false);
    setIsGuestMode(false);
  };

  // Core Data States
  const [buildings, setBuildings] = useState<Building[]>(SAMPLE_BUILDINGS);
  const [anomalies, setAnomalies] = useState<Anomaly[]>(SAMPLE_ANOMALIES);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(SAMPLE_RECOMMENDATIONS);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics[]>(SAMPLE_MODEL_METRICS);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryDataPoint[]>([]);

  // Theme Mode HTML Effect
  useEffect(() => {
    if (themeMode === 'system') {
      const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isSysDark);
      if (isSysDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (themeMode === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Initial Data Load & API Fetching with graceful fallback
  useEffect(() => {
    const history = generate365DaysData();
    setTelemetryHistory(history);

    // Attempt to sync with Express REST backend if live
    fetch('/api/buildings')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setBuildings(data);
        }
      })
      .catch(() => {
        // Fallback to local mock dataset
      });
  }, []);

  // Computed Engine Values
  const scores: SustainabilityScores = calculateSustainabilityScores(buildings, telemetryHistory);
  const prediction: PredictionSummary = predictTomorrowUsage(buildings, telemetryHistory);

  // Handlers
  const handleSelectBuilding = (bldgId: string) => {
    setSelectedBuildingId(bldgId);
    setActiveTab('building_details');
  };

  const handleResolveAnomaly = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a))
    );

    // Call REST endpoint
    fetch(`/api/anomalies/${id}/resolve`, { method: 'POST' }).catch(() => {});
  };

  const handleApplyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, applied: true } : r))
    );

    // Call REST endpoint
    fetch(`/api/recommendations/${id}/apply`, { method: 'POST' }).catch(() => {});
  };

  const handleSimulateAnomalyTrigger = () => {
    const newAnom: Anomaly = {
      id: `anom-${Date.now()}`,
      buildingId: 'bldg-2',
      buildingName: 'Computer Science Block',
      type: 'electricity_spike',
      title: 'Real-time Isolation Forest Surge Outlier',
      description: 'Sudden 1,850 W power surge detected in Server Lab B. Auto-diagnosed by Isolation Forest.',
      problem: 'Unscheduled GPU Server Array Overclock',
      cause: 'Batch training process initiated without dynamic chiller bypass active.',
      impact: 'Est. ₹1,850 excess electricity cost per day (+380 kg CO2).',
      immediateAction: 'Enable eco-throttle on Server Rack 4 and dispatch HVAC technician.',
      longTermAction: 'Implement automated API workload throttling during peak solar tariffs.',
      severity: 'critical',
      timestamp: 'Just now',
      detectedBy: 'Isolation Forest ML Model v2.4',
      confidence: 0.985,
      valueObserved: '1,850 W',
      thresholdExpected: '620 W',
      status: 'open',
    };
    setAnomalies((prev) => [newAnom, ...prev]);
  };

  const handleRetrainModels = () => {
    setModelMetrics((prev) =>
      prev.map((m) => ({
        ...m,
        r2Score: Math.min(0.992, Number((m.r2Score + 0.005).toFixed(3))),
        mae: Number((m.mae * 0.95).toFixed(2)),
        lastTrained: 'Just now',
      }))
    );

    fetch('/api/models/retrain', { method: 'POST' }).catch(() => {});
  };

  const handleUserRoleChange = (newRole: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
  };

  const handleExportPDF = () => {
    generateSustainabilityReportPDF(buildings, scores, anomalies, recommendations, 'Monthly');
  };

  const openAnomalyCount = anomalies.filter(
    (a) => a.status === 'open' || a.status === 'investigating'
  ).length;

  const currentBuilding = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  // If user is not logged in, show Login Screen
  if (!isLoggedIn) {
    return (
      <LoginView
        onLogin={handleLogin}
        onGuestLogin={handleGuestLogin}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative">
      {/* Welcome Toast Snackbar */}
      {welcomeSnackbar && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm px-5 py-3 shadow-2xl shadow-emerald-500/40 border border-emerald-400/30 animate-in slide-in-from-top-4 fade-in duration-300">
          <Sparkles className="h-4 w-4 text-emerald-200 shrink-0" />
          <span>{welcomeSnackbar}</span>
        </div>
      )}

      {/* SaaS Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        setCurrentUserRole={handleUserRoleChange}
        anomalies={anomalies}
        onSelectBuilding={handleSelectBuilding}
        onNavigateToTab={(tab) => {
          setSelectedBuildingId(null);
          setActiveTab(tab);
        }}
        onOpenAuth={() => setShowAuthModal(true)}
        isGuestMode={isGuestMode}
        onLogout={handleLogout}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab === 'building_details' ? 'buildings' : activeTab}
          setActiveTab={(tab) => {
            setSelectedBuildingId(null);
            setActiveTab(tab);
          }}
          openAnomalyCount={openAnomalyCount}
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardView
                buildings={buildings}
                anomalies={anomalies}
                prediction={prediction}
                scores={scores}
                weather={CURRENT_WEATHER}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onSelectBuilding={handleSelectBuilding}
                onExportPDF={handleExportPDF}
              />
            )}

            {activeTab === 'ai_insights' && (
              <AIInsightsView
                buildings={buildings}
                anomalies={anomalies}
                scores={scores}
                recommendations={recommendations}
                onApplyRecommendation={handleApplyRecommendation}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'data_health' && (
              <DataHealthView buildings={buildings} />
            )}

            {activeTab === 'environmental_engine' && (
              <EnvironmentalEngineView buildings={buildings} scores={scores} />
            )}

            {activeTab === 'predictive_maintenance' && (
              <PredictiveMaintenanceView />
            )}

            {activeTab === 'benchmarks' && (
              <InstitutionalBenchmarkingView scores={scores} />
            )}

            {activeTab === 'copilot' && (
              <div className="max-w-4xl mx-auto">
                <CopilotWidget buildings={buildings} scores={scores} />
              </div>
            )}

            {activeTab === 'campus_map' && (
              <CampusMapView
                buildings={buildings}
                recommendations={recommendations}
                onSelectBuilding={handleSelectBuilding}
              />
            )}

            {activeTab === 'building_details' && (
              <BuildingDetailsView
                building={currentBuilding}
                telemetryHistory={telemetryHistory.filter((t) => t.buildingId === currentBuilding.id)}
                recommendations={recommendations}
                anomalies={anomalies}
                onBack={() => setActiveTab('buildings')}
                onApplyRecommendation={handleApplyRecommendation}
              />
            )}

            {activeTab === 'buildings' && (
              <BuildingDetailsView
                building={currentBuilding}
                telemetryHistory={telemetryHistory.filter((t) => t.buildingId === currentBuilding.id)}
                recommendations={recommendations}
                anomalies={anomalies}
                onBack={() => setActiveTab('dashboard')}
                onApplyRecommendation={handleApplyRecommendation}
              />
            )}

            {activeTab === 'predictions' && (
              <AIPredictionsView
                prediction={prediction}
                modelMetrics={modelMetrics}
              />
            )}

            {activeTab === 'anomalies' && (
              <AnomaliesView
                anomalies={anomalies}
                onResolveAnomaly={handleResolveAnomaly}
                onSimulateAnomalyTrigger={handleSimulateAnomalyTrigger}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsView
                recommendations={recommendations}
                onApplyRecommendation={handleApplyRecommendation}
              />
            )}

            {activeTab === 'score' && (
              <SustainabilityScoreView scores={scores} />
            )}

            {activeTab === 'simulator' && (
              <WhatIfSimulatorView currentScores={scores} />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                buildings={buildings}
                scores={scores}
                anomalies={anomalies}
                recommendations={recommendations}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanelView
                buildings={buildings}
                modelMetrics={modelMetrics}
                currentRole={currentUser.role}
                onChangeRole={handleUserRoleChange}
                onRetrainModels={handleRetrainModels}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                currentUser={currentUser}
                setCurrentUserRole={handleUserRoleChange}
                onOpenAuth={() => setShowAuthModal(true)}
                onLogout={handleLogout}
              />
            )}
          </div>
        </main>
      </div>

      {/* Authentication & Role Switcher Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onSelectRole={handleUserRoleChange}
      />

      {/* Floating Copilot Launcher Button */}
      {!showCopilotModal && (
        <button
          onClick={() => setShowCopilotModal(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-3 shadow-2xl shadow-emerald-500/50 hover:scale-105 transition-all ring-4 ring-emerald-500/20"
        >
          <Bot className="h-5 w-5 animate-bounce" />
          <span>Greenie AI 🌿</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-200 animate-ping"></span>
        </button>
      )}

      {/* Floating Copilot Modal */}
      {showCopilotModal && (
        <CopilotWidget
          buildings={buildings}
          scores={scores}
          isFloatingModal={true}
          onCloseModal={() => setShowCopilotModal(false)}
        />
      )}
    </div>
  );
}
