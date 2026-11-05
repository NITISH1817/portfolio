import React, { useRef, useEffect } from 'react';
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
  headingDegrees: number; // yaw angle in degrees (0-360)
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

interface VehiclePhysicsProps {
  initialPosition?: [number, number, number];
}

export default function VehiclePhysics({
  initialPosition = [0, 1.2, 0]
}: VehiclePhysicsProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualMeshRef = useRef<THREE.Group>(null);
  const cabinRef = useRef<THREE.Group>(null);

  // Wheel refs for spinning and steering
  const flWheelRef = useRef<THREE.Group>(null);
  const frWheelRef = useRef<THREE.Group>(null);
  const rlWheelRef = useRef<THREE.Group>(null);
  const rrWheelRef = useRef<THREE.Group>(null);

  // Nitro exhaust flame refs
  const nitroLeftFlameRef = useRef<THREE.Mesh>(null);
  const nitroRightFlameRef = useRef<THREE.Mesh>(null);

  // Brake light material refs
  const brakeLightMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Internal vehicle physics tracking
  const currentSpeed = useRef(0);
  const currentSteer = useRef(0);
  const currentYaw = useRef(0);
  const lastNitroSoundTime = useRef(0);
  const lastDriftSoundTime = useRef(0);
  const prevPosition = useRef(new THREE.Vector3(...initialPosition));

  // Headlights & Vehicle Color state from store
  const headlightsOn = useGameStore((s) => s.headlightsOn);
  const vehicleColor = useGameStore((s) => s.vehicleColor || '#DC2626');
  const prevSpeed = useRef(0);

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
    let deg = Math.round((heading * (180 / Math.PI)) % 360);
    if (deg < 0) deg += 360;
    vehicleState.headingDegrees = deg;
    currentYaw.current = heading;

    const latVel = linvel.x * right.x + linvel.z * right.z;
    const speedMagnitude = Math.sqrt(linvel.x * linvel.x + linvel.z * linvel.z);
    vehicleState.speed = speedMagnitude;

    // Track real-time physics acceleration (m/s^2)
    const accel = dt > 0 ? (speedMagnitude - prevSpeed.current) / dt : 0;
    prevSpeed.current = speedMagnitude;
    vehicleState.acceleration = accel;

    // Track Distance Driven for achievements
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
        const flicker = 1.0 + Math.sin(state.clock.getElapsedTime() * 50) * 0.4;
        nitroLeftFlameRef.current.visible = true;
        nitroRightFlameRef.current.visible = true;
        nitroLeftFlameRef.current.scale.set(1.2, 1.2, 2.2 * flicker);
        nitroRightFlameRef.current.scale.set(1.2, 1.2, 2.2 * flicker);
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
    // SPEED DYNAMICS
    // ==========================================
    const normalMaxSpeed = 22.0; // m/s (~80 km/h)
    const boostedMaxSpeed = 34.0; // m/s (~122 km/h with Nitro)
    const maxForwardSpeed = isNitro ? boostedMaxSpeed : normalMaxSpeed;
    const maxReverseSpeed = -8.0;
    const normalAccel = 18.0;
    const boostedAccel = 32.0;
    const accelerationRate = isNitro ? boostedAccel : normalAccel;
    const reverseRate = 12.0;
    const dragCoeff = 3.2;
    const brakeDecel = isDrifting ? 7.5 : 24.0;
    const tireGrip = isDrifting ? 3.8 : 14.0;

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

    if (inputs.brake && !isDrifting) {
      targetSpeed *= Math.exp(-brakeDecel * dt);
      if (Math.abs(targetSpeed) < 0.1) targetSpeed = 0;
    }

    currentSpeed.current = targetSpeed;

    // Lateral friction
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
    vehicleState.steerAngle = currentSteer.current;

    let targetAngvelY = 0;
    if (Math.abs(targetSpeed) > 0.1 && Math.abs(currentSteer.current) > 0.01) {
      const turnDirection = targetSpeed >= 0 ? 1 : -1;
      const turnRate = isDrifting ? 5.8 : 4.2;
      targetAngvelY =
        currentSteer.current * turnRate * speedRatio * highSpeedStability * turnDirection;
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

    // Dynamic Suspension Animation: Pitch (acceleration squat / braking dive) & Roll (banking into turns)
    if (cabinRef.current) {
      const accelPitch = isNitro ? -0.06 : inputs.forward ? -0.035 : 0;
      const brakePitch = inputs.brake || inputs.backward ? 0.045 : 0;
      const pitch = THREE.MathUtils.clamp(-targetSpeed * 0.003 + accelPitch + brakePitch, -0.1, 0.1);

      const rollFactor = isDrifting ? 0.15 : 0.085;
      const roll = THREE.MathUtils.clamp(
        -currentSteer.current * (speedMagnitude / 15) * rollFactor,
        -0.15,
        0.15
      );

      const hornShake = inputs.horn ? Math.sin(state.clock.getElapsedTime() * 60) * 0.02 : 0;
      const speedVibe = speedMagnitude > 20 ? (Math.random() - 0.5) * 0.006 : 0;

      cabinRef.current.rotation.x = THREE.MathUtils.lerp(
        cabinRef.current.rotation.x,
        pitch + hornShake + speedVibe,
        0.18
      );
      cabinRef.current.rotation.z = THREE.MathUtils.lerp(
        cabinRef.current.rotation.z,
        roll,
        0.18
      );
    }

    // Brake light intensity
    if (brakeLightMatRef.current) {
      const isBraking = inputs.brake || (inputs.backward && targetSpeed > 0.5);
      brakeLightMatRef.current.emissiveIntensity = isBraking ? 4.5 : 1.2;
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      type="dynamic"
      position={initialPosition}
      enabledRotations={[false, true, false]}
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

      {/* Upgraded Premium Cyber-Off-Roader 3D Mesh */}
      <group ref={visualMeshRef} scale={[1.25, 1.25, 1.25]}>
        <group ref={cabinRef}>
          {/* Main Chiseled Automotive Body with Metallic Lacquer */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.72, 0.44, 2.75]} />
            <meshStandardMaterial
              color={vehicleColor}
              roughness={0.2}
              metalness={0.7}
              envMapIntensity={1.2}
            />
          </mesh>

          {/* Lower Aerodynamic Charcoal Skirts / Rocker Panels */}
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[1.76, 0.12, 2.8]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} metalness={0.3} />
          </mesh>

          {/* Polished Chrome Front Bullbar & Winch Mount */}
          <mesh position={[0, 0.24, 1.44]} castShadow>
            <boxGeometry args={[1.65, 0.22, 0.2]} />
            <meshStandardMaterial color="#1E232A" roughness={0.7} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.44, 1.48]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 1.45, 12]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.15} metalness={0.9} />
          </mesh>

          {/* Front Air Dam & Black Grille */}
          <mesh position={[0, 0.36, 1.39]}>
            <boxGeometry args={[1.15, 0.22, 0.04]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>

          {/* Rear Aerodynamic Diffuser & Bumper */}
          <mesh position={[0, 0.22, -1.42]} castShadow>
            <boxGeometry args={[1.68, 0.24, 0.18]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>

          {/* Rear Off-Road Spare Wheel with Carbon Hub */}
          <group position={[0, 0.58, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.2, 18]} />
              <meshStandardMaterial color="#18181B" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.06, 18]} />
              <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.8} />
            </mesh>
          </group>

          {/* Flared Matte Black Wheel Arches */}
          {[-0.91, 0.91].map((x, i) => (
            <React.Fragment key={i}>
              <mesh position={[x, 0.3, 0.82]}>
                <boxGeometry args={[0.15, 0.18, 0.72]} />
                <meshStandardMaterial color="#18181B" roughness={0.8} />
              </mesh>
              <mesh position={[x, 0.3, -0.82]}>
                <boxGeometry args={[0.15, 0.18, 0.72]} />
                <meshStandardMaterial color="#18181B" roughness={0.8} />
              </mesh>
            </React.Fragment>
          ))}

          {/* Tapered Fastback Cabin Roof (Midnight Charcoal & Dark Pillars) */}
          <mesh position={[0, 0.75, -0.08]} castShadow>
            <boxGeometry args={[1.36, 0.46, 1.58]} />
            <meshStandardMaterial
              color={vehicleColor}
              roughness={0.25}
              metalness={0.65}
            />
          </mesh>

          {/* Premium Blue-Reflective Tinted Glass Windows */}
          {/* Front Windshield */}
          <mesh position={[0, 0.76, 0.62]} rotation={[0.32, 0, 0]} castShadow>
            <planeGeometry args={[1.22, 0.44]} />
            <meshStandardMaterial
              color="#0284C7"
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Rear Windshield */}
          <mesh position={[0, 0.76, -0.9]} rotation={[-0.32, Math.PI, 0]} castShadow>
            <planeGeometry args={[1.22, 0.4]} />
            <meshStandardMaterial
              color="#0284C7"
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Side Glass Panels */}
          {[-0.69, 0.69].map((x, i) => (
            <mesh key={i} position={[x, 0.75, -0.08]} rotation={[0, i === 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
              <planeGeometry args={[1.4, 0.36]} />
              <meshStandardMaterial
                color="#0284C7"
                roughness={0.05}
                metalness={0.9}
                transparent
                opacity={0.82}
              />
            </mesh>
          ))}

          {/* Low-Profile Aero Roof Rack */}
          <mesh position={[0, 1.01, -0.08]} castShadow>
            <boxGeometry args={[1.28, 0.06, 1.35]} />
            <meshStandardMaterial color="#0F172A" roughness={0.7} metalness={0.5} />
          </mesh>

          {/* 4 LED High-Power Auxiliary Roof Projectors */}
          {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
            <group key={i} position={[x, 1.12, 0.52]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#1E293B" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.06]}>
                <circleGeometry args={[0.075, 14]} />
                <meshStandardMaterial
                  color="#FEF08A"
                  emissive="#FEF08A"
                  emissiveIntensity={headlightsOn ? 3.0 : 0.2}
                />
              </mesh>
            </group>
          ))}

          {/* Modern Multi-Element Front LED Headlights */}
          {[-0.56, 0.56].map((x, i) => (
            <group key={i} position={[x, 0.38, 1.39]}>
              {/* Headlight housing */}
              <mesh>
                <boxGeometry args={[0.32, 0.14, 0.06]} />
                <meshStandardMaterial color="#020617" roughness={0.9} />
              </mesh>
              {/* LED Projector Lens */}
              <mesh position={[0, 0, 0.035]}>
                <planeGeometry args={[0.28, 0.1]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive="#E0F2FE"
                  emissiveIntensity={headlightsOn ? 3.8 : 0.2}
                />
              </mesh>
            </group>
          ))}

          {/* Front Dual Projector Spotlights (Controlled by L) */}
          {headlightsOn && (
            <spotLight
              position={[0, 0.45, 1.38]}
              target-position={[0, 0, 16]}
              angle={0.65}
              penumbra={0.4}
              intensity={5.2}
              color="#FEF3C7"
              castShadow
              shadow-mapSize={[512, 512]}
            />
          )}

          {/* Full-Width Rear LED Lightbar with Dynamic Brake Emission */}
          <mesh position={[0, 0.42, -1.39]}>
            <boxGeometry args={[1.5, 0.08, 0.04]} />
            <meshStandardMaterial
              ref={brakeLightMatRef}
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Dual Polished Chrome Exhaust Tips with Cyan Nitro Flames */}
          <group position={[-0.45, 0.18, -1.45]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.16, 14]} />
              <meshStandardMaterial color="#94A3B8" roughness={0.15} metalness={0.95} />
            </mesh>
            <mesh
              ref={nitroLeftFlameRef}
              visible={false}
              position={[0, 0, -0.4]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <coneGeometry args={[0.16, 0.85, 14]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.88} />
            </mesh>
          </group>

          <group position={[0.45, 0.18, -1.45]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.16, 14]} />
              <meshStandardMaterial color="#94A3B8" roughness={0.15} metalness={0.95} />
            </mesh>
            <mesh
              ref={nitroRightFlameRef}
              visible={false}
              position={[0, 0, -0.4]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <coneGeometry args={[0.16, 0.85, 14]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.88} />
            </mesh>
          </group>
        </group>

        {/* 4 Premium Detailed Turbine Alloy Wheels */}
        <group ref={flWheelRef} position={[-0.93, 0.28, 0.82]}>
          <DetailedWheel isLeft />
        </group>
        <group ref={frWheelRef} position={[0.93, 0.28, 0.82]}>
          <DetailedWheel />
        </group>
        <group ref={rlWheelRef} position={[-0.93, 0.28, -0.82]}>
          <DetailedWheel isLeft />
        </group>
        <group ref={rrWheelRef} position={[0.93, 0.28, -0.82]}>
          <DetailedWheel />
        </group>
      </group>
    </RigidBody>
  );
}

function DetailedWheel({ isLeft = false }: { isLeft?: boolean }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* High-Traction Rubber Tire with Tread */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.26, 20]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>

      {/* Machined Alloy Rim Face */}
      <mesh position={[0, isLeft ? -0.09 : 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.12, 18]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Ventilated Steel Disc Brake Rotor */}
      <mesh position={[0, isLeft ? 0.04 : -0.04, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
        <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Red Brembo-Style Brake Caliper */}
      <mesh position={[0.1, isLeft ? 0.05 : -0.05, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.09]} />
        <meshStandardMaterial color="#EF4444" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Red Center Hubcap Nut */}
      <mesh position={[0, isLeft ? -0.14 : 0.14, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.05, 8]} />
        <meshStandardMaterial color="#DC2626" metalness={0.7} />
      </mesh>
    </group>
  );
}
