// src/components/assistant/scheduler/SchedulerWindow.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Grid, 
  List, 
  Plus, 
  X,
  Clock,
  Calendar 
} from 'lucide-react';
import { schedulerService } from '../../../services/schedulerService';
import CreateScheduleModal from './CreateScheduleModal';
import ScheduleCard from './ScheduleCard';
import ScheduleListItem from './ScheduleListItem';
import type { Schedule } from '../../../types/scheduler';

interface SchedulerWindowProps {
  onClose: () => void;
}

export default function SchedulerWindow({ onClose }: SchedulerWindowProps) {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';
  
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await schedulerService.listSchedules();
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`
        absolute inset-8 rounded-lg shadow-xl overflow-hidden
        transform transition-all duration-500
        ${isCyberpunk
          ? 'bg-black border-2 border-[#00ff00]/30'
          : 'bg-gray-900 border border-gray-700/50'}
      `}>
        {/* Header */}
        <div className={`
          px-6 py-4 flex items-center justify-between border-b
          ${isCyberpunk
            ? 'border-[#00ff00]/30'
            : 'border-gray-700/50'}
        `}>
          <div className="flex items-center gap-3">
            <Calendar className={isCyberpunk ? 'text-[#00ff00]' : 'text-gray-200'} />
            <h2 className={`
              text-xl font-bold
              ${isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-gray-100'}
            `}>
              {isCyberpunk ? 'SCHEDULE_MANAGER' : 'Schedule Manager'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className={`
              flex rounded-lg overflow-hidden border
              ${isCyberpunk
                ? 'border-[#00ff00]/30'
                : 'border-gray-700'}
            `}>
              <button
                onClick={() => setView('list')}
                className={`
                  p-2 transition-colors
                  ${view === 'list'
                    ? isCyberpunk
                      ? 'bg-[#001100] text-[#00ff00]'
                      : 'bg-gray-700 text-white'
                    : isCyberpunk
                      ? 'text-[#00ff00]/50 hover:text-[#00ff00] hover:bg-[#001100]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                `}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView('grid')}
                className={`
                  p-2 transition-colors
                  ${view === 'grid'
                    ? isCyberpunk
                      ? 'bg-[#001100] text-[#00ff00]'
                      : 'bg-gray-700 text-white'
                    : isCyberpunk
                      ? 'text-[#00ff00]/50 hover:text-[#00ff00] hover:bg-[#001100]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                `}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                ${isCyberpunk
                  ? 'bg-[#001100] border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#002200]'
                  : 'bg-blue-600 text-white hover:bg-blue-700'}
              `}
            >
              <Plus className="w-5 h-5" />
              <span>{isCyberpunk ? 'NEW_SCHEDULE' : 'New Schedule'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`
                p-2 rounded-lg transition-colors
                ${isCyberpunk
                  ? 'text-[#00ff00]/70 hover:text-[#00ff00] hover:bg-[#001100]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'}
              `}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(100%-5rem)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Clock className={`
                w-8 h-8 animate-spin
                ${isCyberpunk ? 'text-[#00ff00]' : 'text-blue-500'}
              `} />
            </div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Calendar className={`
                w-16 h-16 mb-4
                ${isCyberpunk ? 'text-[#00ff00]/30' : 'text-gray-600'}
              `} />
              <p className={`
                text-lg mb-4
                ${isCyberpunk ? 'text-[#00ff00]' : 'text-gray-300'}
              `}>
                {isCyberpunk ? 'NO_SCHEDULES_FOUND' : 'No schedules found'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                  ${isCyberpunk
                    ? 'border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#001100]'
                    : 'border border-blue-500 text-blue-400 hover:bg-blue-500/10'}
                `}
              >
                <Plus className="w-5 h-5" />
                <span>
                  {isCyberpunk ? 'CREATE_FIRST_SCHEDULE' : 'Create your first schedule'}
                </span>
              </button>
            </div>
          ) : view === 'list' ? (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <ScheduleListItem
                  key={schedule.id}
                  schedule={schedule}
                  onRefresh={loadSchedules}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onRefresh={loadSchedules}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateScheduleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onScheduleCreated={loadSchedules}
      />
    </div>
  );
}