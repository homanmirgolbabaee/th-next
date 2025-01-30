// src/components/scheduler/SchedulerTrigger.tsx
import React, { useState } from 'react';

import { Clock } from 'lucide-react';
import SchedulerWindow from '../scheduler/SchedulerWindow';


import { Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';




export default function SchedulerTrigger() {
    const { theme } = useTheme();
    const isCyberpunk = theme === 'cyberpunk';
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
            ${isCyberpunk
              ? 'bg-black border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#001100] hover:border-[#00ff00]/60'
              : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}
          `}
        >
          <Calendar className="w-5 h-5" />
          <span>{isCyberpunk ? 'SCHEDULES' : 'Schedules'}</span>
        </button>
  
        {isOpen && <SchedulerWindow onClose={() => setIsOpen(false)} />}
      </>
    );
  }