# Logging & Monitoring with AI Integration

A Node.js Express application with comprehensive logging, monitoring, and AI-powered analysis capabilities.

## Features

- **Logging**: Winston + Loki integration
- **Metrics**: Prometheus metrics collection
- **Visualization**: Grafana dashboards
- **AI Analysis**: 
  - Intelligent log analysis & anomaly detection
  - Performance optimization recommendations
  - Automated bottleneck identification
  - Predictive performance forecasting

## Prerequisites

- Node.js (v14+)
- Docker (for Loki & Grafana)
- OpenRouter API Key ([Get one free here](https://openrouter.ai/))

## Quick Start

### 1. Start Infrastructure

```bash
# Start Loki (log aggregation)
docker run -d --name=loki -p 3100:3100 grafana/loki

# Start Grafana (visualization)
docker run -d -p 8000:3000 --name=grafana grafana/grafana-oss
```

# Start Prometheus 
docker compose up
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your OpenRouter API key
# OPENROUTER_API_KEY=sk-or-v1-your_actual_key_here
```

**Get your free API key**: https://openrouter.ai/keys

See [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) for detailed setup instructions.

### 4. Run Application

```bash
# Development mode
npm run dev

# Production mode
node index.js
```

The server will start on `http://localhost:3000`

## API Endpoints

### Standard Endpoints

- `GET /` - Hello World
- `GET /slow` - Simulated slow endpoint
- `GET /metrics` - Prometheus metrics

### AI Endpoints

#### Monitor Status
```bash
GET /ai/status
```
Returns current AI monitor status and last analysis results.

#### Log Analysis

```bash
# Analyze logs (on-demand)
GET /ai/logs/analyze?lookback=15

# Get detected anomalies
GET /ai/logs/anomalies?limit=10

# Get log summary
GET /ai/logs/summary
```

#### Performance Analysis

```bash
# Analyze performance (on-demand)
GET /ai/performance/analyze

# Get optimization recommendations
GET /ai/performance/recommendations

# Identify bottlenecks
GET /ai/performance/bottlenecks

# Get performance forecast
GET /ai/performance/forecast

# Get performance history
GET /ai/performance/history?limit=20
```

#### Manual Trigger

```bash
# Trigger full analysis (logs + performance)
POST /ai/analyze
```

## Configuration

Edit `.env` file:

```env
# OpenRouter API Key (required for AI features)
OPENROUTER_API_KEY=sk-or-v1-your_key_here

# Optional: Choose AI model (defaults to free Llama 3.1 8B)
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free

# Loki host
LOKI_HOST=http://127.0.0.1:3100

# Analysis interval (minutes)
ANALYSIS_INTERVAL_MINUTES=5

# Log lookback period (minutes)
LOG_ANALYSIS_LOOKBACK_MINUTES=15
```

**See [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) for model options and pricing.**

## How It Works

### Automated Monitoring

Once started, the AI monitor runs every 5 minutes (configurable) and:

1. **Fetches logs** from Loki
2. **Collects metrics** from Prometheus
3. **Analyzes with Gemini AI**:
   - Identifies error patterns
   - Detects anomalies
   - Finds performance bottlenecks
   - Generates recommendations
4. **Stores insights** in memory for API access

### On-Demand Analysis

You can trigger analysis anytime via API endpoints without waiting for scheduled runs.

## Example Usage

```bash
# Check AI monitor status
curl http://localhost:3000/ai/status

# Analyze last 30 minutes of logs
curl http://localhost:3000/ai/logs/analyze?lookback=30

# Get performance recommendations
curl http://localhost:3000/ai/performance/recommendations

# Identify current bottlenecks
curl http://localhost:3000/ai/performance/bottlenecks

# Trigger immediate analysis
curl -X POST http://localhost:3000/ai/analyze
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Express Application             │
│  (Logging + Metrics + AI Endpoints)     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          AI Monitor Service             │
│  • Log Analyzer                         │
│  • Performance Analyzer                 │
│  • Scheduled Analysis (cron)            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│        Data Collection Layer            │
│  • Loki Query Client                    │
│  • Prometheus Metrics Reader            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          Google Gemini AI               │
│  (Analysis & Recommendations)           │
└─────────────────────────────────────────┘
```

## Grafana Setup

1. Access Grafana at `http://localhost:8000`
2. Default credentials: `admin/admin`
3. Add Loki data source: `http://loki:3100`
4. Add Prometheus data source (if using): `http://localhost:9090`
5. Import dashboards or create custom ones

## Troubleshooting

### AI features not working

- Verify `OPENROUTER_API_KEY` is set correctly in `.env`
- Check API key is valid at [OpenRouter Keys](https://openrouter.ai/keys)
- For free models, no credits needed
- For premium models, ensure you have credits

### No logs in analysis

- Verify Loki is running: `docker ps | grep loki`
- Check Loki is accessible: `curl http://localhost:3100/ready`
- Generate some traffic to create logs

### No metrics available

- Hit some endpoints first to generate metrics
- Check `/metrics` endpoint returns data

## Development

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
npm run dev

# View logs
docker logs -f loki
```

## License

ISC
