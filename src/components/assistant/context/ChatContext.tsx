// src/components/assistant/ChatContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

export interface Chat {
  id: string;
  title: string;
  date: string;
  messages: Message[];
  lastUpdated: Date;
}

interface ChatContextType {
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat | null) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addMessage: (message: Omit<Message, 'id'>) => void;
  updateMessageStatus: (chatId: string, messageId: string, status: Message['status']) => void;
  createNewChat: () => void;
  deleteChat: (chatId: string) => void;
  clearAllChats: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatCounter, setChatCounter] = useState(1);
  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    const savedCounter = localStorage.getItem('chatCounter');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats, (key, value) => {
          if (key === 'timestamp' || key === 'lastUpdated') {
            return new Date(value);
          }
          return value;
        });
        setChats(parsedChats);
        // Set the most recent chat as current if exists
        if (parsedChats.length > 0) {
          setCurrentChat(parsedChats[0]);
        }
      } catch (error) {
        console.error('Error parsing saved chats:', error);
        localStorage.removeItem('chats');
      }
    }

    if (savedCounter) {
      setChatCounter(parseInt(savedCounter, 10));
    }

  }, []);

  // Save chats to localStorage when they change
  // Save counter to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatCounter', chatCounter.toString());
  }, [chatCounter]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `Chat ${chatCounter}`,
      date: new Date().toISOString().split('T')[0],
      messages: [],
      lastUpdated: new Date()
    };
    
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChat(newChat);
    setChatCounter(prev => prev + 1);
  };

  const addMessage = (message: Omit<Message, 'id'>) => {
    const messageWithId: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    if (!currentChat) {
      // Create a new chat if there isn't one
      const newChat: Chat = {
        id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: message.content.slice(0, 30) + '...',
        date: new Date().toISOString().split('T')[0],
        messages: [messageWithId],
        lastUpdated: new Date()
      };
      setChats(prevChats => [newChat, ...prevChats]);
      setCurrentChat(newChat);
      setChatCounter(prev => prev + 1);
    } else {
      // Update existing chat title only if it's still the default
      const shouldUpdateTitle = currentChat.title.startsWith('Chat ') && 
                              currentChat.messages.length === 0 && 
                              message.role === 'user';

      const updatedChat: Chat = {
        ...currentChat,
        messages: [...currentChat.messages, messageWithId],
        lastUpdated: new Date(),
        title: shouldUpdateTitle 
          ? message.content.slice(0, 30) + '...'
          : currentChat.title
      };

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChat.id ? updatedChat : chat
        ).sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      );
      setCurrentChat(updatedChat);
    }
  };

  const updateMessageStatus = (chatId: string, messageId: string, status: Message['status']) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id !== chatId) return chat;
        return {
          ...chat,
          messages: chat.messages.map(msg => 
            msg.id === messageId ? { ...msg, status } : msg
          )
        };
      })
    );
  };

  const deleteChat = (chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  const clearAllChats = () => {
    setChats([]);
    setCurrentChat(null);
    setChatCounter(1);
    localStorage.removeItem('chats');
    localStorage.removeItem('chatCounter');
  };

  return (
    <ChatContext.Provider value={{
      currentChat,
      setCurrentChat,
      chats,
      setChats,
      addMessage,
      updateMessageStatus,
      createNewChat,
      deleteChat,
      clearAllChats,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}