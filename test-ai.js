#!/usr/bin/env node

/**
 * Quick test script for AI integration
 * Run: node test-ai.js
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3000";
const AI_BASE = `${BASE_URL}/ai`;

async function testEndpoint(name, url, method = "GET") {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   ${method} ${url}`);

    const response =
      method === "POST"
        ? await axios.post(url)
        : await axios.get(url);

    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   📊 Response:`, JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   Response:`, error.response.data);
    }
    return false;
  }
}

async function generateTraffic() {
  console.log("\n🚀 Generating traffic to create logs and metrics...");

  const endpoints = ["/", "/slow", "/metrics"];

  for (let i = 0; i < 5; i++) {
    for (const endpoint of endpoints) {
      try {
        await axios.get(`${BASE_URL}${endpoint}`);
        console.log(`   ✓ Hit ${endpoint}`);
      } catch (error) {
        console.log(`   ✗ Failed ${endpoint}`);
      }
    }
  }

  console.log("   ⏳ Waiting 2 seconds for logs to propagate...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

async function runTests() {
  console.log("=".repeat(60));
  console.log("🤖 AI Integration Test Suite");
  console.log("=".repeat(60));

  // Check if server is running
  try {
    await axios.get(BASE_URL);
    console.log("✅ Server is running");
  } catch (error) {
    console.log("❌ Server is not running. Start it with: npm run dev");
    process.exit(1);
  }

  // Generate some traffic
  await generateTraffic();

  // Test AI endpoints
  console.log("\n" + "=".repeat(60));
  console.log("Testing AI Endpoints");
  console.log("=".repeat(60));

  await testEndpoint("AI Status", `${AI_BASE}/status`);
  await testEndpoint("Log Analysis", `${AI_BASE}/logs/analyze?lookback=5`);
  await testEndpoint("Anomalies", `${AI_BASE}/logs/anomalies?limit=5`);
  await testEndpoint("Log Summary", `${AI_BASE}/logs/summary`);
  await testEndpoint(
    "Performance Analysis",
    `${AI_BASE}/performance/analyze`,
  );
  await testEndpoint(
    "Recommendations",
    `${AI_BASE}/performance/recommendations`,
  );
  await testEndpoint("Bottlenecks", `${AI_BASE}/performance/bottlenecks`);
  await testEndpoint("Forecast", `${AI_BASE}/performance/forecast`);
  await testEndpoint("History", `${AI_BASE}/performance/history?limit=10`);
  await testEndpoint("Manual Analysis", `${AI_BASE}/analyze`, "POST");

  console.log("\n" + "=".repeat(60));
  console.log("✨ Test suite completed!");
  console.log("=".repeat(60));
}

runTests().catch((error) => {
  console.error("Test suite failed:", error.message);
  process.exit(1);
});
