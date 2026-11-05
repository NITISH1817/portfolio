import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Monitor } from 'lucide-react';

interface BrunoLoadingScreenProps {
  onCancel: () => void;
  onSwitchClassic: () => void;
}

export default function BrunoLoadingScreen({
  onCancel,
  onSwitchClassic
}: BrunoLoadingScreenProps) {
  const [progress, setProgress] = useState(15);
  const [stageText, setStageText] = useState('Initializing Stylized 3D Scene...');

  useEffect(() => {
    const intervals = [
      setTimeout(() => {
        setProgress(45);
        setStageText('Loading Rapier Physics WASM Core...');
      }, 300),
      setTimeout(() => {
        setProgress(75);
        setStageText('Generating Stylized Terrain, Bridge & Curved Roads...');
      }, 700),
      setTimeout(() => {
        setProgress(92);
        setStageText('Calibrating Vehicle Suspension & Shaders...');
      }, 1100),
      setTimeout(() => {
        setProgress(100);
        setStageText('Ready! Entering World...');
      }, 1500)
    ];

    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D111A] text-slate-100 p-6 select-none font-sans">
      {/* Background Stylized Glow */}
      <div className="absolute inset-0 bg-radial from-purple-950/20 via-[#0D111A] to-[#0D111A] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        {/* Animated Loading Spinner & Car Emoji */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-[#FF9A45] border-r-[#A855F7] animate-spin" />
          <span className="absolute text-2xl animate-bounce">🏎️</span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black font-space uppercase tracking-wider text-white mb-2">
          WARMING UP VEHICLE ENGINE
        </h2>
        <p className="text-xs text-purple-300 font-mono mb-6">
          {stageText}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-3 overflow-hidden p-0.5 mb-3 shadow-inner">
          <div
            className="h-full bg-linear-to-r from-[#FF9A45] via-[#FF70A6] to-[#A855F7] rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,154,69,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Telemetry Details */}
        <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-500 mb-8">
          <span>RAPIER WASM ENGINE</span>
          <span className="text-orange-400 font-bold">{progress}%</span>
          <span>STYLIZED 3D WORLD</span>
        </div>

        {/* Fallback buttons if network is slow */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
          <button
            onClick={onSwitchClassic}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-xs font-mono text-purple-200 transition-all cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            <span>Switch to 2D View</span>
          </button>
        </div>
      </div>
    </div>
  );
}

