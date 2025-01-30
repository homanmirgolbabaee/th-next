'use client';

import { Play, Pause, Loader2, Volume2 } from 'lucide-react';
import { useState, useRef } from 'react';

interface PlayButtonProps {
  text: string;
}

export default function PlayButton({ text }: PlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to generate audio');
        return response.json();
      })
      .then(({ audio }) => {
        const audioUrl = `data:audio/mp3;base64,${audio}`;
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="inline-flex items-center">
      <button
        onClick={handlePlay}
        disabled={isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group
          relative
          p-2
          rounded-full
          bg-gradient-to-r
          from-blue-600
          to-blue-700
          hover:from-blue-500
          hover:to-blue-600
          disabled:from-blue-800
          disabled:to-blue-900
          text-white
          transition-all
          duration-300
          transform
          hover:scale-110
          hover:shadow-lg
          hover:shadow-blue-500/20
          ${isPlaying ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
        `}
      >
        <div className={`
          absolute
          inset-0
          rounded-full
          bg-blue-400/20
          transform
          scale-0
          group-hover:scale-150
          transition-transform
          duration-300
          opacity-0
          group-hover:opacity-100
        `}/>
        
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4 relative z-10" />
        ) : (
          <div className="relative">
            <Volume2 className={`
              h-4
              w-4
              relative
              z-10
              transition-opacity
              duration-300
              ${isHovered ? 'opacity-100' : 'opacity-100'}
            `}/>
          </div>
        )}
      </button>
      
      {/* Tooltip */}
      <div className={`
        ml-2
        text-xs
        text-gray-400
        transition-opacity
        duration-200
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `}>
        {isPlaying ? 'Pause' : 'Listen'}
      </div>

      <audio
        ref={audioRef}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
}