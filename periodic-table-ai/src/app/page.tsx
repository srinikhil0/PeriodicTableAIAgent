import PeriodicTable from '@/app/components/periodic-table/PeriodicTable';
import ChemistryChat from '@/app/components/chat/ChemistryChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Periodic Table AI
        </h1>
      </header>

      <div className="relative flex flex-col h-[calc(100vh-120px)]">
        {/* Main content area with padding for chat window */}
        <div className="flex-1 p-4 md:p-8 pb-[650px] overflow-y-auto">
          <PeriodicTable />
        </div>

        {/* Fixed chat window */}
        <div className="fixed bottom-0 right-0 w-full md:w-[600px] h-[600px] z-50">
          <ChemistryChat />
        </div>
      </div>
    </main>
  );
}