/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Level Selection Modal with Star Records & Tactile Cards
 */

import React from 'react';
import { X, Lock, Star, Play } from 'lucide-react';
import { GAME_LEVELS } from '../game/levels.ts';
import { GameSaveData, GameMode } from '../game/types.ts';
import { soundEngine } from '../game/audio.ts';

interface LevelSelectModalProps {
  saveData: GameSaveData;
  gameMode: GameMode;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  saveData,
  onSelectLevel,
  onClose,
}) => {
  const getThemeBadge = (theme: string) => {
    switch (theme) {
      case 'garden':
        return { label: 'Taman Asri', bg: 'bg-emerald-100 text-emerald-800' };
      case 'forest':
        return { label: 'Hutan Pinus', bg: 'bg-teal-100 text-teal-800' };
      case 'cave':
        return { label: 'Gua Kristal', bg: 'bg-indigo-100 text-indigo-800' };
      case 'light':
        return { label: 'Bukit Cahaya', bg: 'bg-amber-100 text-amber-800' };
      case 'star':
        return { label: 'Lembah Bintang', bg: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Petualangan', bg: 'bg-stone-100 text-stone-800' };
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none animate-fadeIn">
      <div className="max-w-xl w-full bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F4] rounded-3xl border-2 border-stone-200 shadow-2xl p-5 sm:p-6 relative max-h-[90vh] flex flex-col animate-popIn">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka',sans-serif] text-stone-800">
              Pilih Level Petualangan
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Selesaikan setiap level untuk mencapai Lembah Bintang!
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level List */}
        <div className="space-y-3 my-4 overflow-y-auto pr-1">
          {GAME_LEVELS.map((level) => {
            const isUnlocked = level.id <= saveData.unlockedLevels;
            const stars = saveData.starsPerLevel[level.id] || 0;
            const badge = getThemeBadge(level.theme);

            return (
              <div
                key={level.id}
                onClick={() => {
                  if (isUnlocked) {
                    soundEngine.playButtonClick();
                    onSelectLevel(level.id);
                  }
                }}
                className={`hud-btn p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isUnlocked
                    ? 'bg-white hover:bg-amber-50/60 border-stone-200 hover:border-amber-300 border-b-3 border-b-stone-300 cursor-pointer shadow-sm active:scale-[0.98]'
                    : 'bg-stone-100/70 border-stone-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Level Number Pill */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                      isUnlocked
                        ? 'bg-gradient-to-b from-[#5D4037] to-[#3E2723] text-white border border-[#8D6E63]'
                        : 'bg-stone-300 text-stone-500'
                    }`}
                  >
                    {isUnlocked ? level.id : <Lock className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-stone-800 text-sm sm:text-base">
                        {level.title}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">
                      {level.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right: Stars & Play Icon */}
                <div className="flex items-center gap-2.5">
                  {isUnlocked ? (
                    <div className="flex items-center gap-0.5">
                      {[0, 1, 2].map((sIdx) => (
                        <Star
                          key={sIdx}
                          className={`w-4 h-4 ${
                            sIdx < stars
                              ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                              : 'text-stone-300 fill-stone-100'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-stone-400">Terkunci</span>
                  )}

                  {isUnlocked && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                      <Play className="w-4 h-4 fill-amber-950 ml-0.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
