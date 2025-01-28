'use client';

import { Copy, Share2, Clock } from 'lucide-react';
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
                    <span className="flex-1">{point.trim()}</span>
                  </li>
                ))}
              </ul>
            );
          }
          
          return <p key={index}>{section.trim()}</p>;
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
      hour12: true
    }).format(date);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-2 group`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-sm font-medium">AI</span>
        </div>
      )}
      <div className="flex flex-col space-y-1">
        <div
          className={`max-w-[80%] rounded-2xl px-6 py-4 ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm hover:shadow-blue-500/10'
              : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 rounded-bl-sm hover:shadow-gray-500/10'
          } shadow-xl border border-gray-700/50 transition-all duration-200 hover:scale-[1.02]`}
        >
          {isUser ? message.content : formatContent(message.content)}
          
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <span>{formatTime(message.timestamp)}</span>
              {message.status === 'sending' && <Clock className="w-3 h-3 animate-spin" />}
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleCopy} className="p-1 hover:text-blue-400 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              {typeof navigator.share === 'function' && (
                <button onClick={handleShare} className="p-1 hover:text-blue-400 transition-colors">
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
          <div className="text-xs text-blue-400 mt-1">Copied to clipboard!</div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-sm font-medium">You</span>
        </div>
      )}
    </div>
  );
}