import { useEffect, useRef } from 'react';
import { IAudioProps } from './Audio.interface';

export function AudioComponent({ src }: IAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return <audio ref={audioRef} src={src} preload="auto" autoPlay />;
}
