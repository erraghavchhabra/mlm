"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Cpu, ArrowUpRight } from "lucide-react";

export default function FrontFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background Canvas: Animated AI Neural Nodes
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

    // AI Neural Nodes
    const nodes = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Move & draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 148, 255, 0.5)";
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(110, 92, 255, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Matching navbar route paths
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "FAQ's", href: "/faq" },
    { name: "Packages", href: "/packages" },
    { name: "Contact Us", href: "/contact" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="relative w-full z-10 pt-16 pb-10 overflow-hidden border-t border-[#3b2b73]/60 bg-gradient-to-b from-[#080a1e] via-[#0d0a28] to-[#060414]">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 -z-20"
      />

      {/* Spotlights & Grid Overlay */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[250px] bg-[#4a2e99]/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#3e2c8c_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10 space-y-8">
        
        {/* Top Row: Logo Left, Newsletter Right */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#3b2b73]/40">
          
          {/* Logo Left */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#6E5CFF] via-[#5D72FF] to-[#3B488D] p-[1px] shadow-[0_0_20px_rgba(110,92,255,0.4)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0b0e26] rounded-[11px] flex items-center justify-center">
                <Cpu className="h-5 w-5 text-[#8B94FF] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-tech text-xl font-bold tracking-wider text-white">
                AURA<span className="text-[#8B94FF]">.AI</span>
              </span>
              <span className="font-mono-tech text-[9px] text-[#6E5CFF] tracking-widest uppercase -mt-1">
                v2.0 Active
              </span>
            </div>
          </Link>

          {/* Newsletter Right */}
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 w-full md:w-auto min-w-[300px] sm:min-w-[360px]">
            <input
              type="email"
              placeholder="enter.your@email.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e0c29]/90 border border-[#3b2b73] text-sm text-white placeholder-[#685f9c] focus:outline-none focus:border-[#6E5CFF] transition-colors font-mono-tech shadow-inner"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5D72FF] via-[#6E5CFF] to-[#8B94FF] hover:opacity-90 text-white transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(110,92,255,0.4)] shrink-0"
              aria-label="Subscribe"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Navigation Links Bar */}
        <nav className="flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-tech text-sm text-[#A6ABC9] hover:text-white transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#3b2b73]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-[#685f9c]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            SYSTEMS OPERATIONAL
          </span>

          <p>© {new Date().getFullYear()} AURA.AI Inc. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}