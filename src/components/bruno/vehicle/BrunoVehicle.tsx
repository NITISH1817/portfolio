import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { vehicleInputs } from '../VehicleController';
import { carAudio } from '../CarAudio';
import { vehicleState } from '../VehiclePhysics';
import { useGameStore } from '../../../store/gameStore';

export const brunoVehicleState = vehicleState;

if (typeof window !== 'undefined') {
  (window as any).__VEHICLE_STATE__ = brunoVehicleState;
}

interface BrunoVehicleProps {
  initialPosition?: [number, number, number];
}

export default function BrunoVehicle({
  initialPosition = [0, 0.8, 12]
}: BrunoVehicleProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualMeshRef = useRef<THREE.Group>(null);
  const cabinRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Group>(null);

  // 4 Independent Wheels
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

  // Sync reference
  useEffect(() => {
    brunoVehicleState.rigidBodyRef = rigidBodyRef;
    brunoVehicleState.position.set(...initialPosition);
    if (typeof window !== 'undefined') {
      (window as any).__VEHICLE_STATE__ = brunoVehicleState;
    }
  }, [initialPosition]);

  // Teleport & Respawn Event Listeners (e.g. Press 'R' or click Reset)
  useEffect(() => {
    const handleTeleport = (e: CustomEvent<[number, number, number]>) => {
      const [tx, ty, tz] = e.detail;
      if (rigidBodyRef.current) {
        rigidBodyRef.current.setTranslation({ x: tx, y: ty + 1.2, z: tz }, true);
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

    const latVel = linvel.x * right.x + linvel.z * right.z;
    const speedMagnitude = Math.sqrt(linvel.x * linvel.x + linvel.z * linvel.z);
    brunoVehicleState.speed = speedMagnitude;

    // 2. Poll Gamepad Input
    const inputs = { ...vehicleInputs };
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0] || gamepads[1];
      if (gp) {
        if (gp.axes[0] < -0.2) inputs.left = true;
        if (gp.axes[0] > 0.2) inputs.right = true;
        if (gp.buttons[7]?.pressed || gp.buttons[0]?.pressed) inputs.forward = true;
        if (gp.buttons[6]?.pressed || gp.buttons[1]?.pressed) inputs.backward = true;
        if (gp.buttons[2]?.pressed || gp.buttons[5]?.pressed) inputs.nitro = true;
        if (gp.buttons[3]?.pressed) inputs.brake = true;
        if (gp.buttons[8]?.pressed) {
          window.dispatchEvent(new CustomEvent('car-teleport', { detail: [0, 0.8, 12] }));
        }
      }
    }

    // 3. Nitro Boost Mechanics
    const currentNitro = store.nitroEnergy ?? 100;
    const isNitro = inputs.nitro && currentNitro > 5;
    if (isNitro) {
      store.setNitroEnergy(Math.max(0, currentNitro - 28 * dt));
      store.setIsNitroActive(true);
    } else {
      store.setNitroEnergy(Math.min(100, currentNitro + 14 * dt));
      store.setIsNitroActive(false);
    }
    brunoVehicleState.isNitroActive = isNitro;

    // Nitro flame scaling
    if (nitroLeftRef.current && nitroRightRef.current) {
      if (isNitro) {
        const flicker = 1.0 + Math.sin(state.clock.getElapsedTime() * 50) * 0.4;
        nitroLeftRef.current.visible = true;
        nitroRightRef.current.visible = true;
        nitroLeftRef.current.scale.set(1.2, 1.2, 2.2 * flicker);
        nitroRightRef.current.scale.set(1.2, 1.2, 2.2 * flicker);
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

    // 5. Jump Impulse Mechanics (Spacebar)
    const now = state.clock.getElapsedTime();
    if (inputs.brake && pos.y < 2.0 && now - lastJumpTime.current > 1.2 && !isDrifting) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: 360, z: 0 }, true);
      carAudio.playWoosh();
      lastJumpTime.current = now;
    }

    // 6. Responsive Acceleration & Braking Dynamics
    const normalMaxSpeed = 22.0; // ~80 km/h
    const boostedMaxSpeed = 33.0; // ~120 km/h
    const maxSpeed = isNitro ? boostedMaxSpeed : normalMaxSpeed;
    const accelRate = isNitro ? 34.0 : 20.0;
    const brakeRate = isDrifting ? 10.0 : 24.0;
    const drag = 2.8;

    let targetSpeed = currentSpeed.current;

    if (inputs.forward) {
      targetSpeed += accelRate * dt;
      if (targetSpeed > maxSpeed) targetSpeed = maxSpeed;
    } else if (inputs.backward) {
      if (targetSpeed > 0.5) {
        targetSpeed -= brakeRate * dt;
        if (targetSpeed < 0) targetSpeed = 0;
      } else {
        targetSpeed -= 14.0 * dt;
        if (targetSpeed < -9.0) targetSpeed = -9.0;
      }
    } else {
      targetSpeed *= Math.exp(-drag * dt);
      if (Math.abs(targetSpeed) < 0.08) targetSpeed = 0;
    }

    currentSpeed.current = targetSpeed;

    // Lateral friction grip
    const tireGrip = isDrifting ? 3.8 : 15.0;
    const newLatVel = latVel * Math.exp(-tireGrip * dt);

    // Speed-dependent steering
    const speedRatio = Math.min(Math.abs(targetSpeed) / 7.5, 1.0);
    const highSpeedStability = 1.0 / (1.0 + Math.abs(targetSpeed) * 0.03);

    const targetSteerAngle = steerInput * (isDrifting ? 0.55 : 0.44);
    currentSteer.current = THREE.MathUtils.lerp(
      currentSteer.current,
      targetSteerAngle,
      1.0 - Math.exp(-15.0 * dt)
    );
    brunoVehicleState.steerAngle = currentSteer.current;

    let targetAngvelY = 0;
    if (Math.abs(targetSpeed) > 0.1 && Math.abs(currentSteer.current) > 0.01) {
      const turnDirection = targetSpeed >= 0 ? 1 : -1;
      const turnRate = isDrifting ? 5.8 : 4.4;
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

    // 8. Toy Antenna Dynamic Sway
    if (antennaRef.current) {
      const antennaPitch = THREE.MathUtils.clamp(-targetSpeed * 0.025, -0.35, 0.2);
      const antennaRoll = THREE.MathUtils.clamp(-currentSteer.current * 0.2, -0.25, 0.25);
      antennaRef.current.rotation.x = THREE.MathUtils.lerp(antennaRef.current.rotation.x, antennaPitch, 0.2);
      antennaRef.current.rotation.z = THREE.MathUtils.lerp(antennaRef.current.rotation.z, antennaRoll, 0.2);
    }

    // 9. Wheels Visual Spin and Steering Camber
    const wheelRotDelta = (targetSpeed * dt) / 0.36;
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

    // 10. Brake Lights Material Update
    if (brakeLightMatRef.current) {
      const isBraking = inputs.brake || (inputs.backward && targetSpeed > 0.5);
      brakeLightMatRef.current.emissiveIntensity = isBraking ? 3.5 : 0.8;
    }

    // 11. Engine Pitch Audio Synthesis
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
      linearDamping={0.4}
      angularDamping={2.6}
      onCollisionEnter={() => {
        carAudio.playCrash(0.8);
      }}
    >
      {/* Authoritative Physical Box Collider */}
      <CuboidCollider args={[0.95, 0.5, 1.5]} position={[0, 0.55, 0]} friction={0.4} restitution={0.05} />

      {/* Upgraded Stylized Low-Poly Off-Roader Vehicle 3D Mesh */}
      <group ref={visualMeshRef} scale={[1.15, 1.15, 1.15]}>
        <group ref={cabinRef}>
          {/* Main Lacquer Red-Orange Chassis Body */}
          <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.65, 0.44, 2.6]} />
            <meshStandardMaterial color="#EF4444" roughness={0.3} metalness={0.2} flatShading />
          </mesh>

          {/* Warm Orange Hood Accent */}
          <mesh position={[0, 0.52, 0.45]} castShadow>
            <boxGeometry args={[1.3, 0.16, 1.1]} />
            <meshStandardMaterial color="#EA580C" roughness={0.35} flatShading />
          </mesh>

          {/* Front Radiator Grill (Black Matte) */}
          <mesh position={[0, 0.38, 1.32]} castShadow>
            <boxGeometry args={[1.2, 0.28, 0.08]} />
            <meshStandardMaterial color="#1E222A" roughness={0.9} />
          </mesh>

          {/* Front Bumper & Winch */}
          <mesh position={[0, 0.24, 1.42]} castShadow>
            <boxGeometry args={[1.7, 0.18, 0.18]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
          </mesh>

          {/* Dual Round Headlights with Warm Glow Lens */}
          {[-0.52, 0.52].map((x, i) => (
            <group key={i} position={[x, 0.42, 1.33]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
                <meshStandardMaterial color="#FEF08A" emissive="#FDE047" emissiveIntensity={1.8} />
              </mesh>
            </group>
          ))}

          {/* Tubular Black Roll Cage & Roof Structure */}
          {/* Front Cage Pillars */}
          {[-0.68, 0.68].map((x, i) => (
            <mesh key={`cage-front-${i}`} position={[x, 0.85, 0.2]} rotation={[0.25, 0, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.045, 0.85, 8]} />
              <meshStandardMaterial color="#1E222A" roughness={0.8} />
            </mesh>
          ))}
          {/* Rear Cage Pillars */}
          {[-0.68, 0.68].map((x, i) => (
            <mesh key={`cage-rear-${i}`} position={[x, 0.85, -0.65]} rotation={[-0.2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.045, 0.85, 8]} />
              <meshStandardMaterial color="#1E222A" roughness={0.8} />
            </mesh>
          ))}
          {/* Top Roof Crossbars */}
          <mesh position={[0, 1.25, -0.22]} castShadow>
            <boxGeometry args={[1.42, 0.06, 0.9]} />
            <meshStandardMaterial color="#1E222A" roughness={0.8} />
          </mesh>

          {/* Cockpit Interior & Bucket Seats */}
          <mesh position={[0, 0.62, -0.2]} castShadow>
            <boxGeometry args={[1.25, 0.18, 0.9]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          {[-0.32, 0.32].map((x, i) => (
            <mesh key={`seat-${i}`} position={[x, 0.82, -0.3]} castShadow>
              <boxGeometry args={[0.38, 0.35, 0.32]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
          ))}

          {/* Rear Mounted Spare Wheel on Angled Tailgate */}
          <group position={[0, 0.62, -1.35]} rotation={[-0.25, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.24, 18]} />
              <meshStandardMaterial color="#1E222A" roughness={0.9} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.02]}>
              <cylinderGeometry args={[0.16, 0.16, 0.26, 12]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
            </mesh>
          </group>

          {/* Rear LED Brake Light Bar */}
          <mesh position={[0, 0.42, -1.32]}>
            <boxGeometry args={[1.4, 0.1, 0.06]} />
            <meshStandardMaterial
              ref={brakeLightMatRef}
              color="#DC2626"
              emissive="#EF4444"
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Dual Chrome Exhaust Pipes */}
          {[-0.48, 0.48].map((x, i) => (
            <group key={`exhaust-${i}`} position={[x, 0.25, -1.35]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.07, 0.07, 0.18, 12]} />
                <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Nitro Flame Meshes */}
              <mesh
                ref={i === 0 ? nitroLeftRef : nitroRightRef}
                position={[0, 0, -0.32]}
                rotation={[Math.PI / 2, 0, 0]}
                visible={false}
              >
                <coneGeometry args={[0.15, 0.55, 8]} />
                <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={3.5} />
              </mesh>
            </group>
          ))}

          {/* Springy Toy Radio Antenna with Red Ball */}
          <group ref={antennaRef} position={[0.62, 1.25, -0.6]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.02, 0.9, 6]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.92, 0]} castShadow>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshStandardMaterial color="#EF4444" roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* =========================================================================
            4 VISIBLE CHUNKY OFF-ROAD WHEELS WITH VISIBLE ROTATION & CAMBER
        ========================================================================= */}
        {/* Front-Left Wheel */}
        <group ref={flWheelRef} position={[-0.96, 0.36, 0.82]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.3, 20]} />
            <meshStandardMaterial color="#1E222A" roughness={0.9} />
          </mesh>
          {/* White / Silver 5-Hole Dish Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.15, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.3} />
          </mesh>
        </group>

        {/* Front-Right Wheel */}
        <group ref={frWheelRef} position={[0.96, 0.36, 0.82]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.3, 20]} />
            <meshStandardMaterial color="#1E222A" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.3} />
          </mesh>
        </group>

        {/* Rear-Left Wheel */}
        <group ref={rlWheelRef} position={[-0.96, 0.36, -0.82]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.3, 20]} />
            <meshStandardMaterial color="#1E222A" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.15, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.3} />
          </mesh>
        </group>

        {/* Rear-Right Wheel */}
        <group ref={rrWheelRef} position={[0.96, 0.36, -0.82]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.3, 20]} />
            <meshStandardMaterial color="#1E222A" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.3} />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
}
