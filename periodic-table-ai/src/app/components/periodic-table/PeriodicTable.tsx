"use client";

import { useState, useEffect } from 'react';
import { getAllElements } from '@/utils/firebase';
import ElementCard from './ElementCard';
import { Element } from '@/types/elements';
import { ElementAgent } from '@/ai/agents/ElementAgent';

export default function PeriodicTable() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    async function fetchElements() {
      try {
        const elementData = await getAllElements();
        setElements(elementData);
      } catch (error) {
        console.error('Error fetching elements:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchElements();
  }, []);

  // Close modal when clicking outside or on close button
  const handleModalClose = () => {
    setSelectedElement(null);
  };

  // Stop propagation for modal content clicks
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const fetchAIInsight = async (element: Element) => {
    setInsightLoading(true);
    const agent = new ElementAgent();
    const response = await agent.query(element);
    setAiInsight(response.content);
    setInsightLoading(false);
  };

  const handleElementSelect = (element: Element) => {
    setSelectedElement(element);
    setAiInsight('');
    fetchAIInsight(element);
  };

  if (loading) {
    return <div className="text-center p-8">Loading periodic table...</div>;
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-18 gap-1">
            {Array(7).fill(null).map((_, period) => (
              Array(18).fill(null).map((_, group) => {
                const element = elements.find(
                  e => e.period === period + 1 && e.group === group + 1
                );
                return (
                  <div key={`${period}-${group}`} className="aspect-square">
                    {element && (
                      <ElementCard
                        {...element}
                        onClick={() => handleElementSelect(element)}
                      />
                    )}
                  </div>
                );
              })
            ))}
          </div>

          <div className="mt-4">
            {/* Lanthanides Row */}
            <div className="flex gap-1">
              <div className="w-24 flex items-center pl-2 text-sm">
                <span>57-71</span>
              </div>
              <div className="flex-1">
                <div className="flex gap-1">
                  {elements
                    .filter(e => e.atomicNumber >= 57 && e.atomicNumber <= 71)
                    .sort((a, b) => a.atomicNumber - b.atomicNumber)
                    .map(element => (
                      <div key={element.atomicNumber} className="flex-1 aspect-square">
                        <ElementCard
                          {...element}
                          onClick={() => handleElementSelect(element)}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Actinides Row */}
            <div className="flex gap-1 mt-1">
              <div className="w-24 flex items-center pl-2 text-sm">
                <span>89-103</span>
              </div>
              <div className="flex-1">
                <div className="flex gap-1">
                  {elements
                    .filter(e => e.atomicNumber >= 89 && e.atomicNumber <= 103)
                    .sort((a, b) => a.atomicNumber - b.atomicNumber)
                    .map(element => (
                      <div key={element.atomicNumber} className="flex-1 aspect-square">
                        <ElementCard
                          {...element}
                          onClick={() => handleElementSelect(element)}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedElement && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col relative"
            onClick={handleModalContentClick}
          >
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Element Info Section - Fixed Height */}
            <div className="flex-none">
              <h2 className="text-2xl font-bold mb-4">{selectedElement.name}</h2>
              <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                <div>
                  <p className="text-sm font-medium">Atomic Number</p>
                  <p className="font-mono">{selectedElement.atomicNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Symbol</p>
                  <p className="font-mono">{selectedElement.symbol}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Atomic Mass</p>
                  <p className="font-mono">{selectedElement.atomicMass.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="font-mono">{selectedElement.category}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Electron Configuration</p>
                  <p className="font-mono">{selectedElement.electronConfiguration}</p>
                </div>
              </div>
            </div>

            {/* AI Insights Section - Scrollable */}
            <div className="mt-6 border-t pt-4 flex-1 overflow-hidden">
              <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
              <div className="overflow-y-auto max-h-[40vh] pr-2">
                {insightLoading ? (
                  <div className="animate-pulse text-gray-500">Loading insights...</div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-line text-base leading-relaxed">
                      {aiInsight.split('\n').map((line, index) => (
                        <div key={index} className={`
                          ${line.includes(':') ? 'text-lg font-semibold mt-4 mb-2' : ''}
                          ${line.startsWith('•') ? 'pl-4 mb-1' : ''}
                        `}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}