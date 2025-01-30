'use client';

import { useState } from 'react';
import Sidebar from '../../components/assistant/ui/Sidebar';

export default function SchedulesPage() {
  const [activeTab, setActiveTab] = useState<'chats' | 'schedules'>('schedules');

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 ml-64 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Schedules</h1>
          {/* Add your schedules content here */}
        </div>
      </main>
    </div>
  );
}