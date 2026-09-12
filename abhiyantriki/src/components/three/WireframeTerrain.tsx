import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function TerrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate a detailed terrain plane
  const [geometry, count] = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 8, 48, 28);
    geo.rotateX(-Math.PI / 2.3);
    return [geo, geo.attributes.position.count];
  }, []);

  // Animate terrain waves
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * 0.8;
    const position = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      // Elevation wave formula resembling mountain/ridge wireframe
      const z =
        Math.sin(x * 0.6 + time) * 0.35 +
        Math.cos(y * 0.8 + time * 0.7) * 0.25 +
        Math.sin(Math.sqrt(x * x + y * y) * 0.8 - time) * 0.2;
      position.setZ(i, z);
    }
    position.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -1.2, -0.5]}>
      <meshBasicMaterial
        color="#8FA3B8"
        wireframe
        transparent
        opacity={0.32}
      />
    </mesh>
  );
}

export const WireframeTerrain: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 1.2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <TerrainMesh />
      </Canvas>
    </div>
  );
};
