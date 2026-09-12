import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function BrainGearsModel() {
  const brainGltf = useGLTF('/models/brain-hologram.glb');
  const gearsGltf = useGLTF('/models/gears.glb');

  const brainRef = useRef<THREE.Group>(null);
  const gearsRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotate the brain hologram smoothly
    if (brainRef.current) {
      brainRef.current.rotation.y = t * 0.22;
      brainRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    }

    // Counter-rotate the mechanical gears
    if (gearsRef.current) {
      gearsRef.current.rotation.z = -t * 0.38;
      gearsRef.current.rotation.y = t * 0.12;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Cyan Point Light for the holographic brain core */}
      <pointLight color="#0DB8D3" intensity={6} distance={8} />
      <pointLight position={[2, 2, 2]} color="#EAF6FF" intensity={5} distance={6} />
      <pointLight position={[-2, -2, -2]} color="#1B7FDC" intensity={3} distance={5} />

      {/* Spherical Particle Halo (matching Gustavo Batista Inspo Image 2) */}
      <Sparkles
        count={550}
        scale={4.8}
        size={2.5}
        speed={0.4}
        color="#0DB8D3"
        opacity={0.8}
      />

      {/* Subtle outer particle orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.2, 2.22, 64]} />
        <meshBasicMaterial color="#0DB8D3" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Brain Hologram in center foreground */}
      <group ref={brainRef} scale={1.75} position={[0, 0, 0.3]}>
        <primitive object={brainGltf.scene} />
      </group>

      {/* Mechanical Gears turning behind/within the brain */}
      <group ref={gearsRef} scale={0.72} position={[0, 0, -0.5]}>
        <primitive object={gearsGltf.scene} />
      </group>
    </group>
  );
}

export const BrainGearsScene: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`w-full h-full relative ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -4, -3]} intensity={0.8} color="#0DB8D3" />

        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.25}>
          <BrainGearsModel />
        </Float>
      </Canvas>
    </div>
  );
};

useGLTF.preload('/models/brain-hologram.glb');
useGLTF.preload('/models/gears.glb');
