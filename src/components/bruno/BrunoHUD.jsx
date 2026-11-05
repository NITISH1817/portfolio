import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Map,
  Compass,
  RotateCcw,
  FileText,
  Gamepad2,
  Sparkles,
  CheckCircle2,
  Trophy,
  Sun,
  Sunset,
  Moon,
  Zap,
  Lightbulb,
  Radio,
  Target,
  Gem,
  Award,
  Video,
  Eye,
  Search,
  Bot,
  Activity,
  Layers,
  CloudRain
} from 'lucide-react';
import { carAudio } from './CarAudio';
import { vehicleInputs } from './VehicleController';
import { vehicleState } from './VehiclePhysics';
import { MISSIONS, CRYSTALS, ACHIEVEMENTS, useGameStore } from '../../store/gameStore';
import AchievementsModal from './modals/AchievementsModal';
import ResetConfirmModal from './modals/ResetConfirmModal';

export default function BrunoHUD({
  cameraMode,
  setCameraMode,
  isClassicMode,
  setIsClassicMode,
  nearLandmark,
  onInteractLandmark,
  onToggleMap,
  discoveredCount = 0,
  totalLandmarks = 6
}) {
  const [isMuted, setIsMuted] = useState(carAudio.isMuted);
  const [isMobile, setIsMobile] = useState(false);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [distToMission, setDistToMission] = useState(0);
  const [gear, setGear] = useState('D');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Real physics telemetry state
  const [telemetry, setTelemetry] = useState({
    mps: 0,
    accel: 0,
    headingDeg: 0,
    compass: 'N',
    x: 0,
    y: 1.2,
    z: 0,
    stateStr: 'IDLE'
  });

  // Store subscriptions
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const cycleTimeOfDay = useGameStore((s) => s.cycleTimeOfDay);
  const weather = useGameStore((s) => s.weather);
  const cycleWeather = useGameStore((s) => s.cycleWeather);
  const setCommandPaletteOpen = useGameStore((s) => s.setCommandPaletteOpen);
  const setAiAssistantOpen = useGameStore((s) => s.setAiAssistantOpen);
  const setDevDashboardOpen = useGameStore((s) => s.setDevDashboardOpen);
  const setTechLabOpen = useGameStore((s) => s.setTechLabOpen);

  const currentMissionId = useGameStore((s) => s.currentMissionId);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const collectedCrystals = useGameStore((s) => s.collectedCrystals);
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const nitroEnergy = useGameStore((s) => s.nitroEnergy);
  const isNitroActive = useGameStore((s) => s.isNitroActive);
  const isDrifting = useGameStore((s) => s.isDrifting);
  const headlightsOn = useGameStore((s) => s.headlightsOn);
  const toggleHeadlights = useGameStore((s) => s.toggleHeadlights);
  const activeToast = useGameStore((s) => s.activeToast);
  const crystalToast = useGameStore((s) => s.crystalToast);
  const missionToast = useGameStore((s) => s.missionToast);
  const isAchievementsModalOpen = useGameStore((s) => s.isAchievementsModalOpen);
  const setAchievementsModalOpen = useGameStore((s) => s.setAchievementsModalOpen);

  const activeMission = MISSIONS.find((m) => m.id === currentMissionId);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          window.innerWidth < 1024
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Frame loop for speedometer, telemetry, and gear (60 fps)
  useEffect(() => {
    let animId;
    const update = () => {
      const currentSpeed = vehicleState.speed || 0;
      const kmh = Math.round(currentSpeed * 3.6);
      setSpeedKmh(kmh);

      // Dynamic Gear calculation
      if (vehicleState.isNitroActive) {
        setGear('S'); // Sport / Nitro
      } else if (vehicleInputs.backward && kmh > 0.5) {
        setGear('R'); // Reverse
      } else if (kmh === 0 && !vehicleInputs.forward) {
        setGear('P'); // Park
      } else {
        setGear('D'); // Drive
      }

      // Compass & heading
      const deg = vehicleState.headingDegrees || 0;
      const compassDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const compassIdx = Math.round(deg / 45) % 8;
      const compass = compassDirs[compassIdx];

      const stateStr = vehicleState.isNitroActive
        ? 'NITRO BOOST'
        : vehicleState.isDrifting
        ? 'DRIFTING'
        : vehicleInputs.brake || (vehicleInputs.backward && kmh > 0.5)
        ? 'BRAKING'
        : kmh > 1
        ? 'ACCELERATING'
        : 'CRUISING';

      setTelemetry({
        mps: parseFloat(currentSpeed.toFixed(1)),
        accel: parseFloat((vehicleState.acceleration || 0).toFixed(1)),
        headingDeg: deg,
        compass,
        x: parseFloat(vehicleState.position.x.toFixed(1)),
        y: parseFloat(vehicleState.position.y.toFixed(1)),
        z: parseFloat(vehicleState.position.z.toFixed(1)),
        stateStr
      });

      if (activeMission) {
        const carPos = vehicleState.position;
        const dx = carPos.x - activeMission.targetCoords[0];
        const dz = carPos.z - activeMission.targetCoords[2];
        const d = Math.sqrt(dx * dx + dz * dz);
        setDistToMission(Math.round(d));
      }

      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [activeMission]);

  const handleToggleSound = () => {
    const muted = carAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      carAudio.playHorn();
    }
  };

  const handleTouchStart = (key) => {
    if (key === 'forward') vehicleInputs.forward = true;
    if (key === 'backward') vehicleInputs.backward = true;
    if (key === 'left') vehicleInputs.left = true;
    if (key === 'right') vehicleInputs.right = true;
    if (key === 'nitro') window.dispatchEvent(new CustomEvent('nitro-start'));
    if (key === 'brake') window.dispatchEvent(new CustomEvent('brake-start'));
  };

  const handleTouchEnd = (key) => {
    if (key === 'forward') vehicleInputs.forward = false;
    if (key === 'backward') vehicleInputs.backward = false;
    if (key === 'left') vehicleInputs.left = false;
    if (key === 'right') vehicleInputs.right = false;
    if (key === 'nitro') window.dispatchEvent(new CustomEvent('nitro-end'));
    if (key === 'brake') window.dispatchEvent(new CustomEvent('brake-end'));
  };

  const discoveryPercent = Math.min(
    100,
    Math.round(
      ((discoveredCount / totalLandmarks) * 0.4 +
        (completedMissions.length / 6) * 0.35 +
        (collectedCrystals.length / 7) * 0.25) *
        100
    )
  );

  return (
    <div data-hud="true" className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-3 md:p-6 select-none font-sans">
      {/* 1. Top Header Bar with Portfolio 4.0 Engines */}
      <header className="flex items-center justify-between w-full pointer-events-auto gap-2">
        {/* Top Left: Logo & Developer Identity */}
        <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-800/80 text-white">
          <div className="w-3.5 h-3.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_14px_#FF9A45]" />
          <div>
            <div className="font-extrabold text-xs md:text-sm tracking-wider uppercase flex items-center gap-2 font-mono">
              NITISH PRIYAN R S
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-mono font-bold border border-orange-500/30 hidden sm:inline">
                PORTFOLIO 4.0
              </span>
            </div>
            <div className="text-[11px] text-purple-300 hidden sm:block font-inter">
              Full Stack • AI/ML • 3D Universe
            </div>
          </div>
        </div>

        {/* Top Center: Camera Mode Switcher (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800/80 text-xs font-mono">
          <button
            onClick={() => setCameraMode('thirdperson')}
            className={`px-3 py-1 rounded-xl transition-all ${
              cameraMode === 'thirdperson'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            FOLLOW
          </button>
          <button
            onClick={() => setCameraMode('showcase')}
            className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 ${
              cameraMode === 'showcase'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="360 Orbit Showcase"
          >
            <Video className="w-3.5 h-3.5 text-pink-300" /> ORBIT
          </button>
          <button
            onClick={() => setCameraMode('cockpit')}
            className={`px-3 py-1 rounded-xl transition-all ${
              cameraMode === 'cockpit'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="First-Person Cockpit Camera"
          >
            COCKPIT
          </button>
          <button
            onClick={() => setCameraMode('topdown')}
            className={`px-3 py-1 rounded-xl transition-all ${
              cameraMode === 'topdown'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            OVERHEAD
          </button>
        </div>

        {/* Top Right: Tools, AI, Dash, Tech Lab & Weather */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Command Center Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl text-cyan-300 border border-cyan-500/30 shadow-xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
            title="Command Center (Ctrl + K)"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline font-mono text-[10px]">CTRL+K</span>
          </button>

          {/* NEXUS AI Assistant Trigger */}
          <button
            onClick={() => setAiAssistantOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl text-cyan-300 border border-cyan-500/40 shadow-xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
            title="NEXUS AI Portfolio Assistant"
          >
            <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden md:inline text-[10px]">NEXUS AI</span>
          </button>

          {/* Developer Analytics Dashboard Trigger */}
          <button
            onClick={() => setDevDashboardOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl text-pink-300 border border-pink-500/40 shadow-xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
            title="Live Developer Analytics (GitHub & LeetCode)"
          >
            <Activity className="w-4 h-4 text-pink-400" />
            <span className="hidden md:inline text-[10px]">ANALYTICS</span>
          </button>

          {/* Interactive Technology Lab Trigger */}
          <button
            onClick={() => setTechLabOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl text-orange-300 border border-orange-500/40 shadow-xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
            title="Interactive Technology Laboratory"
          >
            <Layers className="w-4 h-4 text-orange-400" />
            <span className="hidden md:inline text-[10px]">TECH LAB</span>
          </button>

          {/* Weather Toggle */}
          <button
            onClick={cycleWeather}
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl text-cyan-400 border border-slate-800/80 shadow-2xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono"
            title={`Weather: ${weather.toUpperCase()} (Click to toggle)`}
          >
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline uppercase text-[10px]">{weather}</span>
          </button>

          {/* Day / Sunset / Night Toggle */}
          <button
            onClick={cycleTimeOfDay}
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl text-amber-400 border border-slate-800/80 shadow-2xl transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
            title={`Time of Day: ${timeOfDay.toUpperCase()} (Click to toggle)`}
          >
            {timeOfDay === 'day' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : timeOfDay === 'sunset' ? (
              <Sunset className="w-4 h-4 text-orange-400" />
            ) : (
              <Moon className="w-4 h-4 text-purple-300" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl text-white border border-slate-800/80 shadow-2xl transition-all active:scale-95"
            title="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
          </button>

          {/* World Map Button */}
          <button
            onClick={onToggleMap}
            className="py-2.5 px-3 md:px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-mono text-xs font-bold shadow-2xl border border-blue-400/30 flex items-center gap-2 transition-all active:scale-95"
            title="Open Tactical Radar Map [M]"
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">MAP</span>
            <span className="text-[10px] opacity-75 font-mono">[M]</span>
          </button>

          {/* Reset Progress Button */}
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800/80 shadow-2xl transition-all active:scale-95"
            title="Reset Game Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Left Side: Active Quest / Mission Tracker & Collectibles Card */}
      <div className="flex flex-col gap-2.5 pointer-events-auto self-start max-w-xs sm:max-w-sm mt-3">
        {/* Mission Card */}
        {activeMission && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-blue-500/40 shadow-2xl text-white space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                MISSION 0{activeMission.order} OF 06
              </span>
              <span className="text-[11px] font-mono font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                {distToMission}m AHEAD
              </span>
            </div>

            <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-1.5 font-space">
              <span>{activeMission.badge}</span>
              {activeMission.title}
            </h3>

            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-sans font-inter">
              {activeMission.description}
            </p>

            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${(completedMissions.length / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Collectibles Mini Counter */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl text-white">
          <div className="flex items-center gap-2">
            <span className="text-base">💎</span>
            <span className="text-xs font-mono font-bold text-purple-300">TECH CRYSTALS</span>
          </div>
          <span className="text-xs font-mono font-extrabold text-amber-400">
            {collectedCrystals.length} / 7
          </span>
        </div>
      </div>

      {/* 3. Center Notification Toasts (Slide Down) */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex flex-col items-center gap-2 max-w-md w-full px-4">
        {activeToast && (
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 to-purple-950/90 border-2 border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.4)] backdrop-blur-xl flex items-center gap-3 animate-in slide-in-from-top-6 duration-300">
            <span className="text-3xl">{activeToast.icon}</span>
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                ACHIEVEMENT UNLOCKED!
              </div>
              <div className="text-sm font-bold text-white font-space">{activeToast.title}</div>
              <div className="text-xs text-amber-200/90 font-inter">{activeToast.description}</div>
            </div>
          </div>
        )}

        {crystalToast && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border border-cyan-400 text-cyan-200 text-xs font-mono font-bold shadow-xl animate-in slide-in-from-top-4">
            {crystalToast}
          </div>
        )}

        {missionToast && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/90 to-purple-950/90 border border-emerald-400 text-emerald-200 text-xs font-mono font-bold shadow-xl animate-in slide-in-from-top-4">
            {missionToast}
          </div>
        )}
      </div>

      {/* 4. Bottom Row: Driving Controls Legend & Telemetry Cluster */}
      <footer className="flex flex-col md:flex-row items-end justify-between w-full pointer-events-auto gap-3">
        {/* Driving Controls Legend */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-slate-800/80 text-xs font-mono shadow-2xl text-slate-300">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-orange-900/50 text-orange-300 font-bold border border-orange-500/40">W, A, S, D</span>
              <span className="text-slate-400 font-inter">Drive & Steer</span>
              <span className="px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 font-bold border border-blue-500/40 ml-2">SHIFT</span>
              <span className="text-slate-400 font-inter">Nitro</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700 ml-2">SPACE</span>
              <span className="text-slate-400 font-inter">Brake</span>
            </div>
            <div className="flex items-center gap-2 pt-0.5 text-[10px]">
              <span><b className="text-white">L</b> Lights</span>
              <span>•</span>
              <span><b className="text-white">M</b> Map</span>
              <span>•</span>
              <span><b className="text-white">E</b> Landmark</span>
              <span>•</span>
              <span><b className="text-cyan-400">Ctrl+K</b> Command Center</span>
            </div>
          </div>
        </div>

        {/* Mobile Virtual Controls */}
        {isMobile && (
          <div className="flex items-end justify-between w-full pointer-events-auto">
            <div className="flex gap-2">
              <button
                onTouchStart={() => handleTouchStart('left')}
                onTouchEnd={() => handleTouchEnd('left')}
                className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-purple-600 text-white font-mono font-black text-xl border border-slate-700 backdrop-blur-md shadow-xl flex items-center justify-center"
              >
                ◀
              </button>
              <button
                onTouchStart={() => handleTouchStart('right')}
                onTouchEnd={() => handleTouchEnd('right')}
                className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-purple-600 text-white font-mono font-black text-xl border border-slate-700 backdrop-blur-md shadow-xl flex items-center justify-center"
              >
                ▶
              </button>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="flex gap-2">
                <button
                  onTouchStart={() => handleTouchStart('nitro')}
                  onTouchEnd={() => handleTouchEnd('nitro')}
                  className="w-12 h-12 rounded-xl text-xs font-mono font-bold flex items-center justify-center border shadow-xl bg-slate-900/80 border-blue-500/40 text-blue-400"
                >
                  <Zap className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleHeadlights}
                  className="w-12 h-12 rounded-xl text-xs font-mono font-bold flex items-center justify-center border shadow-xl bg-slate-900/80 border-slate-700 text-slate-400"
                >
                  <Lightbulb className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onTouchStart={() => handleTouchStart('backward')}
                  onTouchEnd={() => handleTouchEnd('backward')}
                  className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-orange-600 text-white font-mono font-black text-xl border border-slate-700 backdrop-blur-md shadow-xl flex items-center justify-center"
                >
                  ▼
                </button>
                <button
                  onTouchStart={() => handleTouchStart('forward')}
                  onTouchEnd={() => handleTouchEnd('forward')}
                  className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-emerald-600 text-white font-mono font-black text-xl border border-slate-700 backdrop-blur-md shadow-xl flex items-center justify-center"
                >
                  ▲
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Physics Telemetry Cluster */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="p-4 rounded-3xl bg-slate-950/85 backdrop-blur-xl border border-purple-500/40 shadow-2xl flex flex-col items-end gap-2 text-white">
            <div className="flex items-center gap-3">
              {/* Dynamic Gear Indicator Pill */}
              <div className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs font-black">
                <span className={gear === 'S' ? 'text-cyan-400 animate-pulse' : gear === 'R' ? 'text-amber-400' : 'text-purple-300'}>
                  GEAR {gear}
                </span>
              </div>

              {/* Digital Speedometer */}
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                  {speedKmh}
                </span>
                <span className="text-xs font-bold text-purple-400">KM/H</span>
              </div>
            </div>

            {/* Real Physics Sub-telemetry */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 border-t border-purple-500/20 pt-1.5 w-full justify-between">
              <span>{telemetry.mps} m/s</span>
              <span>{telemetry.accel} m/s²</span>
              <span className="text-cyan-400 font-bold">{telemetry.headingDeg}° {telemetry.compass}</span>
              <span className="text-emerald-400 font-bold">[{telemetry.x}, {telemetry.z}]</span>
            </div>

            {/* Nitro Energy Bar */}
            <div className="w-36 md:w-44 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-blue-300">
                <span className="flex items-center gap-1 font-bold">
                  <Zap className="w-3 h-3 text-cyan-400" /> NITRO
                </span>
                <span>{Math.round(nitroEnergy)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-100 ${
                    isNitroActive
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse shadow-[0_0_12px_#38BDF8]'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${nitroEnergy}%` }}
                />
              </div>
            </div>

            {/* Vehicle State Pill */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-200 font-bold">
                {telemetry.stateStr}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {discoveryPercent}%
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setAchievementsModalOpen(false)}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
