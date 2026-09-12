import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  scrollProgress: number;
}

function SpaceBoiAIModel({ scrollProgress }: ModelProps) {
  const gltf = useGLTF('/models/space-boi.glb');
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!gltf.scene) return;

    // Calculate exact bounding box to center and scale down
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center model at origin
    gltf.scene.position.x = -center.x;
    gltf.scene.position.y = -center.y + 0.1;
    gltf.scene.position.z = -center.z;

    // Scale down: Target compact height of ~1.35 units so it fits gracefully behind/above text
    const targetHeight = 1.35;
    const scaleFactor = size.y > 0 ? targetHeight / size.y : 0.0035;
    gltf.scene.scale.setScalar(scaleFactor);

    // Apply AI Cybernetic color palette & shaders
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const meshName = mesh.name.toLowerCase();

        // Detect Visor / Helmet Head components
        const isVisor =
          meshName.includes('visor') ||
          meshName.includes('glass') ||
          meshName.includes('eye') ||
          meshName.includes('sphere.008') ||
          meshName.includes('sphere.007');

        // Detect Jetpack / Thrusters / Mechanical Details
        const isMechanical =
          meshName.includes('pack') ||
          meshName.includes('cube') ||
          meshName.includes('engine') ||
          meshName.includes('metal') ||
          meshName.includes('gear');

        if (isVisor) {
          // AI Visor: Glowing Neon Cyan Holographic Material
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#00F0FF'),
            emissive: new THREE.Color('#0DB8D3'),
            emissiveIntensity: 2.2,
            metalness: 0.95,
            roughness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: 0.92,
          });
        } else if (isMechanical) {
          // AI Mechanical Gear: Cybernetic Cobalt & Indigo Alloy
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#0D223A'),
            emissive: new THREE.Color('#1B7FDC'),
            emissiveIntensity: 1.2,
            metalness: 0.9,
            roughness: 0.2,
          });
        } else {
          // AI Cybernetic Suit: Deep Obsidian with Electric Cyan Micro-rim glow
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#07131F'),
            emissive: new THREE.Color('#063B54'),
            emissiveIntensity: 0.7,
            metalness: 0.85,
            roughness: 0.28,
          });
        }
      }
    });
  }, [gltf]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Zero-G dynamic space hovering and drifting
    if (groupRef.current) {
      // Gentle natural breathing hover
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.08 - 0.1;
      groupRef.current.position.x = Math.cos(t * 0.8) * 0.05;

      // Dynamic rotation responsive to scroll and time
      groupRef.current.rotation.y = t * 0.35 + scrollProgress * Math.PI * 2.5;
      groupRef.current.rotation.x = Math.sin(t * 0.9) * 0.08 + scrollProgress * 0.4;
      groupRef.current.rotation.z = Math.cos(t * 0.7) * 0.06;
    }

    // Spin AI Holographic Data Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.8;
      ring1Ref.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.5) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.6;
      ring2Ref.current.rotation.y = Math.PI / 3 + Math.cos(t * 0.4) * 0.15;
    }

    // Camera perspective shift on scroll
    const targetZ = 4.2 - scrollProgress * 2.5;
    const targetY = 0.5 - scrollProgress * 0.4;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* AI Cybernetic Glow Lights */}
      <pointLight position={[0, 0.5, 0.8]} color="#00F0FF" intensity={3.5} distance={5} />
      <pointLight position={[0, -0.3, -0.8]} color="#1B7FDC" intensity={4.0} distance={6} />
      <pointLight position={[1, 0, 0]} color="#16F686" intensity={1.5} distance={4} />

      {/* AI Holographic Orbit Ring 1 */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[1.05, 1.07, 64]} />
        <meshBasicMaterial
          color="#00F0FF"
          side={THREE.DoubleSide}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* AI Holographic Orbit Ring 2 */}
      <mesh ref={ring2Ref}>
        <ringGeometry args={[1.25, 1.27, 64]} />
        <meshBasicMaterial
          color="#16F686"
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* The Space Boi Model */}
      <primitive object={gltf.scene} />
    </group>
  );
}

interface SpaceWarpSceneProps {
  scrollProgress?: number;
}

export const SpaceWarpScene: React.FC<SpaceWarpSceneProps> = ({ scrollProgress = 0 }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
      <Canvas
        camera={{ position: [0, 0.5, 4.2], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -4, -2]} intensity={0.8} color="#0DB8D3" />
        <directionalLight position={[0, 5, -5]} intensity={0.5} color="#1B7FDC" />

        {/* Deep Space Starfield */}
        <Stars
          radius={80}
          depth={50}
          count={2500}
          factor={3.5}
          saturation={0.5}
          fade
          speed={0.8}
        />

        <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.35}>
          <SpaceBoiAIModel scrollProgress={scrollProgress} />
        </Float>
      </Canvas>
    </div>
  );
};

// Preload the model
useGLTF.preload('/models/space-boi.glb');
