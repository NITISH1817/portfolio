import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { carAudio } from './CarAudio';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [isMuted, setIsMuted] = useState(carAudio.isMuted);

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
      className="fixed inset-0 z-50 flex flex-col justify-between p-4 md:p-8 cursor-pointer select-none font-sans pointer-events-auto"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* Identity Badge */}
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
          <div className="w-3.5 h-3.5 rounded-full bg-orange-500 animate-ping" />
          <div>
            <div className="text-xs font-black tracking-widest text-white uppercase font-mono">
              NITISH PRIYAN R S
            </div>
            <div className="text-[11px] text-purple-300 font-medium">
              3D Interactive Driving Portfolio
            </div>
          </div>
        </div>

        {/* Audio Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-3 bg-slate-900/85 hover:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-lg text-slate-200 transition-all active:scale-95"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-rose-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Upper Area: "CLICK TO START" with Handwritten Typography & Curved Arrow */}
      {/* Positioned in the upper region to keep the vehicle in the center 100% unobstructed */}
      <div className="self-center flex flex-col items-center text-center -mt-8 md:-mt-12 pointer-events-none">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-mono font-bold tracking-widest uppercase mb-2 shadow-[0_0_25px_rgba(168,85,247,0.35)] animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> TAP OR CLICK ANYWHERE
        </div>

        {/* Handwritten "CLICK TO START" matching Bruno Simon Style */}
        <h1
          className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-300 drop-shadow-[0_4px_30px_rgba(255,154,69,0.55)] tracking-wide"
          style={{ fontFamily: "'Caveat', 'Patrick Hand', cursive, sans-serif" }}
        >
          CLICK TO START
        </h1>

        <p
          className="text-slate-300 text-base md:text-xl font-medium tracking-wide mt-1 drop-shadow"
          style={{ fontFamily: "'Patrick Hand', 'Caveat', cursive, sans-serif" }}
        >
          Start engine, drive the RC truck, and discover my developer world!
        </p>

        {/* Handwritten Curved Arrow pointing down toward vehicle */}
        <div className="mt-2 flex flex-col items-center animate-bounce">
          <svg
            className="w-12 h-16 text-orange-400 drop-shadow-[0_0_15px_#FF9A45]"
            viewBox="0 0 50 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Smooth handwritten curved trajectory */}
            <path d="M 25 5 C 40 22, 10 40, 25 58" />
            <path d="M 15 48 L 25 60 L 35 48" />
          </svg>
        </div>
      </div>

      {/* Bottom Hint Bar */}
      <div className="self-center bg-slate-900/80 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-slate-700/60 text-xs font-mono text-slate-300 shadow-xl flex items-center gap-3">
        <span className="text-orange-400 font-bold">[W,A,S,D]</span>
        <span>Drive</span>
        <span className="text-slate-600">•</span>
        <span className="text-orange-400 font-bold">[SPACE]</span>
        <span>Brake</span>
        <span className="text-slate-600">•</span>
        <span className="text-orange-400 font-bold">[M]</span>
        <span>World Map</span>
        <span className="text-slate-600">•</span>
        <span className="text-orange-400 font-bold">[E]</span>
        <span>Interact</span>
      </div>
    </div>
  );
}
