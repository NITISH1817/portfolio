import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vehicleState } from './NexusInterceptor';

interface NexusFollowCameraProps {
  cameraMode?: 'thirdperson' | 'firstperson' | 'cinematic';
}

export default function NexusFollowCamera({
  cameraMode = 'thirdperson'
}: NexusFollowCameraProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 8, -14));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const cinematicAngle = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const vPos = vehicleState.position;
    const vQuat = vehicleState.quaternion;
    const speed = vehicleState.speed;

    const targetPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    if (cameraMode === 'firstperson') {
      // Cockpit / Hood View: Slightly above front windshield
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(vQuat);
      targetPos.copy(vPos).add(new THREE.Vector3(0, 1.1, 0)).add(fwd.clone().multiplyScalar(0.4));
      targetLookAt.copy(targetPos).add(fwd.clone().multiplyScalar(20));
    } else if (cameraMode === 'cinematic') {
      // Orbiting Dramatic Sweep Mode
      cinematicAngle.current += dt * 0.4;
      const radius = 12.0;
      targetPos.set(
        vPos.x + Math.sin(cinematicAngle.current) * radius,
        vPos.y + 4.5,
        vPos.z + Math.cos(cinematicAngle.current) * radius
      );
      targetLookAt.copy(vPos).add(new THREE.Vector3(0, 1.2, 0));
    } else {
      // Default: High-Speed Spring-Damped Chase Camera
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(vQuat);
      // Camera distance stretches slightly at high speeds for a dynamic sense of velocity
      const distance = 8.5 + (speed / 38.0) * 2.2;
      const height = 4.0 + (speed / 38.0) * 0.8;

      targetPos.copy(vPos)
        .sub(fwd.clone().multiplyScalar(distance))
        .add(new THREE.Vector3(0, height, 0));

      targetLookAt.copy(vPos).add(new THREE.Vector3(0, 1.4, 0));
    }

    // Smooth position interpolation
    currentPos.current.lerp(targetPos, 1.0 - Math.exp(-8.0 * dt));
    currentLookAt.current.lerp(targetLookAt, 1.0 - Math.exp(-10.0 * dt));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

