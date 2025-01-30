'use client';

import React, { useState, useRef } from 'react';
import { Copy, Share2, Clock, User, Bot, Volume2, Pause, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
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

  const formatMessageContent = (content: string) => {
    // Handle tweet content
    if (content.includes('<tweet>') || content.includes('@')) {
      const tweets = content
        .split('<tweet>')
        .filter(Boolean)
        .map(tweet => tweet.trim());

      return (
        <div className="space-y-4">
          {tweets.map((tweet, index) => (
            <TweetDisplay 
              key={index} 
              tweet={tweet} 
              isCyberpunk={isCyberpunk} 
            />
          ))}
        </div>
      );
    }

    // Handle regular content with markdown
    const sections = content.split('**').filter(Boolean);
    return (
      <div className="space-y-4">
        {sections.map((section, index) => (
          <MarkdownContent 
            key={index} 
            content={section} 
            isCyberpunk={isCyberpunk} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`
      flex ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-2 group
      animate-fade-in
    `}>
      {!isUser && (
        <BotAvatar isCyberpunk={isCyberpunk} />
      )}
      
      <MessageContent
        message={message}
        isCyberpunk={isCyberpunk}
        isUser={isUser}
        onCopy={handleCopy}
        onAudioPlay={handleAudioPlay}
        isPlaying={isPlaying}
        isLoading={isLoading}
        copied={copied}
        formatMessageContent={formatMessageContent}
      />

      {isUser && (
        <UserAvatar isCyberpunk={isCyberpunk} />
      )}
      
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
};

// Sub-components
const BotAvatar = ({ isCyberpunk }: { isCyberpunk: boolean }) => (
  <div className={`
    w-8 h-8 rounded flex items-center justify-center flex-shrink-0
    ${isCyberpunk
      ? 'border border-[#00ff00]/30 bg-black'
      : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'}
  `}>
    <Bot className={`w-5 h-5 ${isCyberpunk ? 'text-[#00ff00]' : 'text-white'}`} />
  </div>
);

const UserAvatar = ({ isCyberpunk }: { isCyberpunk: boolean }) => (
  <div className={`
    w-8 h-8 rounded flex items-center justify-center flex-shrink-0
    ${isCyberpunk
      ? 'border border-[#00ff00]/30 bg-black'
      : 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg'}
  `}>
    <User className={`w-5 h-5 ${isCyberpunk ? 'text-[#00ff00]' : 'text-white'}`} />
  </div>
);

const TweetDisplay = ({ tweet, isCyberpunk }: { tweet: string; isCyberpunk: boolean }) => {
  const lines = tweet.split('\n').filter(Boolean);
  const tweetContent = lines[0];
  const metadata = lines.slice(1);
  const authorLine = metadata.find(line => line.includes('by @'));
  const author = authorLine 
    ? '@' + authorLine.split('@')[1].split(' at ')[0].trim()
    : '';
  const timestamp = authorLine
    ? authorLine.split(' at ')[1]?.split('\n')[0]
    : '';

  return (
    <div className={`
      p-4 rounded-lg transition-all duration-200
      ${isCyberpunk 
        ? 'border border-[#00ff00]/30 bg-black/30 hover:bg-[#001100]/50' 
        : 'border border-blue-500/30 bg-blue-900/20 hover:bg-blue-900/30'}
    `}>
      {author && (
        <div className="flex items-center space-x-2 mb-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${isCyberpunk
              ? 'border border-[#00ff00]/30 bg-black'
              : 'bg-blue-600'}
          `}>
            <span className={`text-sm ${isCyberpunk ? 'text-[#00ff00]' : 'text-white'}`}>
              {author.charAt(1).toUpperCase()}
            </span>
          </div>
          <div>
            <p className={`text-sm font-medium ${isCyberpunk ? 'text-[#00ff00]' : 'text-white'}`}>
              {author}
            </p>
            {timestamp && (
              <p className={`text-xs ${isCyberpunk ? 'text-[#00ff00]/70' : 'text-gray-400'}`}>
                {new Date(timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      <p className={`
        text-lg mb-2
        ${isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-white'}
      `}>
        {tweetContent}
      </p>

      <div className={`
        text-xs space-y-1
        ${isCyberpunk ? 'text-[#00ff00]/70 font-mono' : 'text-gray-400'}
      `}>
        {metadata.map((line, i) => (
          <div key={i} className="flex items-center space-x-2">
            {line.includes('Conversation ID:') ? (
              <span className={isCyberpunk ? 'font-mono' : ''}>
                🔗 {line.trim()}
              </span>
            ) : !line.includes('by @') && (
              <span>{line.trim()}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MarkdownContent = ({ content, isCyberpunk }: { content: string; isCyberpunk: boolean }) => {
  if (content.endsWith('***')) {
    return (
      <h3 className={`
        text-lg font-bold mt-4
        ${isCyberpunk 
          ? 'text-[#00ff00] font-mono' 
          : 'text-blue-300'}
      `}>
        {content.replace('***', '')}
      </h3>
    );
  }
  
  const points = content.split('* ').filter(Boolean);
  if (points.length > 1) {
    return (
      <ul className="space-y-2">
        {points.map((point, pointIndex) => (
          <li key={pointIndex} className="flex items-start space-x-2">
            <span className={`
              ${isCyberpunk ? 'text-[#00ff00] mt-1' : 'text-blue-400 mt-1'}
            `}>
              {isCyberpunk ? '>' : '•'}
            </span>
            <span className="flex-1">{point.trim()}</span>
          </li>
        ))}
      </ul>
    );
  }
  
  return (
    <p className={isCyberpunk ? 'font-mono' : 'text-gray-200'}>
      {content.trim()}
    </p>
  );
};

const MessageContent = ({
  message,
  isCyberpunk,
  isUser,
  onCopy,
  onAudioPlay,
  isPlaying,
  isLoading,
  copied,
  formatMessageContent
}: {
  message: Message;
  isCyberpunk: boolean;
  isUser: boolean;
  onCopy: () => void;
  onAudioPlay: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  copied: boolean;
  formatMessageContent: (content: string) => React.ReactNode;
}) => (
  <div className="flex flex-col space-y-1">
    <div className={`
      relative rounded-lg px-6 py-4
      ${isCyberpunk
        ? `bg-black border border-[#00ff00]/30 text-[#00ff00]
           ${message.status === 'error' ? 'border-red-500/30' : ''}`
        : `${isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
            : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 rounded-bl-sm'
          } shadow-xl border border-gray-700/50
          ${message.status === 'error' ? 'border-red-500/50' : ''}`
      }
    `}>
      {formatMessageContent(message.content)}
      
      <MessageFooter
        message={message}
        isCyberpunk={isCyberpunk}
        isUser={isUser}
        onCopy={onCopy}
        onAudioPlay={onAudioPlay}
        isPlaying={isPlaying}
        isLoading={isLoading}
      />
    </div>
    
    {copied && (
      <div className={`
        text-xs mt-1
        ${isCyberpunk ? 'text-[#00ff00] font-mono' : 'text-blue-400'}
      `}>
        {isCyberpunk ? '[COPIED TO BUFFER]' : 'Copied to clipboard!'}
      </div>
    )}
  </div>
);

const MessageFooter = ({
  message,
  isCyberpunk,
  isUser,
  onCopy,
  onAudioPlay,
  isPlaying,
  isLoading
}: {
  message: Message;
  isCyberpunk: boolean;
  isUser: boolean;
  onCopy: () => void;
  onAudioPlay: () => void;
  isPlaying: boolean;
  isLoading: boolean;
}) => (
  <div className="mt-2 flex items-center justify-between text-xs">
    <div className="flex items-center space-x-2">
      <span className={isCyberpunk ? 'text-[#00ff00]/50' : 'text-gray-400'}>
        {new Intl.DateTimeFormat('en', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: !isCyberpunk
        }).format(message.timestamp)}
      </span>
      {message.status === 'sending' && (
        <Clock className={`w-3 h-3 animate-spin ${isCyberpunk ? 'text-[#00ff00]/50' : 'text-gray-400'}`} />
      )}
    </div>
    
    <div className="flex items-center space-x-3">
      {!isUser && (
        <button
          onClick={onAudioPlay}
          disabled={isLoading}
          className={`
            p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100
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
        onClick={onCopy}
        className={`
          p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100
          ${isCyberpunk ? 'hover:text-[#00ff00]' : 'hover:text-blue-400'}
        `}
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>  
  </div>
);

export default MessageBubble;