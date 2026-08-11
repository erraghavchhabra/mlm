"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, Scale, Lock, RefreshCw, AlertCircle, Mail } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "August 2026";

  const sections = [
    {
      id: "acceptance",
      icon: <ShieldCheck className="w-5 h-5 text-[#8B94FF]" />,
      title: "1. Acceptance of Terms",
      content:
        "By accessing or utilizing the AURA.AI platform, APIs, dashboard, or high-frequency automated execution systems, you agree to be bound by these Terms of Service. If you do not consent to all terms outlined herein, you are strictly prohibited from accessing our systems.",
    },
    {
      id: "service-scope",
      icon: <FileText className="w-5 h-5 text-[#8B94FF]" />,
      title: "2. Scope of Autonomous Services",
      content:
        "AURA.AI provides institutional-grade algorithmic execution engines, portfolio analytics, and automated risk models. While our models operate with microsecond precision, past execution benchmarks do not guarantee future performance. You retain full control over your active deployment parameters and risk toggles.",
    },
    {
      id: "accounts",
      icon: <Lock className="w-5 h-5 text-[#8B94FF]" />,
      title: "3. Account Security & API Credentials",
      content:
        "Users are sole custodians of their account credentials, multi-factor authentication devices, and exchange API keys. AURA.AI utilizes zero-trust encryption; however, we will never ask for withdrawal permissions on client API keys. You are fully responsible for any activity executing under your API keys.",
    },
    {
      id: "risks",
      icon: <AlertCircle className="w-5 h-5 text-[#8B94FF]" />,
      title: "4. Financial & Market Risks",
      content:
        "Financial market trading involves significant risk of capital loss. AURA.AI provides mathematical decisioning tools and execution automation, not personalized financial advice. System latencies, exchange outages, or sudden market illiquidity may impact trade order execution.",
    },
    {
      id: "ip",
      icon: <Scale className="w-5 h-5 text-[#8B94FF]" />,
      title: "5. Intellectual Property Rights",
      content:
        "All proprietary trading algorithms, neural weights, core software architecture, UI design, and platform branding remain the exclusive property of AURA.AI Inc. Reverse engineering, decompiling, or unauthorized distribution of system APIs is strictly prohibited.",
    },
    {
      id: "modifications",
      icon: <RefreshCw className="w-5 h-5 text-[#8B94FF]" />,
      title: "6. System Updates & Term Revisions",
      content:
        "AURA.AI reserves the right to upgrade infrastructure, modify fee structures, or update these Terms to comply with evolving financial regulations. Material updates will be broadcasted via system alerts or directly to your registered account email address.",
    },
  ];

  return (
    <main className="min-h-screen relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#080a1e] via-[#0d0a28] to-[#060414] text-[#A6ABC9]">
      {/* Background Glows & Subtle Grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4a2e99]/15 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#3e2c8c_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none -z-10" />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-[#8B94FF] hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Main Terminal
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-4 border-b border-[#2d356b]/50 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6E5CFF]/10 border border-[#6E5CFF]/30 text-xs font-mono-tech text-[#8B94FF] uppercase tracking-wider">
            <span>[ LEGAL PROTOCOL v2.4 ]</span>
          </div>
          <h1 className="font-tech text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="font-mono-tech text-xs text-[#6E5CFF] tracking-wider">
            LAST UPDATED: {lastUpdated}
          </p>
        </div>

        {/* Quick Intro Banner */}
        <div className="p-6 rounded-2xl bg-[#0b0e26]/70 border border-[#2d356b]/50 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <p className="font-tech text-sm leading-relaxed text-[#A6ABC9]">
            Please read these Terms of Service carefully before interacting with <strong className="text-white">AURA.AI</strong> systems. By connecting your API keys or deploying automated trading instances, you acknowledge that you have read, understood, and consented to these operational guidelines.
          </p>
        </div>

        {/* Terms Sections Grid */}
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#0b0e26]/50 border border-[#2d356b]/40 backdrop-blur-md transition-all duration-300 hover:border-[#6E5CFF]/40 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#12163b] border border-[#2d356b]/60">
                  {section.icon}
                </div>
                <h2 className="font-tech text-lg sm:text-xl font-semibold text-white tracking-wide">
                  {section.title}
                </h2>
              </div>
              <p className="font-sans text-sm sm:text-base leading-relaxed text-[#A6ABC9] pt-1">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Contact/Support Footer Box */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0d0a28] via-[#12163b] to-[#080a1e] border border-[#3b2b73]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-tech text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#8B94FF]" />
              Legal & Regulatory Queries
            </h3>
            <p className="font-sans text-xs text-[#A6ABC9]">
              Questions regarding these terms or risk disclosures? Contact our compliance department.
            </p>
          </div>
          <a
            href="mailto:legal@aura.ai"
            className="px-6 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider text-white bg-[#6E5CFF]/20 border border-[#6E5CFF]/40 hover:bg-[#6E5CFF]/40 transition-all duration-300 whitespace-nowrap shadow-[0_0_12px_rgba(110,92,255,0.2)]"
          >
            legal@aura.ai
          </a>
        </div>

      </div>
    </main>
  );
}