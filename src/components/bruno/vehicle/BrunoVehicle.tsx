import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { vehicleInputs } from '../VehicleController';
import { carAudio } from '../CarAudio';
import { vehicleState } from '../VehiclePhysics';
import { useGameStore } from '../../../store/gameStore';

export interface VehicleState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  heading: number;
  speed: number;
  forward: THREE.Vector3;
  right: THREE.Vector3;
  rigidBodyRef: React.RefObject<RapierRigidBody | null> | null;
  isDrifting: boolean;
  isNitroActive: boolean;
  steerAngle: number;
}

export const brunoVehicleState = vehicleState;

if (typeof window !== 'undefined') {
  (window as any).__VEHICLE_STATE__ = brunoVehicleState;
}

interface BrunoVehicleProps {
  initialPosition?: [number, number, number];
}

export default function BrunoVehicle({
  initialPosition = [0, 1.2, 24]
}: BrunoVehicleProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualMeshRef = useRef<THREE.Group>(null);
  const cabinRef = useRef<THREE.Group>(null);

  // Wheels
  const flWheelRef = useRef<THREE.Group>(null);
  const frWheelRef = useRef<THREE.Group>(null);
  const rlWheelRef = useRef<THREE.Group>(null);
  const rrWheelRef = useRef<THREE.Group>(null);

  // Nitro Flames
  const nitroLeftRef = useRef<THREE.Mesh>(null);
  const nitroRightRef = useRef<THREE.Mesh>(null);

  // Brake Lights Material
  const brakeLightMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Dynamic Physics Tracking
  const currentSpeed = useRef(0);
  const currentSteer = useRef(0);
  const lastDriftTime = useRef(0);
  const lastJumpTime = useRef(0);
  const lastCrashTime = useRef(0);

  // Game Store Sync
  const headlightsOn = useGameStore((s) => s.headlightsOn);
  const vehicleColor = '#FF8A3D'; // Nitish signature orange lacquer

  useEffect(() => {
    brunoVehicleState.rigidBodyRef = rigidBodyRef;
    brunoVehicleState.position.set(...initialPosition);
    if (typeof window !== 'undefined') {
      (window as any).__VEHICLE_STATE__ = brunoVehicleState;
    }
  }, [initialPosition]);

  // Teleport & Respawn Event Listeners
  useEffect(() => {
    const handleTeleport = (e: CustomEvent<[number, number, number]>) => {
      const [tx, ty, tz] = e.detail;
      if (rigidBodyRef.current) {
        rigidBodyRef.current.setTranslation({ x: tx, y: ty + 2.0, z: tz }, true);
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        rigidBodyRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
        currentSpeed.current = 0;
        currentSteer.current = 0;
      }
    };

    window.addEventListener('car-teleport', handleTeleport as EventListener);
    return () => window.removeEventListener('car-teleport', handleTeleport as EventListener);
  }, []);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    const dt = Math.min(delta, 0.05);
    const store = useGameStore.getState();

    // 1. Read Rapier Physics State
    const pos = rigidBodyRef.current.translation();
    const rot = rigidBodyRef.current.rotation();
    const linvel = rigidBodyRef.current.linvel();

    brunoVehicleState.position.set(pos.x, pos.y, pos.z);
    brunoVehicleState.quaternion.set(rot.x, rot.y, rot.z, rot.w);

    const euler = new THREE.Euler().setFromQuaternion(brunoVehicleState.quaternion, 'YXZ');
    const heading = euler.y;
    brunoVehicleState.heading = heading;

    const forward = new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading)).normalize();
    const right = new THREE.Vector3(Math.cos(heading), 0, -Math.sin(heading)).normalize();
    brunoVehicleState.forward.copy(forward);
    brunoVehicleState.right.copy(right);

    const fwdVel = linvel.x * forward.x + linvel.z * forward.z;
    const latVel = linvel.x * right.x + linvel.z * right.z;
    const speedMagnitude = Math.sqrt(linvel.x * linvel.x + linvel.z * linvel.z);
    brunoVehicleState.speed = speedMagnitude;

    // 2. Poll Gamepad Input (Analog Steering & Triggers)
    const inputs = { ...vehicleInputs };
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0] || gamepads[1];
      if (gp) {
        // Left stick X axis
        if (gp.axes[0] < -0.2) inputs.left = true;
        if (gp.axes[0] > 0.2) inputs.right = true;
        // Right trigger / A button accelerate
        if (gp.buttons[7]?.pressed || gp.buttons[0]?.pressed) inputs.forward = true;
        // Left trigger / B button reverse/brake
        if (gp.buttons[6]?.pressed || gp.buttons[1]?.pressed) inputs.backward = true;
        // X button / Bumpers for Nitro
        if (gp.buttons[2]?.pressed || gp.buttons[5]?.pressed) inputs.nitro = true;
        // Y button / Select for Jump / Respawn
        if (gp.buttons[3]?.pressed) inputs.brake = true;
        if (gp.buttons[8]?.pressed) {
          window.dispatchEvent(new CustomEvent('car-teleport', { detail: [0, 0, 36] }));
        }
      }
    }

    // 3. Nitro Boost Mechanics
    const currentNitro = store.nitroEnergy ?? 100;
    const isNitro = inputs.nitro && currentNitro > 5;
    if (isNitro) {
      store.setNitroEnergy(Math.max(0, currentNitro - 25 * dt));
      store.setIsNitroActive(true);
    } else {
      store.setNitroEnergy(Math.min(100, currentNitro + 12 * dt));
      store.setIsNitroActive(false);
    }
    brunoVehicleState.isNitroActive = isNitro;

    // Nitro exhaust flames scale and flicker
    if (nitroLeftRef.current && nitroRightRef.current) {
      if (isNitro) {
        const flicker = 1.0 + Math.sin(state.clock.getElapsedTime() * 45) * 0.35;
        nitroLeftRef.current.visible = true;
        nitroRightRef.current.visible = true;
        nitroLeftRef.current.scale.set(1.2, 1.2, 2.0 * flicker);
        nitroRightRef.current.scale.set(1.2, 1.2, 2.0 * flicker);
      } else {
        nitroLeftRef.current.visible = false;
        nitroRightRef.current.visible = false;
      }
    }

    // 4. Drift Mechanics
    let steerInput = 0;
    if (inputs.left) steerInput += 1;
    if (inputs.right) steerInput -= 1;

    let isDrifting = false;
    if (speedMagnitude > 5.0 && inputs.brake && Math.abs(steerInput) > 0.1) {
      isDrifting = true;
      const now = state.clock.getElapsedTime();
      if (now - lastDriftTime.current > 0.3) {
        carAudio.playDrift();
        lastDriftTime.current = now;
      }
    }
    brunoVehicleState.isDrifting = isDrifting;

    // 5. Jump Impulse Mechanics (Space key or Jump Ramps)
    const now = state.clock.getElapsedTime();
    if (inputs.brake && pos.y < 2.5 && now - lastJumpTime.current > 1.2 && !isDrifting) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: 340, z: 0 }, true);
      carAudio.playWoosh();
      lastJumpTime.current = now;
    }

    // 6. Speed & Acceleration Dynamics
    const normalMaxSpeed = 22.0; // ~80 km/h
    const boostedMaxSpeed = 34.0; // ~122 km/h
    const maxSpeed = isNitro ? boostedMaxSpeed : normalMaxSpeed;
    const accelRate = isNitro ? 32.0 : 18.0;
    const brakeRate = isDrifting ? 8.0 : 22.0;
    const drag = 3.0;

    let targetSpeed = currentSpeed.current;

    if (inputs.forward) {
      targetSpeed += accelRate * dt;
      if (targetSpeed > maxSpeed) targetSpeed = maxSpeed;
    } else if (inputs.backward) {
      if (targetSpeed > 0.5) {
        targetSpeed -= brakeRate * dt;
        if (targetSpeed < 0) targetSpeed = 0;
      } else {
        targetSpeed -= 12.0 * dt;
        if (targetSpeed < -8.0) targetSpeed = -8.0;
      }
    } else {
      targetSpeed *= Math.exp(-drag * dt);
      if (Math.abs(targetSpeed) < 0.08) targetSpeed = 0;
    }

    currentSpeed.current = targetSpeed;

    // Lateral friction grip
    const tireGrip = isDrifting ? 3.5 : 14.0;
    const newLatVel = latVel * Math.exp(-tireGrip * dt);

    // Speed-dependent steering
    const speedRatio = Math.min(Math.abs(targetSpeed) / 8.0, 1.0);
    const highSpeedStability = 1.0 / (1.0 + Math.abs(targetSpeed) * 0.035);

    const targetSteerAngle = steerInput * (isDrifting ? 0.55 : 0.42);
    currentSteer.current = THREE.MathUtils.lerp(
      currentSteer.current,
      targetSteerAngle,
      1.0 - Math.exp(-14.0 * dt)
    );
    brunoVehicleState.steerAngle = currentSteer.current;

    let targetAngvelY = 0;
    if (Math.abs(targetSpeed) > 0.1 && Math.abs(currentSteer.current) > 0.01) {
      const turnDirection = targetSpeed >= 0 ? 1 : -1;
      const turnRate = isDrifting ? 5.8 : 4.2;
      targetAngvelY = currentSteer.current * turnRate * speedRatio * highSpeedStability * turnDirection;
    }

    // Apply linear and angular velocity vectors to Rapier
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

    // 7. Visual Suspension Pitch & Roll
    if (cabinRef.current) {
      const accelPitch = isNitro ? -0.06 : inputs.forward ? -0.035 : 0;
      const brakePitch = inputs.brake || inputs.backward ? 0.045 : 0;
      const pitch = THREE.MathUtils.clamp(-targetSpeed * 0.003 + accelPitch + brakePitch, -0.1, 0.1);

      const rollFactor = isDrifting ? 0.14 : 0.08;
      const roll = THREE.MathUtils.clamp(-currentSteer.current * (speedMagnitude / 15) * rollFactor, -0.15, 0.15);

      cabinRef.current.rotation.x = THREE.MathUtils.lerp(cabinRef.current.rotation.x, pitch, 0.18);
      cabinRef.current.rotation.z = THREE.MathUtils.lerp(cabinRef.current.rotation.z, roll, 0.18);
    }

    // 8. Wheels visual spin and steering camber
    const wheelRotDelta = (targetSpeed * dt) / 0.32;
    if (flWheelRef.current && frWheelRef.current) {
      flWheelRef.current.rotation.x += wheelRotDelta;
      frWheelRef.current.rotation.x += wheelRotDelta;
      flWheelRef.current.rotation.y = currentSteer.current;
      frWheelRef.current.rotation.y = currentSteer.current;
      const camber = currentSteer.current * 0.08;
      flWheelRef.current.rotation.z = camber;
      frWheelRef.current.rotation.z = camber;
    }
    if (rlWheelRef.current && rrWheelRef.current) {
      rlWheelRef.current.rotation.x += wheelRotDelta;
      rrWheelRef.current.rotation.x += wheelRotDelta;
    }

    // 9. Brake Lights Glow Intensity
    if (brakeLightMatRef.current) {
      const isBraking = inputs.brake || (inputs.backward && targetSpeed > 0.5);
      brakeLightMatRef.current.emissiveIntensity = isBraking ? 4.5 : 1.2;
    }

    // 10. Web Audio Engine pitch update
    const isAccelerating = inputs.forward || (inputs.backward && targetSpeed <= 0);
    carAudio.updateEngine(speedMagnitude / normalMaxSpeed, isAccelerating);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      type="dynamic"
      position={initialPosition}
      rotation={[0, Math.PI, 0]}
      enabledRotations={[false, true, false]}
      linearDamping={0.5}
      angularDamping={2.5}
      onCollisionEnter={() => {
        carAudio.playCrash(0.8);
      }}
    >
      {/* Physical Collider */}
      <CuboidCollider args={[1.0, 0.55, 1.65]} position={[0, 0.55, 0]} friction={0.4} restitution={0.05} />

      {/* Upgraded Stylized Off-Roader Vehicle 3D Mesh */}
      <group ref={visualMeshRef} scale={[1.2, 1.2, 1.2]}>
        <group ref={cabinRef}>
          {/* Main Lacquer Orange Body */}
          <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.68, 0.44, 2.7]} />
            <meshStandardMaterial color={vehicleColor} roughness={0.25} metalness={0.6} />
          </mesh>

          {/* Purple Racing Center Stripe */}
          <mesh position={[0, 0.59, 0]}>
            <boxGeometry args={[0.36, 0.02, 2.72]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={1.8} />
          </mesh>

          {/* Cockpit Dark Glass Canopy */}
          <mesh position={[0, 0.72, -0.1]} castShadow>
            <boxGeometry args={[1.35, 0.42, 1.45]} />
            <meshStandardMaterial color="#0A0F1D" roughness={0.1} metalness={0.9} />
          </mesh>

          {/* Front Bullbar */}
          <mesh position={[0, 0.28, 1.42]} castShadow>
            <boxGeometry args={[1.6, 0.2, 0.18]} />
            <meshStandardMaterial color="#1E2430" roughness={0.7} metalness={0.5} />
          </mesh>

          {/* Dual Laser Headlights */}
          {[-0.58, 0.58].map((x, i) => (
            <mesh key={i} position={[x, 0.38, 1.38]}>
              <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#61A5FF"
                emissiveIntensity={headlightsOn ? 4.0 : 0.8}
              />
            </mesh>
          ))}

          {/* Rear LED Brake Light Bar */}
          <mesh position={[0, 0.42, -1.37]}>
            <boxGeometry args={[1.45, 0.12, 0.06]} />
            <meshStandardMaterial
              ref={brakeLightMatRef}
              color="#DC2626"
              emissive="#EF4444"
              emissiveIntensity={1.2}
            />
          </mesh>

          {/* Dual Exhaust Pipes & Nitro Flame Anchors */}
          {[-0.45, 0.45].map((x, i) => (
            <group key={i} position={[x, 0.22, -1.4]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.18, 12]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Nitro Flame Meshes */}
              <mesh
                ref={i === 0 ? nitroLeftRef : nitroRightRef}
                position={[0, 0, -0.35]}
                rotation={[Math.PI / 2, 0, 0]}
                visible={false}
              >
                <coneGeometry args={[0.16, 0.55, 8]} />
                <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={3.5} />
              </mesh>
            </group>
          ))}
        </group>

        {/* 4 Independent Chunky Off-Road Wheels */}
        {/* Front-Left Wheel */}
        <group ref={flWheelRef} position={[-0.92, 0.28, 0.82]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.28, 18]} />
            <meshStandardMaterial color="#111827" roughness={0.85} />
          </mesh>
          {/* Cyan Rim Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.14, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 12]} />
            <meshStandardMaterial color="#61A5FF" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Front-Right Wheel */}
        <group ref={frWheelRef} position={[0.92, 0.28, 0.82]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.28, 18]} />
            <meshStandardMaterial color="#111827" roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.14, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 12]} />
            <meshStandardMaterial color="#61A5FF" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Rear-Left Wheel */}
        <group ref={rlWheelRef} position={[-0.92, 0.28, -0.82]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.28, 18]} />
            <meshStandardMaterial color="#111827" roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.14, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 12]} />
            <meshStandardMaterial color="#61A5FF" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Rear-Right Wheel */}
        <group ref={rrWheelRef} position={[0.92, 0.28, -0.82]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.28, 18]} />
            <meshStandardMaterial color="#111827" roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.14, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 12]} />
            <meshStandardMaterial color="#61A5FF" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
}
