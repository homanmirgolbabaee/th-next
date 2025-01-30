// src/components/assistant/scheduler/ScheduleCard.tsx
'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Play, Pause, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { schedulerService } from '../../../services/schedulerService';
import type { Schedule } from '../../../types/scheduler';
import EditScheduleModal from './EditScheduleModal';

interface ScheduleCardProps {
  schedule: Schedule;
  onRefresh: () => void;
}

export default function ScheduleCard({ schedule, onRefresh }: ScheduleCardProps) {
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
        group relative p-4 rounded-lg transition-all duration-300 h-full
        ${isCyberpunk
          ? 'bg-black border border-[#00ff00]/30 hover:border-[#00ff00]/60'
          : 'bg-gray-800 border border-gray-700/50 hover:border-gray-600'}
      `}>
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`
            flex items-center space-x-2 px-2 py-1 rounded
            ${schedule.active
              ? isCyberpunk 
                ? 'bg-[#001100] text-[#00ff00]' 
                : 'bg-green-900/50 text-green-400'
              : isCyberpunk
                ? 'bg-black text-[#00ff00]/50'
                : 'bg-gray-900/50 text-gray-400'}
          `}>
            <div className={`
              w-2 h-2 rounded-full
              ${schedule.active
                ? isCyberpunk ? 'bg-[#00ff00]' : 'bg-green-500'
                : isCyberpunk ? 'bg-[#00ff00]/30' : 'bg-gray-500'}
            `} />
            <span className="text-xs">
              {schedule.active 
                ? (isCyberpunk ? 'ACTIVE' : 'Active')
                : (isCyberpunk ? 'INACTIVE' : 'Inactive')}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleToggleActive}
              className={`
                p-1.5 rounded transition-colors
                ${isCyberpunk
                  ? 'hover:bg-[#001100] text-[#00ff00]'
                  : 'hover:bg-gray-700 text-gray-300'}
              `}
            >
              {schedule.active ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={() => setShowEditModal(true)}
              className={`
                p-1.5 rounded transition-colors
                ${isCyberpunk
                  ? 'hover:bg-[#001100] text-[#00ff00]'
                  : 'hover:bg-gray-700 text-gray-300'}
              `}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDelete}
              className={`
                p-1.5 rounded transition-colors
                ${isCyberpunk
                  ? 'hover:bg-[#001100] text-[#00ff00]'
                  : 'hover:bg-gray-700 text-gray-300 hover:text-red-400'}
              `}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <div className={`
              font-medium mb-2 truncate
              ${isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-gray-200'}
            `}>
              {schedule.chat_id}
            </div>
            <div className="space-y-2">
              <div className={`
                flex items-center text-sm
                ${isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'}
              `}>
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{schedule.cadence}</span>
              </div>
              <div className={`
                flex items-center text-sm
                ${isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'}
              `}>
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  Next run: {nextRun?.toLocaleString() || 'Not scheduled'}
                </span>
              </div>
            </div>
          </div>

          {lastRun && (
            <div className={`
              text-xs
              ${isCyberpunk ? 'text-[#00ff00]/50' : 'text-gray-500'}
            `}>
              Last run: {lastRun.toLocaleString()}
            </div>
          )}
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