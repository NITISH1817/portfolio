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
import WorldMap from './WorldMap';
import LandmarkOverlay from './modals/LandmarkOverlay';
import IntroScreen from './IntroScreen';
import ClassicPortfolio from './ClassicPortfolio';
import { carAudio } from './CarAudio';

export default function BrunoPortfolio() {
  const [isIntro, setIsIntro] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('thirdperson');
  const [activeLandmarkId, setActiveLandmarkId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [nearLandmark, setNearLandmark] = useState(null);
  const [discoveredLandmarks, setDiscoveredLandmarks] = useState({});
  const [isClassicMode, setIsClassicMode] = useState(false);

  // Initialize frame-rate independent vehicle inputs
  useVehicleController();

  // Handle landmark approach
  const handleLandmarkEnter = (landmark) => {
    setNearLandmark(landmark);
    setDiscoveredLandmarks((prev) => ({ ...prev, [landmark.id]: true }));
  };

  const handleLandmarkLeave = (landmarkId) => {
    setNearLandmark((prev) => (prev && prev.id === landmarkId ? null : prev));
  };

  const handleOpenLandmark = (landmarkId, project = null) => {
    carAudio.playChime();
    setActiveLandmarkId(landmarkId);
    setSelectedProject(project);
    setDiscoveredLandmarks((prev) => ({ ...prev, [landmarkId]: true }));
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

  const discoveredCount = Object.keys(discoveredLandmarks).length;

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-[#171222]">
      {/* 1. Introduction Screen (Matching Reference Screenshot 1) */}
      {isIntro && !isClassicMode && (
        <IntroScreen
          onStart={() => {
            setIsIntro(false);
          }}
        />
      )}

      {/* 2. Overhead World Map (Pressed with 'M' or HUD) */}
      <WorldMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onTeleportTo={(coords) => {
          window.dispatchEvent(new CustomEvent('car-teleport', { detail: coords }));
          carAudio.playChime();
        }}
        discoveredLandmarks={discoveredLandmarks}
      />

      {/* 3. Game HUD (Only visible once started) */}
      {!isIntro && (
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

      {/* 4. Interactive Landmark Glassmorphic Overlay Modal */}
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

      {/* 5. 2D Reader Mode (Document Layout for Accessibility) */}
      {isClassicMode ? (
        <div className="w-full h-full overflow-y-auto bg-slate-950 text-white pt-16">
          <ClassicPortfolio />
        </div>
      ) : (
        /* 6. Full 3D Stylized Game World (Matching Reference Screenshots) */
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance'
          }}
          camera={{ position: [11, 13, 11], fov: 45, near: 0.1, far: 350 }}
        >
          {/* Atmosphere: Dark Purple Sky (#171222), Neon Lights & Fireflies */}
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

              {/* Stylized Island: Warm Orange & Peach Terrain, Racing Track with Red/White Curbs, Cyan Lakes, Wooden Bridges */}
              <StylizedIsland />

              {/* Cherry Blossom Trees & Falling Sakura Petals */}
              <CherryBlossoms />

              {/* Distant Mountains & Stylized Drifting Clouds */}
              <Mountains />
              <Clouds />

              {/* Spawn Gateway Plaza */}
              <SpawnZone />

              {/* 6 Interactive Portfolio Landmarks */}
              <LandmarkAbout
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!discoveredLandmarks['about']}
              />

              <LandmarkSkills
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!discoveredLandmarks['skills']}
              />

              <LandmarkProjects
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                onSelectProject={(proj) => handleOpenLandmark('projects', proj)}
                isDiscovered={!!discoveredLandmarks['projects']}
              />

              <LandmarkExperience
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!discoveredLandmarks['experience']}
              />

              <LandmarkResume
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!discoveredLandmarks['resume']}
              />

              <LandmarkContact
                onEnter={handleLandmarkEnter}
                onLeave={handleLandmarkLeave}
                isDiscovered={!!discoveredLandmarks['contact']}
              />

              {/* Vintage Streetlights, Benches, Rocks, Stunt Ramps & Cones */}
              <Decorations />
            </Physics>

            {/* Dedicated Third-Person Follow Camera System with Intro Transition */}
            <FollowCamera cameraMode={cameraMode} isIntro={isIntro} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
