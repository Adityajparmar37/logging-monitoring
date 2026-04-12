const express = require("express");
const { doSomeHeavyTask } = require("./utils/tasks");
const client = require("prom-client");
const responseTime = require("response-time");
const { createLogger, transport, log } = require("winston");
const LokiTransport = require("winston-loki");

const options = {
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100",
    }),
  ],
};

const logger = createLogger(options);
const app = express();
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

app.get("/", (req, res) => {
  logger.info("Hello World endpoint was hit", {
    method: req.method,
    route: req.path,
  });
  res.send("Hello World!");
});

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
