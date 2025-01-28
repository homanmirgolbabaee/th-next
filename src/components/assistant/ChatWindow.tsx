'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Terminal, Wifi, Shield, Database } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useTheme } from './ThemeContext';


interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

export default function ChatWindow() {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode] = useState(() => Math.random().toString(36).substring(7).toUpperCase());
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

    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: input }),
    })
      .then(response => response.json())
      .then(data => {
        if (!data.message) throw new Error('Failed to get response');
        setMessages(prev =>
          prev.map(msg =>
            msg === userMessage ? { ...msg, status: 'sent' as const } : msg
          )
        );
        
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
          content: 'SYSTEM ERROR: Connection terminated. Retry sequence initiated.',
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
    <div className={`
      relative flex flex-col h-[600px] overflow-hidden transition-all duration-500
      ${isCyberpunk
        ? 'bg-black border-2 border-[#00ff00]/30 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)]'
        : 'bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700/50'
      }
    `}>
      {/* Scanline effect - only show in cyberpunk mode */}
      {isCyberpunk && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] animate-scan" />
      )}
      
      {/* Header */}
      <div className={`
        relative px-6 py-4 border-b transition-all duration-300
        ${isCyberpunk
          ? 'border-[#00ff00]/30 bg-black/90'
          : 'border-gray-700/50 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm'
        }
      `}>
        {isCyberpunk ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Terminal className="w-5 h-5 text-[#00ff00]" />
              <h2 className="text-xl font-mono text-[#00ff00]">SYSTEM.INTERFACE.v2.4</h2>
            </div>
            <div className="flex items-center space-x-3 text-[#00ff00]/70">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-mono">SEC.LVL: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-mono">CONNECTED</span>
              </div>
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span className="text-xs font-mono">ACTIVE</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            <h2 className="text-xl font-semibold text-gray-100">Toolhouse Assistant</h2>
          </div>
        )}
      </div>
      
      {/* Messages Area */}
      <div className={`
        flex-1 overflow-y-auto p-6 space-y-6
        ${isCyberpunk
          ? 'font-mono text-[#00ff00] bg-[linear-gradient(to_bottom,#000000,#001100)]'
          : 'text-gray-100'
        }
      `}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            {isCyberpunk ? (
              <>
                <div className="mb-4 font-mono text-xl text-[#00ff00] animate-pulse">[SYSTEM READY]</div>
                <p className="font-mono text-[#00ff00]/70">INITIALIZING QUANTUM INTERFACE...</p>
                <p className="font-mono text-[#00ff00]/70 mt-2">ENTER COMMAND SEQUENCE</p>
              </>
            ) : (
              <>
                <div className="mb-4 text-4xl">👋</div>
                <p className="text-lg font-medium mb-2">Welcome to Toolhouse Assistant!</p>
                <p className="text-blue-400 mt-2 text-sm">Ask me anything...</p>
              </>
            )}
          </div>
        )}
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-center py-4">
            {isCyberpunk ? (
              <div className="font-mono text-[#00ff00] animate-pulse">PROCESSING...</div>
            ) : (
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className={`
        p-4 border-t transition-all duration-300
        ${isCyberpunk
          ? 'border-[#00ff00]/30 bg-black/90'
          : 'border-gray-700/50 bg-gray-900/50 backdrop-blur-sm'
        }
      `}>
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`
              flex-1 px-4 py-3 rounded transition-all duration-200
              ${isCyberpunk
                ? 'bg-black/50 text-[#00ff00] font-mono border border-[#00ff00]/30 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]/50 placeholder-[#00ff00]/30'
                : 'bg-gray-800/50 text-gray-100 border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500'
              }
            `}
            placeholder={isCyberpunk ? "ENTER COMMAND >_" : "Type your message..."}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`
              px-6 py-3 rounded transition-all duration-200 flex items-center justify-center disabled:opacity-50
              ${isCyberpunk
                ? 'bg-[#001100] hover:bg-[#002200] border border-[#00ff00]/30 text-[#00ff00] font-mono hover:shadow-[0_0_10px_rgba(0,255,0,0.2)]'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-800 disabled:to-blue-900 text-white shadow-lg'
              }
            `}
          >
            {isCyberpunk && <span className="mr-2">[EXECUTE]</span>}
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}