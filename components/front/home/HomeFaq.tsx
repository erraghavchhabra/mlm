"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Plus, Minus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    id: 1,
    question: "How does the AURA v2.0 execution engine achieve sub-millisecond latency?",
    answer:
      "Our system leverages zero-copy memory pipelines, custom WebAssembly modules, and co-located nodes near major liquidity providers to bypass conventional REST bottlenecks and deliver near-instant execution.",
  },
  {
    id: 2,
    question: "What security measures protect my API keys and funds?",
    answer:
      "We enforce zero-knowledge encryption protocols across all sensitive credentials. Your keys are client-side encrypted before storage, ensuring no plaintext keys ever touch our database.",
  },
  {
    id: 3,
    question: "Can I connect my existing custom neural networks or models?",
    answer:
      "Yes. AURA v2.0 provides native REST, WebSocket, and gRPC endpoints so you can pipe real-time predictions directly from Python, PyTorch, or TensorFlow frameworks into our automated execution engine.",
  },
  {
    id: 4,
    question: "How are affiliate commissions calculated and paid out?",
    answer:
      "Affiliate payouts are automatically distributed in real-time via smart contract or instant fiat wire. Earnings scale dynamically with your tier and direct downstream volume.",
  },
  {
    id: 5,
    question: "Is institutional-level 24/7 technical support included?",
    answer:
      "All Enterprise accounts receive dedicated account managers and 24/7 direct access to our core systems engineering team through private Slack or Telegram war rooms.",
  },
];

export default function HomeFaq() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Left side header reveal
      gsap.from(".gsap-faq-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // 2. Right side accordion stagger reveal
      gsap.from(".gsap-faq-accordion", {
        scrollTrigger: {
          trigger: ".gsap-faq-grid",
          start: "top 85%",
        },
        x: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 z-10 overflow-hidden"
    >
      {/* Background Radial Spotlights */}
      <div className="absolute top-1/2 -left-40 -translate-y-1/2 w-[500px] h-[500px] bg-[#6E5CFF]/15 blur-[140px] pointer-events-none rounded-full -z-10" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-[#5D72FF]/10 blur-[120px] pointer-events-none rounded-full -z-10" />

      {/* 1400px CONTAINER */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start gsap-faq-grid">
          
          {/* LEFT SIDE: Heading & Subheading (Aligned Top) */}
          <div className="gsap-faq-header lg:col-span-5 space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#8B94FF]" />
              <span className="font-mono text-xs sm:text-sm font-medium text-[#D1D5FF] tracking-wider uppercase">
                Got Questions?
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="font-tech text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E5FF] to-[#8B94FF]">
              Everything You Need to Know
            </h2>

            {/* Subheading */}
            <p className="font-sans text-base sm:text-lg text-[#A6ABC9] leading-relaxed">
              Explore how our automated algorithms, enterprise security, and affiliate programs integrate into your trading workflow.
            </p>
          </div>

          {/* RIGHT SIDE: Accordion List (Aligned Top) */}
          <div className="lg:col-span-7 space-y-4">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.id}
                  className={`gsap-faq-accordion group rounded-2xl transition-all duration-300 border ${
                    isOpen
                      ? "bg-[#0b0e26]/90 border-[#6E5CFF]/80 shadow-[0_0_25px_rgba(110,92,255,0.15)] backdrop-blur-xl"
                      : "bg-[#0b0e26]/50 border-[#2d356b]/70 hover:border-[#3E468A] backdrop-blur-md"
                  }`}
                >
                  {/* Accordion Header / Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-3 sm:p-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <h3 className="font-tech text-base sm:[17px] font-bold text-white group-hover:text-[#E0E5FF] transition-colors leading-snug pr-2">
                      {item.question}
                    </h3>

                    {/* Toggle Icon Badge */}
                    <div
                      className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 ${
                        isOpen
                          ? "bg-[#6E5CFF] text-white rotate-180"
                          : "bg-[#12163b] border border-[#3E468A] text-[#A6ABC9] group-hover:text-white"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Smooth Animated Height Content Panel */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-[#2d356b]/40 mt-1">
                        <p className="font-sans text-sm sm:text-base text-[#A6ABC9] leading-relaxed pt-4">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}