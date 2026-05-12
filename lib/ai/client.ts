import { GoogleGenerativeAI } from '@google/generative-ai';

let aiClientInstance: GoogleGenerativeAI | null = null;

export const getAIClient = (): GoogleGenerativeAI => {
  if (aiClientInstance) {
    return aiClientInstance;
  }
  
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log('[DIAGNOSTIC] Gemini key exists in lib/ai/client.ts:', !!apiKey);

  if (!apiKey) {
    console.warn('[DIAGNOSTIC] GOOGLE_GENERATIVE_AI_API_KEY is missing. Using dummy key to prevent build crash.');
    aiClientInstance = new GoogleGenerativeAI('dummy_key_for_build');
    return aiClientInstance;
  }
  
  aiClientInstance = new GoogleGenerativeAI(apiKey);
  return aiClientInstance;
};
