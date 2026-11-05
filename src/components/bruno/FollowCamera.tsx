import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { vehicleState } from './VehiclePhysics';

export type CameraMode = 'thirdperson' | 'isometric' | 'topdown' | 'showcase' | 'free';

interface FollowCameraProps {
  cameraMode?: CameraMode;
  isIntro?: boolean;
}

export default function FollowCamera({
  cameraMode = 'thirdperson',
  isIntro = false
}: FollowCameraProps) {
  const { camera } = useThree();

  // Internal smooth camera vectors
  const currentCamPos = useRef(new THREE.Vector3(0, 14.5, 26.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.0, 12.0));
  const smoothHeading = useRef(Math.PI);
  const currentFov = useRef(46);
  const currentRoll = useRef(0);
  const isFirstFrame = useRef(true);

  // Instantly snap camera on car teleport / respawn
  useEffect(() => {
    const handleTeleport = (e: CustomEvent<[number, number, number]>) => {
      const [tx, ty, tz] = e.detail;
      const heading = vehicleState.heading || Math.PI;
      smoothHeading.current = heading;
      currentCamPos.current.set(
        tx - Math.sin(heading) * 14.5,
        ty + 13.5,
        tz - Math.cos(heading) * 14.5
      );
      currentLookAt.current.set(
        tx + Math.sin(heading) * 3.5,
        ty + 0.8,
        tz + Math.cos(heading) * 3.5
      );
      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);
    };

    window.addEventListener('car-teleport', handleTeleport as EventListener);
    return () => window.removeEventListener('car-teleport', handleTeleport as EventListener);
  }, [camera]);

  useFrame((state, delta) => {
    if (cameraMode === 'free') return;

    const dt = Math.min(delta, 0.05);
    const perspectiveCam = state.camera as THREE.PerspectiveCamera;
    const carPos = vehicleState.position;
    const carSpeed = vehicleState.speed;
    const carHeading = vehicleState.heading;
    const forward = vehicleState.forward;
    const isNitro = vehicleState.isNitroActive;

    // First frame initialization
    if (isFirstFrame.current) {
      isFirstFrame.current = false;
      smoothHeading.current = carHeading;
      currentCamPos.current.set(
        carPos.x - Math.sin(carHeading) * 14.5,
        carPos.y + 13.5,
        carPos.z - Math.cos(carHeading) * 14.5
      );
      currentLookAt.current.set(
        carPos.x + forward.x * 3.5,
        carPos.y + 0.8,
        carPos.z + forward.z * 3.5
      );
      perspectiveCam.position.copy(currentCamPos.current);
      perspectiveCam.lookAt(currentLookAt.current);
    }

    // =========================================================================
    // 1. ISOMETRIC VANTAGE CAMERA
    // =========================================================================
    if (cameraMode === 'isometric') {
      const isoOffset = 18.0;
      const isoHeight = 19.5;
      const desiredX = carPos.x + isoOffset;
      const desiredY = carPos.y + isoHeight;
      const desiredZ = carPos.z + isoOffset;

      const t = 1.0 - Math.exp(-4.5 * dt);
      currentCamPos.current.lerp(new THREE.Vector3(desiredX, desiredY, desiredZ), t);
      currentLookAt.current.lerp(new THREE.Vector3(carPos.x, carPos.y + 0.8, carPos.z), t * 1.5);

      perspectiveCam.position.copy(currentCamPos.current);
      perspectiveCam.lookAt(currentLookAt.current);
      perspectiveCam.rotation.z = 0;
      return;
    }

    // =========================================================================
    // 2. TOP-DOWN CAMERA
    // =========================================================================
    if (cameraMode === 'topdown') {
      const topSpeedFactor = 1.0 - Math.exp(-5.5 * dt);
      perspectiveCam.position.x = THREE.MathUtils.lerp(perspectiveCam.position.x, carPos.x, topSpeedFactor);
      perspectiveCam.position.z = THREE.MathUtils.lerp(perspectiveCam.position.z, carPos.z, topSpeedFactor);
      perspectiveCam.position.y = THREE.MathUtils.lerp(perspectiveCam.position.y, 44.0, topSpeedFactor);
      perspectiveCam.lookAt(carPos.x, 0, carPos.z);
      perspectiveCam.rotation.z = 0;
      return;
    }

    // =========================================================================
    // 3. VEHICLE SHOWCASE TURNTABLE
    // =========================================================================
    if (cameraMode === 'showcase') {
      const t = state.clock.elapsedTime * 0.35;
      const orbitRadius = 7.5;
      const showX = carPos.x + Math.sin(t) * orbitRadius;
      const showZ = carPos.z + Math.cos(t) * orbitRadius;
      const showY = carPos.y + 3.2 + Math.sin(t * 0.8) * 0.4;

      currentCamPos.current.lerp(new THREE.Vector3(showX, showY, showZ), 0.08);
      currentLookAt.current.lerp(new THREE.Vector3(carPos.x, carPos.y + 0.8, carPos.z), 0.1);

      perspectiveCam.position.copy(currentCamPos.current);
      perspectiveCam.lookAt(currentLookAt.current);
      perspectiveCam.rotation.z = 0;
      return;
    }

    // =========================================================================
    // 4. SIGNATURE ELEVATED THIRD-PERSON TOYBOX PERSPECTIVE (PRIMARY GAMEPLAY)
    // =========================================================================
    // Smooth heading angle interpolation without 360 wrap glitch
    const angleDiff = Math.atan2(
      Math.sin(carHeading - smoothHeading.current),
      Math.cos(carHeading - smoothHeading.current)
    );
    const headingSmoothFactor = 1.0 - Math.exp(-4.6 * dt);
    smoothHeading.current += angleDiff * headingSmoothFactor;

    // Dynamic FOV widening on high speed / Nitro boost (46° -> 53°)
    const targetFov = isNitro ? 53 : THREE.MathUtils.lerp(46, 50, Math.min(carSpeed / 25, 1.0));
    currentFov.current = THREE.MathUtils.lerp(currentFov.current, targetFov, 1.0 - Math.exp(-4.0 * dt));
    if (perspectiveCam.fov !== currentFov.current) {
      perspectiveCam.fov = currentFov.current;
      perspectiveCam.updateProjectionMatrix();
    }

    // Elevated camera height & follow distance
    const baseDistance = 14.5;
    const speedPullback = Math.min(carSpeed * 0.12, 3.2);
    const totalDistance = baseDistance + speedPullback + (isNitro ? 1.2 : 0);
    const cameraHeight = 13.5 + (isNitro ? 0.4 : 0);

    // Compute camera position behind smoothed heading
    const behindX = -Math.sin(smoothHeading.current) * totalDistance;
    const behindZ = -Math.cos(smoothHeading.current) * totalDistance;

    const desiredCamX = carPos.x + behindX;
    const desiredCamY = carPos.y + cameraHeight;
    const desiredCamZ = carPos.z + behindZ;

    // Strict minimum height buffer (never dips below 11.0m)
    const safeCamY = Math.max(desiredCamY, 11.0);

    // Delta-time aware position smoothing
    const posSmoothFactor = 1.0 - Math.exp(-5.2 * dt);
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

    // Look-ahead tracking along vehicle forward vector
    const leadDistance = 3.6 + Math.min(carSpeed * 0.1, 2.0);
    const desiredLookAtX = carPos.x + forward.x * leadDistance;
    const desiredLookAtY = carPos.y + 0.85;
    const desiredLookAtZ = carPos.z + forward.z * leadDistance;

    const lookAtSmoothFactor = 1.0 - Math.exp(-6.8 * dt);
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

    // Subtle banking into sharp turns
    const targetRoll = -vehicleState.steerAngle * (carSpeed / 24) * 0.03;
    currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, targetRoll, 1.0 - Math.exp(-5.0 * dt));

    perspectiveCam.position.copy(currentCamPos.current);
    perspectiveCam.lookAt(currentLookAt.current);
    perspectiveCam.rotation.z += currentRoll.current;
  });

  if (cameraMode === 'free') {
    return (
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={8}
        maxDistance={75}
      />
    );
  }

  return null;
}
