import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Monitor,
  ShieldCheck,
  Compass,
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import HeroBackground3D from './HeroBackground3D';

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Enter', 'Space'].includes(e.code)) {
        onStartExploring();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartExploring]);

  // Background warmup: prefetch 3D engine chunks and core assets during idle time
  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. Preload 3D engine and Rapier physics chunks in background
      import('./BrunoSimonEngine');
      import('../../engine/folio/threejs-override.js');
      import('../../engine/folio/Game/Game.js');
      import('@dimforge/rapier3d');

      // 2. Prefetch key 3D GLB assets into browser disk cache
      const coreAssets = [
        '/folio-assets/respawns/respawnsReferences-compressed.glb',
        '/folio-assets/vehicle/default-compressed.glb',
        '/folio-assets/terrain/terrain-compressed.glb',
        '/folio-assets/playground/playgroundVisual-compressed.glb',
        '/folio-assets/palette.png'
      ];
      coreAssets.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      });
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Subtle mouse tracking for title lighting sheen
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-y-auto bg-[#07090E] text-slate-100 flex flex-col justify-between p-4 md:p-8 select-none font-sans"
    >
      {/* 1. CINEMATIC 3D INTERACTIVE HERO BACKGROUND & KINETIC SCULPTURE */}
      <HeroBackground3D quality={quality} />

      {/* Subtle Ambient Vignette & Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-1 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(7, 9, 14, 0.75) 100%)'
        }}
      />

      {/* 2. TOP STATUS BAR */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 w-full max-w-7xl mx-auto">
        {/* Candidate Identity Pill */}
        <div className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),_0_8px_24px_rgba(0,0,0,0.5)] transition-all hover:border-amber-500/40">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute inline-flex w-full h-full rounded-full bg-amber-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#FF9A45]" />
          </div>
          <div>
            <div className="text-xs font-black tracking-widest text-white uppercase font-mono flex items-center gap-2">
              NITISH PRIYAN R S
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[#FFB370] text-[9px] border border-amber-500/30">
                ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium font-mono">
              B.E. CSE • <span className="text-amber-300 font-bold">CGPA 7.8</span> • Batch 2028
            </div>
          </div>
        </div>

        {/* Global Controls & Utility Bar */}
        <div className="flex items-center gap-2">
          {/* Audio Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle Audio"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/70 text-xs font-mono text-slate-300 transition-all active:scale-95 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline font-bold text-slate-200">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            )}
          </button>

          {/* Quality Selector */}
          <div className="flex items-center bg-slate-900/80 border border-slate-700/70 rounded-xl p-1 text-[11px] font-mono text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {(['high', 'medium', 'low'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`px-2.5 py-1 rounded-lg uppercase transition-all cursor-pointer font-bold ${
                  quality === q
                    ? 'bg-linear-to-r from-[#FF9A45] to-[#A855F7] text-slate-950 shadow-sm'
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600/70 text-xs font-mono text-slate-200 transition-all active:scale-95 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline font-bold">2D READER</span>
          </button>
        </div>
      </header>

      {/* 3. HERO CENTERPIECE WITH DIMENSIONAL METALLIC SCULPTED TITLE */}
      <main className="relative z-10 my-auto py-6 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Playable Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-amber-500/15 via-purple-500/15 to-cyan-500/15 border border-amber-500/40 text-[11px] font-mono font-bold tracking-wider text-amber-200 uppercase mb-4 backdrop-blur-xl shadow-[0_0_20px_rgba(255,154,69,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9A45] animate-spin" style={{ animationDuration: '8s' }} />
          INTERACTIVE 3D VEHICLE EXPLORATION PORTFOLIO
        </div>

        {/* Main Title: High-End Sculpted Dimensional Titanium Typography */}
        <div className="relative mb-3 group">
          <h1
            ref={titleRef}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight font-space uppercase select-none transition-transform duration-200"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 45%, #94A3B8 85%, #64748B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.9))',
              textShadow: '0 1px 0 #cbd5e1, 0 2px 0 #94a3b8, 0 3px 0 #64748b'
            }}
          >
            NITISH PRIYAN
          </h1>

          {/* Subtle Ambient Sheen Underlay */}
          <div
            className="absolute -inset-2 bg-linear-to-r from-amber-500/0 via-amber-500/10 to-purple-500/0 blur-2xl -z-1 opacity-70 pointer-events-none"
            style={{
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
            }}
          />
        </div>

        {/* Subtitle / Verified Engineering Identity */}
        <p className="text-sm sm:text-base md:text-lg font-medium text-slate-300 tracking-wide mb-7 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-mono">
          <span className="text-slate-200">Computer Science Student</span>
          <span className="text-amber-400/80 font-bold">{"•"}</span>
          <span className="text-slate-200">Software Engineer</span>
          <span className="text-amber-400/80 font-bold">{"•"}</span>
          <span className="text-slate-200">Java Developer</span>
          <span className="text-amber-400/80 font-bold">{"•"}</span>
          <span className="text-slate-200">AI/ML Engineer</span>
        </p>

        {/* Core Pillars Feature Grid (Dimensional Glassmorphic Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl mb-8 text-xs font-mono">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/70 border border-slate-700/60 text-left backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),_0_8px_20px_rgba(0,0,0,0.4)] hover:border-amber-500/40 hover:-translate-y-1 transition-all">
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-base shrink-0">
              🏎️
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold leading-tight">Rapier Physics</div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Steering, Jump & Nitro</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/70 border border-slate-700/60 text-left backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),_0_8px_20px_rgba(0,0,0,0.4)] hover:border-amber-500/40 hover:-translate-y-1 transition-all">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-base shrink-0">
              🌄
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold leading-tight">Sunset Playground</div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Continuous Warm World</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/70 border border-slate-700/60 text-left backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),_0_8px_20px_rgba(0,0,0,0.4)] hover:border-cyan-500/40 hover:-translate-y-1 transition-all">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-base shrink-0">
              🚀
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold leading-tight">8 Projects</div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Verified GitHub Repos</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/70 border border-slate-700/60 text-left backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),_0_8px_20px_rgba(0,0,0,0.4)] hover:border-purple-500/40 hover:-translate-y-1 transition-all">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-base shrink-0">
              🎳
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold leading-tight">Physics Dominoes</div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Stunt Ramps & Bowling</div>
            </div>
          </div>
        </div>

        {/* 4. PRIMARY CALL-TO-ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Start Exploring 3D World Button */}
          <button
            id="start-exploring-btn"
            onClick={onStartExploring}
            className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-9 py-4 rounded-2xl bg-linear-to-r from-[#FF7A29] via-[#FF5722] to-[#E11D48] text-white font-black text-sm tracking-wider uppercase font-space shadow-[inset_0_1px_0_rgba(255,255,255,0.35),_0_10px_30px_rgba(255,100,40,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),_0_14px_45px_rgba(255,100,40,0.55)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="drop-shadow-sm">START EXPLORING WORLD</span>
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
            <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/50 shadow-md">
              PRESS ENTER
            </span>
          </button>

          {/* Recruiter Fast-Track Dossier Button */}
          <button
            id="recruiter-dossier-btn"
            onClick={onOpenRecruiter}
            className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-purple-500/40 hover:border-purple-400/70 text-purple-200 font-bold text-xs tracking-wider uppercase font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.08),_0_8px_24px_rgba(0,0,0,0.5)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>RECRUITER DOSSIER</span>
          </button>
        </div>
      </main>

      {/* 5. BOTTOM CONTROLS & CAPABILITIES TABS */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-center gap-6 mb-3">
          <button
            onClick={() => setActiveTab('controls')}
            className={`text-xs font-mono font-bold uppercase transition-all pb-1.5 cursor-pointer flex items-center gap-2 ${
              activeTab === 'controls'
                ? 'text-[#FF9A45] border-b-2 border-[#FF9A45]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎮 Controls Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-xs font-mono font-bold uppercase transition-all pb-1.5 cursor-pointer flex items-center gap-2 ${
              activeTab === 'specs'
                ? 'text-[#A855F7] border-b-2 border-[#A855F7]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🏛️ Explorable Locations</span>
          </button>
        </div>

        {activeTab === 'controls' ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 backdrop-blur-md">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700/80 shadow-[0_2px_0_rgba(2,6,23,0.9)]">
                W / ↑
              </span>
              <span>Accelerate</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 backdrop-blur-md">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700/80 shadow-[0_2px_0_rgba(2,6,23,0.9)]">
                S / ↓
              </span>
              <span>Reverse / Brake</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 backdrop-blur-md">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700/80 shadow-[0_2px_0_rgba(2,6,23,0.9)]">
                A / D
              </span>
              <span>Steer Left / Right</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 backdrop-blur-md">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700/80 shadow-[0_2px_0_rgba(2,6,23,0.9)]">
                SPACE
              </span>
              <span>Jump & Drift</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 backdrop-blur-md">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700/80 shadow-[0_2px_0_rgba(2,6,23,0.9)]">
                SHIFT
              </span>
              <span>Nitro Boost</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[10px] font-mono text-slate-300">
            <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 text-center backdrop-blur-md">
              <div className="text-orange-400 font-bold">1. DEV HOME</div>
              <div className="text-slate-400">Bio & Goals</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 text-center backdrop-blur-md">
              <div className="text-cyan-400 font-bold">2. SKILL LAB</div>
              <div className="text-slate-400">10 Tech Pillars</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 text-center backdrop-blur-md">
              <div className="text-blue-400 font-bold">3. PROJECTS</div>
              <div className="text-slate-400">8 Pavilions</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 text-center backdrop-blur-md">
              <div className="text-purple-400 font-bold">4. ARENA</div>
              <div className="text-slate-400">Java & LeetCode</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 text-center backdrop-blur-md">
              <div className="text-emerald-400 font-bold">5. EDUCATION</div>
              <div className="text-slate-400">BIT 2028 (7.8)</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/70 text-center backdrop-blur-md">
              <div className="text-pink-400 font-bold">6. CONTACT</div>
              <div className="text-slate-400">Radio & CV</div>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
