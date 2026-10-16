/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Robust Input Manager for Dual-Player Keyboard & Multi-Touch Virtual Controls
 */

export interface CharacterControlInput {
  left: boolean;
  right: boolean;
  jump: boolean;
  action: boolean;
}

export interface InputState {
  bubu: CharacterControlInput;
  dudu: CharacterControlInput;
}

export class InputManager {
  private activeKeys: Set<string> = new Set();
  // Virtual touch button states (buttonId -> boolean)
  private touchState: Map<string, boolean> = new Map();
  // Map pointerId to buttonId to safely handle simultaneous touches
  private pointerMap: Map<number, string> = new Map();
  private isSoloPractice: boolean = false;
  private activePracticeChar: 'bubu' | 'dudu' = 'bubu';

  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;
  private boundBlur: () => void;

  public onResetCallback?: () => void;
  public onTogglePracticeCallback?: () => void;

  constructor() {
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
    this.boundBlur = this.handleBlur.bind(this);
  }

  public init() {
    window.addEventListener('keydown', this.boundKeyDown, { passive: false });
    window.addEventListener('keyup', this.boundKeyUp, { passive: false });
    window.addEventListener('blur', this.boundBlur);
  }

  public destroy() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    window.removeEventListener('blur', this.boundBlur);
    this.activeKeys.clear();
    this.touchState.clear();
    this.pointerMap.clear();
    this.onResetCallback = undefined;
    this.onTogglePracticeCallback = undefined;
  }

  public setPracticeMode(isPractice: boolean, char: 'bubu' | 'dudu' = 'bubu') {
    this.isSoloPractice = isPractice;
    this.activePracticeChar = char;
  }

  public togglePracticeChar(): 'bubu' | 'dudu' {
    this.activePracticeChar = this.activePracticeChar === 'bubu' ? 'dudu' : 'bubu';
    return this.activePracticeChar;
  }

  public getActivePracticeChar(): 'bubu' | 'dudu' {
    return this.activePracticeChar;
  }

  private handleKeyDown(e: KeyboardEvent) {
    const code = e.code;
    const gameKeys = [
      'KeyA', 'KeyD', 'KeyW', 'Space', 'KeyF',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter',
      'KeyR', 'KeyQ', 'Tab'
    ];

    if (code === 'KeyR' && this.onResetCallback) {
      e.preventDefault();
      this.onResetCallback();
      return;
    }

    if ((code === 'KeyQ' || code === 'Tab') && this.onTogglePracticeCallback && this.isSoloPractice) {
      e.preventDefault();
      this.onTogglePracticeCallback();
      return;
    }

    if (gameKeys.includes(code)) {
      // Prevent browser scrolling (arrow keys, space)
      e.preventDefault();
    }

    this.activeKeys.add(code);
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.activeKeys.delete(e.code);
  }

  private handleBlur() {
    // Clear everything when window loses focus to avoid stuck running keys
    this.activeKeys.clear();
    this.touchState.clear();
    this.pointerMap.clear();
  }

  // --- TOUCH POINTER HANDLING ---
  public handlePointerDown(pointerId: number, buttonId: string) {
    this.pointerMap.set(pointerId, buttonId);
    this.touchState.set(buttonId, true);
  }

  public handlePointerUp(pointerId: number) {
    const buttonId = this.pointerMap.get(pointerId);
    if (buttonId) {
      this.touchState.set(buttonId, false);
      this.pointerMap.delete(pointerId);
    }
  }

  public handlePointerCancel(pointerId: number) {
    this.handlePointerUp(pointerId);
  }

  public releaseButton(buttonId: string) {
    this.touchState.set(buttonId, false);
  }

  public clearAllTouch() {
    this.touchState.clear();
    this.pointerMap.clear();
  }

  // --- QUERY CURRENT FRAME INPUTS ---
  public getInput(): InputState {
    const hasKey = (key: string) => this.activeKeys.has(key);
    const hasTouch = (btn: string) => Boolean(this.touchState.get(btn));

    // Bubu Keyboard Controls: A (left), D (right), W / Space (jump), F (action)
    const bubuKeyLeft = hasKey('KeyA');
    const bubuKeyRight = hasKey('KeyD');
    const bubuKeyJump = hasKey('KeyW') || hasKey('Space');
    const bubuKeyAction = hasKey('KeyF');

    // Dudu Keyboard Controls: ArrowLeft, ArrowRight, ArrowUp (jump), Enter (action)
    const duduKeyLeft = hasKey('ArrowLeft');
    const duduKeyRight = hasKey('ArrowRight');
    const duduKeyJump = hasKey('ArrowUp');
    const duduKeyAction = hasKey('Enter');

    let bubuState: CharacterControlInput = {
      left: bubuKeyLeft || hasTouch('bubu_left'),
      right: bubuKeyRight || hasTouch('bubu_right'),
      jump: bubuKeyJump || hasTouch('bubu_jump'),
      action: bubuKeyAction || hasTouch('bubu_action'),
    };

    let duduState: CharacterControlInput = {
      left: duduKeyLeft || hasTouch('dudu_left'),
      right: duduKeyRight || hasTouch('dudu_right'),
      jump: duduKeyJump || hasTouch('dudu_jump'),
      action: duduKeyAction || hasTouch('dudu_action'),
    };

    // In Solo Practice Mode, standard WASD, Arrow keys, or solo touch buttons drive the active character
    if (this.isSoloPractice) {
      const combinedInput: CharacterControlInput = {
        left: bubuKeyLeft || duduKeyLeft || hasTouch('bubu_left') || hasTouch('dudu_left') || hasTouch('solo_left'),
        right: bubuKeyRight || duduKeyRight || hasTouch('bubu_right') || hasTouch('dudu_right') || hasTouch('solo_right'),
        jump: bubuKeyJump || duduKeyJump || hasTouch('bubu_jump') || hasTouch('dudu_jump') || hasTouch('solo_jump'),
        action: bubuKeyAction || duduKeyAction || hasTouch('bubu_action') || hasTouch('dudu_action') || hasTouch('solo_action'),
      };

      if (this.activePracticeChar === 'bubu') {
        bubuState = combinedInput;
        duduState = { left: false, right: false, jump: false, action: false };
      } else {
        duduState = combinedInput;
        bubuState = { left: false, right: false, jump: false, action: false };
      }
    }

    return {
      bubu: bubuState,
      dudu: duduState,
    };
  }
}

export const inputManager = new InputManager();
