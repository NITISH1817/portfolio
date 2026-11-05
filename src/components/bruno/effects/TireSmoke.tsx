import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vehicleState } from '../VehiclePhysics';
import { vehicleInputs } from '../VehicleController';

const MAX_SMOKE_PARTICLES = 50;

interface SmokeParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  alpha: number;
  maxLife: number;
  age: number;
}

export default function TireSmoke() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useRef<SmokeParticle[]>([]);
  const lastSpawnTime = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);
    const now = state.clock.getElapsedTime();

    const isSkidding =
      vehicleState.isDrifting ||
      (vehicleInputs.brake && vehicleState.speed > 5.0) ||
      (vehicleState.isNitroActive && vehicleState.speed > 10.0);

    // Spawn new smoke puffs behind rear wheels when skidding or nitro boosting
    if (isSkidding && now - lastSpawnTime.current > 0.04) {
      lastSpawnTime.current = now;
      const pos = vehicleState.position;
      const right = vehicleState.right;
      const forward = vehicleState.forward;

      // Left & right rear tire contact patches
      const leftRear = new THREE.Vector3()
        .copy(pos)
        .addScaledVector(right, -0.95)
        .addScaledVector(forward, -1.1)
        .setY(0.15);

      const rightRear = new THREE.Vector3()
        .copy(pos)
        .addScaledVector(right, 0.95)
        .addScaledVector(forward, -1.1)
        .setY(0.15);

      [leftRear, rightRear].forEach((spawnPos) => {
        if (particles.current.length < MAX_SMOKE_PARTICLES) {
          particles.current.push({
            position: spawnPos.clone().add(
              new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.1,
                (Math.random() - 0.5) * 0.2
              )
            ),
            velocity: new THREE.Vector3(
              (Math.random() - 0.5) * 0.6,
              0.8 + Math.random() * 0.6,
              (Math.random() - 0.5) * 0.6
            ),
            scale: 0.35 + Math.random() * 0.3,
            alpha: 0.55 + Math.random() * 0.2,
            maxLife: 0.8 + Math.random() * 0.4,
            age: 0
          });
        }
      });
    }

    // Update existing smoke particles
    let activeCount = 0;
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.age += dt;

      if (p.age >= p.maxLife) {
        particles.current.splice(i, 1);
        continue;
      }

      const lifeProgress = p.age / p.maxLife;
      p.position.addScaledVector(p.velocity, dt);
      const currentScale = p.scale * (1.0 + lifeProgress * 2.5);

      dummy.position.copy(p.position);
      dummy.scale.setScalar(currentScale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(activeCount, dummy.matrix);
      activeCount++;
    }

    // Hide inactive slots
    for (let i = activeCount; i < MAX_SMOKE_PARTICLES; i++) {
      dummy.position.set(0, -999, 0);
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, MAX_SMOKE_PARTICLES]}
      frustumCulled={false}
    >
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshBasicMaterial
        color="#E2E8F0"
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

