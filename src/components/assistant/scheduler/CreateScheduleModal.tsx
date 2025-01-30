// src/components/assistant/scheduler/CreateScheduleModal.tsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Clock, AlertCircle , Check } from 'lucide-react';
import { schedulerService, ScheduleCreateRequest } from '../../../services/schedulerService';
import Modal from '../ui/Modal';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleCreated: () => void;
}


const SCHEDULE_PRESETS = [
  { label: 'Every 10 minutes', value: 'every 10 minutes', cron: '*/10 * * * *' },
  { label: 'Every hour', value: 'every hour', cron: '0 * * * *' },
  { label: 'Every 3 hours', value: 'every 3 hours', cron: '0 */3 * * *' },
  { label: 'Daily at 9 AM', value: 'daily at 9am', cron: '0 9 * * *' },
  { label: 'Weekly on Monday', value: 'weekly on monday', cron: '0 0 * * 1' },
];

export default function CreateScheduleModal({ isOpen, onClose, onScheduleCreated }: CreateScheduleModalProps) {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';

  const [chatId, setChatId] = useState('');
  const [scheduleText, setScheduleText] = useState('');
  const [cronExpression, setCronExpression] = useState('');  // Add this line

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePresetSelect = async (preset: typeof SCHEDULE_PRESETS[0]) => {
    setScheduleText(preset.value);
    setCronExpression(preset.cron);
  };

  const handleScheduleTextChange = async (text: string) => {
    setScheduleText(text);
    if (text) {
      try {
        const response = await schedulerService.convertToCron(text);
        setCronExpression(response);
      } catch (error) {
        console.error('Failed to convert to cron:', error);
        setCronExpression('');
      }
    } else {
      setCronExpression('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const scheduleData: ScheduleCreateRequest = {
        chat_id: chatId,
        cadence: cronExpression || scheduleText,
        bundle: 'default',
        toolhouse_id: 'default'
      };

      await schedulerService.createSchedule(scheduleData);
      onScheduleCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create schedule:', error);
      setError(error instanceof Error ? error.message : 'Failed to create schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isCyberpunk ? 'CREATE_SCHEDULE' : 'Create Schedule'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chat ID input remains the same */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isCyberpunk ? 'text-[#00ff00]' : 'text-gray-200'}`}>
            {isCyberpunk ? 'CHAT_ID' : 'Chat ID'}
          </label>
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder={isCyberpunk ? 'PASTE_CHAT_ID' : 'Paste your Chat ID from Prompt Studio'}
            className={`w-full px-4 py-2 rounded-lg bg-gray-800 border
              ${isCyberpunk
                ? 'border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30'
                : 'border-gray-700 text-white placeholder-gray-500'}`}
          />
        </div>

        {/* Schedule Presets */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isCyberpunk ? 'text-[#00ff00]' : 'text-gray-200'}`}>
            {isCyberpunk ? 'SCHEDULE_PRESETS' : 'Schedule Presets'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SCHEDULE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`p-2 text-sm rounded-lg text-left transition-colors ${
                  scheduleText === preset.value
                    ? isCyberpunk
                      ? 'bg-[#001100] border border-[#00ff00] text-[#00ff00]'
                      : 'bg-blue-600 text-white'
                    : isCyberpunk
                      ? 'border border-[#00ff00]/30 text-[#00ff00]/70 hover:bg-[#001100]'
                      : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Input */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isCyberpunk ? 'text-[#00ff00]' : 'text-gray-200'}`}>
            {isCyberpunk ? 'SCHEDULE_FREQUENCY' : 'Schedule Frequency'}
          </label>
          <input
            type="text"
            value={scheduleText}
            onChange={(e) => handleScheduleTextChange(e.target.value)}
            placeholder={isCyberpunk ? 'ENTER_SCHEDULE' : 'e.g., every 10 minutes, daily at 9am'}
            className={`w-full px-4 py-2 rounded-lg bg-gray-800 border
              ${isCyberpunk
                ? 'border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/30'
                : 'border-gray-700 text-white placeholder-gray-500'}`}
          />
          {cronExpression && (
            <div className={`flex items-center gap-2 text-sm ${
              isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'
            }`}>
              <Check className="w-4 h-4" />
              <span>Cron: {cronExpression}</span>
            </div>
          )}
        </div>

        {/* Error and buttons remain the same */}

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
              px-4 py-2 rounded-lg
              ${isCyberpunk
                ? 'border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#001100]'
                : 'border border-gray-600 text-gray-300 hover:bg-gray-800'}
            `}
          >
            {isCyberpunk ? 'CANCEL' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={loading || !chatId || !scheduleText}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2
              ${isCyberpunk
                ? 'bg-[#001100] border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#002200] disabled:opacity-50'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800'}
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