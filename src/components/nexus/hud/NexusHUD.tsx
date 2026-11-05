import React, { useState, useEffect } from 'react';
import {
  Compass,
  Camera,
  MapPin,
  Zap,
  Volume2,
  VolumeX,
  FileText,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { vehicleInputs } from '../vehicle/VehicleController';
import { vehicleState } from '../vehicle/NexusInterceptor';

interface NexusHUDProps {
  cameraMode: 'thirdperson' | 'firstperson' | 'cinematic';
  setCameraMode: (mode: 'thirdperson' | 'firstperson' | 'cinematic') => void;
  nearDistrict: { id: string; name: string } | null;
  onOpenRecruiter: () => void;
  onSwitchClassic: () => void;
  onOpenDistrict: (id: string) => void;
}

export default function NexusHUD({
  cameraMode,
  setCameraMode,
  nearDistrict,
  onOpenRecruiter,
  onSwitchClassic,
  onOpenDistrict
}: NexusHUDProps) {
  const [speed, setSpeed] = useState(0);
  const [isNitro, setIsNitro] = useState(false);

  // Poll vehicle speed at 30 FPS for telemetry display
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeed(Math.round(vehicleState.speed * 3.6)); // Convert m/s to km/h
      setIsNitro(vehicleState.isNitroActive);
    }, 33);
    return () => clearInterval(timer);
  }, []);

  const handleNextCamera = () => {
    if (cameraMode === 'thirdperson') setCameraMode('firstperson');
    else if (cameraMode === 'firstperson') setCameraMode('cinematic');
    else setCameraMode('thirdperson');
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none font-mono">
      {/* 1. TOP BAR: Candidate Title, Recruiter Quick-Access & Audio */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#090D1A]/90 border border-purple-500/30 backdrop-blur-md shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="font-space font-extrabold text-xs text-white">NITISH PRIYAN R S</div>
          <span className="text-[10px] text-purple-300 font-mono hidden sm:inline">// B.E. CSE • 7.79 CGPA</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Recruiter Fast-Track Button */}
          <button
            onClick={onOpenRecruiter}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-linear-to-r from-[#FF8A3D] to-[#A855F7] text-slate-950 font-space font-black text-xs shadow-[0_0_20px_rgba(255,138,61,0.3)] active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>RECRUITER DOSSIER</span>
          </button>

          {/* Camera Mode Toggle */}
          <button
            onClick={handleNextCamera}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#090D1A]/90 hover:bg-[#151D33] border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 backdrop-blur-md transition-all"
            title="Cycle Camera (C)"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline uppercase">{cameraMode}</span>
          </button>

          {/* 2D Accessible Reader Mode */}
          <button
            onClick={onSwitchClassic}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#090D1A]/90 hover:bg-purple-950/70 border border-purple-500/30 text-purple-200 text-xs font-mono flex items-center gap-1.5 backdrop-blur-md transition-all"
            title="Switch to 2D Document Layout"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">2D MODE</span>
          </button>
        </div>
      </div>

      {/* 2. PROXIMITY DISTRICT INTERACTION PROMPT */}
      {nearDistrict && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <button
            onClick={() => onOpenDistrict(nearDistrict.id)}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0B0F1E]/95 border border-cyan-400 shadow-[0_0_30px_rgba(56,189,248,0.4)] backdrop-blur-md text-white font-space text-xs font-bold active:scale-95 transition-all"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>APPROACHING: {nearDistrict.name}</span>
            <kbd className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono text-[10px]">
              PRESS [E] OR CLICK
            </kbd>
          </button>
        </div>
      )}

      {/* 3. SPEEDOMETER & NITRO GAUGE (BOTTOM RIGHT) */}
      <div className="absolute bottom-5 right-5 pointer-events-auto">
        <div className="p-3.5 sm:p-4 rounded-3xl bg-[#090D1A]/90 border border-cyan-500/30 backdrop-blur-md shadow-2xl flex items-center gap-4">
          <div>
            <div className="text-[10px] text-purple-300 font-mono font-bold uppercase">VELOCITY</div>
            <div className="font-space font-black text-2xl sm:text-3xl text-white flex items-baseline gap-1">
              <span>{speed}</span>
              <span className="text-[10px] font-mono text-cyan-400 font-normal">KM/H</span>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-slate-700/50" />

          <div>
            <div className="text-[10px] text-purple-300 font-mono font-bold uppercase">DRIVE MODE</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-xs font-space font-extrabold px-2 py-0.5 rounded-md ${
                  isNitro
                    ? 'bg-[#FF8A3D] text-slate-950 shadow-[0_0_15px_#FF8A3D]'
                    : 'bg-[#10182A] text-slate-400 border border-slate-700'
                }`}
              >
                {isNitro ? 'NITRO ACTIVE' : 'SPORT INTERCEPTOR'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MOBILE VIRTUAL TOUCH CONTROLS (VISIBLE ON TOUCH / MOBILE) */}
      <div className="sm:hidden absolute bottom-5 left-5 pointer-events-auto flex items-center gap-2">
        {/* Virtual D-Pad */}
        <div className="grid grid-cols-3 gap-1 p-2 rounded-2xl bg-[#090D1A]/90 border border-cyan-500/30 backdrop-blur-md">
          <div />
          <button
            onTouchStart={() => (vehicleInputs.forward = true)}
            onTouchEnd={() => (vehicleInputs.forward = false)}
            className="w-11 h-11 rounded-xl bg-[#131B32] active:bg-cyan-500 text-white active:text-black flex items-center justify-center font-bold text-lg select-none"
          >
            ▲
          </button>
          <div />

          <button
            onTouchStart={() => (vehicleInputs.left = true)}
            onTouchEnd={() => (vehicleInputs.left = false)}
            className="w-11 h-11 rounded-xl bg-[#131B32] active:bg-cyan-500 text-white active:text-black flex items-center justify-center font-bold text-lg select-none"
          >
            ◀
          </button>
          <button
            onTouchStart={() => (vehicleInputs.backward = true)}
            onTouchEnd={() => (vehicleInputs.backward = false)}
            className="w-11 h-11 rounded-xl bg-[#131B32] active:bg-cyan-500 text-white active:text-black flex items-center justify-center font-bold text-lg select-none"
          >
            ▼
          </button>
          <button
            onTouchStart={() => (vehicleInputs.right = true)}
            onTouchEnd={() => (vehicleInputs.right = false)}
            className="w-11 h-11 rounded-xl bg-[#131B32] active:bg-cyan-500 text-white active:text-black flex items-center justify-center font-bold text-lg select-none"
          >
            ▶
          </button>
        </div>

        {/* Nitro Boost Button */}
        <button
          onTouchStart={() => (vehicleInputs.boost = true)}
          onTouchEnd={() => (vehicleInputs.boost = false)}
          className="w-12 h-24 rounded-2xl bg-linear-to-t from-[#FF8A3D] to-[#A855F7] text-slate-950 font-space font-black text-xs flex flex-col items-center justify-center shadow-lg active:scale-95"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>BOOST</span>
        </button>
      </div>

      {/* 5. DESKTOP DRIVING GUIDE (BOTTOM LEFT) */}
      <div className="hidden sm:block absolute bottom-5 left-5 pointer-events-auto">
        <div className="px-4 py-2.5 rounded-2xl bg-[#090D1A]/85 border border-purple-500/25 backdrop-blur-md text-[11px] font-mono text-slate-300 space-y-0.5">
          <div className="text-[10px] text-purple-300 font-bold uppercase">NEXUS TELEMETRY CONTROLS</div>
          <div className="flex items-center gap-3">
            <span>[W,A,S,D] Drive</span>
            <span>[Shift] Nitro</span>
            <span>[Space] Drift</span>
            <span>[C] Camera</span>
          </div>
        </div>
      </div>
    </div>
  );
}

