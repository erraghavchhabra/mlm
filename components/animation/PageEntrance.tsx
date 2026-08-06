// components/animation/PageEntrance.tsx
"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger in case child components use it
gsap.registerPlugin(ScrollTrigger);

interface PageEntranceProps {
  children: ReactNode;
}

export default function PageEntrance({ children }: PageEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure animation runs after DOM layout is ready
    const ctx = gsap.context(() => {
      const mainTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Refresh ScrollTrigger so child scroll animations recalculate their positions accurately
          ScrollTrigger.refresh();
        },
      });

      // Set initial states to avoid glitching/flashing before GSAP triggers
      gsap.set(".gsap-reveal-target", { opacity: 0 });

      mainTl
        // 1. Reveal ambient glow backgrounds
        .to(".gsap-bg-glow", {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
        })
        // 2. Slide/Fade in Hero
        .fromTo(
          ".gsap-hero-wrapper",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.9"
        )
        // 3. Slide/Fade in Ticker
        .fromTo(
          ".gsap-ticker-wrapper",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.5"
        );
    }, containerRef); // Scope selector strictly inside containerRef

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}