import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import WheyTubMesh from './WheyTubMesh.jsx';
import { ProceduralTubMesh } from './ProceduralTubMesh.jsx';

function SceneContent({ imageUrl, flavorColor }) {
  if (imageUrl) {
    return <WheyTubMesh imageUrl={imageUrl} autoRotate={false} />;
  }

  return <ProceduralTubMesh flavorColor={flavorColor} />;
}

export default function ProductViewer3D({ flavorColor = '#C9A84C', imageUrl = '' }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0.45, 4.8], fov: 42 }}
        gl={{ antialias: true, toneMappingExposure: 1.75 }}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} color="#FFF4D0" />
        <directionalLight position={[-5, 2, 4]} intensity={1.2} color="#FFFFFF" />
        <directionalLight position={[0, 3, -6]} intensity={1.6} color="#C9A84C" />
        <pointLight position={[1, 1.5, 4]} intensity={3} color="#F0C040" distance={12} />

        <Suspense fallback={null}>
          <SceneContent imageUrl={imageUrl} flavorColor={flavorColor} />
        </Suspense>

        <Environment preset="studio" />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
