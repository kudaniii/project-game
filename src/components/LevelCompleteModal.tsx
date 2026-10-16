/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Level Complete Victory Modal with Star Ratings & Cute Quotes
 */

import React from 'react';
import { Star, ChevronRight, RotateCcw, Home, Heart, Sparkles } from 'lucide-react';
import { soundEngine } from '../game/audio.ts';

interface LevelCompleteModalProps {
  levelId: number;
  levelTitle: string;
  starsEarned: number;
  flowersEarned: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelId,
  levelTitle,
  starsEarned,
  onNextLevel,
  onReplay,
  onHome,
}) => {
  const quotes = [
    'Bubu & Dudu saling melengkapi dengan begitu indah!',
    'Bersama-sama, tidak ada rintangan yang tak bisa dilewati!',
    'Langkah demi langkah, cinta dan kerja sama membawa mereka semakin dekat!',
    'Pelukan hangat menanti di ujung setiap petualangan!',
    'Dua hati bersatu membuka pintu keajaiban!',
  ];
  const currentQuote = quotes[(levelId - 1) % quotes.length];

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="max-w-sm w-full bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F4] rounded-3xl border-2 border-stone-200 shadow-2xl p-6 text-center relative overflow-hidden animate-popIn">
        
        {/* Soft pink festive glow background */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-pink-200/50 rounded-full blur-2xl pointer-events-none"></div>

        {/* Celebration Badges & Icons */}
        <div className="flex justify-center items-center gap-2 mb-2">
          <span className="text-3xl">🐻</span>
          <Heart className="w-7 h-7 text-pink-500 fill-pink-500 animate-bounce" />
          <span className="text-3xl">🐰</span>
        </div>

        <h2 className="text-2xl font-bold text-stone-800 font-['Fredoka',sans-serif]">
          Level Berhasil Selesai!
        </h2>
        <p className="text-xs text-stone-500 font-medium mb-4">
          {levelTitle}
        </p>

        {/* Stars Earned */}
        <div className="flex justify-center items-center gap-2.5 py-3.5 px-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 shadow-inner mb-4">
          {[0, 1, 2].map((sIdx) => (
            <Star
              key={sIdx}
              className={`w-9 h-9 transition-transform ${
                sIdx < starsEarned
                  ? 'fill-amber-400 text-amber-500 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)] scale-110'
                  : 'text-stone-300 fill-stone-100'
              }`}
            />
          ))}
        </div>

        {/* Romantic / Cute Quote */}
        <p className="text-xs text-stone-600 font-semibold italic mb-5 px-2 leading-relaxed">
          "{currentQuote}"
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onNextLevel();
            }}
            className="hud-btn flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#4E342E] hover:to-[#2E1C14] border border-[#8D6E63] border-b-4 border-b-[#27150F] active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-sm cursor-pointer"
          >
            <span>{levelId < 5 ? 'Lanjut ke Level Berikutnya' : 'Buka Ending Romantis!'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                onReplay();
              }}
              className="hud-btn flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl border border-stone-200 border-b-3 border-b-stone-300 transition-all active:scale-95 text-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Main Ulang</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                onHome();
              }}
              className="hud-btn flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl border border-stone-200 border-b-3 border-b-stone-300 transition-all active:scale-95 text-xs cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Menu Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
