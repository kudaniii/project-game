/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * Player Profile and Progress Statistics Modal
 */

import React, { useState } from 'react';
import { X, User, Star, Trophy, Award, Sparkles, Check } from 'lucide-react';
import { GameSaveData } from '../game/types.ts';
import { storageManager } from '../game/storage.ts';
import { soundEngine } from '../game/audio.ts';

interface ProfileModalProps {
  saveData: GameSaveData;
  onUpdateName?: (name: string) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  saveData,
  onUpdateName,
  onClose,
}) => {
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('bubu_dudu_player_name') || 'Petualang Clover';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Total stars calculated
  const totalStars = Object.values(saveData.starsPerLevel).reduce((acc, curr) => acc + curr, 0);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = playerName.trim() || 'Petualang';
    localStorage.setItem('bubu_dudu_player_name', cleanName);
    if (onUpdateName) onUpdateName(cleanName);
    soundEngine.playCollectStar();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="max-w-md w-full bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F4] rounded-3xl border-2 border-stone-200 shadow-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col animate-popIn">
        
        {/* Soft Ambient Glow */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-amber-200/50 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Profil Petualang</span>
          </div>
          <h2 className="text-2xl font-bold font-['Fredoka',sans-serif] text-stone-800">
            Dua Hati, Satu Petualangan
          </h2>
        </div>

        {/* Player Name Form */}
        <form onSubmit={handleSaveName} className="mb-4 bg-white p-3.5 rounded-2xl border-2 border-stone-200 shadow-xs">
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Nama Panggilan:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
              className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="hud-btn px-4 py-1.5 bg-[#4A3B32] hover:bg-[#382B24] text-white font-bold text-xs rounded-xl flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
              <span>{savedSuccess ? 'Tersimpan!' : 'Simpan'}</span>
            </button>
          </div>
        </form>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold block">Level Terbuka</span>
              <span className="text-base font-black text-amber-950">
                {saveData.unlockedLevels} / 5 Level
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold block">Total Bintang</span>
              <span className="text-base font-black text-amber-950">
                {totalStars} / 15 ★
              </span>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-3 mb-4">
          <span className="text-[11px] font-bold text-stone-600 block mb-2">
            Pencapaian Kooperatif:
          </span>
          <div className="space-y-1.5 text-xs text-stone-700">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>🌱</span>
                <span>Taman Pertama</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600">
                {saveData.unlockedLevels >= 2 ? 'Tercapai ✓' : 'Belum'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>🌲</span>
                <span>Jembatan Hutan</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600">
                {saveData.unlockedLevels >= 3 ? 'Tercapai ✓' : 'Belum'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>✨</span>
                <span>Lembah Bintang Abadi</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600">
                {saveData.completedStory ? 'Tercapai ✓' : 'Belum'}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="hud-btn px-6 py-2 bg-[#4A3B32] hover:bg-[#382B24] text-white font-bold rounded-2xl text-xs transition-all active:scale-95 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
