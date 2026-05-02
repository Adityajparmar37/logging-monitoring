# Example AI Responses

This document shows example responses from the AI endpoints to help you understand what to expect.

## Log Analysis Response

**Request:**
```bash
curl http://localhost:3000/ai/logs/analyze?lookback=15
```

**Response:**
```json
{
  "summary": "The application is functioning normally with moderate activity. The /slow endpoint is experiencing expected delays due to heavy task processing. No critical errors detected in the analyzed period.",
  "errors": [
    {
      "pattern": "No significant error patterns detected",
      "frequency": 0,
      "severity": "none"
    }
  ],
  "anomalies": [],
  "recommendations": [
    "Consider caching results for the /slow endpoint if the heavy task produces deterministic results",
    "Monitor the /slow endpoint response times to ensure they stay within acceptable limits",
    "Implement request queuing if the /slow endpoint receives high concurrent traffic"
  ],
  "severity": "low",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "logCount": 45,
  "timeRange": "15 minutes"
}
```

## Log Analysis with Anomalies

**Response:**
```json
{
  "summary": "Multiple error patterns detected. The application experienced several 500 errors on the /slow endpoint, indicating potential timeout or resource exhaustion issues.",
  "errors": [
    {
      "pattern": "Error occurred in slow endpoint",
      "frequency": 12,
      "severity": "high",
      "message": "Task timeout exceeded"
    },
    {
      "pattern": "Database connection failed",
      "frequency": 3,
      "severity": "critical"
    }
  ],
  "anomalies": [
    {
      "type": "error_spike",
      "description": "Unusual increase in error rate (12 errors in 15 minutes vs. typical 1-2)",
      "timestamp": "2024-01-15T10:25:00.000Z"
    },
    {
      "type": "endpoint_failure",
      "description": "/slow endpoint failing consistently",
      "affectedEndpoint": "/slow"
    }
  ],
  "recommendations": [
    "URGENT: Investigate /slow endpoint - high failure rate detected",
    "Check database connection pool settings",
    "Implement circuit breaker pattern for /slow endpoint",
    "Add timeout configuration for heavy tasks",
    "Set up alerting for error rate thresholds"
  ],
  "severity": "critical",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "logCount": 67,
  "timeRange": "15 minutes"
}
```

## Anomalies List

**Request:**
```bash
curl http://localhost:3000/ai/logs/anomalies?limit=5
```

**Response:**
```json
{
  "anomalies": [
    {
      "timestamp": "2024-01-15T10:30:00.000Z",
      "anomalies": [
        {
          "type": "error_spike",
          "description": "Unusual increase in error rate",
          "severity": "high"
        }
      ],
      "severity": "high"
    },
    {
      "timestamp": "2024-01-15T10:25:00.000Z",
      "anomalies": [
        {
          "type": "slow_response",
          "description": "Response times 3x higher than baseline",
          "severity": "medium"
        }
      ],
      "severity": "medium"
    }
  ],
  "count": 2,
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

## Performance Analysis Response

**Request:**
```bash
curl http://localhost:3000/ai/performance/analyze
```

**Response:**
```json
{
  "summary": "Overall application performance is good. The /slow endpoint shows expected high response times due to heavy processing. Other endpoints are performing within normal parameters.",
  "bottlenecks": [
    {
      "endpoint": "/slow",
      "issue": "High average response time (1850ms)",
      "impact": "medium",
      "recommendation": "Optimize heavy task processing or implement async processing"
    }
  ],
  "recommendations": [
    "Consider implementing caching for frequently accessed data",
    "The /slow endpoint could benefit from background job processing",
    "Monitor memory usage during peak traffic",
    "Implement request queuing for resource-intensive endpoints",
    "Consider horizontal scaling if traffic increases by 50%"
  ],
  "resourceUtilization": {
    "assessment": "Normal",
    "details": "CPU and memory usage within acceptable ranges. No resource exhaustion detected."
  },
  "scalingAdvice": "Current infrastructure is adequate for current load. Consider scaling when request rate exceeds 1000 req/min or when /slow endpoint queue depth exceeds 10.",
  "performanceScore": 78,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "metricsSnapshot": {
    "requestDuration": [
      {
        "labels": { "method": "GET", "route": "/", "status": "200" },
        "value": 12.5
      },
      {
        "labels": { "method": "GET", "route": "/slow", "status": "200" },
        "value": 1850.3
      },
      {
        "labels": { "method": "GET", "route": "/metrics", "status": "200" },
        "value": 8.2
      }
    ],
    "requestCount": [
      {
        "labels": { "method": "GET", "route": "/", "status": "200" },
        "value": 145
      },
      {
        "labels": { "method": "GET", "route": "/slow", "status": "200" },
        "value": 23
      }
    ],
    "systemMetrics": {
      "process_cpu_user_seconds_total": 2.5,
      "process_resident_memory_bytes": 45678912,
      "nodejs_heap_size_used_bytes": 23456789
    }
  }
}
```

## Performance Recommendations

**Request:**
```bash
curl http://localhost:3000/ai/performance/recommendations
```

**Response:**
```json
{
  "recommendations": [
    "Optimize /slow endpoint - current avg response time is 1850ms",
    "Implement caching strategy for frequently accessed data",
    "Consider async processing for heavy tasks",
    "Add request queuing to prevent resource exhaustion",
    "Monitor and optimize database queries",
    "Implement connection pooling if not already in use"
  ],
  "performanceScore": 78,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Bottlenecks Identification

**Request:**
```bash
curl http://localhost:3000/ai/performance/bottlenecks
```

**Response:**
```json
{
  "bottlenecks": [
    {
      "type": "slow_endpoint",
      "endpoint": "/slow",
      "avgResponseTime": "1850.30ms",
      "severity": "high",
      "recommendation": "Optimize /slow endpoint - current avg response time is 1850.30ms"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "totalBottlenecks": 1
}
```

## Performance Forecast

**Request:**
```bash
curl http://localhost:3000/ai/performance/forecast
```

**Response:**
```json
{
  "currentScore": 78,
  "averageScore": "76.50",
  "trend": "improving",
  "prediction": "Performance is improving over time",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response (Insufficient Data):**
```json
{
  "status": "insufficient_data",
  "message": "Need more data points for forecasting",
  "dataPoints": 3
}
```

## Performance History

**Request:**
```bash
curl http://localhost:3000/ai/performance/history?limit=5
```

**Response:**
```json
{
  "history": [
    {
      "timestamp": "2024-01-15T10:00:00.000Z",
      "score": 75,
      "bottlenecks": 1
    },
    {
      "timestamp": "2024-01-15T10:05:00.000Z",
      "score": 76,
      "bottlenecks": 1
    },
    {
      "timestamp": "2024-01-15T10:10:00.000Z",
      "score": 77,
      "bottlenecks": 1
    },
    {
      "timestamp": "2024-01-15T10:15:00.000Z",
      "score": 78,
      "bottlenecks": 1
    },
    {
      "timestamp": "2024-01-15T10:20:00.000Z",
      "score": 78,
      "bottlenecks": 1
    }
  ],
  "count": 5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## AI Monitor Status

**Request:**
```bash
curl http://localhost:3000/ai/status
```

**Response:**
```json
{
  "isRunning": true,
  "lastLogAnalysis": {
    "summary": "Application functioning normally...",
    "severity": "low",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "logCount": 45
  },
  "lastPerformanceAnalysis": {
    "summary": "Overall performance is good...",
    "performanceScore": 78,
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "anomalyCount": 2
}
```

## Manual Analysis Trigger

**Request:**
```bash
curl -X POST http://localhost:3000/ai/analyze
```

**Response:**
```json
{
  "message": "Analysis completed",
  "result": {
    "logAnalysis": {
      "summary": "...",
      "severity": "low",
      "timestamp": "2024-01-15T10:35:00.000Z"
    },
    "perfAnalysis": {
      "summary": "...",
      "performanceScore": 78,
      "timestamp": "2024-01-15T10:35:00.000Z"
    },
    "timestamp": "2024-01-15T10:35:00.000Z"
  }
}
```

## Error Responses

### AI Monitor Not Initialized

**Response:**
```json
{
  "error": "AI Monitor not initialized",
  "message": "Please check your GEMINI_API_KEY configuration"
}
```

### No Data Available

**Response:**
```json
{
  "status": "no_data",
  "message": "No logs available for analysis",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Analysis Error

**Response:**
```json
{
  "status": "error",
  "message": "AI Analysis failed: API quota exceeded",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### No Previous Analysis

**Response:**
```json
{
  "message": "No analysis available yet. Trigger analysis first.",
  "endpoint": "/ai/logs/analyze"
}
```

## Console Output Examples

### Successful Analysis
```
[2024-01-15T10:30:00.000Z] Running AI analysis...
Log Analysis: completed
Performance Analysis: completed
```

### Critical Issues Detected
```
[2024-01-15T10:30:00.000Z] Running AI analysis...
Log Analysis: completed
Performance Analysis: completed
⚠️  CRITICAL ISSUES DETECTED IN LOGS!
Anomalies: [
  {
    type: 'error_spike',
    description: 'Unusual increase in error rate'
  }
]
```

### Poor Performance Detected
```
[2024-01-15T10:30:00.000Z] Running AI analysis...
Log Analysis: completed
Performance Analysis: completed
⚠️  POOR PERFORMANCE DETECTED!
Score: 42
```

## Tips for Interpreting Results

### Severity Levels
- **low**: Normal operation, minor issues
- **medium**: Attention needed, non-critical
- **high**: Significant issues, investigate soon
- **critical**: Immediate action required

### Performance Scores
- **90-100**: Excellent performance
- **70-89**: Good performance
- **50-69**: Fair performance, optimization recommended
- **30-49**: Poor performance, action needed
- **0-29**: Critical performance issues

### Response Times
- **< 100ms**: Excellent
- **100-500ms**: Good
- **500-1000ms**: Acceptable for complex operations
- **> 1000ms**: Slow, optimization recommended
- **> 2000ms**: Very slow, immediate optimization needed

---

**These examples show the rich insights you'll get from the AI integration!**
