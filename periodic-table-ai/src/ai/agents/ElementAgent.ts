import { Agent, AgentResponse } from '../types/agent';
import { genAI, defaultModel } from '../config/gemini';
import { Element } from '@/types/elements';
// import { GoogleGenerativeAIError } from '@google/generative-ai';
import { RSCClient } from '@/api/rsc/client';

export class ElementAgent implements Agent {
  private rscClient: RSCClient | null = null;

  constructor() {
    // Try to initialize RSC client, but don't throw if key is missing
    if (process.env.NEXT_PUBLIC_RSC_API_KEY) {
      this.rscClient = new RSCClient(process.env.NEXT_PUBLIC_RSC_API_KEY);
    }
  }

  async query(input: Element): Promise<AgentResponse> {
    try {
      let rscData = {};
      // Only try to fetch RSC data if client is initialized
      if (this.rscClient) {
        try {
          rscData = await this.rscClient.getElementData(input.symbol);
        } catch (rscError) {
          console.warn('RSC API error:', rscError);
        }
      }
      
      const model = genAI.getGenerativeModel({ model: defaultModel });
      const systemPrompt = `As a chemistry expert with access to element data, explain ${input.name} (${input.symbol}):

Key Properties:
- Atomic number: ${input.atomicNumber}
- Atomic mass: ${input.atomicMass}
- Category: ${input.category}
- Electron configuration: ${input.electronConfiguration}

${this.rscClient ? 'RSC Additional Data:\n' + JSON.stringify(rscData, null, 2) : ''}

Please provide a comprehensive explanation including:
- Physical and chemical properties
- Common compounds and reactions
- Industrial applications
- Environmental impact
- Recent research developments
- Historical significance

Format the response with clear section headers and bullet points where appropriate.
Use proper spacing and line breaks between sections for readability.`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text()
        // Remove markdown formatting
        .replace(/[*#]/g, '')
        // Add proper spacing after periods
        .replace(/\./g, '.\n')
        // Format section headers
        .replace(/([A-Z][a-z]+(?: [A-Z][a-z]+)*:)/g, '\n\n$1\n')
        // Format bullet points
        .replace(/•/g, '\n• ')
        // Clean up multiple line breaks
        .replace(/\n{3,}/g, '\n\n')
        // Add extra space before section headers
        .replace(/\n([A-Z][a-z]+(?: [A-Z][a-z]+)*:)/g, '\n\n$1')
        .trim();

      return {
        content: text,
        sources: [`Element: ${input.name} (${input.symbol})`]
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