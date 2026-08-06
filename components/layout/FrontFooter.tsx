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
    const nodes = Array.from({ length: 45 }, () => ({
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

        // Connect nearby nodes to form neural network connections
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

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Algorithmic Precision", href: "#features" },
        { name: "Predictive Analytics", href: "#features" },
        { name: "Autonomous Risk", href: "#features" },
        { name: "System Status", href: "#status" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "API Reference", href: "#api" },
        { name: "Packages & Pricing", href: "#packages" },
        { name: "System Architecture", href: "#architecture" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "FAQ's", href: "#faq" },
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
      ],
    },
  ];

  return (
    <footer className="relative w-full z-10 pt-20 pb-12 overflow-hidden border-t border-[#3b2b73]/60 bg-gradient-to-b from-[#080a1e] via-[#0d0a28] to-[#060414]">
      {/* Dynamic Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 -z-20"
      />

      {/* Dark Purple & Deep Navy Spotlights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#4a2e99]/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[350px] bg-[#2a1b5c]/30 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Grid Overlay Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3e2c8c_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[#3b2b73]/50">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFF] via-[#5D72FF] to-[#2B1B69] p-[1px] shadow-[0_0_25px_rgba(124,92,255,0.4)] transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-[#0a091d] rounded-[11px] flex items-center justify-center">
                  <Cpu className="h-5 w-5 text-[#9D8CFF] group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-tech text-xl font-bold tracking-wider text-white flex items-center gap-1">
                  AURA<span className="text-[#9D8CFF]">.AI</span>
                </span>
                <span className="font-mono-tech text-[9px] text-[#8C6CFF] tracking-widest uppercase -mt-1">
                  v2.0 Active
                </span>
              </div>
            </Link>

            <p className="font-sans text-sm text-[#A8A1D3] max-w-sm leading-relaxed">
              Institutional-grade autonomous trading infrastructure engineered for microsecond execution, high precision, and predictive portfolio defense.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-2 pt-2">
              <span className="font-mono-tech text-xs uppercase tracking-wider text-[#D5CEFF] block">
                Stay Updated
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="enter.your@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e0c29]/90 border border-[#3b2b73] text-sm text-white placeholder-[#685f9c] focus:outline-none focus:border-[#7C5CFF] transition-colors font-mono-tech shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6E5CFF] to-[#8C5CFF] hover:from-[#5D72FF] hover:to-[#7C5CFF] text-white transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(110,92,255,0.4)]"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-mono-tech text-xs font-semibold uppercase tracking-widest text-[#9D8CFF]">
                  [ {section.title} ]
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="font-tech text-sm text-[#A8A1D3] hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                      >
                        <span>{link.name}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-[#8C6CFF]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono-tech text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              SYSTEMS OPERATIONAL
            </span>
          </div>

          <p className="font-mono-tech text-xs text-[#685f9c]">
            © {new Date().getFullYear()} AURA.AI Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}