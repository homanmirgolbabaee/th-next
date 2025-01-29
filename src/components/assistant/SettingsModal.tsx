'use client';

import { useTheme } from './ThemeContext';
import Modal from './Modal';
import { Volume2, Mic, Globe, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';

  const settings = [
    {
      icon: <Volume2 className="w-5 h-5" />,
      title: 'Text-to-Speech',
      description: 'Enable voice responses',
      enabled: true
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: 'Voice Input',
      description: 'Enable voice commands',
      enabled: true
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Language',
      description: 'Set interface language',
      value: 'English'
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: 'Model',
      description: 'Select AI model',
      value: 'GPT-4'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        {settings.map((setting, index) => (
          <div
            key={index}
            className={`
              flex items-center justify-between p-4 rounded-lg
              ${isCyberpunk
                ? 'bg-[#001100] border border-[#00ff00]/30'
                : 'bg-gray-800/50'}
            `}
          >
            <div className="flex items-center space-x-4">
              {setting.icon}
              <div>
                <div className={`font-medium ${isCyberpunk ? 'text-[#00ff00]' : 'text-gray-200'}`}>
                  {setting.title}
                </div>
                <div className={`text-sm ${isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'}`}>
                  {setting.description}
                </div>
              </div>
            </div>
            
            {'enabled' in setting ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={setting.enabled}
                />
                <div className={`
                  w-11 h-6 rounded-full peer 
                  ${isCyberpunk
                    ? 'bg-[#002200] peer-checked:bg-[#00ff00]/30'
                    : 'bg-gray-700 peer-checked:bg-blue-600'}
                  peer-checked:after:translate-x-full 
                  after:content-[''] 
                  after:absolute 
                  after:top-[2px] 
                  after:left-[2px] 
                  after:bg-white 
                  after:rounded-full 
                  after:h-5 
                  after:w-5 
                  after:transition-all
                  after:duration-300
                `}></div>
              </label>
            ) : (
              <select className={`
                px-3 py-1 rounded transition-colors
                ${isCyberpunk
                  ? 'bg-black border border-[#00ff00]/30 text-[#00ff00] focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]'
                  : 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}
              `}>
                <option>{setting.value}</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}