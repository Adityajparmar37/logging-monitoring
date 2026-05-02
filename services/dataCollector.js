const axios = require("axios");
const client = require("prom-client");

class DataCollector {
  constructor(lokiHost) {
    this.lokiHost = lokiHost || "http://127.0.0.1:3100";
  }

  // Fetch logs from Loki
  async fetchLogs(lookbackMinutes = 15, limit = 100) {
    try {
      const now = Date.now() * 1000000; // nanoseconds
      const start = now - lookbackMinutes * 60 * 1000000000;

      const query = '{job=~".+"}'; // Fetch all logs
      const url = `${this.lokiHost}/loki/api/v1/query_range`;

      const response = await axios.get(url, {
        params: {
          query,
          start,
          end: now,
          limit,
        },
      });

      const logs = [];
      if (response.data?.data?.result) {
        response.data.data.result.forEach((stream) => {
          stream.values.forEach(([timestamp, logLine]) => {
            logs.push({
              timestamp: new Date(parseInt(timestamp) / 1000000),
              message: logLine,
              labels: stream.stream,
            });
          });
        });
      }

      return logs;
    } catch (error) {
      console.error("Error fetching logs from Loki:", error.message);
      return [];
    }
  }

  // Get current metrics from prom-client registry
  async getMetrics() {
    try {
      const metrics = await client.register.getMetricsAsJSON();
      return metrics;
    } catch (error) {
      console.error("Error fetching metrics:", error.message);
      return [];
    }
  }

  // Parse and structure metrics for analysis
  async getStructuredMetrics() {
    const metrics = await this.getMetrics();
    const structured = {
      requestDuration: [],
      requestCount: [],
      systemMetrics: {},
    };

    metrics.forEach((metric) => {
      if (metric.name === "http_request_duration_seconds") {
        structured.requestDuration = metric.values || [];
      } else if (metric.name === "http_requests_total") {
        structured.requestCount = metric.values || [];
      } else if (metric.type === "gauge" || metric.type === "counter") {
        structured.systemMetrics[metric.name] = metric.values?.[0]?.value || 0;
      }
    });

    return structured;
  }
}

module.exports = DataCollector;
