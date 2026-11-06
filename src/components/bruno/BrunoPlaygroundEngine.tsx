import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';

import Atmosphere from './environment/Atmosphere';
import BrunoPlaygroundWorld from './environment/BrunoPlaygroundWorld';
import BrunoZones from './zones/BrunoZones';
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
    const modes: CameraMode[] = ['thirdperson', 'isometric', 'topdown', 'showcase', 'free'];
    const nextIdx = (modes.indexOf(cameraMode) + 1) % modes.length;
    setCameraMode(modes[nextIdx]);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FFA86B]">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 14.5, 26.5], fov: 46 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12
        }}
      >
        {/* Dynamic Atmosphere: Sunny Warm Day, Soft Shadows, Peach Horizon */}
        <Atmosphere />

        {/* Rapier Physics Simulation World */}
        <Physics gravity={[0, -9.81, 0]}>
          {/* Continuous Warm Orange Playground Terrain, Ramps, Dominoes & Rocks */}
          <BrunoPlaygroundWorld />

          {/* 6 Explorable Portfolio Discovery Destinations */}
          <BrunoZones
            onEnterZone={handleEnterZone}
            onLeaveZone={handleLeaveZone}
            onSelectProject={(proj) => handleOpenLandmark('projects', proj)}
            discoveredLandmarks={discoveredLandmarks}
          />

          {/* Stylized Red-Orange Off-Roader Vehicle */}
          <BrunoVehicle initialPosition={[0, 0.8, 12]} />

          {/* Elevated Isometric Third-Person Follow Camera */}
          <FollowCamera cameraMode={cameraMode} isIntro={false} />
        </Physics>
      </Canvas>

      {/* Floating Modern Toy Game HUD */}
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
            initialProject={selectedProject}
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
