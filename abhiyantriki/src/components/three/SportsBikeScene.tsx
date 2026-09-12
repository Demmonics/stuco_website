import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function SportsBikeModel({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const gltf = useGLTF('/models/sports-bike.glb');
  const bikeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (bikeRef.current) {
      // 360 showcase turntable rotation driven by time + scroll
      bikeRef.current.rotation.y = t * 0.35 + scrollProgress * Math.PI * 2;
    }
  });

  return (
    <group ref={bikeRef} position={[0, -0.6, 0]} scale={1.1}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export const SportsBikeScene: React.FC<{ scrollProgress?: number; className?: string }> = ({
  scrollProgress = 0,
  className
}) => {
  return (
    <div className={`w-full h-full relative ${className || ''}`}>
      <Canvas
        camera={{ position: [2.5, 1.2, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#0DB8D3" />
        <pointLight position={[0, 3, 0]} intensity={2} color="#EEE638" />

        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
          <SportsBikeModel scrollProgress={scrollProgress} />
        </Float>

        <ContactShadows
          position={[0, -0.65, 0]}
          opacity={0.7}
          scale={7}
          blur={2.5}
          far={4}
          color="#065B98"
        />
      </Canvas>
    </div>
  );
};

useGLTF.preload('/models/sports-bike.glb');
