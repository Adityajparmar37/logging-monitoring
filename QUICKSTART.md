# Quick Start Guide - AI Integration

## Step-by-Step Setup

### 1. Get Your OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign in with Google, GitHub, or email
3. Go to [Keys](https://openrouter.ai/keys)
4. Click "Create Key"
5. Copy the generated key (starts with `sk-or-v1-...`)

**It's FREE!** No credit card required for free models.

### 2. Configure Your Application

```bash
# Open the .env file
nano .env

# Replace the placeholder with your actual API key
OPENROUTER_API_KEY=sk-or-v1-your_actual_key_here
```

**See [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) for detailed setup and model options.**

### 3. Start Infrastructure (if not already running)

```bash
# Start Loki
docker run -d --name=loki -p 3100:3100 grafana/loki

# Start Grafana
docker run -d -p 8000:3000 --name=grafana grafana/grafana-oss
```

### 4. Start Your Application

```bash
npm run dev
```

You should see:
```
Server is running on port 3000
AI endpoints available at http://localhost:3000/ai/*
AI Monitor started - analyzing every 5 minutes
```

### 5. Test the AI Features

```bash
# Run the test suite
npm run test:ai
```

Or manually test endpoints:

```bash
# Check AI status
curl http://localhost:3000/ai/status

# Analyze logs
curl http://localhost:3000/ai/logs/analyze

# Get performance insights
curl http://localhost:3000/ai/performance/analyze
```

## What Happens Next?

### Automatic Monitoring (Every 5 minutes)

The AI monitor will automatically:
- ✅ Fetch logs from Loki
- ✅ Collect metrics from Prometheus
- ✅ Analyze with Gemini AI
- ✅ Detect anomalies
- ✅ Identify bottlenecks
- ✅ Generate recommendations

### On-Demand Analysis

You can trigger analysis anytime:

```bash
# Trigger immediate analysis
curl -X POST http://localhost:3000/ai/analyze
```

## Available AI Endpoints

### Log Analysis
- `/ai/logs/analyze` - Analyze recent logs
- `/ai/logs/anomalies` - Get detected anomalies
- `/ai/logs/summary` - Get log summary

### Performance Analysis
- `/ai/performance/analyze` - Full performance analysis
- `/ai/performance/recommendations` - Get optimization tips
- `/ai/performance/bottlenecks` - Identify slow endpoints
- `/ai/performance/forecast` - Performance predictions
- `/ai/performance/history` - Historical performance data

### General
- `/ai/status` - Monitor status
- `/ai/analyze` (POST) - Trigger full analysis

## Example Workflow

1. **Generate some traffic:**
   ```bash
   # Hit your endpoints a few times
   curl http://localhost:3000/
   curl http://localhost:3000/slow
   curl http://localhost:3000/metrics
   ```

2. **Wait 2-3 minutes** for logs to propagate to Loki

3. **Analyze logs:**
   ```bash
   curl http://localhost:3000/ai/logs/analyze?lookback=5
   ```

4. **Check performance:**
   ```bash
   curl http://localhost:3000/ai/performance/analyze
   ```

5. **Get recommendations:**
   ```bash
   curl http://localhost:3000/ai/performance/recommendations
   ```

## Troubleshooting

### "AI Monitor not initialized"
- Check your `OPENROUTER_API_KEY` in `.env`
- Restart the server after updating `.env`

### "No logs available for analysis"
- Generate traffic by hitting endpoints
- Wait 2-3 minutes for logs to reach Loki
- Verify Loki is running: `docker ps | grep loki`

### "No metrics available"
- Hit some endpoints first to generate metrics
- Check `/metrics` endpoint returns data

## Next Steps

- Set up Grafana dashboards to visualize AI insights
- Adjust `ANALYSIS_INTERVAL_MINUTES` in `.env` for more/less frequent analysis
- Integrate AI alerts into your notification system
- Export AI insights to your monitoring tools

## Cost Considerations

OpenRouter pricing:

### Free Models (Recommended to start):
- **Llama 3.1 8B**: $0.00 per request ✅
- **Mistral 7B**: $0.00 per request ✅
- Running 24/7: **$0.00/year** 🎉

### Premium Models (Optional):
- **Gemini Pro**: ~$0.0005 per request
- **GPT-4 Turbo**: ~$0.01 per request
- **Claude 3.5**: ~$0.015 per request

Running every 5 minutes = ~288 requests/day
- Gemini Pro: ~$4/month
- GPT-4 Turbo: ~$86/month

**Start with free models, upgrade only if needed!**

See [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) for detailed pricing.
