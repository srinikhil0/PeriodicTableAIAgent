import { AgentResponse } from '../types/agent';
import { ElementAgent } from './ElementAgent';
import { FormulaAgent } from './FormulaAgent';
import { ReactionAgent } from './ReactionAgent';
import { Element } from '@/types/elements';
import { genAI, defaultModel } from '../config/gemini';

export class AgentOrchestrator {
  private elementAgent: ElementAgent;
  private formulaAgent: FormulaAgent;
  private reactionAgent: ReactionAgent;

  constructor() {
    this.elementAgent = new ElementAgent();
    this.formulaAgent = new FormulaAgent();
    this.reactionAgent = new ReactionAgent();
  }

  async getElementInfo(element: Element): Promise<AgentResponse> {
    return this.elementAgent.query(element);
  }

  async analyzeFormula(formula: string): Promise<AgentResponse> {
    return this.formulaAgent.query({ formula });
  }

  async explainReaction(reactants: string[], products: string[]): Promise<AgentResponse> {
    return this.reactionAgent.query({ reactants, products });
  }

  async handleConversation(input: string): Promise<AgentResponse> {
    const model = genAI.getGenerativeModel({ model: defaultModel });
    const systemPrompt = `As a friendly chemistry tutor, respond to: "${input}"
Keep the tone conversational and engaging while guiding the discussion towards chemistry topics.`;
    
    const result = await model.generateContent(systemPrompt);
    return { content: result.response.text() };
  }

  async handleError(): Promise<AgentResponse> {
    const model = genAI.getGenerativeModel({ model: defaultModel });
    const systemPrompt = `Generate a friendly error message for a chemistry chatbot that encourages the user to try again.`;
    
    const result = await model.generateContent(systemPrompt);
    return { content: result.response.text() };
  }
}
