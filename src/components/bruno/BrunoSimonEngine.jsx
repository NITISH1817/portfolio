import React, { useRef, useEffect, useState, useCallback } from 'react';
import LandmarkOverlay from './modals/LandmarkOverlay';
import RecruiterModal from './modals/RecruiterModal';
import NexusAiModal from './modals/NexusAiModal';
import TechLabModal from './modals/TechLabModal';
import WorldMap from './WorldMap';
import CommandPalette from './modals/CommandPalette';
import AchievementsModal from './modals/AchievementsModal';
import GarageModal from './modals/GarageModal';
import { vehicleState } from './VehiclePhysics';
import { InteractionManager } from '../../engine/folio/Game/Interaction/InteractionManager';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Compass,
  ArrowLeft,
  Bot,
  FlaskConical,
  Sun,
  Moon,
  CloudRain,
  Palette,
  Camera,
  MapPin,
  Search,
  Trophy,
  Gauge,
  Flame,
  UserCheck
} from 'lucide-react';
import { projects } from '../../data/portfolio';

export default function BrunoSimonEngine({
  onOpenRecruiter,
  onSwitchClassic,
  soundEnabled = true,
  onToggleSound
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  // Modal active states
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);
  const [isNexusAiOpen, setIsNexusAiOpen] = useState(false);
  const [isTechLabOpen, setIsTechLabOpen] = useState(false);
  const [isWorldMapOpen, setIsWorldMapOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [benchScenicData, setBenchScenicData] = useState(null);
  const [interactionToast, setInteractionToast] = useState(null);

  // Audio & Controls
  const [isSoundMuted, setIsSoundMuted] = useState(!soundEnabled);
  const [showControlsHint, setShowControlsHint] = useState(true);

  // Environment & Vehicle Cycle States
  const [dayCycleName, setDayCycleName] = useState('dusk');
  const [weatherName, setWeatherName] = useState('clear');
  const [paintName, setPaintName] = useState('flames');
  const [isFreeCam, setIsFreeCam] = useState(false);

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    gear: '1',
    nitro: 100,
    topSpeed: 0,
    odometer: 0
  });

  // Helper to pause engine inputs when any modal opens
  const pauseGame = useCallback(() => {
    if (gameRef.current?.inputs?.pause) {
      gameRef.current.inputs.pause();
    }
  }, []);

  // Helper to resume engine inputs when all modals close
  const resumeGame = useCallback(() => {
    if (gameRef.current?.inputs?.resume) {
      gameRef.current.inputs.resume();
    }
  }, []);

  // Feedback toast helper
  const showFeedbackToast = useCallback((toast) => {
    setInteractionToast(toast);
    setTimeout(() => {
      setInteractionToast((curr) => (curr === toast ? null : curr));
    }, 3500);
  }, []);

  // Universal close handler
  const handleCloseModal = useCallback(() => {
    setActiveLandmark(null);
    setSelectedProject(null);
    setIsRecruiterOpen(false);
    setIsNexusAiOpen(false);
    setIsTechLabOpen(false);
    setIsWorldMapOpen(false);
    setIsCommandPaletteOpen(false);
    setIsAchievementsOpen(false);
    setIsGarageOpen(false);
    setBenchScenicData(null);
    if (InteractionManager.getInstance()) {
      InteractionManager.getInstance().standUpFromBench();
    }
    resumeGame();
  }, [resumeGame]);

  // Open landmark modal safely
  const handleOpenLandmark = useCallback((id) => {
    pauseGame();
    if (id === 'projects') setSelectedProject(projects[0]);
    setActiveLandmark(id);
  }, [pauseGame]);

  // Teleport vehicle to specific 3D coordinates
  const handleTeleportToCoords = useCallback((coords) => {
    handleCloseModal();
    if (gameRef.current?.physicalVehicle?.moveTo) {
      gameRef.current.physicalVehicle.moveTo(
        { x: coords[0], y: coords[1] + 2, z: coords[2] },
        0
      );
    }
  }, [handleCloseModal]);

  // Fast-travel respawn to named districts
  const handleFastTravel = useCallback((respawnName) => {
    handleCloseModal();
    if (gameRef.current?.player?.respawn) {
      gameRef.current.player.respawn(respawnName);
    }
  }, [handleCloseModal]);

  // Cycle Day / Night presets
  const handleCycleDay = useCallback(() => {
    const cycleList = ['day', 'dusk', 'night', 'dawn'];
    setDayCycleName((curr) => {
      const nextIdx = (cycleList.indexOf(curr) + 1) % cycleList.length;
      const next = cycleList[nextIdx];
      if (gameRef.current?.dayCycles?.override?.start && gameRef.current?.dayCycles?.presets?.[next]) {
        gameRef.current.dayCycles.override.start(gameRef.current.dayCycles.presets[next], 2);
      }
      return next;
    });
  }, []);

  // Cycle Weather presets
  const handleCycleWeather = useCallback(() => {
    const weatherPresets = {
      clear: { rain: 0, snow: -1, clouds: 0.1, temperature: 24, wetness: 0 },
      rain: { rain: 1, wetness: 1, clouds: 0.8, temperature: 18 },
      snow: { rain: 0.8, snow: 1, temperature: -8, clouds: 0.9 },
      storm: { rain: 1, electricField: 1, clouds: 1, temperature: 15, wind: 1 }
    };
    const cycleList = ['clear', 'rain', 'snow', 'storm'];
    setWeatherName((curr) => {
      const nextIdx = (cycleList.indexOf(curr) + 1) % cycleList.length;
      const next = cycleList[nextIdx];
      if (gameRef.current?.weather?.override?.start) {
        gameRef.current.weather.override.start(weatherPresets[next], 2);
      }
      return next;
    });
  }, []);

  // Cycle Vehicle Chassis Paint
  const handleCyclePaint = useCallback(() => {
    const paintList = ['flames', 'abyssal', 'red', 'orange', 'white', 'black'];
    setPaintName((curr) => {
      const nextIdx = (paintList.indexOf(curr) + 1) % paintList.length;
      const next = paintList[nextIdx];
      if (gameRef.current?.world?.visualVehicle?.paints?.changeTo) {
        gameRef.current.world.visualVehicle.paints.changeTo(next);
      }
      return next;
    });
  }, []);

  // Toggle Camera View Mode (Follow Isometric vs Orbit Freecam)
  const handleToggleCamera = useCallback(() => {
    if (gameRef.current?.view?.toggleMode) {
      gameRef.current.view.toggleMode();
      setIsFreeCam((prev) => !prev);
    }
  }, []);

  // Audio toggle
  const handleToggleMute = useCallback(() => {
    setIsSoundMuted((prev) => {
      const next = !prev;
      if (gameRef.current?.audio?.mute) {
        if (next) gameRef.current.audio.mute();
        else gameRef.current.audio.unmute();
      }
      if (onToggleSound) onToggleSound();
      return next;
    });
  }, [onToggleSound]);

  // Respawn vehicle
  const handleRespawn = useCallback(() => {
    if (gameRef.current?.player?.respawn) {
      gameRef.current.player.respawn();
    } else if (gameRef.current?.reset) {
      gameRef.current.reset();
    }
  }, []);

  // Engine lifecycle & Telemetry
  useEffect(() => {
    let isMounted = true;
    let animId = null;
    let lastPos = null;
    let totalDist = 0;
    let maxKmh = 0;

    import('../../engine/folio/threejs-override.js')
      .then(() => import('../../engine/folio/Game/Game.js'))
      .then(({ Game }) => {
        if (!isMounted || !containerRef.current || !canvasRef.current) return;

        if (Game.instance) {
          try {
            Game.instance.destroy();
          } catch (e) {
            console.warn('Game cleanup warning:', e);
          }
        }

        const game = new Game(containerRef.current, canvasRef.current);
        gameRef.current = game;

        // Apply initial warm sunset / dusk preset
        setTimeout(() => {
          if (game.dayCycles?.override?.start && game.dayCycles?.presets?.dusk) {
            game.dayCycles.override.start(game.dayCycles.presets.dusk, 1.5);
          }
          if (game.world?.visualVehicle?.paints?.changeTo) {
            game.world.visualVehicle.paints.changeTo('flames');
          }
        }, 1200);

        // Hook Interactive Points into our Modals
        if (game.interactivePoints && game.interactivePoints.events) {
          game.interactivePoints.events.on('interact', (item) => {
            if (!item || !item.name) return;
            const name = item.name.toLowerCase();
            if (game.inputs?.pause) game.inputs.pause();

            if (name.includes('map') || name.includes('kiosk')) {
              setIsWorldMapOpen(true);
            } else if (name.includes('garage') || name.includes('custom')) {
              setIsGarageOpen(true);
            } else if (name.includes('control') || name.includes('command')) {
              setIsCommandPaletteOpen(true);
            } else if (name.includes('project')) {
              setSelectedProject(projects[0]);
              setActiveLandmark('projects');
            } else if (name.includes('lab') || name.includes('research')) {
              setIsTechLabOpen(true);
            } else if (name.includes('career') || name.includes('education')) {
              setActiveLandmark('education');
            } else if (name.includes('achievement')) {
              setIsAchievementsOpen(true);
            } else if (
              name.includes('social') ||
              name.includes('contact') ||
              name.includes('mail') ||
              name.includes('altar')
            ) {
              setActiveLandmark('contact');
            } else if (
              name.includes('recruiter') ||
              name.includes('dossier') ||
              name.includes('avatar') ||
              name.includes('developer')
            ) {
              setIsRecruiterOpen(true);
            } else {
              setActiveLandmark('about');
            }
          });
        }

        // Live Telemetry Loop
        const updateTelemetry = () => {
          if (!isMounted) return;
          if (game.physicalVehicle) {
            const currentPos = game.physicalVehicle.position;
            if (currentPos) {
              if (lastPos) {
                const delta = Math.hypot(currentPos.x - lastPos.x, currentPos.z - lastPos.z);
                if (delta < 5) {
                  totalDist += delta * 0.001; // km
                }
              } else {
                lastPos = { x: currentPos.x, y: currentPos.y, z: currentPos.z };
              }
              lastPos.x = currentPos.x;
              lastPos.y = currentPos.y;
              lastPos.z = currentPos.z;

              // Synchronize live GPS position and heading for Tactical Radar & WorldMap
              vehicleState.position.x = currentPos.x;
              vehicleState.position.y = currentPos.y;
              vehicleState.position.z = currentPos.z;
              if (game.physicalVehicle.chassis?.physical?.body) {
                const rot = game.physicalVehicle.chassis.physical.body.rotation();
                if (rot) {
                  vehicleState.heading = Math.atan2(
                    2 * (rot.w * rot.y + rot.x * rot.z),
                    1 - 2 * (rot.y * rot.y + rot.z * rot.z)
                  );
                }
              }
            }

            const rawSpeed = Math.abs(game.physicalVehicle.speed || 0);
            const kmh = Math.round(rawSpeed * 3.6 * 4.5);
            if (kmh > maxKmh && kmh < 260) {
              maxKmh = kmh;
            }

            let currentGear = '1';
            if (kmh < 2) currentGear = 'N';
            else if (kmh < 25) currentGear = '1';
            else if (kmh < 50) currentGear = '2';
            else if (kmh < 75) currentGear = '3';
            else if (kmh < 100) currentGear = '4';
            else currentGear = '5';

            if (game.player?.boosting) {
              currentGear = 'NITRO';
            }

            setTelemetry({
              speed: kmh,
              gear: currentGear,
              nitro: Math.round(Math.max(0, 100 - (game.player?.boosting || 0) * 10)),
              topSpeed: maxKmh,
              odometer: parseFloat(totalDist.toFixed(2))
            });
          }
          animId = requestAnimationFrame(updateTelemetry);
        };
        animId = requestAnimationFrame(updateTelemetry);
      })
      .catch((err) => {
        console.error('Failed to initialize Bruno Simon Folio engine:', err);
      });

    // Window Event Listeners for World Systems & Modals
    const onOpenWorldMap = () => { pauseGame(); setIsWorldMapOpen(true); };
    const onOpenGarageModal = () => { pauseGame(); setIsGarageOpen(true); };
    const onOpenRecruiterModal = () => { pauseGame(); setIsRecruiterOpen(true); };
    const onOpenTechLabModal = () => { pauseGame(); setIsTechLabOpen(true); };
    const onOpenCommandPalette = () => { pauseGame(); setIsCommandPaletteOpen(true); };
    const onBenchSit = (e) => { setBenchScenicData(e.detail); };
    const onBenchStand = () => { setBenchScenicData(null); };
    const onInteractionFeedback = (e) => { showFeedbackToast(e.detail); };
    const onCrystalCollected = (e) => {
      showFeedbackToast({
        title: `💎 ${e.detail.name} Collected!`,
        subtitle: `${e.detail.district} • ${e.detail.description}`
      });
    };

    window.addEventListener('open-world-map', onOpenWorldMap);
    window.addEventListener('open-garage-modal', onOpenGarageModal);
    window.addEventListener('open-recruiter-modal', onOpenRecruiterModal);
    window.addEventListener('open-techlab-modal', onOpenTechLabModal);
    window.addEventListener('open-command-palette', onOpenCommandPalette);
    window.addEventListener('bench-sit', onBenchSit);
    window.addEventListener('bench-stand', onBenchStand);
    window.addEventListener('interaction-feedback', onInteractionFeedback);
    window.addEventListener('crystal-collected', onCrystalCollected);

    const hintTimer = setTimeout(() => setShowControlsHint(false), 9000);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      clearTimeout(hintTimer);
      window.removeEventListener('open-world-map', onOpenWorldMap);
      window.removeEventListener('open-garage-modal', onOpenGarageModal);
      window.removeEventListener('open-recruiter-modal', onOpenRecruiterModal);
      window.removeEventListener('open-techlab-modal', onOpenTechLabModal);
      window.removeEventListener('open-command-palette', onOpenCommandPalette);
      window.removeEventListener('bench-sit', onBenchSit);
      window.removeEventListener('bench-stand', onBenchStand);
      window.removeEventListener('interaction-feedback', onInteractionFeedback);
      window.removeEventListener('crystal-collected', onCrystalCollected);

      if (gameRef.current?.destroy) {
        try {
          gameRef.current.destroy();
        } catch (e) {
          console.warn('Game teardown error:', e);
        }
        gameRef.current = null;
      }
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isInput) return;

      if (e.key === 'Escape') {
        handleCloseModal();
        return;
      }

      if (e.key === 'r' || e.key === 'R' || e.key === 'd' || e.key === 'D') {
        if (!e.ctrlKey && !e.metaKey) {
          pauseGame();
          setIsRecruiterOpen(true);
        }
      } else if (e.key === 'm' || e.key === 'M') {
        pauseGame();
        setIsWorldMapOpen((v) => !v);
      } else if (e.key === 'a' || e.key === 'A') {
        pauseGame();
        setIsNexusAiOpen((v) => !v);
      } else if (e.key === 't' || e.key === 'T') {
        pauseGame();
        setIsTechLabOpen((v) => !v);
      } else if (e.key === 'k' || e.key === 'K' || e.key === '/') {
        if (e.ctrlKey || e.metaKey || e.key === '/') {
          e.preventDefault();
          pauseGame();
          setIsCommandPaletteOpen((v) => !v);
        }
      } else if (e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V') {
        handleToggleCamera();
      } else if (e.key === 'n' || e.key === 'N') {
        handleCycleDay();
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'g' || e.key === 'G') {
        pauseGame();
        setIsGarageOpen((v) => !v);
      } else if (e.key === 'w' || e.key === 'W') {
        if (e.shiftKey) handleCycleWeather();
      } else if (e.key === 'h' || e.key === 'H') {
        handleRespawn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleCloseModal,
    pauseGame,
    handleToggleCamera,
    handleCycleDay,
    handleCyclePaint,
    handleCycleWeather,
    handleRespawn
  ]);

  return (
    <div
      ref={containerRef}
      className="game fixed inset-0 w-full h-full overflow-hidden select-none bg-[#0D111A] touch-none"
    >
      {/* 1. THREE.JS WEBGPU / WEBGL2 CANVAS */}
      <canvas ref={canvasRef} className="js-canvas w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* 2. FOLIO 2025 VIRTUAL TOUCH BUTTONS */}
      <div className="js-touch-buttons touch-buttons pointer-events-none">
        <div className="js-overlay overlay" />
        <div className="list">
          <button data-name="interact" className="js-button interact">Interact</button>
          <button data-name="unstuck" className="js-button unstuck">Unstuck</button>
          <button data-name="previous" className="js-button previous" />
          <button data-name="next" className="js-button next" />
          <button data-name="open" className="js-button open" />
          <button data-name="close" className="js-button close" />
        </div>
      </div>
      <button className="js-menu-trigger menu-trigger hidden" />
      <button className="js-map-trigger map-trigger hidden" />

      {/* 3. MINIMALIST PLAYGROUND HUD OVERLAY */}
      {/* Top Header Bar */}
      <div className="fixed top-3 left-3 right-3 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: 2D Reader & District Navigation Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/75 border border-white/10 backdrop-blur-md shadow-xl pointer-events-auto">
          <button
            onClick={() => {
              if (onSwitchClassic) onSwitchClassic();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 text-slate-300 hover:text-white text-xs font-mono transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>2D</span>
          </button>

          <button
            onClick={() => {
              pauseGame();
              setIsWorldMapOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/5 hover:border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono transition-all active:scale-95 cursor-pointer"
            title="Tactical World Radar (Press M)"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="hidden sm:inline">RADAR</span>
          </button>

          <div className="w-px h-5 bg-white/10 hidden md:block" />

          {/* District Quick Jumps */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { id: 'landing', label: 'City' },
              { id: 'lab', label: 'AI Lab' },
              { id: 'projects', label: 'Projects' },
              { id: 'career', label: 'Engineering' },
              { id: 'achievements', label: 'Honors' },
              { id: 'altar', label: 'Spaceport' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  handleFastTravel(btn.id);
                  if (btn.id === 'projects') {
                    setTimeout(() => handleOpenLandmark('projects'), 500);
                  } else if (btn.id === 'lab') {
                    setTimeout(() => setIsTechLabOpen(true), 500);
                  } else if (btn.id === 'achievements') {
                    setTimeout(() => setIsAchievementsOpen(true), 500);
                  } else if (btn.id === 'career') {
                    setTimeout(() => handleOpenLandmark('education'), 500);
                  } else if (btn.id === 'altar') {
                    setTimeout(() => handleOpenLandmark('contact'), 500);
                  }
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-all cursor-pointer"
                title={`Fast travel to ${btn.label}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Consolidated Tools & Environment Controls Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/75 border border-white/10 backdrop-blur-md shadow-xl pointer-events-auto">
          {/* Recruiter Fast-Track Dossier */}
          <button
            onClick={() => {
              pauseGame();
              if (onOpenRecruiter) onOpenRecruiter();
              else setIsRecruiterOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold font-mono text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            title="Recruiter Fast-Track Dossier (Press R or D)"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DOSSIER</span>
          </button>

          {/* Nexus AI Assistant */}
          <button
            onClick={() => {
              pauseGame();
              setIsNexusAiOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 hover:border-purple-400 text-purple-200 text-xs font-mono transition-all active:scale-95 cursor-pointer"
            title="Nexus AI Assistant (Press A)"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">AI</span>
          </button>

          {/* Interactive Tech Lab */}
          <button
            onClick={() => {
              pauseGame();
              setIsTechLabOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/30 hover:border-blue-400 text-blue-200 text-xs font-mono transition-all active:scale-95 cursor-pointer"
            title="AI & DSA Tech Lab (Press T)"
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">LAB</span>
          </button>

          <div className="w-px h-5 bg-white/10" />

          {/* Day / Night Toggle */}
          <button
            onClick={handleCycleDay}
            className="p-1.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
            title={`Cycle Lighting: ${dayCycleName.toUpperCase()} (Press N)`}
          >
            {dayCycleName === 'night' ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Weather Toggle */}
          <button
            onClick={handleCycleWeather}
            className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
            title={`Weather: ${weatherName.toUpperCase()} (Shift+W)`}
          >
            <CloudRain className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Vehicle Paint */}
          <button
            onClick={handleCyclePaint}
            className="p-1.5 rounded-xl text-slate-400 hover:text-orange-400 hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
            title={`Vehicle Paint: ${paintName.toUpperCase()} (Press P)`}
          >
            <Palette className="w-4 h-4 text-orange-400" />
          </button>

          {/* Camera View Mode */}
          <button
            onClick={handleToggleCamera}
            className={`p-1.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              isFreeCam
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title={`Camera: ${isFreeCam ? 'FREE ORBIT' : 'THIRD-PERSON ELEVATED'} (Press C/V)`}
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
            title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isSoundMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Achievements Trophy */}
          <button
            onClick={() => {
              pauseGame();
              setIsAchievementsOpen(true);
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
            title="Achievements & Honors"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="fixed bottom-4 left-4 z-40 pointer-events-none">
        <div className="flex items-end gap-3 p-3.5 rounded-2xl bg-[#0F1424]/90 border border-white/10 backdrop-blur-md shadow-2xl">
          {/* Speed Number */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-amber-400/80 tracking-wider">SPEED</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono text-white tracking-tighter">
                {telemetry.speed}
              </span>
              <span className="text-xs font-mono text-slate-400">KM/H</span>
            </div>
          </div>

          <div className="w-px h-9 bg-white/10" />

          {/* Gear Indicator */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-amber-400/80 tracking-wider">GEAR</span>
            <span className="text-xl font-black font-mono text-amber-400">
              {telemetry.gear}
            </span>
          </div>

          <div className="w-px h-9 bg-white/10 hidden sm:block" />

          {/* Top Speed & Odometer */}
          <div className="hidden sm:flex flex-col text-[11px] font-mono text-slate-400 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">MAX:</span>
              <span className="text-white font-bold">{telemetry.topSpeed} KM/H</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">DIST:</span>
              <span className="text-cyan-400 font-bold">{telemetry.odometer} KM</span>
            </div>
          </div>

          <div className="w-px h-9 bg-white/10 hidden md:block" />

          {/* Active Atmospheric & Paint Indicator */}
          <div className="hidden md:flex flex-col text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-tight">
            <span className="text-amber-400/90 font-bold">{dayCycleName} • {weatherName}</span>
            <span className="text-slate-500">CHASSIS: {paintName}</span>
          </div>
        </div>
      </div>

      {/* Bottom Right Respawn & Controls Pill */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => {
            pauseGame();
            setIsCommandPaletteOpen(true);
          }}
          className="p-2.5 rounded-xl bg-[#0F1424]/90 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-white transition-all backdrop-blur-md shadow-lg active:scale-95 cursor-pointer"
          title="Command Palette (Ctrl+K or /)"
        >
          <Search className="w-4 h-4 text-slate-300" />
        </button>

        <button
          onClick={handleRespawn}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F1424]/90 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-all backdrop-blur-md shadow-lg active:scale-95 cursor-pointer text-xs font-mono"
          title="Respawn / Unstuck Car (Press H)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESPAWN</span>
        </button>
      </div>

      {/* Floating Controls Hint (First 9 seconds) */}
      {showControlsHint && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-opacity duration-1000">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/85 border border-amber-500/30 text-slate-200 text-xs font-mono backdrop-blur-md shadow-xl animate-pulse">
            <span className="text-amber-400 font-bold">DRIVE:</span>
            <span>WASD / Arrows</span>
            <span className="text-white/30">•</span>
            <span>SPACE Brake</span>
            <span className="text-white/30">•</span>
            <span>SHIFT Boost</span>
            <span className="text-white/30">•</span>
            <span className="text-cyan-400 font-semibold">[M] Map</span>
            <span className="text-white/30">•</span>
            <span className="text-purple-400 font-semibold">[A] AI</span>
            <span className="text-white/30">•</span>
            <span className="text-amber-400 font-semibold">[R] Dossier</span>
          </div>
        </div>
      )}

      {/* 4. MODALS & SECTION PRESENTERS */}
      {/* District & Project Architecture Overlay */}
      <LandmarkOverlay
        landmarkId={activeLandmark}
        initialProject={selectedProject}
        onClose={handleCloseModal}
      />

      {/* Instant Recruiter Dossier (<10ms load) */}
      <RecruiterModal
        isOpen={isRecruiterOpen}
        onClose={handleCloseModal}
        onOpenProject={() => {
          handleCloseModal();
          setSelectedProject(projects[0]);
          setActiveLandmark('projects');
        }}
        onSwitchClassic={() => {
          handleCloseModal();
          if (onSwitchClassic) onSwitchClassic();
        }}
      />

      {/* Local Grounded RAG AI Assistant */}
      <NexusAiModal
        isOpen={isNexusAiOpen}
        onClose={handleCloseModal}
      />

      {/* Interactive AI & DSA Tech Lab */}
      <TechLabModal
        isOpen={isTechLabOpen}
        onClose={handleCloseModal}
      />

      {/* Tactical Radar Map & Fast Travel */}
      <WorldMap
        isOpen={isWorldMapOpen}
        onClose={handleCloseModal}
        onTeleportTo={handleTeleportToCoords}
      />

      {/* Command Palette Universal Search */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={handleCloseModal}
        onOpenLandmark={handleOpenLandmark}
        onToggleMap={() => {
          pauseGame();
          setIsWorldMapOpen((v) => !v);
        }}
        isClassicMode={false}
        setIsClassicMode={onSwitchClassic}
      />

      {/* Achievements Gallery */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={handleCloseModal}
      />

      {/* Functional Vehicle Garage & Customizer */}
      <GarageModal
        isOpen={isGarageOpen}
        onClose={handleCloseModal}
        currentPaint={paintName}
        onSelectPaint={(paintId) => {
          setPaintName(paintId);
          if (gameRef.current?.world?.visualVehicle?.paints?.changeTo) {
            gameRef.current.world.visualVehicle.paints.changeTo(paintId);
          }
        }}
        dayCycleName={dayCycleName}
        onCycleDay={handleCycleDay}
        weatherName={weatherName}
        onCycleWeather={handleCycleWeather}
        isFreeCam={isFreeCam}
        onToggleCamera={handleToggleCamera}
        onRespawn={handleRespawn}
        telemetry={telemetry}
      />

      {/* Scenic Bench Observation Mode Overlay */}
      {benchScenicData && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg p-5 rounded-3xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl text-white space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                {benchScenicData.title}
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SCENIC OBSERVATION
            </span>
          </div>
          <p className="text-xs text-slate-200 italic font-serif leading-relaxed">
            {benchScenicData.quote}
          </p>
          <p className="text-[11px] text-slate-400 leading-normal">
            {benchScenicData.lore}
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[11px] font-mono">
            <span className="text-cyan-400">Nitish Priyan • Digital Universe</span>
            <button
              onClick={() => {
                if (InteractionManager.getInstance()) {
                  InteractionManager.getInstance().standUpFromBench();
                } else {
                  setBenchScenicData(null);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold active:scale-95 transition-all cursor-pointer shadow-md"
            >
              Stand Up & Drive [ESC]
            </button>
          </div>
        </div>
      )}

      {/* Interaction Feedback Toast */}
      {interactionToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-amber-400/50 backdrop-blur-md shadow-2xl text-white animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <div>
            <p className="text-xs font-bold text-amber-300 font-space">{interactionToast.title}</p>
            {interactionToast.subtitle && (
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">{interactionToast.subtitle}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
