import React, { useState, useRef } from 'react';
import { Copy, Share2, Clock, User, Bot, Volume2, Pause, Loader2 } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    status: 'sending' | 'sent' | 'error';
  };
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioPlay = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message.content }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');
      
      const { audio } = await response.json();
      const audioUrl = `data:audio/mp3;base64,${audio}`;
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: !isCyberpunk,
    }).format(date);
  };

  const formatContent = (content: string) => {
    // ... (keep your existing formatContent function)
    if (isCyberpunk) {
      const sections = content.split('**').filter(Boolean);
      return (
        <div className="space-y-4">
          {sections.map((section, index) => {
            if (section.endsWith('***')) {
              return (
                <h3 key={index} className="text-lg font-mono font-bold text-[#00ff00] mt-4">
                  {section.replace('***', '')}
                </h3>
              );
            }
            
            const points = section.split('* ').filter(Boolean);
            
            if (points.length > 1) {
              return (
                <ul key={index} className="space-y-2">
                  {points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start space-x-2">
                      <span className="text-[#00ff00] mt-1">&gt;</span>
                      <span className="flex-1">{point.trim()}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            
            return <p key={index} className="font-mono">{section.trim()}</p>;
          })}
        </div>
      );
    } else {
      const sections = content.split('**').filter(Boolean);
      return (
        <div className="space-y-4">
          {sections.map((section, index) => {
            if (section.endsWith('***')) {
              return (
                <h3 key={index} className="text-lg font-semibold text-blue-300 mt-4">
                  {section.replace('***', '')}
                </h3>
              );
            }
            
            const points = section.split('* ').filter(Boolean);
            
            if (points.length > 1) {
              return (
                <ul key={index} className="space-y-2">
                  {points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="flex-1 text-gray-200">{point.trim()}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            
            return <p key={index} className="text-gray-200">{section.trim()}</p>;
          })}
        </div>
      );
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-2 group`}>
      {!isUser && (
        <div className={`
          w-8 h-8 rounded flex items-center justify-center flex-shrink-0
          ${isCyberpunk
            ? 'border border-[#00ff00]/30 bg-black'
            : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'
          }
        `}>
          <Bot className={`w-5 h-5 ${isCyberpunk ? 'text-[#00ff00]' : 'text-white'}`} />
        </div>
      )}
      
      <div className="flex flex-col space-y-1">
        <div className={`
          relative max-w-[80%] rounded-lg px-6 py-4
          ${isCyberpunk
            ? `bg-black border border-[#00ff00]/30 text-[#00ff00]`
            : `${isUser
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 rounded-bl-sm'
              } shadow-xl border border-gray-700/50`
          }
        `}>
          {isUser ? message.content : formatContent(message.content)}
          
          <div className="mt-2 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className={isCyberpunk ? 'text-[#00ff00]/50' : 'text-gray-400'}>
                {formatTime(message.timestamp)}
              </span>
              {message.status === 'sending' && (
                <Clock className={`w-3 h-3 animate-spin ${isCyberpunk ? 'text-[#00ff00]/50' : 'text-gray-400'}`} />
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {!isUser && (
                <button
                  onClick={handleAudioPlay}
                  disabled={isLoading}
                  className={`
                    p-1 rounded-full transition-all duration-200
                    ${isCyberpunk 
                      ? 'text-[#00ff00]/70 hover:text-[#00ff00] hover:bg-[#00ff00]/10'
                      : 'text-gray-400 hover:text-blue-400 hover:bg-blue-400/10'
                    }
                  `}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              )}
              <button
                onClick={handleCopy}
                className={`
                  p-1 transition-colors opacity-0 group-hover:opacity-100
                  ${isCyberpunk ? 'hover:text-[#00ff00]' : 'hover:text-blue-400'}
                `}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {copied && (
          <div className={`
            text-xs mt-1
            ${isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-blue-400'}
          `}>
            {isCyberpunk ? '[COPIED TO BUFFER]' : 'Copied to clipboard!'}
          </div>
        )}
        
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>
      
      {isUser && (
        <div className={`
          w-8 h-8 rounded flex items-center justify-center flex-shrink-0
          ${isCyberpunk
            ? 'border border-[#00ff00]/30 bg-black'
            : 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg'
          }
        `}>
          <User className={`w-5 h-5 ${isCyberpunk ? 'text-[#00ff00]' : 'text-white'}`} />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;