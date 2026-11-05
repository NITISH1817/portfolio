import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  Terminal,
  FileText,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  ExternalLink,
  Award,
  Cpu,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import { identityData } from '../../data/portfolio';

interface NexusIntroTerminalProps {
  onStartMission: () => void;
  onOpenRecruiter: () => void;
  onSwitchClassic: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function NexusIntroTerminal({
  onStartMission,
  onOpenRecruiter,
  onSwitchClassic,
  soundEnabled,
  onToggleSound
}: NexusIntroTerminalProps) {
  const [selectedDistrictIndex, setSelectedDistrictIndex] = useState(0);

  const districts = [
    {
      id: 'd1',
      number: '01',
      name: 'NEXUS CENTRAL',
      tag: 'CITY PLAZA & CENTRAL SPIRE',
      desc: 'The central obsidian monolith and civic hub connecting all transport conduits.',
      accent: '#FF8A3D',
      icon: '🏛️'
    },
    {
      id: 'd2',
      number: '02',
      name: 'AI RESEARCH ZONE',
      tag: 'NEURAL NETWORKS & RAG',
      desc: 'Interactive 3D synaptic neural network, Gemini AI, and ChromaDB vector retrieval.',
      accent: '#38BDF8',
      icon: '🧠'
    },
    {
      id: 'd3',
      number: '03',
      name: 'SOFTWARE ENGINEERING',
      tag: 'DISTRIBUTED SYSTEMS & JAVA',
      desc: 'Enterprise SETU gateway, microservice dataflows, and asynchronous queues.',
      accent: '#A855F7',
      icon: '⚡'
    },
    {
      id: 'd4',
      number: '04',
      name: 'PROJECT SHOWCASE',
      tag: '8 ARCHITECTURAL PAVILIONS',
      desc: 'Deep-dive into 8 verified production systems with live specs and GitHub repositories.',
      accent: '#FF70A6',
      icon: '🚀'
    },
    {
      id: 'd5',
      number: '05',
      name: 'ACHIEVEMENT CENTER',
      tag: 'HONORS VAULT & CERTIFICATIONS',
      desc: 'Oracle Java SE 17 Developer, AWS Cloud, SIH 2025, and 250+ LeetCode DSA.',
      accent: '#FBBF24',
      icon: '🏆'
    },
    {
      id: 'd6',
      number: '06',
      name: 'TRANSMISSION CITADEL',
      tag: 'COMMUNICATIONS & RECRUITER',
      desc: 'Direct quantum messaging array and 1-click executive resume dispatch.',
      accent: '#34D399',
      icon: '📡'
    }
  ];

  // Global key listener for Enter or Space to start mission
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onStartMission();
      } else if (e.key === 'r' || e.key === 'R') {
        onOpenRecruiter();
      } else if (e.key === '2') {
        onSwitchClassic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartMission, onOpenRecruiter, onSwitchClassic]);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#080A12] text-[#F1F5F9] font-inter overflow-hidden flex flex-col justify-between selection:bg-[#FF8A3D] selection:text-black">
      {/* Background Cyber Grid Lines & Atmospheric Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep navy & purple nebula radial gradients */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#A855F7]/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#FF8A3D]/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#10182A]/80 rounded-full blur-[160px]" />

        {/* Perspective Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #38BDF8 1px, transparent 1px),
              linear-gradient(to bottom, #A855F7 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            transform: 'perspective(600px) rotateX(40deg) translateY(60px)'
          }}
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#FF8A3D] to-[#A855F7] p-[1px] shadow-[0_0_20px_rgba(255,138,61,0.3)]">
            <div className="w-full h-full bg-[#080A12] rounded-[11px] flex items-center justify-center font-space font-black text-xs text-[#FF8A3D]">
              NX
            </div>
          </div>
          <div>
            <div className="font-space font-extrabold text-sm tracking-wider text-white flex items-center gap-2">
              <span>PORTFOLIO 6.0</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                NEXUS
              </span>
            </div>
            <div className="text-[10px] font-mono text-purple-300/80">
              CYBERNETIC DEVELOPER UNIVERSE // BATCH 2028
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSound}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#10182A] hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>

          <button
            onClick={onSwitchClassic}
            className="px-3 py-1.5 rounded-xl bg-[#10182A] hover:bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Switch to 2D Document Layout"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">2D READER</span>
            <kbd className="hidden md:inline px-1 py-0.2 rounded bg-purple-900/60 text-[9px] text-purple-300">2</kbd>
          </button>

          <button
            onClick={onOpenRecruiter}
            className="px-3.5 py-1.5 rounded-xl bg-linear-to-r from-[#FF8A3D] to-[#A855F7] hover:brightness-110 text-slate-950 font-space font-bold text-xs shadow-[0_0_20px_rgba(255,138,61,0.25)] flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>RECRUITER DOSSIER</span>
            <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-black/30 text-[9px] text-white">R</kbd>
          </button>
        </div>
      </header>

      {/* Main Hero & Mission Initiation Console */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column (7 cols): Hero & Candidate Credentials */}
          <div className="lg:col-span-7 space-y-5">
            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10182A] border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NEXUS CITY PROTOCOL: ONLINE // 6 DISTRICTS LOADED</span>
            </div>

            {/* Candidate Identity Title */}
            <div>
              <h1 className="font-space text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase">
                NITISH PRIYAN <span className="bg-linear-to-r from-[#FF8A3D] via-[#A855F7] to-[#38BDF8] bg-clip-text text-transparent">R S</span>
              </h1>
              <p className="mt-2 text-sm sm:text-lg font-space font-medium text-slate-300">
                Full Stack Developer <span className="text-[#FF8A3D]">•</span> AI/ML Engineer <span className="text-[#A855F7]">•</span> Distributed Systems Architect
              </p>
            </div>

            {/* Verified Academic & Competitive Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-[#10182A]/80 border border-purple-500/25 space-y-0.5">
                <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">INSTITUTION</span>
                <div className="font-space font-bold text-xs text-white truncate">Bannari Amman Inst.</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#10182A]/80 border border-purple-500/25 space-y-0.5">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">DEGREE & CGPA</span>
                <div className="font-space font-bold text-xs text-cyan-300">B.E. CSE • 7.8</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#10182A]/80 border border-purple-500/25 space-y-0.5">
                <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase">ALGORITHMS</span>
                <div className="font-space font-bold text-xs text-emerald-400">250+ LeetCode DSA</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#10182A]/80 border border-purple-500/25 space-y-0.5">
                <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">CREDENTIAL</span>
                <div className="font-space font-bold text-xs text-amber-300">Oracle Java SE 17</div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartMission}
                className="group relative px-6 sm:px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#FF8A3D] via-[#FF70A6] to-[#A855F7] text-slate-950 font-space font-black text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(255,138,61,0.35)] hover:shadow-[0_0_45px_rgba(168,85,247,0.5)] active:scale-95 transition-all flex items-center gap-2.5 overflow-hidden"
              >
                <span className="relative z-10">INITIALIZE NEXUS MISSION</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform" />
                <kbd className="relative z-10 px-1.5 py-0.5 rounded bg-black/25 text-[10px] text-white font-mono">ENTER</kbd>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button
                onClick={onOpenRecruiter}
                className="px-5 py-3.5 rounded-2xl bg-[#10182A] hover:bg-[#18233C] border border-cyan-500/40 text-cyan-300 hover:text-white font-space font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>EXECUTIVE DOSSIER & CV</span>
              </button>
            </div>

            {/* Performance Notice */}
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Zero-WASM Instant Paint Active. 3D WebGL Engine streams dynamically upon mission start.</span>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive 6-District City Hologram Preview */}
          <div className="lg:col-span-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0F1424]/90 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#FF8A3D]" />
                  <span className="font-space font-bold text-xs uppercase tracking-wider text-white">
                    CITY DISTRICT RADAR
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300">
                  {districts[selectedDistrictIndex].number} / 06
                </span>
              </div>

              {/* District Selector Tabs */}
              <div className="grid grid-cols-6 gap-1.5">
                {districts.map((d, idx) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDistrictIndex(idx)}
                    className={`py-2 rounded-xl text-center font-mono text-xs font-bold transition-all ${
                      selectedDistrictIndex === idx
                        ? 'bg-linear-to-b from-purple-500 to-cyan-500 text-slate-950 shadow-md'
                        : 'bg-[#172036] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/40'
                    }`}
                  >
                    {d.number}
                  </button>
                ))}
              </div>

              {/* Selected District Card */}
              <div className="p-4 rounded-2xl bg-[#080A12] border border-cyan-500/30 space-y-2 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{districts[selectedDistrictIndex].icon}</span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                    style={{
                      backgroundColor: `${districts[selectedDistrictIndex].accent}20`,
                      color: districts[selectedDistrictIndex].accent,
                      borderColor: `${districts[selectedDistrictIndex].accent}40`,
                      borderWidth: 1
                    }}
                  >
                    {districts[selectedDistrictIndex].tag}
                  </span>
                </div>

                <h3 className="font-space font-extrabold text-base text-white">
                  {districts[selectedDistrictIndex].name}
                </h3>
                <p className="text-xs text-slate-300 font-inter leading-relaxed">
                  {districts[selectedDistrictIndex].desc}
                </p>
              </div>

              {/* Quick Keybinding Guide */}
              <div className="pt-2 border-t border-purple-500/20 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                <span>[W,A,S,D] Drive Interceptor</span>
                <span>[Shift] Nitro Boost</span>
                <span>[Space] Handbrake Drift</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 border-t border-purple-500/20 gap-3">
        <div className="flex items-center gap-3">
          <span>&copy; 2026 NITISH PRIYAN R S</span>
          <span>•</span>
          <a
            href="https://github.com/NITISH1817"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1"
          >
            github.com/NITISH1817 <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span>PORTFOLIO 6.0 NEXUS</span>
          <span>•</span>
          <span className="text-emerald-400">STATUS: PRODUCTION READY</span>
        </div>
      </footer>
    </div>
  );
}

