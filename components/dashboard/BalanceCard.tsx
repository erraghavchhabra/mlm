"use client";

import { ArrowUpRight, Wallet } from 'lucide-react';
import { useWallet } from '@/lib/useWallet';

interface BalanceCardProps {
  balance?: number;
}

export default function BalanceCard({ balance: propBalance }: BalanceCardProps) {
  const { balance: walletBalance } = useWallet();
  const balance = propBalance !== undefined ? propBalance : walletBalance;

  return (
    <div className="w-full relative overflow-hidden rounded-[36px] border border-[#2B3164]/80 bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A] p-6 min-h-[300px]">
      {/* Glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_15%,rgba(114,132,255,.18),transparent_35%)]" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#4742ca]/90 blur-[110px]" />
      <div className="absolute bottom-[-140px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#6e57ff]/10 blur-[130px]" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <p className="text-[13px] uppercase tracking-[5px] text-[#8892C6]">
            MARKETING WALLET
          </p>

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2A2D63]/70 backdrop-blur-2xl border border-white/5">
            <Wallet className="h-6 w-6 text-[#EEF1FF]" />
          </div>
        </div>

        <div className="mt-2">
          <h1 className="text-[34px] xl:text-[56px] font-extralight leading-none tracking-[-0.06em] text-white">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>

           <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#8B94FF] px-3 py-1 text-xs font-semibold text-[#14162C]">
              <ArrowUpRight size={14} />
              +12.4%
            </span>

            <span className="text-sm text-[#98A2C9]">
              Compared to last week
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-auto pt-4">
          <svg viewBox="0 0 900 160" className="w-full h-[120px]" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8B94FF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#8B94FF" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d="M0 120 C70 108 130 132 200 110 C280 86 330 84 410 88 C500 94 560 70 650 82 C740 96 800 64 900 42 L900 160 L0 160 Z"
              fill="url(#areaFill)"
            />

            <path
              d="M0 120 C70 108 130 132 200 110 C280 86 330 84 410 88 C500 94 560 70 650 82 C740 96 800 64 900 42"
              stroke="#8B94FF"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}