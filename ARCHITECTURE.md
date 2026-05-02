# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client / User                            │
│                    (Browser, curl, Postman)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Express Application                         │
│                         (index.js)                               │
├─────────────────────────────────────────────────────────────────┤
│  Standard Endpoints:                                             │
│  • GET  /           - Hello World                                │
│  • GET  /slow       - Slow endpoint simulation                   │
│  • GET  /metrics    - Prometheus metrics                         │
│                                                                   │
│  AI Endpoints (mounted at /ai):                                  │
│  • GET  /ai/status                                               │
│  • GET  /ai/logs/analyze                                         │
│  • GET  /ai/logs/anomalies                                       │
│  • GET  /ai/logs/summary                                         │
│  • GET  /ai/performance/analyze                                  │
│  • GET  /ai/performance/recommendations                          │
│  • GET  /ai/performance/bottlenecks                              │
│  • GET  /ai/performance/forecast                                 │
│  • GET  /ai/performance/history                                  │
│  • POST /ai/analyze                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI Monitor Service                          │
│                     (services/aiMonitor.js)                      │
├─────────────────────────────────────────────────────────────────┤
│  • Orchestrates periodic analysis (cron job)                     │
│  • Coordinates LogAnalyzer & PerformanceAnalyzer                 │
│  • Manages analysis lifecycle                                    │
│  • Stores current status                                         │
└──────────────┬──────────────────────────────┬───────────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────┐    ┌────────────────────────────────┐
│     Log Analyzer         │    │   Performance Analyzer         │
│ (services/logAnalyzer.js)│    │(services/performanceAnalyzer.js)│
├──────────────────────────┤    ├────────────────────────────────┤
│ • Fetches logs           │    │ • Fetches metrics              │
│ • Prepares summaries     │    │ • Analyzes response times      │
│ • Detects anomalies      │    │ • Identifies bottlenecks       │
│ • Tracks severity        │    │ • Generates forecasts          │
│ • Stores anomaly history │    │ • Tracks performance score     │
└──────────┬───────────────┘    └────────────┬───────────────────┘
           │                                  │
           │                                  │
           └──────────────┬───────────────────┘
                          │
                          ▼
           ┌──────────────────────────────┐
           │      Data Collector          │
           │ (services/dataCollector.js)  │
           ├──────────────────────────────┤
           │ • Queries Loki for logs      │
           │ • Reads Prometheus metrics   │
           │ • Structures data for AI     │
           └──────────┬───────────────────┘
                      │
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐          ┌────────────────┐
│     Loki      │          │  Prometheus    │
│  (Logs DB)    │          │  (Metrics)     │
├───────────────┤          ├────────────────┤
│ Port: 3100    │          │ prom-client    │
│ Docker        │          │ in-memory      │
└───────────────┘          └────────────────┘
        ▲                           ▲
        │                           │
        │    Winston Logger         │    Metrics Collection
        │    (winston-loki)         │    (response-time)
        │                           │
        └───────────────┬───────────┘
                        │
                        │
           ┌────────────────────────┐
           │  OpenRouter Client     │
           │  (config/openrouter.js)│
           ├────────────────────────┤
           │ • OpenAI SDK           │
           │ • Model: Llama 3.1 8B  │
           │   (or your choice)     │
           │ • Analyzes logs        │
           │ • Generates insights   │
           └────────────────────────┘
                        │
                        │ API Calls
                        ▼
           ┌────────────────────────┐
           │   OpenRouter API       │
           │  (External Service)    │
           │  • Multiple AI models  │
           │  • Free & Premium      │
           └────────────────────────┘
```

## Data Flow

### 1. Request Logging Flow
```
User Request
    ↓
Express Middleware (response-time)
    ↓
Winston Logger
    ↓
Loki Transport
    ↓
Loki Database (Docker)
```

### 2. Metrics Collection Flow
```
User Request
    ↓
Express Middleware (response-time)
    ↓
Prometheus Client (prom-client)
    ├─→ Request Counter (http_requests_total)
    └─→ Response Time Histogram (http_request_duration_seconds)
    ↓
In-Memory Registry
    ↓
/metrics Endpoint
```

### 3. AI Analysis Flow (Automated)
```
Cron Job (every 5 min)
    ↓
AIMonitor.runAnalysis()
    ↓
┌───────────────────┴────────────────────┐
│                                        │
▼                                        ▼
LogAnalyzer                    PerformanceAnalyzer
    ↓                                    ↓
DataCollector.fetchLogs()      DataCollector.getMetrics()
    ↓                                    ↓
Loki Query                     Prometheus Registry
    ↓                                    ↓
Prepare Summary                Prepare Summary
    ↓                                    ↓
Gemini AI Analysis             Gemini AI Analysis
    ↓                                    ↓
Store Results                  Store Results
    ↓                                    ↓
└───────────────────┬────────────────────┘
                    ↓
            Console Logging
            (Critical Issues)
```

### 4. On-Demand Analysis Flow
```
User API Request (GET /ai/logs/analyze)
    ↓
AI Routes Handler
    ↓
LogAnalyzer.analyzeLogs()
    ↓
DataCollector.fetchLogs(lookbackMinutes)
    ↓
Loki Query (last N minutes)
    ↓
Prepare Log Summary
    ↓
Gemini AI Analysis
    ↓
JSON Response to User
```

## Component Responsibilities

### Express Application (index.js)
- HTTP server setup
- Route handling
- Middleware configuration
- AI Monitor initialization
- Server lifecycle management

### AI Monitor (services/aiMonitor.js)
- Cron job scheduling
- Analysis orchestration
- Status management
- Error handling
- Lifecycle control (start/stop)

### Log Analyzer (services/logAnalyzer.js)
- Log fetching via DataCollector
- Log summarization
- Anomaly detection
- Error pattern identification
- Severity classification
- Anomaly history tracking

### Performance Analyzer (services/performanceAnalyzer.js)
- Metrics fetching via DataCollector
- Response time analysis
- Bottleneck identification
- Performance scoring
- Trend forecasting
- Performance history tracking

### Data Collector (services/dataCollector.js)
- Loki API integration
- Prometheus metrics reading
- Data structuring
- Query parameter handling
- Error handling

### Gemini Client (config/openrouter.js)
- OpenRouter API integration
- OpenAI SDK compatibility
- Model selection
- Prompt management
- Response parsing
- Error handling

### AI Routes (routes/aiRoutes.js)
- REST API endpoints
- Request validation
- Response formatting
- Error handling
- Query parameter parsing

## Storage Strategy

### In-Memory Storage
```
AIMonitor
    ├─→ LogAnalyzer
    │       ├─→ lastAnalysis (object)
    │       └─→ anomalies (array, max 50)
    │
    └─→ PerformanceAnalyzer
            ├─→ lastAnalysis (object)
            └─→ performanceHistory (array, max 100)
```

**Pros:**
- Fast access
- No database setup required
- Simple implementation

**Cons:**
- Lost on restart
- Limited to single instance
- Memory constraints

**Future Enhancement:** Add persistent storage (PostgreSQL, MongoDB, Redis)

## Scalability Considerations

### Current Architecture
- Single instance
- In-memory storage
- Synchronous analysis

### Future Enhancements
1. **Horizontal Scaling**
   - Add Redis for shared state
   - Use message queue (RabbitMQ, Kafka)
   - Distribute analysis workers

2. **Persistent Storage**
   - PostgreSQL for structured data
   - TimescaleDB for time-series
   - MongoDB for flexible schema

3. **Async Processing**
   - Background job queue
   - Webhook notifications
   - Stream processing

4. **Caching**
   - Redis for API responses
   - Cache analysis results
   - Rate limiting

## Security Considerations

### Current Implementation
- ✅ API key in environment variables
- ✅ .env excluded from git
- ✅ Error messages sanitized
- ✅ Input validation on query params

### Recommendations
- [ ] Add API authentication
- [ ] Rate limiting on AI endpoints
- [ ] Request logging for audit
- [ ] HTTPS in production
- [ ] API key rotation policy

## Monitoring the Monitor

### Health Checks
```bash
# Check if AI Monitor is running
curl http://localhost:3000/ai/status

# Expected response:
{
  "isRunning": true,
  "lastLogAnalysis": {...},
  "lastPerformanceAnalysis": {...},
  "anomalyCount": 5
}
```

### Logs to Watch
```
[timestamp] Running AI analysis...
Log Analysis: completed
Performance Analysis: completed
⚠️  CRITICAL ISSUES DETECTED IN LOGS!
⚠️  POOR PERFORMANCE DETECTED!
```

### Metrics to Track
- Analysis execution time
- Gemini API response time
- Analysis success/failure rate
- Anomaly detection rate
- Performance score trends

---

**Architecture designed for simplicity, extensibility, and cost-effectiveness.**
