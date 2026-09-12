import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hero background per spec 07 row 1. This ships with a lightweight generated starfield
 * so the project runs standalone without the full compressed model set. Swap in
 * space-warp.glb / space-environment.glb (see spec 06) once those are dropped into
 * /public/models — the <Starfield> below is a deliberate placeholder, not a corner cut
 * on the final look; it's here so this scaffold is actually runnable today.
 */
function Starfield({ count = 2000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.01; // slow ambient drift, not scroll-driven
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#0DB8D3" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function FocalGlow() {
  return (
    <mesh position={[8, 4, -20]}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial color="#1B7FDC" transparent opacity={0.15} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]} // capped for perf, per spec 03's mid-range-phone budget
    >
      <ambientLight intensity={0.3} />
      <Starfield />
      <FocalGlow />
    </Canvas>
  );
}
