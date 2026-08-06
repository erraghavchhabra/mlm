"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Network,
  Compass,
  Zap,
  Globe,
  ShieldCheck,
} from "lucide-react";

// Dynamically import Three.js canvas
const HeroCanvas = dynamic(
  () => import("@/components/front/home/canvas/HeroCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] sm:h-[550px] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#6E5CFF] border-t-transparent animate-spin" />
      </div>
    ),
  }
);

const heroStats = [
  { icon: Globe, value: "120+", label: "Countries Active" },
  { icon: Zap, value: "< 1ms", label: "Analytics Latency" },
  { icon: ShieldCheck, value: "99.99%", label: "Uptime Protocol" },
];

export default function FrontHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const ctx = gsap.context(() => {
      // Create explicit timeline using fromTo to prevent silent GSAP execution
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.9 },
      });

      tl.fromTo(
        ".gsap-hero-tag",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1 }
      )
        .fromTo(
          ".gsap-hero-title",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1 },
          "-=0.6"
        )
        .fromTo(
          ".gsap-hero-desc",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1 },
          "-=0.6"
        )
        .fromTo(
          ".gsap-hero-btn",
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.15 },
          "-=0.5"
        )
        .fromTo(
          ".gsap-hero-stats",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          ".gsap-hero-3d",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2 },
          "-=0.8"
        )
        .fromTo(
          ".gsap-hero-badge",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.2, ease: "back.out(1.8)" },
          "-=0.6"
        );

      // Continuous Yoyo Floating for status badges
      gsap.to(".gsap-hero-badge-1", {
        y: -14,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".gsap-hero-badge-2", {
        y: 14,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMounted]);

  return (
    <section
      ref={containerRef}
      className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10 pt-32 pb-20 overflow-hidden"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#6E5CFF]/15 blur-[160px] pointer-events-none rounded-full -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-160px)]">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
          {/* Subheading Tag */}
          <div className="gsap-hero-tag inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#8B94FF] animate-pulse" />
            <span className="font-mono-tech text-xs sm:text-sm font-medium text-[#D1D5FF] tracking-wider uppercase">
              Next-Gen AI Ecosystem
            </span>
          </div>

          {/* Title */}
          <h1 className="gsap-hero-title font-tech text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E5FF] to-[#8B94FF]">
            AI-Driven Financial Growth Platform
          </h1>

          {/* Description */}
          <p className="gsap-hero-desc font-sans-ui text-base sm:text-lg text-[#A6ABC9] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Our intelligent ecosystem uses advanced AI analytics to uncover opportunities, optimize performance, and support long-term wealth creation. Combined with a global affiliate network, members benefit from automation, transparency, and scalable growth.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 relative z-20">
            <a
              href="#get-started"
              className="gsap-hero-btn font-tech relative group overflow-hidden w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#5D72FF] via-[#6E5CFF] to-[#8B94FF] text-white font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(93,114,255,0.4)] hover:shadow-[0_0_35px_rgba(93,114,255,0.7)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5"
            >
              <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#packages"
              className="gsap-hero-btn font-tech group w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#12163b]/80 hover:bg-[#1c2254] text-[#D1D5FF] hover:text-white font-semibold text-sm tracking-wide border border-[#2d356b] hover:border-[#6E5CFF]/60 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <Compass className="w-4 h-4 text-[#8B94FF] group-hover:rotate-45 transition-transform duration-300" />
              <span>Explore Packages</span>
            </a>
          </div>

          {/* Stat Metrics Bar */}
          <div className="pt-6 border-t border-[#2d356b]/50 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
            {heroStats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className="gsap-hero-stats flex flex-col space-y-1 text-left">
                  <div className="flex items-center gap-1.5 text-[#8B94FF]">
                    <StatIcon className="w-3.5 h-3.5" />
                    <span className="font-tech text-base sm:text-lg font-bold text-white">
                      {stat.value}
                    </span>
                  </div>
                  <span className="font-mono-tech text-[10px] text-[#A6ABC9] uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3D Canvas & Badges */}
        <div className="lg:col-span-6 min-w-0 relative flex justify-center items-center w-full">
          {/* Subtle Glow Ring behind Canvas */}
          <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-tr from-[#6E5CFF]/30 to-[#8B94FF]/10 blur-3xl pointer-events-none -z-10" />

          {/* Canvas Container */}
          <div className="gsap-hero-3d w-full min-w-0 relative z-10">
            <HeroCanvas />
          </div>

          {/* Floating Badge 1 */}
          <div className="gsap-hero-badge gsap-hero-badge-1 absolute top-6 left-0 sm:left-4 bg-[#181B42]/90 border border-[#3E468A] p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md z-20">
            <div className="p-2.5 rounded-xl bg-[#252A5E] text-[#7C84FF]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-tech text-xs font-semibold text-white">Neural Core Active</p>
              <p className="font-mono-tech text-[10px] text-[#8892C6]">Real-time Market Analytics</p>
            </div>
          </div>

          {/* Floating Badge 2 */}
          <div className="gsap-hero-badge gsap-hero-badge-2 absolute bottom-6 right-0 sm:right-4 bg-[#181B42]/90 border border-[#3E468A] p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md z-20">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <p className="font-tech text-xs font-semibold text-white">Affiliate Sync</p>
              <p className="font-mono-tech text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Scalable Growth
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 