'use client';

import PlayButton from './PlayButton';

interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

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

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start space-x-2`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-sm font-medium">AI</span>
        </div>
      )}
      <div className="flex flex-col space-y-2">
        <div
          className={`max-w-[80%] rounded-2xl px-6 py-4 ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
              : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 rounded-bl-sm'
          } shadow-xl border border-gray-700/50`}
        >
          {isUser ? message.content : formatContent(message.content)}
        </div>
        {!isUser && (
          <div className="ml-2">
            <PlayButton text={message.content} />
          </div>
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