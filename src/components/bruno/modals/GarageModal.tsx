import React from 'react';
import { X, Palette, Camera, Sun, Moon, CloudRain, RotateCcw, Flame, Gauge, Sparkles } from 'lucide-react';

interface GarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPaint: string;
  onSelectPaint: (paintId: string) => void;
  dayCycleName: string;
  onCycleDay: () => void;
  weatherName: string;
  onCycleWeather: () => void;
  isFreeCam: boolean;
  onToggleCamera: () => void;
  onRespawn: () => void;
  telemetry: {
    speed: number;
    gear: string;
    nitro: number;
    topSpeed: number;
    odometer: number;
  };
}

export default function GarageModal({
  isOpen,
  onClose,
  currentPaint,
  onSelectPaint,
  dayCycleName,
  onCycleDay,
  weatherName,
  onCycleWeather,
  isFreeCam,
  onToggleCamera,
  onRespawn,
  telemetry
}: GarageModalProps) {
  if (!isOpen) return null;

  const paints = [
    { id: 'flames', name: 'Inferno Flames', hex: '#FF4500', desc: 'Signature fiery livery' },
    { id: 'abyssal', name: 'Abyssal Blue', hex: '#00F0FF', desc: 'Deep cyber ocean theme' },
    { id: 'red', name: 'Crimson Red', hex: '#EF4444', desc: 'High-contrast sport finish' },
    { id: 'orange', name: 'Sunset Amber', hex: '#F97316', desc: 'Warm dusk gradient' },
    { id: 'white', name: 'Alpine White', hex: '#F8FAFC', desc: 'Clean minimalist matte' },
    { id: 'black', name: 'Cyber Obsidian', hex: '#1E1E2F', desc: 'Stealth night interceptor' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0D0B18] border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.2)] text-white p-5 sm:p-7 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/40">
                  VEHICLE WORKSHOP & GARAGE
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  FOLIO 2025 // RAPIER 3D
                </span>
              </div>
              <h2 className="font-space text-2xl font-extrabold text-white mt-1">
                Vehicle Customizer & Telemetry
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Close Workshop (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Paint & Livery Selection (Functional) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Chassis Livery & Shader Paint</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Active: <strong className="text-amber-400 uppercase">{currentPaint}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {paints.map((paint) => {
              const isSelected = currentPaint === paint.id;
              return (
                <button
                  key={paint.id}
                  onClick={() => onSelectPaint(paint.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-5 h-5 rounded-full border border-white/20 shadow-md"
                      style={{ backgroundColor: paint.hex }}
                    />
                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white font-space">{paint.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{paint.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Environmental & Camera Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Day / Night Cycle */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-3">
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase">Day / Night Cycle</p>
              <p className="text-sm font-bold text-white mt-1 capitalize flex items-center gap-2">
                {dayCycleName === 'day' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
                <span>{dayCycleName} Atmosphere</span>
              </p>
            </div>
            <button
              onClick={onCycleDay}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Cycle Day Preset</span>
            </button>
          </div>

          {/* Weather Simulation */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-3">
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase">Weather Simulation</p>
              <p className="text-sm font-bold text-white mt-1 capitalize flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span>{weatherName} System</span>
              </p>
            </div>
            <button
              onClick={onCycleWeather}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Cycle Weather</span>
            </button>
          </div>

          {/* Camera View Mode */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-3">
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase">Camera Perspective</p>
              <p className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>{isFreeCam ? 'Freecam Orbit' : 'Isometric Third-Person'}</span>
              </p>
            </div>
            <button
              onClick={onToggleCamera}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Toggle Camera (V)</span>
            </button>
          </div>
        </div>

        {/* 3. Live Physics Telemetry & Vehicle Reset */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase">Current Speed</p>
              <p className="text-xl font-bold font-mono text-amber-400">{telemetry.speed} <span className="text-xs text-slate-400">KM/H</span></p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase">Top Speed</p>
              <p className="text-xl font-bold font-mono text-white">{telemetry.topSpeed} <span className="text-xs text-slate-400">KM/H</span></p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase">Odometer</p>
              <p className="text-xl font-bold font-mono text-cyan-300">{telemetry.odometer.toFixed(2)} <span className="text-xs text-slate-400">KM</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onRespawn();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-space text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Respawn / Unstuck Vehicle (R)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

