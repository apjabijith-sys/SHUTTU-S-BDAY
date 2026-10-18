import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloralCanvasProps {
  isUnlocked: boolean;
}

export const FloralCanvas: React.FC<FloralCanvasProps> = ({ isUnlocked }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isUnlockedRef = useRef(isUnlocked);

  useEffect(() => {
    isUnlockedRef.current = isUnlocked;
  }, [isUnlocked]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // --- SCENE & FOG ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x2a050d, 0.02);

    // --- CAMERA ---
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, isUnlockedRef.current ? 16.5 : 22);

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xfff7f2, 1.2);
    scene.add(ambientLight);

    // Studio Key Light (crisp illumination highlighting pearl white luster)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 8, 10);
    scene.add(keyLight);

    // Subtle Champagne Warm Rim Light
    const warmRim = new THREE.DirectionalLight(0xffeedd, 1.8);
    warmRim.position.set(-6, 4, 2);
    scene.add(warmRim);

    // Deep Burgundy Atmosphere Back Light
    const burgundyRim = new THREE.DirectionalLight(0x8a1b2b, 3.2);
    burgundyRim.position.set(-8, -4, -6);
    scene.add(burgundyRim);

    // Point light near the bouquet for mother-of-pearl sheen
    const pearlPoint = new THREE.PointLight(0xfffaf0, 2.0, 25);
    pearlPoint.position.set(3.5, 0.5, 5);
    scene.add(pearlPoint);

    // --- TEXTURE LOADER ---
    const textureLoader = new THREE.TextureLoader();

    // 1. Pearl White Bouquet (exact uploaded flower arrangement transformed to pearl white)
    const bouquetTexture = textureLoader.load('/images/pearl_white_bouquet.png');
    bouquetTexture.colorSpace = THREE.SRGBColorSpace;
    bouquetTexture.generateMipmaps = true;

    // 2. Pearl White Single Bloom (isolated botanical flower)
    const bloomTexture = textureLoader.load('/images/pearl_white_bloom.png');
    bloomTexture.colorSpace = THREE.SRGBColorSpace;
    bloomTexture.generateMipmaps = true;

    // --- MATERIALS ---
    const bouquetMaterial = new THREE.MeshStandardMaterial({
      map: bouquetTexture,
      transparent: true,
      alphaTest: 0.02,
      roughness: 0.28,
      metalness: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const bloomMaterial = new THREE.MeshStandardMaterial({
      map: bloomTexture,
      transparent: true,
      alphaTest: 0.02,
      roughness: 0.25,
      metalness: 0.06,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // --- HERO BOUQUET GROUP (Right composition framing the photo card) ---
    const bouquetGroup = new THREE.Group();

    // Main Centerpiece Pearl White Rose Bouquet Mesh
    // Ratio of bouquet is roughly 9:16
    const bouquetGeom = new THREE.PlaneGeometry(6.5, 11.5, 16, 16);

    // Give the geometry a slight sculptural cylindrical curve for 3D depth
    const pos = bouquetGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const curveZ = -((x / 3.25) ** 2) * 0.45;
      pos.setZ(i, curveZ);
    }
    bouquetGeom.computeVertexNormals();

    const mainBouquetMesh = new THREE.Mesh(bouquetGeom, bouquetMaterial);
    mainBouquetMesh.position.set(3.6, 0.4, 0);
    mainBouquetMesh.rotation.set(-0.06, -0.15, 0.05);
    bouquetGroup.add(mainBouquetMesh);

    // Layered Accents: Individual Pearl White Blooms positioned at varying depths for real parallax
    const accentBloom1 = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.2),
      bloomMaterial
    );
    accentBloom1.position.set(5.2, 3.6, 0.6);
    accentBloom1.rotation.set(-0.2, -0.3, 0.15);
    bouquetGroup.add(accentBloom1);

    const accentBloom2 = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 2.6),
      bloomMaterial
    );
    accentBloom2.position.set(1.8, -1.8, 0.9);
    accentBloom2.rotation.set(0.15, 0.2, -0.1);
    bouquetGroup.add(accentBloom2);

    const accentBloom3 = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2),
      bloomMaterial
    );
    accentBloom3.position.set(5.8, -2.4, -0.4);
    accentBloom3.rotation.set(0.1, -0.2, 0.3);
    bouquetGroup.add(accentBloom3);

    scene.add(bouquetGroup);

    // --- FLOATING BACKGROUND ANIMATION (Pearl White Flowers & Petals) ---
    const floatingItemsCount = 38;
    const floatingItems: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      speedY: number;
      speedRotX: number;
      speedRotY: number;
      speedRotZ: number;
      swayFreq: number;
      swayAmp: number;
      parallaxFactor: number;
    }[] = [];

    // Geometries for floating elements
    const bloomGeomSmall = new THREE.PlaneGeometry(1.6, 1.6);
    const bloomGeomMedium = new THREE.PlaneGeometry(2.4, 2.4);

    // Procedural curved petal geometry for individual drifting pearl petals
    const createCurvedPetalGeom = (w: number, l: number, curve: number) => {
      const geom = new THREE.PlaneGeometry(w, l, 6, 6);
      const p = geom.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        const y = p.getY(i);
        const cup = (1 - (x / (w / 2)) ** 2) * Math.sin(((y + l / 2) / l) * Math.PI) * curve;
        p.setZ(i, cup);
      }
      geom.computeVertexNormals();
      return geom;
    };

    // Pearl White Satin Petal Material
    const pearlPetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xfcf9f2,
      roughness: 0.26,
      metalness: 0.12,
      side: THREE.DoubleSide,
    });

    const petalGeomTypes = [
      createCurvedPetalGeom(0.65, 0.9, 0.25),
      createCurvedPetalGeom(0.5, 0.75, 0.2),
      createCurvedPetalGeom(0.8, 1.1, 0.3),
    ];

    for (let i = 0; i < floatingItemsCount; i++) {
      let mesh: THREE.Mesh;
      const isBloom = i % 4 === 0; // 1 in 4 is a whole floating pearl bloom, others are pearl petals

      if (isBloom) {
        const geom = i % 8 === 0 ? bloomGeomMedium : bloomGeomSmall;
        mesh = new THREE.Mesh(geom, bloomMaterial);
      } else {
        const geom = petalGeomTypes[i % petalGeomTypes.length];
        mesh = new THREE.Mesh(geom, pearlPetalMaterial);
      }

      const x = (Math.random() - 0.5) * 26;
      const y = (Math.random() - 0.5) * 22;
      const z = (Math.random() - 0.5) * 18 - 2;

      mesh.position.set(x, y, z);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      const scale = isBloom ? 0.7 + Math.random() * 0.5 : 0.6 + Math.random() * 0.7;
      mesh.scale.set(scale, scale, scale);
      scene.add(mesh);

      floatingItems.push({
        mesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedY: 0.007 + Math.random() * 0.015,
        speedRotX: (Math.random() - 0.5) * 0.018,
        speedRotY: (Math.random() - 0.5) * 0.018,
        speedRotZ: (Math.random() - 0.5) * 0.014,
        swayFreq: 0.4 + Math.random() * 1.2,
        swayAmp: 0.35 + Math.random() * 0.65,
        parallaxFactor: (z + 12) / 20, // Near items move faster
      });
    }

    // --- INTERACTIVE MOUSE TRACKING & PARALLAX ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      // Camera dolly-in transition on unlock
      const targetCamZ = isUnlockedRef.current ? 16.5 : 22.0;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;

      // Camera parallax
      camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.045;
      camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.045;
      camera.lookAt(0, 0, 0);

      // Hero Pearl White Bouquet Sway & Hover Physics
      const breathTime = elapsedTime * 0.75;
      bouquetGroup.rotation.x = -mouse.y * 0.16 + Math.sin(breathTime * 0.6) * 0.035;
      bouquetGroup.rotation.y = mouse.x * 0.22 + Math.cos(breathTime * 0.5) * 0.04;
      bouquetGroup.position.y = Math.sin(breathTime) * 0.15;

      // Floating Pearl White Flowers & Petals Dynamics
      floatingItems.forEach((item) => {
        // Drift downwards
        item.mesh.position.y -= item.speedY;

        // Oscillate sway horizontally with parallax
        item.mesh.position.x =
          item.baseX +
          Math.sin(elapsedTime * item.swayFreq) * item.swayAmp +
          mouse.x * (0.3 + item.parallaxFactor * 0.5);

        // 3D Tumbling rotation
        item.mesh.rotation.x += item.speedRotX;
        item.mesh.rotation.y += item.speedRotY;
        item.mesh.rotation.z += item.speedRotZ;

        // Wrap around when falling below viewport
        if (item.mesh.position.y < -13) {
          item.mesh.position.y = 13;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bouquetTexture.dispose();
      bloomTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
};
