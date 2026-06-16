import * as THREE from 'three';
import { getProductImageUrl } from '../../utils/products.js';

export const DEFAULT_HERO_WHEY_IMAGE = 'macros_nutrition_whey_protein_isolated_vanilla.png';
export const TUB_DISPLAY_HEIGHT = 2.2;

export function getDefaultHeroWheyImageUrl() {
  return getProductImageUrl(DEFAULT_HERO_WHEY_IMAGE);
}

export function clampTubYRotation(rotationY) {
  return rotationY;
}

function trackDisposable(list, item) {
  if (item) list.push(item);
}

export function getTubParts(height = TUB_DISPLAY_HEIGHT) {
  const bodyHeight = height * 0.72;
  const neckHeight = height * 0.06;
  const lidHeight = height * 0.1;
  const baseHeight = height * 0.04;
  const radiusBottom = 0.9;
  const radiusTop = 0.8;
  const radiusNeck = 0.76;
  const radiusLid = 0.82;

  const bodyCenterY = -height * 0.04;
  const neckY = bodyCenterY + bodyHeight / 2 + neckHeight / 2;
  const lidY = neckY + neckHeight / 2 + lidHeight / 2 - 0.01;
  const baseY = bodyCenterY - bodyHeight / 2 - baseHeight / 2;

  const labelHeight = height * 0.88;
  const labelWidth = labelHeight * 0.72;

  return {
    bodyHeight,
    neckHeight,
    lidHeight,
    baseHeight,
    radiusBottom,
    radiusTop,
    radiusNeck,
    radiusLid,
    bodyCenterY,
    neckY,
    lidY,
    baseY,
    labelHeight,
    labelWidth,
    labelZ: radiusBottom + 0.02,
    ringY: [bodyCenterY - bodyHeight * 0.22, bodyCenterY + bodyHeight * 0.22],
  };
}

function goldMaterial(envMap) {
  return new THREE.MeshStandardMaterial({
    color: 0xf0c040,
    emissive: 0x5a4208,
    emissiveIntensity: 0.45,
    metalness: 1,
    roughness: 0.12,
    envMap,
    envMapIntensity: 1.8,
  });
}

function bodyMaterial(envMap) {
  return new THREE.MeshStandardMaterial({
    color: 0x181818,
    metalness: 0.72,
    roughness: 0.22,
    envMap,
    envMapIntensity: 1.4,
  });
}

export function createPremiumWheyTub(texture, options = {}) {
  const { height = TUB_DISPLAY_HEIGHT, envMap = null } = options;
  texture.colorSpace = THREE.SRGBColorSpace;

  const group = new THREE.Group();
  const geometries = [];
  const materials = [];
  const parts = getTubParts(height);

  const addMesh = (geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    trackDisposable(geometries, geometry);
    trackDisposable(materials, material);
    group.add(mesh);
    return mesh;
  };

  const image = texture.image;
  const aspect = image?.width && image?.height ? image.width / image.height : 0.72;
  const labelHeight = parts.labelHeight;
  const labelWidth = labelHeight * aspect;

  addMesh(
    new THREE.CylinderGeometry(parts.radiusBottom * 1.02, parts.radiusBottom * 1.06, parts.baseHeight, 48),
    bodyMaterial(envMap),
    [0, parts.baseY, 0]
  );

  addMesh(
    new THREE.CylinderGeometry(parts.radiusTop, parts.radiusBottom, parts.bodyHeight, 64),
    bodyMaterial(envMap),
    [0, parts.bodyCenterY, 0]
  );

  const ringGeo = new THREE.TorusGeometry(parts.radiusBottom * 0.98, 0.022, 16, 80);
  const ringMat = goldMaterial(envMap);
  trackDisposable(geometries, ringGeo);
  trackDisposable(materials, ringMat);

  parts.ringY.forEach((y) => {
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    group.add(ring);
  });

  addMesh(
    new THREE.CylinderGeometry(parts.radiusNeck, parts.radiusTop * 0.98, parts.neckHeight, 48),
    bodyMaterial(envMap),
    [0, parts.neckY, 0]
  );

  addMesh(
    new THREE.CylinderGeometry(parts.radiusLid, parts.radiusLid, parts.lidHeight * 0.55, 64),
    goldMaterial(envMap),
    [0, parts.lidY - parts.lidHeight * 0.18, 0]
  );

  addMesh(
    new THREE.CylinderGeometry(parts.radiusLid * 0.96, parts.radiusLid * 0.96, parts.lidHeight * 0.42, 64),
    goldMaterial(envMap),
    [0, parts.lidY + parts.lidHeight * 0.22, 0]
  );

  const lidRimGeo = new THREE.TorusGeometry(parts.radiusLid * 0.97, 0.028, 12, 64);
  const lidRim = new THREE.Mesh(lidRimGeo, ringMat);
  lidRim.rotation.x = Math.PI / 2;
  lidRim.position.y = parts.lidY + parts.lidHeight * 0.42;
  trackDisposable(geometries, lidRimGeo);
  group.add(lidRim);

  const labelGeo = new THREE.PlaneGeometry(labelWidth, labelHeight);
  const labelMat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: true,
    toneMapped: false,
  });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.set(0, parts.bodyCenterY + height * 0.02, parts.labelZ);
  trackDisposable(geometries, labelGeo);
  trackDisposable(materials, labelMat);
  group.add(label);

  const glowGeo = new THREE.PlaneGeometry(labelWidth * 1.08, labelHeight * 1.08);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xc9a84c,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.set(0, parts.bodyCenterY + height * 0.02, parts.labelZ - 0.03);
  trackDisposable(geometries, glowGeo);
  trackDisposable(materials, glowMat);
  group.add(glow);

  return {
    mesh: group,
    texture,
    geometries,
    materials,
  };
}

export function loadWheyTubMesh(imageUrl, options = {}) {
  const { height = TUB_DISPLAY_HEIGHT, loader = new THREE.TextureLoader(), envMap = null } = options;

  return new Promise((resolve, reject) => {
    loader.load(
      imageUrl,
      (texture) => {
        resolve(createPremiumWheyTub(texture, { height, envMap }));
      },
      undefined,
      reject
    );
  });
}

export function disposeWheyTubResources(resources) {
  if (!resources) return;
  resources.geometries?.forEach((geo) => geo.dispose());
  resources.materials?.forEach((mat) => mat.dispose());
  resources.texture?.dispose();
}
