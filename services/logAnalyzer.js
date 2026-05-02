const { analyzeWithAI } = require("../config/openrouter");

class LogAnalyzer {
  constructor(dataCollector) {
    this.dataCollector = dataCollector;
    this.lastAnalysis = null;
    this.anomalies = [];
  }

  // Analyze logs for patterns and anomalies
  async analyzeLogs(lookbackMinutes = 15) {
    const logs = await this.dataCollector.fetchLogs(lookbackMinutes);

    if (logs.length === 0) {
      return {
        status: "no_data",
        message: "No logs available for analysis",
        timestamp: new Date(),
      };
    }

    // Prepare log summary for AI
    const logSummary = this.prepareLogSummary(logs);

    const systemInstruction = `You are an expert log analyzer for a Node.js Express application with monitoring capabilities.
Analyze the provided logs and identify:
1. Error patterns and their frequency
2. Unusual behavior or anomalies
3. Performance issues indicated by logs
4. Security concerns (if any)
5. Recommendations for improvement

Provide a structured analysis in JSON format with these keys:
- summary: Brief overview
- errors: Array of error patterns found
- anomalies: Array of unusual behaviors
- recommendations: Array of actionable suggestions
- severity: "low", "medium", "high", or "critical"`;

    try {
      const prompt = `Analyze these application logs from the last ${lookbackMinutes} minutes:\n\n${logSummary}`;
      const aiResponse = await analyzeWithAI(prompt, systemInstruction);

      // Try to parse JSON response
      let analysis;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
        const jsonText = jsonMatch ? jsonMatch[1] : aiResponse;
        analysis = JSON.parse(jsonText);
      } catch (e) {
        // If not JSON, structure the text response
        analysis = {
          summary: aiResponse,
          errors: [],
          anomalies: [],
          recommendations: [],
          severity: "low",
        };
      }

      this.lastAnalysis = {
        ...analysis,
        timestamp: new Date(),
        logCount: logs.length,
        timeRange: `${lookbackMinutes} minutes`,
      };

      // Store anomalies separately
      if (analysis.anomalies && analysis.anomalies.length > 0) {
        this.anomalies.push({
          timestamp: new Date(),
          anomalies: analysis.anomalies,
          severity: analysis.severity,
        });
        // Keep only last 50 anomaly records
        if (this.anomalies.length > 50) {
          this.anomalies = this.anomalies.slice(-50);
        }
      }

      return this.lastAnalysis;
    } catch (error) {
      console.error("Log analysis error:", error.message);
      return {
        status: "error",
        message: error.message,
        timestamp: new Date(),
      };
    }
  }

  // Prepare a concise summary of logs for AI analysis
  prepareLogSummary(logs) {
    const errorLogs = logs.filter((log) =>
      log.message.toLowerCase().includes("error"),
    );
    const infoLogs = logs.filter((log) =>
      log.message.toLowerCase().includes("info"),
    );

    // Group by endpoint
    const endpointCounts = {};
    logs.forEach((log) => {
      const routeMatch = log.message.match(/route[":]\s*([^\s,}"]+)/);
      if (routeMatch) {
        const route = routeMatch[1];
        endpointCounts[route] = (endpointCounts[route] || 0) + 1;
      }
    });

    return `
Total Logs: ${logs.length}
Error Logs: ${errorLogs.length}
Info Logs: ${infoLogs.length}

Endpoint Activity:
${Object.entries(endpointCounts)
  .map(([route, count]) => `  ${route}: ${count} requests`)
  .join("\n")}

Recent Error Logs (last 10):
${errorLogs
  .slice(-10)
  .map((log) => `[${log.timestamp.toISOString()}] ${log.message}`)
  .join("\n")}

Sample Info Logs (last 5):
${infoLogs
  .slice(-5)
  .map((log) => `[${log.timestamp.toISOString()}] ${log.message}`)
  .join("\n")}
    `.trim();
  }

  // Get the last analysis result
  getLastAnalysis() {
    return this.lastAnalysis;
  }

  // Get detected anomalies
  getAnomalies(limit = 10) {
    return this.anomalies.slice(-limit);
  }
}

module.exports = LogAnalyzer;
