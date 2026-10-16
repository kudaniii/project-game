/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Device Selection Modal (PC vs Mobile/Tablet)
 */

import React, { useState } from 'react';
import { Smartphone, Monitor, CheckCircle2, Sparkles, X, Keyboard, HandMetal } from 'lucide-react';
import { soundEngine } from '../game/audio.ts';

interface DeviceSelectModalProps {
  currentDevice: 'pc' | 'mobile';
  onSelectDevice: (device: 'pc' | 'mobile') => void;
  onClose?: () => void;
  isInitialPrompt?: boolean;
}

export const DeviceSelectModal: React.FC<DeviceSelectModalProps> = ({
  currentDevice,
  onSelectDevice,
  onClose,
  isInitialPrompt = false,
}) => {
  const [selected, setSelected] = useState<'pc' | 'mobile'>(currentDevice);

  const handleConfirm = () => {
    soundEngine.playButtonClick();
    onSelectDevice(selected);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="max-w-xl w-full bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F4] rounded-3xl border-2 border-amber-200 shadow-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col animate-popIn">
        
        {/* Soft Ambient Glows */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-pink-200/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-200/50 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button if not initial prompt */}
        {!isInitialPrompt && onClose && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-bold mb-2 border border-amber-300/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Pilih Pengalaman Bermain Terbaik</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Fredoka',sans-serif] text-[#4A3B32]">
            Pilih Perangkat Bermain
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto mt-1">
            Kamu sedang bermain di mana? Kami akan menyesuaikan tata letak tombol agar petualangan Bubu & Dudu semakin seru!
          </p>
        </div>

        {/* 2 Big Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-2">
          {/* OPTION 1: MOBILE / TABLET */}
          <div
            onClick={() => {
              soundEngine.playButtonClick();
              setSelected('mobile');
            }}
            className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col relative ${
              selected === 'mobile'
                ? 'bg-gradient-to-b from-pink-50 to-rose-100/60 border-pink-500 shadow-lg scale-[1.02]'
                : 'bg-white/80 border-stone-200 hover:border-pink-300'
            }`}
          >
            {selected === 'mobile' && (
              <div className="absolute top-3 right-3 text-pink-600">
                <CheckCircle2 className="w-5 h-5 fill-pink-500 text-white" />
              </div>
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-pink-100 to-pink-200 text-pink-600 flex items-center justify-center mb-3 shadow-sm border border-pink-300/60">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base text-stone-800">
                HP atau Tablet
              </h3>
              <span className="text-[10px] bg-pink-200 text-pink-900 font-extrabold px-2 py-0.5 rounded-full">
                Layar Sentuh
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-medium mb-3">
              Gamepad virtual otomatis aktif di layar: sisi kiri untuk Bubu, sisi kanan untuk Dudu dengan tombol yang besar dan empuk.
            </p>
            {/* Visual Touch Hint */}
            <div className="mt-auto pt-2 border-t border-pink-200/60 flex items-center gap-1.5 text-[11px] text-pink-800 font-bold">
              <HandMetal className="w-3.5 h-3.5" />
              <span>Tombol Sentuh Layar Otomatis Aktif</span>
            </div>
          </div>

          {/* OPTION 2: PC / LAPTOP */}
          <div
            onClick={() => {
              soundEngine.playButtonClick();
              setSelected('pc');
            }}
            className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col relative ${
              selected === 'pc'
                ? 'bg-gradient-to-b from-amber-50 to-amber-100/60 border-amber-600 shadow-lg scale-[1.02]'
                : 'bg-white/80 border-stone-200 hover:border-amber-300'
            }`}
          >
            {selected === 'pc' && (
              <div className="absolute top-3 right-3 text-amber-700">
                <CheckCircle2 className="w-5 h-5 fill-amber-600 text-white" />
              </div>
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-100 to-amber-200 text-amber-800 flex items-center justify-center mb-3 shadow-sm border border-amber-300/60">
              <Monitor className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base text-stone-800">
                Komputer / Laptop
              </h3>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                Keyboard
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-medium mb-3">
              Gunakan tombol keyboard fisik. Layar tampil bersih tanpa tombol virtual yang menutupi pemandangan.
            </p>
            {/* Visual Keyboard Hint */}
            <div className="mt-auto pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] text-amber-900 font-bold">
              <Keyboard className="w-3.5 h-3.5" />
              <span>WASD (Bubu) & Panah (Dudu)</span>
            </div>
          </div>
        </div>

        {/* Small Notice */}
        <p className="text-[11px] text-center text-stone-500 mt-2 mb-3">
          *Pilihan ini dapat diganti kapan saja melalui tombol di atas layar atau di Menu Pengaturan.
        </p>

        {/* Confirm Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleConfirm}
            className="hud-btn w-full max-w-xs py-3.5 px-6 bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#4E342E] hover:to-[#2E1C14] border border-[#8D6E63] border-b-4 border-b-[#27150F] active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lanjutkan Petualangan</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
