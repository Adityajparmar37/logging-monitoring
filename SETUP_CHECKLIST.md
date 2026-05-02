# Setup Checklist

Use this checklist to ensure everything is configured correctly.

## Prerequisites

- [ ] Node.js installed (v14 or higher)
  ```bash
  node --version
  ```

- [ ] Docker installed and running
  ```bash
  docker --version
  docker ps
  ```

- [ ] npm packages installed
  ```bash
  npm install
  ```

## Infrastructure Setup

- [ ] Loki container running
  ```bash
  docker run -d --name=loki -p 3100:3100 grafana/loki
  
  # Verify it's running
  docker ps | grep loki
  curl http://localhost:3100/ready
  ```

- [ ] Grafana container running (optional but recommended)
  ```bash
  docker run -d -p 8000:3000 --name=grafana grafana/grafana-oss
  
  # Verify it's running
  docker ps | grep grafana
  # Access at http://localhost:8000 (admin/admin)
  ```

## API Configuration

- [ ] Get OpenRouter API Key
  - Go to: https://openrouter.ai/keys
  - Sign in with Google/GitHub/email
  - Click "Create Key"
  - Copy the key (starts with `sk-or-v1-`)

- [ ] Configure .env file
  ```bash
  # Edit .env file
  nano .env
  
  # Add your API key
  OPENROUTER_API_KEY=sk-or-v1-your_actual_key_here
  ```

- [ ] Verify .env configuration
  ```bash
  cat .env
  ```
  
  Should contain:
  ```
  OPENROUTER_API_KEY=sk-or-v1-...
  OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
  LOKI_HOST=http://127.0.0.1:3100
  ANALYSIS_INTERVAL_MINUTES=5
  LOG_ANALYSIS_LOOKBACK_MINUTES=15
  ```

## Application Startup

- [ ] Start the application
  ```bash
  npm run dev
  ```

- [ ] Verify startup messages
  ```
  ✅ Server is running on port 3000
  ✅ AI endpoints available at http://localhost:3000/ai/*
  ✅ AI Monitor started - analyzing every 5 minutes
  ```

- [ ] Check for errors
  - ❌ If you see "OPENROUTER_API_KEY not configured" → Check .env file
  - ❌ If you see connection errors → Check Loki is running

## Testing

- [ ] Test standard endpoints
  ```bash
  curl http://localhost:3000/
  curl http://localhost:3000/slow
  curl http://localhost:3000/metrics
  ```

- [ ] Generate traffic (for logs)
  ```bash
  # Hit endpoints multiple times
  for i in {1..10}; do curl http://localhost:3000/; done
  for i in {1..5}; do curl http://localhost:3000/slow; done
  ```

- [ ] Wait for logs to propagate (2-3 minutes)
  ```bash
  sleep 180
  ```

- [ ] Test AI endpoints
  ```bash
  # Check status
  curl http://localhost:3000/ai/status
  
  # Analyze logs
  curl http://localhost:3000/ai/logs/analyze?lookback=5
  
  # Check performance
  curl http://localhost:3000/ai/performance/analyze
  ```

- [ ] Run automated test suite
  ```bash
  npm run test:ai
  ```

## Verification

- [ ] AI Monitor is running
  ```bash
  curl http://localhost:3000/ai/status | jq '.isRunning'
  # Should return: true
  ```

- [ ] Logs are being collected
  ```bash
  curl http://localhost:3000/ai/logs/analyze | jq '.logCount'
  # Should return: number > 0
  ```

- [ ] Metrics are available
  ```bash
  curl http://localhost:3000/metrics
  # Should return Prometheus metrics
  ```

- [ ] AI analysis is working
  ```bash
  curl http://localhost:3000/ai/logs/analyze | jq '.summary'
  # Should return AI-generated summary
  ```

## Grafana Setup (Optional)

- [ ] Access Grafana
  - URL: http://localhost:8000
  - Username: admin
  - Password: admin

- [ ] Add Loki data source
  1. Go to Configuration → Data Sources
  2. Click "Add data source"
  3. Select "Loki"
  4. URL: http://loki:3100
  5. Click "Save & Test"

- [ ] Create dashboard
  1. Create → Dashboard
  2. Add panel
  3. Query: `{job=~".+"}`
  4. Save dashboard

## Troubleshooting

### Issue: "AI Monitor not initialized"
- [ ] Check OPENROUTER_API_KEY in .env
- [ ] Restart server after updating .env
- [ ] Verify API key is valid at OpenRouter

### Issue: "No logs available for analysis"
- [ ] Verify Loki is running: `docker ps | grep loki`
- [ ] Check Loki is accessible: `curl http://localhost:3100/ready`
- [ ] Generate traffic by hitting endpoints
- [ ] Wait 2-3 minutes for logs to propagate

### Issue: "No metrics available"
- [ ] Hit endpoints to generate metrics
- [ ] Check /metrics endpoint: `curl http://localhost:3000/metrics`
- [ ] Verify prom-client is collecting data

### Issue: OpenRouter API errors
- [ ] Check API key is correct
- [ ] For free models, no credits needed
- [ ] For premium models, verify you have credits
- [ ] Check internet connection
- [ ] Review error message in console
- [ ] Check model name is correct

### Issue: Docker containers not starting
- [ ] Check Docker is running: `docker ps`
- [ ] Check port conflicts: `lsof -i :3100` and `lsof -i :8000`
- [ ] Remove old containers: `docker rm -f loki grafana`
- [ ] Try starting again

## Next Steps

Once everything is working:

- [ ] Review QUICKSTART.md for usage examples
- [ ] Read ARCHITECTURE.md to understand the system
- [ ] Check AI_INTEGRATION_SUMMARY.md for feature overview
- [ ] Read OPENROUTER_SETUP.md for model options and pricing
- [ ] Explore API endpoints in README.md
- [ ] Set up alerts for critical issues
- [ ] Configure Grafana dashboards
- [ ] Adjust analysis interval in .env
- [ ] Plan for production deployment

## Production Checklist

Before deploying to production:

- [ ] Use environment-specific .env files
- [ ] Set up proper logging (file rotation)
- [ ] Configure HTTPS
- [ ] Add API authentication
- [ ] Set up rate limiting
- [ ] Configure monitoring alerts
- [ ] Set up backup for insights (if using persistent storage)
- [ ] Review and adjust Gemini API quotas
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure proper CORS settings
- [ ] Review security best practices
- [ ] Set up CI/CD pipeline
- [ ] Configure health checks
- [ ] Set up load balancing (if needed)
- [ ] Review OpenRouter usage and costs
- [ ] Consider model selection for production

## Support Resources

- **Documentation**: README.md, QUICKSTART.md, ARCHITECTURE.md
- **OpenRouter Setup**: OPENROUTER_SETUP.md
- **OpenRouter Dashboard**: https://openrouter.ai/
- **OpenRouter Models**: https://openrouter.ai/models
- **Loki Docs**: https://grafana.com/docs/loki/
- **Prometheus Docs**: https://prometheus.io/docs/

---

**Happy monitoring! 🚀**
