"use client";

import { useState } from 'react';
import { AgentOrchestrator } from '@/ai/agents/AgentOrchestrator';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'element' | 'formula' | 'reaction';
}

export default function ChemistryChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const orchestrator = new AgentOrchestrator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Basic command detection
      if (input.startsWith('/formula ')) {
        const formula = input.replace('/formula ', '');
        const response = await orchestrator.analyzeFormula(formula);
        addAssistantMessage(response.content, 'formula');
      } else if (input.startsWith('/reaction ')) {
        const [reactants, products] = input.replace('/reaction ', '').split('->');
        const response = await orchestrator.explainReaction(
          reactants.split('+').map(r => r.trim()),
          products.split('+').map(p => p.trim())
        );
        addAssistantMessage(response.content, 'reaction');
      } else {
        // Default to general chemistry help
        addAssistantMessage("Please use /formula or /reaction commands. Example:\n/formula H2O\n/reaction H2 + O2 -> H2O");
      }
    } catch (err) {
      console.error('Chemistry chat error:', err);
      addAssistantMessage("Sorry, I couldn't process that request. Please try again.");
    }

    setIsLoading(false);
  };

  const addAssistantMessage = (content: string, type?: 'element' | 'formula' | 'reaction') => {
    setMessages(prev => [...prev, { role: 'assistant', content, type }]);
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 shadow-xl rounded-t-lg flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chemistry Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-200 dark:bg-gray-700'
            } rounded-lg p-3 max-w-[80%]`}
          >
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex space-x-2 items-center text-gray-500">
            <div className="animate-bounce">●</div>
            <div className="animate-bounce delay-100">●</div>
            <div className="animate-bounce delay-200">●</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type /formula or /reaction..."
            className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}