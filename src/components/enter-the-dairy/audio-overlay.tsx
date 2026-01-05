'use client';

interface AudioOverlayProps {
  onEnableSound: () => void;
}

export function AudioOverlay({ onEnableSound }: AudioOverlayProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onEnableSound}
      style={{ cursor: 'pointer' }}
    >
      <div className="text-center">
        <p className="text-xl font-medium text-zinc-50">Tap to enable sound</p>
      </div>
    </div>
  );
}
