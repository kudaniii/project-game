/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * Shared Multiplayer Protocol Types
 */

export type ClientMessageType =
  | 'CREATE_ROOM'
  | 'JOIN_ROOM'
  | 'LEAVE_ROOM'
  | 'SET_READY'
  | 'SWITCH_CHARACTER'
  | 'START_GAME'
  | 'PLAYER_UPDATE'
  | 'PUZZLE_EVENT'
  | 'EMOTE'
  | 'RESTART_LEVEL'
  | 'NEXT_LEVEL'
  | 'PING';

export type ServerMessageType =
  | 'ROOM_CREATED'
  | 'ROOM_JOINED'
  | 'ROOM_UPDATE'
  | 'PLAYER_LEFT'
  | 'GAME_STARTED'
  | 'REMOTE_PLAYER_UPDATE'
  | 'PUZZLE_STATE_SYNC'
  | 'LEVEL_RESTARTED'
  | 'REMOTE_EMOTE'
  | 'ERROR'
  | 'PONG';

export interface BaseMessage {
  type: ClientMessageType | ServerMessageType;
  timestamp?: number;
}

export interface PlayerPublicInfo {
  id: string;
  name: string;
  character: 'bubu' | 'dudu';
  isReady: boolean;
  isHost: boolean;
  pingMs: number;
}

export interface RoomInfoPayload {
  roomId: string;
  levelId: number;
  players: PlayerPublicInfo[];
  levelStarted: boolean;
  myPlayerId: string;
}

export interface PlayerUpdatePayload {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 'left' | 'right';
  state: 'idle' | 'walk' | 'jump' | 'fall' | 'push' | 'victory';
  isCarrying: boolean;
  carriedCrateId: string | null;
  hasKey: string | null;
}

export interface PuzzleEventPayload {
  eventType: 'lever_toggle' | 'switch_state' | 'crate_move' | 'collect_item' | 'checkpoint' | 'level_finish';
  targetId?: string;
  value?: boolean | number | string | object;
}
