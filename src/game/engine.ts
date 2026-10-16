/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Core Game Engine: Game Loop, Cooperative Camera, Particles, and Level Flow
 */

import { PlayerState, LevelData, Particle, GameMode } from './types.ts';
import { GAME_LEVELS } from './levels.ts';
import { PhysicsEngine } from './physics.ts';
import { GameRenderer } from './renderer.ts';
import { inputManager } from './input.ts';
import { soundEngine } from './audio.ts';
import { storageManager } from './storage.ts';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: GameRenderer;

  public currentLevelData: LevelData;
  public bubu: PlayerState;
  public dudu: PlayerState;
  public particles: Particle[] = [];

  // Cooperative Camera
  public camera = {
    x: 0,
    y: 0,
    zoom: 1,
    targetX: 0,
    targetY: 0,
    targetZoom: 1,
  };

  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private gameTime: number = 0;

  public gameMode: GameMode = 'two_player';
  public starsCollectedThisLevel: number = 0;
  public flowersCollectedThisLevel: number = 0;
  public isVictory: boolean = false;
  public victoryTimer: number = 0;

  // Callbacks
  public onLevelComplete?: (levelId: number, stars: number, flowers: number) => void;
  public onShowStory?: (storyId: string) => void;
  public onHintRequest?: (hintText: string) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D context');
    this.ctx = context;
    this.renderer = new GameRenderer(this.ctx);

    this.currentLevelData = JSON.parse(JSON.stringify(GAME_LEVELS[0]));
    this.bubu = this.createPlayer('bubu', 80, 440);
    this.dudu = this.createPlayer('dudu', 140, 440);
  }

  private createPlayer(type: 'bubu' | 'dudu', x: number, y: number): PlayerState {
    return {
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      width: type === 'bubu' ? 40 : 36,
      height: type === 'bubu' ? 44 : 42,
      isGrounded: false,
      facing: 'right',
      state: 'idle',
      animTimer: 0,
      animFrame: 0,
      blinkTimer: Math.random() * 60,
      isBlinking: false,
      isPushing: false,
      isGrabbing: false,
      grabbedCrateId: null,
      isCarrying: false,
      carriedCrateId: null,
      carryCooldown: 0,
      respawnX: x,
      respawnY: y,
      hasKey: null,
      heartsCollected: 0,
      starsCollected: 0,
    };
  }

  public loadLevel(levelId: number, mode: GameMode = 'two_player') {
    const raw = GAME_LEVELS.find((l) => l.id === levelId) || GAME_LEVELS[0];
    this.currentLevelData = JSON.parse(JSON.stringify(raw));
    this.gameMode = mode;
    this.starsCollectedThisLevel = 0;
    this.flowersCollectedThisLevel = 0;
    this.isVictory = false;
    this.victoryTimer = 0;
    this.particles = [];

    // Initialize players at spawn
    this.bubu = this.createPlayer(
      'bubu',
      this.currentLevelData.bubuSpawn.x,
      this.currentLevelData.bubuSpawn.y
    );
    this.dudu = this.createPlayer(
      'dudu',
      this.currentLevelData.duduSpawn.x,
      this.currentLevelData.duduSpawn.y
    );

    inputManager.setPracticeMode(mode === 'practice', 'bubu');

    // Reset camera immediately onto spawn
    this.camera.x = (this.bubu.x + this.dudu.x) / 2;
    this.camera.y = (this.bubu.y + this.dudu.y) / 2;
    this.camera.targetX = this.camera.x;
    this.camera.targetY = this.camera.y;
    this.camera.zoom = 1;
    this.camera.targetZoom = 1;

    // Switch BGM according to level theme
    soundEngine.playBGM(this.currentLevelData.theme);

    // Register quick R-key crate reset
    inputManager.onResetCallback = () => this.resetCrates();
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
    inputManager.onResetCallback = undefined;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
    if (!paused) {
      this.lastTime = performance.now();
    }
  }

  public restartCurrentLevel() {
    this.loadLevel(this.currentLevelData.id, this.gameMode);
  }

  public resetCrates() {
    this.bubu.isCarrying = false;
    this.bubu.carriedCrateId = null;
    this.dudu.isCarrying = false;
    this.dudu.carriedCrateId = null;

    for (const c of this.currentLevelData.crates) {
      c.carriedBy = null;
      c.grabbedBy = null;
      if (c.spawnX !== undefined && c.spawnY !== undefined) {
        c.x = c.spawnX;
        c.y = c.spawnY;
        c.vx = 0;
        c.vy = 0;
        this.spawnSparkles(c.x + c.width / 2, c.y + c.height / 2, '#FFD54F', 10);
      }
    }
    soundEngine.playRespawn();
  }

  // --- GAME LOOP ---
  private loop = (currentTime: number) => {
    if (!this.isRunning) return;

    const rawDelta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Clamp delta time to avoid large jumps on tab switch
    const dt = Math.min(0.05, Math.max(0.001, rawDelta));
    const dtScale = dt * 60; // 1.0 at 60fps

    if (!this.isPaused) {
      this.update(dt, dtScale);
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  // --- UPDATE ---
  private update(dt: number, dtScale: number) {
    this.gameTime += dt;

    // 1. Inputs
    const inputs = inputManager.getInput();

    // 2. Physics & World
    PhysicsEngine.updateMovingPlatforms(this.currentLevelData.platforms, dtScale);
    PhysicsEngine.updateCrates(
      this.currentLevelData.crates,
      this.currentLevelData.platforms,
      dtScale,
      this.currentLevelData.height
    );

    // Update Players
    PhysicsEngine.updatePlayer(
      this.bubu,
      inputs.bubu,
      this.currentLevelData.platforms,
      this.currentLevelData.crates,
      this.currentLevelData.doors,
      this.currentLevelData.windDrafts,
      dtScale
    );

    PhysicsEngine.updatePlayer(
      this.dudu,
      inputs.dudu,
      this.currentLevelData.platforms,
      this.currentLevelData.crates,
      this.currentLevelData.doors,
      this.currentLevelData.windDrafts,
      dtScale
    );

    // 3. Levers interaction (F for Bubu, Enter for Dudu)
    this.handleLeverInteractions(inputs);

    // 4. Switches & Doors
    PhysicsEngine.updateSwitchesAndDoors(
      this.currentLevelData.switches,
      this.currentLevelData.doors,
      this.currentLevelData.platforms,
      this.bubu,
      this.dudu,
      this.currentLevelData.crates
    );

    // 5. Collectibles
    this.handleCollectibles();

    // 6. Checkpoints
    this.handleCheckpoints();

    // 7. Pit Fall / Hazard Respawn
    this.handleHazards();

    // 8. Exit Portal & Level Victory
    this.handleExitPortal(dt);

    // 9. Update Camera
    this.updateCamera(dtScale);

    // 10. Update Particles
    this.updateParticles(dtScale);
  }

  private handleLeverInteractions(inputs: {
    bubu: { action: boolean };
    dudu: { action: boolean };
  }) {
    const now = performance.now();
    for (const sw of this.currentLevelData.switches) {
      if (sw.type === 'lever') {
        const bubuNear = PhysicsEngine.checkAABB(
          this.bubu.x - 15,
          this.bubu.y - 15,
          this.bubu.width + 30,
          this.bubu.height + 30,
          sw.x,
          sw.y,
          sw.width,
          sw.height
        );
        const duduNear = PhysicsEngine.checkAABB(
          this.dudu.x - 15,
          this.dudu.y - 15,
          this.dudu.width + 30,
          this.dudu.height + 30,
          sw.x,
          sw.y,
          sw.width,
          sw.height
        );
        const canToggle = !sw.lastToggleTime || now - sw.lastToggleTime > 400; // 400ms debounce
        if (canToggle && ((bubuNear && inputs.bubu.action) || (duduNear && inputs.dudu.action))) {
          // Toggle lever
          sw.isPressed = !sw.isPressed;
          sw.lastToggleTime = now;
          soundEngine.playSwitchClick();
          this.spawnSparkles(sw.x + sw.width / 2, sw.y + sw.height / 2, '#FFD54F', 6);
        }
      }
    }
  }

  private handleCollectibles() {
    for (const item of this.currentLevelData.collectibles) {
      if (item.collected) continue;
      const bubuCollided = PhysicsEngine.checkAABB(
        this.bubu.x,
        this.bubu.y,
        this.bubu.width,
        this.bubu.height,
        item.x,
        item.y,
        item.width,
        item.height
      );
      const duduCollided = PhysicsEngine.checkAABB(
        this.dudu.x,
        this.dudu.y,
        this.dudu.width,
        this.dudu.height,
        item.x,
        item.y,
        item.width,
        item.height
      );

      if (bubuCollided || duduCollided) {
        item.collected = true;
        if (item.type === 'star_fragment') {
          this.starsCollectedThisLevel++;
          soundEngine.playCollectStar();
          this.spawnSparkles(item.x + item.width / 2, item.y + item.height / 2, '#FFE082', 12);
        } else if (item.type === 'flower_key' || item.type === 'crystal_key') {
          const collector = bubuCollided ? this.bubu : this.dudu;
          collector.hasKey = item.id;
          soundEngine.playCollectFlower();
          this.spawnHearts(item.x + item.width / 2, item.y + item.height / 2, 8);
        } else {
          this.flowersCollectedThisLevel++;
          soundEngine.playCollectFlower();
          this.spawnHearts(item.x + item.width / 2, item.y + item.height / 2, 6);
        }
      }
    }
  }

  private handleCheckpoints() {
    for (const cp of this.currentLevelData.checkpoints) {
      const bubuTouch = PhysicsEngine.checkAABB(
        this.bubu.x,
        this.bubu.y,
        this.bubu.width,
        this.bubu.height,
        cp.x,
        cp.y,
        cp.width,
        cp.height
      );
      const duduTouch = PhysicsEngine.checkAABB(
        this.dudu.x,
        this.dudu.y,
        this.dudu.width,
        this.dudu.height,
        cp.x,
        cp.y,
        cp.width,
        cp.height
      );
      if ((bubuTouch || duduTouch) && !cp.isActivated) {
        cp.isActivated = true;
        // Update both players' respawn point
        this.bubu.respawnX = cp.x - 20;
        this.bubu.respawnY = cp.y;
        this.dudu.respawnX = cp.x + 40;
        this.dudu.respawnY = cp.y;
        soundEngine.playCheckpoint();
        this.spawnHearts(cp.x + cp.width / 2, cp.y + 20, 14);
      }
    }
  }

  private handleHazards() {
    const bottomBound = this.currentLevelData.height + 40;
    // Check Bubu fall
    if (this.bubu.y > bottomBound) {
      this.bubu.x = this.bubu.respawnX;
      this.bubu.y = this.bubu.respawnY;
      this.bubu.vx = 0;
      this.bubu.vy = 0;
      soundEngine.playRespawn();
      this.spawnHearts(this.bubu.x + 20, this.bubu.y + 20, 8);
    }
    // Check Dudu fall
    if (this.dudu.y > bottomBound) {
      this.dudu.x = this.dudu.respawnX;
      this.dudu.y = this.dudu.respawnY;
      this.dudu.vx = 0;
      this.dudu.vy = 0;
      soundEngine.playRespawn();
      this.spawnHearts(this.dudu.x + 18, this.dudu.y + 20, 8);
    }
  }

  private handleExitPortal(dt: number) {
    const portal = this.currentLevelData.exitPortal;
    const bubuIn = PhysicsEngine.checkAABB(
      this.bubu.x,
      this.bubu.y,
      this.bubu.width,
      this.bubu.height,
      portal.x,
      portal.y,
      portal.width,
      portal.height
    );
    const duduIn = PhysicsEngine.checkAABB(
      this.dudu.x,
      this.dudu.y,
      this.dudu.width,
      this.dudu.height,
      portal.x,
      portal.y,
      portal.width,
      portal.height
    );

    portal.bubuReached = bubuIn;
    portal.duduReached = duduIn;

    // Both reached the goal!
    if (bubuIn && duduIn && !this.isVictory) {
      this.isVictory = true;
      this.bubu.state = 'victory';
      this.dudu.state = 'victory';
      soundEngine.playLevelClear();
      this.spawnHearts(portal.x + portal.width / 2, portal.y + portal.height / 2, 24);
      this.spawnSparkles(portal.x + portal.width / 2, portal.y + portal.height / 2, '#FFD54F', 24);
    }

    if (this.isVictory) {
      this.victoryTimer += dt;
      if (this.victoryTimer > 2.0) {
        // Save progress
        storageManager.completeLevel(
          this.currentLevelData.id,
          this.starsCollectedThisLevel,
          this.flowersCollectedThisLevel
        );
        if (this.onLevelComplete) {
          this.onLevelComplete(
            this.currentLevelData.id,
            this.starsCollectedThisLevel,
            this.flowersCollectedThisLevel
          );
        }
      }
    }
  }

  // --- COOPERATIVE DUAL-PLAYER CAMERA ---
  private updateCamera(dtScale: number) {
    const p1 = this.bubu;
    const p2 = this.dudu;

    // Midpoint between both characters
    const midX = (p1.x + p1.width / 2 + p2.x + p2.width / 2) / 2;
    const midY = (p1.y + p1.height / 2 + p2.y + p2.height / 2) / 2;

    // Distance between players
    const dx = Math.abs(p1.x + p1.width / 2 - (p2.x + p2.width / 2));
    const dy = Math.abs(p1.y + p1.height / 2 - (p2.y + p2.height / 2));

    // Dynamic zoom to keep both in view comfortably
    const viewW = this.canvas.width;
    const viewH = this.canvas.height;
    const zoomX = (viewW * 0.7) / Math.max(380, dx + 120);
    const zoomY = (viewH * 0.7) / Math.max(260, dy + 100);
    const targetZoom = Math.max(0.75, Math.min(1.15, Math.min(zoomX, zoomY)));

    this.camera.targetX = midX;
    this.camera.targetY = midY;
    this.camera.targetZoom = targetZoom;

    // Smooth lerp
    const lerpRate = 0.08 * dtScale;
    this.camera.x += (this.camera.targetX - this.camera.x) * lerpRate;
    this.camera.y += (this.camera.targetY - this.camera.y) * lerpRate;
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * lerpRate;
  }

  // --- PARTICLES ---
  public spawnHearts(x: number, y: number, count: number = 8) {
    const colors = ['#FF8DA1', '#FF4081', '#FF80AB', '#F48FB1'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 2.5 - 1.2,
        size: Math.random() * 6 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + 35,
        type: 'heart',
      });
    }
  }

  public spawnSparkles(x: number, y: number, color: string = '#FFE082', count: number = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 25,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 0.5,
        size: Math.random() * 4 + 4,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 30 + 25,
        type: 'star',
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  private updateParticles(dtScale: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dtScale;
      p.x += p.vx * dtScale;
      p.y += p.vy * dtScale;
      if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
        p.rotation += p.rotationSpeed * dtScale;
      }
      p.alpha = 1 - p.life / p.maxLife;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  // --- RENDER ---
  private render() {
    const ctx = this.ctx;
    const viewW = this.canvas.width;
    const viewH = this.canvas.height;

    ctx.clearRect(0, 0, viewW, viewH);

    // 1. Background (using camera parallax)
    this.renderer.renderBackground(
      this.currentLevelData,
      this.camera.x,
      this.camera.y,
      viewW,
      viewH,
      this.gameTime
    );

    // 2. World Transform (Camera follow & zoom)
    ctx.save();
    ctx.translate(viewW / 2, viewH / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 3. Render Wind Drafts
    if (this.currentLevelData.windDrafts) {
      for (const wind of this.currentLevelData.windDrafts) {
        this.renderer.renderWindDraft(wind, this.gameTime);
      }
    }

    // 4. Render Platforms & Bridges
    for (const p of this.currentLevelData.platforms) {
      this.renderer.renderPlatform(p, this.gameTime);
    }

    // 5. Render Crates
    for (const crate of this.currentLevelData.crates) {
      this.renderer.renderCrate(crate);
    }

    // 6. Render Switches
    for (const sw of this.currentLevelData.switches) {
      this.renderer.renderSwitch(sw);
    }

    // 7. Render Doors
    for (const door of this.currentLevelData.doors) {
      this.renderer.renderDoor(door);
    }

    // 8. Render Checkpoints
    for (const cp of this.currentLevelData.checkpoints) {
      this.renderer.renderCheckpoint(cp, this.gameTime);
    }

    // 9. Render Exit Portal
    this.renderer.renderExitPortal(this.currentLevelData.exitPortal, this.gameTime);

    // 10. Render Collectibles
    for (const item of this.currentLevelData.collectibles) {
      this.renderer.renderCollectible(item, this.gameTime);
    }

    // 11. Render Characters: Bubu & Dudu
    this.renderer.renderBubu(this.bubu);
    this.renderer.renderDudu(this.dudu);

    // 12. Render In-Game Particles
    this.renderer.renderParticles(this.particles);

    ctx.restore();
  }
}
