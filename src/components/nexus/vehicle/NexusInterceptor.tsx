import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { vehicleInputs } from '../vehicle/VehicleController';
import { carAudio } from '../../bruno/CarAudio';
import { useGameStore } from '../../../store/gameStore';

export interface VehicleState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  heading: number;
  headingDegrees: number;
  speed: number;
  acceleration: number;
  forward: THREE.Vector3;
  right: THREE.Vector3;
  rigidBodyRef: React.RefObject<RapierRigidBody | null> | null;
  isDrifting: boolean;
  isNitroActive: boolean;
  steerAngle: number;
}

export const vehicleState: VehicleState = {
  position: new THREE.Vector3(0, 1.2, 0),
  quaternion: new THREE.Quaternion(),
  heading: 0,
  headingDegrees: 0,
  speed: 0,
  acceleration: 0,
  forward: new THREE.Vector3(0, 0, 1),
  right: new THREE.Vector3(1, 0, 0),
  rigidBodyRef: null,
  isDrifting: false,
  isNitroActive: false,
  steerAngle: 0
};

if (typeof window !== 'undefined') {
  (window as any).__VEHICLE_STATE__ = vehicleState;
}

interface NexusInterceptorProps {
  initialPosition?: [number, number, number];
}

export default function NexusInterceptor({
  initialPosition = [0, 1.2, 0]
}: NexusInterceptorProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualMeshRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);

  // Wheel refs for spinning and steering
  const flWheelRef = useRef<THREE.Group>(null);
  const frWheelRef = useRef<THREE.Group>(null);
  const rlWheelRef = useRef<THREE.Group>(null);
  const rrWheelRef = useRef<THREE.Group>(null);

  // Nitro exhaust flame refs
  const nitroLeftFlameRef = useRef<THREE.Mesh>(null);
  const nitroRightFlameRef = useRef<THREE.Mesh>(null);

  // Dynamic light material refs
  const brakeLightMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const headlightBeamLeftRef = useRef<THREE.SpotLight>(null);
  const headlightBeamRightRef = useRef<THREE.SpotLight>(null);

  // Internal vehicle physics tracking
  const currentSpeed = useRef(0);
  const currentSteer = useRef(0);
  const currentYaw = useRef(0);
  const prevPosition = useRef(new THREE.Vector3(...initialPosition));

  // Headlights & vehicle preferences from store
  const headlightsOn = useGameStore((s) => s.headlightsOn);
  const vehicleColor = useGameStore((s) => s.vehicleColor || '#FF8A3D');

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
      }
    };
    window.addEventListener('car-teleport', handleTeleport as EventListener);
    return () => window.removeEventListener('car-teleport', handleTeleport as EventListener);
  }, []);

  useFrame((state, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const dt = Math.min(delta, 0.05);
    const inputs = vehicleInputs;

    // 1. Calculate Target Speed with Nitro & Reverse
    const topForwardSpeed = inputs.boost ? 38.0 : 26.0;
    const topReverseSpeed = 12.0;
    const accelRate = inputs.boost ? 28.0 : 18.0;
    const brakeRate = 34.0;
    const coastFriction = 7.0;

    let targetSpeed = currentSpeed.current;

    if (inputs.forward) {
      targetSpeed = Math.min(targetSpeed + accelRate * dt, topForwardSpeed);
    } else if (inputs.backward) {
      targetSpeed = Math.max(targetSpeed - accelRate * dt, -topReverseSpeed);
    } else {
      if (targetSpeed > 0) {
        targetSpeed = Math.max(0, targetSpeed - coastFriction * dt);
      } else if (targetSpeed < 0) {
        targetSpeed = Math.min(0, targetSpeed + coastFriction * dt);
      }
    }

    if (inputs.brake) {
      if (targetSpeed > 0) {
        targetSpeed = Math.max(0, targetSpeed - brakeRate * dt);
      } else if (targetSpeed < 0) {
        targetSpeed = Math.min(0, targetSpeed + brakeRate * dt);
      }
    }

    currentSpeed.current = targetSpeed;

    // 2. Calculate Steering with Speed Damping
    const speedMagnitude = Math.abs(currentSpeed.current);
    const speedFactor = Math.max(0.35, 1.0 - (speedMagnitude / topForwardSpeed) * 0.55);
    const maxSteerAngle = 0.58 * speedFactor;
    const steerSpeed = 6.0;

    let targetSteer = 0;
    if (inputs.left) targetSteer += maxSteerAngle;
    if (inputs.right) targetSteer -= maxSteerAngle;

    currentSteer.current = THREE.MathUtils.lerp(currentSteer.current, targetSteer, steerSpeed * dt);

    // 3. Calculate Angular Turn & Drifting Mechanics
    const isDrifting = inputs.handbrake && speedMagnitude > 4.0;
    const driftMultiplier = isDrifting ? 1.6 : 1.0;
    const isReversing = currentSpeed.current < -0.2;
    const reverseTurnFactor = isReversing ? -1.0 : 1.0;

    if (speedMagnitude > 0.1) {
      const turnVelocity = (currentSpeed.current / 2.8) * Math.tan(currentSteer.current) * driftMultiplier * reverseTurnFactor;
      currentYaw.current += turnVelocity * dt;
    }

    // 4. Update Rapier Linear Velocity
    const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), currentYaw.current);
    rb.setRotation(rot, true);

    const fwdVec = new THREE.Vector3(0, 0, 1).applyQuaternion(rot);
    const linVel = fwdVec.multiplyScalar(currentSpeed.current);
    const currentRbVel = rb.linvel();
    rb.setLinvel({ x: linVel.x, y: currentRbVel.y, z: linVel.z }, true);

    // 5. Update Global Vehicle Telemetry State
    const trans = rb.translation();
    vehicleState.position.set(trans.x, trans.y, trans.z);
    vehicleState.quaternion.copy(rot);
    vehicleState.heading = currentYaw.current;
    vehicleState.headingDegrees = ((currentYaw.current * 180 / Math.PI) % 360 + 360) % 360;
    vehicleState.speed = speedMagnitude;
    vehicleState.isDrifting = isDrifting;
    vehicleState.isNitroActive = inputs.boost && speedMagnitude > 2.0;
    vehicleState.steerAngle = currentSteer.current;
    vehicleState.forward.set(0, 0, 1).applyQuaternion(rot);
    vehicleState.right.set(1, 0, 0).applyQuaternion(rot);

    // 6. Wheel Spinning & Steering Geometry
    const wheelRotDelta = (currentSpeed.current / 0.42) * dt;
    [flWheelRef, frWheelRef, rlWheelRef, rrWheelRef].forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.x += wheelRotDelta;
      }
    });

    if (flWheelRef.current) flWheelRef.current.rotation.y = currentSteer.current;
    if (frWheelRef.current) frWheelRef.current.rotation.y = currentSteer.current;

    // 7. Chassis Suspension Roll & Pitch
    if (chassisRef.current) {
      const roll = -currentSteer.current * (speedMagnitude / topForwardSpeed) * (isDrifting ? 0.22 : 0.12);
      const pitch = (inputs.forward ? -0.04 : 0) + (inputs.brake || inputs.backward ? 0.06 : 0);
      chassisRef.current.rotation.z = THREE.MathUtils.lerp(chassisRef.current.rotation.z, roll, 0.18);
      chassisRef.current.rotation.x = THREE.MathUtils.lerp(chassisRef.current.rotation.x, pitch, 0.18);
    }

    // 8. Brake Light & Headlight Intensity
    if (brakeLightMatRef.current) {
      const isBraking = inputs.brake || (inputs.backward && currentSpeed.current > 0.5);
      brakeLightMatRef.current.emissiveIntensity = isBraking ? 4.5 : 1.2;
    }

    // 9. Nitro Exhaust Flame Dynamics
    const showNitro = inputs.boost && speedMagnitude > 2.0;
    [nitroLeftFlameRef, nitroRightFlameRef].forEach((flame) => {
      if (flame.current) {
        flame.current.visible = showNitro;
        if (showNitro) {
          const scale = 0.8 + Math.random() * 0.4;
          flame.current.scale.set(scale, scale, scale * 1.5);
        }
      }
    });
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      type="dynamic"
      position={initialPosition}
      enabledRotations={[false, true, false]}
      linearDamping={0.45}
      angularDamping={2.2}
      onCollisionEnter={() => carAudio.playCrash(0.8)}
    >
      {/* Authoritative Single Vehicle Collider */}
      <CuboidCollider
        args={[1.1, 0.55, 1.85]}
        position={[0, 0.55, 0]}
        friction={0.5}
        restitution={0.05}
      />

      {/* NEXUS Cyber Interceptor 3D Model */}
      <group ref={visualMeshRef} scale={[1.2, 1.2, 1.2]}>
        <group ref={chassisRef}>
          {/* Main Aerodynamic Obsidian Chassis with Metallic Flake */}
          <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.82, 0.38, 3.2]} />
            <meshStandardMaterial
              color="#0B0F19"
              roughness={0.18}
              metalness={0.9}
            />
          </mesh>

          {/* Signature Hood Scoop & Plasma Orange Racing Stripes */}
          <mesh position={[0, 0.58, 0.4]} castShadow>
            <boxGeometry args={[0.5, 0.04, 1.8]} />
            <meshStandardMaterial
              color="#FF8A3D"
              emissive="#FF8A3D"
              emissiveIntensity={2.5}
            />
          </mesh>

          {/* Aggressive Front Splitter */}
          <mesh position={[0, 0.16, 1.68]} castShadow>
            <boxGeometry args={[1.88, 0.08, 0.4]} />
            <meshStandardMaterial color="#030712" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Tinted Aerodynamic Glass Cockpit Canopy */}
          <mesh position={[0, 0.72, -0.1]} castShadow>
            <boxGeometry args={[1.35, 0.45, 1.5]} />
            <meshStandardMaterial
              color="#0F172A"
              roughness={0.08}
              metalness={0.95}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* High-Downforce Rear Wing / Spoiler */}
          <group position={[0, 0.88, -1.45]}>
            {/* Wing Blade */}
            <mesh castShadow>
              <boxGeometry args={[1.9, 0.06, 0.38]} />
              <meshStandardMaterial color="#0A0E1A" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Struts */}
            {[-0.65, 0.65].map((sx, i) => (
              <mesh key={i} position={[sx, -0.18, 0]} castShadow>
                <boxGeometry args={[0.06, 0.35, 0.2]} />
                <meshStandardMaterial color="#334155" metalness={0.9} />
              </mesh>
            ))}
          </group>

          {/* Dual Laser Electric-Blue Headlights */}
          {[-0.68, 0.68].map((x, i) => (
            <mesh key={`hl-${i}`} position={[x, 0.38, 1.62]}>
              <boxGeometry args={[0.3, 0.1, 0.06]} />
              <meshStandardMaterial
                color="#38BDF8"
                emissive="#38BDF8"
                emissiveIntensity={4.5}
              />
            </mesh>
          ))}

          {/* Seamless Horizon-Red LED Taillight Strip */}
          <mesh position={[0, 0.44, -1.62]}>
            <boxGeometry args={[1.68, 0.08, 0.06]} />
            <meshStandardMaterial
              ref={brakeLightMatRef}
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Dual Plasma Nitro Exhaust Thrusters */}
          {[-0.42, 0.42].map((x, i) => (
            <group key={`exhaust-${i}`} position={[x, 0.28, -1.62]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.12, 0.18, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
              {/* Reactive Nitro Flame */}
              <mesh
                ref={i === 0 ? nitroLeftFlameRef : nitroRightFlameRef}
                position={[0, 0, -0.4]}
                rotation={[Math.PI / 2, 0, 0]}
                visible={false}
              >
                <coneGeometry args={[0.14, 0.6, 8]} />
                <meshBasicMaterial color="#38BDF8" />
              </mesh>
            </group>
          ))}
        </group>

        {/* 4 Turbine Cyber Wheels */}
        {/* Front-Left Wheel */}
        <group position={[-1.02, 0.35, 1.05]}>
          <group ref={flWheelRef}>
            <CyberWheel />
          </group>
        </group>

        {/* Front-Right Wheel */}
        <group position={[1.02, 0.35, 1.05]}>
          <group ref={frWheelRef}>
            <CyberWheel />
          </group>
        </group>

        {/* Rear-Left Wheel */}
        <group position={[-1.02, 0.35, -1.05]}>
          <group ref={rlWheelRef}>
            <CyberWheel />
          </group>
        </group>

        {/* Rear-Right Wheel */}
        <group position={[1.02, 0.35, -1.05]}>
          <group ref={rrWheelRef}>
            <CyberWheel />
          </group>
        </group>
      </group>
    </RigidBody>
  );
}

function CyberWheel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Heavy-Tread Tire */}
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.3, 18]} />
        <meshStandardMaterial color="#0A0A0E" roughness={0.9} />
      </mesh>
      {/* 5-Spoke Titanium Turbine Rim */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.08, 18]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.15} metalness={0.9} />
      </mesh>
      {/* Neon Hub Cap */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
        <meshStandardMaterial color="#FF8A3D" emissive="#FF8A3D" emissiveIntensity={3.0} />
      </mesh>
    </group>
  );
}

