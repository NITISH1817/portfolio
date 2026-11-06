import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function EditorialHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x0e1726, 1.5);
    scene.add(ambientLight);

    const warmLight = new THREE.DirectionalLight(0xf59e0b, 3.2);
    warmLight.position.set(5, 6, 4);
    scene.add(warmLight);

    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 2.0);
    cyanLight.position.set(-5, -4, 3);
    scene.add(cyanLight);

    const rimLight = new THREE.PointLight(0xa855f7, 2.5, 12);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // 4. Central Stylized 3D Developer Emblem / Gyroscopic Core
    const group = new THREE.Group();
    scene.add(group);

    // Core Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.85,
      flatShading: true,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Wireframe overlay on core
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const wireMesh = new THREE.Mesh(coreGeo, wireMat);
    wireMesh.scale.setScalar(1.002);
    group.add(wireMesh);

    // Orbital Ring 1: Titanium / Amber
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.9,
      roughness: 0.2
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    group.add(ring1);

    // Orbital Ring 2: Electric Cyan
    const ring2Geo = new THREE.TorusGeometry(2.6, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.85,
      roughness: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    group.add(ring2);

    // Orbital Ring 3: Deep Obsidian
    const ring3Geo = new THREE.TorusGeometry(2.9, 0.02, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      metalness: 0.8,
      roughness: 0.3
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 4;
    group.add(ring3);

    // 5. Surrounding Satellite Particles
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 3.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // 6. Interactive Mouse Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 0.4;
      targetMouseY = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 7. Animation Loop with Visibility Optimization
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isVisible = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Rotations
      coreMesh.rotation.y = elapsedTime * 0.35 + currentMouseX;
      coreMesh.rotation.x = elapsedTime * 0.2 + currentMouseY;
      wireMesh.rotation.copy(coreMesh.rotation);

      ring1.rotation.z = elapsedTime * 0.4;
      ring1.rotation.x = Math.sin(elapsedTime * 0.25) * 0.3 + currentMouseY;

      ring2.rotation.y = -elapsedTime * 0.3;
      ring2.rotation.z = Math.cos(elapsedTime * 0.35) * 0.4;

      ring3.rotation.x = elapsedTime * 0.25;
      ring3.rotation.y = elapsedTime * 0.35;

      particles.rotation.y = elapsedTime * 0.08;

      group.rotation.y = currentMouseX * 0.8;
      group.rotation.x = -currentMouseY * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      coreGeo.dispose();
      coreMat.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] pointer-events-auto"
      aria-label="Interactive 3D Engineering Sculpture"
    />
  );
}
