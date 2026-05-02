const cron = require("node-cron");
const DataCollector = require("./dataCollector");
const LogAnalyzer = require("./logAnalyzer");
const PerformanceAnalyzer = require("./performanceAnalyzer");

class AIMonitor {
  constructor(lokiHost) {
    this.dataCollector = new DataCollector(lokiHost);
    this.logAnalyzer = new LogAnalyzer(this.dataCollector);
    this.performanceAnalyzer = new PerformanceAnalyzer(this.dataCollector);
    this.isRunning = false;
    this.cronJob = null;
  }

  // Start periodic monitoring
  start(intervalMinutes = 5) {
    if (this.isRunning) {
      console.log("AI Monitor is already running");
      return;
    }

    console.log(
      `Starting AI Monitor - Analysis every ${intervalMinutes} minutes`,
    );

    // Run immediately on start
    this.runAnalysis();

    // Schedule periodic analysis
    const cronExpression = `*/${intervalMinutes} * * * *`;
    this.cronJob = cron.schedule(cronExpression, () => {
      this.runAnalysis();
    });

    this.isRunning = true;
  }

  // Stop monitoring
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    console.log("AI Monitor stopped");
  }

  // Run both log and performance analysis
  async runAnalysis() {
    console.log(`[${new Date().toISOString()}] Running AI analysis...`);

    try {
      // Run analyses in parallel
      const [logAnalysis, perfAnalysis] = await Promise.all([
        this.logAnalyzer.analyzeLogs(),
        this.performanceAnalyzer.analyzePerformance(),
      ]);

      console.log("Log Analysis:", logAnalysis.status || "completed");
      console.log("Performance Analysis:", perfAnalysis.status || "completed");

      // Log critical issues
      if (logAnalysis.severity === "critical" || logAnalysis.severity === "high") {
        console.warn("⚠️  CRITICAL ISSUES DETECTED IN LOGS!");
        console.warn("Anomalies:", logAnalysis.anomalies);
      }

      if (perfAnalysis.performanceScore && perfAnalysis.performanceScore < 50) {
        console.warn("⚠️  POOR PERFORMANCE DETECTED!");
        console.warn("Score:", perfAnalysis.performanceScore);
      }

      return {
        logAnalysis,
        perfAnalysis,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Error during AI analysis:", error.message);
      return {
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  // Get current status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastLogAnalysis: this.logAnalyzer.getLastAnalysis(),
      lastPerformanceAnalysis: this.performanceAnalyzer.getLastAnalysis(),
      anomalyCount: this.logAnalyzer.getAnomalies().length,
    };
  }

  // Get all analyzers (for API access)
  getAnalyzers() {
    return {
      logAnalyzer: this.logAnalyzer,
      performanceAnalyzer: this.performanceAnalyzer,
      dataCollector: this.dataCollector,
    };
  }
}

module.exports = AIMonitor;
