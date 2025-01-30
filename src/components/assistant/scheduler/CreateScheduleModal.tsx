// src/components/assistant/scheduler/CreateScheduleModal.tsx
'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Modal from '../ui/Modal';
import { Clock, AlertCircle } from 'lucide-react';
import { schedulerService } from '../../../services/schedulerService';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreated: () => void;
}

export default function CreateScheduleModal({ isOpen, onClose, onScheduleCreated }: CreateScheduleModalProps) {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';

  const [chatId, setChatId] = useState('');
  const [scheduleText, setScheduleText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convert human text to cron expression
      const cronExpression = await schedulerService.convertToCron(scheduleText);
      
      // Create the schedule
      await schedulerService.createSchedule({
        chat_id: chatId,
        cadence: cronExpression,
        bundle: 'default'
      });

      onScheduleCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create schedule:', error);
      setError('Failed to create schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg transition-colors
    ${isCyberpunk
      ? 'bg-black/50 border border-[#00ff00]/30 text-[#00ff00] font-mono placeholder-[#00ff00]/30 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]'
      : 'bg-gray-800/50 border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
    }`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Schedule">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isCyberpunk ? 'text-[#00ff00]' : 'text-gray-200'}`}>
            {isCyberpunk ? 'CHAT_ID' : 'Chat ID'}
          </label>
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder={isCyberpunk ? 'PASTE_CHAT_ID' : 'Paste your Chat ID from Prompt Studio'}
            className={inputClasses}
          />
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium ${isCyberpunk ? 'text-[#00ff00]' : 'text-gray-200'}`}>
            {isCyberpunk ? 'SCHEDULE_FREQUENCY' : 'Schedule Frequency'}
          </label>
          <input
            type="text"
            value={scheduleText}
            onChange={(e) => setScheduleText(e.target.value)}
            placeholder={isCyberpunk ? 'ENTER_SCHEDULE' : 'e.g., every 10 minutes, daily at 9am'}
            className={inputClasses}
          />
          <p className={`text-xs ${isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'}`}>
            Enter schedule in plain English - we'll convert it to the correct format
          </p>
        </div>

        {error && (
          <div className={`
            flex items-center gap-2 text-sm
            ${isCyberpunk ? 'text-red-500 font-mono' : 'text-red-400'}
          `}>
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`
              px-4 py-2 rounded-lg transition-all duration-300
              ${isCyberpunk
                ? 'border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#001100]'
                : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
              }
            `}
          >
            {isCyberpunk ? 'CANCEL' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={loading || !chatId || !scheduleText}
            className={`
              px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
              ${isCyberpunk
                ? 'bg-[#001100] border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#002200] disabled:opacity-50'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800'
              }
            `}
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                {isCyberpunk ? 'PROCESSING...' : 'Creating...'}
              </>
            ) : (
              isCyberpunk ? 'CREATE_SCHEDULE' : 'Create Schedule'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}