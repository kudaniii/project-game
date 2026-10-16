/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * Orientation Warning Banner for Mobile Portrait View
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, X } from 'lucide-react';
import { soundEngine } from '../game/audio.ts';

export const OrientationWarning: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if width < height and on mobile/small screen
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 768;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait || dismissed) return null;

  return (
    <div className="absolute top-2 left-2 right-2 z-50 pointer-events-auto bg-amber-950/85 backdrop-blur-md text-amber-100 p-2.5 rounded-2xl border border-amber-500/50 shadow-2xl flex items-center justify-between gap-2 text-xs select-none animate-fadeIn">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-500/30 flex items-center justify-center shrink-0">
          <RotateCw className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <p className="font-semibold leading-tight">
          <strong className="text-white">Putar ke Landscape!</strong> Pengalaman bermain 16:9 jauh lebih luas & seru.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          soundEngine.playButtonClick();
          setDismissed(true);
        }}
        className="hud-btn shrink-0 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold active:scale-95"
      >
        Tutup
      </button>
    </div>
  );
};
