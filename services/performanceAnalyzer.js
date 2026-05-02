const { analyzeWithAI } = require("../config/openrouter");

class PerformanceAnalyzer {
  constructor(dataCollector) {
    this.dataCollector = dataCollector;
    this.lastAnalysis = null;
    this.performanceHistory = [];
  }

  // Analyze performance metrics
  async analyzePerformance() {
    const metrics = await this.dataCollector.getStructuredMetrics();

    if (
      !metrics.requestDuration.length &&
      !metrics.requestCount.length &&
      Object.keys(metrics.systemMetrics).length === 0
    ) {
      return {
        status: "no_data",
        message: "No metrics available for analysis",
        timestamp: new Date(),
      };
    }

    const metricsSummary = this.prepareMetricsSummary(metrics);

    const systemInstruction = `You are an expert performance analyst for Node.js applications.
Analyze the provided metrics and provide:
1. Performance bottlenecks identification
2. Response time analysis by endpoint
3. Resource utilization assessment
4. Optimization recommendations
5. Scaling suggestions if needed

Provide analysis in JSON format with these keys:
- summary: Brief performance overview
- bottlenecks: Array of identified bottlenecks with details
- recommendations: Array of specific optimization suggestions
- resourceUtilization: Assessment of current resource usage
- scalingAdvice: Suggestions for scaling (if needed)
- performanceScore: Number from 0-100 indicating overall performance health`;

    try {
      const prompt = `Analyze these application performance metrics:\n\n${metricsSummary}`;
      const aiResponse = await analyzeWithAI(prompt, systemInstruction);

      let analysis;
      try {
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
        const jsonText = jsonMatch ? jsonMatch[1] : aiResponse;
        analysis = JSON.parse(jsonText);
      } catch (e) {
        analysis = {
          summary: aiResponse,
          bottlenecks: [],
          recommendations: [],
          resourceUtilization: "Unknown",
          scalingAdvice: "Unable to determine",
          performanceScore: 50,
        };
      }

      this.lastAnalysis = {
        ...analysis,
        timestamp: new Date(),
        metricsSnapshot: metrics,
      };

      // Store in history
      this.performanceHistory.push({
        timestamp: new Date(),
        score: analysis.performanceScore || 50,
        bottlenecks: analysis.bottlenecks?.length || 0,
      });

      // Keep only last 100 records
      if (this.performanceHistory.length > 100) {
        this.performanceHistory = this.performanceHistory.slice(-100);
      }

      return this.lastAnalysis;
    } catch (error) {
      console.error("Performance analysis error:", error.message);
      return {
        status: "error",
        message: error.message,
        timestamp: new Date(),
      };
    }
  }

  // Prepare metrics summary for AI
  prepareMetricsSummary(metrics) {
    let summary = "=== HTTP Request Metrics ===\n\n";

    // Request duration analysis
    if (metrics.requestDuration.length > 0) {
      summary += "Request Duration by Endpoint:\n";
      metrics.requestDuration.forEach((metric) => {
        const labels = metric.labels || {};
        const route = labels.route || "unknown";
        const method = labels.method || "unknown";
        const count = metric.value || 0;

        summary += `  ${method} ${route}: ${count.toFixed(2)}ms average\n`;
      });
      summary += "\n";
    }

    // Request count analysis
    if (metrics.requestCount.length > 0) {
      summary += "Request Count by Endpoint:\n";
      metrics.requestCount.forEach((metric) => {
        const labels = metric.labels || {};
        const route = labels.route || "unknown";
        const method = labels.method || "unknown";
        const count = metric.value || 0;

        summary += `  ${method} ${route}: ${count} requests\n`;
      });
      summary += "\n";
    }

    // System metrics
    if (Object.keys(metrics.systemMetrics).length > 0) {
      summary += "=== System Metrics ===\n\n";
      Object.entries(metrics.systemMetrics).forEach(([name, value]) => {
        summary += `${name}: ${value}\n`;
      });
    }

    return summary;
  }

  // Identify bottlenecks from current metrics
  async identifyBottlenecks() {
    const metrics = await this.dataCollector.getStructuredMetrics();
    const bottlenecks = [];

    // Check for slow endpoints (>500ms)
    metrics.requestDuration.forEach((metric) => {
      const labels = metric.labels || {};
      const route = labels.route || "unknown";
      const avgTime = metric.value || 0;

      if (avgTime > 500) {
        bottlenecks.push({
          type: "slow_endpoint",
          endpoint: route,
          avgResponseTime: `${avgTime.toFixed(2)}ms`,
          severity: avgTime > 1000 ? "high" : "medium",
          recommendation: `Optimize ${route} endpoint - current avg response time is ${avgTime.toFixed(2)}ms`,
        });
      }
    });

    return {
      bottlenecks,
      timestamp: new Date(),
      totalBottlenecks: bottlenecks.length,
    };
  }

  // Get performance forecast
  async getForecast() {
    if (this.performanceHistory.length < 5) {
      return {
        status: "insufficient_data",
        message: "Need more data points for forecasting",
        dataPoints: this.performanceHistory.length,
      };
    }

    const recentScores = this.performanceHistory
      .slice(-10)
      .map((h) => h.score);
    const avgScore =
      recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const trend =
      recentScores[recentScores.length - 1] - recentScores[0] > 0
        ? "improving"
        : "degrading";

    return {
      currentScore: recentScores[recentScores.length - 1],
      averageScore: avgScore.toFixed(2),
      trend,
      prediction:
        trend === "improving"
          ? "Performance is improving over time"
          : "Performance may degrade if current trends continue",
      timestamp: new Date(),
    };
  }

  getLastAnalysis() {
    return this.lastAnalysis;
  }

  getPerformanceHistory(limit = 20) {
    return this.performanceHistory.slice(-limit);
  }
}

module.exports = PerformanceAnalyzer;
