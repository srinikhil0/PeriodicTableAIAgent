"use client";

import PeriodicTable from '@/app/components/periodic-table/PeriodicTable';
import ChemistryChat from '@/app/components/chat/ChemistryChat';
import { useState } from 'react';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Periodic Table AI
        </h1>
      </header>

      <div className="relative flex flex-col h-[calc(100vh-120px)]">
        {/* Main content area */}
        <div className="flex-1 p-4 md:p-8">
          <PeriodicTable />
        </div>

        {/* Chat window - only render when open */}
        {isChatOpen && (
          <div className="fixed right-0 top-[120px] bottom-0 w-[400px] bg-white dark:bg-gray-800 shadow-xl border-l dark:border-gray-700">
            <ChemistryChat onClose={() => setIsChatOpen(false)} />
          </div>
        )}

        {/* Chat toggle button - only show when chat is closed */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed right-0 bottom-4 bg-blue-500 text-white p-4 rounded-l-lg shadow-lg hover:bg-blue-600 transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v4H5a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Open Chat
            </span>
          </button>
        )}
      </div>
    </main>
  );
}