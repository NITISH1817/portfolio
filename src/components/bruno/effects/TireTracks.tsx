import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vehicleState } from '../VehiclePhysics';
import { vehicleInputs } from '../VehicleController';

const MAX_MARKS = 60;

interface TrackSegment {
  left: THREE.Vector3;
  right: THREE.Vector3;
  alpha: number;
}

export default function TireTracks() {
  const segments = useRef<TrackSegment[]>([]);
  const lineMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const lastAddPos = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!lineMeshRef.current) return;
    const dt = Math.min(delta, 0.05);

    const isSkidding =
      vehicleState.isDrifting || (vehicleInputs.brake && vehicleState.speed > 6.0);

    const pos = vehicleState.position;
    const right = vehicleState.right;

    // Add new segment if skidding and moved at least 0.5m
    if (isSkidding && pos.distanceTo(lastAddPos.current) > 0.45 && pos.y < 1.0) {
      lastAddPos.current.copy(pos);
      const halfWheelbase = 0.95;
      const leftPos = new THREE.Vector3()
        .copy(pos)
        .addScaledVector(right, -halfWheelbase)
        .setY(0.04);
      const rightPos = new THREE.Vector3()
        .copy(pos)
        .addScaledVector(right, halfWheelbase)
        .setY(0.04);

      segments.current.unshift({
        left: leftPos,
        right: rightPos,
        alpha: 0.75
      });

      if (segments.current.length > MAX_MARKS) {
        segments.current.pop();
      }
    }

    // Fade out existing segments
    for (let i = segments.current.length - 1; i >= 0; i--) {
      segments.current[i].alpha -= 0.15 * dt;
      if (segments.current[i].alpha <= 0) {
        segments.current.splice(i, 1);
      }
    }

    // Update instanced mesh quads (2 quads per segment: left tire, right tire)
    let instanceIdx = 0;
    const totalSlots = MAX_MARKS * 2;

    segments.current.forEach((seg) => {
      if (instanceIdx + 1 >= totalSlots) return;

      // Left tire mark quad
      dummy.current.position.copy(seg.left);
      dummy.current.rotation.x = -Math.PI / 2;
      dummy.current.rotation.z = vehicleState.heading;
      dummy.current.scale.set(0.24, 0.5, 1);
      dummy.current.updateMatrix();
      lineMeshRef.current!.setMatrixAt(instanceIdx++, dummy.current.matrix);

      // Right tire mark quad
      dummy.current.position.copy(seg.right);
      dummy.current.rotation.x = -Math.PI / 2;
      dummy.current.rotation.z = vehicleState.heading;
      dummy.current.scale.set(0.24, 0.5, 1);
      dummy.current.updateMatrix();
      lineMeshRef.current!.setMatrixAt(instanceIdx++, dummy.current.matrix);
    });

    // Hide remaining instances
    for (let i = instanceIdx; i < totalSlots; i++) {
      dummy.current.position.set(0, -999, 0);
      dummy.current.scale.set(0, 0, 0);
      dummy.current.updateMatrix();
      lineMeshRef.current!.setMatrixAt(i, dummy.current.matrix);
    }

    lineMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={lineMeshRef}
      args={[undefined, undefined, MAX_MARKS * 2]}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#1E232A"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
