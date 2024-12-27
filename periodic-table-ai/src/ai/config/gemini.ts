import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_GOOGLE_AI_API_KEY environment variable');
}

export const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);
export const defaultModel = 'gemini-pro';   