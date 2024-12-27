export interface AgentResponse {
    content: string;
    sources?: string[];
    error?: string;
  }
  
  export interface Agent {
    query(input: unknown): Promise<AgentResponse>;
  }
  
  export interface ElementQuery {
    element: string;
    aspect?: string;
    context?: string;
  }