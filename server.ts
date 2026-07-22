import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  SAMPLE_BUILDINGS,
  SAMPLE_ANOMALIES,
  SAMPLE_RECOMMENDATIONS,
  SAMPLE_MODEL_METRICS,
  CURRENT_WEATHER,
  SAMPLE_DATA_HEALTH_REPORT,
  SAMPLE_ENVIRONMENTAL_NODES,
  SAMPLE_PREDICTED_ANOMALIES,
  SAMPLE_MULTI_HORIZON_FORECASTS,
  SAMPLE_PREDICTIVE_MAINTENANCE,
  SAMPLE_BENCHMARK_DATA,
  generate365DaysData,
} from './src/data/mockData.js';
import {
  calculateSustainabilityScores,
  predictTomorrowUsage,
  runWhatIfSimulation,
  processCopilotQuery,
} from './src/utils/aiEngine.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazily if key available
  let genAI: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Gemini client init warning:', err);
    }
  }

  // Memory store for dynamic modifications
  let buildings = [...SAMPLE_BUILDINGS];
  let anomalies = [...SAMPLE_ANOMALIES];
  let recommendations = [...SAMPLE_RECOMMENDATIONS];
  let modelMetrics = [...SAMPLE_MODEL_METRICS];
  let dataHealthReport = { ...SAMPLE_DATA_HEALTH_REPORT };
  let predictiveMaintenanceList = [...SAMPLE_PREDICTIVE_MAINTENANCE];
  const telemetryData = generate365DaysData();

  // ---------------- REST API ROUTES ----------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      system: 'Green Campus Digital Twin Command Center',
      activeSensors: 1420,
      sensorHealthPct: 99.4,
      latencyMs: 14,
      timestamp: new Date().toISOString(),
    });
  });

  // Data Health & Fusion Endpoint (Req #1)
  app.get('/api/data-health', (req, res) => {
    res.json(dataHealthReport);
  });

  // Environmental Engine Nodes (Req #2)
  app.get('/api/environmental-engine', (req, res) => {
    res.json(SAMPLE_ENVIRONMENTAL_NODES);
  });

  // Predicted Anomalies (Req #4)
  app.get('/api/predicted-anomalies', (req, res) => {
    res.json(SAMPLE_PREDICTED_ANOMALIES);
  });

  // Multi-Horizon Forecasts (Req #5)
  app.get('/api/forecasts', (req, res) => {
    res.json(SAMPLE_MULTI_HORIZON_FORECASTS);
  });

  // Predictive Maintenance Equipment (Req #6)
  app.get('/api/predictive-maintenance', (req, res) => {
    res.json(predictiveMaintenanceList);
  });

  // Institutional Benchmarks (Req #7)
  app.get('/api/benchmarks', (req, res) => {
    const currentScores = calculateSustainabilityScores(buildings, telemetryData);
    res.json({
      ...SAMPLE_BENCHMARK_DATA,
      campusScore: currentScores.overall,
    });
  });

  // AI Copilot Endpoint (Req #8)
  app.post('/api/copilot', async (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message parameter is required' });
    }

    const currentScores = calculateSustainabilityScores(buildings, telemetryData);

    // Try Gemini server-side if key is present
    if (genAI && process.env.GEMINI_API_KEY) {
      try {
        const response = await genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are Greenie AI, the intelligent campus sustainability assistant for Green Campus Digital Twin.
Campus Context:
- Overall Sustainability Score: ${currentScores.overall}/100 (Grade ${currentScores.grade})
- Total Buildings: ${buildings.length}
- Total IoT Sensors: 1,420
- Key Active Alert: Mechanical Block Chiller #2 surge (2,150 kWh vs baseline 880 kWh)
- Water Leak Alert: Student Hostel Complex Wing C (780 L/hr leak during quiet period)
- Solar Peak Output: 740 kW

User Query: "${message}"

Respond with a helpful, friendly greeting as Greenie AI 🌿, followed by a data-backed breakdown.`,
        });

        const text = response.text || '';
        if (text) {
          const fallback = processCopilotQuery(message, buildings, currentScores);
          return res.json({
            reply: text,
            dataHighlights: fallback.dataHighlights,
            actionableSuggestions: fallback.actionableSuggestions,
            reasoningChain: fallback.reasoningChain,
          });
        }
      } catch (err) {
        console.error('Gemini API call error, falling back to local reasoning engine:', err);
      }
    }

    // Local data-driven fallback engine
    const localResult = processCopilotQuery(message, buildings, currentScores);
    res.json(localResult);
  });

  // Buildings list
  app.get('/api/buildings', (req, res) => {
    res.json(buildings);
  });

  // Specific building details & history
  app.get('/api/buildings/:id', (req, res) => {
    const building = buildings.find((b) => b.id === req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }
    const bldgHistory = telemetryData.filter((t) => t.buildingId === building.id);
    const bldgAnomalies = anomalies.filter((a) => a.buildingId === building.id);
    const bldgRecommendations = recommendations.filter((r) => r.buildingId === building.id);

    res.json({
      building,
      telemetryHistory: bldgHistory,
      anomalies: bldgAnomalies,
      recommendations: bldgRecommendations,
    });
  });

  // Update building telemetry/threshold
  app.patch('/api/buildings/:id', (req, res) => {
    const index = buildings.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Building not found' });
    }
    buildings[index] = { ...buildings[index], ...req.body };
    res.json(buildings[index]);
  });

  // 365 Days Telemetry
  app.get('/api/telemetry/365', (req, res) => {
    res.json(telemetryData);
  });

  // AI Predictions
  app.get('/api/predictions', (req, res) => {
    const prediction = predictTomorrowUsage(buildings, telemetryData);
    res.json(prediction);
  });

  // Anomalies List
  app.get('/api/anomalies', (req, res) => {
    res.json(anomalies);
  });

  // Resolve Anomaly
  app.post('/api/anomalies/:id/resolve', (req, res) => {
    const anomaly = anomalies.find((a) => a.id === req.params.id);
    if (!anomaly) {
      return res.status(404).json({ error: 'Anomaly not found' });
    }
    anomaly.status = 'resolved';
    res.json({ success: true, anomaly });
  });

  // AI Recommendations List
  app.get('/api/recommendations', (req, res) => {
    res.json(recommendations);
  });

  // Apply Recommendation
  app.post('/api/recommendations/:id/apply', (req, res) => {
    const rec = recommendations.find((r) => r.id === req.params.id);
    if (!rec) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }
    rec.applied = true;
    res.json({ success: true, recommendation: rec });
  });

  // Sustainability Scores
  app.get('/api/scores', (req, res) => {
    const scores = calculateSustainabilityScores(buildings, telemetryData);
    res.json(scores);
  });

  // What-If Simulator
  app.post('/api/what-if', (req, res) => {
    const currentScores = calculateSustainabilityScores(buildings, telemetryData);
    const result = runWhatIfSimulation(req.body, currentScores);
    res.json(result);
  });

  // Weather Endpoint
  app.get('/api/weather', (req, res) => {
    res.json(CURRENT_WEATHER);
  });

  // AI Models Metrics & Retraining
  app.get('/api/models', (req, res) => {
    res.json(modelMetrics);
  });

  app.post('/api/models/retrain', (req, res) => {
    const { modelName } = req.body;
    modelMetrics = modelMetrics.map((m) => {
      if (!modelName || m.name === modelName) {
        return {
          ...m,
          r2Score: Math.min(0.992, Number((m.r2Score + 0.005).toFixed(3))),
          mae: Number((m.mae * 0.95).toFixed(2)),
          lastTrained: new Date().toISOString().replace('T', ' ').slice(0, 19),
          totalDatasetRows: m.totalDatasetRows + 365,
        };
      }
      return m;
    });
    res.json({ success: true, modelMetrics });
  });

  // ---------------- VITE MIDDLEWARE / PRODUCTION STATIC ----------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Green Campus Digital Twin server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
