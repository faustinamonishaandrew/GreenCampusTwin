export type UserRole = 'admin' | 'sustainability_officer' | 'facility_manager' | 'student_auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export type BuildingCategory = 'academic' | 'residential' | 'administrative' | 'lab' | 'recreational';

export interface Building {
  id: string;
  name: string;
  category: BuildingCategory;
  code: string;
  areaSqFt: number;
  occupancyCapacity: number;
  currentOccupancy: number;
  coordinates: { lat: number; lng: number };
  svgPath: { x: number; y: number; width: number; height: number; labelX: number; labelY: number };
  efficiencyRating: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  solarCapacityKw: number;
  currentEnergyKwh: number;
  currentWaterLiters: number;
  currentWasteKg: number;
  currentAqi: number;
  currentTemperatureC: number;
  currentCarbonKg: number;
  status: 'green' | 'yellow' | 'red';
  floors: number;
  yearBuilt: number;
  dataHealthScore?: number;
}

export type TelemetrySource = 
  | 'Smart Energy Meters'
  | 'Water Sensors'
  | 'Waste Management'
  | 'Solar Panels'
  | 'Air Quality Sensors'
  | 'Weather API'
  | 'Manual Inputs';

export type DataIssueType = 
  | 'missing_value'
  | 'delayed_update'
  | 'duplicate_reading'
  | 'conflicting_sensors'
  | 'impossible_jump'
  | 'comm_failure';

export interface DataHealthIssue {
  id: string;
  buildingId: string;
  buildingName: string;
  source: TelemetrySource;
  type: DataIssueType;
  description: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high';
  correctiveRecommendation: string;
  status: 'active' | 'resolved';
}

export interface DataHealthReport {
  campusOverallHealthScore: number; // 0 - 100%
  totalActiveSensors: number;
  onlineSensors: number;
  sources: { source: TelemetrySource; status: 'optimal' | 'degraded' | 'offline'; healthPct: number }[];
  issues: DataHealthIssue[];
}

export interface TelemetryDataPoint {
  timestamp: string; // YYYY-MM-DD or YYYY-MM-DDTHH:mm
  buildingId: string;
  energyKwh: number;
  waterLiters: number;
  wasteKg: number;
  aqi: number;
  temperatureC: number;
  humidityPct: number;
  solarGenerationKwh: number;
  carbonKg: number;
  occupancyPct: number;
  isAnomaly?: boolean;
}

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Anomaly {
  id: string;
  buildingId: string;
  buildingName: string;
  type: 'electricity_spike' | 'water_leak' | 'high_waste' | 'high_carbon' | 'temp_surge' | 'hvac_malfunction';
  title: string;
  description: string;
  severity: AnomalySeverity;
  timestamp: string;
  detectedBy: string; // e.g., 'Isolation Forest ML Model v2.4'
  confidence: number; // 0 to 1
  valueObserved: string;
  thresholdExpected: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  
  // Explainable AI (XAI) explicit fields (Req #3)
  problem: string;
  cause: string;
  impact: string; // e.g. "Estimated ₹2,400 additional monthly cost, +45kg CO2"
  immediateAction: string;
  longTermAction: string;
}

export interface PredictedAnomaly {
  id: string;
  buildingId: string;
  buildingName: string;
  anomalyType: 'Energy Spike' | 'Water Leak Probability' | 'Poor Air Quality' | 'Waste Overflow' | 'Carbon Emission Increase' | 'HVAC Failure Risk';
  probabilityPct: number; // e.g. 87%
  expectedTimeframe: string; // e.g. "48 Hours"
  triggerFactors: string[];
  impactCostInr: number;
  preventiveAction: string;
  riskLevel: 'critical' | 'high' | 'medium';
}

export interface Recommendation {
  id: string;
  buildingId: string;
  buildingName: string;
  title: string;
  description: string;
  category: 'energy' | 'water' | 'waste' | 'hvac' | 'solar' | 'behavioral';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedSavingsInr: number; // ₹ saved per year
  estimatedCarbonSavedKg: number; // kg CO2 saved per year
  implementationCostInr: number;
  paybackPeriodMonths: number;
  applied: boolean;
}

export interface PredictionSummary {
  tomorrowEnergyKwh: number;
  energyChangePct: number;
  tomorrowWaterLiters: number;
  waterChangePct: number;
  tomorrowWasteKg: number;
  wasteChangePct: number;
  tomorrowCarbonKg: number;
  carbonChangePct: number;
  predictionConfidencePct: number;
  modelAccuracyR2: number;
  featuresUsed: { name: string; importancePct: number }[];
  hourlyForecast: {
    hour: string;
    energyKwh: number;
    predictedEnergyKwh: number;
    waterLiters: number;
    predictedWaterLiters: number;
    upperBoundKwh: number;
    lowerBoundKwh: number;
  }[];
}

export interface MultiHorizonForecast {
  metric: 'Electricity' | 'Water' | 'Waste' | 'AQI' | 'Carbon' | 'Sustainability Score';
  unit: string;
  current: number;
  tomorrowPredicted: number;
  nextWeekPredicted: number;
  nextMonthPredicted: number;
  targetThreshold: number;
  trend: 'improving' | 'stable' | 'deteriorating';
  chartData: { period: string; currentOrBaseline: number; predicted: number; target: number }[];
}

export interface EquipmentPredictiveMaintenance {
  id: string;
  name: string;
  equipmentType: 'Smart Meter' | 'Solar Inverter' | 'Water Pump' | 'Storage Tank' | 'Air Quality Sensor' | 'HVAC Chiller';
  buildingName: string;
  healthPct: number; // 0-100%
  predictedFailureDays: number; // e.g. 12 Days
  status: 'optimal' | 'warning' | 'critical';
  lastServiceDate: string;
  recommendedAction: string;
  failureRiskReason: string;
}

export interface InstitutionalBenchmarkData {
  campusScore: number; // e.g. 84/100
  nationalAverageScore: number; // 71/100
  stateAverageScore: number; // 68/100
  similarCollegesScore: number; // 74/100
  topGreenCertifiedScore: number; // 92/100
  rankings: {
    overallRank: number; // e.g. #3
    totalInstitutions: number; // 140
    energyRank: number;
    carbonRank: number;
    waterRank: number;
    wasteRank: number;
  };
  gapToTopCampusPoints: number;
  requiredActionsToReachNextRank: {
    title: string;
    scoreGain: number;
    estimatedCostInr: number;
    priority: 'high' | 'medium';
  }[];
}

export interface EnvironmentalDependencyNode {
  id: string;
  name: string;
  category: 'Weather' | 'Solar' | 'HVAC/Energy' | 'Water' | 'Waste' | 'Air Quality' | 'Carbon';
  currentValue: string;
  impactDescription: string;
  connectedTo: string[]; // Node IDs this triggers or affects
}

export interface SustainabilityScores {
  overall: number; // 0-100
  energy: number;
  water: number;
  waste: number;
  airQuality: number;
  carbon: number;
  benchmarkComparisonPct: number; // +12% better than regional avg
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
}

export interface WhatIfParams {
  solarKw: number; // e.g. 0 to 500 kW
  treeCount: number; // e.g. 0 to 2000 trees
  ledRetrofitPct: number; // 0 to 100%
  rainwaterHarvestingLiters: number; // e.g. 0 to 100,000 L
  smartIrrigationEnabled: boolean;
  highEfficiencyAcCount: number;
}

export interface WhatIfResult {
  totalCapexInr: number;
  annualSavingsInr: number;
  roiYears: number;
  carbonReductionKg: number;
  newSustainabilityScore: number;
  scoreImprovementPoints: number;
  paybackTimeline: { year: number; cumulativeSavingsInr: number; netCashFlowInr: number }[];
}

export interface WeatherData {
  tempC: number;
  condition: string;
  humidityPct: number;
  windSpeedKmh: number;
  solarRadiationWm2: number;
  aqi: number;
}

export interface ModelMetrics {
  name: string;
  algorithm: string;
  target: string;
  mae: number;
  rmse: number;
  r2Score: number;
  lastTrained: string;
  status: 'active' | 'training' | 'idle';
  totalDatasetRows: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structuredResponse?: {
    problem?: string;
    reason?: string;
    impact?: string;
    recommendation?: string;
    confidenceScore?: number;
  };
  dataHighlights?: { label: string; value: string }[];
  actionableSuggestions?: string[];
  reasoningChain?: string[];
}

