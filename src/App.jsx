import React, { useState, Suspense } from 'react';
import NexusIntroTerminal from './components/nexus/NexusIntroTerminal';
import NexusTelemetryLoader from './components/nexus/NexusTelemetryLoader';

// Dynamic lazy import of Tier 2: 3D WebGL & Rapier WASM Engine
const NexusCityEngine = React.lazy(() => import('./components/nexus/NexusCityEngine'));
const ClassicPortfolio = React.lazy(() => import('./components/bruno/ClassicPortfolio'));
const RecruiterModal = React.lazy(() => import('./components/bruno/modals/RecruiterModal'));

export default function App() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [isClassicMode, setIsClassicMode] = useState(false);
  const [isRecruiterModalOpen, setRecruiterModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#080A12] text-slate-100">
      {/* 1. RECRUITER FAST-TRACK MODAL (AVAILABLE FROM ANY VIEW) */}
      <Suspense fallback={null}>
        <RecruiterModal
          isOpen={isRecruiterModalOpen}
          onClose={() => setRecruiterModalOpen(false)}
          onOpenProject={() => {
            setRecruiterModalOpen(false);
            setIsGameActive(true);
          }}
          onSwitchClassic={() => {
            setRecruiterModalOpen(false);
            setIsClassicMode(true);
          }}
        />
      </Suspense>

      {/* 2. 2D ACCESSIBLE READER MODE */}
      {isClassicMode ? (
        <div className="w-full h-full overflow-y-auto bg-slate-950 text-white pt-16">
          {/* Top Return Banner */}
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 px-4 rounded-2xl bg-[#0F1424]/90 border border-purple-500/40 backdrop-blur-md shadow-xl">
            <button
              onClick={() => {
                setIsClassicMode(false);
                setIsGameActive(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF8A3D] to-[#A855F7] text-slate-950 font-space font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              LAUNCH 3D NEXUS CITY &rarr;
            </button>
            <button
              onClick={() => setIsClassicMode(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-all"
            >
              EXIT 2D MODE
            </button>
          </div>

          <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400 font-mono">Loading Document View...</div>}>
            <ClassicPortfolio />
          </Suspense>
        </div>
      ) : !isGameActive ? (
        /* 3. TIER 1: ZERO-WASM 2D CYBERPUNK MISSION TERMINAL (ULTRA-FAST PAINT) */
        <NexusIntroTerminal
          onStartMission={() => setIsGameActive(true)}
          onOpenRecruiter={() => setRecruiterModalOpen(true)}
          onSwitchClassic={() => setIsClassicMode(true)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      ) : (
        /* 4. TIER 2: 3D WEBGL ENGINE & RAPIER WASM (DYNAMICALLY STREAMED) */
        <Suspense
          fallback={
            <NexusTelemetryLoader
              onCancel={() => setIsGameActive(false)}
              onSwitchClassic={() => {
                setIsGameActive(false);
                setIsClassicMode(true);
              }}
            />
          }
        >
          <NexusCityEngine
            onOpenRecruiter={() => setRecruiterModalOpen(true)}
            onSwitchClassic={() => {
              setIsGameActive(false);
              setIsClassicMode(true);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
