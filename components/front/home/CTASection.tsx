"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Background Canvas: Slow Expanding Wave Pulse & Particle Grid
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

    // Dynamic Pulsing Waves - Speed significantly slowed down (0.4 vs 1.2)
    const waves = [
      { radius: 0, maxRadius: 350, speed: 0.4, alpha: 0.6 },
      { radius: 115, maxRadius: 350, speed: 0.4, alpha: 0.4 },
      { radius: 230, maxRadius: 350, speed: 0.4, alpha: 0.2 },
    ];

    // Floating particles
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.3 + 0.1), // Slowed particle movement as well
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Slow Expanding Concentric Wave Pulses
      waves.forEach((wave) => {
        wave.radius += wave.speed;
        if (wave.radius > wave.maxRadius) {
          wave.radius = 0;
        }

        const opacity = (1 - wave.radius / wave.maxRadius) * wave.alpha;

        ctx.beginPath();
        ctx.arc(centerX, centerY, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(110, 92, 255, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#6E5CFF";
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Rising Particles
      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 148, 255, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. GSAP Scroll Trigger Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card Entrance Reveal
      gsap.from(".gsap-cta-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        scale: 0.98,
        duration: 1,
        ease: "power3.out",
      });

      // Content Stagger Reveal
      gsap.from(".gsap-cta-content > *", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 z-10 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="gsap-cta-card group relative rounded-3xl bg-[#0b0e26]/80 border border-[#2d356b]/80 p-8 sm:p-14 lg:p-20 shadow-2xl backdrop-blur-2xl overflow-hidden transition-colors duration-500 hover:border-[#6E5CFF]/80">
          {/* Background Canvas for Slow Wave Pulse */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none -z-20"
          />

          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#6E5CFF]/20 blur-[120px] rounded-full pointer-events-none -z-10 group-hover:bg-[#6E5CFF]/30 transition-colors duration-500" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#5D72FF]/15 blur-[100px] rounded-full pointer-events-none -z-10" />

          {/* Grid Overlay Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#2d356b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none -z-10" />

          {/* Content Block */}
          <div className="gsap-cta-content max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/40 bg-[#6E5CFF]/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#8B94FF]" />
              <span className="font-mono text-xs sm:text-sm font-medium text-[#D1D5FF] tracking-wider uppercase">
                Instant Deployment
              </span>
            </div>

            {/* Main Title */}
            <h2 className="font-tech text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E5FF] to-[#8B94FF]">
              Ready to Automate Your Portfolio Strategy?
            </h2>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg text-[#A6ABC9] max-w-2xl mx-auto leading-relaxed">
              Connect your exchange keys in under 2 minutes. Start leveraging
              sub-millisecond execution and real-time predictive risk models today.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#get-started"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5D72FF] to-[#6E5CFF] text-white font-medium text-base shadow-[0_0_35px_rgba(110,92,255,0.4)] hover:shadow-[0_0_50px_rgba(110,92,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                <span>Start Free 14-Day Trial</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </a>

              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#12163b] border border-[#3E468A] text-[#D1D5FF] hover:text-white hover:bg-[#1a2052] hover:border-[#6E5CFF]/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 font-medium text-base backdrop-blur-md"
              >
                <span>Book Architecture Demo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}