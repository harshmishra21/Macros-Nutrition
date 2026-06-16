import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getProductImageUrl } from '../../utils/products.js';
import { orbitProductImages } from '../../utils/homeProducts.js';

function FloatingProduct({ imageUrl, radius, angleOffset, speed, yOffset, scale = 1 }) {
  const meshRef = useRef();
  const texture = useTexture(imageUrl);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame(({ clock, mouse }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed + angleOffset;
    const floatY = Math.sin(t * 1.8) * 0.12;

    meshRef.current.position.x = Math.cos(t) * radius + mouse.x * 0.25;
    meshRef.current.position.z = Math.sin(t) * radius;
    meshRef.current.position.y = yOffset + floatY + mouse.y * 0.15;

    meshRef.current.rotation.y = -t + Math.PI / 2;
    meshRef.current.rotation.x = Math.sin(t * 0.6) * 0.08;
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <planeGeometry args={[0.9, 1.15]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0.92}
        metalness={0.15}
        roughness={0.35}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function GoldParticles() {
  const positions = useMemo(() => {
    const arr = new Float32Array(120 * 3);
    for (let i = 0; i < 120 * 3; i++) arr[i] = (Math.random() - 0.5) * 6;
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C9A84C" size={0.025} transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

function OrbitScene() {
  const groupRef = useRef();
  const products = orbitProductImages.slice(0, 6);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {products.map((product, i) => {
        const angle = (i / products.length) * Math.PI * 2;
        return (
          <FloatingProduct
            key={product.id}
            imageUrl={getProductImageUrl(product.image)}
            radius={2.2 + (i % 2) * 0.35}
            angleOffset={angle}
            speed={0.22 + (i % 3) * 0.04}
            yOffset={(i % 3 - 1) * 0.35}
            scale={0.85 + (i % 2) * 0.1}
          />
        );
      })}

      <GoldParticles />
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} color="#F0C040" />
      <pointLight position={[-3, 2, 4]} intensity={1.5} color="#C9A84C" distance={12} />
      <pointLight position={[2, -2, -2]} intensity={0.6} color="#A8B4C0" distance={10} />
    </>
  );
}

export function ProductOrbitCanvas() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '55%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
      className="hero-orbit-canvas"
    >
      <Canvas
        camera={{ position: [0, 0.3, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneLights />
        <Suspense fallback={null}>
          <OrbitScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ProductOrbitCanvas;
