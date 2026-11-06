import React, { useState, Suspense } from 'react';
import BrunoIntroScreen from './components/bruno/BrunoIntroScreen';
import BrunoLoadingScreen from './components/bruno/BrunoLoadingScreen';
import { carAudio } from './components/bruno/CarAudio';

// Dynamic lazy imports for Tier 2: 3D Engine, Modals & 2D Reader Mode
const BrunoSimonEngine = React.lazy(() => import('./components/bruno/BrunoSimonEngine'));
const ClassicPortfolio = React.lazy(() => import('./components/bruno/ClassicPortfolio'));
const RecruiterModal = React.lazy(() => import('./components/bruno/modals/RecruiterModal'));

export default function App() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [isClassicMode, setIsClassicMode] = useState(false);
  const [isRecruiterModalOpen, setRecruiterModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const isMuted = carAudio.toggleMute();
    setSoundEnabled(!isMuted);
  };

  const handleStartExploring = () => {
    carAudio.unlock();
    setSoundEnabled(true);
    setIsGameActive(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0D111A] text-slate-100">
      {/* 1. GLOBAL RECRUITER FAST-TRACK MODAL */}
      <Suspense fallback={null}>
        <RecruiterModal
          isOpen={isRecruiterModalOpen}
          onClose={() => setRecruiterModalOpen(false)}
          onOpenProject={() => {
            setRecruiterModalOpen(false);
            handleStartExploring();
          }}
          onSwitchClassic={() => {
            setRecruiterModalOpen(false);
            setIsClassicMode(true);
          }}
        />
      </Suspense>

      {/* 2. 2D ACCESSIBLE READER MODE */}
      {isClassicMode ? (
        <div className="w-full h-full overflow-y-auto bg-[#070B14] text-slate-100">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen text-slate-400 font-mono">
                Loading Editorial Portfolio...
              </div>
            }
          >
            <ClassicPortfolio
              onReturn3D={() => {
                setIsClassicMode(false);
                handleStartExploring();
              }}
              onExit={() => setIsClassicMode(false)}
            />
          </Suspense>
        </div>
      ) : !isGameActive ? (
        /* 3. TIER 1: ZERO-WASM 2D STYLIZED INTRO SCREEN (ULTRA-FAST LOAD & PAINT) */
        <BrunoIntroScreen
          onStartExploring={handleStartExploring}
          onOpenRecruiter={() => setRecruiterModalOpen(true)}
          onSwitchClassic={() => setIsClassicMode(true)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      ) : (
        /* 4. TIER 2: 3D THREE.JS & RAPIER WASM PLAYGROUND (DYNAMICALLY STREAMED) */
        <Suspense
          fallback={
            <BrunoLoadingScreen
              onCancel={() => setIsGameActive(false)}
              onSwitchClassic={() => {
                setIsGameActive(false);
                setIsClassicMode(true);
              }}
            />
          }
        >
          <BrunoSimonEngine
            onOpenRecruiter={() => setRecruiterModalOpen(true)}
            onSwitchClassic={() => {
              setIsGameActive(false);
              setIsClassicMode(true);
            }}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        </Suspense>
      )}
    </div>
  );
}
