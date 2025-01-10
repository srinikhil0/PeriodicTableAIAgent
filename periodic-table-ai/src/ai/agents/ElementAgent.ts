import { Agent, AgentResponse } from '../types/agent';
import { genAI, defaultModel } from '../config/gemini';
import { Element } from '@/types/elements';
// import { GoogleGenerativeAIError } from '@google/generative-ai';
import { RSCClient } from '@/api/rsc/client';

export class ElementAgent implements Agent {
  private rscClient: RSCClient;

  constructor() {
    this.rscClient = new RSCClient(process.env.RSC_API_KEY!);
  }

  async query(input: Element): Promise<AgentResponse> {
    try {
      // Get additional data from RSC
      const rscData = await this.rscClient.getElementData(input.symbol);
      
      const model = genAI.getGenerativeModel({ model: defaultModel });

      const systemPrompt = `As a chemistry expert with access to Royal Society of Chemistry data, explain ${input.name} (${input.symbol}):

Key Properties:
- Atomic number: ${input.atomicNumber}
- Atomic mass: ${input.atomicMass}
- Category: ${input.category}
- Electron configuration: ${input.electronConfiguration}

RSC Additional Data:
${JSON.stringify(rscData, null, 2)}

Please provide a comprehensive explanation including:
- Physical and chemical properties
- Common compounds and reactions
- Industrial applications
- Environmental impact
- Recent research developments
- Historical significance

Use the RSC data to ensure accuracy while keeping the explanation engaging and educational.`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text()
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
        sources: [
          `Element: ${input.name}`,
          'Royal Society of Chemistry Database'
        ]
      };

    } catch (error) {
      console.error('ElementAgent error:', error);
      return {
        content: 'Unable to process the request at this time.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}