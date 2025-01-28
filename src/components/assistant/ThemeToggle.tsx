'use client';

import { Monitor, Terminal } from 'lucide-react';
import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';

  return (
    <div className={`
      fixed top-4 right-4 z-50
      ${isCyberpunk 
        ? 'border border-[#00ff00]/30 bg-black shadow-[0_0_10px_rgba(0,255,0,0.2)]' 
        : 'bg-white/10 backdrop-blur-md shadow-lg border border-white/20'
      } rounded-full p-1 transition-all duration-300
    `}>
      <button
        onClick={toggleTheme}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full
          transition-all duration-500
          ${isCyberpunk 
            ? 'text-[#00ff00] hover:bg-[#00ff00]/10' 
            : 'text-gray-200 hover:bg-white/10'
          }
        `}
      >
        <span className={`
          transition-all duration-300
          ${isCyberpunk ? 'font-mono text-sm' : 'font-medium'}
        `}>
          {isCyberpunk ? 'SWITCH_MODE' : 'Switch Mode'}
        </span>
        {isCyberpunk ? (
          <Terminal className="w-4 h-4" />
        ) : (
          <Monitor className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}