// src/components/scheduler/ScheduleCard.tsx
import React from 'react';


import { Play, Pause, Edit2, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Schedule } from '@/types/scheduler';
import { schedulerService } from '@/services/schedulerService';

interface ScheduleCardProps {
  schedule: Schedule;
  onRefresh: () => void;
}





function calculateNextRun(cronExpression: string | null, lastRun: string | null): Date | null {
  if (!cronExpression) return null;

  try {
    // Parse cron expression
    const [minutes, hours, dayOfMonth, month, dayOfWeek] = cronExpression.split(' ');
    const now = new Date();
    let nextRun = new Date(now);

    // Handle common patterns
    if (minutes.includes('*/')) {
      // Every X minutes pattern
      const intervalMinutes = parseInt(minutes.replace('*/', ''));
      const lastRunTime = lastRun ? new Date(lastRun) : now;
      const minutesSinceLastRun = Math.floor((now.getTime() - lastRunTime.getTime()) / (1000 * 60));
      const minutesToAdd = intervalMinutes - (minutesSinceLastRun % intervalMinutes);
      
      nextRun = new Date(now.getTime() + minutesToAdd * 60 * 1000);
    } else if (hours.includes('*/')) {
      // Every X hours pattern
      const intervalHours = parseInt(hours.replace('*/', ''));
      nextRun.setMinutes(0);
      nextRun.setHours(nextRun.getHours() + intervalHours);
    } else {
      // Specific time pattern
      const specificMinute = parseInt(minutes);
      const specificHour = parseInt(hours);
      
      nextRun.setMinutes(specificMinute);
      nextRun.setHours(specificHour);
      
      // If the time has already passed today, move to tomorrow
      if (nextRun < now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
    }

    return nextRun;
  } catch (error) {
    console.error('Error calculating next run:', error);
    return null;
  }
}




function ScheduleCard({ schedule, onRefresh }: { schedule: Schedule; onRefresh: () => void }) {
  const nextRun = calculateNextRun(schedule.cadence, schedule.last_ran_at);
  const isOverdue = nextRun && new Date() > nextRun;

  const formatCadence = (cronExpression: string | null): string => {
    if (!cronExpression) return 'Not set';
    
    // Convert cron to human-readable format
    const [minutes, hours] = cronExpression.split(' ');
    if (minutes.includes('*/')) {
      const interval = minutes.replace('*/', '');
      return `Every ${interval} minutes`;
    } else if (hours.includes('*/')) {
      const interval = hours.replace('*/', '');
      return `Every ${interval} hours`;
    }
    return cronExpression; // Default to showing cron if pattern isn't recognized
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-sm text-gray-400">Schedule ID</CardTitle>
          <p className="text-white font-mono text-xs mt-1">{schedule.id}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs ${
          schedule.active
            ? isOverdue 
              ? 'bg-yellow-900/50 text-yellow-400'
              : 'bg-green-900/50 text-green-400'
            : 'bg-gray-900/50 text-gray-400'
        }`}>
          {schedule.active 
            ? isOverdue 
              ? 'Overdue'
              : 'Active' 
            : 'Inactive'}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-gray-400 mb-1">Cadence</p>
          <code className={`text-xs rounded px-2 py-1 ${
            schedule.cadence 
              ? 'bg-gray-900 text-blue-400'
              : 'bg-red-900/20 text-red-400'
          }`}>
            {formatCadence(schedule.cadence)}
          </code>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">Next Run</p>
          <p className={`text-sm ${
            isOverdue ? 'text-yellow-400' : 'text-white'
          }`}>
            {nextRun 
              ? nextRun.toLocaleString() 
              : schedule.active 
                ? 'Calculating...'
                : 'Not scheduled'}
          </p>
        </div>
        {schedule.last_ran_at && (
          <div>
            <p className="text-sm text-gray-400 mb-1">Last Run</p>
            <p className="text-sm text-white">
              {new Date(schedule.last_ran_at).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;