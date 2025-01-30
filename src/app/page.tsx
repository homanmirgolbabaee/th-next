'use client';

import { useState } from 'react';
import Sidebar from '../components/assistant/ui/Sidebar';
import ChatWindow from '../components/assistant/ui/ChatWindow';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'chats' | 'schedules'>('chats');

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 ml-64 overflow-hidden">
        <ChatWindow />
      </main>
    </div>
  );
}