import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Camera, ShieldCheck, Monitor, MapPin, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { brunoVehicleState } from '../vehicle/BrunoVehicle';
import { vehicleInputs } from '../VehicleController';
import { carAudio } from '../CarAudio';
import { useGameStore } from '../../../store/gameStore';

interface BrunoPlaygroundHUDProps {
  onOpenRecruiter: () => void;
  onSwitchClassic: () => void;
  nearLandmark: any;
  onOpenLandmark: (landmarkId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  cameraMode: string;
  onCycleCameraMode: () => void;
}

export default function BrunoPlaygroundHUD({
  onOpenRecruiter,
  onSwitchClassic,
  nearLandmark,
  onOpenLandmark,
  soundEnabled,
  onToggleSound,
  cameraMode,
  onCycleCameraMode
}: BrunoPlaygroundHUDProps) {
  const [speedKmh, setSpeedKmh] = useState(0);
  const [driveMode, setDriveMode] = useState('PARK');
  const [isMobile, setIsMobile] = useState(false);

  const nitroEnergy = useGameStore((s) => s.nitroEnergy ?? 100);
  const discoveredLandmarks = useGameStore((s) => s.discoveredLandmarks);
  const collectedCrystals = useGameStore((s) => s.collectedCrystals || []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Frame telemetry updater (20 Hz update rate for high performance)
  useEffect(() => {
    const timer = setInterval(() => {
      const spd = brunoVehicleState.speed;
      const kmh = Math.round(spd * 3.6);
      setSpeedKmh(kmh);

      if (brunoVehicleState.isNitroActive) {
        setDriveMode('NITRO');
      } else if (brunoVehicleState.isDrifting) {
        setDriveMode('DRIFT');
      } else if (vehicleInputs.backward && spd > 1) {
        setDriveMode('REVERSE');
      } else if (spd > 0.8) {
        setDriveMode('DRIVE');
      } else {
        setDriveMode('IDLE');
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const handleRespawn = () => {
    window.dispatchEvent(new CustomEvent('car-teleport', { detail: [0, 0, 36] }));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none font-sans flex flex-col justify-between p-3 md:p-6">
      {/* =========================================================================
          TOP BAR: TELEMETRY (LEFT) & UTILITIES (RIGHT)
      ========================================================================= */}
      <div className="flex items-start justify-between w-full">
        {/* TOP-LEFT: SPEEDOMETER & BOOST BAR */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#111624]/85 backdrop-blur-md p-2.5 px-4 rounded-2xl border border-slate-700/60 shadow-xl">
          {/* Digital Speed Display */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black font-space tracking-tight text-white font-mono">
                {speedKmh}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">KM/H</span>
            </div>
            {/* Drive Mode Indicator */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                driveMode === 'NITRO'
                  ? 'bg-orange-500 text-slate-950 animate-pulse'
                  : driveMode === 'DRIFT'
                  ? 'bg-purple-500 text-white'
                  : driveMode === 'DRIVE'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {driveMode}
              </span>
              <span className="text-[10px] font-mono text-purple-300">
                ZONE: {nearLandmark ? nearLandmark.name : 'ROADWAY'}
              </span>
            </div>
          </div>

          {/* Boost Energy Vertical Gauge */}
          <div className="h-10 w-2.5 bg-slate-900 border border-slate-700 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
            <div
              className="w-full bg-gradient-to-t from-orange-500 to-purple-500 rounded-full transition-all duration-100"
              style={{ height: `${nitroEnergy}%` }}
            />
          </div>
        </div>

        {/* TOP-RIGHT: ACTION BUTTONS */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="p-2.5 rounded-xl bg-[#111624]/85 hover:bg-[#1A2238] border border-slate-700 text-slate-200 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Camera Cycle */}
          <button
            onClick={onCycleCameraMode}
            aria-label="Cycle Camera"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111624]/85 hover:bg-[#1A2238] border border-slate-700 text-xs font-mono text-slate-300 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase">{cameraMode}</span>
          </button>

          {/* Respawn / Reset Button */}
          <button
            onClick={handleRespawn}
            aria-label="Respawn Vehicle"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111624]/85 hover:bg-[#1A2238] border border-slate-700 text-xs font-mono text-slate-300 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">RESET (R)</span>
          </button>

          {/* Recruiter Fast-Track Dossier */}
          <button
            onClick={onOpenRecruiter}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF9A45] to-[#A855F7] text-slate-950 font-bold font-space text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span className="hidden md:inline">RECRUITER DOSSIER</span>
            <span className="md:hidden">CV</span>
          </button>

          {/* 2D View Switch */}
          <button
            onClick={onSwitchClassic}
            className="p-2.5 rounded-xl bg-slate-800/85 hover:bg-slate-700 border border-slate-600 text-slate-300 shadow-lg transition-all active:scale-95 cursor-pointer"
            title="Switch to 2D Document View"
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          CENTER PROXIMITY INTERACTION BANNER
      ========================================================================= */}
      {nearLandmark && (
        <div className="pointer-events-auto self-center animate-bounce mb-6">
          <button
            onClick={() => onOpenLandmark(nearLandmark.id)}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF9A45] via-[#FF70A6] to-[#A855F7] text-slate-950 font-black font-space text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(255,154,69,0.5)] active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>OPEN {nearLandmark.name}</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 text-white text-[10px] font-mono font-bold">
              [ENTER]
            </span>
          </button>
        </div>
      )}

      {/* =========================================================================
          BOTTOM BAR: MOBILE CONTROLS (IF ON MOBILE) & RADAR MAP (RIGHT)
      ========================================================================= */}
      <div className="flex items-end justify-between w-full">
        {/* MOBILE VIRTUAL CONTROLS */}
        {isMobile ? (
          <div className="pointer-events-auto flex items-end justify-between w-full">
            {/* Steering D-Pad */}
            <div className="grid grid-cols-3 gap-1 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-slate-700/50">
              <div />
              <button
                onTouchStart={() => { vehicleInputs.forward = true; }}
                onTouchEnd={() => { vehicleInputs.forward = false; }}
                className="w-12 h-12 rounded-xl bg-slate-800/90 active:bg-orange-500 border border-slate-600 flex items-center justify-center text-white"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <div />

              <button
                onTouchStart={() => { vehicleInputs.left = true; }}
                onTouchEnd={() => { vehicleInputs.left = false; }}
                className="w-12 h-12 rounded-xl bg-slate-800/90 active:bg-orange-500 border border-slate-600 flex items-center justify-center text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onTouchStart={() => { vehicleInputs.backward = true; }}
                onTouchEnd={() => { vehicleInputs.backward = false; }}
                className="w-12 h-12 rounded-xl bg-slate-800/90 active:bg-orange-500 border border-slate-600 flex items-center justify-center text-white"
              >
                <ArrowDown className="w-6 h-6" />
              </button>
              <button
                onTouchStart={() => { vehicleInputs.right = true; }}
                onTouchEnd={() => { vehicleInputs.right = false; }}
                className="w-12 h-12 rounded-xl bg-slate-800/90 active:bg-orange-500 border border-slate-600 flex items-center justify-center text-white"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Action Buttons (Nitro & Jump/Brake) */}
            <div className="flex flex-col gap-2">
              <button
                onTouchStart={() => { vehicleInputs.nitro = true; }}
                onTouchEnd={() => { vehicleInputs.nitro = false; }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 active:scale-95 flex items-center justify-center text-slate-950 font-black font-space text-xs shadow-lg"
              >
                NITRO
              </button>
              <button
                onTouchStart={() => { vehicleInputs.brake = true; }}
                onTouchEnd={() => { vehicleInputs.brake = false; }}
                className="w-14 h-14 rounded-2xl bg-slate-800 active:bg-red-500 border border-slate-600 flex items-center justify-center text-white font-bold font-mono text-xs shadow-lg"
              >
                JUMP
              </button>
            </div>
          </div>
        ) : (
          /* DESKTOP EXPLORATION PROGRESS BADGE */
          <div className="pointer-events-auto flex items-center gap-3 bg-[#111624]/85 backdrop-blur-md p-2.5 px-4 rounded-2xl border border-slate-700/60 shadow-xl">
            <MapPin className="w-4 h-4 text-orange-400" />
            <div className="text-xs font-mono">
              <div className="text-slate-200 font-bold">
                EXPLORATION: {Object.keys(discoveredLandmarks || {}).length} / 6 LOCATIONS
              </div>
              <div className="text-[10px] text-purple-300">
                CRYSTALS: {collectedCrystals.length} / 7 COLLECTED
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP BOTTOM-RIGHT MINIMAP RADAR */}
        {!isMobile && (
          <div className="pointer-events-auto relative w-32 h-32 rounded-2xl bg-[#0B0F19]/90 border border-purple-500/40 backdrop-blur-md overflow-hidden p-1 shadow-xl flex items-center justify-center">
            {/* Radar Grid Circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-24 h-24 rounded-full border border-purple-400" />
              <div className="w-16 h-16 rounded-full border border-orange-400 absolute" />
            </div>

            {/* Zone Beacon Dots on Radar */}
            <div className="absolute w-2 h-2 rounded-full bg-orange-400" style={{ top: '80%', left: '50%' }} title="Developer Home" />
            <div className="absolute w-2 h-2 rounded-full bg-cyan-400" style={{ top: '60%', left: '80%' }} title="Skill Lab" />
            <div className="absolute w-2 h-2 rounded-full bg-blue-400" style={{ top: '30%', left: '25%' }} title="Projects Exhibition" />
            <div className="absolute w-2 h-2 rounded-full bg-purple-400" style={{ top: '25%', left: '75%' }} title="Achievement Arena" />
            <div className="absolute w-2 h-2 rounded-full bg-emerald-400" style={{ top: '45%', left: '80%' }} title="Education Center" />
            <div className="absolute w-2 h-2 rounded-full bg-pink-400" style={{ top: '80%', left: '25%' }} title="Contact Station" />

            {/* Player Car Center Pointer */}
            <div className="relative w-3 h-3 rounded-full bg-white border-2 border-orange-500 shadow-[0_0_8px_#FF9A45]" />
          </div>
        )}
      </div>
    </div>
  );
}
