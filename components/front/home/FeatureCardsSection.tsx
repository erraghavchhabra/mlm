"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  ArrowUpRight,
  Cpu,
  LineChart,
  ShieldCheck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const featureCards = [
  {
    id: 1,
    icon: Cpu,
    tag: "High Performance",
    title: "Algorithmic Precision",
    description:
      "Execute trades with sub-millisecond latency powered by our deep learning models tuned for optimal execution across dynamic liquidity pools.",
    badge: "99.99% Uptime",
    glowColor: "from-[#5D72FF]/20 to-[#6E5CFF]/30",
  },
  {
    id: 2,
    icon: LineChart,
    tag: "AI Powered",
    title: "Predictive Analytics",
    description:
      "Uncover emerging market trends early with continuous sentiment analysis, live volume heatmaps, and custom neural network alerts.",
    badge: "AURA v2.0 Engine",
    glowColor: "from-[#8B94FF]/20 to-[#6E5CFF]/30",
  },
  {
    id: 3,
    icon: ShieldCheck,
    tag: "Enterprise Grade",
    title: "Autonomous Risk Guard",
    description:
      "Protect your portfolio automatically using dynamic stop-loss triggers, automated hedge rebalancing, and multi-signature security protocols.",
    badge: "Zero-Knowledge",
    glowColor: "from-[#10B981]/20 to-[#6E5CFF]/30",
  },
];

export default function FeatureCardsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 1. Background Canvas Animation (Animated Grid + Floating Dots)
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

    const dots = Array.from({ length: 35 }, () => ({
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

      // Vertical grid lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let y = offset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Animated glowing dots
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

  // 2. GSAP ScrollTrigger & Stagger Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-features-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".gsap-card-item", {
        scrollTrigger: {
          trigger: ".gsap-cards-grid",
          start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 3. Interactive Mouse Tilt Effect on Glass Cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      rotationY: x * 0.04,
      rotationX: -y * 0.04,
      transformPerspective: 1000,
      ease: "power1.out",
      duration: 0.4,
    });
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      ease: "power2.out",
      duration: 0.6,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 z-10 overflow-hidden"
    >
      {/* FULL-WIDTH Background Animated Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none -z-20"
      />

      {/* FULL-WIDTH Background Radial Glow Spotlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#6E5CFF]/15 blur-[140px] pointer-events-none rounded-full -z-10" />

      {/* 1400px CONTAINER FOR CONTENT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="gsap-features-header text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#8B94FF]" />
            <span className="font-mono text-xs sm:text-sm font-medium text-[#D1D5FF] tracking-wider uppercase">
              Built for Tomorrow
            </span>
          </div>

          <h2 className="font-tech text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E5FF] to-[#8B94FF]">
            Intelligent Infrastructure for Modern Finance
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#A6ABC9] max-w-2xl mx-auto leading-relaxed">
            Unlock institutional-grade automation tools optimized for rapid execution, deep market intelligence, and continuous risk management.
          </p>
        </div>

        {/* 3 Glassmorphism Cards Grid */}
        <div className="gsap-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className="gsap-card-item group relative rounded-3xl bg-[#0b0e26]/60 border border-[#2d356b]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-[#6E5CFF]/80 flex flex-col justify-between overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Inner Radial Glow on Hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6E5CFF]/20 rounded-full blur-3xl group-hover:bg-[#6E5CFF]/40 transition-colors duration-500 pointer-events-none" />

                <div>
                  {/* Top Header Row with Icon & Tag */}
                  <div className="flex items-center justify-between mb-8">
                    {/* Compact Icon Badge */}
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${card.glowColor} border border-[#6E5CFF]/50 shadow-[0_0_15px_rgba(110,92,255,0.25)] group-hover:scale-110 group-hover:border-[#6E5CFF] transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-[#D1D5FF]" />
                    </div>

                    {/* Tag Badge */}
                    <span className="font-mono text-[10px] sm:text-[11px] px-3 py-1 rounded-full bg-[#12163b] border border-[#3E468A] text-[#8B94FF] uppercase tracking-wider backdrop-blur-md">
                      {card.tag}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-tech text-2xl font-bold text-white mb-3 group-hover:text-[#E0E5FF] transition-colors">
                    {card.title}
                  </h3>

                  {/* Card Body Paragraph */}
                  <p className="font-sans text-sm sm:text-base text-[#A6ABC9] leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Footer Row */}
                <div className="pt-6 border-t border-[#2d356b]/50 flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {card.badge}
                  </span>

                  <button
                    type="button"
                    aria-label={`Learn more about ${card.title}`}
                    className="p-2 rounded-xl bg-[#12163b] border border-[#3E468A] text-white group-hover:bg-[#6E5CFF] group-hover:border-[#6E5CFF] transition-all duration-300 flex items-center justify-center"
                  >
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}