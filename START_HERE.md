# 🚀 Start Here - AI-Powered Logging & Monitoring

Welcome! This project adds **AI-powered log analysis and performance optimization** to your Express application using **OpenRouter** (with free AI models!).

## ⚡ Quick Start (5 minutes)

### 1. Get Free API Key
👉 Go to [OpenRouter.ai](https://openrouter.ai/keys) and create a free account
👉 Click "Create Key" and copy it

### 2. Configure
```bash
# Edit .env file
nano .env

# Add your API key
OPENROUTER_API_KEY=sk-or-v1-paste_your_key_here
```

### 3. Start
```bash
# Install dependencies (if not done)
npm install

# Start the server
npm run dev
```

### 4. Test
```bash
# Run the test suite
npm run test:ai
```

**That's it!** Your AI monitoring is now active! 🎉

## 📚 Documentation Guide

### New to the project?
1. **START HERE** (you are here!)
2. Read [QUICKSTART.md](QUICKSTART.md) - Step-by-step setup
3. Check [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) - Model options & pricing

### Want to understand the system?
- [README.md](README.md) - Complete documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design & diagrams
- [AI_INTEGRATION_SUMMARY.md](AI_INTEGRATION_SUMMARY.md) - Feature overview

### Setting up?
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Verification checklist
- [EXAMPLE_RESPONSES.md](EXAMPLE_RESPONSES.md) - What to expect

### Reference
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - File organization
- [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) - Gemini → OpenRouter changes

## 🎯 What You Get

### Option 1: Intelligent Log Analysis
- ✅ Automatic error pattern detection
- ✅ Anomaly detection
- ✅ Security concern identification
- ✅ Severity classification
- ✅ Actionable recommendations

### Option 3: Performance Optimization
- ✅ Bottleneck identification
- ✅ Response time analysis
- ✅ Optimization recommendations
- ✅ Performance forecasting
- ✅ Resource utilization insights

## 🔌 API Endpoints

### Check Status
```bash
curl http://localhost:3000/ai/status
```

### Analyze Logs
```bash
curl http://localhost:3000/ai/logs/analyze
```

### Get Performance Insights
```bash
curl http://localhost:3000/ai/performance/analyze
```

### See All Endpoints
```bash
# Log Analysis
GET /ai/logs/analyze
GET /ai/logs/anomalies
GET /ai/logs/summary

# Performance Analysis
GET /ai/performance/analyze
GET /ai/performance/recommendations
GET /ai/performance/bottlenecks
GET /ai/performance/forecast
GET /ai/performance/history

# General
GET /ai/status
POST /ai/analyze
```

## 💰 Cost

### Free Forever! (Recommended)
```bash
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```
- **Cost**: $0.00 per request
- **Monthly**: $0.00
- **Quality**: Good for most use cases

### Premium (Optional)
- Gemini Pro: ~$4/month
- GPT-4 Turbo: ~$86/month
- Claude 3.5: ~$130/month

**Start with free, upgrade only if needed!**

## 🎨 Features

### Automated Monitoring
- Runs every 5 minutes (configurable)
- Analyzes logs from Loki
- Collects metrics from Prometheus
- Generates AI insights
- Logs critical issues

### On-Demand Analysis
- Trigger anytime via API
- Adjust lookback period
- Get instant insights
- No waiting for scheduled runs

### Smart Insights
- Error pattern detection
- Anomaly identification
- Performance bottlenecks
- Optimization suggestions
- Trend forecasting

## 🛠️ Tech Stack

- **Framework**: Express.js
- **Logging**: Winston + Loki
- **Metrics**: Prometheus (prom-client)
- **AI**: OpenRouter (multiple models)
- **Scheduling**: node-cron
- **Visualization**: Grafana (optional)

## 📊 Example Output

```json
{
  "summary": "Application performing well. No critical issues detected.",
  "errors": [],
  "anomalies": [],
  "recommendations": [
    "Consider caching for /slow endpoint",
    "Monitor response times during peak hours"
  ],
  "severity": "low",
  "performanceScore": 85
}
```

## 🔧 Configuration

### Minimal (Just works!)
```bash
OPENROUTER_API_KEY=sk-or-v1-your_key_here
```

### Recommended
```bash
OPENROUTER_API_KEY=sk-or-v1-your_key_here
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
ANALYSIS_INTERVAL_MINUTES=5
LOG_ANALYSIS_LOOKBACK_MINUTES=15
```

### Advanced
```bash
OPENROUTER_API_KEY=sk-or-v1-your_key_here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
YOUR_SITE_URL=https://myapp.com
YOUR_SITE_NAME=My Awesome App
ANALYSIS_INTERVAL_MINUTES=3
LOG_ANALYSIS_LOOKBACK_MINUTES=30
```

## 🚨 Troubleshooting

### Server won't start
```bash
# Check dependencies
npm install

# Check .env file exists
ls -la .env

# Check Loki is running
docker ps | grep loki
```

### AI not working
```bash
# Verify API key
cat .env | grep OPENROUTER_API_KEY

# Test API key
curl http://localhost:3000/ai/status
```

### No logs to analyze
```bash
# Generate traffic
for i in {1..10}; do curl http://localhost:3000/; done

# Wait for logs to propagate
sleep 120

# Try again
curl http://localhost:3000/ai/logs/analyze
```

## 📖 Learn More

### Beginner
1. [QUICKSTART.md](QUICKSTART.md) - Get started in 5 minutes
2. [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md) - Understand AI models
3. [EXAMPLE_RESPONSES.md](EXAMPLE_RESPONSES.md) - See what you'll get

### Intermediate
1. [README.md](README.md) - Full documentation
2. [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Verify everything
3. [AI_INTEGRATION_SUMMARY.md](AI_INTEGRATION_SUMMARY.md) - Feature details

### Advanced
1. [ARCHITECTURE.md](ARCHITECTURE.md) - System design
2. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Code organization
3. Source code in `services/` and `config/`

## 🎯 Next Steps

### Immediate
- [ ] Get OpenRouter API key
- [ ] Update .env file
- [ ] Start server: `npm run dev`
- [ ] Test: `npm run test:ai`

### Soon
- [ ] Set up Grafana dashboards
- [ ] Configure alerts for critical issues
- [ ] Adjust analysis frequency
- [ ] Explore different AI models

### Later
- [ ] Add persistent storage
- [ ] Implement webhooks
- [ ] Create custom dashboards
- [ ] Scale horizontally

## 💡 Tips

1. **Start with free models** - They're surprisingly good!
2. **Monitor costs** - Check https://openrouter.ai/activity
3. **Adjust frequency** - Change `ANALYSIS_INTERVAL_MINUTES` based on needs
4. **Read the logs** - AI insights are logged to console
5. **Test different models** - Easy to switch in .env

## 🤝 Support

- **Issues?** Check [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
- **Questions?** Read [README.md](README.md)
- **Models?** See [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md)
- **OpenRouter Help**: https://openrouter.ai/docs

## 🎉 You're Ready!

Your AI-powered monitoring system is ready to go. Just add your API key and start the server!

```bash
# Quick start
npm run dev

# Test it
npm run test:ai

# Check status
curl http://localhost:3000/ai/status
```

**Happy monitoring! 🚀**

---

**Questions?** Start with [QUICKSTART.md](QUICKSTART.md) or [README.md](README.md)
