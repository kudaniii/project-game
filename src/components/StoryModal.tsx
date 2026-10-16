/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Visual Story and Dialogue Cutscene Modal
 */

import React, { useState, useEffect } from 'react';
import { FastForward, ChevronRight, Heart, Sparkles, BookOpen } from 'lucide-react';
import { StoryScene, DialogueLine } from '../game/types.ts';
import { soundEngine } from '../game/audio.ts';

interface StoryModalProps {
  scene: StoryScene;
  onComplete: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ scene, onComplete }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentLine: DialogueLine = scene.lines[lineIndex] || {
    speaker: 'narrator',
    text: '',
  };

  useEffect(() => {
    soundEngine.playButtonClick();
    setIsTyping(true);
    setDisplayedText('');
    let charIdx = 0;
    const fullText = currentLine.text;
    const interval = setInterval(() => {
      charIdx++;
      setDisplayedText(fullText.slice(0, charIdx));
      if (charIdx >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [lineIndex, currentLine.text]);

  const handleNext = () => {
    if (isTyping) {
      // Instant reveal
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }
    if (lineIndex < scene.lines.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else {
      soundEngine.playButtonClick();
      onComplete();
    }
  };

  const handleSkip = () => {
    soundEngine.playButtonClick();
    onComplete();
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex flex-col justify-end p-3 sm:p-6 md:p-8 select-none animate-fadeIn">
      <div className="max-w-3xl w-full mx-auto bg-gradient-to-b from-white to-[#FDFBF7] border-2 border-[#D7CCC8] rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden animate-popIn">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-3 border-b border-[#F5ECE5] pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              {scene.title}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="hud-btn flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 px-3 py-1.5 rounded-full transition-all active:scale-95 border border-stone-200"
          >
            <span>Lewati Cerita</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speaker Info & Avatar */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar Icon */}
          <div className="shrink-0">
            {currentLine.speaker === 'bubu' && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#A6755E] to-[#8D5B4C] border-2 border-[#7B4E3C] border-b-4 border-b-[#5D382B] flex flex-col items-center justify-center shadow-md relative">
                <span className="text-2xl">🐻</span>
                <span className="text-[10px] font-black text-white">Bubu</span>
              </div>
            )}
            {currentLine.speaker === 'dudu' && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-pink-100 to-pink-200 border-2 border-pink-300 border-b-4 border-b-pink-400 flex flex-col items-center justify-center shadow-md relative">
                <span className="text-2xl">🐰</span>
                <span className="text-[10px] font-black text-pink-900">Dudu</span>
              </div>
            )}
            {currentLine.speaker === 'narrator' && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-purple-100 to-purple-200 border-2 border-purple-300 border-b-4 border-b-purple-400 flex flex-col items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-purple-700 mb-0.5" />
                <span className="text-[10px] font-black text-purple-900">Kisah</span>
              </div>
            )}
          </div>

          {/* Dialogue Text Content */}
          <div className="flex-1 min-h-[68px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm sm:text-base text-stone-800 capitalize">
                {currentLine.speaker === 'narrator' ? 'Narator' : currentLine.speaker}
              </span>
              {currentLine.emotion && (
                <span className="text-[11px] text-pink-600 font-bold bg-pink-100/80 px-2 py-0.5 rounded-full flex items-center gap-1 border border-pink-200">
                  <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                  <span>{currentLine.emotion}</span>
                </span>
              )}
            </div>
            <p className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
              {displayedText}
              {isTyping && <span className="animate-pulse font-bold text-pink-500">|</span>}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3 sm:mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="hud-btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#4E342E] hover:to-[#2E1C14] border border-[#8D6E63] border-b-4 border-b-[#27150F] active:scale-95 text-white font-bold rounded-2xl shadow-md transition-all text-xs sm:text-sm"
          >
            <span>{lineIndex < scene.lines.length - 1 ? 'Lanjut' : 'Mulai Petualangan'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
