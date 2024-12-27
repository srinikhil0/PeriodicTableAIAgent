import { Agent, AgentResponse } from '../types/agent';
import { genAI, defaultModel } from '../config/gemini';
import { GoogleGenerativeAIError } from '@google/generative-ai';

interface ReactionQuery {
  reactants: string[];
  products: string[];
}

export class ReactionAgent implements Agent {
  async query(input: ReactionQuery): Promise<AgentResponse> {
    try {
      const model = genAI.getGenerativeModel({ model: defaultModel });

      const systemPrompt = `As a friendly chemistry tutor, explain this reaction in an engaging way:
Reactants: ${input.reactants.join(' + ')}
Products: ${input.products.join(' + ')}

Help the student understand:
- What kind of reaction is happening here?
- How do the molecules interact?
- Where would we see this in real life?
- What makes this reaction interesting?

Keep it conversational while being scientifically accurate, like explaining to a curious student.`;

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
          sources: [`Reaction: ${input.reactants.join(' + ')} → ${input.products.join(' + ')}`]
        };

      } catch (apiError: unknown) {
        if (apiError instanceof GoogleGenerativeAIError) {
          return {
            content: 'Currently unable to analyze the reaction. Please try again later.',
            error: 'API_ERROR'
          };
        }
        throw apiError;
      }
    } catch (error) {
      console.error('ReactionAgent error:', error);
      return {
        content: 'Unable to process the reaction analysis.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
