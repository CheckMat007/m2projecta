// src/components/DroneViewer3D.tsx
'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Image from 'next/image';
import * as THREE from 'three';

type DroneViewer3DProps = {
  topImage: string;
  bottomImage: string;
  label: string;
};

// Modelo esculpido em Blender a partir das fotos de referência (curvas
// Bezier para o casco e as pás, hastes em tubo para os braços) — ver
// assets-src/drone-mini-source.blend para a fonte editável.
const MODEL_PATH = '/models/drone-mini.glb';

const PROPELLER_NAMES = ['Propeller_FR', 'Propeller_FL', 'Propeller_BL', 'Propeller_BR'] as const;

useGLTF.preload(MODEL_PATH);

function DroneRig() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const propellersRef = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    propellersRef.current = PROPELLER_NAMES.map((name) => scene.getObjectByName(name)).filter(
      (obj): obj is THREE.Object3D => Boolean(obj),
    );
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.45;
    propellersRef.current.forEach((prop, index) => {
      prop.rotation.y += delta * (index % 2 === 0 ? 16 : -16);
    });
  });

  return (
    <group ref={groupRef} rotation={[0.1, 0, 0]} scale={9.5}>
      <primitive object={scene} />
    </group>
  );
}

// Erros de textura (ex.: imagem ainda não publicada em /public/assets/drones) só são
// capturáveis por um error boundary de classe — não existe equivalente em hooks.
class ViewerErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function DroneViewer3D({ topImage, label }: DroneViewer3DProps) {
  const fallback = (
    <div className="relative w-full h-full min-h-[320px]">
      <Image
        src={topImage}
        alt={label}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 90vw, 480px"
      />
    </div>
  );

  return (
    <ViewerErrorBoundary fallback={fallback}>
      <Canvas camera={{ position: [0, 0.5, 4.8], fov: 32 }} dpr={[1, 2]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={1.5} />
        <directionalLight position={[-3, -2, -4]} intensity={0.4} />
        <directionalLight position={[0, 3, -2]} intensity={0.5} color="#bcd7ff" />
        <Suspense fallback={null}>
          <DroneRig />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={5.6}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>
    </ViewerErrorBoundary>
  );
}
