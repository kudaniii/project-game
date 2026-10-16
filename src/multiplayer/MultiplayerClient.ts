/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * Client-Side WebSocket Real-Time Multiplayer Manager
 */

import {
  ClientMessageType,
  ServerMessageType,
  RoomInfoPayload,
  PlayerUpdatePayload,
  PuzzleEventPayload,
} from './protocol.ts';

type EventCallback<T = any> = (data: T) => void;

export class MultiplayerClient {
  private static instance: MultiplayerClient;
  private ws: WebSocket | null = null;
  private pingTimer: number | null = null;
  private lastPingSent: number = 0;
  public pingMs: number = 0;
  public isConnected: boolean = false;
  public currentRoom: RoomInfoPayload | null = null;
  public myPlayerId: string = '';
  public myName: string = 'Pemain';
  public myCharacter: 'bubu' | 'dudu' = 'bubu';

  private listeners: Map<string, Set<EventCallback>> = new Map();

  public static getInstance(): MultiplayerClient {
    if (!MultiplayerClient.instance) {
      MultiplayerClient.instance = new MultiplayerClient();
    }
    return MultiplayerClient.instance;
  }

  constructor() {
    this.myPlayerId = this.getOrGeneratePlayerId();
  }

  private getOrGeneratePlayerId(): string {
    const key = 'bubu_dudu_player_uuid';
    let id = localStorage.getItem(key);
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(key, id);
    }
    return id;
  }

  public connect(): Promise<boolean> {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.startHeartbeat();
          this.emit('connection_change', { connected: true });
          resolve(true);
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.stopHeartbeat();
          this.emit('connection_change', { connected: false });
        };

        this.ws.onerror = (err) => {
          console.warn('Multiplayer WebSocket notice:', err);
          this.isConnected = false;
          resolve(false);
        };

        this.ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            this.handleMessage(msg);
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
          }
        };
      } catch (err) {
        console.warn('Cannot establish WebSocket:', err);
        resolve(false);
      }
    });
  }

  public disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.currentRoom = null;
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.lastPingSent = performance.now();
        this.send('PING', { clientTime: this.lastPingSent });
      }
    }, 4000);
  }

  private stopHeartbeat() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private handleMessage(msg: { type: ServerMessageType; payload?: any }) {
    switch (msg.type) {
      case 'ROOM_CREATED':
      case 'ROOM_JOINED':
      case 'ROOM_UPDATE': {
        this.currentRoom = msg.payload;
        // Identify what character I am
        const me = msg.payload.players.find((p: any) => p.id === this.myPlayerId);
        if (me) {
          this.myCharacter = me.character;
        }
        this.emit(msg.type, msg.payload);
        break;
      }

      case 'GAME_STARTED': {
        this.emit('GAME_STARTED', msg.payload);
        break;
      }

      case 'REMOTE_PLAYER_UPDATE': {
        this.emit('REMOTE_PLAYER_UPDATE', msg.payload);
        break;
      }

      case 'PUZZLE_STATE_SYNC': {
        this.emit('PUZZLE_STATE_SYNC', msg.payload);
        break;
      }

      case 'REMOTE_EMOTE': {
        this.emit('REMOTE_EMOTE', msg.payload);
        break;
      }

      case 'LEVEL_RESTARTED': {
        this.emit('LEVEL_RESTARTED', msg.payload);
        break;
      }

      case 'PLAYER_LEFT': {
        this.emit('PLAYER_LEFT', msg.payload);
        break;
      }

      case 'ERROR': {
        this.emit('ERROR', msg.payload);
        break;
      }

      case 'PONG': {
        const now = performance.now();
        this.pingMs = Math.round(now - this.lastPingSent);
        this.emit('ping_update', { pingMs: this.pingMs });
        break;
      }
    }
  }

  public send(type: ClientMessageType, payload: any = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }
    const message = {
      type,
      ...payload,
      timestamp: Date.now(),
    };
    this.ws.send(JSON.stringify(message));
  }

  // Action methods
  public async createRoom(name: string, characterChoice: 'bubu' | 'dudu' = 'bubu') {
    await this.connect();
    this.myName = name;
    this.myCharacter = characterChoice;
    this.send('CREATE_ROOM', {
      playerId: this.myPlayerId,
      playerName: name,
      characterChoice,
    });
  }

  public async joinRoom(roomId: string, name: string) {
    await this.connect();
    this.myName = name;
    this.send('JOIN_ROOM', {
      roomId: roomId.trim().toUpperCase(),
      playerId: this.myPlayerId,
      playerName: name,
    });
  }

  public leaveRoom() {
    this.send('LEAVE_ROOM', {});
    this.currentRoom = null;
  }

  public setReady(isReady: boolean) {
    this.send('SET_READY', { isReady });
  }

  public switchCharacter() {
    this.send('SWITCH_CHARACTER', {});
  }

  public startGame(levelId: number = 1) {
    this.send('START_GAME', { levelId });
  }

  public sendPlayerUpdate(payload: PlayerUpdatePayload) {
    this.send('PLAYER_UPDATE', { payload });
  }

  public sendPuzzleEvent(event: PuzzleEventPayload) {
    this.send('PUZZLE_EVENT', { payload: event });
  }

  public sendEmote(emote: string) {
    this.send('EMOTE', { payload: { emote } });
  }

  public restartLevel() {
    this.send('RESTART_LEVEL', {});
  }

  // Event dispatching
  public on<T = any>(event: string, callback: EventCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: EventCallback) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const set = this.listeners.get(event);
    if (set) {
      for (const cb of set) {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event callback for ${event}:`, e);
        }
      }
    }
  }
}

export const multiplayerClient = MultiplayerClient.getInstance();
