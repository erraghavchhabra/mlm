"use client";

import { Zap } from "lucide-react";

export default function LiveTickerMarquee() {
  const tickerItems = [
    { label: "BTC/USDT SPREAD CAPTURED", value: "+0.42%" },
    { label: "NEW RANK UNLOCKED", value: "SAPPHIRE EXECUTIVE" },
    { label: "AUTO PAYOUT SETTLED", value: "00:04:12 AGO" },
    { label: "CROSS-EXCHANGE ROUTE", value: "KRAKEN → OKX" },
    { label: "NEURAL ENGINE VOLUME", value: "$1.24M / 24H" },
    { label: "AFFILIATE COMMISSION SYNCED", value: "INSTANT" },
  ];

  return (
    <>
      {/* Inline Keyframes style tag so no external CSS files are needed */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-loop {
          display: flex;
          width: max-content;
          animation: marqueeScroll 110s linear infinite;
        }
        .animate-marquee-loop:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full bg-[#07091b] border-y border-[#2d356b]/40 py-3 overflow-hidden relative z-20 backdrop-blur-md">
        {/* Left & Right Edge Gradient Fades */}
        <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#07091b] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#07091b] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track Container */}
        <div className="animate-marquee-loop">
          {/* Duplicate loop x4 to guarantee smooth infinite scroll on wide screens */}
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map(
            (item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 sm:px-8 whitespace-nowrap shrink-0"
              >
                {/* Glowing Purple Lightning Icon */}
                <Zap className="w-3.5 h-3.5 text-[#8B94FF] fill-[#8B94FF]/20 shrink-0 animate-pulse" />

                <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-widest text-[#A6ABC9] uppercase font-medium">
                  <span>{item.label}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
}
