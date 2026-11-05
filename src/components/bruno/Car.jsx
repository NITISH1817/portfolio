import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { usePhysics } from './PhysicsContext';
import { controlsState } from './useCarControls';
import { carAudio } from './CarAudio';

export default function Car({ initialPosition = [0, 1.5, 0] }) {
  const { world, addBody, removeBody, carBodyRef } = usePhysics();
  const carMeshRef = useRef();
  const cabinRef = useRef();
  const antennaRef = useRef();

  // Wheels refs
  const flWheelRef = useRef();
  const frWheelRef = useRef();
  const rlWheelRef = useRef();
  const rrWheelRef = useRef();

  // Dust / particle puffs
  const dustParticlesRef = useRef([]);
  const [particles] = useState(() =>
    Array.from({ length: 16 }, () => ({
      position: new THREE.Vector3(),
      scale: 0,
      opacity: 0,
      life: 0
    }))
  );

  // Car Physics Body setup
  const carBody = useMemo(() => {
    const chassisShape = new CANNON.Box(new CANNON.Vec3(0.9, 0.35, 1.4));
    const body = new CANNON.Body({
      mass: 180,
      position: new CANNON.Vec3(...initialPosition),
      linearDamping: 0.22,
      angularDamping: 0.75
    });
    body.addShape(chassisShape, new CANNON.Vec3(0, 0.15, 0));
    return body;
  }, [initialPosition]);

  useEffect(() => {
    carBodyRef.current = carBody;
    addBody(carMeshRef, carBody, () => {
      // Impact occurred
    });

    return () => {
      removeBody(carBody);
      carBodyRef.current = null;
    };
  }, [carBody, addBody, removeBody, carBodyRef]);

  // Teleport helper for external nav
  useEffect(() => {
    const handleTeleport = (e) => {
      const [tx, ty, tz] = e.detail;
      carBody.position.set(tx, ty + 1.5, tz);
      carBody.velocity.set(0, 0, 0);
      carBody.angularVelocity.set(0, 0, 0);
      carBody.quaternion.set(0, 0, 0, 1);
    };
    window.addEventListener('car-teleport', handleTeleport);
    return () => window.removeEventListener('car-teleport', handleTeleport);
  }, [carBody]);

  // Audio / horn debounce
  const lastHornTime = useRef(0);

  // Frame simulation loop
  useFrame((state, delta) => {
    if (!carBody) return;

    const {
      forward,
      backward,
      left,
      right,
      brake,
      reset,
      horn,
      steerValue,
      throttleValue
    } = controlsState;

    // Handle Reset
    if (reset) {
      carBody.position.set(0, 1.5, 0);
      carBody.velocity.set(0, 0, 0);
      carBody.angularVelocity.set(0, 0, 0);
      carBody.quaternion.set(0, 0, 0, 1);
      return;
    }

    // Handle Horn
    if (horn && performance.now() - lastHornTime.current > 400) {
      carAudio.playHorn();
      lastHornTime.current = performance.now();
      if (antennaRef.current) {
        antennaRef.current.rotation.x = 0.5;
      }
    }

    // Direction vectors from car orientation
    const forwardVec = new CANNON.Vec3(0, 0, 1);
    carBody.quaternion.vmult(forwardVec, forwardVec);

    const rightVec = new CANNON.Vec3(1, 0, 0);
    carBody.quaternion.vmult(rightVec, rightVec);

    const upVec = new CANNON.Vec3(0, 1, 0);
    carBody.quaternion.vmult(upVec, upVec);

    // Speed calculation
    const forwardSpeed = carBody.velocity.dot(forwardVec);
    const lateralSpeed = carBody.velocity.dot(rightVec);
    const totalSpeed = Math.sqrt(
      carBody.velocity.x * carBody.velocity.x + carBody.velocity.z * carBody.velocity.z
    );

    // Sync position to shared state for radar mini-map
    controlsState.lastCarX = carBody.position.x;
    controlsState.lastCarZ = carBody.position.z;
    controlsState.lastCarRotY = Math.atan2(forwardVec.x, forwardVec.z);

    // Throttle input (-1 to 1)
    let throttle = throttleValue;
    if (forward) throttle += 1;
    if (backward) throttle -= 0.75;
    throttle = Math.min(Math.max(throttle, -0.75), 1.0);

    // Steering input (-1 to 1)
    let steer = steerValue;
    if (left) steer += 1;
    if (right) steer -= 1;
    steer = Math.min(Math.max(steer, -1.0), 1.0);

    const isGrounded = carBody.position.y < 1.6;

    // Driving forces
    const engineForce = 1800;
    if (isGrounded && Math.abs(throttle) > 0.05) {
      const force = forwardVec.scale(throttle * engineForce);
      carBody.applyForce(force, carBody.position);
    }

    // Braking
    if (brake && isGrounded) {
      carBody.velocity.x *= 0.92;
      carBody.velocity.z *= 0.92;
    }

    // Lateral grip friction (eliminates infinite sliding while allowing subtle drift)
    if (isGrounded) {
      const driftGrip = brake ? 0.35 : 0.82;
      const counterImpulse = rightVec.scale(-lateralSpeed * carBody.mass * driftGrip * delta * 15);
      carBody.applyImpulse(counterImpulse, carBody.position);
    }

    // Steering torque
    if (isGrounded && Math.abs(steer) > 0.05) {
      // Only turn if moving or applying throttle
      const turnMultiplier = Math.min(Math.max(Math.abs(forwardSpeed) * 0.4 + 0.5, 0.4), 1.4);
      const direction = forwardSpeed >= -0.2 ? 1 : -1;
      const turnTorque = steer * 7.5 * direction * turnMultiplier;
      carBody.angularVelocity.y = turnTorque;
    } else if (isGrounded) {
      // Natural steering self-alignment
      carBody.angularVelocity.y *= 0.88;
    }

    // Aerodynamic downforce to keep car planted at high speed
    if (isGrounded && totalSpeed > 2) {
      carBody.applyForce(new CANNON.Vec3(0, -totalSpeed * 65, 0), carBody.position);
    }

    // Upright stabilization if tilted too far
    if (upVec.y < 0.5) {
      carBody.quaternion.set(0, 0, 0, 1);
      carBody.position.y += 0.8;
      carBody.angularVelocity.set(0, 0, 0);
    }

    // Update sound
    const isAccelerating = Math.abs(throttle) > 0.1;
    carAudio.updateEngine(totalSpeed / 18, isAccelerating);

    // Animate wheels
    const wheelRotSpeed = (forwardSpeed * delta * 8) / 0.35;
    const targetSteerAngle = steer * 0.42;

    [flWheelRef, frWheelRef].forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.x += wheelRotSpeed;
        ref.current.rotation.y = THREE.MathUtils.lerp(
          ref.current.rotation.y,
          targetSteerAngle,
          0.2
        );
      }
    });

    [rlWheelRef, rrWheelRef].forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.x += wheelRotSpeed;
      }
    });

    // Cabin body roll & pitch for juicy game feel
    if (cabinRef.current) {
      const pitch = THREE.MathUtils.clamp(-throttle * 0.07 + (brake ? 0.08 : 0), -0.15, 0.15);
      const roll = THREE.MathUtils.clamp(-steer * (totalSpeed / 15) * 0.08, -0.12, 0.12);
      cabinRef.current.rotation.x = THREE.MathUtils.lerp(cabinRef.current.rotation.x, pitch, 0.15);
      cabinRef.current.rotation.z = THREE.MathUtils.lerp(cabinRef.current.rotation.z, roll, 0.15);
    }

    // Antenna wiggle
    if (antennaRef.current) {
      antennaRef.current.rotation.x = THREE.MathUtils.lerp(
        antennaRef.current.rotation.x,
        -forwardSpeed * 0.03,
        0.1
      );
      antennaRef.current.rotation.z = THREE.MathUtils.lerp(
        antennaRef.current.rotation.z,
        -steer * 0.1,
        0.1
      );
    }

    // Dust particles when drifting or high acceleration
    if (isGrounded && (Math.abs(lateralSpeed) > 1.8 || (isAccelerating && totalSpeed < 5))) {
      const p = particles.find((pt) => pt.life <= 0);
      if (p && carMeshRef.current) {
        p.position.copy(carMeshRef.current.position);
        p.position.y += 0.1;
        p.position.x += (Math.random() - 0.5) * 0.8;
        p.position.z += (Math.random() - 0.5) * 0.8;
        p.scale = 0.2 + Math.random() * 0.25;
        p.opacity = 0.6;
        p.life = 0.5;
      }
    }

    // Update dust particles
    particles.forEach((p, i) => {
      if (p.life > 0) {
        p.life -= delta;
        p.scale += delta * 0.8;
        p.opacity -= delta * 1.2;
        p.position.y += delta * 0.4;
        const mesh = dustParticlesRef.current[i];
        if (mesh) {
          mesh.position.copy(p.position);
          mesh.scale.setScalar(Math.max(p.scale, 0.01));
          mesh.material.opacity = Math.max(p.opacity, 0);
        }
      } else {
        const mesh = dustParticlesRef.current[i];
        if (mesh) {
          mesh.scale.setScalar(0.0001);
        }
      }
    });
  });

  return (
    <>
      <group ref={carMeshRef} castShadow receiveShadow>
        {/* Animated Cabin & Chassis */}
        <group ref={cabinRef}>
          {/* Main Lower Chassis (Vibrant Cyber Orange / Racing Red) */}
          <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.7, 0.4, 2.7]} />
            <meshStandardMaterial
              color="#FF5722"
              roughness={0.25}
              metalness={0.15}
            />
          </mesh>

          {/* Front Bumper / Skid Plate */}
          <mesh position={[0, 0.22, 1.4]} castShadow>
            <boxGeometry args={[1.5, 0.2, 0.2]} />
            <meshStandardMaterial color="#1E232A" roughness={0.7} />
          </mesh>

          {/* Rear Bumper & Diffuser */}
          <mesh position={[0, 0.24, -1.38]} castShadow>
            <boxGeometry args={[1.6, 0.24, 0.15]} />
            <meshStandardMaterial color="#1E232A" roughness={0.7} />
          </mesh>

          {/* Cabin Top (Sleek dark matte body) */}
          <mesh position={[0, 0.72, -0.1]} castShadow>
            <boxGeometry args={[1.35, 0.46, 1.55]} />
            <meshStandardMaterial color="#21252D" roughness={0.4} />
          </mesh>

          {/* Windshield & Windows (Glossy tinted glass) */}
          <mesh position={[0, 0.73, 0.58]} rotation={[0.3, 0, 0]} castShadow>
            <planeGeometry args={[1.2, 0.42]} />
            <meshStandardMaterial
              color="#38BDF8"
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, 0.73, -0.89]} rotation={[-0.3, Math.PI, 0]} castShadow>
            <planeGeometry args={[1.2, 0.38]} />
            <meshStandardMaterial
              color="#38BDF8"
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Roof Rack & Decorative Spoiler */}
          <mesh position={[0, 0.98, -0.75]} castShadow>
            <boxGeometry args={[1.4, 0.08, 0.25]} />
            <meshStandardMaterial color="#FF5722" roughness={0.2} />
          </mesh>
          <mesh position={[-0.55, 0.88, -0.75]} castShadow>
            <boxGeometry args={[0.08, 0.2, 0.1]} />
            <meshStandardMaterial color="#1E232A" />
          </mesh>
          <mesh position={[0.55, 0.88, -0.75]} castShadow>
            <boxGeometry args={[0.08, 0.2, 0.1]} />
            <meshStandardMaterial color="#1E232A" />
          </mesh>

          {/* Cute RC Antenna with Flag */}
          <group ref={antennaRef} position={[0.45, 0.95, -0.5]}>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.8]} />
              <meshStandardMaterial color="#D1D5DB" metalness={0.8} />
            </mesh>
            {/* Top antenna ball */}
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial
                color="#FBBF24"
                emissive="#FBBF24"
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>

          {/* Headlights (Dual glowing LEDs + Light Beams) */}
          <mesh position={[-0.55, 0.35, 1.36]}>
            <boxGeometry args={[0.3, 0.15, 0.08]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFBEB"
              emissiveIntensity={2.5}
            />
          </mesh>
          <mesh position={[0.55, 0.35, 1.36]}>
            <boxGeometry args={[0.3, 0.15, 0.08]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFBEB"
              emissiveIntensity={2.5}
            />
          </mesh>

          {/* Actual Spotlights casting light cones onto the floor */}
          <spotLight
            position={[0, 0.4, 1.3]}
            target-position={[0, 0, 9]}
            angle={0.65}
            penumbra={0.5}
            intensity={3.5}
            color="#FEF3C7"
            castShadow
            shadow-mapSize={[512, 512]}
          />

          {/* Taillights (Glowing Red) */}
          <mesh position={[-0.6, 0.36, -1.36]}>
            <boxGeometry args={[0.26, 0.12, 0.06]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={2.0}
            />
          </mesh>
          <mesh position={[0.6, 0.36, -1.36]}>
            <boxGeometry args={[0.26, 0.12, 0.06]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>

        {/* 4 Wheels */}
        {/* Front Left */}
        <group ref={flWheelRef} position={[-0.92, 0.28, 0.8]}>
          <WheelMesh isLeft />
        </group>
        {/* Front Right */}
        <group ref={frWheelRef} position={[0.92, 0.28, 0.8]}>
          <WheelMesh />
        </group>
        {/* Rear Left */}
        <group ref={rlWheelRef} position={[-0.92, 0.28, -0.8]}>
          <WheelMesh isLeft />
        </group>
        {/* Rear Right */}
        <group ref={rrWheelRef} position={[0.92, 0.28, -0.8]}>
          <WheelMesh />
        </group>
      </group>

      {/* Dust Particles Instanced / Pool */}
      {particles.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (dustParticlesRef.current[i] = el)}
          scale={0.001}
        >
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial
            color="#E2E8F0"
            transparent
            opacity={0}
            roughness={0.9}
          />
        </mesh>
      ))}
    </>
  );
}

// Reusable Stylized Low-Poly Wheel Component
function WheelMesh({ isLeft = false }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Outer Tire Rubber */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.24, 16]} />
        <meshStandardMaterial color="#1E232A" roughness={0.8} />
      </mesh>

      {/* Rim / Hubcap */}
      <mesh position={[0, isLeft ? -0.08 : 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Center Cap Nut */}
      <mesh position={[0, isLeft ? -0.13 : 0.13, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
        <meshStandardMaterial color="#FF5722" />
      </mesh>
    </group>
  );
}
