'use client';

import React, { useState } from 'react';
import Sidebar from '../ui/Sidebar';
import { useRouter, usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'chats' | 'schedules'>('chats');

  const handleTabChange = (tab: 'chats' | 'schedules') => {
    setActiveTab(tab);
    if (tab === 'chats') {
      router.push('/');
    } else {
      router.push('/schedules');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden ml-64">
        {children}
      </main>
    </div>
  );
}