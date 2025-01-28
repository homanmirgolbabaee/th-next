'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Clock } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Use regular Promise syntax instead of async/await
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: input }),
    })
      .then(response => response.json())
      .then(data => {
        if (!data.message) {
          throw new Error('Failed to get response');
        }

        // Update user message status
        setMessages(prev =>
          prev.map(msg =>
            msg === userMessage ? { ...msg, status: 'sent' as const } : msg
          )
        );

        // Format and add assistant message
        const formattedResponse = data.message
          .replace(/\n\n/g, '\n')
          .replace(/^([\w\s]+):/, '**$1***')
          .replace(/^- /gm, '* ');

        const assistantMessage: Message = {
          role: 'assistant',
          content: formattedResponse,
          timestamp: new Date(),
          status: 'sent'
        };

        setMessages(prev => [...prev, assistantMessage]);
      })
      .catch(error => {
        console.error('Error:', error);
        setMessages(prev =>
          prev.map(msg =>
            msg === userMessage ? { ...msg, status: 'error' as const } : msg
          )
        );

        const errorMessage: Message = {
          role: 'assistant',
          content: error instanceof Error ?
            `Error: ${error.message}` :
            'Sorry, I encountered an error processing your request.',
          timestamp: new Date(),
          status: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-gray-100 flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
          <span>Toolhouse Assistant</span>
        </h2>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <div className="mb-4 text-4xl">👋</div>
            <p className="text-lg font-medium mb-2">Welcome to Toolhouse Assistant!</p>
            <p className="text-blue-400 mt-2 text-sm">Ask me anything about Toolhouse.ai or request the latest updates</p>
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
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-800/50 text-gray-100 rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 transition-all duration-200"
            placeholder="Type your message..."
            disabled={isLoading}
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