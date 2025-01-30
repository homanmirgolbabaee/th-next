// src/components/scheduler/ScheduleCard.tsx
import React from 'react';


import { Play, Pause, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Schedule } from '@/types/scheduler';
import { schedulerService } from '@/services/schedulerService';

interface ScheduleCardProps {
  schedule: Schedule;
  onRefresh: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onRefresh }) => {
  const nextRun = schedulerService.calculateNextRun(schedule.cadence);
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${schedule.active ? 'bg-green-500' : 'bg-gray-500'}`} />
            <h3 className="font-medium">{schedule.chat_id}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await schedulerService.updateSchedule(schedule.id, { active: !schedule.active });
              onRefresh();
            }}
          >
            {schedule.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="space-y-2 text-sm text-gray-400">
          <div>Created: {new Date(schedule.created_at).toLocaleString()}</div>
          <div>Next run: {nextRun ? nextRun.toLocaleString() : 'Not scheduled'}</div>
          <div>Cadence: {schedule.cadence}</div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // TODO: Implement edit modal
            }}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              if (confirm('Are you sure you want to delete this schedule?')) {
                await schedulerService.deleteSchedule(schedule.id);
                onRefresh();
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;