/**
 * Bubu & Dudu: A Cozy Co-op Adventure
 * Online Multiplayer Lobby Modal with Room Creation, Joining, and Ready Sync
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Copy,
  Check,
  Share2,
  Play,
  RotateCw,
  Sparkles,
  Wifi,
  WifiOff,
  Heart,
  Smile,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { multiplayerClient } from '../multiplayer/MultiplayerClient.ts';
import { soundEngine } from '../game/audio.ts';
import { RoomInfoPayload } from '../multiplayer/protocol.ts';
import { GAME_LEVELS } from '../game/levels.ts';

interface OnlineLobbyModalProps {
  initialRoomCode?: string | null;
  playerName: string;
  onStartOnlineGame: (levelId: number, myCharacter: 'bubu' | 'dudu') => void;
  onClose: () => void;
}

export const OnlineLobbyModal: React.FC<OnlineLobbyModalProps> = ({
  initialRoomCode,
  playerName: defaultName,
  onStartOnlineGame,
  onClose,
}) => {
  const [tab, setTab] = useState<'menu' | 'create' | 'join' | 'room'>(
    initialRoomCode ? 'join' : 'menu'
  );
  const [playerName, setPlayerName] = useState(defaultName || 'Pemain');
  const [characterChoice, setCharacterChoice] = useState<'bubu' | 'dudu'>('bubu');
  const [inputRoomCode, setInputRoomCode] = useState(initialRoomCode || '');
  const [roomData, setRoomData] = useState<RoomInfoPayload | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pingMs, setPingMs] = useState(0);
  const [selectedLevelId, setSelectedLevelId] = useState(1);

  useEffect(() => {
    // Listeners
    const un1 = multiplayerClient.on('ROOM_CREATED', (data: RoomInfoPayload) => {
      setRoomData(data);
      setTab('room');
      setIsConnecting(false);
      soundEngine.playCollectStar();
    });

    const un2 = multiplayerClient.on('ROOM_JOINED', (data: RoomInfoPayload) => {
      setRoomData(data);
      setTab('room');
      setIsConnecting(false);
      soundEngine.playCollectStar();
    });

    const un3 = multiplayerClient.on('ROOM_UPDATE', (data: RoomInfoPayload) => {
      setRoomData(data);
    });

    const un4 = multiplayerClient.on('GAME_STARTED', (payload: any) => {
      soundEngine.playLevelClear();
      onStartOnlineGame(payload.levelId, multiplayerClient.myCharacter);
    });

    const un5 = multiplayerClient.on('ERROR', (payload: any) => {
      setErrorMsg(payload.message || 'Terjadi kesalahan jaringan.');
      setIsConnecting(false);
    });

    const un6 = multiplayerClient.on('ping_update', (payload: any) => {
      setPingMs(payload.pingMs);
    });

    const un7 = multiplayerClient.on('PLAYER_LEFT', () => {
      soundEngine.playRespawn();
    });

    return () => {
      un1();
      un2();
      un3();
      un4();
      un5();
      un6();
      un7();
    };
  }, [onStartOnlineGame]);

  const handleCreateRoom = async () => {
    setErrorMsg(null);
    setIsConnecting(true);
    soundEngine.playButtonClick();
    await multiplayerClient.createRoom(playerName, characterChoice);
  };

  const handleJoinRoom = async () => {
    if (!inputRoomCode.trim()) {
      setErrorMsg('Masukkan kode ruangan!');
      return;
    }
    setErrorMsg(null);
    setIsConnecting(true);
    soundEngine.playButtonClick();
    await multiplayerClient.joinRoom(inputRoomCode.trim(), playerName);
  };

  const handleCopyLink = () => {
    if (!roomData) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${roomData.roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      soundEngine.playButtonClick();
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleCopyCode = () => {
    if (!roomData) return;
    navigator.clipboard.writeText(roomData.roomId).then(() => {
      setIsCopied(true);
      soundEngine.playButtonClick();
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleToggleReady = () => {
    if (!roomData) return;
    soundEngine.playButtonClick();
    const me = roomData.players.find((p) => p.id === multiplayerClient.myPlayerId);
    if (me) {
      multiplayerClient.setReady(!me.isReady);
    }
  };

  const handleSwitchCharacter = () => {
    soundEngine.playButtonClick();
    multiplayerClient.switchCharacter();
  };

  const handleStartGame = () => {
    if (!roomData) return;
    soundEngine.playButtonClick();
    multiplayerClient.startGame(selectedLevelId);
  };

  const handleLeaveRoom = () => {
    soundEngine.playButtonClick();
    multiplayerClient.leaveRoom();
    setRoomData(null);
    setTab('menu');
  };

  const myPlayer = roomData?.players.find((p) => p.id === multiplayerClient.myPlayerId);
  const otherPlayer = roomData?.players.find((p) => p.id !== multiplayerClient.myPlayerId);
  const isHost = myPlayer?.isHost ?? false;
  const canStart = isHost && roomData && roomData.players.length === 2 && roomData.players.every((p) => p.isReady);

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="max-w-md w-full bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F4] rounded-3xl border-2 border-stone-200 shadow-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col animate-popIn">
        
        {/* Soft Ambient Pastel Glows */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-teal-200/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-pink-200/50 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playButtonClick();
            if (tab === 'room') {
              handleLeaveRoom();
            }
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ======================================================== */}
        {/* VIEW 1: MENU UTAMA MULTIPLAYER */}
        {/* ======================================================== */}
        {tab === 'menu' && (
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/90 text-teal-900 text-xs font-bold mb-2 border border-teal-300/80">
              <Users className="w-3.5 h-3.5 text-teal-700" />
              <span>Multiplayer Online Co-op</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-['Fredoka',sans-serif] text-stone-800">
              Petualangan Bersama Teman
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-sm mt-1 mb-5">
              Mainkan game ini bersama temanmu dari HP atau laptop yang berbeda secara real-time!
            </p>

            {/* Player Name Input */}
            <div className="w-full mb-4 text-left">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Nama Panggilanmu:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
                placeholder="Misal: Dani, Sarah..."
                className="w-full px-4 py-2.5 bg-white border-2 border-stone-200 rounded-2xl text-stone-800 font-bold text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              {/* Create Room Button */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playButtonClick();
                  setTab('create');
                }}
                className="hud-btn flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 active:scale-95 text-white font-extrabold rounded-2xl border border-teal-400 border-b-4 border-b-teal-800 shadow-md text-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-100" />
                <span>Buat Ruangan Baru (Host)</span>
              </button>

              {/* Join Room Button */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playButtonClick();
                  setTab('join');
                }}
                className="hud-btn flex items-center justify-center gap-2 py-3 px-5 bg-white hover:bg-stone-50 active:scale-95 text-stone-800 font-bold rounded-2xl border border-stone-200 border-b-3 border-b-stone-300 shadow-sm text-sm cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-stone-600" />
                <span>Gabung Ruangan (Masukkan Kode)</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: BUAT RUANGAN BARU */}
        {/* ======================================================== */}
        {tab === 'create' && (
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka',sans-serif] text-stone-800 mb-1">
              Buat Ruangan Baru
            </h2>
            <p className="text-xs text-stone-500 font-medium mb-4">
              Pilih karakter yang ingin kamu kendalikan:
            </p>

            {/* Character Selection */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div
                onClick={() => {
                  soundEngine.playButtonClick();
                  setCharacterChoice('bubu');
                }}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                  characterChoice === 'bubu'
                    ? 'bg-amber-100/70 border-amber-600 shadow-md scale-[1.02]'
                    : 'bg-white border-stone-200 hover:border-amber-300'
                }`}
              >
                <span className="text-4xl mb-1">🐻</span>
                <span className="font-bold text-sm text-[#4A3B32]">Bubu</span>
                <span className="text-[10px] text-stone-500">Beruang Cokelat (Kuat)</span>
              </div>

              <div
                onClick={() => {
                  soundEngine.playButtonClick();
                  setCharacterChoice('dudu');
                }}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                  characterChoice === 'dudu'
                    ? 'bg-pink-100/70 border-pink-500 shadow-md scale-[1.02]'
                    : 'bg-white border-stone-200 hover:border-pink-300'
                }`}
              >
                <span className="text-4xl mb-1">🐰</span>
                <span className="font-bold text-sm text-pink-900">Dudu</span>
                <span className="text-[10px] text-stone-500">Kelinci Putih (Lincah)</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-100 text-red-700 text-xs font-bold rounded-xl mb-3 border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab('menu')}
                className="hud-btn flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-xs"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={isConnecting}
                onClick={handleCreateRoom}
                className="hud-btn flex-1 py-2.5 bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-2xl text-xs border border-teal-400 border-b-3 border-b-teal-800 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isConnecting ? 'Membuat...' : 'Buka Ruangan'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: GABUNG RUANGAN DENGAN KODE */}
        {/* ======================================================== */}
        {tab === 'join' && (
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka',sans-serif] text-stone-800 mb-1">
              Gabung Ruangan
            </h2>
            <p className="text-xs text-stone-500 font-medium mb-4">
              Masukkan 6 digit kode ruangan dari temanmu:
            </p>

            <div className="mb-4">
              <input
                type="text"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase().slice(0, 8))}
                placeholder="Misal: BD8821"
                className="w-full text-center tracking-widest text-2xl font-black px-4 py-3 bg-white border-2 border-stone-200 rounded-2xl text-stone-800 uppercase focus:border-teal-500 focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-100 text-red-700 text-xs font-bold rounded-xl mb-3 border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab('menu')}
                className="hud-btn flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-xs"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={isConnecting}
                onClick={handleJoinRoom}
                className="hud-btn flex-1 py-2.5 bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-2xl text-xs border border-teal-400 border-b-3 border-b-teal-800 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                <span>{isConnecting ? 'Menghubungkan...' : 'Gabung Sekarang'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: RUANGAN LOBBY (WAITING FOR PLAYERS) */}
        {/* ======================================================== */}
        {tab === 'room' && roomData && (
          <div className="flex flex-col">
            {/* Room Header with Code & Copy */}
            <div className="flex items-center justify-between bg-teal-50 border-2 border-teal-200 rounded-2xl p-3 mb-3">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  Kode Ruangan:
                </span>
                <span className="text-xl font-black text-teal-950 font-mono tracking-widest">
                  {roomData.roomId}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="hud-btn px-2.5 py-1.5 bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95"
                  title="Salin Kode"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="hud-btn p-1.5 bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 rounded-xl active:scale-95"
                  title="Bagikan Tautan Undangan"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Connection Ping Status */}
            <div className="flex items-center justify-between px-2 mb-3 text-[11px] font-bold text-stone-500">
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terhubung ke Server</span>
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Ping: {pingMs || '< 25'} ms
              </span>
            </div>

            {/* 2 Player Slots */}
            <div className="space-y-2 mb-4">
              {/* Player 1 Slot */}
              <div className="p-3 bg-white border-2 border-stone-200 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">
                    {myPlayer?.character === 'bubu' ? '🐻' : '🐰'}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-800 text-sm">
                        {myPlayer?.name || 'Kamu'}
                      </span>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-bold">
                        (Kamu)
                      </span>
                      {isHost && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                          Host
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 font-semibold">
                      Karakter: <strong className="capitalize">{myPlayer?.character}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSwitchCharacter}
                    className="hud-btn text-[10px] font-bold bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-lg text-stone-700"
                    title="Ganti Karakter"
                  >
                    Tukar
                  </button>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Siap ✓
                  </span>
                </div>
              </div>

              {/* Player 2 Slot */}
              <div className="p-3 bg-white border-2 border-stone-200 rounded-2xl flex items-center justify-between shadow-xs">
                {otherPlayer ? (
                  <>
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">
                        {otherPlayer.character === 'bubu' ? '🐻' : '🐰'}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-800 text-sm">
                            {otherPlayer.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 font-semibold">
                          Karakter: <strong className="capitalize">{otherPlayer.character}</strong>
                        </span>
                      </div>
                    </div>
                    <div>
                      {otherPlayer.isReady ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Siap ✓
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Menunggu...
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-stone-400 py-1">
                    <RotateCw className="w-4 h-4 animate-spin text-teal-600" />
                    <span className="text-xs font-semibold">
                      Menunggu pemain kedua bergabung...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Level Selector (Host only) */}
            {isHost && (
              <div className="mb-4 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Pilih Level Petualangan:
                </label>
                <select
                  value={selectedLevelId}
                  onChange={(e) => setSelectedLevelId(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 focus:outline-none"
                >
                  {GAME_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      Level {lvl.id}: {lvl.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleLeaveRoom}
                className="hud-btn py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-xs"
              >
                Keluar
              </button>

              {isHost ? (
                <button
                  type="button"
                  disabled={!canStart}
                  onClick={handleStartGame}
                  className="hud-btn flex-1 py-2.5 bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-2xl text-xs border border-teal-400 border-b-3 border-b-teal-800 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{otherPlayer ? 'Mulai Petualangan' : 'Menunggu Pemain 2...'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleReady}
                  className={`hud-btn flex-1 py-2.5 font-bold rounded-2xl text-xs border-b-3 flex items-center justify-center gap-1.5 cursor-pointer ${
                    myPlayer?.isReady
                      ? 'bg-emerald-600 text-white border-emerald-800'
                      : 'bg-amber-500 text-white border-amber-700'
                  }`}
                >
                  <span>{myPlayer?.isReady ? 'Batalkan Siap' : 'Saya Siap!'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
