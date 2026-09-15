import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';


// 2. Ambient Floating Dust Motes with Mouse Parallax (Cinematic Atmospheric Depth)
function AtmosphericDustMotes() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 75;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime() * 0.15;
    const pointer = state.pointer;

    // Mouse parallax tilt & slow gentle drift
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, pointer.x * 0.5, 0.04);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, pointer.y * 0.3, 0.04);
    pointsRef.current.rotation.y = t * 0.2;
    pointsRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#c2c7d0"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

// 3. Persistent Holographic Brain Model with Smooth Multi-Section Scroll Trajectory
function PersistentBrainModel({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const brainRef = useRef<THREE.Group>(null);
  const orbitRingRef = useRef<THREE.Mesh>(null);

  const brainGltf = useGLTF('/models/brain-hologram.glb');

  // Convert loaded brain materials to subtle monochrome wireframe luminescence
  useEffect(() => {
    if (!brainGltf?.scene) return;
    brainGltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        if (mesh.material) {
          const m = mesh.material as THREE.MeshStandardMaterial;
          if (m.color) {
            m.color = new THREE.Color('#a3a9b3');
            m.roughness = 0.4;
            m.metalness = 0.85;
          }
        }
      }
    });
  }, [brainGltf]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const p = scrollProgressRef.current;
    const pointer = state.pointer;

    // Continuous ambient holographic rotations with subtle mouse parallax
    if (brainRef.current) {
      brainRef.current.rotation.y = t * 0.2 + pointer.x * 0.15;
      brainRef.current.rotation.x = Math.sin(t * 0.15) * 0.06 - pointer.y * 0.1;
    }
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = t * 0.08;
    }

    // Dynamic Interpolation across Scroll Sections:
    let targetPos = [0, -0.15, 0.25];
    let targetRot = [0, 0, 0];
    let targetScale = 1.15;

    if (p < 0.16) {
      const sub = p / 0.16;
      targetPos = [0, -0.15 - sub * 0.2, 0.25 + sub * 0.1];
      targetRot = [0.04, sub * 0.35, 0];
      targetScale = 1.15 - sub * 0.05;
    } else if (p < 0.38) {
      const sub = (p - 0.16) / 0.22;
      targetPos = [
        THREE.MathUtils.lerp(0, 2.85, sub),
        THREE.MathUtils.lerp(-0.35, 0.05, sub),
        0.2
      ];
      targetRot = [0.06, THREE.MathUtils.lerp(0.35, 0.85, sub), -0.04];
      targetScale = THREE.MathUtils.lerp(1.1, 0.85, sub);
    } else if (p < 0.60) {
      const sub = (p - 0.38) / 0.22;
      targetPos = [
        2.55,
        THREE.MathUtils.lerp(0.05, 0.0, sub),
        0.3
      ];
      targetRot = [0.05, THREE.MathUtils.lerp(0.85, -0.75, sub), 0.03];
      targetScale = 0.95;
    } else if (p < 0.82) {
      const sub = (p - 0.60) / 0.22;
      targetPos = [
        THREE.MathUtils.lerp(2.55, 1.9, sub),
        THREE.MathUtils.lerp(0.0, 1.35, sub),
        THREE.MathUtils.lerp(0.3, -2.8, sub)
      ];
      targetRot = [0.08, THREE.MathUtils.lerp(-0.75, 0.3, sub), 0];
      targetScale = THREE.MathUtils.lerp(0.95, 0.70, sub);
    } else {
      const sub = (p - 0.82) / 0.18;
      targetPos = [
        THREE.MathUtils.lerp(1.9, 0, sub),
        THREE.MathUtils.lerp(1.35, -1.0, sub),
        THREE.MathUtils.lerp(-2.8, -0.3, sub)
      ];
      targetRot = [-0.12, THREE.MathUtils.lerp(0.3, 0.6, sub), 0];
      targetScale = 0.95;
    }

    // Smooth lerping to targets
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPos[0], 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPos[1], 0.06);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPos[2], 0.06);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot[0], 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot[1], 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot[2], 0.06);

    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.06);
    groupRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0.25]}>
      {/* Volumetric Point Lights Illuminating Point-Cloud */}
      <pointLight position={[0, 1, 2]} color="#ffffff" intensity={2.6} distance={8} />
      <pointLight position={[-3, 2, 2]} color="#8c929d" intensity={1.8} distance={8} />
      <pointLight position={[3, -2, -2]} color="#4a4d53" intensity={1.4} distance={8} />

      {/* Atmospheric stardust halo */}
      <Sparkles
        count={80}
        scale={5.2}
        size={1.8}
        speed={0.25}
        color="#b0b7c4"
        opacity={0.4}
      />

      {/* Subtle outer particle orbit ring */}
      <mesh ref={orbitRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.9, 1.92, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>

      {/* Holographic Brain Core */}
      <group ref={brainRef} scale={1.15} position={[0, 0, 0.15]}>
        <primitive object={brainGltf.scene} />
      </group>
    </group>
  );
}

function NeedSomeSpaceModel({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const spaceGltf = useGLTF('/models/space-environment.glb');

  useEffect(() => {
    if (!spaceGltf?.scene) return;

    // Center and scale the cosmic starfield points cloud
    const box = new THREE.Box3().setFromObject(spaceGltf.scene);
    const center = box.getCenter(new THREE.Vector3());

    spaceGltf.scene.position.x = -center.x;
    spaceGltf.scene.position.y = -center.y;
    spaceGltf.scene.position.z = -center.z;

    // Scale so it fills the background expansively
    spaceGltf.scene.scale.setScalar(1.45);

    // Apply high-contrast luminescent cosmic stardust particle materials
    spaceGltf.scene.traverse((child) => {
      if ((child as THREE.Points).isPoints) {
        const pts = child as THREE.Points;
        pts.material = new THREE.PointsMaterial({
          color: new THREE.Color('#dbeafe'),
          size: 0.024,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });
      }
    });
  }, [spaceGltf]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const p = scrollProgressRef.current;
    const pointer = state.pointer;

    // Slow, majestic deep space drift with mouse parallax
    groupRef.current.rotation.y = t * 0.03 + pointer.x * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.08 - pointer.y * 0.08;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -p * 1.5, 0.05);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -0.5 - p * 0.8, 0.05);
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.5]}>
      <primitive object={spaceGltf.scene} />
    </group>
  );
}

function SceneFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1.0, 24, 24]} />
      <meshBasicMaterial color="#73767c" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

export interface Persistent3DSceneProps {
  activeView?: 'fest' | 'events' | 'dashboard' | 'admin';
}

export const Persistent3DScene: React.FC<Persistent3DSceneProps> = ({ activeView = 'fest' }) => {
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalScroll > 0 ? Math.min(1, Math.max(0, scrollY / totalScroll)) : 0;
          scrollProgressRef.current = progress;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5.6], fov: 44 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.2]}
      >
        <ambientLight intensity={0.42} />
        <directionalLight position={[4, 6, 4]} intensity={1.3} color="#ffffff" />
        <directionalLight position={[-4, -3, -3]} intensity={0.6} color="#73767c" />

        <React.Suspense fallback={<SceneFallback />}>
          {/* Floating Atmospheric Dust Motes with Mouse Parallax */}
          <AtmosphericDustMotes />

          {/* Render Need for Space model on events view, Brain model on fest view */}
          {activeView === 'events' ? (
            <Float speed={0.7} rotationIntensity={0.1} floatIntensity={0.15}>
              <NeedSomeSpaceModel scrollProgressRef={scrollProgressRef} />
            </Float>
          ) : (
            <Float speed={0.9} rotationIntensity={0.12} floatIntensity={0.15}>
              <PersistentBrainModel scrollProgressRef={scrollProgressRef} />
            </Float>
          )}
        </React.Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload('/models/brain-hologram.glb');
useGLTF.preload('/models/space-environment.glb');
