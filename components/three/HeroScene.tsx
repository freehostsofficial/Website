"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useIsMobile } from "@/hooks/useMediaQuery";
import type { Group, Object3D } from "three";

const SHAPES_COUNT_DESKTOP = 20;
const SHAPES_COUNT_MOBILE = 8;

function FloatingShapes({ count }: { count: number }) {
  const groupRef = useRef<Group>(null);

  const shapes = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 2,
      ] as [number, number, number],
      rotationSpeed: 0.2 + Math.random() * 0.3,
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatOffset: Math.random() * Math.PI * 2,
      scale: 0.15 + Math.random() * 0.25,
    })), [count]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child: Object3D, i: number) => {
      const s = shapes[i];
      child.rotation.x += s.rotationSpeed * 0.005;
      child.rotation.y += s.rotationSpeed * 0.008;
      child.position.y = s.position[1] + Math.sin(t * s.floatSpeed + s.floatOffset) * 0.5;
    });
  });

  const geometries = [<icosahedronGeometry key="ico" args={[1, 0]} />, <octahedronGeometry key="oct" args={[1]} />, <torusKnotGeometry key="tk" args={[0.8, 0.3, 32, 8]} />];

  return (
    <group ref={groupRef}>
      {shapes.map((s) => (
        <mesh key={s.id} position={s.position} scale={s.scale}>
          {geometries[s.id % geometries.length]}
          <meshStandardMaterial
            color={`hsl(${160 + s.id * 8}, 70%, 50%)`}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  const isMobile = useIsMobile();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Canvas dpr={isMobile ? [1, 1] : [1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.3} />
        <FloatingShapes count={isMobile ? SHAPES_COUNT_MOBILE : SHAPES_COUNT_DESKTOP} />
      </Canvas>
    </div>
  );
}
