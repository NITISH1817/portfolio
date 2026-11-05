import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { vehicleState } from './VehiclePhysics';

export type CameraMode = 'thirdperson' | 'showcase' | 'isometric' | 'topdown' | 'cockpit' | 'free';

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
  const currentCamPos = useRef(new THREE.Vector3(0, 5.8, 33.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.2, 19.6));
  const smoothHeading = useRef(Math.PI);
  const wasIntro = useRef(isIntro);
  const currentFov = useRef(45);
  const currentRoll = useRef(0);
  const isFirstFrame = useRef(true);

  // Instantly snap camera on car teleport / respawn
  useEffect(() => {
    const handleTeleport = (e: CustomEvent<[number, number, number]>) => {
      const [tx, ty, tz] = e.detail;
      const heading = vehicleState.heading || Math.PI;
      smoothHeading.current = heading;
      currentCamPos.current.set(
        tx - Math.sin(heading) * 9.5,
        ty + 4.6,
        tz - Math.cos(heading) * 9.5
      );
      currentLookAt.current.set(
        tx + Math.sin(heading) * 4.4,
        ty + 1.0,
        tz + Math.cos(heading) * 4.4
      );
      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);
    };

    window.addEventListener('car-teleport', handleTeleport as EventListener);
    return () => window.removeEventListener('car-teleport', handleTeleport as EventListener);
  }, [camera]);

  useEffect(() => {
    if (isIntro) {
      currentCamPos.current.set(3.8, 2.6, 4.6);
      currentLookAt.current.set(0, 0.75, 0);
      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);
      isFirstFrame.current = true;
    }
  }, [camera, isIntro]);

  useFrame((state, delta) => {
    if (cameraMode === 'free') return;

    const dt = Math.min(delta, 0.05);
    const perspectiveCam = state.camera as THREE.PerspectiveCamera;

    // =========================================================================
    // 1. CINEMATIC INTRO CAMERA (Sweeping low-angle vehicle reveal)
    // =========================================================================
    if (isIntro) {
      const t = state.clock.elapsedTime * 0.22;
      // Elliptical orbital movement around hero vehicle
      const orbitRadius = 4.2;
      const introX = Math.sin(t) * orbitRadius;
      const introZ = Math.cos(t) * orbitRadius;
      const introY = 1.6 + Math.sin(t * 1.5) * 0.4;

      currentCamPos.current.lerp(new THREE.Vector3(introX, introY, introZ), 0.08);
      currentLookAt.current.lerp(new THREE.Vector3(0, 0.75, 0), 0.1);

      perspectiveCam.position.copy(currentCamPos.current);
      perspectiveCam.lookAt(currentLookAt.current);
      perspectiveCam.rotation.z = 0;
      wasIntro.current = true;
      return;
    }

    const carPos = vehicleState.position;
    const carSpeed = vehicleState.speed;
    const carHeading = vehicleState.heading;
    const forward = vehicleState.forward;
    const right = vehicleState.right;
    const isNitro = vehicleState.isNitroActive;
    const isDrift = vehicleState.isDrifting;

    // Seamless fly-in when transitioning out of Intro or initial spawn
    if (wasIntro.current || isFirstFrame.current) {
      wasIntro.current = false;
      isFirstFrame.current = false;
      smoothHeading.current = carHeading;
      currentCamPos.current.set(
        carPos.x - Math.sin(carHeading) * 9.5,
        carPos.y + 4.6,
        carPos.z - Math.cos(carHeading) * 9.5
      );
      currentLookAt.current.set(
        carPos.x,
        carPos.y + 1.0,
        carPos.z + Math.cos(carHeading) * 4.0
      );
      perspectiveCam.position.copy(currentCamPos.current);
      perspectiveCam.lookAt(currentLookAt.current);
    }

    // =========================================================================
    // 2. VEHICLE SHOWCASE CAMERA (360 Turntable Orbit)
    // =========================================================================
    if (cameraMode === 'showcase') {
      const t = state.clock.elapsedTime * 0.35;
      const orbitRadius = 6.2;
      const showX = carPos.x + Math.sin(t) * orbitRadius;
      const showZ = carPos.z + Math.cos(t) * orbitRadius;
      const showY = carPos.y + 2.2 + Math.sin(t * 0.8) * 0.5;

      currentCamPos.current.lerp(new THREE.Vector3(showX, showY, showZ), 0.08);
      currentLookAt.current.lerp(new THREE.Vector3(carPos.x, carPos.y + 0.8, carPos.z), 0.1);

      perspectiveCam.position.copy(currentCamPos.current);
      perspectiveCam.lookAt(currentLookAt.current);
      perspectiveCam.rotation.z = 0;
      return;
    }

    // =========================================================================
    // 3. TOP-DOWN TACTICAL CAMERA
    // =========================================================================
    if (cameraMode === 'topdown') {
      const topSpeedFactor = 1.0 - Math.exp(-6.0 * dt);
      perspectiveCam.position.x = THREE.MathUtils.lerp(perspectiveCam.position.x, carPos.x, topSpeedFactor);
      perspectiveCam.position.z = THREE.MathUtils.lerp(perspectiveCam.position.z, carPos.z, topSpeedFactor);
      perspectiveCam.position.y = THREE.MathUtils.lerp(perspectiveCam.position.y, 42.0, topSpeedFactor);
      perspectiveCam.lookAt(carPos.x, 0, carPos.z);
      perspectiveCam.rotation.z = 0;
      return;
    }

    // =========================================================================
    // 4. ISOMETRIC VANTAGE CAMERA
    // =========================================================================
    if (cameraMode === 'isometric') {
      const isoOffset = 16.0;
      const isoHeight = 18.0;
      const desiredX = carPos.x + isoOffset;
      const desiredY = carPos.y + isoHeight;
      const desiredZ = carPos.z + isoOffset;

      const t = 1.0 - Math.exp(-4.5 * dt);
      currentCamPos.current.lerp(new THREE.Vector3(desiredX, desiredY, desiredZ), t);
      currentLookAt.current.lerp(new THREE.Vector3(carPos.x, carPos.y + 1.0, carPos.z), t * 1.5);

      perspectiveCam.position.copy(currentCamPos.current);
      perspectiveCam.lookAt(currentLookAt.current);
      perspectiveCam.rotation.z = 0;
      return;
    }

    // =========================================================================
    // 4.5 COCKPIT / FIRST-PERSON CAMERA MODE
    // =========================================================================
    if (cameraMode === 'cockpit') {
      const hoodPos = carPos.clone().add(forward.clone().multiplyScalar(0.55)).add(new THREE.Vector3(0, 1.25, 0));
      const lookTarget = hoodPos.clone().add(forward.clone().multiplyScalar(20.0));
      perspectiveCam.position.copy(hoodPos);
      perspectiveCam.lookAt(lookTarget);
      perspectiveCam.rotation.z = 0;
      return;
    }

    // =========================================================================
    // 5. CINEMATIC THIRD-PERSON FOLLOW CAMERA (PRIMARY GAMEPLAY)
    // =========================================================================

    // Smooth heading angle interpolation without 360 flip
    const angleDiff = Math.atan2(
      Math.sin(carHeading - smoothHeading.current),
      Math.cos(carHeading - smoothHeading.current)
    );
    const headingSmoothFactor = 1.0 - Math.exp(-5.2 * dt);
    smoothHeading.current += angleDiff * headingSmoothFactor;

    // Dynamic FOV widening on high speed / Nitro boost (45° -> 54°)
    const targetFov = isNitro ? 54 : THREE.MathUtils.lerp(45, 51, Math.min(carSpeed / 25, 1.0));
    currentFov.current = THREE.MathUtils.lerp(currentFov.current, targetFov, 1.0 - Math.exp(-4.0 * dt));
    if (perspectiveCam.fov !== currentFov.current) {
      perspectiveCam.fov = currentFov.current;
      perspectiveCam.updateProjectionMatrix();
    }

    // Dynamic camera distance & elevation based on speed
    const baseDistance = 9.5;
    const speedPullback = Math.min(carSpeed * 0.13, 3.5);
    const totalDistance = baseDistance + speedPullback + (isNitro ? 1.0 : 0);
    const cameraHeight = 4.6 + (isNitro ? 0.3 : 0);

    // Compute camera position behind smoothed heading
    const behindX = -Math.sin(smoothHeading.current) * totalDistance;
    const behindZ = -Math.cos(smoothHeading.current) * totalDistance;

    const desiredCamX = carPos.x + behindX;
    const desiredCamY = carPos.y + cameraHeight;
    const desiredCamZ = carPos.z + behindZ;

    // Ground elevation buffer
    const safeCamY = Math.max(desiredCamY, 2.4);

    // Controlled High-Speed Camera Micro-Shake
    let shakeX = 0;
    let shakeY = 0;
    if (carSpeed > 18 || isNitro) {
      const shakeMag = (isNitro ? 0.045 : 0.02) * Math.min(carSpeed / 25, 1.2);
      shakeX = (Math.random() - 0.5) * shakeMag;
      shakeY = (Math.random() - 0.5) * shakeMag;
    }

    // Delta-time aware position smoothing
    const posSmoothFactor = 1.0 - Math.exp(-5.8 * dt);
    currentCamPos.current.x = THREE.MathUtils.lerp(
      currentCamPos.current.x,
      desiredCamX + shakeX,
      posSmoothFactor
    );
    currentCamPos.current.y = THREE.MathUtils.lerp(
      currentCamPos.current.y,
      safeCamY + shakeY,
      posSmoothFactor
    );
    currentCamPos.current.z = THREE.MathUtils.lerp(
      currentCamPos.current.z,
      desiredCamZ,
      posSmoothFactor
    );

    // Look-ahead tracking along vehicle forward vector
    const leadDistance = 4.4 + Math.min(carSpeed * 0.1, 2.5);
    const desiredLookAtX = carPos.x + forward.x * leadDistance;
    const desiredLookAtY = carPos.y + 0.82;
    const desiredLookAtZ = carPos.z + forward.z * leadDistance;

    const lookAtSmoothFactor = 1.0 - Math.exp(-7.8 * dt);
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

    // Subtle Camera Banking into turns (rolls camera slightly around Z axis for cinematic automotive feel)
    const targetRoll = -vehicleState.steerAngle * (carSpeed / 22) * 0.04;
    currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, targetRoll, 1.0 - Math.exp(-6.0 * dt));

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
        minDistance={5}
        maxDistance={65}
      />
    );
  }

  return null;
}
