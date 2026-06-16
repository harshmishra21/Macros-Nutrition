import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  getDefaultHeroWheyImageUrl,
  loadWheyTubMesh,
  disposeWheyTubResources,
} from './wheyTubMesh.js';

export function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const W = mountRef.current.clientWidth || window.innerWidth;
    const H = mountRef.current.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.75;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const scene = new THREE.Scene();
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.45, 5.2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));

    const keyLight = new THREE.DirectionalLight(0xfff4d0, 2.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-5, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc9a84c, 1.6);
    rimLight.position.set(0, 3, -6);
    scene.add(rimLight);

    const tubGroup = new THREE.Group();
    tubGroup.position.set(1.95, 0.35, 0);
    scene.add(tubGroup);

    const tubSpot = new THREE.PointLight(0xf0c040, 3.5, 12, 2);
    tubSpot.position.set(2.2, 1.2, 3.5);
    scene.add(tubSpot);

    const tubFill = new THREE.PointLight(0xffffff, 1.8, 10, 2);
    tubFill.position.set(0.5, 0.8, 4);
    scene.add(tubFill);

    let tubResources = null;
    let cancelled = false;

    loadWheyTubMesh(getDefaultHeroWheyImageUrl(), { envMap: envTexture })
      .then((resources) => {
        if (cancelled) {
          disposeWheyTubResources(resources);
          return;
        }
        tubResources = resources;
        tubGroup.add(resources.mesh);
      })
      .catch((err) => {
        console.error('Failed to load hero whey tub image:', err);
      });

    const gridGroup = new THREE.Group();
    const gridDivisions = 36;
    const gridStep = 0.45;
    const gridPositions = [];
    const gridColors = [];
    const gold = new THREE.Color(0xC9A84C);

    for (let i = -gridDivisions; i <= gridDivisions; i++) {
      for (let j = -gridDivisions; j <= gridDivisions; j++) {
        const x = i * gridStep;
        const z = j * gridStep;
        const dist = Math.sqrt(x * x + z * z);
        const maxDist = gridDivisions * gridStep * 0.85;
        const fade = Math.max(0.08, 1 - dist / maxDist);
        gridPositions.push(x, -2.6, z);
        gridColors.push(gold.r * fade, gold.g * fade, gold.b * fade);
      }
    }

    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    gridGeo.setAttribute('color', new THREE.Float32BufferAttribute(gridColors, 3));

    const gridDots = new THREE.Points(
      gridGeo,
      new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
        depthWrite: false,
      })
    );
    gridGroup.add(gridDots);

    const depthPositions = [];
    const depthColors = [];
    for (let i = -gridDivisions; i <= gridDivisions; i += 3) {
      for (let j = -gridDivisions; j <= gridDivisions; j += 3) {
        const x = i * gridStep;
        const z = j * gridStep;
        const dist = Math.sqrt(x * x + z * z);
        const fade = Math.max(0.05, 0.4 - dist / (gridDivisions * gridStep));
        depthPositions.push(x, -2.6 + dist * 0.04, z);
        depthColors.push(gold.r * fade, gold.g * fade, gold.b * fade);
      }
    }

    const depthGeo = new THREE.BufferGeometry();
    depthGeo.setAttribute('position', new THREE.Float32BufferAttribute(depthPositions, 3));
    depthGeo.setAttribute('color', new THREE.Float32BufferAttribute(depthColors, 3));

    const depthDots = new THREE.Points(
      depthGeo,
      new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        sizeAttenuation: true,
        depthWrite: false,
      })
    );
    gridGroup.add(depthDots);
    gridGroup.rotation.x = -0.12;
    scene.add(gridGroup);

    const particleCount = 250;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xC9A84C,
      size: 0.02,
      transparent: true,
      opacity: 0.35,
    });
    scene.add(new THREE.Points(particleGeo, particleMat));

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.42, 0.45, 0.72);
    composer.addPass(bloom);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId;

    const animate = () => {
      tubGroup.rotation.y += 0.005;

      const targetCamX = mouseX * 0.45;
      const targetCamY = 0.45 + mouseY * 0.2;
      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.lookAt(tubGroup.position.x * 0.35, 0.2, 0);

      tubSpot.position.x = tubGroup.position.x + 0.4;
      tubSpot.position.y = tubGroup.position.y + 0.85;

      gridGroup.position.x += (mouseX * 1.1 - gridGroup.position.x) * 0.07;
      gridGroup.position.z += (mouseY * 0.6 - gridGroup.position.z) * 0.07;
      gridGroup.rotation.z = mouseX * 0.04;
      gridGroup.rotation.y = mouseY * 0.03;

      tubGroup.rotation.x += (mouseY * 0.18 - tubGroup.rotation.x) * 0.05;
      tubGroup.rotation.z += (mouseX * 0.08 - tubGroup.rotation.z) * 0.05;

      const pos = particleGeo.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pos[i] += 0.003;
        if (pos[i] > 4) pos[i] = -4;
      }
      particleGeo.attributes.position.needsUpdate = true;

      composer.render();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const W2 = mountRef.current.clientWidth;
      const H2 = mountRef.current.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
      composer.setSize(W2, H2);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      disposeWheyTubResources(tubResources);
      particleGeo.dispose();
      particleMat.dispose();
      gridGeo.dispose();
      depthGeo.dispose();
      gridDots.material.dispose();
      depthDots.material.dispose();
      envTexture.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
}

export default HeroCanvas;
