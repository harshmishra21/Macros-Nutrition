import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { TUB_DISPLAY_HEIGHT, clampTubYRotation, getTubParts } from './wheyTubMesh.js';

export function WheyTubMesh({ imageUrl, height = TUB_DISPLAY_HEIGHT, autoRotate = true }) {
  const groupRef = useRef();
  const texture = useTexture(imageUrl);

  const parts = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const spec = getTubParts(height);
    const aspect = texture.image?.width && texture.image?.height
      ? texture.image.width / texture.image.height
      : 0.72;

    return {
      ...spec,
      labelWidth: spec.labelHeight * aspect,
    };
  }, [texture, height]);

  useFrame(() => {
    if (!groupRef.current || !autoRotate) return;
    groupRef.current.rotation.y = clampTubYRotation(groupRef.current.rotation.y + 0.005);
  });

  const gold = { color: '#F0C040', emissive: '#5A4208', emissiveIntensity: 0.45, metalness: 1, roughness: 0.12 };
  const body = { color: '#181818', metalness: 0.72, roughness: 0.22 };

  return (
    <group ref={groupRef}>
      <mesh position={[0, parts.baseY, 0]}>
        <cylinderGeometry args={[parts.radiusBottom * 1.02, parts.radiusBottom * 1.06, parts.baseHeight, 48]} />
        <meshStandardMaterial {...body} envMapIntensity={1.4} />
      </mesh>

      <mesh position={[0, parts.bodyCenterY, 0]}>
        <cylinderGeometry args={[parts.radiusTop, parts.radiusBottom, parts.bodyHeight, 64]} />
        <meshStandardMaterial {...body} envMapIntensity={1.4} />
      </mesh>

      {parts.ringY.map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[parts.radiusBottom * 0.98, 0.022, 16, 80]} />
          <meshStandardMaterial {...gold} envMapIntensity={1.8} />
        </mesh>
      ))}

      <mesh position={[0, parts.neckY, 0]}>
        <cylinderGeometry args={[parts.radiusNeck, parts.radiusTop * 0.98, parts.neckHeight, 48]} />
        <meshStandardMaterial {...body} envMapIntensity={1.4} />
      </mesh>

      <mesh position={[0, parts.lidY - parts.lidHeight * 0.18, 0]}>
        <cylinderGeometry args={[parts.radiusLid, parts.radiusLid, parts.lidHeight * 0.55, 64]} />
        <meshStandardMaterial {...gold} envMapIntensity={1.8} />
      </mesh>

      <mesh position={[0, parts.lidY + parts.lidHeight * 0.22, 0]}>
        <cylinderGeometry args={[parts.radiusLid * 0.96, parts.radiusLid * 0.96, parts.lidHeight * 0.42, 64]} />
        <meshStandardMaterial {...gold} envMapIntensity={1.8} />
      </mesh>

      <mesh position={[0, parts.lidY + parts.lidHeight * 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[parts.radiusLid * 0.97, 0.028, 12, 64]} />
        <meshStandardMaterial {...gold} envMapIntensity={1.8} />
      </mesh>

      <mesh position={[0, parts.bodyCenterY + height * 0.02, parts.labelZ - 0.03]}>
        <planeGeometry args={[parts.labelWidth * 1.08, parts.labelHeight * 1.08]} />
        <meshBasicMaterial color="#C9A84C" transparent opacity={0.12} depthWrite={false} />
      </mesh>

      <mesh position={[0, parts.bodyCenterY + height * 0.02, parts.labelZ]}>
        <planeGeometry args={[parts.labelWidth, parts.labelHeight]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

export function WheyTubMeshStatic({ imageUrl, height = TUB_DISPLAY_HEIGHT }) {
  return <WheyTubMesh imageUrl={imageUrl} height={height} autoRotate={false} />;
}

export default WheyTubMesh;
