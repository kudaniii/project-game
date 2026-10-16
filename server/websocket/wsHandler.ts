/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * WebSocket Handler for Server Real-Time Communication
 */

import { WebSocket } from 'ws';
import { roomManager, GameRoom } from '../rooms/RoomManager.ts';
import { ClientMessageType, ServerMessageType } from '../../src/multiplayer/protocol.ts';

interface ClientSocketData {
  playerId?: string;
  roomId?: string;
}

export function setupWebSocketServer(wss: any) {
  // Interval for stale rooms cleanup
  setInterval(() => {
    roomManager.cleanStaleRooms();
  }, 1000 * 60 * 5);

  wss.on('connection', (ws: WebSocket) => {
    const socketData: ClientSocketData = {};

    ws.on('message', (raw: string) => {
      try {
        const msg = JSON.parse(raw.toString());
        const type: ClientMessageType = msg.type;

        switch (type) {
          case 'CREATE_ROOM': {
            const { playerId, playerName, characterChoice } = msg;
            socketData.playerId = playerId;
            const room = roomManager.createRoom(playerId, playerName, characterChoice || 'bubu', ws);
            socketData.roomId = room.id;

            ws.send(
              JSON.stringify({
                type: 'ROOM_CREATED',
                payload: {
                  roomId: room.id,
                  levelId: room.levelId,
                  players: Array.from(room.players.values()).map((p) => ({
                    id: p.id,
                    name: p.name,
                    character: p.character,
                    isReady: p.isReady,
                    isHost: p.isHost,
                    pingMs: p.pingMs,
                  })),
                  levelStarted: room.gameState.levelStarted,
                  myPlayerId: playerId,
                },
              })
            );
            break;
          }

          case 'JOIN_ROOM': {
            const { roomId, playerId, playerName } = msg;
            socketData.playerId = playerId;
            const result = roomManager.joinRoom(roomId, playerId, playerName, ws);

            if (!result.success || !result.room) {
              ws.send(
                JSON.stringify({
                  type: 'ERROR',
                  payload: { message: result.error || 'Gagal bergabung ke ruangan.' },
                })
              );
              return;
            }

            const room = result.room;
            socketData.roomId = room.id;

            const roomPayload = {
              roomId: room.id,
              levelId: room.levelId,
              players: Array.from(room.players.values()).map((p) => ({
                id: p.id,
                name: p.name,
                character: p.character,
                isReady: p.isReady,
                isHost: p.isHost,
                pingMs: p.pingMs,
              })),
              levelStarted: room.gameState.levelStarted,
              myPlayerId: playerId,
            };

            // Notify joiner
            ws.send(JSON.stringify({ type: 'ROOM_JOINED', payload: roomPayload }));

            // Notify all players in room about update
            roomManager.broadcastToRoom(room, {
              type: 'ROOM_UPDATE',
              payload: roomPayload,
            });
            break;
          }

          case 'SET_READY': {
            const { isReady } = msg;
            if (!socketData.roomId || !socketData.playerId) return;
            const room = roomManager.getRoom(socketData.roomId);
            if (!room) return;

            const player = room.players.get(socketData.playerId);
            if (player) {
              player.isReady = Boolean(isReady);
              roomManager.broadcastToRoom(room, {
                type: 'ROOM_UPDATE',
                payload: {
                  roomId: room.id,
                  levelId: room.levelId,
                  players: Array.from(room.players.values()).map((p) => ({
                    id: p.id,
                    name: p.name,
                    character: p.character,
                    isReady: p.isReady,
                    isHost: p.isHost,
                    pingMs: p.pingMs,
                  })),
                  levelStarted: room.gameState.levelStarted,
                  myPlayerId: '',
                },
              });
            }
            break;
          }

          case 'SWITCH_CHARACTER': {
            if (!socketData.roomId || !socketData.playerId) return;
            const room = roomManager.getRoom(socketData.roomId);
            if (!room) return;

            const player = room.players.get(socketData.playerId);
            if (!player) return;

            // If 2 players, swap characters!
            if (room.players.size === 2) {
              const playersArr = Array.from(room.players.values());
              const other = playersArr.find((p) => p.id !== player.id);
              if (other) {
                const temp = player.character;
                player.character = other.character;
                other.character = temp;
              }
            } else {
              player.character = player.character === 'bubu' ? 'dudu' : 'bubu';
            }

            roomManager.broadcastToRoom(room, {
              type: 'ROOM_UPDATE',
              payload: {
                roomId: room.id,
                levelId: room.levelId,
                players: Array.from(room.players.values()).map((p) => ({
                  id: p.id,
                  name: p.name,
                  character: p.character,
                  isReady: p.isReady,
                  isHost: p.isHost,
                  pingMs: p.pingMs,
                })),
                levelStarted: room.gameState.levelStarted,
                myPlayerId: '',
              },
            });
            break;
          }

          case 'START_GAME': {
            const { levelId } = msg;
            if (!socketData.roomId) return;
            const room = roomManager.getRoom(socketData.roomId);
            if (!room) return;

            room.levelId = levelId || 1;
            room.gameState = roomManager.createInitialGameState(room.levelId);
            room.gameState.levelStarted = true;

            roomManager.broadcastToRoom(room, {
              type: 'GAME_STARTED',
              payload: {
                levelId: room.levelId,
                gameState: room.gameState,
              },
            });
            break;
          }

          case 'PLAYER_UPDATE': {
            if (!socketData.roomId || !socketData.playerId) return;
            const room = roomManager.getRoom(socketData.roomId);
            if (!room) return;

            const player = room.players.get(socketData.playerId);
            if (!player) return;

            // Broadcast to the other player in the room!
            roomManager.broadcastToRoom(
              room,
              {
                type: 'REMOTE_PLAYER_UPDATE',
                payload: {
                  character: player.character,
                  playerId: player.id,
                  data: msg.payload,
                },
              },
              player.id
            );
            break;
          }

          case 'PUZZLE_EVENT': {
            if (!socketData.roomId || !socketData.playerId) return;
            const room = roomManager.getRoom(socketData.roomId);
            if (!room) return;

            const player = room.players.get(socketData.playerId);
            if (!player) return;

            // Authoritative puzzle event broadcast
            roomManager.broadcastToRoom(
              room,
              {
                type: 'PUZZLE_STATE_SYNC',
                payload: {
                  senderCharacter: player.character,
                  event: msg.payload,
                },
              },
              player.id
            );
            break;
          }

          case 'EMOTE': {
            if (!socketData.roomId || !socketData.playerId) return;
            const room = roomManager.getRoom(socketData.roomId);
            if (!room) return;

            const player = room.players.get(socketData.playerId);
            if (!player) return;

            roomManager.broadcastToRoom(room, {
              type: 'REMOTE_EMOTE',
              payload: {
                character: player.character,
                emote: msg.payload.emote,
              },
            });
            break;
          }

          case 'RESTART_LEVEL': {
            if (!socketData.roomId) return;
            const room = roomManager.getRoom(socketData.roomId);
            if (!room) return;

            room.gameState = roomManager.createInitialGameState(room.levelId);
            room.gameState.levelStarted = true;

            roomManager.broadcastToRoom(room, {
              type: 'LEVEL_RESTARTED',
              payload: {
                levelId: room.levelId,
                gameState: room.gameState,
              },
            });
            break;
          }

          case 'PING': {
            const { clientTime } = msg;
            ws.send(
              JSON.stringify({
                type: 'PONG',
                payload: { clientTime, serverTime: Date.now() },
              })
            );
            break;
          }

          case 'LEAVE_ROOM': {
            if (socketData.roomId && socketData.playerId) {
              const res = roomManager.leaveRoom(socketData.roomId, socketData.playerId);
              if (!res.roomEmpty && res.room) {
                roomManager.broadcastToRoom(res.room, {
                  type: 'PLAYER_LEFT',
                  payload: { playerId: socketData.playerId },
                });
              }
              socketData.roomId = undefined;
            }
            break;
          }
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      if (socketData.roomId && socketData.playerId) {
        const res = roomManager.leaveRoom(socketData.roomId, socketData.playerId);
        if (!res.roomEmpty && res.room) {
          roomManager.broadcastToRoom(res.room, {
            type: 'PLAYER_LEFT',
            payload: { playerId: socketData.playerId },
          });
        }
      }
    });
  });
}
