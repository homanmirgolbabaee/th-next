'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useChat } from './ChatContext';
import { 
  History, Settings, MessageSquare, Plus, 
  ChevronLeft, ChevronRight, Trash2, 
  Clock, Star, Filter, Search
} from 'lucide-react';
import SettingsModal from './SettingsModal';  // Add this import

export default function EnhancedSidebar() {
  const { theme } = useTheme();
  const { 
    chats, 
    currentChat, 
    setCurrentChat, 
    createNewChat, 
    deleteChat,
    clearAllChats 
  } = useChat();
  
  const isCyberpunk = theme === 'cyberpunk';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [hoveredChat, setHoveredChat] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);  // Add this state
  // Group chats by date
  const groupedChats = chats.reduce((groups: { [key: string]: any[] }, chat) => {
    const date = new Date(chat.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(chat);
    return groups;
  }, {});

    const filteredChats = Object.entries(groupedChats)
        .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()) // Sort dates in descending order
        .map(([date, chatList]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }),
        chats: chatList.filter(chat => 
            chat.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filterType === 'all' || filterType === 'starred')
        ).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()) // Sort chats by lastUpdated
        }))
        .filter(group => group.chats.length > 0);

  return (
    <> 
    <div className={`
        fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isCyberpunk 
          ? 'bg-black border-r border-[#00ff00]/30' 
          : 'bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50'}
      `}>
      {/* Collapse Button with Animation */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`
          absolute -right-3 top-8 p-1 rounded-full transition-all duration-300
          transform hover:scale-110
          ${isCyberpunk
            ? 'bg-black border border-[#00ff00]/30 text-[#00ff00] hover:border-[#00ff00]'
            : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'}
        `}
      >
        {isCollapsed ? 
          <ChevronRight className="w-4 h-4" /> : 
          <ChevronLeft className="w-4 h-4" />
        }
      </button>

      {/* Search and Filter Bar */}
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          <div className={`
            relative flex items-center
            ${isCyberpunk ? 'text-[#00ff00]' : 'text-gray-300'}
          `}>
            <Search className="absolute left-3 w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder={isCyberpunk ? "SEARCH_QUERY" : "Search chats..."}
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

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={createNewChat}
          className={`
            w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
            transition-all duration-300 transform hover:scale-105
            ${isCyberpunk
              ? 'bg-[#001100] hover:bg-[#002200] border border-[#00ff00]/30 text-[#00ff00] hover:border-[#00ff00] font-mono'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/20'}
          `}
        >
          <Plus className={`w-5 h-5 ${!isCollapsed && 'mr-2'}`} />
          {!isCollapsed && (
            <span className={isCyberpunk ? 'tracking-wider' : ''}>
              {isCyberpunk ? 'NEW_SESSION' : 'New Chat'}
            </span>
          )}
        </button>
      </div>

      {/* Chat List with Animations */}
      <div className="flex-1 px-2 space-y-4 overflow-y-auto">
        {filteredChats.map(({ date, chats }) => (
          <div key={date} className="space-y-1">
            <div className={`
              px-3 py-1 text-xs font-medium
              ${isCyberpunk ? 'text-[#00ff00]/70 font-mono' : 'text-gray-500'}
            `}>
              {isCyberpunk ? date.toUpperCase() : date}
            </div>
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`
                  group relative rounded-lg transition-all duration-200
                  transform hover:scale-102
                  ${currentChat?.id === chat.id 
                    ? (isCyberpunk 
                      ? 'bg-[#001100] ring-1 ring-[#00ff00]' 
                      : 'bg-gray-800 ring-1 ring-blue-500')
                    : 'hover:bg-opacity-10'}
                  ${isCyberpunk
                    ? 'hover:bg-[#001100] text-[#00ff00]/90'
                    : 'hover:bg-gray-800/50 text-gray-300'}
                `}
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
              >
                <button
                  onClick={() => setCurrentChat(chat)}
                  className="w-full text-left p-3"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className={`
                          text-sm font-medium truncate
                          ${isCyberpunk ? 'font-mono' : ''}
                        `}>
                          {chat.title}
                        </div>
                        <div className={`
                          text-xs truncate flex items-center space-x-2
                          ${isCyberpunk ? 'text-[#00ff00]/50' : 'text-gray-500'}
                        `}>
                          <Clock className="w-3 h-3" />
                          <span>{new Date(chat.date).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                {/* Hover Actions */}
                {!isCollapsed && hoveredChat === chat.id && (
                  <div className={`
                    absolute right-2 top-1/2 -translate-y-1/2
                    flex items-center space-x-1
                    transition-all duration-200
                  `}>
                    <button
                      onClick={() => deleteChat(chat.id)}
                      className={`
                        p-1 rounded-full
                        ${isCyberpunk
                          ? 'hover:bg-[#002200] text-[#00ff00]'
                          : 'hover:bg-gray-700 text-gray-400 hover:text-red-400'}
                      `}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
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
            onClick={() => {
                if (window.confirm(isCyberpunk 
                  ? 'CONFIRM_DELETE_ALL_RECORDS?' 
                  : 'Are you sure you want to clear all chat history? This action cannot be undone.')) {
                  clearAllChats();
                }
              }}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg
                transition-all duration-200
                ${isCyberpunk
                  ? 'hover:bg-[#001100] text-[#00ff00] font-mono'
                  : 'hover:bg-gray-800 text-gray-300'}
              `}
            >
            <History className="w-5 h-5" />
            {!isCollapsed && (
              <span>{isCyberpunk ? 'CLEAR_HISTORY' : 'Clear History'}</span>
            )}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true) } // Add settings modal
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
              <span>{isCyberpunk ? 'SYSTEM_CONFIG' : 'Settings'}</span>
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