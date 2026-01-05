'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioManagerProps {
  onAudioEnabled?: () => void;
  isMuted: boolean;
}

export function AudioManager({ onAudioEnabled, isMuted }: AudioManagerProps) {
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
      }
    };

    tryAutoplay();

    return () => {
      cashCounter.pause();
      bassDrone.pause();
    };
  }, [onAudioEnabled]);

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

export function enableAudio(
  cashCounterRef: React.RefObject<HTMLAudioElement | null>,
  bassDroneRef: React.RefObject<HTMLAudioElement | null>
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!cashCounterRef.current || !bassDroneRef.current) {
      reject(new Error('Audio elements not initialized'));
      return;
    }

    Promise.all([cashCounterRef.current.play(), bassDroneRef.current.play()])
      .then(() => resolve())
      .catch(reject);
  });
}
