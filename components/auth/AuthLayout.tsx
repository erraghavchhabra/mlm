"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import * as THREE from "three";

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene, Camera & Renderer Setup
    const scene = new THREE.Scene();
    
    // Add atmospheric fog for depth attenuation across full screen
    scene.fog = new THREE.FogExp2(0x070812, 0.0012);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(0, 0, 400);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Full-Screen Infinite Particles (Neural Starfield / Data Stream)
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPrimary = new THREE.Color("#6E5CFF");
    const colorSecondary = new THREE.Color("#8B94FF");

    for (let i = 0; i < particleCount; i++) {
      // Spread evenly across large x, y, z ranges to cover entire background
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

      const mixedColor = colorPrimary.clone().lerp(colorSecondary, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Glow Texture for circular nodes
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.3, "rgba(110,92,255,0.8)");
      grad.addColorStop(1, "rgba(7,8,18,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 6,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Full-Screen Floor/Ceiling Cyber Grid Lines
    const gridHelperFloor = new THREE.GridHelper(3000, 60, 0x6e5cff, 0x2d356b);
    gridHelperFloor.position.y = -400;
    scene.add(gridHelperFloor);

    const gridHelperCeiling = new THREE.GridHelper(3000, 60, 0x6e5cff, 0x12163b);
    gridHelperCeiling.position.y = 400;
    scene.add(gridHelperCeiling);

    // 4. Mouse Interactive Parallax State
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.2;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // 5. Infinite Travel Animation Loop
    let animationFrameId: number;

    const animate = () => {
      // Camera parallax response
      camera.position.x += (mouseX - camera.position.x) * 0.03;
      camera.position.y += (-mouseY - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      // Move particle positions forward along Z-axis for infinite fly-through effect
      const posArr = geometry.attributes.position.array as Float32Array;
      for (let i = 2; i < particleCount * 3; i += 3) {
        posArr[i] += 1.2; // Move toward camera
        if (posArr[i] > 1000) {
          posArr[i] = -1000; // Reset back to distance
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Animate grid flight effect
      gridHelperFloor.position.z = (gridHelperFloor.position.z + 1.5) % 50;
      gridHelperCeiling.position.z = (gridHelperCeiling.position.z + 1.5) % 50;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      gridHelperFloor.dispose();
      gridHelperCeiling.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070812]">
      {/* Three.js Full-Screen Cyber AI Matrix Canvas */}
      <div
        ref={mountRef}
        className="fixed inset-0 z-0 pointer-events-none opacity-90"
      />

      {/* Ambient Gradient Highlights */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#6E5CFF]/15 blur-[160px] pointer-events-none rounded-full z-0" />

      {/* Top Left Navigation Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0b0e26]/70 border border-[#2d356b]/80 text-[#D1D5FF] backdrop-blur-xl shadow-lg hover:border-[#6E5CFF]/80 hover:text-white transition-all duration-300 hover:scale-[1.02]"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B94FF] group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-mono text-xs uppercase tracking-wider font-medium">
            Back to Home
          </span>
        </Link>
      </div>

      {/* Foreground Form Card Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}