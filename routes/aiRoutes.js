const express = require("express");
const router = express.Router();

// This will be injected when mounting the router
let aiMonitor = null;

function setAIMonitor(monitor) {
  aiMonitor = monitor;
}

// Middleware to check if AI monitor is initialized
function checkAIMonitor(req, res, next) {
  if (!aiMonitor) {
    return res.status(503).json({
      error: "AI Monitor not initialized",
      message: "Please check your OPENROUTER_API_KEY configuration",
    });
  }
  next();
}

// Get AI Monitor status
router.get("/status", checkAIMonitor, (req, res) => {
  try {
    const status = aiMonitor.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze logs on-demand
router.get("/logs/analyze", checkAIMonitor, async (req, res) => {
  try {
    const lookbackMinutes = parseInt(req.query.lookback) || 15;
    const { logAnalyzer } = aiMonitor.getAnalyzers();

    const analysis = await logAnalyzer.analyzeLogs(lookbackMinutes);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get detected anomalies
router.get("/logs/anomalies", checkAIMonitor, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { logAnalyzer } = aiMonitor.getAnalyzers();

    const anomalies = logAnalyzer.getAnomalies(limit);
    res.json({
      anomalies,
      count: anomalies.length,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get log summary
router.get("/logs/summary", checkAIMonitor, (req, res) => {
  try {
    const { logAnalyzer } = aiMonitor.getAnalyzers();
    const lastAnalysis = logAnalyzer.getLastAnalysis();

    if (!lastAnalysis) {
      return res.json({
        message: "No analysis available yet. Trigger analysis first.",
        endpoint: "/ai/logs/analyze",
      });
    }

    res.json({
      summary: lastAnalysis.summary,
      severity: lastAnalysis.severity,
      timestamp: lastAnalysis.timestamp,
      logCount: lastAnalysis.logCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze performance on-demand
router.get("/performance/analyze", checkAIMonitor, async (req, res) => {
  try {
    const { performanceAnalyzer } = aiMonitor.getAnalyzers();
    const analysis = await performanceAnalyzer.analyzePerformance();
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get performance recommendations
router.get("/performance/recommendations", checkAIMonitor, (req, res) => {
  try {
    const { performanceAnalyzer } = aiMonitor.getAnalyzers();
    const lastAnalysis = performanceAnalyzer.getLastAnalysis();

    if (!lastAnalysis) {
      return res.json({
        message: "No analysis available yet. Trigger analysis first.",
        endpoint: "/ai/performance/analyze",
      });
    }

    res.json({
      recommendations: lastAnalysis.recommendations,
      performanceScore: lastAnalysis.performanceScore,
      timestamp: lastAnalysis.timestamp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Identify bottlenecks
router.get("/performance/bottlenecks", checkAIMonitor, async (req, res) => {
  try {
    const { performanceAnalyzer } = aiMonitor.getAnalyzers();
    const bottlenecks = await performanceAnalyzer.identifyBottlenecks();
    res.json(bottlenecks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get performance forecast
router.get("/performance/forecast", checkAIMonitor, async (req, res) => {
  try {
    const { performanceAnalyzer } = aiMonitor.getAnalyzers();
    const forecast = await performanceAnalyzer.getForecast();
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get performance history
router.get("/performance/history", checkAIMonitor, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const { performanceAnalyzer } = aiMonitor.getAnalyzers();
    const history = performanceAnalyzer.getPerformanceHistory(limit);

    res.json({
      history,
      count: history.length,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger manual analysis (both logs and performance)
router.post("/analyze", checkAIMonitor, async (req, res) => {
  try {
    const result = await aiMonitor.runAnalysis();
    res.json({
      message: "Analysis completed",
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, setAIMonitor };
