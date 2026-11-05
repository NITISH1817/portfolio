import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { PhysicsContext } from './PhysicsContext';
import { carAudio } from './CarAudio';

export default function PhysicsWorld({ children }) {
  // Cannon World
  const world = useMemo(() => {
    const w = new CANNON.World();
    w.gravity.set(0, -22, 0);
    w.broadphase = new CANNON.SAPBroadphase(w);
    w.allowSleep = true;

    // Contact material
    const defaultMaterial = new CANNON.Material('default');
    const contactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
      friction: 0.35,
      restitution: 0.2,
      contactEquationStiffness: 1e7,
      contactEquationRelaxation: 3
    });
    w.addContactMaterial(contactMaterial);
    w.defaultContactMaterial = contactMaterial;

    return w;
  }, []);

  // Registry of synced physics bodies
  const syncList = useRef([]);
  const carBodyRef = useRef(null);
  const carState = useRef({
    position: new THREE.Vector3(0, 1, 0),
    rotation: new THREE.Euler(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    speed: 0
  });

  // Ground plane in physics
  useEffect(() => {
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: world.defaultContactMaterial
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    groundBody.position.set(0, 0, 0);
    world.addBody(groundBody);

    // Perimeter boundary walls (so car doesn't fall off playground)
    const arenaSize = 85;
    const wallHeight = 4;
    const wallThick = 2;

    const createWall = (x, z, w, d) => {
      const wall = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(w / 2, wallHeight / 2, d / 2))
      });
      wall.position.set(x, wallHeight / 2, z);
      world.addBody(wall);
      return wall;
    };

    const walls = [
      createWall(0, arenaSize, arenaSize * 2, wallThick),
      createWall(0, -arenaSize, arenaSize * 2, wallThick),
      createWall(arenaSize, 0, wallThick, arenaSize * 2),
      createWall(-arenaSize, 0, wallThick, arenaSize * 2)
    ];

    return () => {
      world.removeBody(groundBody);
      walls.forEach((w) => world.removeBody(w));
    };
  }, [world]);

  const addBody = (meshRef, body, onCollide) => {
    world.addBody(body);
    if (onCollide) {
      body.addEventListener('collide', (e) => {
        const relativeVelocity = e.contact ? e.contact.getImpactVelocityAlongNormal() : 0;
        if (Math.abs(relativeVelocity) > 2) {
          carAudio.playCrash(Math.min(Math.abs(relativeVelocity) / 8, 1.5));
        }
        onCollide(e);
      });
    }
    syncList.current.push({ meshRef, body });
  };

  const removeBody = (body) => {
    world.removeBody(body);
    syncList.current = syncList.current.filter((item) => item.body !== body);
  };

  useFrame((state, delta) => {
    // Clamp delta to avoid physics instability on tab change
    const dt = Math.min(delta, 0.05);
    world.step(1 / 60, dt, 3);

    // Sync Cannon bodies to Three.js meshes
    for (let i = 0; i < syncList.current.length; i++) {
      const { meshRef, body } = syncList.current[i];
      if (meshRef && meshRef.current) {
        meshRef.current.position.copy(body.position);
        meshRef.current.quaternion.copy(body.quaternion);
      }
    }

    // Update car tracking state
    if (carBodyRef.current) {
      const pos = carBodyRef.current.position;
      const rot = carBodyRef.current.quaternion;
      const vel = carBodyRef.current.velocity;

      carState.current.position.set(pos.x, pos.y, pos.z);
      carState.current.velocity.set(vel.x, vel.y, vel.z);
      carState.current.speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);

      const euler = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w)
      );
      carState.current.rotation.copy(euler);
    }
  });

  const value = {
    world,
    addBody,
    removeBody,
    carBodyRef,
    carState
  };

  return <PhysicsContext.Provider value={value}>{children}</PhysicsContext.Provider>;
}

