import React from 'react';
import { Play, FileText, Compass, Sparkles } from 'lucide-react';
import { carAudio } from './CarAudio';

export default function WelcomeScreen({ onStart, onOpenReader }) {
  const handleStart = () => {
    carAudio.unlock(); // Unlock Web Audio context on user gesture
    onStart();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 md:p-8 text-center shadow-2xl text-slate-100 flex flex-col items-center gap-6">
        {/* Glow badge */}
        <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(255,87,34,0.4)]">
          🚗
        </div>

        <div>
          <span className="text-[11px] font-mono tracking-widest text-orange-400 uppercase font-bold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> IMMERSIVE 3D PORTFOLIO
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-3">
            NITISH PRIYAN R S
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
            Full Stack Developer • AI/ML Engineer • Software Developer
          </p>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-md">
          Welcome to my interactive 3D world. Drive through the island, smash skill blocks, discover projects, and inspect credentials.
        </p>

        {/* Quick Controls Cheat Sheet */}
        <div className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 grid grid-cols-2 gap-2 text-left font-mono">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">
              W A S D
            </span>
            <span className="text-[11px] text-slate-400 font-sans">Drive & Turn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">
              E
            </span>
            <span className="text-[11px] text-slate-400 font-sans">Interact Landmark</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">
              SPACE
            </span>
            <span className="text-[11px] text-slate-400 font-sans">Brake / Horn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">
              R
            </span>
            <span className="text-[11px] text-slate-400 font-sans">Reset Car</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={handleStart}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" /> START EXPLORING
          </button>

          <button
            onClick={onOpenReader}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors"
          >
            <FileText className="w-4 h-4" /> 2D Reader Mode
          </button>
        </div>
      </div>
    </div>
  );
}

