/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Settings Screen Modal with Audio Sliders & Device Controls
 */

import React, { useState } from 'react';
import { X, Volume2, Music, Gamepad2, Trash2, Smartphone, Monitor } from 'lucide-react';
import { GameSaveData } from '../game/types.ts';
import { soundEngine } from '../game/audio.ts';
import { storageManager } from '../game/storage.ts';

interface SettingsModalProps {
  saveData: GameSaveData;
  onUpdateSettings: (settings: GameSaveData['settings']) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  saveData,
  onUpdateSettings,
  onClose,
}) => {
  const [bgmVol, setBgmVol] = useState(saveData.settings.bgmVolume);
  const [sfxVol, setSfxVol] = useState(saveData.settings.sfxVolume);
  const [showTouch, setShowTouch] = useState(saveData.settings.showTouchControls);
  const [showHints, setShowHints] = useState(saveData.settings.showControlHints);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleBgmChange = (val: number) => {
    setBgmVol(val);
    soundEngine.setVolumes(val, sfxVol);
    saveSettings({ bgmVolume: val });
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    soundEngine.setVolumes(bgmVol, val);
    soundEngine.playCollectStar(); // Preview sound effect
    saveSettings({ sfxVolume: val });
  };

  const handleTouchToggle = () => {
    const next = !showTouch;
    setShowTouch(next);
    soundEngine.playButtonClick();
    saveSettings({ showTouchControls: next });
  };

  const handleHintsToggle = () => {
    const next = !showHints;
    setShowHints(next);
    soundEngine.playButtonClick();
    saveSettings({ showControlHints: next });
  };

  const saveSettings = (partial: Partial<GameSaveData['settings']>) => {
    const updated = {
      ...saveData.settings,
      ...partial,
    };
    onUpdateSettings(updated);
    storageManager.save({ settings: updated });
  };

  const handleResetProgress = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    storageManager.resetProgress();
    soundEngine.playButtonClick();
    window.location.reload();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="max-w-md w-full bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F4] rounded-3xl border-2 border-stone-200 shadow-2xl p-6 relative animate-popIn">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200">
          <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka',sans-serif] text-stone-800">
            Pengaturan Permainan
          </h2>
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

        {/* Sliders & Toggles */}
        <div className="space-y-4 my-5">
          {/* BGM Volume */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-purple-600" />
                <span>Volume Musik Latar (BGM)</span>
              </span>
              <span>{Math.round(bgmVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bgmVol}
              onChange={(e) => handleBgmChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#4A3B32]"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>Volume Efek Suara (SFX)</span>
              </span>
              <span>{Math.round(sfxVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVol}
              onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#4A3B32]"
            />
          </div>

          {/* Device Mode Switcher */}
          <div className="py-2 border-t border-stone-200">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-xs font-bold text-stone-800">Mode Perangkat Bermain</p>
                <p className="text-[11px] text-stone-500">Pilih tata letak kontrol sesuai perangkatmu</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playButtonClick();
                  setShowTouch(false);
                  saveSettings({ deviceMode: 'pc', showTouchControls: false });
                }}
                className={`hud-btn py-2 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  !showTouch
                    ? 'bg-amber-100 border-amber-600 text-amber-950 shadow-sm border-b-3 border-b-amber-700'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Komputer (PC)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playButtonClick();
                  setShowTouch(true);
                  saveSettings({ deviceMode: 'mobile', showTouchControls: true });
                }}
                className={`hud-btn py-2 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  showTouch
                    ? 'bg-pink-100 border-pink-500 text-pink-950 shadow-sm border-b-3 border-b-pink-600'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>HP / Tablet</span>
              </button>
            </div>
          </div>

          {/* Touch Controls Toggle */}
          <div className="flex justify-between items-center py-2 border-t border-stone-200">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-pink-600" />
              <div>
                <p className="text-xs font-bold text-stone-800">Tombol Kontrol Layar Sentuh</p>
                <p className="text-[11px] text-stone-500">Tampilkan tombol gamepad virtual di layar</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTouchToggle}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                showTouch ? 'bg-pink-500' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  showTouch ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Hints Toggle */}
          <div className="flex justify-between items-center py-2 border-t border-stone-200">
            <div>
              <p className="text-xs font-bold text-stone-800">Petunjuk Teka-teki</p>
              <p className="text-[11px] text-stone-500">Tampilkan tombol bantuan petunjuk di HUD</p>
            </div>
            <button
              type="button"
              onClick={handleHintsToggle}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                showHints ? 'bg-[#4A3B32]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  showHints ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Reset Save Data */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-red-700">Hapus Progres</p>
              <p className="text-[11px] text-stone-500">Mulai petualangan dari Level 1 lagi</p>
            </div>
            <button
              type="button"
              onClick={handleResetProgress}
              className={`hud-btn text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                confirmReset
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmReset ? 'Yakin Hapus?' : 'Reset'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Close */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="hud-btn px-5 py-2.5 bg-gradient-to-b from-[#5D4037] to-[#3E2723] hover:from-[#4E342E] hover:to-[#2E1C14] border border-[#8D6E63] border-b-4 border-b-[#27150F] text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
