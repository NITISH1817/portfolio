import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { vehicleInputs } from './VehicleController';
import { carAudio } from './CarAudio';
import { useGameStore } from '../../store/gameStore';

export interface VehicleState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  heading: number; // yaw angle in radians
  speed: number;
  forward: THREE.Vector3;
  right: THREE.Vector3;
  rigidBodyRef: React.RefObject<RapierRigidBody | null> | null;
  isDrifting: boolean;
  isNitroActive: boolean;
}

export const vehicleState: VehicleState = {
  position: new THREE.Vector3(0, 1.2, 0),
  quaternion: new THREE.Quaternion(),
  heading: 0,
  speed: 0,
  forward: new THREE.Vector3(0, 0, 1),
  right: new THREE.Vector3(1, 0, 0),
  rigidBodyRef: null,
  isDrifting: false,
  isNitroActive: false
};

if (typeof window !== 'undefined') {
  (window as any).__VEHICLE_STATE__ = vehicleState;
}

interface VehiclePhysicsProps {
  initialPosition?: [number, number, number];
}

export default function VehiclePhysics({
  initialPosition = [0, 1.2, 0]
}: VehiclePhysicsProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualMeshRef = useRef<THREE.Group>(null);
  const cabinRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Group>(null);

  // Wheel refs for spinning and steering
  const flWheelRef = useRef<THREE.Group>(null);
  const frWheelRef = useRef<THREE.Group>(null);
  const rlWheelRef = useRef<THREE.Group>(null);
  const rrWheelRef = useRef<THREE.Group>(null);

  // Nitro exhaust flame refs
  const nitroLeftFlameRef = useRef<THREE.Mesh>(null);
  const nitroRightFlameRef = useRef<THREE.Mesh>(null);

  // Internal vehicle physics tracking
  const currentSpeed = useRef(0);
  const currentSteer = useRef(0);
  const currentYaw = useRef(0);
  const lastNitroSoundTime = useRef(0);
  const lastDriftSoundTime = useRef(0);
  const prevPosition = useRef(new THREE.Vector3(...initialPosition));

  // Headlights state from store
  const headlightsOn = useGameStore((s) => s.headlightsOn);

  useEffect(() => {
    vehicleState.rigidBodyRef = rigidBodyRef;
    vehicleState.position.set(...initialPosition);
    if (typeof window !== 'undefined') {
      (window as any).__VEHICLE_STATE__ = vehicleState;
    }
  }, [initialPosition]);

  // Fast Teleportation listener
  useEffect(() => {
    const handleTeleport = (e: CustomEvent<[number, number, number]>) => {
      const [tx, ty, tz] = e.detail;
      if (rigidBodyRef.current) {
        rigidBodyRef.current.setTranslation({ x: tx, y: ty + 1.2, z: tz }, true);
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        rigidBodyRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
        currentSpeed.current = 0;
        currentYaw.current = 0;
        vehicleState.position.set(tx, ty + 1.2, tz);
        vehicleState.heading = 0;
        vehicleState.speed = 0;
        prevPosition.current.set(tx, ty + 1.2, tz);
      }
    };
    window.addEventListener('car-teleport', handleTeleport as EventListener);
    return () => window.removeEventListener('car-teleport', handleTeleport as EventListener);
  }, []);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    const dt = Math.min(delta, 0.05);
    const inputs = vehicleInputs;
    const store = useGameStore.getState();

    // Reset Car Position
    if (inputs.reset) {
      rigidBodyRef.current.setTranslation({ x: 0, y: 1.5, z: 0 }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      currentSpeed.current = 0;
      currentYaw.current = 0;
      vehicleState.position.set(0, 1.5, 0);
      vehicleState.heading = 0;
      vehicleState.speed = 0;
      prevPosition.current.set(0, 1.5, 0);
      inputs.reset = false;
      return;
    }

    const translation = rigidBodyRef.current.translation();
    const rotation = rigidBodyRef.current.rotation();
    const linvel = rigidBodyRef.current.linvel();

    // Prevent falling through terrain
    if (translation.y < -1.0) {
      rigidBodyRef.current.setTranslation({ x: translation.x, y: 1.2, z: translation.z }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    vehicleState.position.set(translation.x, translation.y, translation.z);
    vehicleState.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(vehicleState.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(vehicleState.quaternion);

    vehicleState.forward.copy(forward);
    vehicleState.right.copy(right);

    const heading = Math.atan2(forward.x, forward.z);
    vehicleState.heading = heading;
    currentYaw.current = heading;

    const latVel = linvel.x * right.x + linvel.z * right.z;
    const speedMagnitude = Math.sqrt(linvel.x * linvel.x + linvel.z * linvel.z);
    vehicleState.speed = speedMagnitude;

    // Track Distance Driven for "First Drive" achievement
    const distStep = prevPosition.current.distanceTo(vehicleState.position);
    if (distStep > 0.01 && distStep < 5.0) {
      store.addDistanceDriven(distStep);
    }
    prevPosition.current.copy(vehicleState.position);

    // ==========================================
    // NITRO BOOST & ENERGY RECHARGE
    // ==========================================
    let isNitro = false;
    let nitroEnergy = store.nitroEnergy;

    if (inputs.nitro && inputs.forward && nitroEnergy > 0) {
      isNitro = true;
      nitroEnergy = Math.max(0, nitroEnergy - 24.0 * dt);
      store.setNitroEnergy(nitroEnergy);

      // Sound trigger
      const now = state.clock.getElapsedTime();
      if (now - lastNitroSoundTime.current > 0.35) {
        carAudio.playNitro();
        lastNitroSoundTime.current = now;
      }
    } else {
      if (nitroEnergy < 100) {
        nitroEnergy = Math.min(100, nitroEnergy + 12.0 * dt);
        store.setNitroEnergy(nitroEnergy);
      }
    }
    store.setIsNitroActive(isNitro);
    vehicleState.isNitroActive = isNitro;

    // Animate Nitro Exhaust Flames
    if (nitroLeftFlameRef.current && nitroRightFlameRef.current) {
      if (isNitro) {
        const flicker = 1.0 + Math.sin(state.clock.getElapsedTime() * 45) * 0.35;
        nitroLeftFlameRef.current.visible = true;
        nitroRightFlameRef.current.visible = true;
        nitroLeftFlameRef.current.scale.set(1.1, 1.1, 1.8 * flicker);
        nitroRightFlameRef.current.scale.set(1.1, 1.1, 1.8 * flicker);
      } else {
        nitroLeftFlameRef.current.visible = false;
        nitroRightFlameRef.current.visible = false;
      }
    }

    // ==========================================
    // DRIFT MECHANICS
    // ==========================================
    let steerInput = 0;
    if (inputs.left) steerInput += 1;
    if (inputs.right) steerInput -= 1;

    let isDrifting = false;
    if (speedMagnitude > 5.5 && inputs.brake && Math.abs(steerInput) > 0.1) {
      isDrifting = true;
      const now = state.clock.getElapsedTime();
      if (now - lastDriftSoundTime.current > 0.28) {
        carAudio.playDrift();
        lastDriftSoundTime.current = now;
      }
    }
    store.setIsDrifting(isDrifting);
    vehicleState.isDrifting = isDrifting;

    // ==========================================
    // DRIVING PARAMETERS & SPEED DYNAMICS
    // ==========================================
    const normalMaxSpeed = 22.0; // m/s (~80 km/h)
    const boostedMaxSpeed = 33.0; // m/s (~120 km/h with Nitro)
    const maxForwardSpeed = isNitro ? boostedMaxSpeed : normalMaxSpeed;
    const maxReverseSpeed = -8.0; // m/s
    const normalAccel = 18.0; // m/s^2
    const boostedAccel = 32.0; // m/s^2 with Nitro
    const accelerationRate = isNitro ? boostedAccel : normalAccel;
    const reverseRate = 12.0; // m/s^2
    const dragCoeff = 3.2; // Natural drag coasting to stop
    const brakeDecel = isDrifting ? 7.5 : 24.0; // Drift maintains forward slide momentum
    const tireGrip = isDrifting ? 3.8 : 14.0; // Reduced lateral friction during drift

    let targetSpeed = currentSpeed.current;

    if (inputs.forward) {
      targetSpeed += accelerationRate * dt;
      if (targetSpeed > maxForwardSpeed) targetSpeed = maxForwardSpeed;
    } else if (inputs.backward) {
      if (targetSpeed > 0.5) {
        targetSpeed -= brakeDecel * dt;
        if (targetSpeed < 0) targetSpeed = 0;
      } else {
        targetSpeed -= reverseRate * dt;
        if (targetSpeed < maxReverseSpeed) targetSpeed = maxReverseSpeed;
      }
    } else {
      targetSpeed *= Math.exp(-dragCoeff * dt);
      if (Math.abs(targetSpeed) < 0.08) targetSpeed = 0;
    }

    // Spacebar Handbrake
    if (inputs.brake && !isDrifting) {
      targetSpeed *= Math.exp(-brakeDecel * dt);
      if (Math.abs(targetSpeed) < 0.1) targetSpeed = 0;
    }

    currentSpeed.current = targetSpeed;

    // Lateral slip calculation
    const newLatVel = latVel * Math.exp(-tireGrip * dt);

    // Speed-dependent steering with drift amplification
    const speedRatio = Math.min(Math.abs(targetSpeed) / 8.0, 1.0);
    const highSpeedStability = 1.0 / (1.0 + Math.abs(targetSpeed) * 0.035);

    const targetSteerAngle = steerInput * (isDrifting ? 0.55 : 0.42);
    currentSteer.current = THREE.MathUtils.lerp(
      currentSteer.current,
      targetSteerAngle,
      1.0 - Math.exp(-14.0 * dt)
    );

    let targetAngvelY = 0;
    if (Math.abs(targetSpeed) > 0.1 && Math.abs(currentSteer.current) > 0.01) {
      const turnDirection = targetSpeed >= 0 ? 1 : -1;
      const turnRate = isDrifting ? 5.8 : 4.2;
      targetAngvelY =
        currentSteer.current * turnRate * speedRatio * highSpeedStability * turnDirection;
    }

    // Apply linear and angular velocity vectors safely to Rapier
    const newLinvelX = forward.x * targetSpeed + right.x * newLatVel;
    const newLinvelZ = forward.z * targetSpeed + right.z * newLatVel;

    rigidBodyRef.current.setLinvel(
      {
        x: newLinvelX,
        y: linvel.y,
        z: newLinvelZ
      },
      true
    );

    rigidBodyRef.current.setAngvel(
      {
        x: 0,
        y: targetAngvelY,
        z: 0
      },
      true
    );

    // Audio Engine synchronization
    const isAccelerating = inputs.forward || (inputs.backward && targetSpeed <= 0);
    carAudio.updateEngine(speedMagnitude / normalMaxSpeed, isAccelerating);

    // Wheel visual rotation
    const wheelRotDelta = (targetSpeed * dt) / 0.34;
    if (flWheelRef.current && frWheelRef.current) {
      flWheelRef.current.rotation.x += wheelRotDelta;
      frWheelRef.current.rotation.x += wheelRotDelta;
      flWheelRef.current.rotation.y = currentSteer.current;
      frWheelRef.current.rotation.y = currentSteer.current;
    }
    if (rlWheelRef.current && rrWheelRef.current) {
      rlWheelRef.current.rotation.x += wheelRotDelta;
      rrWheelRef.current.rotation.x += wheelRotDelta;
    }

    // Suspension pitch & roll + Horn vibration
    if (cabinRef.current) {
      const pitch = THREE.MathUtils.clamp(-targetSpeed * 0.005, -0.09, 0.09);
      const rollFactor = isDrifting ? 0.14 : 0.08;
      const roll = THREE.MathUtils.clamp(
        -currentSteer.current * (speedMagnitude / 15) * rollFactor,
        -0.14,
        0.14
      );
      const hornShake = inputs.horn ? Math.sin(state.clock.getElapsedTime() * 60) * 0.02 : 0;

      cabinRef.current.rotation.x = THREE.MathUtils.lerp(cabinRef.current.rotation.x, pitch + hornShake, 0.15);
      cabinRef.current.rotation.z = THREE.MathUtils.lerp(cabinRef.current.rotation.z, roll, 0.15);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      type="dynamic"
      position={initialPosition}
      enabledRotations={[false, true, false]} // Locked roll/pitch strictly prevents flipping!
      linearDamping={0.5}
      angularDamping={2.5}
      onCollisionEnter={() => carAudio.playCrash(0.8)}
    >
      {/* Authoritative Single Vehicle Collider */}
      <CuboidCollider
        args={[1.05, 0.55, 1.68]}
        position={[0, 0.55, 0]}
        friction={0.4}
        restitution={0.05}
      />

      {/* Visual Model Root */}
      <group ref={visualMeshRef} scale={[1.25, 1.25, 1.25]}>
        <group ref={cabinRef}>
          {/* Main Vibrant Red Off-Road Body */}
          <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.7, 0.42, 2.7]} />
            <meshStandardMaterial color="#EF4444" roughness={0.25} metalness={0.2} />
          </mesh>

          {/* Black Rugged Front Off-Road Bumper & Bull-Bar */}
          <mesh position={[0, 0.22, 1.42]} castShadow>
            <boxGeometry args={[1.65, 0.24, 0.25]} />
            <meshStandardMaterial color="#1E232A" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.42, 1.48]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>

          {/* Front Grille */}
          <mesh position={[0, 0.38, 1.37]}>
            <boxGeometry args={[1.1, 0.2, 0.05]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>

          {/* Black Rugged Rear Bumper */}
          <mesh position={[0, 0.24, -1.4]} castShadow>
            <boxGeometry args={[1.65, 0.24, 0.2]} />
            <meshStandardMaterial color="#1E232A" roughness={0.8} />
          </mesh>

          {/* Rear Mounted Spare Off-Road Tire */}
          <group position={[0, 0.55, -1.48]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.2, 16]} />
              <meshStandardMaterial color="#1E232A" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.7} />
            </mesh>
          </group>

          {/* Black Wheel Fenders / Arches */}
          <mesh position={[-0.9, 0.28, 0.8]}>
            <boxGeometry args={[0.15, 0.15, 0.7]} />
            <meshStandardMaterial color="#1E232A" />
          </mesh>
          <mesh position={[0.9, 0.28, 0.8]}>
            <boxGeometry args={[0.15, 0.15, 0.7]} />
            <meshStandardMaterial color="#1E232A" />
          </mesh>
          <mesh position={[-0.9, 0.28, -0.8]}>
            <boxGeometry args={[0.15, 0.15, 0.7]} />
            <meshStandardMaterial color="#1E232A" />
          </mesh>
          <mesh position={[0.9, 0.28, -0.8]}>
            <boxGeometry args={[0.15, 0.15, 0.7]} />
            <meshStandardMaterial color="#1E232A" />
          </mesh>

          {/* Cabin Top (Red + Dark Pillars) */}
          <mesh position={[0, 0.74, -0.1]} castShadow>
            <boxGeometry args={[1.35, 0.46, 1.55]} />
            <meshStandardMaterial color="#DC2626" roughness={0.3} />
          </mesh>

          {/* Windshield & Windows */}
          <mesh position={[0, 0.75, 0.6]} rotation={[0.3, 0, 0]} castShadow>
            <planeGeometry args={[1.2, 0.42]} />
            <meshStandardMaterial
              color="#38BDF8"
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[0, 0.75, -0.88]} rotation={[-0.3, Math.PI, 0]} castShadow>
            <planeGeometry args={[1.2, 0.38]} />
            <meshStandardMaterial
              color="#38BDF8"
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Roof Rack Carrier */}
          <mesh position={[0, 1.0, -0.1]} castShadow>
            <boxGeometry args={[1.3, 0.08, 1.3]} />
            <meshStandardMaterial color="#1E232A" roughness={0.7} />
          </mesh>

          {/* 4 Auxiliary Round Off-Road Roof Lights */}
          {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
            <group key={i} position={[x, 1.12, 0.5]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.12, 12]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#1E232A" />
              </mesh>
              <mesh position={[0, 0, 0.06]}>
                <circleGeometry args={[0.08, 12]} />
                <meshStandardMaterial
                  color="#FEF08A"
                  emissive="#FEF08A"
                  emissiveIntensity={headlightsOn ? 2.5 : 0.2}
                />
              </mesh>
            </group>
          ))}

          {/* Front Headlights Lenses */}
          <mesh position={[-0.55, 0.38, 1.38]}>
            <boxGeometry args={[0.3, 0.15, 0.08]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFBEB"
              emissiveIntensity={headlightsOn ? 3.0 : 0.1}
            />
          </mesh>
          <mesh position={[0.55, 0.38, 1.38]}>
            <boxGeometry args={[0.3, 0.15, 0.08]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFBEB"
              emissiveIntensity={headlightsOn ? 3.0 : 0.1}
            />
          </mesh>

          {/* Dual Real Headlight Spotlights (Controlled by L / store) */}
          {headlightsOn && (
            <spotLight
              position={[0, 0.45, 1.35]}
              target-position={[0, 0, 14]}
              angle={0.65}
              penumbra={0.5}
              intensity={4.8}
              color="#FEF3C7"
              castShadow
              shadow-mapSize={[512, 512]}
            />
          )}

          {/* Taillights */}
          <mesh position={[-0.6, 0.38, -1.37]}>
            <boxGeometry args={[0.26, 0.12, 0.06]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={2.5} />
          </mesh>
          <mesh position={[0.6, 0.38, -1.37]}>
            <boxGeometry args={[0.26, 0.12, 0.06]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={2.5} />
          </mesh>

          {/* Dual Exhaust Pipes with Nitro Flames */}
          <group position={[-0.45, 0.18, -1.45]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.15, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            {/* Cyan Nitro Flame */}
            <mesh
              ref={nitroLeftFlameRef}
              visible={false}
              position={[0, 0, -0.35]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <coneGeometry args={[0.15, 0.7, 12]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} />
            </mesh>
          </group>

          <group position={[0.45, 0.18, -1.45]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.15, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            {/* Cyan Nitro Flame */}
            <mesh
              ref={nitroRightFlameRef}
              visible={false}
              position={[0, 0, -0.35]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <coneGeometry args={[0.15, 0.7, 12]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} />
            </mesh>
          </group>
        </group>

        {/* 4 Chunky Wheels */}
        <group ref={flWheelRef} position={[-0.92, 0.28, 0.8]}>
          <WheelMesh isLeft />
        </group>
        <group ref={frWheelRef} position={[0.92, 0.28, 0.8]}>
          <WheelMesh />
        </group>
        <group ref={rlWheelRef} position={[-0.92, 0.28, -0.8]}>
          <WheelMesh isLeft />
        </group>
        <group ref={rrWheelRef} position={[0.92, 0.28, -0.8]}>
          <WheelMesh />
        </group>
      </group>
    </RigidBody>
  );
}

function WheelMesh({ isLeft = false }: { isLeft?: boolean }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Chunky Rubber Tire */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.24, 16]} />
        <meshStandardMaterial color="#1E232A" roughness={0.85} />
      </mesh>
      {/* Alloy Rim */}
      <mesh position={[0, isLeft ? -0.08 : 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Red Center Hubcap */}
      <mesh position={[0, isLeft ? -0.13 : 0.13, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}
