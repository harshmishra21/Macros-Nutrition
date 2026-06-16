import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HELIX_POINTS = 36;
const HELIX_HEIGHT = 3.2;
const HELIX_RADIUS = 0.75;

function buildHelixPoints(strandOffset) {
  const points = [];
  for (let i = 0; i < HELIX_POINTS; i++) {
    const t = (i / HELIX_POINTS) * Math.PI * 3;
    const y = (i / HELIX_POINTS) * HELIX_HEIGHT - HELIX_HEIGHT / 2;
    points.push(
      new THREE.Vector3(
        Math.cos(t + strandOffset) * HELIX_RADIUS,
        y,
        Math.sin(t + strandOffset) * HELIX_RADIUS
      )
    );
  }
  return points;
}

function HelixStrand({ strandOffset, color, emissive }) {
  const groupRef = useRef();
  const points = useMemo(() => buildHelixPoints(strandOffset), [strandOffset]);

  return (
    <group ref={groupRef}>
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[i % 4 === 0 ? 0.09 : 0.055, 12, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.55}
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

function HelixBonds() {
  const strandA = useMemo(() => buildHelixPoints(0), []);
  const strandB = useMemo(() => buildHelixPoints(Math.PI), []);

  const bondPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < HELIX_POINTS; i += 3) {
      pairs.push([strandA[i], strandB[i]]);
    }
    return pairs;
  }, [strandA, strandB]);

  return (
    <group>
      {bondPairs.map(([a, b], i) => {
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.normalize()
        );
        return (
          <mesh key={i} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.012, 0.012, len, 6]} />
            <meshStandardMaterial
              color="#C9A84C"
              emissive="#C9A84C"
              emissiveIntensity={0.35}
              transparent
              opacity={0.7}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function AmbientMacroParticles() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(80 * 3);
    for (let i = 0; i < 80 * 3; i++) arr[i] = (Math.random() - 0.5) * 5;
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C9A84C" size={0.03} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function MoleculeScene() {
  const groupRef = useRef();

  useFrame(({ clock, mouse }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.35;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4) * 0.15 + mouse.y * 0.08;
    groupRef.current.rotation.z = mouse.x * 0.05;
  });

  return (
    <group ref={groupRef}>
      <HelixStrand strandOffset={0} color="#C9A84C" emissive="#8B6914" />
      <HelixStrand strandOffset={Math.PI} color="#E8D5A3" emissive="#C9A84C" />
      <HelixBonds />
      <AmbientMacroParticles />
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 3, 5]} intensity={1.3} color="#F0C040" />
      <pointLight position={[-3, 0, 2]} intensity={1.8} color="#C9A84C" distance={12} />
      <pointLight position={[2, -2, -2]} intensity={0.5} color="#A8B4C0" distance={10} />
    </>
  );
}

export function MacroMoleculeCanvas() {
  return (
    <div
      className="macro-molecule-canvas"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '520px',
        height: '420px',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneLights />
        <MoleculeScene />
      </Canvas>
    </div>
  );
}

export default MacroMoleculeCanvas;
