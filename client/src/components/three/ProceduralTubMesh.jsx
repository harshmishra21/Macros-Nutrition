import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clampTubYRotation } from './wheyTubMesh.js';

export function ProceduralTubMesh({ flavorColor }) {
  const groupRef = useRef();
  const stripeMatRef = useRef();
  const targetColor = new THREE.Color(flavorColor);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clampTubYRotation(groupRef.current.rotation.y + 0.005);
    }

    if (stripeMatRef.current) {
      stripeMatRef.current.color.lerp(targetColor, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.85, 0.95, 2.2, 64]} />
        <meshStandardMaterial color="#0e0e0e" metalness={0.85} roughness={0.15} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.87, 0.97, 0.4, 64]} />
        <meshStandardMaterial
          ref={stripeMatRef}
          color={flavorColor}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {[-0.3, 0.3].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.92, 0.02, 16, 100]} />
          <meshStandardMaterial color="#C9A84C" metalness={1.0} roughness={0.1} />
        </mesh>
      ))}

      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.16, 64]} />
        <meshStandardMaterial color="#C9A84C" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default ProceduralTubMesh;
