'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function EnterTheDairyLanding() {
  const router = useRouter();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const handleImHungry = async () => {
    if (isCreatingSession) return;
    
    setIsCreatingSession(true);
    try {
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
                {isCreatingSession ? 'Opening...' : 'I’m Hungry'}
              </button>
              <button
                type="button"
                onClick={handleImAlreadyEating}
                className="rounded-md border border-zinc-700 bg-transparent px-8 py-4 text-lg font-medium text-zinc-50 transition-colors hover:border-zinc-600 hover:bg-zinc-900/50"
              >
                I’m Already Eating
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
