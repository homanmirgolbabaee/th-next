'use client';

import { useState } from 'react';
import Sidebar from '../../components/assistant/ui/Sidebar';

export default function SchedulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<'chats' | 'schedules'>('schedules');

  const handleTabChange = (tab: 'chats' | 'schedules') => {
    setActiveTab(tab);
    // Add navigation logic if needed
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-1 ml-64 overflow-hidden">
        {children}
      </main>
    </div>
  );
}