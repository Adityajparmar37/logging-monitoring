const express = require("express");
const { doSomeHeavyTask } = require("./utils/tasks");
const client = require("prom-client");
const responseTime = require("response-time");
const { createLogger } = require("winston");
const LokiTransport = require("winston-loki");
const cors = require("cors");

// add this BEFORE your routes
require("dotenv").config();

// AI Integration
const AIMonitor = require("./services/aiMonitor");
const { router: aiRoutes, setAIMonitor } = require("./routes/aiRoutes");

const options = {
  transports: [
    new LokiTransport({
      host: process.env.LOKI_HOST || "http://127.0.0.1:3100",
    }),
  ],
};

const logger = createLogger(options);
const app = express();

// Enable CORS first
app.use(cors());

// Serve static files from public directory
app.use(express.static("public"));

// Initialize AI Monitor
const aiMonitor = new AIMonitor(process.env.LOKI_HOST);
setAIMonitor(aiMonitor);
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const reqResTime = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000], // buckets for response time in seconds
});

const totalReqCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

app.use(
  responseTime((req, res, time) => {
    totalReqCounter.inc();
    reqResTime
      .labels({ method: req.method, route: req.path, status: res.statusCode })
      .observe(time);
  }),
);

// Root path now serves the dashboard from public/index.html
// app.get("/") is handled by express.static middleware

app.get("/slow", async (req, res) => {
  try {
    logger.info("Slow endpoint was hit", {
      method: req.method,
      route: req.path,
    });
    const timetaken = await doSomeHeavyTask();
    res.send(`This response was delayed by ${timetaken} milliseconds`);
  } catch (error) {
    logger.error("Error occurred in slow endpoint", {
      method: req.method,
      route: req.path,
      error: error.message,
    });
    res.status(500).send(error.message);
  }
});

app.get("/metrics", async (req, res) => {
  try {
    logger.info("Metrics endpoint was hit", {
      method: req.method,
      route: req.path,
    });
    const metrics = await client.register.metrics();
    res.set("Content-Type", client.register.contentType);
    res.send(metrics);
  } catch (error) {
    logger.error("Error occurred in metrics endpoint", {
      method: req.method,
      route: req.path,
      error: error.message,
    });
    res.status(500).send(error.message);
  }
});

// Mount AI routes
app.use("/ai", aiRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("Dashboard: http://localhost:3000");
  console.log("AI endpoints available at http://localhost:3000/ai/*");

  // Start AI monitoring if API key is configured
  if (
    process.env.OPENROUTER_API_KEY &&
    process.env.OPENROUTER_API_KEY !== "your_openrouter_api_key_here"
  ) {
    const intervalMinutes =
      parseInt(process.env.ANALYSIS_INTERVAL_MINUTES) || 5;
    aiMonitor.start(intervalMinutes);
    console.log(
      `AI Monitor started - analyzing every ${intervalMinutes} minutes`,
    );
  } else {
    console.warn(
      "⚠️  OPENROUTER_API_KEY not configured. AI features will be disabled.",
    );
    console.warn("   Set your API key in .env file to enable AI monitoring");
  }
});
