// components/front/home/canvas/HeroCanvas.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function AiHologramBrain() {
  const pointsRef = useRef<THREE.Points>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  const particlePositions = useMemo(() => {
    const count = 2200;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const hemisphere = Math.random() > 0.5 ? 1 : -1;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      let x = 1.3 * Math.sin(phi) * Math.cos(theta);
      let y = 1.0 * Math.sin(phi) * Math.sin(theta);
      let z = 1.1 * Math.cos(phi);

      x += hemisphere * 0.35;
      x += Math.sin(y * 8) * 0.08;
      y += Math.cos(z * 8) * 0.08;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    return positions;
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (pointsRef.current) pointsRef.current.rotation.y = elapsed * 0.2;
    if (coreRef.current) {
      coreRef.current.rotation.x = elapsed * 0.4;
      coreRef.current.rotation.z = elapsed * 0.3;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.x = elapsed * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.y = elapsed * -0.5;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
      <group>
        {/* 3D Neural Particle Brain */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            color="#8B94FF"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>

        {/* Glowing Brain Core Matrix */}
        <mesh ref={coreRef} scale={0.7}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#6E5CFF"
            wireframe
            emissive="#5D72FF"
            emissiveIntensity={1.5}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Orbital Data Ring 1 */}
        <mesh ref={ring1Ref} scale={2.1}>
          <torusGeometry args={[1, 0.008, 16, 100]} />
          <meshBasicMaterial color="#6E5CFF" transparent opacity={0.6} />
        </mesh>

        {/* Orbital Data Ring 2 */}
        <mesh ref={ring2Ref} scale={2.4}>
          <torusGeometry args={[1, 0.006, 16, 100]} />
          <meshBasicMaterial color="#8B94FF" transparent opacity={0.4} />
        </mesh>

        {/* Floating AI Synapse Sparks */}
        <Sparkles count={80} scale={4.5} size={2.5} speed={0.5} color="#A6ABC9" />
      </group>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <div className="w-full h-[450px] sm:h-[550px] relative overflow-hidden flex items-center justify-center min-w-0">
      <Canvas
        /* Prevents R3F from attaching scroll listeners that resize the viewport */
        resize={{ scroll: false, offsetSize: true }}
        camera={{ position: [0, 0, 7.0], fov: 45, near: 0.1, far: 1000 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#6E5CFF" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#8B94FF" />

        <AiHologramBrain />

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}