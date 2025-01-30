// src/components/assistant/scheduler/ScheduleListItem.tsx
'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Play, Pause, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { schedulerService } from '../../../services/schedulerService';
import type { Schedule } from '../../../types/scheduler';
import EditScheduleModal from './EditScheduleModal';

interface ScheduleListItemProps {
  schedule: Schedule;
  onRefresh: () => void;
}

export default function ScheduleListItem({ schedule, onRefresh }: ScheduleListItemProps) {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';
  const [showEditModal, setShowEditModal] = useState(false);
  
  const nextRun = schedulerService.calculateNextRun(schedule.cadence);
  const lastRun = schedule.last_ran_at ? new Date(schedule.last_ran_at) : null;

  const handleToggleActive = async () => {
    try {
      await schedulerService.updateSchedule(schedule.id, {
        active: !schedule.active
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm(isCyberpunk 
      ? 'CONFIRM_DELETE_SCHEDULE?' 
      : 'Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      await schedulerService.deleteSchedule(schedule.id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  };

  return (
    <>
      <div className={`
        group flex items-center justify-between p-4 rounded-lg transition-all duration-300
        ${isCyberpunk
          ? 'bg-black border border-[#00ff00]/30 hover:border-[#00ff00]/60'
          : 'bg-gray-800 border border-gray-700/50 hover:border-gray-600'}
      `}>
        {/* Status and Info */}
        <div className="flex items-center space-x-4">
          <div className={`
            w-3 h-3 rounded-full transition-colors
            ${schedule.active
              ? isCyberpunk ? 'bg-[#00ff00]' : 'bg-green-500'
              : isCyberpunk ? 'bg-[#00ff00]/30' : 'bg-gray-500'}
          `} />
          
          <div>
            <div className={`
              font-medium mb-1
              ${isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-gray-200'}
            `}>
              {schedule.chat_id}
            </div>
            <div className="space-y-1">
              <div className={`
                flex items-center text-sm
                ${isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'}
              `}>
                <Calendar className="w-4 h-4 mr-2" />
                {schedule.cadence}
              </div>
              <div className={`
                flex items-center text-sm
                ${isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'}
              `}>
                <Clock className="w-4 h-4 mr-2" />
                Next run: {nextRun?.toLocaleString() || 'Not scheduled'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleActive}
            className={`
              p-2 rounded-lg transition-colors
              ${isCyberpunk
                ? 'hover:bg-[#001100] text-[#00ff00]'
                : 'hover:bg-gray-700 text-gray-300'}
            `}
          >
            {schedule.active ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={() => setShowEditModal(true)}
            className={`
              p-2 rounded-lg transition-colors
              ${isCyberpunk
                ? 'hover:bg-[#001100] text-[#00ff00]'
                : 'hover:bg-gray-700 text-gray-300'}
            `}
          >
            <Edit2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleDelete}
            className={`
              p-2 rounded-lg transition-colors
              ${isCyberpunk
                ? 'hover:bg-[#001100] text-[#00ff00]'
                : 'hover:bg-gray-700 text-gray-300 hover:text-red-400'}
            `}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <EditScheduleModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onScheduleUpdated={onRefresh}
        schedule={schedule}
      />
    </>
  );
}