import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroBackground3DProps {
  quality?: 'high' | 'medium' | 'low';
}

export default function HeroBackground3D({ quality = 'high' }: HeroBackground3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080B12, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      antialias: quality !== 'low',
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Volumetric Lighting
    const ambientLight = new THREE.AmbientLight(0x181a28, 1.2);
    scene.add(ambientLight);

    // Warm Sunset Rim Light
    const warmLight = new THREE.DirectionalLight(0xff9a45, 2.5);
    warmLight.position.set(6, 8, 4);
    scene.add(warmLight);

    // Cool Cyber Cyan Fill Light
    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 1.8);
    cyanLight.position.set(-6, -5, 3);
    scene.add(cyanLight);

    // Controlled Violet Backlight
    const violetLight = new THREE.PointLight(0xa855f7, 3.0, 20);
    violetLight.position.set(0, 2, -3);
    scene.add(violetLight);

    // 3. Central Kinetic 3D Hero Sculpture (Outer Ring, Middle Gimbal, Crystalline Core)
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.set(0, 0.95, -2.2);
    sculptureGroup.scale.setScalar(1.15);
    scene.add(sculptureGroup);

    // Materials
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x1f2430,
      metalness: 0.92,
      roughness: 0.22,
      wireframe: false
    });

    const bronzeGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd49b56,
      metalness: 0.88,
      roughness: 0.28,
      wireframe: false
    });

    const crystalGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x88d5ff,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.7,
      transparent: true,
      opacity: 0.65,
      ior: 1.5,
      wireframe: false
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff9a45,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    // Outer Gyro Ring (Dark Titanium)
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.045, 16, 80);
    const ring1 = new THREE.Mesh(ring1Geo, titaniumMat);
    sculptureGroup.add(ring1);

    // Middle Gyro Ring (Warm Bronze Gold)
    const ring2Geo = new THREE.TorusGeometry(1.95, 0.04, 16, 72);
    const ring2 = new THREE.Mesh(ring2Geo, bronzeGoldMat);
    ring2.rotation.x = Math.PI * 0.35;
    sculptureGroup.add(ring2);

    // Inner Gyro Ring (Slender Cyan Accent)
    const ring3Geo = new THREE.TorusGeometry(1.55, 0.025, 16, 64);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.85,
      roughness: 0.2
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI * 0.45;
    sculptureGroup.add(ring3);

    // Floating Translucent Crystalline Icosahedron
    const crystalGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const crystalCore = new THREE.Mesh(crystalGeo, crystalGlassMat);
    sculptureGroup.add(crystalCore);

    // Crystalline Wireframe Cage
    const wireCore = new THREE.Mesh(crystalGeo, wireMat);
    wireCore.scale.setScalar(1.05);
    sculptureGroup.add(wireCore);

    // Inner Glowing Energy Core
    const corePointLight = new THREE.PointLight(0xff70a6, 2.0, 6);
    sculptureGroup.add(corePointLight);

    const orbGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xff9a45 });
    const energyOrb = new THREE.Mesh(orbGeo, orbMat);
    sculptureGroup.add(energyOrb);

    // 4. Perspective Horizon Grid Floor
    const gridHelper = new THREE.GridHelper(50, 40, 0xff9a45, 0x1f2638);
    gridHelper.position.y = -3.8;
    gridHelper.material.opacity = 0.28;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Secondary deep ambient grid
    const subGridHelper = new THREE.GridHelper(50, 80, 0xa855f7, 0x141824);
    subGridHelper.position.y = -3.82;
    subGridHelper.material.opacity = 0.15;
    subGridHelper.material.transparent = true;
    scene.add(subGridHelper);

    // 5. Atmospheric Floating Particle Field (Soft Glowing Embers)
    const particleCount = quality === 'low' ? 35 : quality === 'medium' ? 60 : 100;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      particleSpeeds[i] = 0.2 + Math.random() * 0.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle sprite texture (soft circular glow)
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 180, 100, 1)');
      grad.addColorStop(0.3, 'rgba(255, 120, 160, 0.6)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTex = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      map: particleTex,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Mouse Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const halfW = window.innerWidth * 0.5;
      const halfH = window.innerHeight * 0.5;
      targetMouseX = (e.clientX - halfW) / halfW;
      targetMouseY = (e.clientY - halfH) / halfH;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 7. Animation Loop with Smooth Damping
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Parallax camera sway
      camera.position.x = mouseX * 0.7;
      camera.position.y = -mouseY * 0.5;
      camera.lookAt(0, 0.3, 0);

      // Kinetic Hero Sculpture Multi-Axis Gyro Rotation
      ring1.rotation.y += delta * 0.35;
      ring1.rotation.x = Math.sin(elapsed * 0.4) * 0.25;

      ring2.rotation.x += delta * 0.45;
      ring2.rotation.z = Math.cos(elapsed * 0.5) * 0.3;

      ring3.rotation.z -= delta * 0.6;
      ring3.rotation.y += delta * 0.2;

      crystalCore.rotation.x += delta * 0.5;
      crystalCore.rotation.y += delta * 0.7;
      wireCore.rotation.x = crystalCore.rotation.x;
      wireCore.rotation.y = crystalCore.rotation.y;

      // Subtle levitation bob
      sculptureGroup.position.y = 0.8 + Math.sin(elapsed * 1.2) * 0.08;
      sculptureGroup.rotation.y = mouseX * 0.4;
      sculptureGroup.rotation.x = -mouseY * 0.3;

      // Energy core pulsing
      const pulse = 1.0 + Math.sin(elapsed * 2.8) * 0.25;
      corePointLight.intensity = 1.8 * pulse;
      energyOrb.scale.setScalar(0.9 + pulse * 0.15);

      // Drift Atmospheric Particles
      const posArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += particleSpeeds[i] * delta * 0.8;
        // Sway in x
        posArray[i * 3 + 0] += Math.sin(elapsed + i) * delta * 0.15;
        // Reset when floating too high
        if (posArray[i * 3 + 1] > 6) {
          posArray[i * 3 + 1] = -5;
          posArray[i * 3 + 0] = (Math.random() - 0.5) * 16;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Slowly roll floor grid forward for continuous motion
      gridHelper.position.z = (elapsed * 0.6) % 1.25;
      subGridHelper.position.z = (elapsed * 0.6) % 0.625;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 9. Clean Lifecycle Teardown
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      crystalGeo.dispose();
      orbGeo.dispose();
      gridHelper.geometry.dispose();
      subGridHelper.geometry.dispose();
      particleGeo.dispose();
      particleTex.dispose();

      titaniumMat.dispose();
      bronzeGoldMat.dispose();
      crystalGlassMat.dispose();
      wireMat.dispose();
      ring3Mat.dispose();
      orbMat.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [quality]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0F1524 0%, #07090E 75%, #05060A 100%)'
      }}
    />
  );
}
