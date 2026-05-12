import { GoogleGenerativeAI } from '@google/generative-ai';

let aiClientInstance: GoogleGenerativeAI | null = null;

export const getAIClient = (): GoogleGenerativeAI => {
  if (aiClientInstance) {
    return aiClientInstance;
  }
  
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is missing.');
  }
  
  aiClientInstance = new GoogleGenerativeAI(apiKey);
  return aiClientInstance;
};
