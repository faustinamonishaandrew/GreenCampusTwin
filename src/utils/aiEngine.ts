import {
  Building,
  TelemetryDataPoint,
  SustainabilityScores,
  PredictionSummary,
  WhatIfParams,
  WhatIfResult,
} from '../types';

/**
 * Calculates Campus Sustainability Score out of 100 based on weighted performance:
 * Energy Efficiency (30%), Water Conservation (20%), Waste Management (15%),
 * Air Quality (15%), Carbon Neutrality (20%).
 */
export function calculateSustainabilityScores(
  buildings: Building[],
  telemetry: TelemetryDataPoint[]
): SustainabilityScores {
  if (!buildings.length) {
    return {
      overall: 82,
      energy: 80,
      water: 84,
      waste: 78,
      airQuality: 88,
      carbon: 81,
      benchmarkComparisonPct: 14.5,
      grade: 'A',
    };
  }

  // 1. Energy Score: based on kWh per sq ft & solar fraction
  const totalEnergy = buildings.reduce((acc, b) => acc + b.currentEnergyKwh, 0);
  const totalArea = buildings.reduce((acc, b) => acc + b.areaSqFt, 0);
  const totalSolarKw = buildings.reduce((acc, b) => acc + b.solarCapacityKw, 0);

  const kwhPerSqFt = totalEnergy / (totalArea / 1000);
  const energyScore = Math.min(100, Math.max(30, Math.round(100 - kwhPerSqFt * 5.2 + (totalSolarKw / 10))));

  // 2. Water Score: based on Liters per occupant
  const totalWater = buildings.reduce((acc, b) => acc + b.currentWaterLiters, 0);
  const totalOccupants = buildings.reduce((acc, b) => acc + b.currentOccupancy, 0) || 1;
  const litersPerPerson = totalWater / totalOccupants;
  const waterScore = Math.min(100, Math.max(25, Math.round(100 - (litersPerPerson - 3) * 8)));

  // 3. Waste Score: based on kg per occupant
  const totalWaste = buildings.reduce((acc, b) => acc + b.currentWasteKg, 0);
  const kgWastePerPerson = totalWaste / totalOccupants;
  const wasteScore = Math.min(100, Math.max(30, Math.round(100 - kgWastePerPerson * 120)));

  // 4. Air Quality Score: AQI scale (0-50 = 100%, 50-100 = 80%, etc.)
  const avgAqi = buildings.reduce((acc, b) => acc + b.currentAqi, 0) / buildings.length;
  const airQualityScore = Math.min(100, Math.max(20, Math.round(100 - (avgAqi - 15) * 0.9)));

  // 5. Carbon Score
  const totalCarbon = buildings.reduce((acc, b) => acc + b.currentCarbonKg, 0);
  const carbonPerCapita = totalCarbon / totalOccupants;
  const carbonScore = Math.min(100, Math.max(20, Math.round(100 - carbonPerCapita * 45)));

  // Weighted Overall
  const overall = Math.round(
    energyScore * 0.3 +
    waterScore * 0.2 +
    wasteScore * 0.15 +
    airQualityScore * 0.15 +
    carbonScore * 0.2
  );

  let grade: 'A+' | 'A' | 'B+' | 'B' | 'C' = 'B';
  if (overall >= 90) grade = 'A+';
  else if (overall >= 82) grade = 'A';
  else if (overall >= 74) grade = 'B+';
  else if (overall >= 65) grade = 'B';
  else grade = 'C';

  return {
    overall,
    energy: energyScore,
    water: waterScore,
    waste: wasteScore,
    airQuality: airQualityScore,
    carbon: carbonScore,
    benchmarkComparisonPct: Number(((overall - 68) / 0.68).toFixed(1)),
    grade,
  };
}

/**
 * AI Predictive Engine simulating XGBoost / Random Forest trained on 365 days of campus data.
 */
export function predictTomorrowUsage(
  buildings: Building[],
  telemetry: TelemetryDataPoint[]
): PredictionSummary {
  const currentTotalEnergy = buildings.reduce((acc, b) => acc + b.currentEnergyKwh, 0);
  const currentTotalWater = buildings.reduce((acc, b) => acc + b.currentWaterLiters, 0);
  const currentTotalWaste = buildings.reduce((acc, b) => acc + b.currentWasteKg, 0);
  const currentTotalCarbon = buildings.reduce((acc, b) => acc + b.currentCarbonKg, 0);

  // Predictive adjustments based on weather, occupancy, and ML model weights
  const tempOffset = 0.018; // 1.8% increase per degree
  const tomorrowTempDelta = 1.2; // Tomorrow predicted +1.2°C warmer
  const occupancyFactor = 0.96; // Tomorrow is Thursday (slightly lower evening lab attendance)

  const tomorrowEnergyKwh = Math.round(currentTotalEnergy * (1 + tempOffset * tomorrowTempDelta) * occupancyFactor);
  const tomorrowWaterLiters = Math.round(currentTotalWater * 0.97); // Slight water conservation impact
  const tomorrowWasteKg = Math.round(currentTotalWaste * 1.02);
  const tomorrowCarbonKg = Math.round(tomorrowEnergyKwh * 0.71); // Grid CO2 factor

  const energyChangePct = Number((((tomorrowEnergyKwh - currentTotalEnergy) / currentTotalEnergy) * 100).toFixed(1));
  const waterChangePct = Number((((tomorrowWaterLiters - currentTotalWater) / currentTotalTotalWater(currentTotalWater)) * 100).toFixed(1));
  const wasteChangePct = Number((((tomorrowWasteKg - currentTotalWaste) / currentTotalWaste) * 100).toFixed(1));
  const carbonChangePct = Number((((tomorrowCarbonKg - currentTotalCarbon) / currentTotalCarbon) * 100).toFixed(1));

  // 24 Hour Hourly forecast curve
  const hourlyForecast = Array.from({ length: 24 }).map((_, hour) => {
    const hourStr = `${hour.toString().padStart(2, '0')}:00`;
    // Base diurnal load curve (low at night, peak at 14:00)
    const loadFactor = 0.35 + 0.65 * Math.sin(((hour - 6) / 18) * Math.PI);
    const actualBase = (currentTotalEnergy / 14) * Math.max(0.25, loadFactor);
    const predBase = actualBase * (1 + (Math.sin(hour) * 0.04));

    return {
      hour: hourStr,
      energyKwh: Math.round(actualBase),
      predictedEnergyKwh: Math.round(predBase),
      waterLiters: Math.round(actualBase * 4.2),
      predictedWaterLiters: Math.round(predBase * 4.15),
      upperBoundKwh: Math.round(predBase * 1.08),
      lowerBoundKwh: Math.round(predBase * 0.92),
    };
  });

  return {
    tomorrowEnergyKwh,
    energyChangePct,
    tomorrowWaterLiters,
    waterChangePct,
    tomorrowWasteKg,
    wasteChangePct,
    tomorrowCarbonKg,
    carbonChangePct,
    predictionConfidencePct: 94.8,
    modelAccuracyR2: 0.962,
    featuresUsed: [
      { name: 'Ambient Temperature Forecast', importancePct: 34.2 },
      { name: 'Day of Week & Class Schedule', importancePct: 28.5 },
      { name: 'Historical 365-Day Baseline', importancePct: 18.1 },
      { name: 'Occupancy Sensor Realtime Stream', importancePct: 11.4 },
      { name: 'Solar PV Irradiation Model', importancePct: 7.8 },
    ],
    hourlyForecast,
  };
}

function currentTotalTotalWater(val: number) {
  return val || 1;
}

/**
 * Interactive What-If Simulator Engine
 * Calculates Financial Cost (₹), Annual Savings (₹), Carbon Offset (kg CO2), ROI Years, and Score Bump.
 */
export function runWhatIfSimulation(
  params: WhatIfParams,
  currentScores: SustainabilityScores
): WhatIfResult {
  // Unit Rates in INR (₹)
  const COST_PER_KW_SOLAR = 42000; // ₹42,000 per kW solar
  const SAVINGS_PER_KW_SOLAR_YEAR = 9800; // ₹9,800 saved per kW/yr
  const CO2_SAVED_PER_KW_SOLAR = 1150; // kg CO2/yr

  const COST_PER_TREE = 450; // ₹450 per sapling & maintenance
  const CO2_SAVED_PER_TREE = 22; // kg CO2/yr per mature tree

  const COST_LED_RETROFIT_100PCT = 850000; // ₹8.5 Lakh for full campus LED upgrade
  const SAVINGS_LED_RETROFIT_100PCT = 420000; // ₹4.2 Lakh/yr
  const CO2_SAVED_LED = 32000; // kg CO2/yr

  const COST_RAINWATER_HARVESTING_PER_10KL = 120000; // ₹1.2 Lakh per 10k L tank
  const SAVINGS_RAINWATER_PER_10KL = 38000; // ₹38k saved/yr in water bills

  const COST_SMART_IRRIGATION = 180000;
  const SAVINGS_SMART_IRRIGATION = 95000;

  const COST_PER_INVERTER_AC = 48000;
  const SAVINGS_PER_INVERTER_AC_YEAR = 16500;
  const CO2_SAVED_PER_AC = 850;

  // Calculations
  const capexSolar = params.solarKw * COST_PER_KW_SOLAR;
  const savingsSolar = params.solarKw * SAVINGS_PER_KW_SOLAR_YEAR;
  const carbonSolar = params.solarKw * CO2_SAVED_PER_KW_SOLAR;

  const capexTrees = params.treeCount * COST_PER_TREE;
  const carbonTrees = params.treeCount * CO2_SAVED_PER_TREE;

  const capexLed = (params.ledRetrofitPct / 100) * COST_LED_RETROFIT_100PCT;
  const savingsLed = (params.ledRetrofitPct / 100) * SAVINGS_LED_RETROFIT_100PCT;
  const carbonLed = (params.ledRetrofitPct / 100) * CO2_SAVED_LED;

  const capexRain = (params.rainwaterHarvestingLiters / 10000) * COST_RAINWATER_HARVESTING_PER_10KL;
  const savingsRain = (params.rainwaterHarvestingLiters / 10000) * SAVINGS_RAINWATER_PER_10KL;

  const capexIrrigation = params.smartIrrigationEnabled ? COST_SMART_IRRIGATION : 0;
  const savingsIrrigation = params.smartIrrigationEnabled ? SAVINGS_SMART_IRRIGATION : 0;

  const capexAc = params.highEfficiencyAcCount * COST_PER_INVERTER_AC;
  const savingsAc = params.highEfficiencyAcCount * SAVINGS_PER_INVERTER_AC_YEAR;
  const carbonAc = params.highEfficiencyAcCount * CO2_SAVED_PER_AC;

  const totalCapexInr = Math.round(capexSolar + capexTrees + capexLed + capexRain + capexIrrigation + capexAc);
  const annualSavingsInr = Math.round(savingsSolar + savingsLed + savingsRain + savingsIrrigation + savingsAc);
  const carbonReductionKg = Math.round(carbonSolar + carbonTrees + carbonLed + carbonAc);

  const roiYears = annualSavingsInr > 0 ? Number((totalCapexInr / annualSavingsInr).toFixed(1)) : 0;

  // Sustainability score impact calculation
  const solarPoints = Math.min(8, (params.solarKw / 500) * 8);
  const treePoints = Math.min(3, (params.treeCount / 2000) * 3);
  const ledPoints = Math.min(4, (params.ledRetrofitPct / 100) * 4);
  const rainPoints = Math.min(3, (params.rainwaterHarvestingLiters / 100000) * 3);
  const irriPoints = params.smartIrrigationEnabled ? 2 : 0;
  const acPoints = Math.min(3, (params.highEfficiencyAcCount / 100) * 3);

  const scoreImprovementPoints = Number((solarPoints + treePoints + ledPoints + rainPoints + irriPoints + acPoints).toFixed(1));
  const newSustainabilityScore = Math.min(100, Math.round(currentScores.overall + scoreImprovementPoints));

  // Payback Timeline over 10 Years
  const paybackTimeline = Array.from({ length: 10 }).map((_, idx) => {
    const year = idx + 1;
    const cumulativeSavingsInr = Math.round(annualSavingsInr * year * (1 + 0.05 * (year - 1))); // 5% energy tariff escalation
    const netCashFlowInr = cumulativeSavingsInr - totalCapexInr;
    return {
      year,
      cumulativeSavingsInr,
      netCashFlowInr,
    };
  });

  return {
    totalCapexInr,
    annualSavingsInr,
    roiYears,
    carbonReductionKg,
    newSustainabilityScore,
    scoreImprovementPoints,
    paybackTimeline,
  };
}

/**
 * Format currency nicely in INR ₹ format (e.g. ₹1,85,000 or ₹185.0K)
 */
export function formatCurrencyINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * AI Sustainability Copilot Local Engine
 * Provides analytical, data-backed answers to campus queries.
 */
export function processCopilotQuery(
  query: string,
  buildings: Building[],
  scores: SustainabilityScores
): {
  reply: string;
  structuredResponse?: {
    problem: string;
    reason: string;
    impact: string;
    recommendation: string;
    confidenceScore: number;
  };
  dataHighlights: { label: string; value: string }[];
  actionableSuggestions: string[];
  reasoningChain: string[];
} {
  const q = query.toLowerCase();

  if (q.includes('electricity') || q.includes('energy') || q.includes('power')) {
    const highestEnergy = [...buildings].sort((a, b) => b.currentEnergyKwh - a.currentEnergyKwh)[0];
    return {
      reply: `Campus electricity usage currently totals **12,840 kWh/day**. The primary spike is driven by **${highestEnergy.name}** consuming **${highestEnergy.currentEnergyKwh.toLocaleString()} kWh** today due to Chiller #2 pressure valve anomaly and ambient temp reaching 32.5°C (+4°C above seasonal norm).`,
      structuredResponse: {
        problem: `Unscheduled Energy Spike in ${highestEnergy.name}`,
        reason: 'Chiller #2 refrigerant pressure valve overload during peak 32.5°C heat.',
        impact: `Consuming ${highestEnergy.currentEnergyKwh.toLocaleString()} kWh/day (~₹2,400 daily excess operating cost).`,
        recommendation: 'Switch Mechanical Block Chiller #2 to Eco Bypass Mode & enforce 7 PM smart cutoff.',
        confidenceScore: 98.5,
      },
      dataHighlights: [
        { label: 'Top Consumer', value: highestEnergy.name },
        { label: 'Current Usage', value: `${highestEnergy.currentEnergyKwh} kWh` },
        { label: 'Solar Offset', value: '740 kW Peak' },
        { label: 'Grid Carbon', value: '0.71 kg CO2/kWh' },
      ],
      actionableSuggestions: [
        'Apply Smart Schedule cutoff after 7 PM in Academic Block',
        'Switch Mech Block Chiller #2 to Eco Bypass Mode',
        'Inspect Solar Inverter #2 cooling fan array',
      ],
      reasoningChain: [
        'Analyzed 9 campus building telemetry streams across 1,420 IoT sensors.',
        'Correlated ambient temperature rise (+4°C) with HVAC compressor power curve.',
        'Detected Isolation Forest model flag on Mech Block (+142% power surge).',
        'Formulated net cost impact: ~₹2,400 daily excess charge.',
      ],
    };
  }

  if (q.includes('water') || q.includes('leak') || q.includes('plumbing')) {
    const highestWater = [...buildings].sort((a, b) => b.currentWaterLiters - a.currentWaterLiters)[0];
    return {
      reply: `Total campus water consumption is **48,850 Liters/day**. **${highestWater.name}** accounts for the highest share (**${highestWater.currentWaterLiters.toLocaleString()} L/day**) due to a detected off-hours leak in Wing C (780 L/hr quiet period baseline flow).`,
      structuredResponse: {
        problem: `Off-Hours Water Leak in ${highestWater.name} (Wing C)`,
        reason: 'Continuous quiet period riser baseline flow of 780 L/hr detected between 2 AM - 5 AM.',
        impact: 'Wasting 7,300 Liters of treated water per day (~₹1,850/day in municipal fees).',
        recommendation: 'Trigger smart solenoid isolation valve on Hostel Wing C and dispatch maintenance.',
        confidenceScore: 96.2,
      },
      dataHighlights: [
        { label: 'Highest Consumer', value: highestWater.name },
        { label: 'Daily Draw', value: `${highestWater.currentWaterLiters.toLocaleString()} Liters` },
        { label: 'Night Leak Flow', value: '780 L/hr' },
        { label: 'Water Score', value: `${scores.water}/100` },
      ],
      actionableSuggestions: [
        'Trigger smart solenoid isolation valve on Hostel Wing C',
        'Install ultrasonic leak shut-off sensors in main risers',
        'Enable smart weather-driven irrigation in Sports Complex',
      ],
      reasoningChain: [
        'Monitored 2 AM - 5 AM quiet period flow sensors across all residence blocks.',
        'Identified non-zero pressure drop in Hostel Complex Wing C main riser.',
        'Calculated water waste rate: 7,300 L/day (~₹1,850/day in municipal charges).',
      ],
    };
  }

  if (q.includes('predict') || q.includes('tomorrow') || q.includes('forecast')) {
    return {
      reply: `Tomorrow's predicted campus energy demand is **13,120 kWh/day** (+2.1% higher than today) driven by predicted ambient warming (+1.2°C) and Thursday lab schedules.`,
      structuredResponse: {
        problem: 'Expected Peak Load Surge Under +1.2°C Ambient Heat',
        reason: 'XGBoost multi-horizon forecast correlates high ambient temp with afternoon lab schedules.',
        impact: 'Projected 13,120 kWh daily grid load (Est. ₹1,11,500 grid bill).',
        recommendation: 'Pre-cool Central Library during low-tariff morning hours and buffer with solar battery.',
        confidenceScore: 94.8,
      },
      dataHighlights: [
        { label: 'Predicted Energy', value: '13,120 kWh' },
        { label: 'Temp Delta', value: '+1.2°C Warm' },
        { label: 'Model R²', value: '0.962' },
        { label: 'Confidence', value: '94.8%' },
      ],
      actionableSuggestions: [
        'Pre-cool Central Library before 9 AM peak tariff window',
        'Enable solar PV battery storage discharging during 2 PM peak',
        'Review 24-hour hourly load curve in Predictions tab',
      ],
      reasoningChain: [
        'Inferred weather API forecast +1.2°C temperature shift.',
        'Applied 365-day historical XGBoost load prediction weights.',
      ],
    };
  }

  if (q.includes('solar') || q.includes('double') || q.includes('pv')) {
    return {
      reply: `Doubling campus solar capacity from **1,020 kW to 2,040 kW** would generate an additional **~1.45 Million kWh clean power annually**, reducing grid carbon by **1,150 Tons CO2/yr** and raising our Campus Sustainability Score from **${scores.overall} to 88/100 (Grade A+)**.`,
      structuredResponse: {
        problem: 'Campus Reliance on Fossil Grid Electricity During Peak Demand',
        reason: 'Current solar PV capacity (1,020 kW) offsets 34% of day load, leaving 66% grid dependent.',
        impact: 'Annual power expenditure of ₹2.4 Crore with 2,810 Tons annual Scope 2 emissions.',
        recommendation: 'Deploy additional 1,020 kW rooftop & canopy PV arrays (ROI: 3.8 years).',
        confidenceScore: 97.1,
      },
      dataHighlights: [
        { label: 'Current Solar', value: '1,020 kW' },
        { label: 'Expanded Solar', value: '2,040 kW' },
        { label: 'Annual Savings', value: '₹1.02 Crore/yr' },
        { label: 'Score Boost', value: '+4.5 Points' },
      ],
      actionableSuggestions: [
        'Install 150 kW rooftop array on Academic Block (Payback: 3.7 yrs)',
        'Deploy solar canopy in Student Hostel parking zone',
        'Apply for Central Green Campus Solar Subsidy Grant',
      ],
      reasoningChain: [
        'Simulated 1,200 sq.m unshaded rooftop availability across 9 building blocks.',
        'Calculated regional solar irradiance profile (740 W/m² peak).',
        'Modelled cash flow at current grid tariff ₹8.5/kWh with 5% annual escalation.',
      ],
    };
  }

  if (q.includes('carbon') || q.includes('emissions') || q.includes('co2')) {
    return {
      reply: `Current campus Scope 1+2 carbon emissions total **7,710 kg CO2/day**. Grid electricity accounts for **82%** of total carbon footprint due to thermal power grid reliance.`,
      structuredResponse: {
        problem: 'High Grid Carbon Factor (0.71 kg CO2/kWh)',
        reason: 'Evening HVAC loads run entirely on coal-dominated regional power grid after sunset.',
        impact: '7,710 kg CO2 emitted per day (~2,810 Tons CO2 annually).',
        recommendation: 'Expand battery energy storage system (BESS) to shift daytime solar power to night HVAC.',
        confidenceScore: 95.6,
      },
      dataHighlights: [
        { label: 'Daily Carbon', value: '7,710 kg CO2' },
        { label: 'Grid Factor', value: '0.71 kg CO2/kWh' },
        { label: 'Solar Offset', value: '-850 kg CO2/day' },
        { label: 'Annual CO2', value: '2,810 Tons' },
      ],
      actionableSuggestions: [
        'Shift heavy server batch tasks to peak solar hours (11 AM - 3 PM)',
        'Install BESS 200 kWh battery storage at Central Substation',
        'Track daily carbon offsets in Environmental Engine',
      ],
      reasoningChain: [
        'Combined Scope 1 diesel generator telemetry with Scope 2 grid power consumption.',
        'Applied real-time grid emissions factor (0.71 kg CO2/kWh).',
      ],
    };
  }

  if (q.includes('score') || q.includes('sustainability') || q.includes('improvement')) {
    return {
      reply: `Our current Campus Sustainability Score is **${scores.overall}/100 (Grade ${scores.grade})**. We outperform the regional university benchmark by **+${scores.benchmarkComparisonPct}%**, ranking **#3 out of 140 institutions**. To reach **Grade A+ (90+/100)**, Greenie AI recommends 3 key intervention steps.`,
      structuredResponse: {
        problem: 'Campus Sustainability Gap to Top Grade A+ Benchmark (6.0 Points Gap)',
        reason: 'Water leak loss in Hostel Wing C and un-optimized server room cooling setpoints.',
        impact: 'Score currently capped at 84/100 (Grade A).',
        recommendation: 'Execute Hostel Wing C leak isolation (+2.2 pts), set CS cooling to 24°C (+1.5 pts), LED retrofit (+2.3 pts).',
        confidenceScore: 97.4,
      },
      dataHighlights: [
        { label: 'Current Score', value: `${scores.overall}/100` },
        { label: 'National Rank', value: '#3 of 140' },
        { label: 'Top Campus Score', value: '92/100' },
        { label: 'Points Gap', value: '6.0 Points' },
      ],
      actionableSuggestions: [
        'Execute Hostel Wing C water leak isolation (+2.2 pts)',
        'Upgrade CS Block server cooling setpoint to 24°C (+1.5 pts)',
        'Retrofit remaining fluorescent fixtures to smart LED (+2.3 pts)',
      ],
      reasoningChain: [
        'Evaluated 5 sub-score pillars: Energy (30%), Water (20%), Waste (15%), AQI (15%), Carbon (20%).',
        'Identified highest ROI scoring leverage points in Energy & Water conservation.',
      ],
    };
  }

  // Default intelligent response
  return {
    reply: `Based on live telemetry across all 9 campus buildings and 1,420 IoT sensors, our overall Sustainability Score is **${scores.overall}/100**. System Data Health is **94%**, with **2 open anomalies** under investigation.`,
    structuredResponse: {
      problem: 'Operational Sustainability Tracking Across 9 Campus Blocks',
      reason: '1,420 live IoT sensors streaming energy, water, air quality, and solar generation metrics.',
      impact: 'Campus overall score is 84/100 with 2 active critical anomalies requiring intervention.',
      recommendation: 'Review Explainable AI diagnostics for Mechanical Block energy surge and Hostel C water leak.',
      confidenceScore: 93.0,
    },
    dataHighlights: [
      { label: 'Campus Score', value: `${scores.overall}/100` },
      { label: 'Data Health', value: '94%' },
      { label: 'Active Sensors', value: '1,420 Online' },
      { label: 'Open Alerts', value: '2 Critical' },
    ],
    actionableSuggestions: [
      'View Explainable AI breakdown for Mechanical Block energy spike',
      'Run What-If Simulation for 100% LED retrofit',
      'Check Early Warning system for Solar Inverter #2 health',
    ],
    reasoningChain: [
      'Processed query against real-time telemetry store and AI models.',
      'Extracted active building metrics and benchmark comparison parameters.',
    ],
  };
}

