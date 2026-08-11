"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  ArrowUpRight,
  Calculator,
  Loader2,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import api from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export interface Plan {
  id: number;
  plan_name: string;
  category?: string;
  cost: string;
  max: number;
  min: number;
  refer_bouns?: number | null;
  roi_net: number;
  roi_weekly: string;
  levels?: number;
  time_periods: string;
  stock?: string;
}

// Fallback plans if backend API is offline
const fallbackPlans: Plan[] = [
  {
    id: 1,
    plan_name: "Starter Node",
    category: "Standard Protocol",
    cost: "$100 - $1,000",
    min: 100,
    max: 1000,
    roi_net: 1.2,
    roi_weekly: "8.4",
    time_periods: "30 Days",
    levels: 3,
  },
  {
    id: 2,
    plan_name: "Pro Matrix",
    category: "High Yield Protocol",
    cost: "$1,000 - $10,000",
    min: 1000,
    max: 10000,
    roi_net: 1.8,
    roi_weekly: "12.6",
    time_periods: "60 Days",
    levels: 5,
  },
  {
    id: 3,
    plan_name: "Institutional Tier",
    category: "Enterprise Protocol",
    cost: "$10,000 - $100,000",
    min: 10000,
    max: 100000,
    roi_net: 2.5,
    roi_weekly: "17.5",
    time_periods: "90 Days",
    levels: 10,
  },
];

export default function PublicPackagesPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("1000");

  // 1. Fetch Investment Plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        if (res.data?.status && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setPlans(res.data.data);
          setSelectedPlan(res.data.data[0]);
          setInvestmentAmount(res.data.data[0].min.toString());
        } else {
          setPlans(fallbackPlans);
          setSelectedPlan(fallbackPlans[0]);
          setInvestmentAmount(fallbackPlans[0].min.toString());
        }
      } catch (err) {
        console.error("Using fallback investment packages:", err);
        setPlans(fallbackPlans);
        setSelectedPlan(fallbackPlans[0]);
        setInvestmentAmount(fallbackPlans[0].min.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // 2. AUTO-SELECT PACKAGE BASED ON ENTERED AMOUNT
  useEffect(() => {
    if (plans.length === 0) return;

    const val = Number(investmentAmount);
    if (!val || isNaN(val)) return;

    // Find plan where entered amount falls within min and max
    const matchingPlan = plans.find((p) => {
      const maxVal = p.max && p.max > 0 ? p.max : Infinity;
      return val >= p.min && val <= maxVal;
    });

    if (matchingPlan) {
      setSelectedPlan(matchingPlan);
    } else {
      // Fallback: If amount is higher than all max limits, select the highest plan
      const highestPlan = [...plans].sort((a, b) => b.min - a.min)[0];
      if (val > highestPlan.min) {
        setSelectedPlan(highestPlan);
      }
    }
  }, [investmentAmount, plans]);

  // 3. PULSATING AI MIND BACKGROUND ANIMATION
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

    // AI Neural Nodes initialization
    const nodeCount = 55;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1.5,
      baseAlpha: Math.random() * 0.5 + 0.3,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulseAngle: Math.random() * Math.PI * 2,
    }));

    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulseTime += 0.02;

      // Central AI Mind Pulsing Aura Glow
      const centerX = width / 2;
      const centerY = height / 3;
      const auraRadius = 250 + Math.sin(pulseTime * 1.5) * 40;
      const auraGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        auraRadius
      );
      auraGradient.addColorStop(0, "rgba(110, 92, 255, 0.15)");
      auraGradient.addColorStop(0.5, "rgba(93, 114, 255, 0.05)");
      auraGradient.addColorStop(1, "rgba(11, 14, 38, 0)");

      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // Update Node Positions & Draw Connections (Synapses)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        node.pulseAngle += node.pulseSpeed;
        const currentAlpha =
          node.baseAlpha + Math.sin(node.pulseAngle) * 0.25;

        // Draw Synapse Lines between nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.25 * currentAlpha;
            ctx.strokeStyle = `rgba(139, 148, 255, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw Pulsing Neural Node
        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          node.radius + Math.sin(node.pulseAngle) * 0.8,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(110, 92, 255, ${currentAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#6E5CFF";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-packages-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".gsap-calc-card", {
        scrollTrigger: {
          trigger: ".gsap-calc-card",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".gsap-package-card", {
        scrollTrigger: {
          trigger: ".gsap-packages-grid",
          start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ROI Calculations
  const amountNum = Number(investmentAmount) || 0;

  const dailyRate = useMemo(() => {
    if (selectedPlan && selectedPlan.roi_net) {
      return Number(selectedPlan.roi_net) / 100;
    }
    return 0.012;
  }, [selectedPlan]);

  const weeklyRate = useMemo(() => {
    if (selectedPlan && selectedPlan.roi_weekly) {
      return Number(selectedPlan.roi_weekly) / 100;
    }
    return 0.084;
  }, [selectedPlan]);

  const dailyROI = useMemo(() => amountNum * dailyRate, [amountNum, dailyRate]);
  const weeklyROI = useMemo(() => amountNum * weeklyRate, [amountNum, weeklyRate]);
  const yearlyROI = useMemo(() => dailyROI * 365, [dailyROI]);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setInvestmentAmount(plan.min.toString());
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen pt-36 pb-24 z-10 overflow-hidden"
    >
      {/* Background Pulsing AI Mind Neural Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none -z-20"
      />

      {/* Ambient Radial Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#6E5CFF]/15 blur-[150px] pointer-events-none rounded-full -z-10" />

      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-20 relative z-10">
        
        {/* Header */}
        <div className="gsap-packages-header text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#8B94FF]" />
            <span className="font-mono text-xs sm:text-sm font-medium text-[#D1D5FF] tracking-wider uppercase">
              Neural Yield Protocol
            </span>
          </div>

          <h1 className="font-tech text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E0E5FF] to-[#8B94FF]">
            Automated Investment Packages
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#A6ABC9] max-w-2xl mx-auto leading-relaxed">
            Select an institutional-grade plan configured with continuous automated execution and dynamic profit distribution.
          </p>
        </div>

        {/* Interactive Return Calculator & Selector */}
        <div className="gsap-calc-card rounded-3xl bg-[#0b0e26]/60 border border-[#2d356b]/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Calculator Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#6E5CFF]/10 border border-[#6E5CFF]/30 text-[#8B94FF]">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-tech text-xl font-bold text-white">
                    Yield Calculator
                  </h3>
                  <p className="font-sans text-xs text-[#A6ABC9]">
                    Simulate returns based on custom allocations.
                  </p>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
                  Simulated Allocation ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-white">
                    $
                  </span>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full pl-9 pr-4 py-3.5 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white font-mono text-base focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all"
                  />
                </div>
              </div>

              {/* Package Quick Selector (Auto Updates) */}
              {selectedPlan && (
                <div className="p-4 rounded-2xl bg-[#12163b]/50 border border-[#2d356b]/50 space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs font-mono text-[#D1D5FF]">
                    <span>Auto-Matched Package:</span>
                    <span className="text-[#8B94FF] font-bold flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      {selectedPlan.plan_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#A6ABC9]">
                    <span>Target Range:</span>
                    <span>{selectedPlan.cost}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated ROI Display Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Daily ROI */}
              <div className="p-5 rounded-2xl bg-[#12163b]/60 border border-[#2d356b] text-center space-y-2">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-[#A6ABC9]">
                  Est. Daily ROI
                </span>
                <span className="block font-tech text-2xl font-bold text-white">
                  ${dailyROI.toFixed(2)}
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#6E5CFF]/20 text-[#8B94FF] font-mono text-[10px]">
                  {(dailyRate * 100).toFixed(2)}% / Day
                </span>
              </div>

              {/* Weekly ROI */}
              <div className="p-5 rounded-2xl bg-[#12163b]/60 border border-[#2d356b] text-center space-y-2">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-[#A6ABC9]">
                  Est. Weekly ROI
                </span>
                <span className="block font-tech text-2xl font-bold text-[#8B94FF]">
                  ${weeklyROI.toFixed(2)}
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#6E5CFF]/20 text-[#8B94FF] font-mono text-[10px]">
                  {(weeklyRate * 100).toFixed(2)}% / Week
                </span>
              </div>

              {/* Annual Estimate */}
              <div className="p-5 rounded-2xl bg-[#12163b]/60 border border-[#2d356b] text-center space-y-2">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-[#A6ABC9]">
                  Annual Estimate
                </span>
                <span className="block font-tech text-2xl font-bold text-emerald-400">
                  ${yearlyROI.toFixed(2)}
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                  Projected
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Available Packages Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-tech text-3xl font-bold text-white">
              Available Investment Packages
            </h2>
            <p className="font-sans text-sm text-[#A6ABC9]">
              Select a package manually or type an amount above to auto-match.
            </p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-3xl border border-[#2d356b] bg-[#0b0e26]/40 text-[#A6ABC9]">
              <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#6E5CFF]" />
              Fetching available protocols...
            </div>
          ) : (
            <div className="gsap-packages-grid grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => {
                const isSelected = selectedPlan?.id === plan.id;
                const isFeatured = isSelected || index === 1;

                return (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className={`gsap-package-card group relative rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden border ${
                      isSelected
                        ? "bg-[#0b0e26]/90 border-[#6E5CFF] shadow-[0_0_30px_rgba(110,92,255,0.35)] scale-[1.02]"
                        : "bg-[#0b0e26]/60 border-[#2d356b]/80 hover:border-[#6E5CFF]/60"
                    }`}
                  >
                    {/* Pulsing Radial Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6E5CFF]/20 rounded-full blur-3xl group-hover:bg-[#6E5CFF]/40 transition-colors duration-500 pointer-events-none" />

                    <div>
                      {/* Top Header Tag */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-mono text-[10px] px-3 py-1 rounded-full bg-[#12163b] border border-[#3E468A] text-[#8B94FF] uppercase tracking-wider">
                          {plan.category || "Standard Protocol"}
                        </span>
                        {isFeatured && (
                          <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {isSelected ? "ACTIVE SELECTION" : "FEATURED"}
                          </span>
                        )}
                      </div>

                      {/* Package Title & Range */}
                      <h3 className="font-tech text-2xl font-bold text-white mb-2">
                        {plan.plan_name}
                      </h3>
                      <div className="font-tech text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8B94FF] mb-6">
                        {plan.cost || `$${plan.min.toLocaleString()} - $${plan.max.toLocaleString()}`}
                      </div>

                      {/* Feature Bullet Points */}
                      <div className="space-y-3 pt-4 border-t border-[#2d356b]/50 text-sm font-sans text-[#A6ABC9] mb-8">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#8B94FF] shrink-0" />
                          <span>Daily ROI: <strong className="text-white">{Number(plan.roi_net).toFixed(2)}%</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#8B94FF] shrink-0" />
                          <span>Weekly ROI: <strong className="text-white">{plan.roi_weekly || (Number(plan.roi_net) * 7).toFixed(2)}%</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#8B94FF] shrink-0" />
                          <span>Duration: <strong className="text-white">{plan.time_periods?.includes('Day') ? plan.time_periods : `${plan.time_periods} Days`}</strong></span>
                        </div>
                        {plan.levels && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#8B94FF] shrink-0" />
                            <span>Referral Bonus: <strong className="text-white">{plan.levels} Levels Deep</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Link Button */}
                    <Link
                      href="/login"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#5D72FF] to-[#6E5CFF] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(110,92,255,0.3)] hover:shadow-[0_0_28px_rgba(110,92,255,0.6)] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Get Started</span>
                      <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}