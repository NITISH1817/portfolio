import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { vehicleState } from './VehiclePhysics';

interface FollowCameraProps {
  cameraMode?: 'thirdperson' | 'isometric' | 'topdown' | 'free';
  isIntro?: boolean;
}

export default function FollowCamera({
  cameraMode = 'thirdperson',
  isIntro = false
}: FollowCameraProps) {
  const { camera } = useThree();

  // Internal smooth camera trackers
  const currentCamPos = useRef(new THREE.Vector3(3.6, 2.6, 4.4));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.75, 0));
  const smoothHeading = useRef(0);
  const wasIntro = useRef(isIntro);

  useEffect(() => {
    // Initial camera placement for opening scene
    if (isIntro) {
      currentCamPos.current.set(3.6, 2.6, 4.4);
      currentLookAt.current.set(0, 0.75, 0);
      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);
    }
  }, [camera, isIntro]);

  useFrame((state, delta) => {
    // If user explicitly switched to free orbit mode in HUD
    if (cameraMode === 'free') return;

    const dt = Math.min(delta, 0.05);

    // =========================================================================
    // 1. OPENING SCENE CAM: Dedicated Cinematic Composition (Ref Screenshot 1)
    // Vehicle occupies ~30% of main visual frame, centered on circular island
    // =========================================================================
    if (isIntro) {
      const t = state.clock.elapsedTime * 0.12;
      // Gentle subtle breathing motion around the vehicle
      const introX = Math.sin(t) * 1.0 + 3.8;
      const introZ = Math.cos(t) * 1.0 + 4.2;
      const introY = 2.7;

      currentCamPos.current.lerp(new THREE.Vector3(introX, introY, introZ), 0.05);
      currentLookAt.current.lerp(new THREE.Vector3(0, 0.75, 0), 0.08);

      state.camera.position.copy(currentCamPos.current);
      state.camera.lookAt(currentLookAt.current);
      wasIntro.current = true;
      return;
    }

    const carPos = vehicleState.position;
    const carSpeed = vehicleState.speed;
    const carHeading = vehicleState.heading;
    const forward = vehicleState.forward;

    // Handle seamless transition fly-in when transitioning out of Intro
    if (wasIntro.current) {
      wasIntro.current = false;
      smoothHeading.current = carHeading;
    }

    // TOP-DOWN TACTICAL CAMERA MODE
    if (cameraMode === 'topdown') {
      const topSpeedFactor = 1.0 - Math.exp(-6.0 * dt);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, carPos.x, topSpeedFactor);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, carPos.z, topSpeedFactor);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 42.0, topSpeedFactor);
      camera.lookAt(carPos.x, 0, carPos.z);
      return;
    }

    // ISOMETRIC VANTAGE MODE
    if (cameraMode === 'isometric') {
      const isoOffset = 16.0;
      const isoHeight = 18.0;
      const desiredX = carPos.x + isoOffset;
      const desiredY = carPos.y + isoHeight;
      const desiredZ = carPos.z + isoOffset;

      const t = 1.0 - Math.exp(-4.5 * dt);
      currentCamPos.current.lerp(new THREE.Vector3(desiredX, desiredY, desiredZ), t);
      currentLookAt.current.lerp(new THREE.Vector3(carPos.x, carPos.y + 1.0, carPos.z), t * 1.5);

      state.camera.position.copy(currentCamPos.current);
      state.camera.lookAt(currentLookAt.current);
      return;
    }

    // =========================================================================
    // 2. DEDICATED THIRD-PERSON FOLLOW CAMERA (PRIMARY GAMEPLAY)
    // - Follows actual Rapier physics body
    // - Positions car in lower-middle of viewport
    // - Reveals road and scenery ahead
    // - Smooth delta-time aware rotation, no jitter, no clipping
    // =========================================================================

    // 1. Smoothly interpolate heading angle without angular wrap jumping
    const angleDiff = Math.atan2(
      Math.sin(carHeading - smoothHeading.current),
      Math.cos(carHeading - smoothHeading.current)
    );
    const headingSmoothFactor = 1.0 - Math.exp(-4.8 * dt);
    smoothHeading.current += angleDiff * headingSmoothFactor;

    // 2. Dynamic pullback based on vehicle speed
    const baseDistance = 9.8;
    const speedPullback = Math.min(carSpeed * 0.12, 3.2);
    const totalDistance = baseDistance + speedPullback;
    const cameraHeight = 4.8;

    // 3. Compute position directly behind vehicle's smoothed heading
    const behindX = -Math.sin(smoothHeading.current) * totalDistance;
    const behindZ = -Math.cos(smoothHeading.current) * totalDistance;

    const desiredCamX = carPos.x + behindX;
    const desiredCamY = carPos.y + cameraHeight;
    const desiredCamZ = carPos.z + behindZ;

    // 4. Ground height buffer to prevent terrain clipping
    const safeCamY = Math.max(desiredCamY, 2.4);

    // 5. Delta-time aware position smoothing
    const posSmoothFactor = 1.0 - Math.exp(-5.5 * dt);
    currentCamPos.current.x = THREE.MathUtils.lerp(
      currentCamPos.current.x,
      desiredCamX,
      posSmoothFactor
    );
    currentCamPos.current.y = THREE.MathUtils.lerp(
      currentCamPos.current.y,
      safeCamY,
      posSmoothFactor
    );
    currentCamPos.current.z = THREE.MathUtils.lerp(
      currentCamPos.current.z,
      desiredCamZ,
      posSmoothFactor
    );

    // 6. Look-at Target: Looking 4.2m ahead along vehicle's forward vector
    // This naturally positions the car in the LOWER-MIDDLE of the viewport
    // and keeps the road ahead clearly visible for optimal driving navigation
    const leadDistance = 4.2;
    const desiredLookAtX = carPos.x + forward.x * leadDistance;
    const desiredLookAtY = carPos.y + 0.85;
    const desiredLookAtZ = carPos.z + forward.z * leadDistance;

    const lookAtSmoothFactor = 1.0 - Math.exp(-7.5 * dt);
    currentLookAt.current.x = THREE.MathUtils.lerp(
      currentLookAt.current.x,
      desiredLookAtX,
      lookAtSmoothFactor
    );
    currentLookAt.current.y = THREE.MathUtils.lerp(
      currentLookAt.current.y,
      desiredLookAtY,
      lookAtSmoothFactor
    );
    currentLookAt.current.z = THREE.MathUtils.lerp(
      currentLookAt.current.z,
      desiredLookAtZ,
      lookAtSmoothFactor
    );

    // 7. Apply to Three.js camera
    state.camera.position.copy(currentCamPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  if (cameraMode === 'free') {
    return (
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={5}
        maxDistance={65}
      />
    );
  }

  return null;
}
