"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070812]">
      {/* ===========================
          BACKGROUND GLOWS
      ============================ */}

      <div className="absolute left-[-180px] top-[-150px] h-[420px] w-[420px] rounded-full bg-[#6E57FF]/20 blur-[140px]" />

      <div className="absolute right-[-180px] bottom-[-200px] h-[450px] w-[450px] rounded-full bg-[#5D76FF]/20 blur-[160px]" />

      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C67FF]/10 blur-[120px]" />

      {/* Grid */}

      <div className="relative z-10 flex min-h-screen">


        <div className="flex flex-1 items-center justify-center px-6 py-10">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7 }}
            className="relative w-full max-w-xl overflow-hidden rounded-[34px] border border-[#2B3164] bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A] p-8 shadow-2xl"
          >

            {/* Glow */}

            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#6E57FF]/30 blur-[90px]" />

            <div className="relative">

              <div>
                <h2 className="text-4xl font-light text-white">
                  {title}
                </h2>

                <p className="mt-3 text-slate-400">
                  {subtitle}
                </p>
              </div>

              <div className="mt-10">
                {children}
              </div>

            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}