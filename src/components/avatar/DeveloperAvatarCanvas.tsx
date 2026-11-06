import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import DeveloperAvatar3D from './DeveloperAvatar3D';

interface DeveloperAvatarCanvasProps {
  className?: string;
  showBadge?: boolean;
}

export default function DeveloperAvatarCanvas({
  className = 'w-full h-[420px] md:h-[500px]',
  showBadge = true,
}: DeveloperAvatarCanvasProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.4, 2.5], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={1.2} />
        {/* Key Light (Warm peach / amber) */}
        <directionalLight
          position={[2.5, 3.5, 2.0]}
          intensity={2.2}
          color="#FFE8D6"
          castShadow
          shadow-mapSize={1024}
        />
        {/* Fill Light (Soft cool lavender) */}
        <directionalLight position={[-2.5, 1.5, 1.5]} intensity={1.1} color="#C4B5FD" />
        {/* Rim Light (High-tech cyan backlight for silhouette definition) */}
        <directionalLight position={[0, 2.5, -3.0]} intensity={2.8} color="#00F0FF" />
        {/* Hologram Point Light (Subtle cyan glow onto chest & glasses) */}
        <pointLight position={[0, 0.1, 0.5]} intensity={1.5} distance={1.2} color="#00F0FF" />

        <Suspense fallback={null}>
          <DeveloperAvatar3D mouseTracking={true} />
          <ContactShadows
            position={[0, -1.05, 0]}
            opacity={0.65}
            scale={2.2}
            blur={1.5}
            far={1.5}
            color="#0A0612"
          />
        </Suspense>

        {/* Orbit Controls (constrained to maintain natural framing) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
          rotateSpeed={0.6}
        />
      </Canvas>

      {/* Decorative Developer Hologram HUD Overlay */}
      {showBadge && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-slate-200 text-xs shadow-lg pointer-events-none select-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">
            3D DEVELOPER AVATAR
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Drag to inspect</span>
        </div>
      )}
    </div>
  );
}

