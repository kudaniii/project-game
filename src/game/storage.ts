/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Save and Persistence Engine with LocalStorage Validation
 */

import { GameSaveData } from './types.ts';

const STORAGE_KEY = 'bubu_dudu_save_v1';

const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
};

const DEFAULT_SAVE_DATA: GameSaveData = {
  unlockedLevels: 1,
  currentLevel: 1,
  completedStory: false,
  starsPerLevel: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  flowersPerLevel: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  settings: {
    bgmVolume: 0.6,
    sfxVolume: 0.8,
    showTouchControls: true, // safe default for mobile & accessible
    showControlHints: true,
    deviceMode: 'mobile',
    hasSelectedDevice: false,
  },
};

export class StorageManager {
  private static instance: StorageManager;
  private cachedData: GameSaveData | null = null;

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  public load(): GameSaveData {
    if (this.cachedData) return this.cachedData;

    const detectedTouch = isTouchDevice();
    const defaultMode: 'mobile' | 'pc' = detectedTouch ? 'mobile' : 'pc';

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.cachedData = {
          ...DEFAULT_SAVE_DATA,
          settings: {
            ...DEFAULT_SAVE_DATA.settings,
            deviceMode: defaultMode,
            showTouchControls: detectedTouch,
          },
        };
        return this.cachedData;
      }

      const parsed = JSON.parse(raw);

      // Validate schema
      const unlockedLevels =
        typeof parsed.unlockedLevels === 'number' && parsed.unlockedLevels >= 1
          ? Math.min(5, parsed.unlockedLevels)
          : 1;

      const currentLevel =
        typeof parsed.currentLevel === 'number' && parsed.currentLevel >= 1
          ? Math.min(5, parsed.currentLevel)
          : 1;

      const completedStory = Boolean(parsed.completedStory);

      const starsPerLevel: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      if (parsed.starsPerLevel && typeof parsed.starsPerLevel === 'object') {
        for (let i = 1; i <= 5; i++) {
          starsPerLevel[i] =
            typeof parsed.starsPerLevel[i] === 'number'
              ? Math.max(0, Math.min(3, parsed.starsPerLevel[i]))
              : 0;
        }
      }

      const flowersPerLevel: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      if (parsed.flowersPerLevel && typeof parsed.flowersPerLevel === 'object') {
        for (let i = 1; i <= 5; i++) {
          flowersPerLevel[i] =
            typeof parsed.flowersPerLevel[i] === 'number'
              ? Math.max(0, parsed.flowersPerLevel[i])
              : 0;
        }
      }

      const rawDevice = parsed.settings?.deviceMode;
      const deviceMode: 'pc' | 'mobile' =
        rawDevice === 'mobile' || rawDevice === 'pc' ? rawDevice : defaultMode;

      const settings = {
        bgmVolume:
          typeof parsed.settings?.bgmVolume === 'number'
            ? Math.max(0, Math.min(1, parsed.settings.bgmVolume))
            : 0.6,
        sfxVolume:
          typeof parsed.settings?.sfxVolume === 'number'
            ? Math.max(0, Math.min(1, parsed.settings.sfxVolume))
            : 0.8,
        showTouchControls:
          parsed.settings?.showTouchControls !== undefined
            ? Boolean(parsed.settings.showTouchControls)
            : detectedTouch,
        showControlHints: parsed.settings?.showControlHints !== false,
        deviceMode,
        hasSelectedDevice: Boolean(parsed.settings?.hasSelectedDevice),
      };

      this.cachedData = {
        unlockedLevels,
        currentLevel,
        completedStory,
        starsPerLevel,
        flowersPerLevel,
        settings,
      };

      return this.cachedData;
    } catch (e) {
      console.warn('Failed to parse local storage, falling back to defaults:', e);
      this.cachedData = {
        ...DEFAULT_SAVE_DATA,
        settings: {
          ...DEFAULT_SAVE_DATA.settings,
          deviceMode: defaultMode,
          showTouchControls: detectedTouch,
        },
      };
      return this.cachedData;
    }
  }

  public save(data: Partial<GameSaveData>) {
    const current = this.load();
    const updated: GameSaveData = {
      ...current,
      ...data,
      settings: {
        ...current.settings,
        ...(data.settings || {}),
      },
      starsPerLevel: {
        ...current.starsPerLevel,
        ...(data.starsPerLevel || {}),
      },
      flowersPerLevel: {
        ...current.flowersPerLevel,
        ...(data.flowersPerLevel || {}),
      },
    };

    this.cachedData = updated;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to write to local storage:', e);
    }
  }

  public completeLevel(levelId: number, stars: number, flowers: number) {
    const current = this.load();
    const nextUnlocked = Math.max(current.unlockedLevels, Math.min(5, levelId + 1));
    const prevStars = current.starsPerLevel[levelId] || 0;
    const prevFlowers = current.flowersPerLevel[levelId] || 0;

    const starsPerLevel = {
      ...current.starsPerLevel,
      [levelId]: Math.max(prevStars, stars),
    };
    const flowersPerLevel = {
      ...current.flowersPerLevel,
      [levelId]: Math.max(prevFlowers, flowers),
    };

    const completedStory = current.completedStory || levelId >= 5;

    this.save({
      unlockedLevels: nextUnlocked,
      currentLevel: Math.min(5, levelId + 1),
      completedStory,
      starsPerLevel,
      flowersPerLevel,
    });
  }

  public resetProgress() {
    this.cachedData = { ...DEFAULT_SAVE_DATA };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }
}

export const storageManager = StorageManager.getInstance();
