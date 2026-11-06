import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, ChevronRight, Monitor, ShieldCheck } from 'lucide-react';

interface BrunoIntroScreenProps {
  onStartExploring: () => void;
  onOpenRecruiter: () => void;
  onSwitchClassic: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function BrunoIntroScreen({
  onStartExploring,
  onOpenRecruiter,
  onSwitchClassic,
  soundEnabled,
  onToggleSound
}: BrunoIntroScreenProps) {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [activeTab, setActiveTab] = useState<'controls' | 'specs'>('controls');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Enter', 'Space'].includes(e.code)) {
        onStartExploring();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartExploring]);

  return (
    <div className="relative w-full h-screen overflow-y-auto bg-[#0D111A] text-slate-100 flex flex-col justify-between p-4 md:p-8 select-none font-sans">
      {/* Background Stylized Isometric Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255, 154, 69, 0.15) 0%, transparent 60%),
            linear-gradient(rgba(168, 85, 247, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(97, 165, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px'
        }}
      />

      {/* TOP STATUS BAR */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 w-full max-w-7xl mx-auto">
        {/* Candidate Identity Pill */}
        <div className="flex items-center gap-3.5 px-4 py-2 rounded-2xl bg-[#171B26]/90 border border-purple-500/30 backdrop-blur-md shadow-lg shadow-purple-950/20">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute inline-flex w-full h-full rounded-full bg-orange-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#FF9A45]" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-white uppercase font-mono">
              NITISH PRIYAN R S
            </div>
            <div className="text-[10px] text-purple-300 font-medium">
              B.E. CSE • CGPA 7.8 • Batch 2028
            </div>
          </div>
        </div>

        {/* Global Controls & Utility Bar */}
        <div className="flex items-center gap-2">
          {/* Audio Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle Audio"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#171B26]/80 hover:bg-[#1E2433] border border-slate-700 text-xs font-mono text-slate-300 transition-all cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            )}
          </button>

          {/* Quality Selector */}
          <div className="flex items-center bg-[#171B26]/80 border border-slate-700 rounded-xl p-1 text-[11px] font-mono text-slate-400">
            {(['high', 'medium', 'low'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`px-2.5 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                  quality === q
                    ? 'bg-linear-to-r from-[#FF9A45] to-[#A855F7] text-slate-950 font-bold shadow-sm'
                    : 'hover:text-slate-200'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* 2D Accessible Reader Mode */}
          <button
            onClick={onSwitchClassic}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-xs font-mono text-slate-200 transition-all cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">2D READER</span>
          </button>
        </div>
      </header>

      {/* HERO CENTERPIECE */}
      <main className="relative z-10 my-auto py-8 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Playable Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-orange-500/15 via-purple-500/15 to-blue-500/15 border border-orange-500/30 text-[11px] font-mono font-semibold tracking-wider text-orange-300 uppercase mb-5 backdrop-blur-sm shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9A45] animate-spin" style={{ animationDuration: '6s' }} />
          INTERACTIVE 3D VEHICLE EXPLORATION PORTFOLIO
        </div>

        {/* Main Title with Signature Orange-Purple-Cyan Gradient */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-space uppercase mb-3 bg-linear-to-r from-[#FF9A45] via-[#FF70A6] to-[#61A5FF] bg-clip-text text-transparent drop-shadow-md">
          NITISH PRIYAN
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-medium text-slate-300 tracking-wide mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>Computer Science Student</span>
          <span className="text-purple-400 font-bold">&bull;</span>
          <span>Software Engineer</span>
          <span className="text-purple-400 font-bold">&bull;</span>
          <span>Java Developer</span>
          <span className="text-purple-400 font-bold">&bull;</span>
          <span>AI/ML Engineer</span>
        </p>

        {/* Core Pillars Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-3xl mb-8 text-xs font-mono">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171B26]/70 border border-slate-800/80 text-left">
            <span className="text-base">🏎️</span>
            <div>
              <div className="text-white font-bold">Rapier Physics</div>
              <div className="text-[10px] text-slate-400">Steering, Jump & Nitro</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171B26]/70 border border-slate-800/80 text-left">
            <span className="text-base">🌄</span>
            <div>
              <div className="text-white font-bold">Sunset Playground</div>
              <div className="text-[10px] text-slate-400">Continuous Warm World</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171B26]/70 border border-slate-800/80 text-left">
            <span className="text-base">🚀</span>
            <div>
              <div className="text-white font-bold">8 Projects</div>
              <div className="text-[10px] text-slate-400">Verified GitHub Repos</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171B26]/70 border border-slate-800/80 text-left">
            <span className="text-base">🎳</span>
            <div>
              <div className="text-white font-bold">Physics Dominoes</div>
              <div className="text-[10px] text-slate-400">Stunt Ramps & Bowling</div>
            </div>
          </div>
        </div>

        {/* PRIMARY CALL-TO-ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          {/* Start Exploring 3D World Button */}
          <button
            id="start-exploring-btn"
            onClick={onStartExploring}
            className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl bg-linear-to-r from-[#FF9A45] via-[#FF70A6] to-[#A855F7] text-slate-950 font-black text-sm tracking-wider uppercase font-space shadow-[0_0_35px_rgba(255,154,69,0.35)] hover:shadow-[0_0_50px_rgba(255,154,69,0.55)] active:scale-95 transition-all cursor-pointer"
          >
            <span>START EXPLORING WORLD</span>
            <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-white text-[9px] font-mono font-bold text-slate-950 shadow">
              PRESS ENTER
            </span>
          </button>

          {/* Recruiter Fast-Track Dossier Button */}
          <button
            id="recruiter-dossier-btn"
            onClick={onOpenRecruiter}
            className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#171B26] hover:bg-[#1E2433] border border-purple-500/40 text-purple-200 font-bold text-xs tracking-wider uppercase font-mono shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>RECRUITER DOSSIER</span>
          </button>
        </div>
      </main>

      {/* BOTTOM CONTROLS & CAPABILITIES TABS */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button
            onClick={() => setActiveTab('controls')}
            className={`text-xs font-mono font-bold uppercase transition-all pb-1 cursor-pointer ${
              activeTab === 'controls'
                ? 'text-[#FF9A45] border-b-2 border-[#FF9A45]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎮 Controls Guide
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-xs font-mono font-bold uppercase transition-all pb-1 cursor-pointer ${
              activeTab === 'specs'
                ? 'text-[#A855F7] border-b-2 border-[#A855F7]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏛️ Explorable Locations
          </button>
        </div>

        {activeTab === 'controls' ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">W / ↑</span>
              <span>Accelerate</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">S / ↓</span>
              <span>Reverse / Brake</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">A / D</span>
              <span>Steer Left / Right</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">SPACE</span>
              <span>Jump & Drift</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">SHIFT</span>
              <span>Nitro Boost</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[10px] font-mono text-slate-300">
            <div className="p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60 text-center">
              <div className="text-orange-400 font-bold">1. DEV HOME</div>
              <div className="text-slate-400">Bio & Goals</div>
            </div>
            <div className="p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60 text-center">
              <div className="text-cyan-400 font-bold">2. SKILL LAB</div>
              <div className="text-slate-400">10 Tech Pillars</div>
            </div>
            <div className="p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60 text-center">
              <div className="text-blue-400 font-bold">3. PROJECTS</div>
              <div className="text-slate-400">8 Pavilions</div>
            </div>
            <div className="p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60 text-center">
              <div className="text-purple-400 font-bold">4. ARENA</div>
              <div className="text-slate-400">Java & LeetCode</div>
            </div>
            <div className="p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60 text-center">
              <div className="text-emerald-400 font-bold">5. EDUCATION</div>
              <div className="text-slate-400">BIT 2028 (7.8)</div>
            </div>
            <div className="p-2 rounded-lg bg-[#141824]/60 border border-slate-800/60 text-center">
              <div className="text-pink-400 font-bold">6. CONTACT</div>
              <div className="text-slate-400">Radio & CV</div>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
