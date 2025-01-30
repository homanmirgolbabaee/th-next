'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'next/navigation';
import { 
  History, Settings, MessageSquare, Plus, 
  ChevronLeft, ChevronRight, Calendar,
  Search
} from 'lucide-react';
import SettingsModal from './SettingsModal';

interface SidebarProps {
  activeTab: 'chats' | 'schedules';
  onTabChange: (tab: 'chats' | 'schedules') => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabClick = (tab: 'chats' | 'schedules') => {
    try {
      if (tab === 'chats') {
        router.push('/');
      } else {
        router.push('/schedules');
      }
      onTabChange(tab);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <> 
      <div className={`
        fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isCyberpunk 
          ? 'bg-black border-r border-[#00ff00]/30'
          : 'bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50'}
      `}>
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute -right-3 top-8 p-1 rounded-full transition-all duration-300
            transform hover:scale-110
            ${isCyberpunk
              ? 'bg-black border border-[#00ff00]/30 text-[#00ff00]'
              : 'bg-gray-800 border border-gray-600 text-gray-300'}
          `}
        >
          {isCollapsed ? 
            <ChevronRight className="w-4 h-4" /> : 
            <ChevronLeft className="w-4 h-4" />
          }
        </button>

        {/* Tab Navigation */}
        {!isCollapsed && (
          <div className="flex border-b border-gray-700/50 mb-2">
            <button
              onClick={() => handleTabClick('chats')}
              className={`
                flex-1 p-3 text-sm font-medium transition-all duration-200
                ${activeTab === 'chats'
                  ? isCyberpunk
                    ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
                    : 'text-blue-400 border-b-2 border-blue-500'
                  : isCyberpunk
                    ? 'text-[#00ff00]/50 hover:text-[#00ff00]'
                    : 'text-gray-400 hover:text-gray-200'}
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>{isCyberpunk ? 'CHATS' : 'Chats'}</span>
              </div>
            </button>
            <button
              onClick={() => handleTabClick('schedules')}
              className={`
                flex-1 p-3 text-sm font-medium transition-all duration-200
                ${activeTab === 'schedules'
                  ? isCyberpunk
                    ? 'text-[#00ff00] border-b-2 border-[#00ff00]'
                    : 'text-blue-400 border-b-2 border-blue-500'
                  : isCyberpunk
                    ? 'text-[#00ff00]/50 hover:text-[#00ff00]'
                    : 'text-gray-400 hover:text-gray-200'}
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{isCyberpunk ? 'SCHEDULES' : 'Schedules'}</span>
              </div>
            </button>
          </div>
        )}

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="p-4">
            <div className={`
              relative flex items-center
              ${isCyberpunk ? 'text-[#00ff00]' : 'text-gray-300'}
            `}>
              <Search className="absolute left-3 w-4 h-4 opacity-50" />
              <input
                type="text"
                placeholder={isCyberpunk ? "SEARCH_QUERY" : "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-9 pr-4 py-2 rounded-lg
                  transition-all duration-200
                  ${isCyberpunk
                    ? 'bg-black/50 border border-[#00ff00]/30 text-[#00ff00] placeholder-[#00ff00]/50 focus:border-[#00ff00] font-mono'
                    : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-blue-500'}
                `}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Will add content back gradually */}
        </div>

        {/* Bottom Actions */}
        <div className={`
          p-4 border-t mt-auto
          ${isCyberpunk
            ? 'border-[#00ff00]/30 bg-black'
            : 'border-gray-700/50 bg-gray-900/95 backdrop-blur-md'}
        `}>
          <div className="space-y-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg
                transition-all duration-200
                ${isCyberpunk
                  ? 'hover:bg-[#001100] text-[#00ff00] font-mono'
                  : 'hover:bg-gray-800 text-gray-300'}
              `}
            >
              <Settings className="w-5 h-5" />
              {!isCollapsed && (
                <span>{isCyberpunk ? 'SETTINGS' : 'Settings'}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}