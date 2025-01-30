// ScheduleDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, Clock, RefreshCw, Plus,
  Play, Pause, Edit2, Trash2, AlertCircle,
  CheckCircle2, XCircle, Info
} from 'lucide-react';

// Card components
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Alert Dialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

// Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../ui/tooltip";

// Other components
import Alert from "../ui/alert";
import AlertDescription from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Service and types
import { schedulerService } from '../../../services/schedulerService';
import type { Schedule } from '../../../types/scheduler';

// Interface definitions
interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: (refresh?: boolean) => void;
  schedule?: Schedule;
  mode?: 'create' | 'edit';
}

// Components
const ScheduleDialog: React.FC<ScheduleDialogProps> = ({ 
  isOpen, 
  onClose, 
  schedule, 
  mode = 'create' 
}) => {
  const [chatId, setChatId] = useState(schedule?.chat_id || '');
  const [cadence, setCadence] = useState(schedule?.cadence || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setChatId(schedule?.chat_id || '');
      setCadence(schedule?.cadence || '');
      setError('');
    }
  }, [isOpen, schedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (mode === 'create') {
        await schedulerService.createSchedule({
          chat_id: chatId,
          cadence: cadence,
          bundle: 'default'
        });
      } else if (schedule) {
        await schedulerService.updateSchedule(schedule.id, {
          cadence: cadence
        });
      }
      onClose(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Schedule' : 'Edit Schedule'}
          </DialogTitle>
          <DialogDescription>
            Set up your schedule details below. Use cron expression or natural language for cadence.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="chatId">Chat ID</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Enter the Chat ID from your Prompt Studio
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="chatId"
              value={chatId}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setChatId(e.target.value)}
              placeholder="Enter chat ID from Prompt Studio"
              disabled={mode === 'edit'}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cadence">Cadence</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Use natural language (e.g., "every hour") or cron expression
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="cadence"
              value={cadence}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCadence(e.target.value)}
              placeholder="e.g., 'every hour' or '0 * * * *'"
            />
          </div>

          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !chatId || !cadence}
              className="w-full"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Schedule' : 'Update Schedule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const StatusBadge: React.FC<{ active: boolean }> = ({ active }) => (
  <div className={`
    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
    ${active 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}
  `}>
    <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${active ? 'bg-green-400' : 'bg-gray-400'}`} />
    {active ? 'Active' : 'Inactive'}
  </div>
);

const ScheduleCard: React.FC<{ 
  schedule: Schedule; 
  onToggleActive: (schedule: Schedule) => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}> = ({ schedule, onToggleActive, onEdit, onDelete }) => {
  const nextRun = schedule.cadence ? schedulerService.calculateNextRun(schedule.cadence) : null;

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium truncate max-w-[200px]">
          {schedule.chat_id || 'Unnamed Schedule'}
        </CardTitle>
        <StatusBadge active={schedule.active} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded truncate">
              {schedule.cadence || 'Not set'}
            </code>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {nextRun ? nextRun.toLocaleString() : 'Not scheduled'}
            </span>
          </div>

          {schedule.last_ran_at && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Last run: {new Date(schedule.last_ran_at).toLocaleString()}
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleActive(schedule)}
                  >
                    {schedule.active 
                      ? <Pause className="w-4 h-4" />
                      : <Play className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {schedule.active ? 'Pause Schedule' : 'Activate Schedule'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(schedule)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Schedule</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(schedule)}
                    className="hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Schedule</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState: React.FC<{ onCreateNew: () => void }> = ({ onCreateNew }) => (
  <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      No schedules found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      Create your first schedule to get started
    </p>
    <Button onClick={onCreateNew}>
      <Plus className="w-4 h-4 mr-2" />
      New Schedule
    </Button>
  </div>
);

const NotificationToast: React.FC<{ type: 'success' | 'error'; message: string }> = ({ 
  type, 
  message 
}) => (
  <div className={`
    fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-lg z-50
    ${type === 'success' 
      ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
      : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}
    border animate-in slide-in-from-right
  `}>
    <div className="flex items-center">
      {type === 'success' 
        ? <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
        : <XCircle className="w-5 h-5 text-red-500 mr-3" />}
      <p className={`text-sm ${
        type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
      }`}>
        {message}
      </p>
    </div>
  </div>
);

// Main Dashboard Component
export default function ScheduleDashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>(undefined);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchSchedules = useCallback(async (showRefreshing = false) => {
    try {
      showRefreshing ? setRefreshing(true) : setLoading(true);
      const response = await schedulerService.listSchedules();
      setSchedules(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedules');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(() => fetchSchedules(true), 30000);
    return () => clearInterval(interval);
  }, [fetchSchedules]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleToggleActive = async (schedule: Schedule) => {
    try {
      await schedulerService.updateSchedule(schedule.id, {
        active: !schedule.active
      });
      fetchSchedules(true);
      showNotification('success', `Schedule ${!schedule.active ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to toggle schedule status');
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowScheduleDialog(true);
  };

  const handleDelete = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedSchedule) return;

    try {
      await schedulerService.deleteSchedule(selectedSchedule.id);
      fetchSchedules(true);
      setShowDeleteDialog(false);
      showNotification('success', 'Schedule deleted successfully');
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to delete schedule');
    } finally {
      setSelectedSchedule(undefined);
    }
  };

  const handleDialogClose = (refresh = false) => {
    setShowScheduleDialog(false);
    setSelectedSchedule(undefined);
    if (refresh) {
      fetchSchedules(true);
      showNotification('success', 'Schedule saved successfully');
    }
  };

  return (
    <TooltipProvider>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Schedule Dashboard
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Manage and monitor your scheduled tasks
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fetchSchedules(true)}
                  disabled={refreshing}
                  className="text-gray-600 dark:text-gray-400"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh schedules</TooltipContent>
            </Tooltip>

            <Button 
              onClick={() => setShowScheduleDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Schedule
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        ) : schedules.length === 0 ? (
          <EmptyState onCreateNew={() => setShowScheduleDialog(true)} />
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {schedules.map(schedule => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onToggleActive={handleToggleActive}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this schedule? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Create/Edit Schedule Dialog */}
        <ScheduleDialog
          isOpen={showScheduleDialog}
          onClose={handleDialogClose}
          schedule={selectedSchedule}
          mode={selectedSchedule ? 'edit' : 'create'}
        />

        {/* Notification Toast */}
        {notification && (
          <NotificationToast
            type={notification.type}
            message={notification.message}
          />
        )}
      </div>
    </TooltipProvider>
  );
}