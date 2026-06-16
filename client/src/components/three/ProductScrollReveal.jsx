import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getProductImageUrl } from '../../utils/products.js';
import { featuredUniverseProducts } from '../../utils/homeProducts.js';

function ScrollProduct({ imageUrl, index, total, progress }) {
  const meshRef = useRef();
  const texture = useTexture(imageUrl);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  const xSpread = (index - (total - 1) / 2) * 1.35;
  const stagger = index * 0.08;

  useFrame(() => {
    if (!meshRef.current) return;
    const eased = THREE.MathUtils.smoothstep(progress - stagger, 0, 0.55);

    meshRef.current.position.x = xSpread;
    meshRef.current.position.y = THREE.MathUtils.lerp(-2.8, 0.1 + (index % 2) * 0.2, eased);
    meshRef.current.position.z = THREE.MathUtils.lerp(-1.5, 0, eased);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI * 0.45, 0, eased);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(0.6, 0, eased);
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(0.4, 0.75 + (index % 2) * 0.08, eased));

    if (meshRef.current.material) {
      meshRef.current.material.opacity = THREE.MathUtils.lerp(0, 0.95, eased);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.85, 1.1]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0}
        metalness={0.2}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function RevealScene({ progress }) {
  const groupRef = useRef();
  const products = featuredUniverseProducts.slice(0, 6);

  useFrame(({ clock }) => {
    if (groupRef.current && progress > 0.3) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {products.map((product, i) => (
        <ScrollProduct
          key={product.id}
          imageUrl={getProductImageUrl(product.image)}
          index={i}
          total={products.length}
          progress={progress}
        />
      ))}
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#F0C040" />
      <pointLight position={[-2, 1, 3]} intensity={1.2} color="#C9A84C" distance={14} />
    </>
  );
}

export function ProductScrollReveal({ containerRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.15;
      const raw = (start - rect.top) / (start - end + rect.height * 0.4);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [containerRef]);

  return (
    <div
      className="scroll-reveal-canvas"
      style={{
        position: 'absolute',
        top: '120px',
        left: 0,
        right: 0,
        height: '420px',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
      }}
    >
      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneLights />
        <Suspense fallback={null}>
          <RevealScene progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ProductScrollReveal;
