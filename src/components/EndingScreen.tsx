/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Romantic Grand Ending Screen & Credits
 */

import React, { useEffect } from 'react';
import { Heart, Sparkles, Home, RotateCcw, Award } from 'lucide-react';
import { soundEngine } from '../game/audio.ts';

interface EndingScreenProps {
  onRestartGame: () => void;
  onHome: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ onRestartGame, onHome }) => {
  useEffect(() => {
    soundEngine.playBGM('star');
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 overflow-y-auto select-none bg-gradient-to-b from-[#161224] via-[#2A1D3D] to-[#432349] text-white animate-fadeIn">
      
      {/* Twinkling star particle backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-ping"
            style={{
              top: `${(i * 19) % 95}%`,
              left: `${(i * 29) % 95}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              animationDuration: `${(i % 4) + 2.5}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="z-10 text-center my-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-bold mb-2 shadow-sm">
          <Heart className="w-3.5 h-3.5 fill-pink-400" />
          <span>Tamat: Dua Hati, Satu Petualangan Abadi</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-['Fredoka',sans-serif] tracking-tight text-pink-100 drop-shadow-lg">
          Lembah Bintang Bersinar Untuk Kita
        </h1>
      </div>

      {/* Romantic Illustration Box */}
      <div className="z-10 my-3 max-w-lg w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center animate-popIn">
        
        {/* Animated Couple Sitting Under the Stars */}
        <div className="relative w-64 h-36 flex items-center justify-center my-2">
          {/* Moon / Star Halo */}
          <div className="absolute w-40 h-40 bg-pink-400/25 rounded-full blur-2xl animate-pulse"></div>

          {/* SVG Romantic Cuddle */}
          <svg className="w-48 h-36" viewBox="0 0 200 120">
            {/* Grassy hill silhouette */}
            <ellipse cx="100" cy="120" rx="95" ry="30" fill="#20152F" />

            {/* Bubu (Bear) sitting */}
            <ellipse cx="80" cy="75" rx="22" ry="22" fill="#9A6B56" />
            <circle cx="80" cy="55" r="18" fill="#9A6B56" />
            <circle cx="68" cy="42" r="7" fill="#9A6B56" />
            <circle cx="92" cy="42" r="7" fill="#9A6B56" />
            <ellipse cx="82" cy="60" rx="9" ry="6" fill="#F5DDCB" />
            <circle cx="75" cy="53" r="2.2" fill="#422419" />
            <circle cx="87" cy="53" r="2.2" fill="#422419" />
            <circle cx="70" cy="58" r="3.5" fill="#FF8A80" opacity="0.6" />
            <circle cx="92" cy="58" r="3.5" fill="#FF8A80" opacity="0.6" />

            {/* Dudu (Bunny) snuggling with Flower Crown */}
            <ellipse cx="118" cy="78" rx="19" ry="20" fill="#FFFFFF" />
            {/* Bunny Ears */}
            <ellipse cx="112" cy="38" rx="5" ry="15" fill="#FFFFFF" transform="rotate(-10 112 38)" />
            <ellipse cx="112" cy="38" rx="2.5" ry="10" fill="#FFB6C1" transform="rotate(-10 112 38)" />
            <ellipse cx="126" cy="38" rx="5" ry="15" fill="#FFFFFF" transform="rotate(15 126 38)" />
            <ellipse cx="126" cy="38" rx="2.5" ry="10" fill="#FFB6C1" transform="rotate(15 126 38)" />
            {/* Head */}
            <circle cx="118" cy="56" r="16" fill="#FFFFFF" />
            {/* Flower Crown on Dudu */}
            <circle cx="108" cy="45" r="3.5" fill="#FFEB3B" />
            <circle cx="116" cy="43" r="4" fill="#FF4081" />
            <circle cx="124" cy="44" r="3.5" fill="#64B5F6" />
            <circle cx="116" cy="43" r="1.5" fill="#FFFFFF" />
            {/* Eyes closed happy */}
            <path d="M 112 55 Q 115 52 118 55" stroke="#4A3B32" strokeWidth="1.5" fill="none" />
            <path d="M 122 55 Q 125 52 128 55" stroke="#4A3B32" strokeWidth="1.5" fill="none" />
            <circle cx="110" cy="60" r="3.5" fill="#FFAAA6" opacity="0.7" />
            <circle cx="127" cy="60" r="3.5" fill="#FFAAA6" opacity="0.7" />

            {/* Floating Heart */}
            <path
              d="M 100 25 C 100 20, 92 18, 92 24 C 92 28, 100 34, 100 34 C 100 34, 108 28, 108 24 C 108 18, 100 20, 100 25 Z"
              fill="#FF4081"
            />
          </svg>
        </div>

        {/* Narrative text */}
        <p className="text-pink-100 text-xs sm:text-sm md:text-base leading-relaxed font-medium mb-3">
          "Terima kasih telah menemani kami menempuh setiap jurang dan teka-teki. Bersama Bubu si beruang penyayang dan Dudu si kelinci ceria, kita belajar bahwa kebahagiaan sejati bukanlah tempat tujuan, melainkan siapa yang ada di samping kita di sepanjang perjalanan."
        </p>

        {/* Credits */}
        <div className="pt-3 border-t border-white/15 w-full flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-pink-200/80">
          <span>Game Design & Direction</span>
          <span className="text-white/40">·</span>
          <span>Web Audio Procedural Chiptune</span>
          <span className="text-white/40">·</span>
          <span>Co-op Physics Engine</span>
          <span className="text-white/40">·</span>
          <span>Dibuat oleh <strong>Dani</strong></span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="z-10 flex flex-col sm:flex-row gap-3 my-2">
        <button
          type="button"
          onClick={() => {
            soundEngine.playButtonClick();
            onRestartGame();
          }}
          className="hud-btn flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-b from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-95 text-white font-bold rounded-2xl border border-pink-400 border-b-4 border-b-rose-800 shadow-lg transition-all text-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mainkan Lagi Dari Awal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playButtonClick();
            onHome();
          }}
          className="hud-btn flex items-center justify-center gap-2 py-3 px-6 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold rounded-2xl border border-white/30 border-b-3 border-b-white/40 backdrop-blur-md transition-all text-sm cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </button>
      </div>
    </div>
  );
};
