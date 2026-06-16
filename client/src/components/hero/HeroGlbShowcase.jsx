import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

export const HERO_GLB_URL = '/models/whey-tub.glb';
const HERO_MODEL_SCALE = 0.97;
const HERO_TARGET_SIZE = 2.08;
const TUB_OFFSET = [2.42, 0.08, 0];
const TUB_LOOK_AT = [TUB_OFFSET[0] * 0.26, TUB_OFFSET[1] + 0.02, TUB_OFFSET[2]];

function buildDotGrid() {
  const gridDivisions = 34;
  const gridStep = 0.42;
  const gold = new THREE.Color(0xc9a84c);
  const maxDist = gridDivisions * gridStep * 0.85;
  const floorY = -2.35;

  const gridPositions = [];
  const gridColors = [];
  const depthPositions = [];
  const depthColors = [];

  for (let i = -gridDivisions; i <= gridDivisions; i++) {
    for (let j = -gridDivisions; j <= gridDivisions; j++) {
      const x = i * gridStep;
      const z = j * gridStep;
      const dist = Math.sqrt(x * x + z * z);
      const fade = Math.max(0.08, 1 - dist / maxDist);
      gridPositions.push(x, floorY, z);
      gridColors.push(gold.r * fade, gold.g * fade, gold.b * fade);
    }
  }

  for (let i = -gridDivisions; i <= gridDivisions; i += 3) {
    for (let j = -gridDivisions; j <= gridDivisions; j += 3) {
      const x = i * gridStep;
      const z = j * gridStep;
      const dist = Math.sqrt(x * x + z * z);
      const fade = Math.max(0.05, 0.4 - dist / (gridDivisions * gridStep));
      depthPositions.push(x, floorY + dist * 0.04, z);
      depthColors.push(gold.r * fade, gold.g * fade, gold.b * fade);
    }
  }

  return { gridPositions, gridColors, depthPositions, depthColors };
}

function DotGridFloor({ parallax }) {
  const groupRef = useRef();
  const { gridPositions, gridColors, depthPositions, depthColors } = useMemo(buildDotGrid, []);

  const gridGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(gridColors, 3));
    return geo;
  }, [gridPositions, gridColors]);

  const depthGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(depthPositions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(depthColors, 3));
    return geo;
  }, [depthPositions, depthColors]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.x += (parallax.current.x * 0.9 - groupRef.current.position.x) * 0.07;
    groupRef.current.position.z += (parallax.current.y * 0.5 - groupRef.current.position.z) * 0.07;
  });

  return (
    <group ref={groupRef} rotation={[-0.12, 0, 0]}>
      <points geometry={gridGeometry}>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <points geometry={depthGeometry}>
        <pointsMaterial
          size={0.032}
          vertexColors
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function CameraRig({ parallax }) {
  const { camera } = useThree();
  const lookTarget = useMemo(
    () => new THREE.Vector3(TUB_LOOK_AT[0], TUB_LOOK_AT[1], TUB_LOOK_AT[2]),
    []
  );

  useFrame(() => {
    const targetX = parallax.current.x * 0.22;
    const targetY = 0.16 + parallax.current.y * 0.1;
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.lookAt(lookTarget);
  });

  return null;
}

function GlbTub() {
  const modelRef = useRef();
  const { scene } = useGLTF(HERO_GLB_URL);
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const root = modelRef.current;
    if (!root) return;

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const fitScale = (HERO_TARGET_SIZE / maxDim) * HERO_MODEL_SCALE;
    root.scale.setScalar(fitScale);
    root.rotation.set(0, 0, 0);

    root.updateMatrixWorld(true);
    const scaledBox = new THREE.Box3().setFromObject(root);
    const center = scaledBox.getCenter(new THREE.Vector3());
    root.position.set(-center.x, -center.y + 0.02, -center.z);

    root.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = true;
      if (child.material) {
        child.material.envMapIntensity = 1.5;
        child.material.needsUpdate = true;
      }
    });
  }, [model]);

  useFrame(() => {
    const root = modelRef.current;
    if (!root) return;
    root.rotation.y += 0.004;
  });

  return (
    <group position={TUB_OFFSET}>
      <primitive ref={modelRef} object={model} />
    </group>
  );
}

function GlbScene({ parallax }) {
  return (
    <>
      <CameraRig parallax={parallax} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#FFF4D0" />
      <directionalLight position={[-4, 2, 4]} intensity={1.1} color="#FFFFFF" />
      <directionalLight position={[0, 2, -5]} intensity={1.3} color="#C9A84C" />
      <pointLight position={[3.2, 1.2, 4]} intensity={2.4} color="#F0C040" distance={14} />
      <DotGridFloor parallax={parallax} />
      <GlbTub />
      <Environment preset="studio" />
    </>
  );
}

function HeroLoader() {
  return (
    <div className="hero-glb-loading">
      <span>LOADING 3D MODEL...</span>
    </div>
  );
}

export function HeroGlbShowcase() {
  const parallax = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch = window.matchMedia('(max-width: 1024px)').matches;
    if (isTouch) return;

    const onMove = (e) => {
      parallax.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      parallax.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="hero-glb-showcase" aria-hidden="true">
      <Suspense fallback={<HeroLoader />}>
        <Canvas
          camera={{ position: [0.52, 0.16, 4.7], fov: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.75,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.75]}
        >
          <GlbScene parallax={parallax} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default HeroGlbShowcase;
