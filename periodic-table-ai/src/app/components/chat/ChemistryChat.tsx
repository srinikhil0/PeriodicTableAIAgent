"use client";

import { useState, useEffect } from 'react';
import { AgentOrchestrator } from '@/ai/agents/AgentOrchestrator';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'element' | 'formula' | 'reaction';
}

interface ChemistryChatProps {
  onClose: () => void;
}

export default function ChemistryChat({ onClose }: ChemistryChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const orchestrator = new AgentOrchestrator();

  useEffect(() => {
    const initialMessage = "Hi there! I'm your chemistry buddy. How can I help you today?";
    setMessages([{ role: 'assistant', content: initialMessage }]);
  }, []);

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
      if (input.includes('->') || input.includes('+')) {
        const [reactants, products] = input.split('->');
        const response = await orchestrator.explainReaction(
          reactants.split('+').map(r => r.trim()),
          products.split('+').map(p => p.trim())
        );
        addAssistantMessage(response.content, 'reaction');
      } else if (/^[A-Za-z0-9]+$/.test(input.replace(/\s/g, ''))) {
        const response = await orchestrator.analyzeFormula(input);
        addAssistantMessage(response.content, 'formula');
      } else {
        const response = await orchestrator.handleConversation(input);
        addAssistantMessage(response.content);
      }
    } catch (err) {
      console.error('Chemistry chat error:', err);
      const response = await orchestrator.handleError();
      addAssistantMessage(response.content);
    }

    setIsLoading(false);
  };

  const addAssistantMessage = (content: string, type?: 'element' | 'formula' | 'reaction') => {
    setMessages(prev => [...prev, { role: 'assistant', content, type }]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chemistry Assistant</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === 'user' 
                ? 'ml-auto bg-blue-500 text-white' 
                : 'mr-auto bg-gray-200 dark:bg-gray-700'
            } rounded-lg p-3 max-w-[80%] shadow-sm`}
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

      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type /formula or /reaction..."
            className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}