// src/components/assistant/scheduler/ScheduleDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Calendar,
  Clock,
  Activity,
  Check,
  Calendar as CalendarIcon,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import CreateScheduleModal from './CreateScheduleModal';
import ScheduleCard from './ScheduleCard';
import { schedulerService, Schedule, ScheduleResponse } from '../../../services/schedulerService';

export default function ScheduleDashboard() {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    upcoming: 0,
    completed: 0
  });

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ScheduleResponse = await schedulerService.listSchedules();
      
      if (response.status === 'success' && response.data) {
        setSchedules(response.data);
        
        // Calculate stats
        const active = response.data.filter(s => s.active).length;
        const completed = response.data.filter(s => s.last_ran_at).length;
        const upcoming = response.data.filter(async s => {
          const nextRun = schedulerService.calculateNextRun(s.cadence);
          const resolvedNextRun = await nextRun;
          return resolvedNextRun && resolvedNextRun > new Date();
        }).length;

        setStats({
          total: response.data.length,
          active,
          upcoming,
          completed
        });
      }
    } catch (error) {
      console.error('Failed to load schedules:', error);
      setError(error instanceof Error ? error.message : 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-2 ${
            isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-gray-100'
          }`}>
            {isCyberpunk ? 'SCHEDULE_DASHBOARD' : 'Schedule Dashboard'}
          </h1>
          <p className={
            isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'
          }>
            Manage and monitor your scheduled tasks
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className={`
            px-4 py-2 rounded-lg flex items-center gap-2 transition-all
            ${isCyberpunk
              ? 'bg-[#001100] border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#002200]'
              : 'bg-blue-600 text-white hover:bg-blue-700'}
          `}
        >
          <CalendarIcon className="w-5 h-5" />
          <span>{isCyberpunk ? 'NEW_SCHEDULE' : 'New Schedule'}</span>
        </button>
      </div>

      {error && (
        <div className={`
          mb-4 p-4 rounded-lg flex items-center gap-2
          ${isCyberpunk
            ? 'bg-red-900/20 border border-red-500/30 text-red-500'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'}
        `}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title={isCyberpunk ? 'TOTAL_SCHEDULES' : 'Total Schedules'}
          value={stats.total}
          icon={Calendar}
          isCyberpunk={isCyberpunk}
        />
        <StatCard
          title={isCyberpunk ? 'ACTIVE_SCHEDULES' : 'Active Schedules'}
          value={stats.active}
          icon={Activity}
          isCyberpunk={isCyberpunk}
        />
        <StatCard
          title={isCyberpunk ? 'UPCOMING_RUNS' : 'Upcoming Runs'}
          value={stats.upcoming}
          icon={Clock}
          isCyberpunk={isCyberpunk}
        />
        <StatCard
          title={isCyberpunk ? 'COMPLETED_RUNS' : 'Completed Runs'}
          value={stats.completed}
          icon={Check}
          isCyberpunk={isCyberpunk}
        />
      </div>

      {/* Recent Schedules Section */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${
          isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-gray-100'
        }`}>
          {isCyberpunk ? 'RECENT_SCHEDULES' : 'Recent Schedules'}
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Clock className={`w-8 h-8 animate-spin ${
              isCyberpunk ? 'text-[#00ff00]' : 'text-blue-500'
            }`} />
          </div>
        ) : schedules.length === 0 ? (
          <EmptyState 
            onCreateNew={() => setShowCreateModal(true)} 
            isCyberpunk={isCyberpunk}
          />
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

      <CreateScheduleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onScheduleCreated={loadSchedules}
      />
    </div>
  );
}

// Helper Components interfaces
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  isCyberpunk: boolean;
}

interface EmptyStateProps {
  onCreateNew: () => void;
  isCyberpunk: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, isCyberpunk }) => (
  <Card className={`
    ${isCyberpunk
      ? 'bg-black border-[#00ff00]/30 hover:border-[#00ff00]/60'
      : 'bg-gray-800 border-gray-700 hover:border-gray-600'}
    transition-all duration-300
  `}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className={`text-sm font-medium ${
        isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'
      }`}>
        {title}
      </CardTitle>
      <Icon className={`w-4 h-4 ${
        isCyberpunk ? 'text-[#00ff00]' : 'text-gray-400'
      }`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${
        isCyberpunk ? 'text-[#00ff00]' : 'text-gray-100'
      }`}>
        {value}
      </div>
    </CardContent>
  </Card>
);

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew, isCyberpunk }) => (
    <div className="text-center py-12 border rounded-lg border-dashed px-4 space-y-4">
      <Calendar className={`w-12 h-12 mx-auto ${
        isCyberpunk ? 'text-[#00ff00]/30' : 'text-gray-600'
      }`} />
      <h3 className={`text-lg font-semibold ${
        isCyberpunk ? 'text-[#00ff00]' : 'text-gray-300'
      }`}>
        {isCyberpunk ? 'NO_SCHEDULES_FOUND' : 'No schedules found'}
      </h3>
      <p className={
        isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'
      }>
        {isCyberpunk 
          ? 'CREATE_YOUR_FIRST_SCHEDULE_TO_GET_STARTED'
          : 'Create your first schedule to get started'}
      </p>
      <button
        onClick={onCreateNew}
        className={`
          px-4 py-2 rounded-lg inline-flex items-center gap-2
          ${isCyberpunk
            ? 'bg-[#001100] border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#002200]'
            : 'bg-blue-600 text-white hover:bg-blue-700'}
        `}
      >
        <CalendarIcon className="w-5 h-5" />
        <span>
          {isCyberpunk ? 'CREATE_SCHEDULE' : 'Create Schedule'}
        </span>
      </button>
    </div>
  );