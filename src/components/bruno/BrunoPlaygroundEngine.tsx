import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import Atmosphere from './environment/Atmosphere';
import BrunoPlaygroundWorld from './environment/BrunoPlaygroundWorld';
import BrunoZones from './zones/BrunoZones';
import Crystals from './collectibles/Crystals';
import BrunoVehicle from './vehicle/BrunoVehicle';
import FollowCamera, { CameraMode } from './FollowCamera';
import BrunoPlaygroundHUD from './hud/BrunoPlaygroundHUD';
import { useVehicleController } from './VehicleController';
import { carAudio } from './CarAudio';
import { useGameStore } from '../../store/gameStore';

// Lazily load large interactive modals
const LandmarkOverlay = React.lazy(() => import('./modals/LandmarkOverlay'));
const RecruiterModal = React.lazy(() => import('./modals/RecruiterModal'));

interface BrunoPlaygroundEngineProps {
  onOpenRecruiter: () => void;
  onSwitchClassic: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function BrunoPlaygroundEngine({
  onOpenRecruiter,
  onSwitchClassic,
  soundEnabled,
  onToggleSound
}: BrunoPlaygroundEngineProps) {
  const [cameraMode, setCameraMode] = useState<CameraMode>('thirdperson');
  const [nearLandmark, setNearLandmark] = useState<any>(null);
  const [activeLandmarkId, setActiveLandmarkId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);

  // Initialize input controller listener
  useVehicleController();

  const discoveredLandmarks = useGameStore((s) => s.discoveredLandmarks);
  const discoverLandmark = useGameStore((s) => s.discoverLandmark);

  // Handle approaching a landmark
  const handleEnterZone = (zone: any) => {
    setNearLandmark(zone);
    discoverLandmark(zone.id);
  };

  const handleLeaveZone = (zoneId: string) => {
    setNearLandmark((prev: any) => (prev && prev.id === zoneId ? null : prev));
  };

  const handleOpenLandmark = (landmarkId: string, project: any = null) => {
    carAudio.playChime();
    setActiveLandmarkId(landmarkId);
    setSelectedProject(project);
    discoverLandmark(landmarkId);
  };

  // Listen for 'E' or 'Enter' keys to open the landmark modal
  useEffect(() => {
    const handleInteractEvent = () => {
      if (nearLandmark && !activeLandmarkId) {
        handleOpenLandmark(nearLandmark.id);
      }
    };
    window.addEventListener('landmark-interact', handleInteractEvent);
    return () => window.removeEventListener('landmark-interact', handleInteractEvent);
  }, [nearLandmark, activeLandmarkId]);

  const cycleCameraMode = () => {
    const modes: CameraMode[] = ['thirdperson', 'showcase', 'isometric', 'topdown', 'cockpit', 'free'];
    const nextIdx = (modes.indexOf(cameraMode) + 1) % modes.length;
    setCameraMode(modes[nextIdx]);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0D111A]">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [3.8, 2.6, 4.6], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
      >
        {/* Dynamic Atmosphere: Day / Sunset / Night, Embers, Lighting & Shadows */}
        <Atmosphere />

        {/* Rapier Physics Simulation World */}
        <Physics gravity={[0, -9.81, 0]}>
          {/* Stylized Island Playground Terrain & Architecture */}
          <BrunoPlaygroundWorld />

          {/* 6 Explorable Portfolio Discovery Zones */}
          <BrunoZones
            onEnterZone={handleEnterZone}
            onLeaveZone={handleLeaveZone}
            onSelectProject={(proj) => handleOpenLandmark('projects', proj)}
            discoveredLandmarks={discoveredLandmarks}
          />

          {/* 7 Collectible Energy Crystals */}
          <Crystals />

          {/* Upgraded Stylized Rapier Physics Off-Roader Vehicle */}
          <BrunoVehicle initialPosition={[0, 1.2, 24]} />

          {/* Spring-Damped Follow Camera with Drag Orbit & Zoom */}
          <FollowCamera cameraMode={cameraMode} isIntro={false} />
        </Physics>
      </Canvas>

      {/* Floating Game HUD */}
      <BrunoPlaygroundHUD
        onOpenRecruiter={() => setIsRecruiterOpen(true)}
        onSwitchClassic={onSwitchClassic}
        nearLandmark={nearLandmark}
        onOpenLandmark={handleOpenLandmark}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        cameraMode={cameraMode}
        onCycleCameraMode={cycleCameraMode}
      />

      {/* Recruiter Fast-Track Modal */}
      <Suspense fallback={null}>
        <RecruiterModal
          isOpen={isRecruiterOpen}
          onClose={() => setIsRecruiterOpen(false)}
          onOpenProject={(proj: any) => {
            setIsRecruiterOpen(false);
            handleOpenLandmark('projects', proj);
          }}
          onSwitchClassic={() => {
            setIsRecruiterOpen(false);
            onSwitchClassic();
          }}
        />
      </Suspense>

      {/* Landmark Portfolio Details Modal */}
      <Suspense fallback={null}>
        {activeLandmarkId && (
          <LandmarkOverlay
            landmarkId={activeLandmarkId}
            selectedProject={selectedProject}
            onClose={() => {
              setActiveLandmarkId(null);
              setSelectedProject(null);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}
