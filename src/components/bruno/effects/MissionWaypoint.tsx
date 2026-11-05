import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MISSIONS, useGameStore } from '../../../store/gameStore';
import { vehicleState } from '../VehiclePhysics';

export default function MissionWaypoint() {
  const currentMissionId = useGameStore((s) => s.currentMissionId);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const completeMission = useGameStore((s) => s.completeMission);

  const activeMission = MISSIONS.find((m) => m.id === currentMissionId);
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !activeMission) return;
    const t = state.clock.getElapsedTime();

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.5;
      const scale = 1.0 + Math.sin(t * 3.0) * 0.15;
      ringRef.current.scale.set(scale, scale, 1);
    }

    if (beaconRef.current) {
      const pulse = 0.5 + Math.sin(t * 2.5) * 0.3;
      (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }

    // Distance check to mission destination
    const targetPos = new THREE.Vector3(...activeMission.targetCoords);
    const dist = vehicleState.position.distanceTo(targetPos);

    if (dist < 8.5 && !completedMissions.includes(activeMission.id)) {
      completeMission(activeMission.id);
    }
  });

  if (!activeMission || completedMissions.includes(activeMission.id)) return null;

  return (
    <group ref={groupRef} position={activeMission.targetCoords}>
      {/* Vertical Cyan Waypoint Beam */}
      <mesh ref={beaconRef} position={[0, 7.5, 0]}>
        <cylinderGeometry args={[0.3, 0.6, 15, 16]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Floating Waypoint Diamond Marker */}
      <mesh position={[0, 5.0, 0]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={3.0}
        />
      </mesh>

      {/* Ground Target Ring */}
      <mesh ref={ringRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.2, 32]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Ambient destination light */}
      <pointLight color="#38BDF8" intensity={3.0} distance={12} />
    </group>
  );
}

