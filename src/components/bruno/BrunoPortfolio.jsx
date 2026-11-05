import React, { useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics, CuboidCollider } from '@react-three/rapier';
import VehiclePhysics from './VehiclePhysics';
import { useVehicleController } from './VehicleController';
import FollowCamera from './FollowCamera';
import Atmosphere from './environment/Atmosphere';
import StylizedIsland from './environment/StylizedIsland';
import CherryBlossoms from './environment/CherryBlossoms';
import AtmosphericEmbers from './environment/AtmosphericEmbers';
import Mountains from './environment/Mountains';
import Clouds from './environment/Clouds';
import SpawnZone from './zones/SpawnZone';
import LandmarkAbout from './landmarks/LandmarkAbout';
import LandmarkSkills from './landmarks/LandmarkSkills';
import LandmarkProjects from './landmarks/LandmarkProjects';
import LandmarkExperience from './landmarks/LandmarkExperience';
import LandmarkResume from './landmarks/LandmarkResume';
import LandmarkContact from './landmarks/LandmarkContact';
import Decorations from './zones/Decorations';
import BrunoHUD from './BrunoHUD';
import IntroScreen from './IntroScreen';
import Crystals from './collectibles/Crystals';
import TireTracks from './effects/TireTracks';
import TireSmoke from './effects/TireSmoke';
import MissionWaypoint from './effects/MissionWaypoint';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { carAudio } from './CarAudio';
import { useGameStore } from '../../store/gameStore';
import { hasWebGL } from '../../utils';

// Lazy-loaded modal & non-critical UI chunks for fast initial paint
const WorldMap = React.lazy(() => import('./WorldMap'));
const LandmarkOverlay = React.lazy(() => import('./modals/LandmarkOverlay'));
const CommandPalette = React.lazy(() => import('./modals/CommandPalette'));
const NexusAiModal = React.lazy(() => import('./modals/NexusAiModal'));
const DevDashboardModal = React.lazy(() => import('./modals/DevDashboardModal'));
const TechLabModal = React.lazy(() => import('./modals/TechLabModal'));
const RecruiterModal = React.lazy(() => import('./modals/RecruiterModal'));
const ClassicPortfolio = React.lazy(() => import('./ClassicPortfolio'));

export default function BrunoPortfolio() {
  const [isIntro, setIsIntro] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('thirdperson');
  const [activeLandmarkId, setActiveLandmarkId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [nearLandmark, setNearLandmark] = useState(null);
  const [isClassicMode, setIsClassicMode] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    if (!hasWebGL()) {
      setWebglSupported(false);
      setIsClassicMode(true);
    }
  }, []);

  // Sync discovered landmarks & Portfolio 4.0 modals with store
  const storeDiscovered = useGameStore((s) => s.discoveredLandmarks);
  const discoverLandmark = useGameStore((s) => s.discoverLandmark);
  const isCommandPaletteOpen = useGameStore((s) => s.isCommandPaletteOpen);
  const setCommandPaletteOpen = useGameStore((s) => s.setCommandPaletteOpen);
  const isAiAssistantOpen = useGameStore((s) => s.isAiAssistantOpen);
  const setAiAssistantOpen = useGameStore((s) => s.setAiAssistantOpen);
  const isDevDashboardOpen = useGameStore((s) => s.isDevDashboardOpen);
  const setDevDashboardOpen = useGameStore((s) => s.setDevDashboardOpen);
  const isTechLabOpen = useGameStore((s) => s.isTechLabOpen);
  const setTechLabOpen = useGameStore((s) => s.setTechLabOpen);
  const isRecruiterModalOpen = useGameStore((s) => s.isRecruiterModalOpen);
  const setRecruiterModalOpen = useGameStore((s) => s.setRecruiterModalOpen);

  // Initialize frame-rate independent vehicle inputs
  useVehicleController();

  // Handle landmark approach
  const handleLandmarkEnter = (landmark) => {
    setNearLandmark(landmark);
    discoverLandmark(landmark.id);
  };

  const handleLandmarkLeave = (landmarkId) => {
    setNearLandmark((prev) => (prev && prev.id === landmarkId ? null : prev));
  };

  const handleOpenLandmark = (landmarkId, project = null) => {
    carAudio.playChime();
    setActiveLandmarkId(landmarkId);
    setSelectedProject(project);
    discoverLandmark(landmarkId);
  };

  // Listen for keyboard 'E' or 'Enter' or direct open events to explore landmarks
  useEffect(() => {
    const handleInteractEvent = () => {
      if (nearLandmark && !activeLandmarkId && !isMapOpen && !isIntro) {
        handleOpenLandmark(nearLandmark.id);
      }
    };
    const handleDirectOpen = (e) => {
      if (e.detail && !isIntro) {
        handleOpenLandmark(e.detail);
      }
    };
    window.addEventListener('landmark-interact', handleInteractEvent);
    window.addEventListener('open-landmark', handleDirectOpen);
    return () => {
      window.removeEventListener('landmark-interact', handleInteractEvent);
      window.removeEventListener('open-landmark', handleDirectOpen);
    };
  }, [nearLandmark, activeLandmarkId, isMapOpen, isIntro]);

  // Listen for custom modal triggers
  useEffect(() => {
    const handleOpenCmd = () => setCommandPaletteOpen(true);
    const handleOpenAi = () => setAiAssistantOpen(true);
    const handleOpenDash = () => setDevDashboardOpen(true);
    const handleOpenTech = () => setTechLabOpen(true);
    const handleOpenRecruiter = () => setRecruiterModalOpen(true);

    window.addEventListener('open-command-palette', handleOpenCmd);
    window.addEventListener('open-ai-assistant', handleOpenAi);
    window.addEventListener('open-dev-dashboard', handleOpenDash);
    window.addEventListener('open-tech-lab', handleOpenTech);
    window.addEventListener('open-recruiter-modal', handleOpenRecruiter);

    return () => {
      window.removeEventListener('open-command-palette', handleOpenCmd);
      window.removeEventListener('open-ai-assistant', handleOpenAi);
      window.removeEventListener('open-dev-dashboard', handleOpenDash);
      window.removeEventListener('open-tech-lab', handleOpenTech);
      window.removeEventListener('open-recruiter-modal', handleOpenRecruiter);
    };
  }, [setCommandPaletteOpen, setAiAssistantOpen, setDevDashboardOpen, setTechLabOpen, setRecruiterModalOpen]);

  // Listen for 'M' to toggle world map
  useEffect(() => {
    const handleToggleMap = () => {
      if (!isIntro && !activeLandmarkId) {
        setIsMapOpen((prev) => !prev);
      }
    };
    window.addEventListener('toggle-map', handleToggleMap);
    return () => window.removeEventListener('toggle-map', handleToggleMap);
  }, [isIntro, activeLandmarkId]);

  const discoveredCount = Object.keys(storeDiscovered).length;

  const isAnyModalActive = Boolean(
    activeLandmarkId ||
    isMapOpen ||
    isCommandPaletteOpen ||
    isAiAssistantOpen ||
    isDevDashboardOpen ||
    isTechLabOpen ||
    isRecruiterModalOpen
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#171222] select-none">
      {/* 1. Cinematic Intro Screen */}
      {isIntro && (
        <IntroScreen
          onStart={() => {
            setIsIntro(false);
          }}
        />
      )}

      {/* 2. Tactical Overhead Radar & World Map */}
      <Suspense fallback={null}>
        <WorldMap
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onTeleportTo={(coords) => {
            window.dispatchEvent(new CustomEvent('car-teleport', { detail: coords }));
            carAudio.playChime();
          }}
          discoveredLandmarks={storeDiscovered}
        />
      </Suspense>

      {/* 3. Command Palette (Ctrl + K) */}
      <Suspense fallback={null}>
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onOpenLandmark={handleOpenLandmark}
          onToggleMap={() => setIsMapOpen((prev) => !prev)}
          isClassicMode={isClassicMode}
          setIsClassicMode={setIsClassicMode}
        />
      </Suspense>

      {/* 4. NEXUS AI Portfolio Assistant */}
      <Suspense fallback={null}>
        <NexusAiModal
          isOpen={isAiAssistantOpen}
          onClose={() => setAiAssistantOpen(false)}
        />
      </Suspense>

      {/* 5. Live Developer Analytics Dashboard */}
      <Suspense fallback={null}>
        <DevDashboardModal
          isOpen={isDevDashboardOpen}
          onClose={() => setDevDashboardOpen(false)}
        />
      </Suspense>

      {/* 6. Interactive Technology Laboratory */}
      <Suspense fallback={null}>
        <TechLabModal
          isOpen={isTechLabOpen}
          onClose={() => setTechLabOpen(false)}
        />
      </Suspense>

      {/* 6.5. Fast-Track Recruiter Executive Dossier */}
      <Suspense fallback={null}>
        <RecruiterModal
          isOpen={isRecruiterModalOpen}
          onClose={() => setRecruiterModalOpen(false)}
          onOpenProject={(proj) => handleOpenLandmark('projects', proj)}
          onSwitchClassic={() => setIsClassicMode(true)}
        />
      </Suspense>

      {/* 7. Game HUD (Only visible during active gameplay, hidden during modal/map exploration) */}
      {!isIntro && !isAnyModalActive && (
        <BrunoHUD
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
          isClassicMode={isClassicMode}
          setIsClassicMode={setIsClassicMode}
          nearLandmark={nearLandmark}
          onInteractLandmark={(id) => handleOpenLandmark(id)}
          onToggleMap={() => setIsMapOpen((prev) => !prev)}
          discoveredCount={discoveredCount}
          totalLandmarks={6}
        />
      )}

      {/* 8. Interactive Landmark Overlay Modal */}
      {activeLandmarkId && (
        <Suspense fallback={null}>
          <LandmarkOverlay
            landmarkId={activeLandmarkId}
            initialProject={selectedProject}
            onClose={() => {
              setActiveLandmarkId(null);
              setSelectedProject(null);
            }}
          />
        </Suspense>
      )}

      {/* WebGL Fallback Banner if unsupported */}
      {!webglSupported && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-950/90 border border-amber-400 text-amber-200 text-xs font-mono shadow-2xl flex items-center gap-2">
          <span>WebGL acceleration unavailable. Active mode: Accessible 2D Portfolio.</span>
        </div>
      )}

      {/* 9. 2D Reader Mode (Document Layout for Accessibility) */}
      {isClassicMode || !webglSupported ? (
        <div className="w-full h-full overflow-y-auto bg-slate-950 text-white pt-16">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400 font-mono">Loading Document View...</div>}>
            <ClassicPortfolio />
          </Suspense>
        </div>
      ) : (
        /* 10. Full 3D Stylized Game World */
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance'
          }}
          camera={{ position: [11, 13, 11], fov: 45, near: 0.1, far: 350 }}
        >
          {/* Dynamic Atmosphere: Day / Sunset / Night, Rain & Mist */}
          <Atmosphere />

          <Suspense fallback={null}>
            {/* Rapier Physics World */}
            <Physics gravity={[0, -22, 0]}>
              {/* Solid Rapier Ground & Boundary Colliders */}
              <CuboidCollider args={[95, 1, 95]} position={[0, -1, 0]} friction={0.5} restitution={0.05} />
              <CuboidCollider args={[85, 4, 1.5]} position={[0, 2, 85]} />
              <CuboidCollider args={[85, 4, 1.5]} position={[0, 2, -85]} />
              <CuboidCollider args={[1.5, 4, 85]} position={[85, 2, 0]} />
              <CuboidCollider args={[1.5, 4, 85]} position={[-85, 2, 0]} />

              {/* Authoritative Red Off-Road Vehicle Model & Rapier RigidBody */}
              <VehiclePhysics initialPosition={[0, 1.2, 0]} />

              {/* Real-Time Tire Marks & Tire Smoke under wheels */}
              <TireTracks />
              <TireSmoke />

              {/* 7 Collectible Glowing Technology Crystals */}
              <Crystals />

              {/* Active Mission Destination Beacon & Target Ring */}
              <MissionWaypoint />

              {/* Stylized Island: Warm Orange & Peach Terrain, Racing Track, Cyan Lakes */}
              <StylizedIsland />

              {/* Cherry Blossom Trees & Falling Sakura Petals */}
              <CherryBlossoms />

              {/* Floating Atmospheric Cyber Embers & Fireflies */}
              <AtmosphericEmbers />

              {/* Distant Mountains & Stylized Drifting Clouds */}
              <Mountains />
              <Clouds />

              {/* Spawn Gateway Plaza */}
              <SpawnZone />

              {/* 6 Interactive Portfolio Landmarks */}
              <LandmarkAbout
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!storeDiscovered['about']}
              />

              <LandmarkSkills
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!storeDiscovered['skills']}
              />

              <LandmarkProjects
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                onSelectProject={(proj) => handleOpenLandmark('projects', proj)}
                isDiscovered={!!storeDiscovered['projects']}
              />

              <LandmarkExperience
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!storeDiscovered['experience']}
              />

              <LandmarkResume
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!storeDiscovered['resume']}
              />

              <LandmarkContact
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!storeDiscovered['contact']}
              />

              {/* Vintage Streetlights, Benches, Rocks, Stunt Ramps & Cones */}
              <Decorations />
            </Physics>

            {/* Dedicated Third-Person Follow Camera System with Multi-Mode Support */}
            <FollowCamera cameraMode={cameraMode} isIntro={isIntro} />

            {/* Cinematic Post-Processing: Selective Bloom & Subtle Vignette */}
            <EffectComposer multisampling={2} disableNormalPass>
              <Bloom
                luminanceThreshold={0.88}
                luminanceSmoothing={0.25}
                intensity={0.7}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.28} darkness={0.4} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
