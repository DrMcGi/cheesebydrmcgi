'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { AudioManager } from './audio-manager';
import { AudioOverlay } from './audio-overlay';
import { MuteToggle } from './mute-toggle';

export function EnterTheDairyLanding() {
  const router = useRouter();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const audioInitAttempted = useRef(false);

  const handleAudioEnabled = () => {
    setAudioEnabled(true);
    setShowAudioPrompt(false);
  };

  const handleAudioFailed = () => {
    if (!audioInitAttempted.current) {
      audioInitAttempted.current = true;
      setShowAudioPrompt(true);
    }
  };

  const enableSound = async () => {
    setShowAudioPrompt(false);
    setAudioEnabled(true);
  };

  const handleImHungry = async () => {
    if (isCreatingSession) return;
    
    setIsCreatingSession(true);
    try {
      const supabase = createSupabaseBrowserClient();
      
      // Create an anonymous session
      const { error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('Failed to create anonymous session:', error);
        // Still route to vaults even if anonymous session fails
      }
      
      router.push('/vaults');
    } catch (error) {
      console.error('Error creating session:', error);
      router.push('/vaults');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleImAlreadyEating = () => {
    router.push('/login');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black"
        style={{
          cursor: 'url(/cursor/cheese-cursor.svg) 8 6, auto',
        }}
      >
        {/* Grain overlay */}
        <div
          className="pointer-events-none fixed inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: 'url(/img/grain.png)',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Main content */}
        <div className="relative flex h-full items-center justify-center">
          <div className="space-y-12 text-center">
            <h1 className="text-5xl font-light tracking-tight text-zinc-50 sm:text-6xl">
              How much Cheese you got?
            </h1>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleImHungry}
                disabled={isCreatingSession}
                className="rounded-md bg-zinc-50 px-8 py-4 text-lg font-medium text-zinc-950 transition-opacity hover:bg-zinc-100 disabled:opacity-50"
              >
                {isCreatingSession ? 'Opening...' : "I&apos;m Hungry"}
              </button>
              <button
                type="button"
                onClick={handleImAlreadyEating}
                className="rounded-md border border-zinc-700 bg-transparent px-8 py-4 text-lg font-medium text-zinc-50 transition-colors hover:border-zinc-600 hover:bg-zinc-900/50"
              >
                I&apos;m Already Eating
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audio components */}
      <AudioManager 
        onAudioEnabled={handleAudioEnabled}
        onAudioFailed={handleAudioFailed}
        isMuted={isMuted}
      />
      
      {showAudioPrompt && <AudioOverlay onEnableSound={enableSound} />}
      
      {audioEnabled && <MuteToggle isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />}
    </>
  );
}
