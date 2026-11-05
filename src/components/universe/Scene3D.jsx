import React from 'react';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DigitalCore from './DigitalCore';
import Particles from './Particles';
import { useStore } from '../../store/useStore';

export default function Scene3D() {
  const isMenuOpen = useStore((state) => state.isMenuOpen);

  return (
    <>
      <color attach="background" args={['#050609']} />
      <fog attach="fog" args={['#050609', 5, 20]} />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#5C6CFF" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#35D7FF" />
      
      {/* 
        The core elements of the digital universe.
        They react to scroll state via Zustand and useFrame inside their respective components.
      */}
      <group scale={isMenuOpen ? 0.8 : 1}>
        <DigitalCore />
        <Particles />
      </group>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </>
  );
}
