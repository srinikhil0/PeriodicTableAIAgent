import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '18': 'repeat(18, minmax(0, 1fr))',
      },
      aspectRatio: {
        'square': '1',
      },
      minWidth: {
        'periodic-table': '1200px',
      },
      backgroundColor: {
        'element': {
          'nonmetal': '#4ade80',
          'noble-gas': '#a855f7',
          'alkali-metal': '#ef4444',
          'alkaline-earth-metal': '#f97316',
          'metalloid': '#14b8a6',
          'halogen': '#eab308',
          'transition-metal': '#3b82f6',
          'post-transition-metal': '#6366f1',
          'lanthanide': '#ec4899',
          'actinide': '#f43f5e',
        },
      },
    },
  },
  darkMode: 'media',
  safelist: [
    // Add color classes that might be dynamically generated
    {
      pattern: /bg-(green|purple|red|orange|teal|yellow|blue|indigo|pink|rose)-(500|600)/,
    },
  ],
};

export default config;