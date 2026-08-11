"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  Sparkles,
  ArrowUpRight,
  Cpu,
  ShieldCheck,
  Globe,
  Activity,
  Terminal,
  Target,
  Eye,
  CheckCircle2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const missionPoints = [
  "Eliminate execution friction across decentralized liquidity pools.",
  "Provide institutional-grade automated risk protection.",
  "Deliver sub-millisecond data analysis for intelligent yield distribution.",
];

const visionPoints = [
  "Build a self-learning global financial intelligence network.",
  "Democratize high-frequency automated infrastructure for all users.",
  "Set the standard for transparent, non-custodial Web3 asset management.",
];

const pillars = [
  {
    icon: Cpu,
    tag: "Protocol Core",
    title: "Deep Learning Execution",
    description:
      "Algorithmic decision-making models trained on billions of multi-chain market events to optimize latency and minimize slippage.",
  },
  {
    icon: ShieldCheck,
    tag: "Security Matrix",
    title: "Zero-Knowledge Protection",
    description:
      "Non-custodial risk mitigation powered by automated circuit breakers and real-time smart contract verification.",
  },
  {
    icon: Activity,
    tag: "Throughput Engine",
    title: "Institutional Scaling",
    description:
      "Engineered to seamlessly sustain $2B+ in daily volume transactions with sub-0.4ms response guarantees.",
  },
];

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeCanvasRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 1. Background Grid & Animated Floating Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const gridSize = 40;
    let offset = 0;

    const dots = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      offset = (offset + 0.15) % gridSize;
      ctx.strokeStyle = "rgba(45, 53, 107, 0.25)";
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = offset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0) dot.x = width;
        if (dot.x > width) dot.x = 0;
        if (dot.y < 0) dot.y = height;
        if (dot.y > height) dot.y = 0;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110, 92, 255, ${dot.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#6E5CFF";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Three.js Holographic 3D AI Core Canvas
  useEffect(() => {
    const mountNode = globeCanvasRef.current;
    if (!mountNode) return;

    const width = mountNode.clientWidth;
    const height = mountNode.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountNode.appendChild(renderer.domElement);

    // Outer Wireframe Hologram Sphere
    const outerGeo = new THREE.IcosahedronGeometry(55, 3);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x6e5cff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Inner Glowing Core Sphere
    const innerGeo = new THREE.IcosahedronGeometry(32, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x8b94ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Orbiting Rings
    const ringGeo = new THREE.TorusGeometry(75, 0.6, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x5d72ff,
      transparent: true,
      opacity: 0.5,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    scene.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh2.rotation.y = Math.PI / 4;
    scene.add(ringMesh2);

    // Orbiting Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArr[i] = (Math.random() - 0.5) * 160;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(posArr, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      size: 2,
      color: 0x8b94ff,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mountNode.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 0.5;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      outerMesh.rotation.y = elapsedTime * 0.15 + mouseX;
      outerMesh.rotation.x = elapsedTime * 0.1 + mouseY;

      innerMesh.rotation.y = -elapsedTime * 0.25;
      innerMesh.rotation.z = elapsedTime * 0.15;

      ringMesh1.rotation.z = elapsedTime * 0.2;
      ringMesh2.rotation.x = elapsedTime * 0.25;

      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountNode) return;
      const w = mountNode.clientWidth;
      const h = mountNode.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  // 3. GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-about-hero", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".gsap-pillar-card", {
        scrollTrigger: {
          trigger: ".gsap-pillars-grid",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".gsap-mv-card", {
        scrollTrigger: {
          trigger: ".gsap-mv-grid",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
        clearProps: "all",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative w-full min-h-screen pt-36 pb-24 z-10 overflow-hidden"
    >
      {/* Background Animated Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none -z-20"
      />

      {/* Ambient Radial Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#6E5CFF]/15 blur-[150px] pointer-events-none rounded-full -z-10" />

      {/* CONTAINER */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-28 relative z-10">
        
        {/* HERO SECTION: Text + 3D Holographic AI Sphere */}
        <section ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="gsap-about-hero lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#8B94FF]" />
              <span className="font-mono text-xs sm:text-sm font-medium text-[#D1D5FF] tracking-wider uppercase">
                The Protocol Matrix
              </span>
            </div>

            <h1 className="font-tech text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E5FF] to-[#8B94FF]">
              Engineered for Decentralized Intelligence
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#A6ABC9] leading-relaxed">
              AURA is an autonomous algorithmic execution platform designed to eliminate market latency, secure multi-chain liquidity, and provide institutional-grade yield distribution.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/packages"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#5D72FF] to-[#6E5CFF] shadow-[0_0_20px_rgba(110,92,255,0.4)] hover:shadow-[0_0_30px_rgba(110,92,255,0.7)] transition-all duration-300"
              >
                <span>View Packaages</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

             
            </div>
          </div>

          {/* Right Column: 3D Holographic AI Canvas Viewport */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full h-[380px] sm:h-[450px] rounded-3xl bg-[#0b0e26]/40 border border-[#2d356b]/80 shadow-2xl backdrop-blur-xl overflow-hidden flex items-center justify-center">
              
              {/* Three.js Canvas Container */}
              <div
                ref={globeCanvasRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              />

              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#0b0e26]/80 border border-[#2d356b]/60 backdrop-blur-md flex items-center justify-between font-mono text-xs text-[#D1D5FF]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI Core Status
                </span>
                <span className="text-[#8B94FF]">OPTIMIZED</span>
              </div>
            </div>
          </div>

        </section>

        {/* MISSION & VISION SECTION WITH CONTEXTUAL 3D IMAGERY */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
              <Globe className="w-4 h-4 text-[#8B94FF]" />
              <span className="font-mono text-xs font-medium text-[#D1D5FF] tracking-wider uppercase">
                Purpose & Direction
              </span>
            </div>
            <h2 className="font-tech text-3xl sm:text-4xl font-bold text-white">
              Our Mission & Vision
            </h2>
            <p className="font-sans text-[#A6ABC9] text-sm sm:text-base">
              Guiding the future of autonomous decentralized finance through precision engineering and non-custodial intelligence.
            </p>
          </div>

          <div className="gsap-mv-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* OUR MISSION CARD */}
            <div className="gsap-mv-card group relative rounded-3xl bg-[#0b0e26]/60 border border-[#2d356b]/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-[#6E5CFF]/80 overflow-hidden flex flex-col justify-between space-y-8">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6E5CFF]/20 rounded-full blur-3xl group-hover:bg-[#6E5CFF]/40 transition-colors duration-500 pointer-events-none" />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-[#6E5CFF]/10 border border-[#6E5CFF]/30 text-[#8B94FF] flex items-center gap-2">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#12163b] border border-[#3E468A] text-[#8B94FF] uppercase tracking-wider">
                    Core Objective
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-tech text-3xl font-bold text-white">
                    Our Mission
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#A6ABC9] leading-relaxed">
                    To empower global participants with sub-millisecond automated liquidity execution and transparent risk mitigation tools, creating an unyielding foundation for institutional decentralized capital.
                  </p>
                </div>

                {/* 3D Visual Representation */}
                <div className="relative rounded-2xl overflow-hidden border border-[#2d356b]/60 group-hover:border-[#6E5CFF]/50 transition-colors shadow-lg">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTfNkV_oND9eTKJhtd8yGSnBo54LSCPYXz2iJ2f9I3xzjMH4xS4H9aCAgEO-TqzKv3vs-R7ZrYMgAcHra0"
                    alt="Global Network Mission Concept"
                    className="w-full h-48 sm:h-56 object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e26] via-[#0b0e26]/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 font-mono text-[11px] text-[#D1D5FF] tracking-wider uppercase bg-[#0b0e26]/80 px-3 py-1 rounded-md border border-[#2d356b]">
                    [ Autonomous Execution Network ]
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="space-y-3 pt-2 font-sans text-xs sm:text-sm text-[#A6ABC9]">
                  {missionPoints.map((point) => (
                    <div key={point} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8B94FF] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OUR VISION CARD */}
            <div className="gsap-mv-card group relative rounded-3xl bg-[#0b0e26]/60 border border-[#2d356b]/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-[#6E5CFF]/80 overflow-hidden flex flex-col justify-between space-y-8">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6E5CFF]/20 rounded-full blur-3xl group-hover:bg-[#6E5CFF]/40 transition-colors duration-500 pointer-events-none" />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-[#6E5CFF]/10 border border-[#6E5CFF]/30 text-[#8B94FF] flex items-center gap-2">
                    <Eye className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#12163b] border border-[#3E468A] text-[#8B94FF] uppercase tracking-wider">
                    Future Horizon
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-tech text-3xl font-bold text-white">
                    Our Vision
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#A6ABC9] leading-relaxed">
                    To pioneer the premier self-evolving neural network protocol that sets the universal benchmark for algorithmic trading efficiency, non-custodial security, and automated yield generation.
                  </p>
                </div>

                {/* 3D Visual Representation */}
                <div className="relative rounded-2xl overflow-hidden border border-[#2d356b]/60 group-hover:border-[#6E5CFF]/50 transition-colors shadow-lg">
                  <img
                    src="https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRF55Wn2dwDHi534HyNC0YmY6HhIeBtm-vIrE2-r2y89IrWxPG5Hfn5gW33SRbAHxca6BBiE6d-G-YUCmk"
                    alt="Futuristic AI Hologram Vision"
                    className="w-full h-48 sm:h-56 object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e26] via-[#0b0e26]/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 font-mono text-[11px] text-[#D1D5FF] tracking-wider uppercase bg-[#0b0e26]/80 px-3 py-1 rounded-md border border-[#2d356b]">
                    [ Neural Intelligence Matrix ]
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="space-y-3 pt-2 font-sans text-xs sm:text-sm text-[#A6ABC9]">
                  {visionPoints.map((point) => (
                    <div key={point} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#8B94FF] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* THREE CORE PILLARS GRID */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-tech text-3xl sm:text-4xl font-bold text-white">
              System Architecture
            </h2>
            <p className="font-sans text-[#A6ABC9] text-sm sm:text-base">
              Built on three immutable pillars designed for speed, security, and capital efficiency.
            </p>
          </div>

          <div className="gsap-pillars-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="gsap-pillar-card group relative rounded-3xl bg-[#0b0e26]/60 border border-[#2d356b]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-[#6E5CFF]/80 overflow-hidden"
                >
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6E5CFF]/20 rounded-full blur-3xl group-hover:bg-[#6E5CFF]/40 transition-colors duration-500 pointer-events-none" />

                  <div className="flex items-center justify-between mb-8">
                    <div className="p-3.5 rounded-2xl bg-[#6E5CFF]/10 border border-[#6E5CFF]/30 text-[#8B94FF] group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[10px] px-3 py-1 rounded-full bg-[#12163b] border border-[#3E468A] text-[#8B94FF] uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-tech text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="font-sans text-sm text-[#A6ABC9] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="relative rounded-3xl bg-[#0b0e26]/80 border border-[#2d356b] p-8 sm:p-12 text-center overflow-hidden backdrop-blur-xl space-y-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5D72FF]/10 via-[#6E5CFF]/15 to-transparent pointer-events-none" />
          
          <h2 className="font-tech text-3xl sm:text-4xl font-extrabold text-white">
            Join the Next Era of Automated Finance
          </h2>

          <p className="font-sans text-[#A6ABC9] max-w-xl mx-auto text-sm sm:text-base">
            Explore our automated investment packages or connect directly with our engineering team.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#5D72FF] to-[#6E5CFF] shadow-[0_0_20px_rgba(110,92,255,0.4)] hover:shadow-[0_0_30px_rgba(110,92,255,0.7)] transition-all duration-300"
            >
              <span>Explore Packages</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider text-[#D1D5FF] bg-[#12163b]/70 border border-[#2d356b] hover:bg-[#6E5CFF]/20 hover:border-[#6E5CFF] transition-all duration-300"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}