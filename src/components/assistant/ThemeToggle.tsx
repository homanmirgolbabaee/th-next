'use client';

import { Monitor, Terminal, Gamepad2 } from 'lucide-react';
import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getThemeStyles = () => {
    switch (theme) {
      case 'cyberpunk':
        return {
          containerClass: 'border-[#00ff00]/30 bg-black shadow-[0_0_10px_rgba(0,255,0,0.2)]',
          buttonClass: 'text-[#00ff00] hover:bg-[#00ff00]/10',
          textClass: 'font-mono text-sm',
          text: 'SWITCH_MODE'
        };
      case 'retro':
        return {
          containerClass: 'border-4 border-gray-800 bg-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] retro-border',
          buttonClass: 'text-white hover:bg-gray-600 retro-text',
          textClass: 'font-[Press_Start_2P] text-xs',
          text: 'CHANGE THEME'
        };
      default:
        return {
          containerClass: 'bg-white/10 backdrop-blur-md shadow-lg border border-white/20',
          buttonClass: 'text-gray-200 hover:bg-white/10',
          textClass: 'font-medium',
          text: 'Switch Mode'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <>
      {theme === 'retro' && (
        <style jsx global>{`
          .retro-border {
            image-rendering: pixelated;
            box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
            position: relative;
          }
          
          .retro-border::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.1),
              rgba(0, 0, 0, 0.1) 1px,
              transparent 1px,
              transparent 2px
            );
            pointer-events: none;
          }
          
          .retro-text {
            text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8);
          }

          .pixel-corners {
            clip-path: polygon(
              0 4px,
              4px 4px,
              4px 0,
              calc(100% - 4px) 0,
              calc(100% - 4px) 4px,
              100% 4px,
              100% calc(100% - 4px),
              calc(100% - 4px) calc(100% - 4px),
              calc(100% - 4px) 100%,
              4px 100%,
              4px calc(100% - 4px),
              0 calc(100% - 4px)
            );
          }
        `}</style>
      )}

      <div className={`
        fixed top-4 right-4 z-50 transition-all duration-300
        ${styles.containerClass}
        ${theme === 'retro' ? 'pixel-corners p-2' : 'rounded-full p-1'}
      `}>
        <button
          onClick={toggleTheme}
          className={`
            relative flex items-center gap-2 px-4 py-2
            ${theme === 'retro' ? '' : 'rounded-full'}
            transition-all duration-500
            ${styles.buttonClass}
          `}
        >
          <span className={styles.textClass}>
            {styles.text}
          </span>
          {theme === 'cyberpunk' ? (
            <Terminal className="w-4 h-4" />
          ) : theme === 'retro' ? (
            <Gamepad2 className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </button>
      </div>
    </>
  );
}