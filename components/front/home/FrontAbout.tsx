"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  MessageSquareDot,
  ArrowRight,
  CornerDownRight,
} from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function FrontCallToAction() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal Timeline triggered when scrolled into view
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // Triggers when the top of section hits 80% of viewport
          toggleActions: "play none none none",
        },
      });

      revealTl
        // Animate media container sliding/fading in from the left
        .from(".gsap-cta-image", {
          x: -60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        })
        // Animate text elements cascading in from the right
        .from(
          ".gsap-cta-tag",
          { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" },
          "-=0.6"
        )
        .from(
          ".gsap-cta-title",
          { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .from(
          ".gsap-cta-desc",
          { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .from(
          ".gsap-cta-btn",
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            clearProps: "all",
          },
          "-=0.4"
        );

      // 2. Continuous Floating Animation (Starts after/alongside the reveal)
      gsap.to(imageRef.current, {
        y: 15,
        duration: 3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 z-10 overflow-hidden"
    >
      {/* FULL-WIDTH Background Decorative Gradient Radial */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#6E5CFF]/10 blur-[120px] pointer-events-none -z-10" />

      {/* 1400px CONTAINER FOR CONTENT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* LEFT SIDE: Animated Media Container */}
          <div className="gsap-cta-image lg:col-span-6 flex justify-center lg:justify-start order-2 lg:order-1">
            <div ref={imageRef} className="relative group">
              {/* High-tech border and backdrop matching Hero elements */}
              <div className="relative z-10 rounded-3xl bg-[#0b0e26]/70 border border-[#2d356b] p-6 shadow-2xl backdrop-blur-sm group-hover:border-[#6E5CFF]/60 transition-colors duration-500">
                <video
                  src="/assets/img/ab.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-2xl w-full object-cover aspect-[5/4] shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                />

                {/* Internal Status Badge matching Navbar */}
                <div className="absolute bottom-10 left-10 flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#12163b]/90 border border-[#3E468A] backdrop-blur-md shadow-lg pointer-events-none">
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                    <CornerDownRight className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-tech text-xs text-white">
                      SYSTEM ONLINE
                    </span>
                    <span className="font-mono text-[9px] text-emerald-400">
                      AURA v2.0 Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Glowing effect below the container matching Hero badges */}
              <div className="absolute inset-0 bg-[#6E5CFF]/20 rounded-3xl blur-3xl opacity-60 -z-10 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* RIGHT SIDE: Text and Button */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left order-1 lg:order-2">
            {/* 1. Subheading tag matching Hero */}
            <div className="gsap-cta-tag inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#8B94FF]" />
              <span className="font-mono text-xs sm:text-sm font-medium text-[#D1D5FF] tracking-wider uppercase">
                Join Our Global Network
              </span>
            </div>

            {/* 2. Heading matching Hero gradient */}
            <h2 className="gsap-cta-title font-tech text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E5FF] to-[#8B94FF]">
              Accelerate Your Earnings with Our Affiliate Program
            </h2>

            {/* 3. Paragraph matching Hero description text */}
            <p className="gsap-cta-desc font-sans text-base sm:text-lg text-[#A6ABC9] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Our powerful affiliate ecosystem rewards transparency and
              performance. Scale your growth by leveraging our automated AI
              marketing tools and a worldwide collaborative network. Unlock
              exclusive bonuses as you climb the ranks.
            </p>

            {/* 4. Action Button matching Hero primary style */}
            <div className="flex items-center justify-center lg:justify-start pt-3">
              <a
                href="/contact"
                className="gsap-cta-btn font-tech group relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5D72FF] via-[#6E5CFF] to-[#8B94FF] text-white font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(93,114,255,0.4)] hover:shadow-[0_0_35px_rgba(93,114,255,0.7)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2.5"
              >
                {/* Shine effect on hover */}
                <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out" />

                <MessageSquareDot className="w-4 h-4" />
                <span>Contact Our Team</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}