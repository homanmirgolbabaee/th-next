// src/components/assistant/ChatWindow.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useTheme } from './ThemeContext';
import ChatTemplates from './ChatTemplates';
import { useChat } from './ChatContext';

export default function ChatWindow() {
  const { theme } = useTheme();
  const { currentChat, addMessage, updateMessageStatus } = useChat();
  const isCyberpunk = theme === 'cyberpunk';
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date(),
      status: 'sending' as const
    };

    // Add user message
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMessage.content }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      // Update user message status to sent
      if (currentChat) {
        const lastMessage = currentChat.messages[currentChat.messages.length - 1];
        updateMessageStatus(currentChat.id, lastMessage.id, 'sent');
      }

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        status: 'sent'
      });
    } catch (error) {
      console.error('Error:', error);
      // Update user message status to error
      if (currentChat) {
        const lastMessage = currentChat.messages[currentChat.messages.length - 1];
        updateMessageStatus(currentChat.id, lastMessage.id, 'error');
      }

      // Add error message
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');
          setInput(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  return (
    <div className={`
      flex flex-col h-screen w-full overflow-hidden transition-all duration-500
      ${isCyberpunk
        ? 'bg-black border-l border-[#00ff00]/30'
        : 'bg-gradient-to-b from-gray-900 to-gray-800'}
    `}>
      {/* Messages Area */}
      <div className={`
        flex-1 overflow-y-auto p-6
        ${isCyberpunk
          ? 'font-mono text-[#00ff00] bg-[linear-gradient(to_bottom,#000000,#001100)]'
          : 'text-gray-100'}
      `}>
        <div className="max-w-6xl mx-auto space-y-6">
          {(!currentChat || currentChat.messages.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
              <div className="space-y-8 w-full max-w-2xl">
                <div className="text-center">
                  {isCyberpunk ? (
                    <>
                      <div className="mb-4 font-mono text-xl text-[#00ff00] animate-pulse">[SYSTEM READY]</div>
                      <p className="font-mono text-[#00ff00]/70">INITIALIZING QUANTUM INTERFACE...</p>
                      <p className="font-mono text-[#00ff00]/70 mt-2">SELECT_OPERATION || ENTER_COMMAND</p>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 text-4xl">👋</div>
                      <p className="text-lg font-medium mb-2">Welcome to Toolhouse Assistant!</p>
                      <p className="text-blue-400 mt-2 text-sm">Choose a template or ask anything...</p>
                    </>
                  )}
                </div>
                <ChatTemplates onTemplateSelect={setInput} />
              </div>
            </div>
          ) : (
            <>
              {currentChat.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </>
          )}
          
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
      </div>
      
      {/* Input Area */}
      <div className={`
        border-t w-full
        ${isCyberpunk
          ? 'border-[#00ff00]/30 bg-black/90'
          : 'border-gray-700/50 bg-gray-900/50 backdrop-blur-sm'
        }
      `}>
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4">
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
              type="button"
              onClick={toggleListening}
              disabled={isLoading || isListening}
              className={`
                px-4 py-3 rounded transition-all duration-200 flex items-center justify-center
                ${isCyberpunk
                  ? `bg-[#001100] hover:bg-[#002200] border border-[#00ff00]/30 text-[#00ff00] 
                     ${isListening ? 'ring-2 ring-[#00ff00] animate-pulse' : ''}`
                  : `bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white
                     ${isListening ? 'ring-2 ring-red-500 animate-pulse' : ''}`
                }
                disabled:opacity-50
              `}
            >
              {isListening ? (
                <MicOff className={`h-5 w-5 ${isCyberpunk ? 'text-[#00ff00]' : 'text-red-400'}`} />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
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
    </div>
  );
}