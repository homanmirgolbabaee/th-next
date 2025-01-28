'use client';

import { Copy, Share2, Clock, User, Bot } from 'lucide-react';
import PlayButton from './PlayButton';
import { useState } from 'react';

interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    status: 'sending' | 'sent' | 'error';
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const formatContent = (content: string) => {
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
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        text: message.content,
      })
      .catch(err => {
        console.log('Error sharing:', err);
      });
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).format(date);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-2 group`}>
      {!isUser && (
        <div className="w-8 h-8 rounded border border-[#00ff00]/30 bg-black flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-[#00ff00]" />
        </div>
      )}
      <div className="flex flex-col space-y-1">
        <div
          className={`max-w-[80%] rounded px-6 py-4 
            ${isUser
              ? 'bg-[#001100] border border-[#00ff00]/30 text-[#00ff00]'
              : 'bg-black border border-[#00ff00]/30 text-[#00ff00]'
            } font-mono transition-all duration-200 hover:shadow-[0_0_10px_rgba(0,255,0,0.1)]`}
        >
          <div className="text-xs text-[#00ff00]/50 mb-2">
            {isUser ? 'USER' : 'SYSTEM'} @ {formatTime(message.timestamp)}
          </div>
          {isUser ? message.content : formatContent(message.content)}
          
          <div className="mt-2 flex items-center justify-between text-xs text-[#00ff00]/50">
            <div className="flex items-center space-x-2">
              <span>{message.status.toUpperCase()}</span>
              {message.status === 'sending' && <Clock className="w-3 h-3 animate-spin" />}
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleCopy} className="p-1 hover:text-[#00ff00] transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              {typeof navigator.share === 'function' && (
                <button onClick={handleShare} className="p-1 hover:text-[#00ff00] transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        {!isUser && (
          <div className="ml-2">
            <PlayButton text={message.content} />
          </div>
        )}
        {copied && (
          <div className="text-xs text-[#00ff00] mt-1 font-mono">[COPIED TO BUFFER]</div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded border border-[#00ff00]/30 bg-black flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-[#00ff00]" />
        </div>
      )}
    </div>
  );
}