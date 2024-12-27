import { Agent, AgentResponse } from '../types/agent';
import { genAI, defaultModel } from '../config/gemini';
import { Element } from '@/types/elements';
import { GoogleGenerativeAIError } from '@google/generative-ai';

export class ElementAgent implements Agent {
  async query(input: Element): Promise<AgentResponse> {
    try {
      const model = genAI.getGenerativeModel({ model: defaultModel });

      const systemPrompt = `As an enthusiastic chemistry teacher, tell me about ${input.name} (${input.symbol}):

Key Properties:
- Atomic number: ${input.atomicNumber}
- Atomic mass: ${input.atomicMass}
- Category: ${input.category}
- Electron configuration: ${input.electronConfiguration}

Please explain:
- What makes this element interesting?
- Where do we find it in nature and everyday life?
- How was it discovered?
- What role does it play in science and technology?

Keep the tone friendly and engaging while maintaining scientific accuracy.`;

      try {
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        let text = response.text();

        // Keep existing formatting logic
        text = text
          .replace(/[*#]/g, '')
          .replace(/\s+/g, ' ')
          .replace(/\./g, '. ')
          .replace(/\s+/g, ' ')
          .replace(/([A-Z][a-z]+):/g, '\n\n$1:\n')
          .replace(/•/g, '\n• ')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        return {
          content: text,
          sources: [`Element: ${input.name}`]
        };

      } catch (apiError: unknown) {
        if (apiError instanceof GoogleGenerativeAIError) {
          return {
            content: 'Currently unable to generate element information. Please try again later.',
            error: 'API_ERROR'
          };
        }
        throw apiError;
      }
    } catch (error) {
      console.error('ElementAgent error:', error);
      return {
        content: 'Unable to process the request at this time.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}