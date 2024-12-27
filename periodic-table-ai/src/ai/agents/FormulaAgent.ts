import { Agent, AgentResponse } from '../types/agent';
import { genAI, defaultModel } from '../config/gemini';
import { GoogleGenerativeAIError } from '@google/generative-ai';

interface FormulaQuery {
  formula: string;
}

export class FormulaAgent implements Agent {
  async query(input: FormulaQuery): Promise<AgentResponse> {
    try {
      const model = genAI.getGenerativeModel({ model: defaultModel });

      const systemPrompt = `Analyze the chemical formula ${input.formula} and provide:

1. Molecular composition
2. Structure description
3. Common name (if applicable)
4. Basic properties
5. Common applications

Keep the response educational and factual.`;

      try {
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        let text = response.text();

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
          sources: [`Formula: ${input.formula}`]
        };

      } catch (apiError: unknown) {
        if (apiError instanceof GoogleGenerativeAIError) {
          return {
            content: 'Currently unable to analyze the formula. Please try again later.',
            error: 'API_ERROR'
          };
        }
        throw apiError;
      }
    } catch (error) {
      console.error('FormulaAgent error:', error);
      return {
        content: 'Unable to process the formula analysis.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
