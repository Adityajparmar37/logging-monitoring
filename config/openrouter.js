const OpenAI = require("openai");
require("dotenv").config();

// Initialize Groq client using OpenAI SDK
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Default model - using Groq's available models
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "llama-3.1-70b-versatile";

async function analyzeWithAI(prompt, systemInstruction) {
  try {
    const messages = [];

    if (systemInstruction) {
      messages.push({
        role: "system",
        content: systemInstruction,
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API Error:", error.message);
    throw new Error(`AI Analysis failed: ${error.message}`);
  }
}

module.exports = {
  analyzeWithAI,
  openai,
};
