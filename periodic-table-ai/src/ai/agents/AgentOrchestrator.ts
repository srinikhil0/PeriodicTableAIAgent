import { AgentResponse } from '../types/agent';
import { ElementAgent } from './ElementAgent';
import { FormulaAgent } from './FormulaAgent';
import { ReactionAgent } from './ReactionAgent';
import { Element } from '@/types/elements';

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
}
