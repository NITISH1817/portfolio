import React from 'react';
import * as THREE from 'three';

export default function Atmosphere() {
  // Sunny warm palette matching Bruno Simon's playful aesthetic
  const skyColor = '#FFA86B'; // Warm sunset/peach horizon
  const sunColor = '#FFF8EB'; // Golden warm sunlight
  const ambientColor = '#FFE8D4'; // Soft warm ambient fill
  const groundBounce = '#FFDFBA'; // Secondary soft fill

  return (
    <>
      {/* Seamless Fog fading into the warm horizon */}
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[skyColor, 45, 145]} />

      {/* Primary Warm Sunlight casting sharp, soft contact shadows */}
      <directionalLight
        position={[38, 52, 32]}
        color={sunColor}
        intensity={2.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
      />

      {/* Warm Ambient Bounce Light for soft, translucent shadows */}
      <ambientLight color={ambientColor} intensity={0.95} />

      {/* Secondary Sky Lift Light from opposite angle */}
      <directionalLight
        position={[-35, 24, -30]}
        color={groundBounce}
        intensity={0.42}
      />

      {/* Subtle zenith highlight */}
      <hemisphereLight
        args={['#FFF1E0', '#E57E38', 0.5]}
      />
    </>
  );
}
