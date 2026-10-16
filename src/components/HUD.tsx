/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * Gameplay HUD: Highly Attractive, Tactile 3D Buttons, Online Indicator & Reaction Emotes
 */

import React, { useState } from 'react';
import {
  Pause,
  Star,
  HelpCircle,
  Gamepad2,
  Volume2,
  VolumeX,
  Key,
  RotateCcw,
  Target,
  Sparkles,
  Smartphone,
  Monitor,
  Repeat,
  Lightbulb,
  Wifi,
  Heart,
  Smile,
} from 'lucide-react';
import { PlayerState, GameMode } from '../game/types.ts';
import { soundEngine } from '../game/audio.ts';
import { inputManager } from '../game/input.ts';
import { multiplayerClient } from '../multiplayer/MultiplayerClient.ts';

interface HUDProps {
  levelTitle: string;
  levelSubtitle: string;
  hintText: string;
  objectiveText?: string;
  hintSteps?: {
    bubu: string;
    dudu: string;
    puzzle: string;
    chasmTip?: string;
  };
  bubu: PlayerState;
  dudu: PlayerState;
  starsCollected: number;
  gameMode: GameMode;
  isOnline?: boolean;
  myOnlineChar?: 'bubu' | 'dudu';
  pingMs?: number;
  deviceMode: 'pc' | 'mobile';
  showTouchControls: boolean;
  onToggleTouchControls: () => void;
  onToggleDeviceMode?: () => void;
  onResetCrates?: () => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  levelTitle,
  objectiveText,
  hintSteps,
  bubu,
  dudu,
  starsCollected,
  gameMode,
  isOnline = false,
  myOnlineChar = 'bubu',
  pingMs = 0,
  deviceMode,
  showTouchControls,
  onToggleTouchControls,
  onToggleDeviceMode,
  onResetCrates,
  onPause,
}) => {
  const [showHintModal, setShowHintModal] = useState(false);
  const [practiceChar, setPracticeChar] = useState<'bubu' | 'dudu'>(
    inputManager.getActivePracticeChar()
  );
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    soundEngine.playButtonClick();
  };

  const handleTogglePracticeChar = () => {
    const next = inputManager.togglePracticeChar();
    setPracticeChar(next);
    soundEngine.playButtonClick();
  };

  const handleHintClick = () => {
    soundEngine.playButtonClick();
    setShowHintModal(!showHintModal);
  };

  const handleSendEmote = (emote: 'heart' | 'star' | 'happy') => {
    soundEngine.playCollectStar();
    if (isOnline) {
      multiplayerClient.sendEmote(emote);
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* TOP FLOATING HUD BAR (SAFE-AREA OPTIMIZED FOR ALL DEVICES) */}
      {/* ======================================================== */}
      <header className="absolute top-0 left-0 right-0 p-2 sm:p-3 md:p-4 pt-[max(0.6rem,env(safe-area-inset-top))] px-[max(0.6rem,env(safe-area-inset-left))] pr-[max(0.6rem,env(safe-area-inset-right))] flex flex-wrap gap-2 justify-between items-center pointer-events-none z-30 select-none">
        
        {/* --- LEFT CLUSTER: LEVEL BADGE, STARS, ONLINE STATUS, OBJECTIVE --- */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
          
          {/* LEVEL BADGE WITH WOODEN/GOLD TEXTURE & STARS */}
          <div className="hud-btn bg-gradient-to-b from-[#FFFDF9] to-[#F5ECE5] border-2 border-[#D7CCC8] border-b-4 border-b-[#BCAAA4] px-3 py-1.5 rounded-2xl flex items-center gap-2.5 shadow-md">
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs font-bold text-[#4A3B32] leading-tight flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                <span>{levelTitle}</span>
              </span>
              {/* Stars Score */}
              <div className="flex items-center gap-0.5 mt-0.5">
                {[0, 1, 2].map((idx) => {
                  const isEarned = idx < starsCollected;
                  return (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 transition-all ${
                        isEarned
                          ? 'fill-amber-400 text-amber-500 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)] scale-110'
                          : 'text-stone-300 fill-stone-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* ONLINE CO-OP CONNECTION STATUS BADGE */}
          {isOnline ? (
            <div className="hud-btn bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-2 border-teal-300 border-b-3 border-b-teal-800 px-2.5 py-1 rounded-2xl flex items-center gap-1.5 text-[11px] font-black shadow-md">
              <Wifi className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Online ({myOnlineChar === 'bubu' ? '🐻 Bubu' : '🐰 Dudu'})</span>
              <span className="text-[9px] bg-teal-900/50 px-1.5 py-0.2 rounded font-mono">
                {pingMs || '<25'}ms
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1 bg-white/90 border border-stone-200 border-b-2 border-b-stone-300 px-2.5 py-1 rounded-2xl text-[11px] font-bold text-stone-600 shadow-xs">
              <span>{gameMode === 'two_player' ? '👥 Co-op Lokal' : '👤 Latihan Solo'}</span>
            </div>
          )}

          {/* OBJECTIVE PILL */}
          {objectiveText && (
            <div className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 border-b-3 border-b-emerald-300 px-3 py-1.5 rounded-2xl shadow-sm text-xs font-bold text-emerald-900">
              <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0 animate-bounce" />
              <span>{objectiveText}</span>
            </div>
          )}

          {/* KEY COLLECTED BADGE */}
          {(bubu.hasKey || dudu.hasKey) && (
            <div className="hud-btn bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border-2 border-yellow-200 border-b-4 border-b-amber-600 px-2.5 py-1 rounded-2xl flex items-center gap-1.5 text-xs font-extrabold shadow-md animate-pulse">
              <Key className="w-4 h-4 text-amber-950 fill-amber-950" />
              <span>KUNCI DIDAPAT!</span>
            </div>
          )}

          {/* SOLO PRACTICE CHARACTER SWITCHER BUTTON */}
          {gameMode === 'practice' && !isOnline && (
            <button
              type="button"
              onClick={handleTogglePracticeChar}
              className="hud-btn bg-gradient-to-b from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-950 border-2 border-purple-300 border-b-4 border-b-purple-400 px-2.5 py-1 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              title="Ganti karakter yang dikontrol (Shortcut: [Tab] atau [Q])"
            >
              <Repeat className="w-3.5 h-3.5 text-purple-700" />
              <span>Karakter:</span>
              <span className={`px-1.5 py-0.2 rounded-lg font-extrabold text-[11px] ${
                practiceChar === 'bubu' ? 'bg-[#9A6B56] text-white' : 'bg-pink-500 text-white'
              }`}>
                {practiceChar === 'bubu' ? '🐻 Bubu' : '🐰 Dudu'}
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-purple-300/80 text-purple-900 font-bold px-1 rounded">Q</span>
            </button>
          )}

          {/* ONLINE EMOTE REACTIONS BAR */}
          {isOnline && (
            <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl border border-stone-200 shadow-sm">
              <button
                type="button"
                onClick={() => handleSendEmote('heart')}
                className="w-7 h-7 rounded-xl hover:bg-pink-100 flex items-center justify-center text-sm transition-transform active:scale-90 cursor-pointer"
                title="Kirim Reaksi Cinta ❤️"
              >
                ❤️
              </button>
              <button
                type="button"
                onClick={() => handleSendEmote('star')}
                className="w-7 h-7 rounded-xl hover:bg-amber-100 flex items-center justify-center text-sm transition-transform active:scale-90 cursor-pointer"
                title="Kirim Reaksi Bintang ⭐"
              >
                ⭐
              </button>
              <button
                type="button"
                onClick={() => handleSendEmote('happy')}
                className="w-7 h-7 rounded-xl hover:bg-teal-100 flex items-center justify-center text-sm transition-transform active:scale-90 cursor-pointer"
                title="Kirim Semangat 👋"
              >
                🐾
              </button>
            </div>
          )}

        </div>

        {/* --- RIGHT CLUSTER: ATTRACTIVE TACTILE BUTTONS --- */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">

          {/* 1. RESET BALOK / CRATE QUICK-RESET BUTTON */}
          {onResetCrates && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick();
                onResetCrates();
              }}
              className="hud-btn group relative overflow-hidden bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:from-amber-500 active:to-amber-600 text-amber-950 border border-amber-200 border-b-4 border-b-amber-700 px-2.5 sm:px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all text-xs font-bold cursor-pointer"
              title="Kembalikan posisi kotak ke tempat semula jika jatuh/tersangkut (Shortcut: [R])"
              aria-label="Reset Kotak"
            >
              <div className="w-6 h-6 rounded-xl bg-white/40 flex items-center justify-center shadow-inner group-hover:rotate-180 transition-transform duration-300">
                <RotateCcw className="w-3.5 h-3.5 text-amber-950" />
              </div>
              <span className="hidden sm:inline">Reset Balok</span>
              <span className="hidden md:inline-block text-[10px] bg-amber-950/20 text-amber-950 font-black px-1.5 py-0.2 rounded shadow-inner">
                R
              </span>
            </button>
          )}

          {/* 2. ATTRACTIVE PETUNJUK (HINT) BUTTON */}
          <button
            type="button"
            onClick={handleHintClick}
            className={`hud-btn relative px-2.5 sm:px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-b-4 shadow-md transition-all active:scale-95 text-xs font-bold cursor-pointer ${
              showHintModal
                ? 'bg-gradient-to-b from-amber-400 to-yellow-500 border-yellow-200 border-b-amber-700 text-amber-950'
                : 'bg-gradient-to-b from-yellow-200 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 border-yellow-100 border-b-amber-600 text-amber-950'
            }`}
            title="Buka Petunjuk Teka-teki & Trik Mengangkat/Menarik Kotak"
            aria-label="Petunjuk"
          >
            <div className="w-6 h-6 rounded-xl bg-amber-950/10 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-amber-900 fill-amber-900/30" />
            </div>
            <span className="hidden xs:inline">Petunjuk</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5"></span>
            <span className="w-2 h-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5"></span>
          </button>

          {/* 3. MODE PERANGKAT (DEVICE TOGGLE: PC / HP) */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              if (onToggleDeviceMode) {
                onToggleDeviceMode();
              } else {
                onToggleTouchControls();
              }
            }}
            className={`hud-btn px-2.5 sm:px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-b-4 shadow-md transition-all active:scale-95 text-xs font-bold cursor-pointer ${
              showTouchControls
                ? 'bg-gradient-to-b from-pink-300 to-rose-400 border-pink-200 border-b-pink-700 text-white'
                : 'bg-gradient-to-b from-sky-200 to-blue-300 border-sky-100 border-b-sky-600 text-sky-950'
            }`}
            title="Ganti Mode Perangkat (Layar Sentuh HP atau Keyboard PC)"
            aria-label="Mode Perangkat"
          >
            <div className="w-6 h-6 rounded-xl bg-white/30 flex items-center justify-center">
              {showTouchControls ? (
                <Smartphone className="w-3.5 h-3.5 text-white" />
              ) : (
                <Monitor className="w-3.5 h-3.5 text-sky-950" />
              )}
            </div>
            <span className="hidden sm:inline">
              {showTouchControls ? 'Mode HP' : 'Mode PC'}
            </span>
          </button>

          {/* 4. AUDIO MUTE / SOUND TOGGLE */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="hud-btn w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-b from-white to-stone-100 hover:from-stone-50 hover:to-stone-200 border border-stone-200 border-b-4 border-b-stone-400 text-stone-700 rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
            title="Bisukan atau Nyalakan Musik & Suara"
            aria-label="Mute Audio"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          {/* 5. PAUSE / JEDA BUTTON */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onPause();
            }}
            className="hud-btn w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#4E342E] hover:to-[#2E1C14] text-white border border-[#8D6E63] border-b-4 border-b-[#27150F] rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
            title="Jeda Permainan"
            aria-label="Jeda"
          >
            <Pause className="w-4 h-4 fill-white" />
          </button>

        </div>
      </header>

      {/* ======================================================== */}
      {/* ATTRACTIVE HINT & CHASM SOLVER MODAL */}
      {/* ======================================================== */}
      {showHintModal && (
        <div className="absolute inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
          <div className="max-w-xl w-full bg-gradient-to-b from-[#FFFDFB] to-[#FBF8F5] rounded-3xl border-2 border-amber-300 shadow-2xl p-4 sm:p-6 max-h-[90vh] flex flex-col overflow-hidden animate-popIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2 text-[#4A3B32] font-['Fredoka',sans-serif] font-bold text-lg sm:text-xl">
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Bantuan & Panduan Melewati Jurang</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHintModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 text-sm font-bold active:scale-95 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="space-y-3 overflow-y-auto pr-1 my-3 flex-1 text-xs sm:text-sm">
              
              {/* SPECIAL SPOTLIGHT: 4 CARA MEMINDAHKAN KOTAK DI JURANG */}
              <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-2 text-xs sm:text-sm">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>4 Cara Memindahkan Balok Kayu / Kotak Jika Ada Jurang:</span>
                </div>
                
                <div className="space-y-2 text-stone-700 text-xs sm:text-sm font-medium leading-relaxed">
                  <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 shadow-xs">
                    <p className="font-bold text-amber-950 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">1</span>
                      <span>MENGANGKAT KOTAK MELEWATI JURANG (Sangat Mudah!)</span>
                    </p>
                    <p className="text-[11px] sm:text-xs text-stone-600 mt-1 pl-6">
                      Dekatkan Bubu ke kotak, lalu tekan tombol <strong>Aksi [F]</strong> (atau tombol <strong>Angkat/Aksi</strong> di HP). Bubu akan mengangkat kotak di atas kepala! Bubu bisa <strong>melompati jurang sambil membawa kotak</strong>, lalu tekan tombol Aksi lagi untuk meletakkannya di seberang!
                    </p>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 shadow-xs">
                    <p className="font-bold text-amber-950 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">2</span>
                      <span>MENARIK KOTAK MUNDUR MENJAUHI JURANG</span>
                    </p>
                    <p className="text-[11px] sm:text-xs text-stone-600 mt-1 pl-6">
                      Jika kotak terlalu dekat dengan bibir jurang, posisikan Bubu di sebelah kotak, <strong>tahan tombol Aksi [F]</strong> dan <strong>berjalan mundur</strong>. Bubu akan memegang dan menarik kotak mundur dengan aman!
                    </p>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 shadow-xs">
                    <p className="font-bold text-amber-950 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">3</span>
                      <span>JADIKAN KOTAK SEBAGAI JEMBATAN LONCATAN</span>
                    </p>
                    <p className="text-[11px] sm:text-xs text-stone-600 mt-1 pl-6">
                      Dorong kotak kayu masuk ke dalam celah jurang. Kotak akan mendarat di dasar celah dan langsung menjadi batu pijakan jembatan yang kokoh untuk dilompati!
                    </p>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200 shadow-xs">
                    <p className="font-bold text-amber-950 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">4</span>
                      <span>TOMBOL RESET BALOK KAPAN SAJA</span>
                    </p>
                    <p className="text-[11px] sm:text-xs text-stone-600 mt-1 pl-6">
                      Jika kotak tercebur atau salah letak, tekan tombol <strong>"Reset Balok"</strong> di HUD atas (atau tekan huruf <strong>[R]</strong> di PC). Kotak akan langsung kembali ke posisi semula!
                    </p>
                  </div>
                </div>
              </div>

              {/* Bubu Step */}
              {hintSteps?.bubu && (
                <div className="p-3 bg-[#FAF4F0] border border-[#EADBCE] rounded-2xl">
                  <div className="font-bold text-[#4A3B32] mb-1 flex items-center gap-1.5">
                    <span>🐻 Peran Bubu (Kekuatan):</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {hintSteps.bubu}
                  </p>
                </div>
              )}

              {/* Dudu Step */}
              {hintSteps?.dudu && (
                <div className="p-3 bg-[#FFF5F8] border border-[#FCE1E9] rounded-2xl">
                  <div className="font-bold text-pink-950 mb-1 flex items-center gap-1.5">
                    <span>🐰 Peran Dudu (Kelincahan):</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {hintSteps.dudu}
                  </p>
                </div>
              )}

              {/* Puzzle Solution */}
              {hintSteps?.puzzle && (
                <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-2xl">
                  <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Langkah Menyelesaikan Teka-teki:</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {hintSteps.puzzle}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-amber-100 flex flex-wrap gap-2 justify-between items-center">
              {onResetCrates && (
                <button
                  type="button"
                  onClick={() => {
                    onResetCrates();
                    soundEngine.playButtonClick();
                    setShowHintModal(false);
                  }}
                  className="hud-btn flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-400 border border-amber-400 border-b-3 border-b-amber-600 px-3.5 py-2 rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Posisi Kotak Sekarang</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowHintModal(false)}
                className="hud-btn ml-auto text-xs font-bold text-white bg-[#4A3B32] hover:bg-[#382B24] border border-[#5D4037] border-b-3 border-b-[#27150F] px-5 py-2 rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
