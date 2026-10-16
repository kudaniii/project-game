/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/engine.ts';
import { storageManager } from './game/storage.ts';
import { inputManager } from './game/input.ts';
import { soundEngine } from './game/audio.ts';
import { STORY_SCENES } from './game/story.ts';
import { GameScreen, GameSaveData, GameMode } from './game/types.ts';
import { MainMenu } from './components/MainMenu.tsx';
import { HUD } from './components/HUD.tsx';
import { TouchControls } from './components/TouchControls.tsx';
import { StoryModal } from './components/StoryModal.tsx';
import { PauseModal } from './components/PauseModal.tsx';
import { LevelCompleteModal } from './components/LevelCompleteModal.tsx';
import { CharacterIntroModal } from './components/CharacterIntroModal.tsx';
import { LevelSelectModal } from './components/LevelSelectModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { EndingScreen } from './components/EndingScreen.tsx';
import { DeviceSelectModal } from './components/DeviceSelectModal.tsx';
import { OnlineLobbyModal } from './components/OnlineLobbyModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { OrientationWarning } from './components/OrientationWarning.tsx';
import { multiplayerClient } from './multiplayer/MultiplayerClient.ts';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [screen, setScreen] = useState<GameScreen>('menu');
  const [saveData, setSaveData] = useState<GameSaveData>(() => storageManager.load());
  const [gameMode, setGameMode] = useState<GameMode>('two_player');
  const [activeStorySceneId, setActiveStorySceneId] = useState<string | null>(null);

  // Online Multiplayer State
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [myOnlineChar, setMyOnlineChar] = useState<'bubu' | 'dudu'>('bubu');
  const [showOnlineLobby, setShowOnlineLobby] = useState<boolean>(false);
  const [urlRoomCode, setUrlRoomCode] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('bubu_dudu_player_name') || 'Petualang';
  });

  // Device selection modal: shown on first launch if user hasn't chosen yet
  const [showDeviceSelect, setShowDeviceSelect] = useState<boolean>(() => {
    const loaded = storageManager.load();
    return !loaded.settings.hasSelectedDevice;
  });

  // Active practice character
  const [practiceChar, setPracticeChar] = useState<'bubu' | 'dudu'>('bubu');

  // HUD sync states
  const [starsCollected, setStarsCollected] = useState(0);
  const [showTouchControls, setShowTouchControls] = useState<boolean>(() => {
    const loaded = storageManager.load();
    return loaded.settings.showTouchControls;
  });

  // Modals over screens
  const [showCharacterIntro, setShowCharacterIntro] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [completedLevelInfo, setCompletedLevelInfo] = useState<{
    id: number;
    stars: number;
    flowers: number;
  } | null>(null);

  // --- PARSE INVITE LINK (?room=XYZ) ON LAUNCH ---
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        setUrlRoomCode(roomParam.toUpperCase());
        setShowOnlineLobby(true);
      }
    } catch {
      // Ignore URL parse error
    }
  }, []);

  // --- INITIALIZE ENGINE & INPUTS ---
  useEffect(() => {
    inputManager.init();

    // Practice mode toggle callback from keyboard (Q or Tab)
    inputManager.onTogglePracticeCallback = () => {
      const next = inputManager.togglePracticeChar();
      setPracticeChar(next);
      soundEngine.playButtonClick();
    };

    // Start menu BGM on first user interaction
    const handleFirstInteraction = () => {
      soundEngine.userInteracted();
      if (screen === 'menu') {
        soundEngine.playBGM('menu');
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      inputManager.destroy();
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [screen]);

  // --- RESIZE CANVAS TO MATCH VIEWPORT ---
  const resizeCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, [screen]);

  // --- ENGINE SETUP WHEN ENTERING GAMEPLAY ---
  const initAndStartEngine = (
    levelId: number,
    mode: GameMode,
    online: boolean = false,
    onlineChar: 'bubu' | 'dudu' = 'bubu'
  ) => {
    if (!canvasRef.current) return;
    resizeCanvas();

    if (!engineRef.current) {
      engineRef.current = new GameEngine(canvasRef.current);
    }
    const engine = engineRef.current;

    // Callbacks
    engine.onLevelComplete = (lvlId, stars, flowers) => {
      setCompletedLevelInfo({ id: lvlId, stars, flowers });
      setSaveData(storageManager.load());
      if (lvlId >= 5) {
        // Star Valley completed -> Show Grand Ending Cutscene
        setActiveStorySceneId('grand_ending');
      } else {
        setScreen('level_complete');
      }
    };

    engine.loadLevel(levelId, mode, online, onlineChar);
    engine.start();

    // Start interval to sync HUD
    const hudInterval = setInterval(() => {
      if (engineRef.current) {
        setStarsCollected(engineRef.current.starsCollectedThisLevel);
      }
    }, 150);

    return () => clearInterval(hudInterval);
  };

  // --- START ONLINE GAME FROM LOBBY ---
  const handleStartOnlineGame = (levelId: number, myChar: 'bubu' | 'dudu') => {
    setIsOnline(true);
    setMyOnlineChar(myChar);
    setGameMode('two_player');
    setShowOnlineLobby(false);
    setShowLevelSelect(false);
    setShowPause(false);
    setCompletedLevelInfo(null);
    setScreen('gameplay');

    setTimeout(() => initAndStartEngine(levelId, 'two_player', true, myChar), 50);
  };

  // --- USER NAVIGATION ACTIONS (LOCAL) ---
  const handleStartGame = (levelId: number, mode: GameMode) => {
    setIsOnline(false);
    setGameMode(mode);
    setShowLevelSelect(false);
    setShowPause(false);
    setCompletedLevelInfo(null);

    if (levelId === 1 && !saveData.completedStory) {
      // Show Prologue Story first
      setActiveStorySceneId('prologue');
    } else {
      // Show Level Intro Story if available
      const introId = `level_${levelId}_intro`;
      if (STORY_SCENES[introId]) {
        setActiveStorySceneId(introId);
      } else {
        setScreen('gameplay');
        setTimeout(() => initAndStartEngine(levelId, mode, false), 50);
      }
    }
  };

  const handleStoryComplete = () => {
    if (activeStorySceneId === 'grand_ending') {
      setActiveStorySceneId(null);
      setScreen('ending');
      return;
    }
    if (activeStorySceneId === 'prologue') {
      // Continue to Level 1 intro
      setActiveStorySceneId('level_1_intro');
      return;
    }

    // Story intro finished -> start gameplay
    setActiveStorySceneId(null);
    setScreen('gameplay');
    const targetLevel = engineRef.current?.currentLevelData.id || 1;
    setTimeout(() => initAndStartEngine(targetLevel, gameMode, isOnline, myOnlineChar), 50);
  };

  const handleNextLevel = () => {
    if (!completedLevelInfo) return;
    const nextId = completedLevelInfo.id + 1;
    setCompletedLevelInfo(null);
    if (nextId > 5) {
      setScreen('ending');
    } else {
      const nextIntroId = `level_${nextId}_intro`;
      if (STORY_SCENES[nextIntroId]) {
        setActiveStorySceneId(nextIntroId);
      } else {
        setScreen('gameplay');
        setTimeout(() => initAndStartEngine(nextId, gameMode, isOnline, myOnlineChar), 50);
      }
    }
  };

  const handleReplayLevel = () => {
    const currentId =
      completedLevelInfo?.id || engineRef.current?.currentLevelData.id || 1;
    setCompletedLevelInfo(null);
    setScreen('gameplay');
    setTimeout(() => initAndStartEngine(currentId, gameMode, isOnline, myOnlineChar), 50);
  };

  const handleReturnToMenu = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    if (isOnline) {
      multiplayerClient.leaveRoom();
      setIsOnline(false);
    }
    setShowPause(false);
    setCompletedLevelInfo(null);
    setActiveStorySceneId(null);
    setScreen('menu');
    soundEngine.playBGM('menu');
  };

  const handleTogglePause = () => {
    if (!engineRef.current) return;
    const nextPaused = !showPause;
    setShowPause(nextPaused);
    engineRef.current.setPaused(nextPaused);
  };

  const handleToggleTouchControls = () => {
    const next = !showTouchControls;
    setShowTouchControls(next);
    const updatedSettings = {
      ...saveData.settings,
      showTouchControls: next,
      deviceMode: next ? ('mobile' as const) : ('pc' as const),
    };
    storageManager.save({ settings: updatedSettings });
    setSaveData(storageManager.load());
  };

  const handleSelectDevice = (device: 'pc' | 'mobile') => {
    setShowDeviceSelect(false);
    const isMobile = device === 'mobile';
    setShowTouchControls(isMobile);
    const updatedSettings = {
      ...saveData.settings,
      deviceMode: device,
      showTouchControls: isMobile,
      hasSelectedDevice: true,
    };
    storageManager.save({ settings: updatedSettings });
    setSaveData(storageManager.load());
  };

  const handleToggleDeviceMode = () => {
    const nextMode = saveData.settings.deviceMode === 'mobile' ? 'pc' : 'mobile';
    handleSelectDevice(nextMode);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAF6F0] font-['Quicksand',sans-serif] select-none touch-none">
      
      {/* Mobile Orientation Landscape Advisory Banner */}
      <OrientationWarning />

      {/* Active 2D Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${
          screen === 'gameplay' || screen === 'pause' || screen === 'level_complete'
            ? 'block'
            : 'hidden'
        }`}
      />

      {/* MAIN MENU */}
      {screen === 'menu' && (
        <MainMenu
          saveData={saveData}
          playerName={playerName}
          gameMode={gameMode}
          onToggleGameMode={setGameMode}
          onPlay={(lvl, mode) => handleStartGame(lvl, mode)}
          onContinue={(lvl) => handleStartGame(lvl, gameMode)}
          onOpenOnlineLobby={() => setShowOnlineLobby(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onOpenCharacterIntro={() => setShowCharacterIntro(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenCredits={() => setScreen('ending')}
          onOpenDeviceSelect={() => setShowDeviceSelect(true)}
          onSelectDevice={handleSelectDevice}
        />
      )}

      {/* GAMEPLAY OVERLAYS (HUD & Virtual Gamepad) */}
      {(screen === 'gameplay' || screen === 'pause') && engineRef.current && (
        <>
          <HUD
            levelTitle={engineRef.current.currentLevelData.title}
            levelSubtitle={engineRef.current.currentLevelData.subtitle}
            hintText={engineRef.current.currentLevelData.hint}
            objectiveText={engineRef.current.currentLevelData.objectiveText}
            hintSteps={engineRef.current.currentLevelData.hintSteps}
            bubu={engineRef.current.bubu}
            dudu={engineRef.current.dudu}
            starsCollected={starsCollected}
            gameMode={gameMode}
            isOnline={isOnline}
            myOnlineChar={myOnlineChar}
            pingMs={multiplayerClient.pingMs}
            deviceMode={saveData.settings.deviceMode}
            showTouchControls={showTouchControls}
            onToggleTouchControls={handleToggleTouchControls}
            onToggleDeviceMode={handleToggleDeviceMode}
            onResetCrates={() => engineRef.current?.resetCrates()}
            onPause={handleTogglePause}
          />

          {showTouchControls && !showPause && (
            <TouchControls
              isPractice={gameMode === 'practice' || isOnline}
              activePracticeChar={isOnline ? myOnlineChar : practiceChar}
              onSwitchPracticeChar={() => {
                if (!isOnline) {
                  const next = inputManager.togglePracticeChar();
                  setPracticeChar(next);
                  soundEngine.playButtonClick();
                }
              }}
              onResetCrates={() => engineRef.current?.resetCrates()}
            />
          )}
        </>
      )}

      {/* ONLINE LOBBY MODAL */}
      {showOnlineLobby && (
        <OnlineLobbyModal
          initialRoomCode={urlRoomCode}
          playerName={playerName}
          onStartOnlineGame={handleStartOnlineGame}
          onClose={() => setShowOnlineLobby(false)}
        />
      )}

      {/* PLAYER PROFILE & STATS MODAL */}
      {showProfile && (
        <ProfileModal
          saveData={saveData}
          onUpdateName={(name) => setPlayerName(name)}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* STORY CUTSCENE MODAL */}
      {activeStorySceneId && STORY_SCENES[activeStorySceneId] && (
        <StoryModal
          scene={STORY_SCENES[activeStorySceneId]}
          onComplete={handleStoryComplete}
        />
      )}

      {/* PAUSE MODAL */}
      {showPause && engineRef.current && (
        <PauseModal
          levelTitle={engineRef.current.currentLevelData.title}
          onResume={handleTogglePause}
          onRestart={() => {
            setShowPause(false);
            engineRef.current?.restartCurrentLevel();
          }}
          onOpenSettings={() => setShowSettings(true)}
          onHome={handleReturnToMenu}
        />
      )}

      {/* LEVEL COMPLETE VICTORY MODAL */}
      {screen === 'level_complete' && completedLevelInfo && (
        <LevelCompleteModal
          levelId={completedLevelInfo.id}
          levelTitle={`Level ${completedLevelInfo.id}`}
          starsEarned={completedLevelInfo.stars}
          flowersEarned={completedLevelInfo.flowers}
          onNextLevel={handleNextLevel}
          onReplay={handleReplayLevel}
          onHome={handleReturnToMenu}
        />
      )}

      {/* CHARACTER INTRO MODAL */}
      {showCharacterIntro && (
        <CharacterIntroModal onClose={() => setShowCharacterIntro(false)} />
      )}

      {/* LEVEL SELECT MODAL */}
      {showLevelSelect && (
        <LevelSelectModal
          saveData={saveData}
          gameMode={gameMode}
          onSelectLevel={(lvlId) => handleStartGame(lvlId, gameMode)}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <SettingsModal
          saveData={saveData}
          onUpdateSettings={(newSettings) => {
            setSaveData((prev) => ({ ...prev, settings: newSettings }));
            setShowTouchControls(newSettings.showTouchControls);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* GRAND ROMANTIC ENDING SCREEN */}
      {screen === 'ending' && (
        <EndingScreen
          onRestartGame={() => handleStartGame(1, gameMode)}
          onHome={handleReturnToMenu}
        />
      )}

      {/* DEVICE SELECTION MODAL (PC vs Mobile/Tablet) */}
      {showDeviceSelect && (
        <DeviceSelectModal
          currentDevice={saveData.settings.deviceMode}
          onSelectDevice={handleSelectDevice}
          onClose={() => setShowDeviceSelect(false)}
          isInitialPrompt={!saveData.settings.hasSelectedDevice}
        />
      )}
    </div>
  );
}
