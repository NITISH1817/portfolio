import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Map, Compass, RotateCcw, FileText, Gamepad2, Sparkles, CheckCircle2 } from 'lucide-react';
import { carAudio } from './CarAudio';
import { vehicleInputs } from './VehicleController';
import { vehicleState } from './VehiclePhysics';

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

  // Frame loop for speedometer update (60 fps, zero react cascade)
  useEffect(() => {
    let animId;
    const updateSpeed = () => {
      // Speed magnitude in m/s converted to km/h (1 m/s = 3.6 km/h)
      const currentSpeed = vehicleState.speed || 0;
      setSpeedKmh(Math.round(currentSpeed * 3.6));
      animId = requestAnimationFrame(updateSpeed);
    };
    animId = requestAnimationFrame(updateSpeed);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleToggleSound = () => {
    const muted = carAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      carAudio.playHorn();
    }
  };

  const landmarkShortcuts = [
    { name: 'About', id: 'about', coords: [-34, 1.2, 25] },
    { name: 'Skills', id: 'skills', coords: [38, 1.2, -2] },
    { name: 'Projects', id: 'projects', coords: [0, 1.2, -36] },
    { name: 'Experience', id: 'experience', coords: [34, 1.2, 31] },
    { name: 'Resume', id: 'resume', coords: [36, 1.2, -31] },
    { name: 'Contact', id: 'contact', coords: [-42, 1.2, -8] }
  ];

  const handleTeleport = (coords) => {
    window.dispatchEvent(new CustomEvent('car-teleport', { detail: coords }));
    carAudio.playChime();
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-3 md:p-6 select-none font-sans">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between w-full pointer-events-auto gap-2">
        {/* Top Left: Logo & Identity */}
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-purple-500/30 text-white">
          <div className="w-3.5 h-3.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_12px_#FF9A45]" />
          <div>
            <div className="font-extrabold text-xs md:text-sm tracking-wider uppercase flex items-center gap-2 font-mono">
              NITISH PRIYAN R S
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-mono font-bold border border-orange-500/30 hidden sm:inline">
                OFF-ROAD RC
              </span>
            </div>
            <div className="text-[11px] text-purple-300 hidden sm:block">
              Full Stack • AI/ML • Software Developer
            </div>
          </div>
        </div>

        {/* Top Right: Sound, Map, Landmark Shortcuts, Reader Mode */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Quick Landmark Teleport Shortcuts (Desktop) */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/60">
            {landmarkShortcuts.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleTeleport(sc.coords)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                {sc.name}
              </button>
            ))}
          </div>

          {/* Overhead World Map Toggle Button */}
          <button
            onClick={onToggleMap}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-600 hover:to-indigo-600 backdrop-blur-md text-white text-xs font-bold rounded-2xl shadow-lg border border-purple-400/30 transition-all active:scale-95"
            title="Open Overhead World Map (M)"
          >
            <Map className="w-4 h-4 text-pink-300" />
            <span className="hidden sm:inline">Map [M]</span>
          </button>

          {/* Camera View Switcher */}
          <button
            onClick={() => {
              const modes = ['thirdperson', 'isometric', 'topdown', 'free'];
              const nextIdx = (modes.indexOf(cameraMode) + 1) % modes.length;
              setCameraMode(modes[nextIdx]);
            }}
            className="p-2.5 bg-slate-900/85 backdrop-blur-md hover:bg-slate-800 text-slate-200 rounded-2xl shadow-md border border-slate-700/60 transition-all active:scale-95"
            title={`Camera: ${cameraMode.toUpperCase()} (Click to toggle)`}
          >
            <Compass className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2.5 backdrop-blur-md rounded-2xl shadow-md border transition-all active:scale-95 ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
            title={isMuted ? 'Unmute Audio Engine & Horn' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* 2D Reader Mode Switch */}
          <button
            onClick={() => setIsClassicMode(!isClassicMode)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl border border-slate-700 shadow-md transition-all active:scale-95"
            title="Switch to 2D Document View"
          >
            {isClassicMode ? (
              <>
                <Gamepad2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Drive Mode</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reader Mode</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Center Screen: Contextual "PRESS E TO EXPLORE" Prompt */}
      {nearLandmark && (
        <div className="self-center pointer-events-auto animate-in zoom-in-95 duration-150">
          <button
            onClick={() => onInteractLandmark(nearLandmark.id)}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-white border-2 border-purple-500 shadow-[0_0_35px_rgba(168,85,247,0.5)] backdrop-blur-md transition-all active:scale-95"
          >
            <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-xs flex items-center justify-center border border-purple-500/40">
              E
            </span>
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                PORTFOLIO LANDMARK REACHED
              </div>
              <div className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors uppercase tracking-wider">
                PRESS E TO EXPLORE: {nearLandmark.name}
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-pink-400 animate-bounce" />
          </button>
        </div>
      )}

      {/* Footer Area: Bottom Driving Controls & Speedometer Gauge */}
      <footer className="w-full flex flex-col md:flex-row items-end md:items-center justify-between gap-4 pointer-events-auto">
        {/* Bottom Left: Driving Controls Badges */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-700/60 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-white border border-slate-700">
              W A S D
            </span>
            <span className="text-slate-400 font-sans">Drive</span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-white border border-slate-700">
              SPACE
            </span>
            <span className="text-slate-400 font-sans">Brake</span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-white border border-slate-700">
              M
            </span>
            <span className="text-slate-400 font-sans">World Map</span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-white border border-slate-700">
              E
            </span>
            <span className="text-slate-400 font-sans">Interact</span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-white border border-slate-700">
              R
            </span>
            <span className="text-slate-400 font-sans">Reset</span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <button
            onClick={() => carAudio.playHorn()}
            className="px-2 py-0.5 rounded bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-semibold transition-colors"
          >
            🎺 Honk
          </button>
        </div>

        {/* Mobile Virtual Controls */}
        {isMobile && (
          <MobileTouchControls
            onInteract={() => nearLandmark && onInteractLandmark(nearLandmark.id)}
            onToggleMap={onToggleMap}
            hasLandmark={!!nearLandmark}
          />
        )}

        {/* Bottom Right: Real-time Speedometer Gauge & Discovered Landmarks */}
        <div className="flex items-center gap-3">
          {/* Discovered Counter Badge */}
          <div className="hidden sm:flex flex-col items-end bg-slate-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-700/60 shadow-xl text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> DISCOVERED
            </div>
            <div className="text-sm font-black text-white font-mono">
              {discoveredCount} / {totalLandmarks} LANDMARKS
            </div>
          </div>

          {/* Speedometer Gauge Widget */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] flex flex-col items-center justify-center p-2 text-white">
            {/* Speedometer Circular Track */}
            <svg className="absolute inset-0 w-full h-full p-2 -rotate-90" viewBox="0 0 100 100">
              {/* Background Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1E293B"
                strokeWidth="7"
                strokeDasharray="188"
                strokeDashoffset="30"
              />
              {/* Active Rev/Speed Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={speedKmh > 55 ? '#EF4444' : '#61A5FF'}
                strokeWidth="7"
                strokeDasharray="188"
                strokeDashoffset={Math.max(188 - (speedKmh / 90) * 158, 30)}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            </svg>

            {/* Speedometer Number */}
            <div className="relative flex flex-col items-center z-10">
              <span className="text-2xl md:text-3xl font-black font-mono tracking-tighter text-white">
                {speedKmh}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase -mt-0.5">
                KM / H
              </span>
            </div>

            <div className="absolute bottom-1.5 text-[8px] font-mono text-slate-400 uppercase tracking-widest">
              SPEED
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Mobile Virtual Controls with touch buttons and D-Pad
function MobileTouchControls({
  onInteract,
  onToggleMap,
  hasLandmark
}) {
  const handleTouch = (key, state) => {
    vehicleInputs[key] = state;
    if (key === 'horn' && state) carAudio.playHorn();
  };

  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto pointer-events-auto">
      {/* Steering D-Pad */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/60">
        <div />
        <button
          onTouchStart={() => handleTouch('forward', true)}
          onTouchEnd={() => handleTouch('forward', false)}
          className="w-11 h-11 bg-slate-800 active:bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base active:scale-95 transition-all"
        >
          ▲
        </button>
        <div />

        <button
          onTouchStart={() => handleTouch('left', true)}
          onTouchEnd={() => handleTouch('left', false)}
          className="w-11 h-11 bg-slate-800 active:bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base active:scale-95 transition-all"
        >
          ◀
        </button>
        <button
          onTouchStart={() => handleTouch('backward', true)}
          onTouchEnd={() => handleTouch('backward', false)}
          className="w-11 h-11 bg-slate-800 active:bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base active:scale-95 transition-all"
        >
          ▼
        </button>
        <button
          onTouchStart={() => handleTouch('right', true)}
          onTouchEnd={() => handleTouch('right', false)}
          className="w-11 h-11 bg-slate-800 active:bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base active:scale-95 transition-all"
        >
          ▶
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex flex-col gap-1.5 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/60">
        {hasLandmark && (
          <button
            onClick={onInteract}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg animate-pulse"
          >
            INTERACT
          </button>
        )}
        <div className="flex gap-1.5">
          <button
            onClick={onToggleMap}
            className="w-11 h-11 bg-purple-700 text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-md active:scale-95"
            title="World Map"
          >
            MAP
          </button>
          <button
            onClick={() => carAudio.playHorn()}
            className="w-11 h-11 bg-amber-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md active:scale-95"
          >
            🎺
          </button>
          <button
            onClick={() => {
              vehicleInputs.reset = true;
              setTimeout(() => (vehicleInputs.reset = false), 100);
            }}
            className="w-11 h-11 bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        <button
          onTouchStart={() => handleTouch('brake', true)}
          onTouchEnd={() => handleTouch('brake', false)}
          className="w-full h-10 bg-rose-600 active:bg-rose-500 text-white font-bold text-xs tracking-wider rounded-xl flex items-center justify-center active:scale-95 shadow-md"
        >
          BRAKE
        </button>
      </div>
    </div>
  );
}
