import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { usePhysics } from './PhysicsContext';

export default function CameraController({ cameraMode = 'isometric' }) {
  const { carState } = usePhysics();
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const controlsRef = useRef();

  useEffect(() => {
    if (cameraMode === 'isometric') {
      camera.position.set(16, 18, 16);
      targetLookAt.current.set(0, 0, 0);
      camera.lookAt(0, 0, 0);
    } else if (cameraMode === 'topdown') {
      camera.position.set(0, 36, 0);
      camera.lookAt(0, 0, 0);
    }
  }, [cameraMode, camera]);

  useFrame((state, delta) => {
    if (cameraMode === 'free') return; // Controlled by OrbitControls

    const carPos = carState.current.position;
    const speed = carState.current.speed;

    if (cameraMode === 'isometric') {
      // Dynamic camera pull-back with speed
      const speedOffset = Math.min(speed * 0.25, 6);
      const desiredX = carPos.x + 15 + speedOffset * 0.7;
      const desiredY = carPos.y + 17 + speedOffset * 0.8;
      const desiredZ = carPos.z + 15 + speedOffset * 0.7;

      const lerpSpeed = Math.min(delta * 4.5, 0.15);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, desiredX, lerpSpeed);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, desiredY, lerpSpeed);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, lerpSpeed);

      // Smooth look-at target
      targetLookAt.current.x = THREE.MathUtils.lerp(targetLookAt.current.x, carPos.x, lerpSpeed * 1.5);
      targetLookAt.current.y = THREE.MathUtils.lerp(targetLookAt.current.y, carPos.y + 0.5, lerpSpeed * 1.5);
      targetLookAt.current.z = THREE.MathUtils.lerp(targetLookAt.current.z, carPos.z, lerpSpeed * 1.5);

      camera.lookAt(targetLookAt.current);
    } else if (cameraMode === 'topdown') {
      const lerpSpeed = Math.min(delta * 5, 0.2);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, carPos.x, lerpSpeed);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, carPos.z, lerpSpeed);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 40, lerpSpeed);

      targetLookAt.current.set(carPos.x, 0, carPos.z);
      camera.lookAt(targetLookAt.current);
    }
  });

  if (cameraMode === 'free') {
    return (
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={5}
        maxDistance={70}
      />
    );
  }

  return null;
}

