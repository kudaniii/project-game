/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Character Profiles and Controls Reference Modal
 */

import React from 'react';
import { X, Heart, Shield, Zap, Keyboard, Smartphone, Package } from 'lucide-react';
import { soundEngine } from '../game/audio.ts';

interface CharacterIntroModalProps {
  onClose: () => void;
}

export const CharacterIntroModal: React.FC<CharacterIntroModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none animate-fadeIn">
      <div className="max-w-2xl w-full bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F4] rounded-3xl border-2 border-stone-200 shadow-2xl p-5 sm:p-6 relative max-h-[92vh] flex flex-col animate-popIn">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka',sans-serif] text-stone-800">
              Karakter & Panduan Kontrol
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Kenali kelebihan Bubu dan Dudu untuk menyelesaikan setiap teka-teki bersama!
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

        {/* Character Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-3.5 overflow-y-auto">
          
          {/* BUBU CARD */}
          <div className="bg-[#FAF4F0] border-2 border-[#EADBCE] rounded-2xl p-4 flex flex-col shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#A6755E] to-[#8D5B4C] text-white flex items-center justify-center text-3xl shadow-sm border border-[#7B4E3C]">
                🐻
              </div>
              <div>
                <h3 className="font-bold text-base text-[#4A3B32] flex items-center gap-1.5">
                  <span>BUBU</span>
                  <span className="text-[10px] bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded-full font-bold">Pemain 1</span>
                </h3>
                <p className="text-xs text-stone-600 font-medium">Beruang Cokelat Penyayang & Kuat</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-stone-700 my-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Mengangkat & melempar</strong> balok kayu melintasi jurang.</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Mendorong dan menarik balok berat menjauhi lubang.</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Menjadi pijakan kokoh yang aman bagi Dudu.</span>
              </div>
            </div>

            {/* Keyboard Bubu */}
            <div className="mt-auto pt-2.5 border-t border-[#EADBCE]">
              <div className="text-[11px] font-bold text-stone-500 mb-1 flex items-center gap-1">
                <Keyboard className="w-3.5 h-3.5" />
                <span>Kontrol Keyboard PC:</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div className="bg-white px-2 py-1 rounded-lg border border-stone-200 shadow-xs"><span className="font-bold">A / D:</span> Kiri / Kanan</div>
                <div className="bg-white px-2 py-1 rounded-lg border border-stone-200 shadow-xs"><span className="font-bold">W / Spasi:</span> Lompat</div>
                <div className="bg-white px-2 py-1 rounded-lg border border-stone-200 shadow-xs col-span-2"><span className="font-bold">F:</span> Angkat / Tarik Balok / Tuas</div>
              </div>
            </div>
          </div>

          {/* DUDU CARD */}
          <div className="bg-[#FFF5F8] border-2 border-[#FCE1E9] rounded-2xl p-4 flex flex-col shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#F48FB1] text-pink-900 flex items-center justify-center text-3xl shadow-sm">
                🐰
              </div>
              <div>
                <h3 className="font-bold text-base text-pink-950 flex items-center gap-1.5">
                  <span>DUDU</span>
                  <span className="text-[10px] bg-pink-200 text-pink-900 px-2 py-0.5 rounded-full font-bold">Pemain 2</span>
                </h3>
                <p className="text-xs text-stone-600 font-medium">Kelinci Putih Ceria & Lincah</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-stone-700 my-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-pink-500 shrink-0" />
                <span><strong>Lompatan sangat tinggi</strong> & melayang ringan di udara.</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Menjangkau dahan pohon tinggi & platform melayang.</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Menarik tuas jembatan dan mengambil kunci di langit.</span>
              </div>
            </div>

            {/* Keyboard Dudu */}
            <div className="mt-auto pt-2.5 border-t border-[#FCE1E9]">
              <div className="text-[11px] font-bold text-stone-500 mb-1 flex items-center gap-1">
                <Keyboard className="w-3.5 h-3.5" />
                <span>Kontrol Keyboard PC:</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div className="bg-white px-2 py-1 rounded-lg border border-stone-200 shadow-xs"><span className="font-bold">Panah ← / →:</span> Gerak</div>
                <div className="bg-white px-2 py-1 rounded-lg border border-stone-200 shadow-xs"><span className="font-bold">Panah ↑:</span> Lompat Tinggi</div>
                <div className="bg-white px-2 py-1 rounded-lg border border-stone-200 shadow-xs col-span-2"><span className="font-bold">Enter:</span> Tuas / Aksi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Info */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center gap-3 text-xs text-stone-600">
          <Smartphone className="w-5 h-5 text-pink-500 shrink-0" />
          <p>
            <strong className="text-stone-800">Layar Sentuh (Mobile/Tablet):</strong> Kontrol tombol sentuh responsif otomatis muncul di layar. Sisi kiri untuk Bubu, sisi kanan untuk Dudu (atau layout solo khusus untuk satu pemain)!
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="hud-btn px-6 py-2.5 bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#4E342E] hover:to-[#2E1C14] border border-[#8D6E63] border-b-4 border-b-[#27150F] text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Mengerti, Ayo Main!
          </button>
        </div>
      </div>
    </div>
  );
};
