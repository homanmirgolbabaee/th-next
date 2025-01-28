'use client';

import { Play, Pause, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';

interface PlayButtonProps {
  text: string;
}

export default function PlayButton({ text }: PlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const { audio } = await response.json();
      const audioUrl = `data:audio/mp3;base64,${audio}`;
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="inline-flex items-center">
      <button
        onClick={handlePlay}
        disabled={isLoading}
        className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white transition-colors duration-200"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
}