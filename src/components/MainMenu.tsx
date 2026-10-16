/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * Main Menu Screen with Local Co-op, Online Multiplayer, Solo Practice, and Device Controls
 */

import React from 'react';
import {
  Play,
  RotateCcw,
  ListFilter,
  HelpCircle,
  Settings,
  Award,
  Heart,
  Sparkles,
  Users,
  Smartphone,
  Monitor,
  User,
  Wifi,
} from 'lucide-react';
import { GameSaveData, GameMode } from '../game/types.ts';
import { soundEngine } from '../game/audio.ts';

interface MainMenuProps {
  saveData: GameSaveData;
  playerName: string;
  onPlay: (levelId: number, mode: GameMode) => void;
  onContinue: (levelId: number) => void;
  onOpenOnlineLobby: () => void;
  onOpenProfile: () => void;
  onOpenLevelSelect: () => void;
  onOpenCharacterIntro: () => void;
  onOpenSettings: () => void;
  onOpenCredits: () => void;
  onOpenDeviceSelect: () => void;
  onSelectDevice?: (device: 'pc' | 'mobile') => void;
  gameMode: GameMode;
  onToggleGameMode: (mode: GameMode) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  saveData,
  playerName,
  onPlay,
  onContinue,
  onOpenOnlineLobby,
  onOpenProfile,
  onOpenLevelSelect,
  onOpenCharacterIntro,
  onOpenSettings,
  onOpenCredits,
  onOpenDeviceSelect,
  onSelectDevice,
  gameMode,
  onToggleGameMode,
}) => {
  const handleAction = (cb: () => void) => {
    soundEngine.userInteracted();
    soundEngine.playButtonClick();
    cb();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 sm:p-5 md:p-8 overflow-y-auto select-none bg-gradient-to-b from-[#F2F9F6] via-[#FAF6F0] to-[#FCEEEA]">
      
      {/* Decorative Pastel Background Circles */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-pink-100/60 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-teal-100/50 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-amber-100/60 blur-3xl pointer-events-none"></div>

      {/* Top Header Row: Profile Badge & Tagline */}
      <div className="z-10 w-full max-w-lg flex justify-between items-center gap-2 mt-1">
        <button
          type="button"
          onClick={() => handleAction(onOpenProfile)}
          className="hud-btn flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-stone-200/90 shadow-xs text-xs font-bold text-stone-700 hover:text-stone-900 active:scale-95 cursor-pointer"
        >
          <User className="w-3.5 h-3.5 text-amber-700" />
          <span>{playerName || 'Profil Petualang'}</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-stone-200/90 shadow-xs text-xs font-bold text-stone-600">
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
          <span>Co-op 2D Adventure</span>
        </div>
      </div>

      {/* Main Brand Title & Animated Couple Art */}
      <div className="z-10 flex flex-col items-center text-center my-auto max-w-lg w-full">
        
        {/* Title Logo */}
        <h1 className="font-['Fredoka',sans-serif] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#4A3B32] drop-shadow-sm leading-tight">
          Bubu <span className="text-pink-500">&</span> Dudu
        </h1>
        <p className="text-stone-600 font-bold text-sm sm:text-base mt-0.5 flex items-center gap-1.5">
          <span>A Cozy Co-op Adventure</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </p>

        {/* Adorable SVG Character Centerpiece */}
        <div className="my-2.5 sm:my-3.5 relative flex items-center justify-center">
          <div className="w-56 h-28 sm:h-32 relative flex items-center justify-center">
            {/* Glowing Heart Aura */}
            <div className="absolute w-44 h-24 bg-pink-200/60 rounded-full filter blur-xl animate-pulse"></div>

            {/* Bubu (Brown Bear) SVG */}
            <svg
              className="w-24 h-24 sm:w-26 sm:h-26 transform -translate-x-3 sm:-translate-x-4 animate-bounce"
              style={{ animationDuration: '3s' }}
              viewBox="0 0 100 100"
            >
              <ellipse cx="50" cy="55" rx="35" ry="32" fill="#9A6B56" />
              <ellipse cx="50" cy="60" rx="20" ry="22" fill="#F5DDCB" />
              {/* Ears */}
              <circle cx="25" cy="25" r="14" fill="#9A6B56" />
              <circle cx="25" cy="25" r="8" fill="#F5DDCB" />
              <circle cx="75" cy="25" r="14" fill="#9A6B56" />
              <circle cx="75" cy="25" r="8" fill="#F5DDCB" />
              {/* Head */}
              <circle cx="50" cy="38" r="30" fill="#9A6B56" />
              {/* Muzzle */}
              <ellipse cx="50" cy="46" rx="15" ry="11" fill="#F5DDCB" />
              <ellipse cx="50" cy="42" rx="5" ry="3.5" fill="#422419" />
              {/* Eyes */}
              <circle cx="40" cy="36" r="3.5" fill="#422419" />
              <circle cx="39" cy="34" r="1.2" fill="#FFFFFF" />
              <circle cx="60" cy="36" r="3.5" fill="#422419" />
              <circle cx="59" cy="34" r="1.2" fill="#FFFFFF" />
              {/* Blush */}
              <circle cx="33" cy="44" r="5" fill="#FF8A80" opacity="0.6" />
              <circle cx="67" cy="44" r="5" fill="#FF8A80" opacity="0.6" />
            </svg>

            {/* Cute floating heart between them */}
            <div className="absolute -top-2 text-pink-500 animate-pulse">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-pink-500 drop-shadow-md" />
            </div>

            {/* Dudu (White Bunny) SVG */}
            <svg
              className="w-24 h-24 sm:w-26 sm:h-26 transform translate-x-3 sm:translate-x-4 animate-bounce"
              style={{ animationDuration: '2.6s', animationDelay: '0.4s' }}
              viewBox="0 0 100 100"
            >
              <ellipse cx="50" cy="55" rx="32" ry="30" fill="#FFFFFF" stroke="#E2D9D2" strokeWidth="2" />
              {/* Bunny Ears */}
              <ellipse cx="36" cy="16" rx="8" ry="20" fill="#FFFFFF" stroke="#E2D9D2" strokeWidth="2" />
              <ellipse cx="36" cy="18" rx="4.5" ry="14" fill="#FFB6C1" />
              <ellipse cx="64" cy="16" rx="8" ry="20" fill="#FFFFFF" stroke="#E2D9D2" strokeWidth="2" />
              <ellipse cx="64" cy="18" rx="4.5" ry="14" fill="#FFB6C1" />
              {/* Head */}
              <circle cx="50" cy="40" r="28" fill="#FFFFFF" stroke="#E2D9D2" strokeWidth="2" />
              {/* Nose */}
              <polygon points="50,46 46,41 54,41" fill="#FF758F" />
              {/* Eyes */}
              <circle cx="41" cy="38" r="3.2" fill="#4A3B32" />
              <circle cx="40" cy="36.5" r="1.2" fill="#FFFFFF" />
              <circle cx="59" cy="38" r="3.2" fill="#4A3B32" />
              <circle cx="58" cy="36.5" r="1.2" fill="#FFFFFF" />
              {/* Blush */}
              <circle cx="33" cy="45" r="5.5" fill="#FFAAA6" opacity="0.65" />
              <circle cx="67" cy="45" r="5.5" fill="#FFAAA6" opacity="0.65" />
            </svg>
          </div>
        </div>

        {/* DEVICE MODE DIRECT SELECTION BUTTONS */}
        <div className="mb-2.5 w-full max-w-xs bg-white/95 p-1.5 rounded-2xl border-2 border-stone-200/90 shadow-sm flex flex-col gap-1">
          <div className="flex items-center justify-between px-2 pt-0.5 text-[11px] font-bold text-stone-600">
            <span>Perangkat Bermain:</span>
            <span className="text-[10px] text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
              {saveData.settings.showTouchControls ? '📱 Layar Sentuh Aktif' : '💻 Keyboard PC'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                if (onSelectDevice) onSelectDevice('mobile');
                else onOpenDeviceSelect();
              }}
              className={`hud-btn flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                saveData.settings.showTouchControls
                  ? 'bg-gradient-to-b from-pink-500 to-rose-600 text-white shadow-md border-b-2 border-rose-800'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-b-2 border-stone-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>HP / Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                if (onSelectDevice) onSelectDevice('pc');
                else onOpenDeviceSelect();
              }}
              className={`hud-btn flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                !saveData.settings.showTouchControls
                  ? 'bg-gradient-to-b from-[#5D4037] to-[#3E2723] text-white shadow-md border-b-2 border-[#27150F]'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-b-2 border-stone-300'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Komputer / PC</span>
            </button>
          </div>
        </div>

        {/* PRIMARY GAMEPLAY ENTRY BUTTONS */}
        <div className="flex flex-col gap-2 w-full max-w-xs">
          
          {/* 1. MULTIPLAYER ONLINE CO-OP (FEATURED!) */}
          <button
            type="button"
            onClick={() => handleAction(onOpenOnlineLobby)}
            className="hud-btn group flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-b from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold rounded-2xl border border-teal-300 border-b-4 border-b-teal-900 shadow-lg transition-all text-sm cursor-pointer active:scale-95"
          >
            <Wifi className="w-4 h-4 text-teal-100 animate-pulse" />
            <span>Multiplayer Online Co-op</span>
            <span className="text-[10px] bg-teal-900/40 text-teal-100 px-1.5 py-0.2 rounded font-bold shadow-inner">
              2 HP / PC
            </span>
          </button>

          {/* 2. LOCAL CO-OP (1 PERANGKAT 2 ORANG) */}
          <button
            type="button"
            onClick={() => handleAction(() => onPlay(1, 'two_player'))}
            className="hud-btn flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#4E342E] hover:to-[#2E1C14] border border-[#8D6E63] border-b-4 border-b-[#27150F] active:scale-95 text-white font-extrabold rounded-2xl shadow-md transition-all text-sm cursor-pointer"
          >
            <Users className="w-4 h-4 text-pink-300" />
            <span>Mode 2 Pemain Lokal</span>
          </button>

          {/* 3. SOLO PRACTICE MODE (1 PEMAIN) */}
          <button
            type="button"
            onClick={() => handleAction(() => onPlay(1, 'practice'))}
            className="hud-btn flex items-center justify-center gap-2 py-2.5 px-6 bg-gradient-to-b from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-950 font-bold rounded-2xl border border-purple-200 border-b-3 border-b-purple-400 shadow-xs transition-all text-xs cursor-pointer active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-purple-700" />
            <span>Mode Latihan (Solo)</span>
          </button>

          {/* 4. Continue Button if progress exists */}
          {saveData.unlockedLevels > 1 && (
            <button
              type="button"
              onClick={() => handleAction(() => onContinue(saveData.currentLevel))}
              className="hud-btn flex items-center justify-center gap-2 py-2 px-5 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 font-bold rounded-xl border border-amber-300 border-b-2 border-b-amber-500 shadow-xs transition-all text-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Lanjutkan (Level {saveData.currentLevel})</span>
            </button>
          )}

          {/* Navigation Links: Level Select & Controls */}
          <div className="grid grid-cols-2 gap-1.5 mt-0.5">
            <button
              type="button"
              onClick={() => handleAction(onOpenLevelSelect)}
              className="hud-btn flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-stone-50 active:scale-95 text-stone-800 font-bold rounded-xl border border-stone-200 border-b-2 border-b-stone-300 shadow-xs transition-all text-xs cursor-pointer"
            >
              <ListFilter className="w-3.5 h-3.5 text-stone-600" />
              <span>Pilih Level</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction(onOpenCharacterIntro)}
              className="hud-btn flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-stone-50 active:scale-95 text-stone-800 font-bold rounded-xl border border-stone-200 border-b-2 border-b-stone-300 shadow-xs transition-all text-xs cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Panduan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Navigation: Settings, Credits & Author */}
      <footer className="z-10 flex flex-wrap justify-center items-center gap-3.5 text-xs font-semibold text-stone-600 my-1">
        <button
          type="button"
          onClick={() => handleAction(onOpenSettings)}
          className="flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Pengaturan</span>
        </button>
        <span className="text-stone-300">·</span>
        <button
          type="button"
          onClick={() => handleAction(onOpenCredits)}
          className="flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Kredit</span>
        </button>
        <span className="text-stone-300">·</span>
        <span className="text-stone-500 font-medium">
          Dibuat oleh <strong className="text-stone-700">Dani</strong>
        </span>
      </footer>
    </div>
  );
};
