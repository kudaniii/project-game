/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Web Audio API Procedural Sound Engine & Melodic Chiptune BGM Synthesizer
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;
  private currentTrack: string | null = null;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private bgmNoteIndex: number = 0;
  private tempo: number = 120; // BPM
  public bgmVolume: number = 0.55;
  public sfxVolume: number = 0.75;
  public isMuted: boolean = false;

  private noteFreqs: Record<string, number> = {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98,
    'REST': 0
  };

  constructor() {
    // Initialized lazily on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGainNode = this.ctx.createGain();
        this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
        this.masterGainNode.connect(this.ctx.destination);

        this.bgmGainNode = this.ctx.createGain();
        this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
        this.bgmGainNode.connect(this.masterGainNode);

        this.sfxGainNode = this.ctx.createGain();
        this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGainNode.connect(this.masterGainNode);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public userInteracted() {
    this.initContext();
  }

  public setVolumes(bgm: number, sfx: number) {
    this.bgmVolume = Math.max(0, Math.min(1, bgm));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    if (this.ctx && this.bgmGainNode && this.sfxGainNode) {
      const now = this.ctx.currentTime;
      this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, now);
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, now);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGainNode) {
      const now = this.ctx.currentTime;
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : 1, now);
    }
    return this.isMuted;
  }

  // --- SFX GENERATOR ---
  public playJump(character: 'bubu' | 'dudu') {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (character === 'bubu') {
      // Lower, warm spring sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.18);
    } else {
      // Dudu: High, light, airy bunny boing
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.18);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  }

  public playPush() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.1);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playLift() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playThrow() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.14);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playCollectFlower() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [this.noteFreqs['G5'], this.noteFreqs['C6']];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.25, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.16);
    });
  }

  public playCollectStar() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [this.noteFreqs['C5'], this.noteFreqs['E5'], this.noteFreqs['G5'], this.noteFreqs['C6']];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.3, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.26);
    });
  }

  public playSwitchClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playDoorOpen() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [this.noteFreqs['E4'], this.noteFreqs['G4'], this.noteFreqs['C5'], this.noteFreqs['E5']];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.25, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.36);
    });
  }

  public playCheckpoint() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [this.noteFreqs['A4'], this.noteFreqs['C5'], this.noteFreqs['E5']];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  }

  public playRespawn() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playLevelClear() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const melody = [
      { note: 'C5', dur: 0.14 },
      { note: 'E5', dur: 0.14 },
      { note: 'G5', dur: 0.14 },
      { note: 'C6', dur: 0.35 },
      { note: 'B5', dur: 0.14 },
      { note: 'C6', dur: 0.55 },
    ];
    let t = now;
    melody.forEach((item) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.noteFreqs[item.note] || 440, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + item.dur);
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(t);
      osc.stop(t + item.dur);
      t += item.dur * 0.9;
    });
  }

  public playButtonClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // --- PROCEDURAL BGM ENGINE ---
  public playBGM(trackName: 'menu' | 'garden' | 'forest' | 'cave' | 'star' | 'light') {
    this.initContext();
    if (this.currentTrack === trackName && this.isBgmPlaying) return;
    this.stopBGM();
    this.currentTrack = trackName;
    this.isBgmPlaying = true;
    this.bgmNoteIndex = 0;

    const tracks: Record<string, { tempo: number; notes: { note: string; bass: string; dur: number }[] }> = {
      menu: {
        tempo: 100,
        notes: [
          { note: 'E5', bass: 'C3', dur: 0.4 },
          { note: 'G5', bass: 'G3', dur: 0.4 },
          { note: 'C6', bass: 'E3', dur: 0.8 },
          { note: 'B5', bass: 'G3', dur: 0.4 },
          { note: 'A5', bass: 'F3', dur: 0.4 },
          { note: 'G5', bass: 'C4', dur: 0.8 },
          { note: 'E5', bass: 'C3', dur: 0.4 },
          { note: 'F5', bass: 'D3', dur: 0.4 },
          { note: 'G5', bass: 'G3', dur: 0.8 },
          { note: 'D5', bass: 'B3', dur: 0.4 },
          { note: 'C5', bass: 'C3', dur: 0.8 },
          { note: 'REST', bass: 'REST', dur: 0.4 }
        ]
      },
      garden: {
        tempo: 125,
        notes: [
          { note: 'C5', bass: 'C3', dur: 0.3 },
          { note: 'E5', bass: 'G3', dur: 0.3 },
          { note: 'G5', bass: 'C4', dur: 0.3 },
          { note: 'A5', bass: 'F3', dur: 0.3 },
          { note: 'G5', bass: 'C3', dur: 0.6 },
          { note: 'E5', bass: 'G3', dur: 0.3 },
          { note: 'F5', bass: 'F3', dur: 0.3 },
          { note: 'D5', bass: 'G3', dur: 0.6 },
          { note: 'E5', bass: 'C3', dur: 0.3 },
          { note: 'D5', bass: 'G3', dur: 0.3 },
          { note: 'C5', bass: 'C3', dur: 0.6 }
        ]
      },
      forest: {
        tempo: 110,
        notes: [
          { note: 'G4', bass: 'E3', dur: 0.35 },
          { note: 'B4', bass: 'B3', dur: 0.35 },
          { note: 'D5', bass: 'E3', dur: 0.35 },
          { note: 'E5', bass: 'A3', dur: 0.7 },
          { note: 'D5', bass: 'D3', dur: 0.35 },
          { note: 'B4', bass: 'G3', dur: 0.35 },
          { note: 'A4', bass: 'C3', dur: 0.7 },
          { note: 'G4', bass: 'D3', dur: 0.35 },
          { note: 'A4', bass: 'G3', dur: 0.35 },
          { note: 'B4', bass: 'E3', dur: 0.7 }
        ]
      },
      light: {
        tempo: 130,
        notes: [
          { note: 'E5', bass: 'C3', dur: 0.28 },
          { note: 'G5', bass: 'E3', dur: 0.28 },
          { note: 'A5', bass: 'F3', dur: 0.28 },
          { note: 'C6', bass: 'G3', dur: 0.56 },
          { note: 'B5', bass: 'E3', dur: 0.28 },
          { note: 'A5', bass: 'F3', dur: 0.28 },
          { note: 'G5', bass: 'C4', dur: 0.56 },
          { note: 'D5', bass: 'G3', dur: 0.28 },
          { note: 'E5', bass: 'C3', dur: 0.56 }
        ]
      },
      cave: {
        tempo: 90,
        notes: [
          { note: 'A4', bass: 'A3', dur: 0.6 },
          { note: 'C5', bass: 'E3', dur: 0.6 },
          { note: 'E5', bass: 'A3', dur: 0.6 },
          { note: 'G5', bass: 'C4', dur: 0.9 },
          { note: 'E5', bass: 'A3', dur: 0.6 },
          { note: 'D5', bass: 'F3', dur: 0.6 },
          { note: 'C5', bass: 'C3', dur: 0.9 }
        ]
      },
      star: {
        tempo: 105,
        notes: [
          { note: 'C5', bass: 'C3', dur: 0.5 },
          { note: 'G5', bass: 'G3', dur: 0.5 },
          { note: 'A5', bass: 'F3', dur: 0.5 },
          { note: 'F5', bass: 'C4', dur: 0.5 },
          { note: 'E5', bass: 'C3', dur: 0.5 },
          { note: 'D5', bass: 'G3', dur: 0.5 },
          { note: 'C5', bass: 'C3', dur: 1.0 },
          { note: 'G5', bass: 'G3', dur: 0.5 },
          { note: 'C6', bass: 'A3', dur: 0.5 },
          { note: 'B5', bass: 'E3', dur: 0.5 },
          { note: 'A5', bass: 'F3', dur: 0.5 },
          { note: 'G5', bass: 'C4', dur: 1.0 }
        ]
      }
    };

    const track = tracks[trackName] || tracks.menu;
    this.tempo = track.tempo;

    const playNextNote = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGainNode) return;
      const item = track.notes[this.bgmNoteIndex];
      this.bgmNoteIndex = (this.bgmNoteIndex + 1) % track.notes.length;
      const now = this.ctx.currentTime;
      const beatDur = item.dur * (60 / this.tempo);

      if (item.note !== 'REST' && this.noteFreqs[item.note]) {
        // Melody synth (warm kalimba/chime sine wave)
        const melOsc = this.ctx.createOscillator();
        const melGain = this.ctx.createGain();
        melOsc.type = trackName === 'cave' ? 'triangle' : 'sine';
        melOsc.frequency.setValueAtTime(this.noteFreqs[item.note], now);
        melGain.gain.setValueAtTime(0.18, now);
        melGain.gain.exponentialRampToValueAtTime(0.001, now + beatDur * 0.9);
        melOsc.connect(melGain);
        melGain.connect(this.bgmGainNode);
        melOsc.start(now);
        melOsc.stop(now + beatDur * 0.95);
      }

      if (item.bass !== 'REST' && this.noteFreqs[item.bass]) {
        // Bass accompaniment
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(this.noteFreqs[item.bass], now);
        bassGain.gain.setValueAtTime(0.12, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + beatDur * 0.85);
        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGainNode);
        bassOsc.start(now);
        bassOsc.stop(now + beatDur * 0.9);
      }

      this.bgmTimer = window.setTimeout(playNextNote, beatDur * 1000);
    };

    playNextNote();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
