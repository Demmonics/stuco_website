import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

function CosmicPointsModel() {
  const gltf = useGLTF('/models/space-environment.glb');
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!gltf.scene) return;

    // Center and scale the 50,000 particle points cloud
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());

    gltf.scene.position.x = -center.x;
    gltf.scene.position.y = -center.y;
    gltf.scene.position.z = -center.z;

    // Zoomed out scale so the galaxy encompasses the view
    gltf.scene.scale.setScalar(1.6);

    // Apply high-contrast cosmic stardust particle materials
    gltf.scene.traverse((child) => {
      if ((child as THREE.Points).isPoints) {
        const pts = child as THREE.Points;
        pointsRef.current = pts;

        // Custom shimmering star points
        pts.material = new THREE.PointsMaterial({
          color: new THREE.Color('#EAF6FF'),
          size: 0.022,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });
      }
    });
  }, [gltf]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Slow, majestic deep space drift
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.025;
      groupRef.current.rotation.x = Math.sin(t * 0.015) * 0.08;
    }

    // Interactive scroll-driven camera tilt
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const maxScroll = typeof document !== 'undefined' ? (document.body.scrollHeight - window.innerHeight) || 1 : 1;
    const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

    // Smooth camera drift based on scroll
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -progress * 2.5, 0.05);
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, progress * 0.3, 0.05);
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export const CosmicEnvironmentScene: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 52 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />

        {/* Floating cosmic galaxy particles */}
        <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.2}>
          <CosmicPointsModel />
        </Float>
      </Canvas>

      {/* Central Radiant Star Flare at the top (per Gustavo Batista inspo) */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_120px_45px_rgba(255,255,255,0.85),0_0_240px_100px_rgba(13,184,211,0.25)] animate-pulse" />
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-1/2 translate-y-[-1px]" />
      </div>

      {/* Dark Vignette and Fine Cosmic Grain Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,13,20,0.65)_70%,rgba(7,13,20,0.95)_100%)]" />
    </div>
  );
};

// Preload the space environment model
useGLTF.preload('/models/space-environment.glb');
