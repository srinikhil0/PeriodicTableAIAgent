"use client";

interface ElementCardProps {
  symbol: string;
  atomicNumber: number;
  name: string;
  atomicMass: number;
  category: string;
  onClick: () => void;
}

export default function ElementCard({
  symbol,
  atomicNumber,
  name,
  atomicMass,
  category,
  onClick
}: ElementCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full aspect-square p-1 rounded-lg transition-all hover:scale-105 
                 ${getCategoryColor(category)} flex flex-col justify-between`}
    >
      <div className="text-xs text-right">{atomicNumber}</div>
      <div className="text-base md:text-xl font-bold">{symbol}</div>
      <div className="text-[0.6rem] md:text-xs truncate">{name}</div>
      <div className="text-[0.6rem] md:text-xs">{atomicMass.toFixed(1)}</div>
    </button>
  );
}

function getCategoryColor(category: string): string {
  const categories = {
    'nonmetal': 'bg-green-500 hover:bg-green-600 text-white',
    'noble gas': 'bg-purple-500 hover:bg-purple-600 text-white',
    'alkali metal': 'bg-red-500 hover:bg-red-600 text-white',
    'alkaline earth metal': 'bg-orange-500 hover:bg-orange-600 text-white',
    'metalloid': 'bg-teal-500 hover:bg-teal-600 text-white',
    'halogen': 'bg-yellow-500 hover:bg-yellow-600 text-black',
    'transition metal': 'bg-blue-500 hover:bg-blue-600 text-white',
    'post-transition metal': 'bg-indigo-500 hover:bg-indigo-600 text-white',
    'lanthanide': 'bg-pink-500 hover:bg-pink-600 text-white',
    'actinide': 'bg-rose-500 hover:bg-rose-600 text-white'
  } as const;

  return categories[category as keyof typeof categories] || 'bg-gray-500 hover:bg-gray-600 text-white';
}