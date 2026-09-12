import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

function HolographicGlobe() {
  const globeRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.15;
      globeRef.current.rotation.x = Math.sin(t * 0.1) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.2;
    }
  });

  return (
    <group ref={globeRef} scale={1.5}>
      {/* Outer Wireframe Latitude/Longitude Grid */}
      <Sphere args={[1, 24, 24]}>
        <meshBasicMaterial
          color="#0DB8D3"
          wireframe
          transparent
          opacity={0.35}
        />
      </Sphere>

      {/* Inner Glowing Core */}
      <Sphere args={[0.96, 32, 32]}>
        <meshStandardMaterial
          color="#065B98"
          roughness={0.7}
          metalness={0.2}
          transparent
          opacity={0.65}
        />
      </Sphere>

      {/* Orbital Equatorial Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.2, 1.25, 48]} />
        <meshBasicMaterial color="#EEE638" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* India Highlight Glowing Beacon (Approx coordinates on globe: lat ~20N, lon ~77E) */}
      <group position={[0.42, 0.45, 0.78]}>
        <pointLight color="#16F686" intensity={3} distance={2} />
        <mesh>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#16F686" />
        </mesh>
      </group>
    </group>
  );
}

export const GlobeOverviewScene: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`w-full h-full relative ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 4, 4]} color="#0DB8D3" intensity={3} />
        <pointLight position={[-4, -4, -4]} color="#1B7FDC" intensity={2} />
        <HolographicGlobe />
      </Canvas>
    </div>
  );
};
