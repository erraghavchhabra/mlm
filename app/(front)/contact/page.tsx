"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Send, CheckCircle2, Mail, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const countryCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "IN" },
  { code: "+61", country: "AU" },
  { code: "+81", country: "JP" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+971", country: "UAE" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. Background Canvas Animation
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

  // 2. GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-contact-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".gsap-contact-card", {
        scrollTrigger: {
          trigger: ".gsap-contact-card",
          start: "top 85%",
        },
        x: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full pt-36 pb-24 z-10 overflow-hidden"
    >
      {/* FULL-WIDTH Background Animated Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none -z-20"
      />

      {/* FULL-WIDTH Background Radial Glow Spotlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#6E5CFF]/15 blur-[140px] pointer-events-none rounded-full -z-10" />

      {/* CONTAINER FOR CONTENT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Heading & Technical Information */}
          <div className="gsap-contact-content lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-[#8B94FF]" />
                <span className="font-mono text-xs sm:text-sm font-medium text-[#D1D5FF] tracking-wider uppercase">
                  Get In Touch
                </span>
              </div>

              <h2 className="font-tech text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E5FF] to-[#8B94FF]">
                Initiate Communication
              </h2>

              <p className="font-sans text-base sm:text-lg text-[#A6ABC9] leading-relaxed">
                Reach out to our engineering team for custom infrastructure integrations, institutional support, or technical onboarding.
              </p>
            </div>

            {/* Feature Highlights / Direct Channels */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0b0e26]/40 border border-[#2d356b]/50 backdrop-blur-md">
                <div className="p-2.5 rounded-xl bg-[#6E5CFF]/10 border border-[#6E5CFF]/30 text-[#8B94FF]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs text-[#D1D5FF] uppercase tracking-wider">Direct Dispatch</h4>
                  <p className="font-sans text-sm text-[#A6ABC9]">support@aura-ai.network</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: Contact Form Glass Card (Clean Hover, No 3D Tilt) */}
          <div className="lg:col-span-7">
            <div className="gsap-contact-card group relative rounded-3xl bg-[#0b0e26]/60 border border-[#2d356b]/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-[#6E5CFF]/80 overflow-hidden">
              {/* Inner Radial Glow on Hover */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6E5CFF]/20 rounded-full blur-3xl group-hover:bg-[#6E5CFF]/40 transition-colors duration-500 pointer-events-none" />

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-tech text-2xl font-bold text-white">
                    Message sent
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#A6ABC9] max-w-md mx-auto">
                    Thank you for connecting. Our team will review your dispatch and follow up shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-[#12163b] border border-[#3E468A] text-sm font-mono text-[#D1D5FF] hover:bg-[#6E5CFF] hover:border-[#6E5CFF] transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Your Name */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Satoshi Nakamoto"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
                    />
                  </div>

                  {/* Email ID */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
                      Email ID
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="satoshi@network.org"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
                    />
                  </div>

                  {/* Country Code & Phone Number Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Country Code */}
                    <div className="space-y-2 sm:col-span-1">
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
                        Country Code
                      </label>
                      <select
                        value={formData.countryCode}
                        onChange={(e) =>
                          setFormData({ ...formData, countryCode: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-mono text-sm cursor-pointer"
                      >
                        {countryCodes.map((item) => (
                          <option
                            key={`${item.code}-${item.country}`}
                            value={item.code}
                            className="bg-[#0b0e26] text-white"
                          >
                            {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="555 019 2831"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your requirements or questions..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5D72FF] to-[#6E5CFF] text-white font-mono text-sm font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(110,92,255,0.4)] hover:shadow-[0_0_30px_rgba(110,92,255,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4 text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}