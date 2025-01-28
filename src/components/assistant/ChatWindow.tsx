'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Format the response with proper markdown-like syntax
      const formattedResponse = data.message
        .replace(/\n\n/g, '\n')
        .replace(/^([\w\s]+):/, '**$1***')
        .replace(/^- /gm, '* ');

      const assistantMessage: Message = {
        role: 'assistant',
        content: formattedResponse
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: error instanceof Error ? 
          `Error: ${error.message}` : 
          'Sorry, I encountered an error processing your request.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900">
        <h2 className="text-xl font-semibold text-gray-100 flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
          <span>Toolhouse Assistant</span>
        </h2>
      </div>
      
      {/* Messages Area with smooth scroll behavior */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <div className="mb-4 text-4xl">👋</div>
            <p className="text-lg font-medium mb-2">Welcome to Toolhouse Assistant!</p>
            <p className="text-blue-400 mt-2 text-sm">Try asking about Toolhouse.ai or request the latest tweets</p>
          </div>
        )}
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area with glass effect */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-800/50 text-gray-100 rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 transition-all duration-200"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-800 disabled:to-blue-900 text-white rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 shadow-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}