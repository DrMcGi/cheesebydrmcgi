'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioManagerProps {
  onAudioEnabled?: () => void;
  onAudioFailed?: () => void;
  isMuted: boolean;
}

export function AudioManager({ onAudioEnabled, onAudioFailed, isMuted }: AudioManagerProps) {
  const cashCounterRef = useRef<HTMLAudioElement | null>(null);
  const bassDroneRef = useRef<HTMLAudioElement | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create audio elements
    const cashCounter = new Audio('/audio/cash-counter.mp3');
    const bassDrone = new Audio('/audio/low-bass-drone.mp3');

    cashCounter.loop = true;
    bassDrone.loop = true;
    cashCounter.volume = 0.5;
    bassDrone.volume = 0.3;

    cashCounterRef.current = cashCounter;
    bassDroneRef.current = bassDrone;

    // Try autoplay
    const tryAutoplay = async () => {
      try {
        await Promise.all([cashCounter.play(), bassDrone.play()]);
        setInitialized(true);
        onAudioEnabled?.();
      } catch (error) {
        // Autoplay blocked, user needs to interact
        console.log('Autoplay blocked, waiting for user interaction');
        onAudioFailed?.();
      }
    };

    tryAutoplay();

    return () => {
      cashCounter.pause();
      bassDrone.pause();
    };
  }, [onAudioEnabled, onAudioFailed]);

  useEffect(() => {
    if (!cashCounterRef.current || !bassDroneRef.current) return;

    if (isMuted) {
      cashCounterRef.current.pause();
      bassDroneRef.current.pause();
    } else if (initialized) {
      cashCounterRef.current.play().catch(() => {});
      bassDroneRef.current.play().catch(() => {});
    }
  }, [isMuted, initialized]);

  return null;
}
