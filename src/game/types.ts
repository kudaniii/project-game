/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Core Game Type Definitions
 */

export type CharacterType = 'bubu' | 'dudu';

export type CharacterAnimState = 'idle' | 'walk' | 'jump' | 'fall' | 'push' | 'victory';

export interface PlayerState {
  type: CharacterType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  state: CharacterAnimState;
  animTimer: number;
  animFrame: number;
  blinkTimer: number;
  isBlinking: boolean;
  isPushing: boolean;
  isGrabbing: boolean;
  grabbedCrateId: string | null;
  isCarrying: boolean;
  carriedCrateId: string | null;
  carryCooldown: number;
  respawnX: number;
  respawnY: number;
  hasKey: string | null;
  heartsCollected: number;
  starsCollected: number;
}

export type PlatformType = 'solid' | 'moving' | 'one_way' | 'bridge';

export interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  themeStyle?: 'grass' | 'wood' | 'crystal' | 'cloud' | 'star';
  // Moving platform properties
  startX?: number;
  startY?: number;
  targetX?: number;
  targetY?: number;
  speed?: number;
  progress?: number;
  direction?: 1 | -1;
  // Bridge that appears when switch is active
  requiresSwitch?: string;
  visible?: boolean;
}

export interface Crate {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  isHeavy: boolean; // Bubu can push heavy, Dudu can only push light
  style: 'wood' | 'crystal' | 'stone';
  spawnX?: number;
  spawnY?: number;
  grabbedBy?: 'bubu' | 'dudu' | null;
  carriedBy?: 'bubu' | 'dudu' | null;
}

export type SwitchType = 'pressure' | 'lever';

export interface SwitchObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: SwitchType;
  isPressed: boolean;
  targetId: string; // What door or platform this switch affects
  requiresBoth?: boolean;
  label?: string;
  lastToggleTime?: number;
}

export interface DoorObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
  openProgress: number; // 0 (closed) to 1 (fully open)
  requiresKey?: string; // id of key required
  requiresSwitches?: string[]; // IDs of switches required
  style: 'flower' | 'crystal' | 'star' | 'wooden';
}

export interface CollectibleItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'flower_key' | 'crystal_key' | 'star_fragment' | 'heart' | 'flower';
  collected: boolean;
  floatOffset: number;
}

export interface Checkpoint {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isActivated: boolean;
}

export interface WindDraft {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  forceY: number; // upward acceleration
}

export interface ExitPortal {
  x: number;
  y: number;
  width: number;
  height: number;
  bubuReached: boolean;
  duduReached: boolean;
  isUnlocked: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'heart' | 'sparkle' | 'dust' | 'leaf' | 'star';
  rotation?: number;
  rotationSpeed?: number;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  theme: 'garden' | 'forest' | 'cave' | 'light' | 'star';
  width: number;
  height: number;
  bubuSpawn: { x: number; y: number };
  duduSpawn: { x: number; y: number };
  platforms: Platform[];
  crates: Crate[];
  switches: SwitchObject[];
  doors: DoorObject[];
  collectibles: CollectibleItem[];
  checkpoints: Checkpoint[];
  windDrafts?: WindDraft[];
  exitPortal: ExitPortal;
  introStoryId: string;
  outroStoryId: string;
  hint: string;
  hintSteps?: {
    bubu: string;
    dudu: string;
    puzzle: string;
    chasmTip?: string;
  };
  objectiveText?: string;
}

export interface DialogueLine {
  speaker: 'bubu' | 'dudu' | 'narrator';
  text: string;
  emotion?: 'happy' | 'determined' | 'love' | 'surprised' | 'curious' | 'shy';
}

export interface StoryScene {
  id: string;
  title: string;
  lines: DialogueLine[];
}

export interface GameSaveData {
  unlockedLevels: number;
  currentLevel: number;
  completedStory: boolean;
  starsPerLevel: Record<number, number>;
  flowersPerLevel: Record<number, number>;
  settings: {
    bgmVolume: number;
    sfxVolume: number;
    showTouchControls: boolean;
    showControlHints: boolean;
    deviceMode: 'pc' | 'mobile';
    hasSelectedDevice: boolean;
  };
}

export type GameScreen = 
  | 'menu'
  | 'character_intro'
  | 'level_select'
  | 'gameplay'
  | 'pause'
  | 'level_complete'
  | 'settings'
  | 'credits'
  | 'ending';

export type GameMode = 'two_player' | 'practice';
