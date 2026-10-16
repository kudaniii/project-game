/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Pause Menu Modal with Tactile Buttons
 */

import React from 'react';
import { Play, RotateCcw, Home, Settings } from 'lucide-react';
import { soundEngine } from '../game/audio.ts';

interface PauseModalProps {
  levelTitle: string;
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  levelTitle,
  onResume,
  onRestart,
  onOpenSettings,
  onHome,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="max-w-xs w-full bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F4] rounded-3xl border-2 border-stone-200 shadow-2xl p-6 text-center animate-popIn">
        {/* Title */}
        <h2 className="text-2xl font-bold font-['Fredoka',sans-serif] text-stone-800 mb-0.5">
          Permainan Dijeda
        </h2>
        <p className="text-xs text-stone-500 font-medium mb-5">
          {levelTitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onResume();
            }}
            className="hud-btn flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#4E342E] hover:to-[#2E1C14] border border-[#8D6E63] border-b-4 border-b-[#27150F] text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Lanjutkan Main</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onRestart();
            }}
            className="hud-btn flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-b from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-amber-950 font-bold rounded-2xl border border-amber-300 border-b-3 border-b-amber-500 transition-all active:scale-95 text-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-800" />
            <span>Mulai Ulang Level Ini</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenSettings();
            }}
            className="hud-btn flex items-center justify-center gap-2 py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl border border-stone-200 border-b-3 border-b-stone-300 transition-all active:scale-95 text-xs cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Suara</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onHome();
            }}
            className="hud-btn flex items-center justify-center gap-2 py-2.5 px-5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-2xl border border-red-200 border-b-3 border-b-red-300 transition-all active:scale-95 text-xs mt-1 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
