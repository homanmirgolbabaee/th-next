'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Theme = 'modern' | 'cyberpunk' | 'retro';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  getThemeStyles: () => ThemeStyles;
  isCyberpunk: boolean;
  isRetro: boolean;
}

interface ThemeStyles {
  input: string;
  button: string;
  container: string;
  text: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('modern');

  // Use useCallback to memoize the function
  const toggleTheme = useCallback(() => {
    setTheme(current => {
      switch (current) {
        case 'modern':
          return 'cyberpunk';
        case 'cyberpunk':
          return 'retro';
        default:
          return 'modern';
      }
    });
  }, []);

  // Memoize getThemeStyles
  const getThemeStyles = useCallback(() => ({
    input: theme === 'cyberpunk'
      ? 'bg-black/50 text-[#00ff00] font-mono border border-[#00ff00]/30 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]/50 placeholder-[#00ff00]/30'
      : theme === 'retro'
      ? 'bg-gray-800 text-white border-4 border-gray-900 focus:border-gray-700 font-[Press_Start_2P] text-sm placeholder-gray-400 retro-input'
      : 'bg-gray-800/50 text-gray-100 border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500',
    
    button: theme === 'cyberpunk'
      ? 'bg-[#001100] hover:bg-[#002200] border border-[#00ff00]/30 text-[#00ff00]'
      : theme === 'retro'
      ? 'retro-button text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg',
    
    container: theme === 'cyberpunk'
      ? 'bg-black border-[#00ff00]/30'
      : theme === 'retro'
      ? 'bg-gray-800 retro-container'
      : 'bg-gray-900/95 backdrop-blur-md border-gray-700/50',
    
    text: theme === 'cyberpunk'
      ? 'text-[#00ff00] font-mono'
      : theme === 'retro'
      ? 'retro-text'
      : 'text-gray-100'
  }), [theme]);

  const value = {
    theme,
    toggleTheme,
    getThemeStyles,
    isCyberpunk: theme === 'cyberpunk',
    isRetro: theme === 'retro'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}