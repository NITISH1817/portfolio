import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// 3D City Environment & Districts
import NexusCitySkybox from './environment/NexusCitySkybox';
import NexusCityGrid from './environment/NexusCityGrid';
import District1CentralSpire from './districts/District1CentralSpire';
import District2AiResearch from './districts/District2AiResearch';
import District3SoftwareEng from './districts/District3SoftwareEng';
import District4ProjectShowcase from './districts/District4ProjectShowcase';
import District5AchievementCenter from './districts/District5AchievementCenter';
import District6ContactCenter from './districts/District6ContactCenter';

// Vehicle & Camera
import NexusInterceptor from './vehicle/NexusInterceptor';
import NexusFollowCamera from './vehicle/NexusFollowCamera';
import { useVehicleController } from './vehicle/VehicleController';

// HUD & Modals
import NexusHUD from './hud/NexusHUD';
import { carAudio } from '../bruno/CarAudio';

// Lazy-loaded dialogs
const LandmarkOverlay = React.lazy(() => import('../bruno/modals/LandmarkOverlay'));
const RecruiterModal = React.lazy(() => import('../bruno/modals/RecruiterModal'));
const CommandPalette = React.lazy(() => import('../bruno/modals/CommandPalette'));

interface NexusCityEngineProps {
  onOpenRecruiter: () => void;
  onSwitchClassic: () => void;
}

export default function NexusCityEngine({
  onOpenRecruiter,
  onSwitchClassic
}: NexusCityEngineProps) {
  const [cameraMode, setCameraMode] = useState<'thirdperson' | 'firstperson' | 'cinematic'>('thirdperson');
  const [nearDistrict, setNearDistrict] = useState<{ id: string; name: string } | null>(null);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isRecruiterOpen, setRecruiterOpen] = useState(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Initialize frame-rate independent vehicle inputs
  useVehicleController();

  // District approach handlers
  const handleDistrictEnter = (district: { id: string; name: string }) => {
    setNearDistrict(district);
  };

  const handleDistrictLeave = (id: string) => {
    setNearDistrict((prev) => (prev && prev.id === id ? null : prev));
  };

  const handleOpenDistrictModal = (districtId: string, project: any = null) => {
    carAudio.playChime();
    setActiveModalId(districtId);
    setSelectedProject(project);
  };

  // Keyboard 'E' or 'Enter' to open active landmark
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        if (nearDistrict && !activeModalId && !isRecruiterOpen) {
          handleOpenDistrictModal(nearDistrict.id);
        }
      } else if (e.key === 'c' || e.key === 'C') {
        setCameraMode((prev) =>
          prev === 'thirdperson' ? 'firstperson' : prev === 'firstperson' ? 'cinematic' : 'thirdperson'
        );
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearDistrict, activeModalId, isRecruiterOpen]);

  // Custom event listener for project select from other components
  useEffect(() => {
    const handleOpenLandmark = (e: any) => {
      if (e.detail) {
        handleOpenDistrictModal(e.detail);
      }
    };
    window.addEventListener('open-landmark', handleOpenLandmark);
    return () => window.removeEventListener('open-landmark', handleOpenLandmark);
  }, []);

  const isModalActive = Boolean(activeModalId || isRecruiterOpen || isCommandPaletteOpen);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#080A12] text-white">
      {/* 1. FUTURISTIC COCKPIT HUD */}
      {!isModalActive && (
        <NexusHUD
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
          nearDistrict={nearDistrict}
          onOpenRecruiter={() => setRecruiterOpen(true)}
          onSwitchClassic={onSwitchClassic}
          onOpenDistrict={handleOpenDistrictModal}
        />
      )}

      {/* 2. RECRUITER FAST-TRACK MODAL */}
      <Suspense fallback={null}>
        <RecruiterModal
          isOpen={isRecruiterOpen}
          onClose={() => setRecruiterOpen(false)}
          onOpenProject={(proj) => handleOpenDistrictModal('projects', proj)}
          onSwitchClassic={onSwitchClassic}
        />
      </Suspense>

      {/* 3. LANDMARK SPEC OVERLAY */}
      {activeModalId && (
        <Suspense fallback={null}>
          <LandmarkOverlay
            landmarkId={activeModalId}
            initialProject={selectedProject}
            onClose={() => {
              setActiveModalId(null);
              setSelectedProject(null);
            }}
          />
        </Suspense>
      )}

      {/* 4. COMMAND PALETTE (Ctrl + K) */}
      <Suspense fallback={null}>
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onOpenLandmark={handleOpenDistrictModal}
          onToggleMap={() => {}}
          isClassicMode={false}
          setIsClassicMode={onSwitchClassic}
        />
      </Suspense>

      {/* 5. 3D WEBGL ENGINE & RAPIER PHYSICS CANVAS */}
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
        camera={{ position: [0, 8, -14], fov: 48, near: 0.1, far: 380 }}
      >
        {/* Cinematic Cyber Skybox & Atmospheric Lighting */}
        <NexusCitySkybox />

        <Suspense fallback={null}>
          {/* Rapier Physics World */}
          <Physics gravity={[0, -22, 0]}>
            {/* Multi-Tier Cyber City Grid Ground & Boundaries */}
            <NexusCityGrid />

            {/* NEXUS Cyber Interceptor Sports Vehicle */}
            <NexusInterceptor initialPosition={[0, 1.2, 0]} />

            {/* DISTRICT 1: NEXUS Central Spire & Plaza */}
            <District1CentralSpire
              onEnter={handleDistrictEnter}
              onLeave={handleDistrictLeave}
              onInteract={handleOpenDistrictModal}
            />

            {/* DISTRICT 2: AI Research Zone & Neural Matrix */}
            <District2AiResearch
              onEnter={handleDistrictEnter}
              onLeave={handleDistrictLeave}
              onInteract={handleOpenDistrictModal}
            />

            {/* DISTRICT 3: Software Engineering Distributed Citadel */}
            <District3SoftwareEng
              onEnter={handleDistrictEnter}
              onLeave={handleDistrictLeave}
              onInteract={handleOpenDistrictModal}
            />

            {/* DISTRICT 4: Project Showcase Pavilions */}
            <District4ProjectShowcase
              onEnter={handleDistrictEnter}
              onLeave={handleDistrictLeave}
              onSelectProject={(proj) => handleOpenDistrictModal('projects', proj)}
            />

            {/* DISTRICT 5: Achievement Honors Vault */}
            <District5AchievementCenter
              onEnter={handleDistrictEnter}
              onLeave={handleDistrictLeave}
              onInteract={handleOpenDistrictModal}
            />

            {/* DISTRICT 6: Transmission Citadel & Recruiter Radar */}
            <District6ContactCenter
              onEnter={handleDistrictEnter}
              onLeave={handleDistrictLeave}
              onInteract={handleOpenDistrictModal}
            />
          </Physics>

          {/* Dynamic Follow Camera */}
          <NexusFollowCamera cameraMode={cameraMode} />

          {/* Restrained Cinematic Post-Processing */}
          <EffectComposer multisampling={2} disableNormalPass>
            <Bloom
              luminanceThreshold={0.88}
              luminanceSmoothing={0.25}
              intensity={0.65}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.28} darkness={0.38} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

