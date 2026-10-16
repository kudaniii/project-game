/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * Server-Side Authoritative Room and Game State Manager
 */

import { WebSocket } from 'ws';

export interface NetworkPlayer {
  id: string;
  name: string;
  character: 'bubu' | 'dudu';
  ws: WebSocket;
  isReady: boolean;
  isHost: boolean;
  lastPing: number;
  pingMs: number;
}

export interface PlayerTransform {
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: string;
  facing: 'left' | 'right';
  isCarrying: boolean;
  hasKey: string | null;
}

export interface RoomGameState {
  levelId: number;
  levelStarted: boolean;
  bubuTransform: PlayerTransform;
  duduTransform: PlayerTransform;
  switches: Record<string, boolean>;
  doors: Record<string, { isOpen: boolean; openProgress: number }>;
  crates: Record<string, { x: number; y: number; vx: number; vy: number; carriedBy: string | null }>;
  collectibles: Record<string, boolean>; // id -> collected
  checkpoints: Record<string, boolean>;
  starsCollected: number;
  isCompleted: boolean;
  lastActionTime: number;
}

export interface GameRoom {
  id: string;
  createdAt: number;
  hostId: string;
  levelId: number;
  players: Map<string, NetworkPlayer>;
  gameState: RoomGameState;
}

export class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<string, GameRoom> = new Map();

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  // Generate friendly 6-char room code (e.g. BD7829)
  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'BD';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public createRoom(hostPlayerId: string, hostName: string, characterChoice: 'bubu' | 'dudu' = 'bubu', ws: WebSocket): GameRoom {
    let roomId = this.generateRoomCode();
    while (this.rooms.has(roomId)) {
      roomId = this.generateRoomCode();
    }

    const host: NetworkPlayer = {
      id: hostPlayerId,
      name: hostName || 'Pemain 1',
      character: characterChoice,
      ws,
      isReady: true,
      isHost: true,
      lastPing: Date.now(),
      pingMs: 0,
    };

    const room: GameRoom = {
      id: roomId,
      createdAt: Date.now(),
      hostId: hostPlayerId,
      levelId: 1,
      players: new Map([[hostPlayerId, host]]),
      gameState: this.createInitialGameState(1),
    };

    this.rooms.set(roomId, room);
    return room;
  }

  public getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId.toUpperCase());
  }

  public joinRoom(roomId: string, playerId: string, playerName: string, ws: WebSocket): { success: boolean; room?: GameRoom; error?: string } {
    const room = this.getRoom(roomId);
    if (!room) {
      return { success: false, error: 'Ruangan tidak ditemukan! Periksa kembali kode ruangan.' };
    }

    // Check if player is reconnecting
    const existingPlayer = room.players.get(playerId);
    if (existingPlayer) {
      existingPlayer.ws = ws;
      existingPlayer.lastPing = Date.now();
      return { success: true, room };
    }

    // Room full check (max 2 players for co-op)
    if (room.players.size >= 2) {
      return { success: false, error: 'Ruangan sudah penuh (maksimal 2 pemain).' };
    }

    // Determine character choice: if host is bubu, new player is dudu and vice-versa
    const hostPlayer = Array.from(room.players.values())[0];
    const assignedChar: 'bubu' | 'dudu' = hostPlayer.character === 'bubu' ? 'dudu' : 'bubu';

    const newPlayer: NetworkPlayer = {
      id: playerId,
      name: playerName || 'Pemain 2',
      character: assignedChar,
      ws,
      isReady: false,
      isHost: false,
      lastPing: Date.now(),
      pingMs: 0,
    };

    room.players.set(playerId, newPlayer);
    return { success: true, room };
  }

  public leaveRoom(roomId: string, playerId: string): { roomEmpty: boolean; room?: GameRoom } {
    const room = this.getRoom(roomId);
    if (!room) return { roomEmpty: true };

    room.players.delete(playerId);

    if (room.players.size === 0) {
      this.rooms.delete(roomId);
      return { roomEmpty: true };
    }

    // If host left, pass host to remaining player
    if (room.hostId === playerId) {
      const remainingPlayer = Array.from(room.players.values())[0];
      if (remainingPlayer) {
        remainingPlayer.isHost = true;
        room.hostId = remainingPlayer.id;
      }
    }

    return { roomEmpty: false, room };
  }

  public broadcastToRoom(room: GameRoom, message: object, excludePlayerId?: string) {
    const data = JSON.stringify(message);
    for (const player of room.players.values()) {
      if (excludePlayerId && player.id === excludePlayerId) continue;
      if (player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(data);
      }
    }
  }

  public createInitialGameState(levelId: number): RoomGameState {
    return {
      levelId,
      levelStarted: false,
      bubuTransform: {
        x: 80,
        y: 440,
        vx: 0,
        vy: 0,
        state: 'idle',
        facing: 'right',
        isCarrying: false,
        hasKey: null,
      },
      duduTransform: {
        x: 140,
        y: 440,
        vx: 0,
        vy: 0,
        state: 'idle',
        facing: 'right',
        isCarrying: false,
        hasKey: null,
      },
      switches: {},
      doors: {},
      crates: {},
      collectibles: {},
      checkpoints: {},
      starsCollected: 0,
      isCompleted: false,
      lastActionTime: Date.now(),
    };
  }

  // Routine cleanup of stale rooms (inactive for > 15 minutes)
  public cleanStaleRooms() {
    const now = Date.now();
    for (const [id, room] of this.rooms.entries()) {
      const isStale = now - room.createdAt > 1000 * 60 * 30; // 30 mins max
      const noConnectedPlayers = Array.from(room.players.values()).every(
        (p) => p.ws.readyState !== WebSocket.OPEN
      );
      if (isStale || noConnectedPlayers) {
        this.rooms.delete(id);
      }
    }
  }
}

export const roomManager = RoomManager.getInstance();
