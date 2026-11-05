import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Navigation, Zap, Compass, ChevronRight } from 'lucide-react';
import { carAudio } from './CarAudio';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [isMuted, setIsMuted] = useState(carAudio.isMuted);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Cinematic timed reveals
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 700);
    const t3 = setTimeout(() => setStage(3), 1200);

    const handleKey = (e: KeyboardEvent) => {
      if (['Enter', 'Space'].includes(e.code)) {
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = carAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleStart = () => {
    carAudio.unlock();
    onStart();
  };

  return (
    <div
      onClick={handleStart}
      className="fixed inset-0 z-50 flex flex-col justify-between p-4 md:p-8 cursor-pointer select-none font-sans pointer-events-auto bg-gradient-to-b from-black/50 via-transparent to-black/60 backdrop-blur-[1px] animate-in fade-in duration-700"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* Identity Badge */}
        <div
          className={`flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all duration-700 ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-orange-500 animate-ping shadow-[0_0_15px_#FF9A45]" />
          <div>
            <div className="text-xs font-black tracking-widest text-white uppercase font-mono">
              NITISH PRIYAN R S
            </div>
            <div className="text-[11px] text-purple-300 font-medium">
              3D Automotive Developer Experience 3.0
            </div>
          </div>
        </div>

        {/* Audio Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-3 bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-lg text-slate-200 transition-all active:scale-95"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-rose-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Center Cinematic Hero Callout */}
      {/* Positioned in the upper region so hero vehicle is 100% visible in the center */}
      <div
        className={`self-center flex flex-col items-center text-center -mt-6 md:-mt-10 pointer-events-none transition-all duration-700 ${
          stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Modern Cyber Glass Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase mb-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> TAP OR CLICK ANYWHERE TO DRIVE
        </div>

        {/* Hero "CLICK TO START" */}
        <h1
          className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-300 drop-shadow-[0_4px_30px_rgba(255,154,69,0.55)] tracking-wide"
          style={{ fontFamily: "'Caveat', 'Patrick Hand', cursive, sans-serif" }}
        >
          CLICK TO START
        </h1>

        <p
          className="text-slate-200 text-base md:text-xl font-medium tracking-wide mt-0.5 drop-shadow max-w-lg"
          style={{ fontFamily: "'Patrick Hand', 'Caveat', cursive, sans-serif" }}
        >
          Start engine, drive the red off-roader, and explore my interactive 3D portfolio!
        </p>

        {/* Animated Curved Arrow Pointing Down toward Vehicle */}
        <div className="mt-1 flex flex-col items-center animate-bounce">
          <svg
            className="w-10 h-14 text-orange-400 drop-shadow-[0_0_15px_#FF9A45]"
            viewBox="0 0 50 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 25 5 C 40 22, 10 40, 25 58" />
            <path d="M 15 48 L 25 60 L 35 48" />
          </svg>
        </div>
      </div>

      {/* Bottom Controls Legend */}
      <div
        className={`self-center bg-slate-900/80 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-slate-700/60 text-xs font-mono text-slate-300 shadow-xl flex items-center gap-3 transition-all duration-700 ${
          stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <span className="text-orange-400 font-bold">[W,A,S,D]</span>
        <span className="hidden sm:inline text-slate-400">Drive</span>
        <span className="text-slate-500">•</span>
        <span className="text-blue-400 font-bold">[SHIFT]</span>
        <span className="hidden sm:inline text-slate-400">Nitro</span>
        <span className="text-slate-500">•</span>
        <span className="text-purple-400 font-bold">[SPACE]</span>
        <span className="hidden sm:inline text-slate-400">Drift / Brake</span>
        <span className="text-slate-500">•</span>
        <span className="text-cyan-400 font-bold">[M]</span>
        <span className="hidden sm:inline text-slate-400">Tactical Map</span>
      </div>
    </div>
  );
}
