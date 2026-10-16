/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Physics Engine: AABB Collisions, Moving Platforms, Box Lifting/Pushing/Pulling, and Switches
 */

import { PlayerState, Platform, Crate, SwitchObject, DoorObject, WindDraft } from './types.ts';
import { soundEngine } from './audio.ts';

const GRAVITY = 0.58;
const MAX_FALL_SPEED = 14;

export class PhysicsEngine {
  public static updateMovingPlatforms(platforms: Platform[], dtScale: number) {
    for (const p of platforms) {
      if (
        p.type !== 'moving' ||
        p.startX === undefined ||
        p.targetX === undefined ||
        p.startY === undefined ||
        p.targetY === undefined
      ) {
        continue;
      }
      const speed = (p.speed || 1) * dtScale * 0.01;
      p.progress = (p.progress || 0) + speed * (p.direction || 1);
      if (p.progress >= 1) {
        p.progress = 1;
        p.direction = -1;
      } else if (p.progress <= 0) {
        p.progress = 0;
        p.direction = 1;
      }

      // Smooth easing (cosine)
      const ease = (1 - Math.cos(p.progress * Math.PI)) / 2;
      const prevX = p.x;
      const prevY = p.y;
      p.x = p.startX + (p.targetX - p.startX) * ease;
      p.y = p.startY + (p.targetY - p.startY) * ease;

      // Store delta movement for passengers
      (p as unknown as { deltaX: number; deltaY: number }).deltaX = p.x - prevX;
      (p as unknown as { deltaY: number; deltaX: number }).deltaY = p.y - prevY;
    }
  }

  public static updateCrates(
    crates: Crate[],
    platforms: Platform[],
    dtScale: number,
    levelHeight: number = 850
  ) {
    for (const c of crates) {
      // Store initial spawn position if not set
      if (c.spawnX === undefined) c.spawnX = c.x;
      if (c.spawnY === undefined) c.spawnY = c.y;

      // Skip normal physics if crate is currently carried above player's head
      if (c.carriedBy) {
        continue;
      }

      // Apply gravity
      c.vy = Math.min(MAX_FALL_SPEED, c.vy + GRAVITY * dtScale);
      c.x += c.vx * dtScale;
      c.y += c.vy * dtScale;

      // Friction
      c.vx *= Math.pow(0.82, dtScale);
      if (Math.abs(c.vx) < 0.05) c.vx = 0;

      c.isGrounded = false;

      // Respawn if fell into bottomless chasm out of bounds
      if (c.y > levelHeight + 60) {
        c.x = c.spawnX;
        c.y = c.spawnY;
        c.vx = 0;
        c.vy = 0;
        soundEngine.playRespawn();
      }

      // Platform collisions for crate
      for (const p of platforms) {
        if (p.type === 'bridge' && !p.visible) continue;
        if (this.checkAABB(c.x, c.y, c.width, c.height, p.x, p.y, p.width, p.height)) {
          // Resolve vertical landing
          const prevY = c.y - c.vy * dtScale;
          if (prevY + c.height <= p.y + 12 && c.vy >= 0) {
            c.y = p.y - c.height;
            c.vy = 0;
            c.isGrounded = true;
            // Carry with moving platform
            const movingP = p as unknown as { deltaX?: number; deltaY?: number };
            if (movingP.deltaX) c.x += movingP.deltaX;
            if (movingP.deltaY) c.y += movingP.deltaY;
          } else {
            // Horizontal bounce
            if (c.vx > 0) c.x = p.x - c.width;
            else if (c.vx < 0) c.x = p.x + p.width;
            c.vx = 0;
          }
        }
      }
    }
  }

  public static updatePlayer(
    player: PlayerState,
    input: { left: boolean; right: boolean; jump: boolean; action: boolean },
    platforms: Platform[],
    crates: Crate[],
    doors: DoorObject[],
    windDrafts: WindDraft[] | undefined,
    dtScale: number
  ) {
    // 1. Horizontal Movement
    const maxSpeed = player.type === 'dudu' ? 4.0 : 3.5;
    const accel = player.isGrounded ? 0.9 : 0.6;

    if (input.left) {
      player.vx = Math.max(-maxSpeed, player.vx - accel * dtScale);
      player.facing = 'left';
    } else if (input.right) {
      player.vx = Math.min(maxSpeed, player.vx + accel * dtScale);
      player.facing = 'right';
    } else {
      player.vx *= Math.pow(0.72, dtScale);
      if (Math.abs(player.vx) < 0.1) player.vx = 0;
    }

    // 2. Wind Drafts
    if (windDrafts) {
      for (const wind of windDrafts) {
        if (
          this.checkAABB(
            player.x,
            player.y,
            player.width,
            player.height,
            wind.x,
            wind.y,
            wind.width,
            wind.height
          )
        ) {
          // Dudu is lighter and lifted higher!
          const force = player.type === 'dudu' ? wind.forceY * 1.35 : wind.forceY;
          player.vy += force * dtScale;
          player.isGrounded = false;
        }
      }
    }

    // 3. Gravity & Jump
    player.vy = Math.min(MAX_FALL_SPEED, player.vy + GRAVITY * dtScale);
    if (input.jump && player.isGrounded) {
      const jumpPower = player.type === 'dudu' ? -13.2 : -11.0;
      player.vy = jumpPower;
      player.isGrounded = false;
      soundEngine.playJump(player.type);
    }

    // Move vertically
    player.y += player.vy * dtScale;
    player.isGrounded = false;

    // Platform collisions (vertical)
    for (const p of platforms) {
      if (p.type === 'bridge' && !p.visible) continue;
      if (this.checkAABB(player.x, player.y, player.width, player.height, p.x, p.y, p.width, p.height)) {
        // Landing on top
        const prevY = player.y - player.vy * dtScale;
        if (prevY + player.height <= p.y + 14 && player.vy >= 0) {
          player.y = p.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          // Carry passenger with moving platform
          const movingP = p as unknown as { deltaX?: number; deltaY?: number };
          if (movingP.deltaX) player.x += movingP.deltaX;
          if (movingP.deltaY) player.y += movingP.deltaY;
        } else if (prevY >= p.y + p.height - 10 && player.vy < 0) {
          // Hitting ceiling
          player.y = p.y + p.height;
          player.vy = 0;
        }
      }
    }

    // Door collisions (closed doors block players)
    for (const door of doors) {
      if (door.openProgress < 0.85) {
        if (this.checkAABB(player.x, player.y, player.width, player.height, door.x, door.y, door.width, door.height)) {
          if (player.vx > 0) player.x = door.x - player.width;
          else if (player.vx < 0) player.x = door.x + door.width;
          player.vx = 0;
        }
      }
    }

    // Move horizontally
    player.x += player.vx * dtScale;

    // Horizontal platform collisions
    for (const p of platforms) {
      if (p.type === 'bridge' && !p.visible) continue;
      if (this.checkAABB(player.x, player.y, player.width, player.height, p.x, p.y, p.width, p.height)) {
        // Check if inside side bounds
        if (player.y + player.height > p.y + 6 && player.y < p.y + p.height - 4) {
          if (player.vx > 0) {
            player.x = p.x - player.width;
            player.vx = 0;
          } else if (player.vx < 0) {
            player.x = p.x + p.width;
            player.vx = 0;
          }
        }
      }
    }

    // 4. Box interaction: Lifting, Carrying, Throwing, Pulling & Pushing
    player.carryCooldown = Math.max(0, (player.carryCooldown || 0) - dtScale);
    player.isPushing = false;
    player.isGrabbing = false;
    player.grabbedCrateId = null;

    // A. If player is currently CARRYING a crate:
    if (player.isCarrying && player.carriedCrateId) {
      const carriedCrate = crates.find((c) => c.id === player.carriedCrateId);
      if (carriedCrate) {
        // Pin crate right above player's head!
        carriedCrate.x = player.x + (player.width - carriedCrate.width) / 2;
        carriedCrate.y = player.y - carriedCrate.height - 4;
        carriedCrate.vx = player.vx;
        carriedCrate.vy = player.vy;
        carriedCrate.isGrounded = false;
        carriedCrate.carriedBy = player.type;

        // Throw or Place Down when Action is pressed
        if (input.action && player.carryCooldown <= 0) {
          const throwDir = player.facing === 'left' ? -1 : 1;
          const isMoving = Math.abs(player.vx) > 0.4 || !player.isGrounded;
          if (isMoving) {
            // Throw across chasm or forward!
            carriedCrate.vx = throwDir * 5.6 + player.vx * 0.4;
            carriedCrate.vy = -4.2;
            soundEngine.playThrow();
          } else {
            // Place down gently in front of player
            carriedCrate.x =
              throwDir === -1
                ? player.x - carriedCrate.width - 4
                : player.x + player.width + 4;
            carriedCrate.y = player.y + player.height - carriedCrate.height;
            carriedCrate.vx = throwDir * 1.5;
            carriedCrate.vy = 0;
            soundEngine.playThrow();
          }
          carriedCrate.carriedBy = null;
          player.isCarrying = false;
          player.carriedCrateId = null;
          player.carryCooldown = 20; // debounce frames
        }
      } else {
        player.isCarrying = false;
        player.carriedCrateId = null;
      }
    } else {
      // B. If NOT carrying, interact with nearby crates
      for (const crate of crates) {
        if (crate.carriedBy && crate.carriedBy !== player.type) continue;
        const isOverlapping = this.checkAABB(
          player.x,
          player.y,
          player.width,
          player.height,
          crate.x,
          crate.y,
          crate.width,
          crate.height
        );
        const isHorizontallyAdjacent =
          Math.abs(player.y + player.height / 2 - (crate.y + crate.height / 2)) <
            (player.height + crate.height) / 2 + 10 &&
          Math.abs(player.x + player.width / 2 - (crate.x + crate.width / 2)) <=
            (player.width + crate.width) / 2 + 22;

        const canMoveCrate = player.type === 'bubu' || !crate.isHeavy;

        // Landing on top of crate
        if (isOverlapping) {
          const prevY = player.y - player.vy * dtScale;
          if (prevY + player.height <= crate.y + 14 && player.vy >= 0) {
            player.y = crate.y - player.height;
            player.vy = 0;
            player.isGrounded = true;
            continue;
          }
        }

        // Action Pressed: LIFT or PULL
        if (
          canMoveCrate &&
          (isHorizontallyAdjacent || isOverlapping) &&
          input.action &&
          player.carryCooldown <= 0
        ) {
          const crateIsOnRight = crate.x > player.x;
          const movingAway =
            (crateIsOnRight && input.left) || (!crateIsOnRight && input.right);

          if (movingAway) {
            // PULL: Hold Action and walk backwards away from chasm
            player.isGrabbing = true;
            player.grabbedCrateId = crate.id;
            crate.grabbedBy = player.type;
            player.isPushing = true;
            if (crateIsOnRight && input.left) {
              crate.x = player.x + player.width;
              crate.vx = player.vx;
              soundEngine.playPush();
            } else if (!crateIsOnRight && input.right) {
              crate.x = player.x - crate.width;
              crate.vx = player.vx;
              soundEngine.playPush();
            }
          } else {
            // LIFT: Pick up crate over head to easily carry or jump across chasm!
            player.isCarrying = true;
            player.carriedCrateId = crate.id;
            crate.carriedBy = player.type;
            crate.grabbedBy = null;
            player.carryCooldown = 20;
            crate.x = player.x + (player.width - crate.width) / 2;
            crate.y = player.y - crate.height - 4;
            soundEngine.playLift();
            break;
          }
        }
        // Standard Push when walking against the crate
        else if (isOverlapping) {
          if (canMoveCrate && Math.abs(player.vx) > 0.2) {
            player.isPushing = true;
            crate.vx = player.vx * 0.82;
            soundEngine.playPush();
            if (player.vx > 0) {
              player.x = crate.x - player.width;
            } else {
              player.x = crate.x + crate.width;
            }
          } else {
            if (player.vx > 0) player.x = crate.x - player.width;
            else if (player.vx < 0) player.x = crate.x + crate.width;
            player.vx = 0;
          }
        }
      }
    }

    // 5. Animation State determination
    player.animTimer += 0.05 * dtScale;
    player.blinkTimer += dtScale;
    if (player.blinkTimer > 180) {
      player.isBlinking = true;
      if (player.blinkTimer > 195) {
        player.isBlinking = false;
        player.blinkTimer = 0;
      }
    }

    if (player.state !== 'victory') {
      if (!player.isGrounded) {
        player.state = player.vy < 0 ? 'jump' : 'fall';
      } else if (player.isPushing) {
        player.state = 'push';
      } else if (Math.abs(player.vx) > 0.2) {
        player.state = 'walk';
      } else {
        player.state = 'idle';
      }
    }
  }

  public static updateSwitchesAndDoors(
    switches: SwitchObject[],
    doors: DoorObject[],
    platforms: Platform[],
    bubu: PlayerState,
    dudu: PlayerState,
    crates: Crate[]
  ) {
    for (const sw of switches) {
      if (sw.type === 'pressure') {
        const bubuOn = this.checkAABB(
          bubu.x,
          bubu.y,
          bubu.width,
          bubu.height,
          sw.x,
          sw.y,
          sw.width,
          sw.height
        );
        const duduOn = this.checkAABB(
          dudu.x,
          dudu.y,
          dudu.width,
          dudu.height,
          sw.x,
          sw.y,
          sw.width,
          sw.height
        );
        const crateOn = crates.some((c) =>
          this.checkAABB(c.x, c.y, c.width, c.height, sw.x, sw.y, sw.width, sw.height)
        );

        const nowPressed = bubuOn || duduOn || crateOn;
        if (nowPressed !== sw.isPressed) {
          sw.isPressed = nowPressed;
          if (nowPressed) soundEngine.playSwitchClick();
        }
      }
    }

    // Update Door states based on required switches / keys
    for (const door of doors) {
      let conditionsMet = true;
      if (door.requiresSwitches && door.requiresSwitches.length > 0) {
        const allSwitchesActive = door.requiresSwitches.every((swId) => {
          const found = switches.find((s) => s.id === swId);
          return found ? found.isPressed : false;
        });
        if (!allSwitchesActive) conditionsMet = false;
      }

      if (door.requiresKey) {
        // Player must have collected the key
        const hasKey =
          bubu.hasKey === door.requiresKey || dudu.hasKey === door.requiresKey;
        if (!hasKey) conditionsMet = false;
      }

      const prevOpen = door.isOpen;
      door.isOpen = conditionsMet;
      if (door.isOpen && !prevOpen) {
        soundEngine.playDoorOpen();
      }

      // Smooth slide animation
      if (door.isOpen && door.openProgress < 1) {
        door.openProgress = Math.min(1, door.openProgress + 0.05);
      } else if (!door.isOpen && door.openProgress > 0) {
        door.openProgress = Math.max(0, door.openProgress - 0.05);
      }
    }

    // Update Bridges linked to switches
    for (const p of platforms) {
      if (p.type === 'bridge' && p.requiresSwitch) {
        const sw = switches.find((s) => s.id === p.requiresSwitch);
        const active = sw ? sw.isPressed : false;
        if (active !== p.visible) {
          p.visible = active;
          if (active) soundEngine.playDoorOpen();
        }
      }
    }
  }

  public static checkAABB(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ): boolean {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }
}
