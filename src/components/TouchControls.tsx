/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Touch Controls with Multi-Touch Pointer Events for Dual Local Players & Solo Practice
 * Optimized for Mobile (Android & iOS) and Tablet screens
 */

import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Sparkles,
  RotateCcw,
  Package,
  Repeat,
} from 'lucide-react';
import { inputManager } from '../game/input.ts';

interface TouchControlsProps {
  isPractice: boolean;
  onSwitchPracticeChar?: () => void;
  activePracticeChar?: 'bubu' | 'dudu';
  onResetCrates?: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  isPractice,
  onSwitchPracticeChar,
  activePracticeChar = 'bubu',
  onResetCrates,
}) => {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Ignore if not permitted
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent, buttonId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
    triggerHaptic();
    inputManager.handlePointerDown(e.pointerId, buttonId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inputManager.handlePointerUp(e.pointerId);
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inputManager.handlePointerCancel(e.pointerId);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-2 sm:p-4 pb-[max(0.6rem,env(safe-area-inset-bottom))] px-[max(0.6rem,env(safe-area-inset-left))] pr-[max(0.6rem,env(safe-area-inset-right))] z-20 select-none">
      
      {/* ======================================================== */}
      {/* 1. SOLO PRACTICE MODE TOUCH LAYOUT (OPTIMIZED FOR 1 PLAYER) */}
      {/* ======================================================== */}
      {isPractice ? (
        <div className="w-full flex justify-between items-end gap-2">
          
          {/* LEFT THUMB: D-PAD & CHARACTER SWITCHER */}
          <div className="pointer-events-auto flex flex-col gap-1.5 items-start bg-stone-900/40 backdrop-blur-md p-2 rounded-3xl border-2 border-white/20 shadow-2xl">
            {/* Active Character Badge & Switcher */}
            <div className="flex items-center gap-1.5">
              <div
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm text-white ${
                  activePracticeChar === 'bubu' ? 'bg-[#8D5B4C]' : 'bg-pink-600'
                }`}
              >
                <span>{activePracticeChar === 'bubu' ? '🐻 Bubu (Aktif)' : '🐰 Dudu (Aktif)'}</span>
              </div>

              {onSwitchPracticeChar && (
                <button
                  type="button"
                  onClick={onSwitchPracticeChar}
                  className="hud-btn text-[10px] font-extrabold bg-gradient-to-r from-amber-200 to-yellow-300 hover:from-amber-300 hover:to-yellow-400 text-amber-950 border border-amber-300 border-b-2 border-b-amber-600 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm active:scale-95 transition-all touch-none"
                >
                  <Repeat className="w-3 h-3" />
                  <span>Ganti Karakter</span>
                </button>
              )}
            </div>

            {/* D-Pad Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onPointerDown={(e) => handlePointerDown(e, 'solo_left')}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                className="touch-action-btn w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-stone-100 to-stone-200 active:from-stone-300 active:to-stone-400 text-stone-800 border-2 border-white/60 border-b-4 border-b-stone-400 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                aria-label="Gerak Kiri"
              >
                <ArrowLeft className="w-7 h-7 stroke-[2.8]" />
              </button>
              <button
                type="button"
                onPointerDown={(e) => handlePointerDown(e, 'solo_right')}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                className="touch-action-btn w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-stone-100 to-stone-200 active:from-stone-300 active:to-stone-400 text-stone-800 border-2 border-white/60 border-b-4 border-b-stone-400 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                aria-label="Gerak Kanan"
              >
                <ArrowRight className="w-7 h-7 stroke-[2.8]" />
              </button>
            </div>
          </div>

          {/* CENTER HELPER: RESET CRATE BUTTON */}
          {onResetCrates && (
            <div className="pointer-events-auto mb-1 flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  onResetCrates();
                }}
                className="hud-btn bg-gradient-to-b from-amber-200 to-amber-300 active:from-amber-300 active:to-amber-400 text-amber-950 border border-amber-300 border-b-3 border-b-amber-600 shadow-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-[11px] font-bold active:scale-90 transition-all touch-none"
                title="Reset Balok jika jatuh atau macet"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
                <span>Reset Balok</span>
              </button>
            </div>
          )}

          {/* RIGHT THUMB: ACTION (LIFT / PULL) & JUMP */}
          <div className="pointer-events-auto flex items-center gap-2 bg-stone-900/40 backdrop-blur-md p-2 rounded-3xl border-2 border-white/20 shadow-2xl">
            {/* Action / Lift Button */}
            <button
              type="button"
              onPointerDown={(e) => handlePointerDown(e, 'solo_action')}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="touch-action-btn w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-amber-300 to-amber-400 active:from-amber-400 active:to-amber-500 text-amber-950 border-2 border-amber-200 border-b-4 border-b-amber-600 rounded-2xl flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform font-bold text-[9px]"
              aria-label="Angkat atau Tarik Balok"
            >
              <Package className="w-5 h-5 text-amber-950 mb-0.5" />
              <span>Angkat/Aksi</span>
            </button>

            {/* Jump Button */}
            <button
              type="button"
              onPointerDown={(e) => handlePointerDown(e, 'solo_jump')}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="touch-action-btn w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-b from-pink-500 to-rose-600 active:from-pink-600 active:to-rose-700 text-white border-2 border-pink-300 border-b-4 border-b-rose-800 rounded-3xl flex flex-col items-center justify-center shadow-xl active:scale-90 transition-transform font-extrabold text-[10px]"
              aria-label="Lompat"
            >
              <ArrowUp className="w-7 h-7 stroke-[3]" />
              <span>LOMPAT</span>
            </button>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* 2. DUAL-PLAYER CO-OP TOUCH LAYOUT (LEFT BUBU, RIGHT DUDU) */
        /* ======================================================== */
        <div className="w-full flex justify-between items-end gap-2">
          
          {/* --- LEFT SIDE: BUBU CONTROLS (BEAR HONEY PALETTE) --- */}
          <div className="pointer-events-auto flex flex-col gap-1 items-start bg-amber-950/40 backdrop-blur-md p-1.5 sm:p-2 rounded-3xl border-2 border-amber-700/50 shadow-2xl max-w-[49%]">
            <div className="text-[10px] sm:text-[11px] font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-amber-300/80">
              <span className="w-2 h-2 rounded-full bg-amber-800"></span>
              <span>P1: Bubu (Beruang)</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Move Left & Right */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 'bubu_left')}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  className="touch-action-btn w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-amber-100 to-amber-200 active:from-amber-200 active:to-amber-300 text-amber-950 border border-amber-200 border-b-3 border-b-amber-400 rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
                  aria-label="Bubu Kiri"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8]" />
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 'bubu_right')}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  className="touch-action-btn w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-amber-100 to-amber-200 active:from-amber-200 active:to-amber-300 text-amber-950 border border-amber-200 border-b-3 border-b-amber-400 rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
                  aria-label="Bubu Kanan"
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8]" />
                </button>
              </div>

              {/* Action (Lift/Pull) & Jump */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 'bubu_action')}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  className="touch-action-btn w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-amber-300 to-amber-400 active:from-amber-400 active:to-amber-500 text-amber-950 border border-amber-200 border-b-3 border-b-amber-600 rounded-2xl flex flex-col items-center justify-center shadow-md active:scale-90 transition-transform font-bold text-[8px] sm:text-[9px]"
                  aria-label="Bubu Angkat atau Tarik Balok"
                  title="Tekan untuk Angkat Balok atau Tahan & Mundur untuk Tarik"
                >
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 mb-0.5" />
                  <span>Angkat</span>
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 'bubu_jump')}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  className="touch-action-btn w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-amber-700 to-amber-800 active:from-amber-800 active:to-amber-900 text-white border border-amber-600 border-b-3 border-b-amber-950 rounded-2xl flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform font-bold text-[8px] sm:text-[9px]"
                  aria-label="Bubu Lompat"
                >
                  <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8]" />
                  <span>Lompat</span>
                </button>
              </div>
            </div>
          </div>

          {/* --- CENTER HELPER: QUICK RESET BOX --- */}
          {onResetCrates && (
            <div className="pointer-events-auto mb-1 flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  onResetCrates();
                }}
                className="hud-btn bg-gradient-to-b from-white to-stone-100 hover:from-stone-50 active:from-stone-200 text-amber-950 border border-amber-300 border-b-3 border-b-amber-500 shadow-md px-2.5 py-1.5 rounded-xl flex items-center gap-1 text-[10px] font-bold active:scale-90 transition-all touch-none"
                title="Reset Kotak / Balok ke tempat semula"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden xs:inline">Reset Balok</span>
              </button>
            </div>
          )}

          {/* --- RIGHT SIDE: DUDU CONTROLS (BUNNY PINK PALETTE) --- */}
          <div className="pointer-events-auto flex flex-col gap-1 items-end bg-pink-950/40 backdrop-blur-md p-1.5 sm:p-2 rounded-3xl border-2 border-pink-700/50 shadow-2xl max-w-[49%]">
            <div className="text-[10px] sm:text-[11px] font-bold text-pink-950 bg-gradient-to-r from-pink-100 to-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-pink-300/80">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              <span>P2: Dudu (Kelinci)</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Action & High Jump */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 'dudu_action')}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  className="touch-action-btn w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-pink-200 to-pink-300 active:from-pink-300 active:to-pink-400 text-pink-950 border border-pink-200 border-b-3 border-b-pink-400 rounded-2xl flex flex-col items-center justify-center shadow-md active:scale-90 transition-transform font-bold text-[8px] sm:text-[9px]"
                  aria-label="Dudu Aksi atau Tuas"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pink-900 mb-0.5" />
                  <span>Aksi</span>
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 'dudu_jump')}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  className="touch-action-btn w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-pink-500 to-rose-600 active:from-pink-600 active:to-rose-700 text-white border border-pink-300 border-b-3 border-b-rose-800 rounded-2xl flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform font-bold text-[8px] sm:text-[9px]"
                  aria-label="Dudu Lompat Tinggi"
                >
                  <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8]" />
                  <span>Lompat</span>
                </button>
              </div>

              {/* Move Left & Right */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 'dudu_left')}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  className="touch-action-btn w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-pink-100 to-pink-200 active:from-pink-200 active:to-pink-300 text-pink-950 border border-pink-200 border-b-3 border-b-pink-400 rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
                  aria-label="Dudu Kiri"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8]" />
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 'dudu_right')}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  className="touch-action-btn w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-pink-100 to-pink-200 active:from-pink-200 active:to-pink-300 text-pink-950 border border-pink-200 border-b-3 border-b-pink-400 rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-transform"
                  aria-label="Dudu Kanan"
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
