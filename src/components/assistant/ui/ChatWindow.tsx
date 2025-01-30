// src/components/assistant/ChatWindow.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useTheme } from '../context/ThemeContext';
import ChatTemplates from './ChatTemplates';
import { useChat } from '../context/ChatContext';

export default function ChatWindow() {
  const { theme } = useTheme();
  const { currentChat, addMessage, updateMessageStatus } = useChat();
  const isCyberpunk = theme === 'cyberpunk';
  const isRetro = theme === 'retro'; // Add this line


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
      // Add to globals.css
      const RetroStyles = () => isRetro ? (
        <style jsx global>{`
          /* Classic retro gaming styles */
          .retro-container {
            background-color: #1a1b1e;
            background-image: 
              linear-gradient(
                rgba(255, 255, 255, 0.03) 2px, 
                transparent 2px
              ),
              linear-gradient(
                90deg, 
                rgba(255, 255, 255, 0.03) 2px, 
                transparent 2px
              );
            background-size: 32px 32px;
            position: relative;
            font-family: 'Press Start 2P', cursive;
          }

          .retro-text {
            color: #f8f8f8;
            text-shadow: 
              2px 2px 0px #ff004d,
              -2px -2px 0px #0099db;
            letter-spacing: 2px;
          }

          .retro-button {
            background: linear-gradient(45deg, #ff004d, #0099db);
            border: 4px solid #fff;
            box-shadow: 
              0 4px 0 #000,
              inset -4px -4px 0 rgba(0, 0, 0, 0.3);
            image-rendering: pixelated;
            position: relative;
            transform-style: preserve-3d;
          }

          .retro-button:active {
            transform: translateY(4px);
            box-shadow: 0 0 0 #000;
          }

          .retro-input {
            background: #000;
            border: 4px solid #fff;
            box-shadow: 
              inset 0 0 10px rgba(255, 255, 255, 0.1),
              0 0 20px rgba(255, 77, 0, 0.2);
            color: #0f0;
            font-family: 'Press Start 2P', cursive;
          }

          .retro-card {
            background: #2a2a2a;
            border: 4px solid #fff;
            box-shadow: 
              8px 8px 0 #000,
              -8px -8px 0 rgba(255, 77, 0, 0.3);
            transform: rotate(1deg);
          }

          .retro-card:nth-child(even) {
            transform: rotate(-1deg);
          }

          .retro-header {
            background: linear-gradient(90deg, #ff004d, #0099db);
            padding: 8px;
            margin: -8px;
            margin-bottom: 16px;
            text-align: center;
            letter-spacing: 4px;
            text-transform: uppercase;
            border-bottom: 4px solid #fff;
          }

          .retro-scanline {
            position: relative;
            overflow: hidden;
          }

          .retro-scanline::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: rgba(255, 255, 255, 0.1);
            animation: scanline 6s linear infinite;
          }

          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }

          .retro-glow {
            text-shadow: 
              0 0 10px #fff,
              0 0 20px #fff,
              0 0 30px #ff004d,
              0 0 40px #0099db;
          }

          .pixel-corners {
            clip-path: polygon(
              0 8px,
              8px 8px,
              8px 0,
              calc(100% - 8px) 0,
              calc(100% - 8px) 8px,
              100% 8px,
              100% calc(100% - 8px),
              calc(100% - 8px) calc(100% - 8px),
              calc(100% - 8px) 100%,
              8px 100%,
              8px calc(100% - 8px),
              0 calc(100% - 8px)
            );
          }
        `}</style>
      ) : null;
      
      
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

  const RetroStyles = () => isRetro ? (
    <style jsx global>{`...`}</style>
  ) : null;

  return (
    <div className={`
      flex flex-col h-screen w-full overflow-hidden transition-all duration-500
      ${isCyberpunk
        ? 'bg-black border-l border-[#00ff00]/30'
        : 'bg-gradient-to-b from-gray-900 to-gray-800'}
    `}>
      {RetroStyles()}
      {/* Messages Area */}
      <div className={`
        flex-1 overflow-y-auto p-6
        ${isCyberpunk
          ? 'font-mono text-[#00ff00] bg-[linear-gradient(to_bottom,#000000,#001100)]'
          : isRetro
          ? 'font-[Press_Start_2P] text-white bg-[linear-gradient(to_bottom,#1a1a1a,#2a2a2a)]'
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
      
      {/* Enhanced Input Area */}
      <div className={`
        border-t w-full transition-all duration-300
        ${isCyberpunk
          ? 'border-[#00ff00]/30 bg-black/90'
          : isRetro
          ? 'border-4 border-gray-800 bg-gray-700 retro-input-container'
          : 'border-gray-700/50 bg-gray-900/50 backdrop-blur-sm'
        }
        ${isRetro && 'relative overflow-hidden'}
        `}>
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4">
          <div className="flex items-end space-x-4">
            <div className="relative flex-1 group">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize logic
                  e.target.style.height = 'inherit';
                  e.target.style.height = `${Math.min(200, Math.max(63, e.target.scrollHeight))}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={1}
                className={`
                  w-full px-4 py-3 pr-12 rounded-lg resize-none transition-all duration-200
                  ${isCyberpunk
                    ? 'bg-black/50 text-[#00ff00] font-mono border border-[#00ff00]/30 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]/50 placeholder-[#00ff00]/30'
                    : isRetro
                    ? 'bg-gray-800 text-white border-4 border-gray-900 focus:border-gray-700 font-[Press_Start_2P] text-sm placeholder-gray-400 retro-input shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]'
                    : 'bg-gray-800/50 text-gray-100 border border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500'
                  }
                `}
                placeholder={isCyberpunk ? "ENTER_COMMAND >_" : "Type your message..."}
                disabled={isLoading}
              />
              {/* Character count */}
              <div className={`
                absolute right-3 bottom-3 transition-opacity duration-200
                ${input.length > 0 ? 'opacity-100' : 'opacity-0'}
                ${isCyberpunk ? 'text-[#00ff00]/50' : 'text-gray-400'}
                text-xs
              `}>
                {input.length} chars
              </div>
            </div>

            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              className={`
                group px-4 py-3 h-[63px] rounded-lg transition-all duration-300 flex items-center justify-center
                hover:scale-105 active:scale-95
                ${isCyberpunk
                  ? `bg-[#001100] hover:bg-[#002200] border border-[#00ff00]/30 text-[#00ff00] 
                     ${isListening ? 'ring-2 ring-[#00ff00] animate-pulse' : ''}`
                  : `bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white
                     ${isListening ? 'ring-2 ring-red-500 animate-pulse' : ''}`
                }
                disabled:opacity-50 disabled:hover:scale-100
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
              disabled={isLoading || !input.trim()}
              className={`
                group px-6 py-3 h-[63px] rounded-lg transition-all duration-300 
                flex items-center justify-center
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                ${isCyberpunk
                  ? 'bg-[#001100] hover:bg-[#002200] border border-[#00ff00]/30 text-[#00ff00] font-mono hover:shadow-[0_0_10px_rgba(0,255,0,0.2)]'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-800 disabled:to-blue-900 text-white shadow-lg'}
              `}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isCyberpunk && <span className="mr-2">[EXECUTE]</span>}
                  <Send className={`h-5 w-5 transition-transform duration-300 ${!isCyberpunk && 'group-hover:translate-x-1'}`} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>



    </div>
  );
}