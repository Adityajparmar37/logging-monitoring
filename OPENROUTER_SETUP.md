# OpenRouter Setup Guide

## What is OpenRouter?

OpenRouter is a unified API that gives you access to multiple AI models through a single interface:
- **Free models**: Llama 3.1, Mistral, and more
- **Premium models**: GPT-4, Claude, Gemini, and others
- **Pay-as-you-go**: Only pay for what you use
- **No subscriptions**: No monthly fees

## Getting Your API Key

### Step 1: Create Account
1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Click "Sign In" (top right)
3. Sign in with Google, GitHub, or email

### Step 2: Get API Key
1. Once logged in, go to [Keys](https://openrouter.ai/keys)
2. Click "Create Key"
3. Give it a name (e.g., "Logging Monitor")
4. Copy the generated key (starts with `sk-or-v1-...`)

### Step 3: Add Credits (Optional)
- Free models work without credits
- For premium models, add credits at [Account](https://openrouter.ai/account)
- Minimum: $5

## Configuration

### 1. Update .env file
```bash
# Edit .env
nano .env

# Add your API key
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

### 2. Choose Your Model (Optional)

By default, we use the **free Llama 3.1 8B** model. You can change it:

```bash
# In .env file
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

#### Popular Free Models:
```bash
# Llama 3.1 8B (default - fast, good quality)
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free

# Llama 3.1 70B (slower, better quality)
OPENROUTER_MODEL=meta-llama/llama-3.1-70b-instruct:free

# Mistral 7B (fast, efficient)
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free

# Phi-3 Medium (Microsoft, good for analysis)
OPENROUTER_MODEL=microsoft/phi-3-medium-128k-instruct:free
```

#### Premium Models (require credits):
```bash
# GPT-4 Turbo (~$0.01 per request)
OPENROUTER_MODEL=openai/gpt-4-turbo

# Claude 3.5 Sonnet (~$0.015 per request)
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Gemini Pro (~$0.0005 per request)
OPENROUTER_MODEL=google/gemini-pro-1.5
```

See all models at: https://openrouter.ai/models

## Testing Your Setup

### 1. Start the server
```bash
npm run dev
```

### 2. Check if API key is working
```bash
curl http://localhost:3000/ai/status
```

Should return:
```json
{
  "isRunning": true,
  ...
}
```

### 3. Test AI analysis
```bash
# Generate some traffic first
for i in {1..10}; do curl http://localhost:3000/; done

# Wait 2 minutes for logs to propagate
sleep 120

# Test AI analysis
curl http://localhost:3000/ai/logs/analyze
```

## Cost Comparison

### Free Models (No Cost!)
- **Llama 3.1 8B**: $0.00 per request ✅
- **Mistral 7B**: $0.00 per request ✅
- **Phi-3 Medium**: $0.00 per request ✅

**Perfect for development and moderate production use!**

### Premium Models (Pay-as-you-go)
Running every 5 minutes = ~288 requests/day

| Model | Per Request | Daily Cost | Monthly Cost |
|-------|-------------|------------|--------------|
| Llama 3.1 8B (free) | $0.00 | $0.00 | $0.00 |
| Gemini Pro | ~$0.0005 | ~$0.14 | ~$4.32 |
| GPT-4 Turbo | ~$0.01 | ~$2.88 | ~$86.40 |
| Claude 3.5 Sonnet | ~$0.015 | ~$4.32 | ~$129.60 |

**Recommendation**: Start with free models, upgrade only if needed!

## Model Selection Guide

### For Development
✅ **Llama 3.1 8B (free)** - Fast, free, good enough

### For Production (Low Budget)
✅ **Llama 3.1 70B (free)** - Better quality, still free

### For Production (High Quality)
✅ **Gemini Pro** - Best value for money (~$4/month)
✅ **GPT-4 Turbo** - Excellent quality (~$86/month)
✅ **Claude 3.5 Sonnet** - Best reasoning (~$130/month)

## Troubleshooting

### Error: "Invalid API key"
- Check your API key in .env
- Make sure it starts with `sk-or-v1-`
- Verify at https://openrouter.ai/keys

### Error: "Insufficient credits"
- You're using a premium model without credits
- Either:
  - Switch to a free model (add `:free` suffix)
  - Add credits at https://openrouter.ai/account

### Error: "Model not found"
- Check model name at https://openrouter.ai/models
- Make sure spelling is exact
- Some models require credits

### Slow responses
- Free models can be slower during peak times
- Consider using a premium model
- Or use a smaller free model (8B instead of 70B)

## Advanced Configuration

### Rate Limiting
OpenRouter has built-in rate limits:
- Free models: ~20 requests/minute
- Premium models: Higher limits

If you hit limits, adjust `ANALYSIS_INTERVAL_MINUTES` in .env:
```bash
# Analyze every 10 minutes instead of 5
ANALYSIS_INTERVAL_MINUTES=10
```

### Model Fallback
You can implement fallback logic in `config/openrouter.js`:
```javascript
const MODELS = [
  "meta-llama/llama-3.1-8b-instruct:free",  // Try free first
  "google/gemini-pro-1.5",                   // Fallback to premium
];
```

### Custom Headers
Already configured in `config/openrouter.js`:
```javascript
defaultHeaders: {
  "HTTP-Referer": process.env.YOUR_SITE_URL,
  "X-Title": process.env.YOUR_SITE_NAME,
}
```

This helps OpenRouter track usage and provide better analytics.

## Benefits of OpenRouter

✅ **Multiple models** - Switch between models easily
✅ **Free options** - Start without any cost
✅ **No vendor lock-in** - Change models anytime
✅ **Unified API** - Same code works for all models
✅ **Pay-as-you-go** - No monthly subscriptions
✅ **Transparent pricing** - See costs upfront
✅ **Good documentation** - Easy to use

## Next Steps

1. ✅ Get API key from OpenRouter
2. ✅ Add to .env file
3. ✅ Start server: `npm run dev`
4. ✅ Test with: `npm run test:ai`
5. ✅ Monitor costs at: https://openrouter.ai/activity
6. ✅ Adjust model based on needs

---

**Happy analyzing with OpenRouter! 🚀**
