import { GoogleGenerativeAI } from '@google/generative-ai';

export const aiClient = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
