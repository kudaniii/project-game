/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Canvas 2D Procedural Renderer for Characters, Pastel Environments, and FX
 */

import {
  PlayerState,
  LevelData,
  Particle,
  Platform,
  Crate,
  SwitchObject,
  DoorObject,
  CollectibleItem,
  Checkpoint,
} from './types.ts';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  // --- CLEAR & PARALLAX BACKGROUND ---
  public renderBackground(
    level: LevelData,
    cameraX: number,
    cameraY: number,
    viewWidth: number,
    viewHeight: number,
    gameTime: number
  ) {
    const ctx = this.ctx;

    // Base Sky Gradient based on theme
    const skyGrad = ctx.createLinearGradient(0, 0, 0, viewHeight);
    if (level.theme === 'garden') {
      skyGrad.addColorStop(0, '#E8F5E9'); // pastel mint/sky
      skyGrad.addColorStop(0.5, '#F1F8E9');
      skyGrad.addColorStop(1, '#FFF9C4'); // warm cream morning sun
    } else if (level.theme === 'forest') {
      skyGrad.addColorStop(0, '#E0F2F1'); // cool pastel mint
      skyGrad.addColorStop(0.6, '#E8F5E9');
      skyGrad.addColorStop(1, '#FFF8E1');
    } else if (level.theme === 'cave') {
      skyGrad.addColorStop(0, '#2D2438'); // deep mystical pastel indigo
      skyGrad.addColorStop(0.6, '#3A2E4C');
      skyGrad.addColorStop(1, '#4A3B60');
    } else if (level.theme === 'light') {
      skyGrad.addColorStop(0, '#E1F5FE'); // airy sky blue
      skyGrad.addColorStop(0.5, '#FFF3E0');
      skyGrad.addColorStop(1, '#FCE4EC'); // soft pink sunset breeze
    } else {
      // Star Valley
      skyGrad.addColorStop(0, '#1A1829'); // twilight navy
      skyGrad.addColorStop(0.4, '#2A2040');
      skyGrad.addColorStop(0.8, '#4E2C56'); // romantic violet aurora
      skyGrad.addColorStop(1, '#2F264C');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    // Parallax Layer 1: Distant hills / clouds (0.2x speed)
    ctx.save();
    const p1Offset = (cameraX * 0.15) % 600;

    if (level.theme === 'cave') {
      // Background stalagmites / cave silhouettes
      ctx.fillStyle = 'rgba(32, 22, 45, 0.4)';
      for (let x = -p1Offset - 600; x < viewWidth + 600; x += 180) {
        ctx.beginPath();
        ctx.moveTo(x, viewHeight);
        ctx.lineTo(x + 90, viewHeight - 220);
        ctx.lineTo(x + 180, viewHeight);
        ctx.fill();
      }
    } else if (level.theme === 'star') {
      // Twinkling background stars and soft glowing aurora
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 45; i++) {
        const sx = ((i * 67 + cameraX * 0.05) % (viewWidth + 200)) - 100;
        const sy = (i * 31) % (viewHeight * 0.65);
        const radius = Math.sin(gameTime * 2 + i) * 0.5 + 1.2;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fill();
      }

      // Soft purple-pink aurora ribbon
      ctx.save();
      ctx.fillStyle = 'rgba(255, 175, 204, 0.12)';
      ctx.beginPath();
      ctx.moveTo(0, 100);
      for (let x = 0; x <= viewWidth; x += 40) {
        const y = 140 + Math.sin(x * 0.005 + gameTime * 0.8) * 35;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(viewWidth, 0);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.restore();
    } else {
      // Gentle pastel rolling hills
      ctx.fillStyle =
        level.theme === 'light'
          ? 'rgba(255, 228, 225, 0.5)'
          : 'rgba(200, 230, 201, 0.45)';
      ctx.beginPath();
      ctx.moveTo(-p1Offset, viewHeight);
      for (let x = -p1Offset; x < viewWidth + 400; x += 120) {
        const cy = viewHeight - 160 + Math.sin((x + cameraX * 0.1) * 0.005) * 40;
        ctx.quadraticCurveTo(x + 60, cy - 30, x + 120, cy);
      }
      ctx.lineTo(viewWidth + 400, viewHeight);
      ctx.fill();

      // Floating clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      const cloudOffset = (gameTime * 15 + cameraX * 0.1) % (viewWidth + 400);
      this.drawCuteCloud(viewWidth - cloudOffset, 80, 70);
      this.drawCuteCloud(viewWidth * 1.5 - cloudOffset, 140, 50);
      this.drawCuteCloud(viewWidth * 0.5 - cloudOffset, 60, 60);
    }
    ctx.restore();
  }

  private drawCuteCloud(x: number, y: number, radius: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
    ctx.arc(x + radius * 0.4, y - radius * 0.2, radius * 0.45, 0, Math.PI * 2);
    ctx.arc(x + radius * 0.8, y, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- DRAW PLATFORMS ---
  public renderPlatform(p: Platform, gameTime: number) {
    const ctx = this.ctx;
    if (p.type === 'bridge' && !p.visible) return;

    ctx.save();
    let topColor = '#A5D6A7'; // Pastel mint grass
    let bodyColor = '#81C784';
    let borderColor = '#66BB6A';

    if (p.themeStyle === 'wood') {
      topColor = '#D7CCC8';
      bodyColor = '#BCAAA4';
      borderColor = '#8D6E63';
    } else if (p.themeStyle === 'crystal') {
      topColor = '#B39DDB';
      bodyColor = '#9575CD';
      borderColor = '#7E57C2';
    } else if (p.themeStyle === 'cloud') {
      topColor = '#FFF9C4';
      bodyColor = '#FFE082';
      borderColor = '#FFD54F';
    } else if (p.themeStyle === 'star') {
      topColor = '#CE93D8';
      bodyColor = '#BA68C8';
      borderColor = '#AB47BC';
    }

    // Main rounded slab
    const radius = 8;
    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.width, p.height, [radius, radius, radius, radius]);
    ctx.fill();
    ctx.stroke();

    // Soft decorative top cap
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.width, Math.min(10, p.height), [radius, radius, 0, 0]);
    ctx.fill();

    // Grass frills or crystal glow details
    if (p.themeStyle === 'grass') {
      ctx.fillStyle = '#66BB6A';
      for (let x = p.x + 12; x < p.x + p.width - 12; x += 18) {
        ctx.beginPath();
        ctx.arc(x, p.y + 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (p.themeStyle === 'star') {
      // Glowing star runes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const pulse = Math.sin(gameTime * 3 + p.x) * 2;
      for (let x = p.x + 25; x < p.x + p.width - 20; x += 40) {
        ctx.beginPath();
        ctx.arc(x, p.y + p.height / 2, 2.5 + pulse * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (p.type === 'moving') {
      // Small directional gear/indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(p.x + p.width / 2, p.y + p.height / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- DRAW CRATES ---
  public renderCrate(crate: Crate) {
    const ctx = this.ctx;
    ctx.save();

    let bgColor = '#D7CCC8';
    let borderColor = '#8D6E63';
    let detailColor = '#BCAAA4';

    if (crate.style === 'crystal') {
      bgColor = '#C5CAE9';
      borderColor = '#7986CB';
      detailColor = '#9FA8DA';
    } else if (crate.style === 'stone') {
      bgColor = '#CFD8DC';
      borderColor = '#90A4AE';
      detailColor = '#B0BEC5';
    }

    // Box body
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(crate.x, crate.y, crate.width, crate.height, 6);
    ctx.fill();
    ctx.stroke();

    // Carried or Grabbed visual aura & badges
    if (crate.carriedBy) {
      ctx.strokeStyle = 'rgba(255, 152, 0, 0.95)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(crate.x - 3, crate.y - 3, crate.width + 6, crate.height + 6, 9);
      ctx.stroke();

      // Cute badge above carried crate
      ctx.fillStyle = 'rgba(230, 81, 0, 0.92)';
      ctx.beginPath();
      ctx.roundRect(crate.x + crate.width / 2 - 38, crate.y - 20, 76, 16, 8);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px Quicksand, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ Terangkat!', crate.x + crate.width / 2, crate.y - 9);
    } else if (crate.grabbedBy) {
      ctx.strokeStyle = 'rgba(255, 183, 77, 0.85)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(crate.x - 2, crate.y - 2, crate.width + 4, crate.height + 4, 8);
      ctx.stroke();

      // Cute small indicator badge above box
      ctx.fillStyle = 'rgba(74, 59, 50, 0.85)';
      ctx.beginPath();
      ctx.roundRect(crate.x + crate.width / 2 - 32, crate.y - 20, 64, 16, 8);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px Quicksand, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐾 Menarik...', crate.x + crate.width / 2, crate.y - 9);
    }

    // Inner cross beams
    ctx.strokeStyle = detailColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(crate.x + 6, crate.y + 6);
    ctx.lineTo(crate.x + crate.width - 6, crate.y + crate.height - 6);
    ctx.moveTo(crate.x + crate.width - 6, crate.y + 6);
    ctx.lineTo(crate.x + 6, crate.y + crate.height - 6);
    ctx.stroke();

    // Cute carved heart in the center of crate
    ctx.fillStyle = crate.isHeavy ? '#8D5B4C' : '#E57373';
    this.drawHeart(ctx, crate.x + crate.width / 2, crate.y + crate.height / 2, 9);

    ctx.restore();
  }

  // --- DRAW SWITCHES & LEVERS ---
  public renderSwitch(sw: SwitchObject) {
    const ctx = this.ctx;
    ctx.save();

    if (sw.type === 'pressure') {
      const plateH = sw.isPressed ? 4 : 10;
      const plateY = sw.y + (sw.height - plateH);

      // Base
      ctx.fillStyle = '#78909C';
      ctx.fillRect(sw.x - 3, sw.y + sw.height - 4, sw.width + 6, 4);

      // Depressible Plate
      ctx.fillStyle = sw.isPressed ? '#81C784' : '#FF8A80';
      ctx.strokeStyle = '#455A64';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sw.x, plateY, sw.width, plateH, [3, 3, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Label or heart icon
      if (!sw.isPressed) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sw.label || '♥', sw.x + sw.width / 2, plateY + 8);
      }
    } else {
      // Lever
      // Base mount
      ctx.fillStyle = '#616161';
      ctx.beginPath();
      ctx.arc(sw.x + sw.width / 2, sw.y + sw.height, 10, Math.PI, 0);
      ctx.fill();

      // Lever arm
      ctx.strokeStyle = '#37474F';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sw.x + sw.width / 2, sw.y + sw.height);
      const angle = sw.isPressed ? Math.PI / 4 : -Math.PI / 4;
      const armLen = 22;
      const hx = sw.x + sw.width / 2 + Math.sin(angle) * armLen;
      const hy = sw.y + sw.height - Math.cos(angle) * armLen;
      ctx.lineTo(hx, hy);
      ctx.stroke();

      // Handle ball
      ctx.fillStyle = sw.isPressed ? '#81C784' : '#FF7043';
      ctx.beginPath();
      ctx.arc(hx, hy, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- DRAW DOORS ---
  public renderDoor(door: DoorObject) {
    const ctx = this.ctx;
    ctx.save();

    const slideY = door.y - door.height * door.openProgress;

    // Door frame
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 3;
    ctx.strokeRect(door.x - 2, door.y, door.width + 4, door.height);

    if (door.openProgress < 0.95) {
      // Sliding panel
      ctx.fillStyle = door.style === 'crystal' ? '#7986CB' : '#A1887F';
      ctx.beginPath();
      ctx.roundRect(door.x, slideY, door.width, door.height, 4);
      ctx.fill();
      ctx.stroke();

      // Keyhole / Lock motif
      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.arc(door.x + door.width / 2, slideY + door.height / 2, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3E2723';
      ctx.beginPath();
      ctx.arc(door.x + door.width / 2, slideY + door.height / 2 - 1, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(door.x + door.width / 2 - 1.5, slideY + door.height / 2, 3, 5);
    }

    ctx.restore();
  }

  // --- DRAW CHECKPOINTS ---
  public renderCheckpoint(cp: Checkpoint, gameTime: number) {
    const ctx = this.ctx;
    ctx.save();

    // Wooden post
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(cp.x + 16, cp.y + 20, 8, cp.height - 20);

    // Lantern or Banner
    const lanternY = cp.y + 15;
    ctx.fillStyle = cp.isActivated ? '#FFF59D' : '#CFD8DC';
    ctx.strokeStyle = '#455A64';
    ctx.lineWidth = 2;

    // Lantern housing
    ctx.beginPath();
    ctx.roundRect(cp.x + 8, lanternY, 24, 28, 4);
    ctx.fill();
    ctx.stroke();

    // Glowing flame or heart inside
    if (cp.isActivated) {
      const pulse = Math.sin(gameTime * 4) * 2;
      ctx.fillStyle = '#FF7043';
      this.drawHeart(ctx, cp.x + 20, lanternY + 14, 7 + pulse * 0.5);

      // Light halo
      ctx.fillStyle = 'rgba(255, 235, 59, 0.2)';
      ctx.beginPath();
      ctx.arc(cp.x + 20, lanternY + 14, 20 + pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- DRAW EXIT PORTAL ---
  public renderExitPortal(portal: LevelData['exitPortal'], gameTime: number) {
    const ctx = this.ctx;
    ctx.save();

    const cx = portal.x + portal.width / 2;
    const cy = portal.y + portal.height / 2;

    // Outer heart arch
    const pulse = Math.sin(gameTime * 3) * 3;
    ctx.strokeStyle = '#FF8DA1';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'rgba(255, 209, 220, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, portal.width / 2 + pulse * 0.3, portal.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Spinning romantic light rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, portal.width * 0.35, portal.height * 0.35, gameTime * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // Heart icon over the arch
    ctx.fillStyle = '#FF4081';
    this.drawHeart(ctx, cx, portal.y - 12, 14 + pulse * 0.4);

    // Indicator if Bubu and Dudu have entered
    const indicatorY = portal.y + portal.height + 15;
    ctx.font = 'bold 11px Quicksand, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = portal.bubuReached ? '#8D5B4C' : '#BDBDBD';
    ctx.fillText('Bubu ' + (portal.bubuReached ? '✓' : '...'), cx - 24, indicatorY);
    ctx.fillStyle = portal.duduReached ? '#EC407A' : '#BDBDBD';
    ctx.fillText('Dudu ' + (portal.duduReached ? '✓' : '...'), cx + 24, indicatorY);

    ctx.restore();
  }

  // --- DRAW COLLECTIBLES ---
  public renderCollectible(item: CollectibleItem, gameTime: number) {
    if (item.collected) return;
    const ctx = this.ctx;
    ctx.save();

    const floatY = item.y + Math.sin(gameTime * 3 + item.floatOffset) * 6;
    const cx = item.x + item.width / 2;
    const cy = floatY + item.height / 2;

    if (item.type === 'flower_key') {
      // Golden key shaped like a daisy flower
      // Flower petals
      ctx.fillStyle = '#FFF59D';
      for (let i = 0; i < 5; i++) {
        const ang = (i * Math.PI * 2) / 5 + gameTime;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * 8, cy - 4 + Math.sin(ang) * 8, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Center
      ctx.fillStyle = '#FFA726';
      ctx.beginPath();
      ctx.arc(cx, cy - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      // Stem / key blade
      ctx.fillStyle = '#FFA726';
      ctx.fillRect(cx - 2, cy + 2, 4, 12);
      ctx.fillRect(cx - 2, cy + 10, 6, 3);
    } else if (item.type === 'crystal_key') {
      // Shimmering purple diamond key
      ctx.fillStyle = '#AB47BC';
      ctx.strokeStyle = '#E1BEE7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 14);
      ctx.lineTo(cx + 10, cy - 2);
      ctx.lineTo(cx, cy + 10);
      ctx.lineTo(cx - 10, cy - 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sparkle halo
      ctx.fillStyle = 'rgba(225, 190, 231, 0.5)';
      ctx.beginPath();
      ctx.arc(cx, cy - 2, 16, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.type === 'star_fragment') {
      // 5-pointed star
      ctx.fillStyle = '#FFD54F';
      ctx.strokeStyle = '#FFE082';
      ctx.lineWidth = 2;
      this.drawStar(ctx, cx, cy, 5, 12, 6, gameTime * 0.8);

      // Star glow
      ctx.fillStyle = 'rgba(255, 238, 88, 0.25)';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.type === 'flower') {
      // Cute pink cherry blossom
      ctx.fillStyle = '#F48FB1';
      for (let i = 0; i < 5; i++) {
        const ang = (i * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ang) * 7, cy + Math.sin(ang) * 7, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FFF9C4';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- DRAW WIND DRAFTS ---
  public renderWindDraft(
    wind: { x: number; y: number; width: number; height: number },
    gameTime: number
  ) {
    const ctx = this.ctx;
    ctx.save();

    // Upward flowing faint pastel lines and floating sparkles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    for (let x = wind.x + 15; x < wind.x + wind.width - 10; x += 25) {
      const yOffset = (gameTime * 120 + x * 3) % wind.height;
      const currentY = wind.y + wind.height - yOffset;
      ctx.beginPath();
      ctx.moveTo(x, currentY);
      ctx.lineTo(x + Math.sin(gameTime * 4 + x) * 6, currentY - 20);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- DRAW PARTICLES ---
  public renderParticles(particles: Particle[]) {
    const ctx = this.ctx;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      if (p.type === 'heart') {
        ctx.fillStyle = p.color;
        this.drawHeart(ctx, p.x, p.y, p.size);
      } else if (p.type === 'star') {
        ctx.fillStyle = p.color;
        this.drawStar(ctx, p.x, p.y, 5, p.size, p.size * 0.5, p.rotation || 0);
      } else {
        // Soft dust / sparkle circle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // --- PROCEDURAL DRAWING OF BUBU (BROWN BEAR) ---
  public renderBubu(p: PlayerState) {
    const ctx = this.ctx;
    ctx.save();

    const cx = p.x + p.width / 2;
    const cy = p.y + p.height / 2;

    ctx.translate(cx, cy);
    if (p.facing === 'left') {
      ctx.scale(-1, 1);
    }

    const walkBounce = p.state === 'walk' ? Math.sin(p.animTimer * 12) * 2.5 : 0;
    const walkWaddle = p.state === 'walk' ? Math.sin(p.animTimer * 12) * 0.08 : 0;
    const pushLean = p.isPushing ? 0.2 : 0;
    ctx.rotate(walkWaddle + pushLean);

    // Shadow on ground
    if (p.isGrounded) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.beginPath();
      ctx.ellipse(0, p.height / 2 - 2, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Colors
    const furColor = '#9A6B56'; // Rich warm brown
    const darkFurColor = '#7B4E3C';
    const tummyColor = '#F5DDCB'; // Cream tummy
    const blushColor = 'rgba(255, 138, 128, 0.55)';

    // Little round tail behind
    ctx.fillStyle = darkFurColor;
    ctx.beginPath();
    ctx.arc(-18, 8 + walkBounce, 6, 0, Math.PI * 2);
    ctx.fill();

    // Chubby feet
    const legOffset1 = p.state === 'walk' ? Math.sin(p.animTimer * 12) * 6 : 0;
    const legOffset2 = p.state === 'walk' ? -Math.sin(p.animTimer * 12) * 6 : 0;

    // Left foot
    ctx.fillStyle = darkFurColor;
    ctx.beginPath();
    ctx.ellipse(-8 + legOffset1, p.height / 2 - 6, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right foot
    ctx.beginPath();
    ctx.ellipse(8 + legOffset2, p.height / 2 - 6, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Round body
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.ellipse(0, 4 + walkBounce, 18, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cream tummy oval
    ctx.fillStyle = tummyColor;
    ctx.beginPath();
    ctx.ellipse(2, 6 + walkBounce, 11, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Round Head
    const headY = -12 + walkBounce;
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.arc(0, headY, 17, 0, Math.PI * 2);
    ctx.fill();

    // Bear Ears (outer & inner)
    // Left ear
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.arc(-13, headY - 13, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = tummyColor;
    ctx.beginPath();
    ctx.arc(-13, headY - 13, 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Right ear
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.arc(13, headY - 13, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = tummyColor;
    ctx.beginPath();
    ctx.arc(13, headY - 13, 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Cute Muzzle
    ctx.fillStyle = tummyColor;
    ctx.beginPath();
    ctx.ellipse(3, headY + 5, 8.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tiny dark nose
    ctx.fillStyle = '#422419';
    ctx.beginPath();
    ctx.ellipse(3, headY + 3, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sweet mouth
    ctx.strokeStyle = '#422419';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(3, headY + 5);
    ctx.lineTo(3, headY + 7);
    if (p.state === 'victory') {
      // Big open happy smile
      ctx.moveTo(0, headY + 7);
      ctx.quadraticCurveTo(3, headY + 11, 6, headY + 7);
    } else {
      ctx.moveTo(1, headY + 7);
      ctx.quadraticCurveTo(3, headY + 9, 5, headY + 7);
    }
    ctx.stroke();

    // Cheeks
    ctx.fillStyle = blushColor;
    ctx.beginPath();
    ctx.arc(-7, headY + 5, 4.5, 0, Math.PI * 2);
    ctx.arc(11, headY + 5, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    if (p.isBlinking) {
      // Closed blinking eyes (cute arc)
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(-4, headY - 1, 3, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.arc(8, headY - 1, 3, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.stroke();
    } else if (p.state === 'victory') {
      // Happy closed eye crescents
      ctx.strokeStyle = '#3E2723';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-4, headY - 1, 3.5, Math.PI, 0, false);
      ctx.arc(8, headY - 1, 3.5, Math.PI, 0, false);
      ctx.stroke();
    } else {
      // Glossy cute round eyes
      ctx.fillStyle = '#3E2723';
      ctx.beginPath();
      ctx.arc(-4, headY - 1, 3, 0, Math.PI * 2);
      ctx.arc(8, headY - 1, 3, 0, Math.PI * 2);
      ctx.fill();

      // White eye highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-5, headY - 2.5, 1.2, 0, Math.PI * 2);
      ctx.arc(7, headY - 2.5, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Paws / Arms
    ctx.fillStyle = darkFurColor;
    if (p.isCarrying) {
      // Arms raised high up holding crate above head!
      ctx.beginPath();
      ctx.ellipse(-11, headY - 14, 5.5, 9, -0.25, 0, Math.PI * 2);
      ctx.ellipse(11, headY - 14, 5.5, 9, 0.25, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.isGrabbing) {
      // Firm grip holding and pulling/pushing the crate!
      ctx.beginPath();
      ctx.ellipse(19, 1, 7.5, 5, -0.25, 0, Math.PI * 2);
      ctx.ellipse(16, 9, 7.5, 5, 0.25, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.isPushing) {
      // Both paws pushed forward against crate!
      ctx.beginPath();
      ctx.ellipse(18, 2, 7, 5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(15, 9, 7, 5, 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.state === 'victory') {
      // Arms raised celebrating
      ctx.beginPath();
      ctx.ellipse(-14, headY - 2, 5, 8, -0.6, 0, Math.PI * 2);
      ctx.ellipse(14, headY - 2, 5, 8, 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Gentle side paws
      const armSwing = p.state === 'walk' ? Math.sin(p.animTimer * 12) * 4 : 0;
      ctx.beginPath();
      ctx.ellipse(-14, 5 + walkBounce - armSwing, 5, 8, 0.1, 0, Math.PI * 2);
      ctx.ellipse(14, 5 + walkBounce + armSwing, 5, 8, -0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- PROCEDURAL DRAWING OF DUDU (WHITE BUNNY) ---
  public renderDudu(p: PlayerState) {
    const ctx = this.ctx;
    ctx.save();

    const cx = p.x + p.width / 2;
    const cy = p.y + p.height / 2;

    ctx.translate(cx, cy);
    if (p.facing === 'left') {
      ctx.scale(-1, 1);
    }

    const bunnyHop = p.state === 'walk' ? Math.abs(Math.sin(p.animTimer * 14)) * 4 : 0;
    const earWiggle = Math.sin(p.animTimer * 8) * 0.12;
    ctx.translate(0, -bunnyHop);

    // Shadow on ground
    if (p.isGrounded) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.ellipse(0, p.height / 2 - 2 + bunnyHop, 16, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const bodyWhite = '#FFFFFF';
    const outlineSoft = '#E0D8D0';
    const innerEarPink = '#FFB6C1';
    const blushPink = 'rgba(255, 140, 160, 0.55)';

    // Fluffy tail behind
    ctx.fillStyle = bodyWhite;
    ctx.strokeStyle = outlineSoft;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-17, 8, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bunny feet
    const hopFootL = p.state === 'walk' ? Math.sin(p.animTimer * 14) * 4 : 0;
    const hopFootR = p.state === 'walk' ? -Math.sin(p.animTimer * 14) * 4 : 0;

    // Feet with pink pads
    ctx.fillStyle = bodyWhite;
    ctx.beginPath();
    ctx.ellipse(-7 + hopFootL, p.height / 2 - 5, 6, 4.5, 0, 0, Math.PI * 2);
    ctx.ellipse(7 + hopFootR, p.height / 2 - 5, 6, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Oval body
    ctx.fillStyle = bodyWhite;
    ctx.strokeStyle = outlineSoft;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, 4, 16, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head
    const headY = -11;
    ctx.beginPath();
    ctx.arc(0, headY, 15.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Long bouncy bunny ears!
    // Left ear
    ctx.save();
    ctx.translate(-7, headY - 12);
    ctx.rotate(-0.15 + earWiggle);
    ctx.fillStyle = bodyWhite;
    ctx.beginPath();
    ctx.ellipse(0, -11, 5, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Inner ear
    ctx.fillStyle = innerEarPink;
    ctx.beginPath();
    ctx.ellipse(0, -10, 2.8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right ear
    ctx.save();
    ctx.translate(7, headY - 12);
    ctx.rotate(0.18 - earWiggle);
    ctx.fillStyle = bodyWhite;
    ctx.beginPath();
    ctx.ellipse(0, -11, 5, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Inner ear
    ctx.fillStyle = innerEarPink;
    ctx.beginPath();
    ctx.ellipse(0, -10, 2.8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cheeks
    ctx.fillStyle = blushPink;
    ctx.beginPath();
    ctx.arc(-8, headY + 4, 4.2, 0, Math.PI * 2);
    ctx.arc(10, headY + 4, 4.2, 0, Math.PI * 2);
    ctx.fill();

    // Tiny pink heart nose
    ctx.fillStyle = '#FF758F';
    this.drawHeart(ctx, 2, headY + 2, 3.2);

    // Mouth
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(2, headY + 5);
    ctx.lineTo(2, headY + 7);
    if (p.state === 'victory') {
      ctx.moveTo(-1, headY + 7);
      ctx.quadraticCurveTo(2, headY + 10, 5, headY + 7);
    } else {
      ctx.moveTo(0, headY + 7);
      ctx.quadraticCurveTo(2, headY + 8.5, 4, headY + 7);
    }
    ctx.stroke();

    // Eyes
    if (p.isBlinking) {
      ctx.strokeStyle = '#4A3B32';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(-4, headY - 1, 3, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.arc(7, headY - 1, 3, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.stroke();
    } else if (p.state === 'victory') {
      ctx.strokeStyle = '#4A3B32';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(-4, headY - 1, 3.2, Math.PI, 0, false);
      ctx.arc(7, headY - 1, 3.2, Math.PI, 0, false);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#4A3B32';
      ctx.beginPath();
      ctx.arc(-4, headY - 1, 2.8, 0, Math.PI * 2);
      ctx.arc(7, headY - 1, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Sparkle in eye
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-5, headY - 2, 1.1, 0, Math.PI * 2);
      ctx.arc(6, headY - 2, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bunny Paws
    ctx.fillStyle = bodyWhite;
    ctx.strokeStyle = outlineSoft;
    ctx.lineWidth = 1.4;
    if (p.state === 'victory') {
      ctx.beginPath();
      ctx.ellipse(-12, headY - 2, 4, 7, -0.6, 0, Math.PI * 2);
      ctx.ellipse(12, headY - 2, 4, 7, 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(-11, 4, 4, 7, 0.2, 0, Math.PI * 2);
      ctx.ellipse(11, 4, 4, 7, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- HELPER SHAPES ---
  private drawHeart(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.4);
    ctx.bezierCurveTo(x, y, x - size, y, x - size, y - size * 0.5);
    ctx.bezierCurveTo(x - size, y - size, x, y - size, x, y - size * 0.3);
    ctx.bezierCurveTo(x, y - size, x + size, y - size, x + size, y - size * 0.5);
    ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.4);
    ctx.fill();
    ctx.restore();
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    rot: number
  ) {
    let rotAngle = (Math.PI / 2) * 3 + rot;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rotAngle) * outerRadius;
      let y = cy + Math.sin(rotAngle) * outerRadius;
      ctx.lineTo(x, y);
      rotAngle += step;

      x = cx + Math.cos(rotAngle) * innerRadius;
      y = cy + Math.sin(rotAngle) * innerRadius;
      ctx.lineTo(x, y);
      rotAngle += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
