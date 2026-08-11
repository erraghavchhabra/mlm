"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Eye,
  Database,
  Lock,
  Share2,
  UserCheck,
  Mail,
  Cpu,
} from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "August 2026";

  const sections = [
    {
      id: "data-collection",
      icon: <Database className="w-5 h-5 text-[#8B94FF]" />,
      title: "1. Information We Collect",
      content:
        "We collect minimal account identifiers (such as email addresses) alongside telemetry data needed for platform operation. Exchange API keys provided for automated trading are processed in encrypted transit and never stored in plain text.",
    },
    {
      id: "data-usage",
      icon: <Eye className="w-5 h-5 text-[#8B94FF]" />,
      title: "2. How We Use Your Data",
      content:
        "Collected information is strictly utilized to execute trade commands, verify multi-factor security sessions, optimize risk parameters, and deliver system alerts. AURA.AI does not monetize user telemetry or trade logs.",
    },
    {
      id: "encryption",
      icon: <Lock className="w-5 h-5 text-[#8B94FF]" />,
      title: "3. Zero-Trust Security & Storage",
      content:
        "Your API keys and credentials are encrypted using AES-256 at rest and TLS 1.3 in transit. Strategic secrets are stored inside isolated hardware security modules (HSM). Our internal architecture adheres to strict zero-trust operational protocols.",
    },
    {
      id: "sharing",
      icon: <Share2 className="w-5 h-5 text-[#8B94FF]" />,
      title: "4. Third-Party Sharing & Disclosure",
      content:
        "We never sell, rent, or trade personal data to third parties or advertising brokers. Data is only communicated with integrated cryptocurrency/financial exchanges directly chosen by you to complete requested trade actions.",
    },
    {
      id: "user-rights",
      icon: <UserCheck className="w-5 h-5 text-[#8B94FF]" />,
      title: "5. Your Rights & Key Erasure",
      content:
        "You retain complete ownership over your data. At any point, you can revoke API access, terminate active automation sessions, or request total account and telemetry purge directly from your dashboard or via support.",
    },
    {
      id: "cookies",
      icon: <Shield className="w-5 h-5 text-[#8B94FF]" />,
      title: "6. Cookies & Session Security",
      content:
        "We use essential session tokens and strict HTTP-only cookies to verify authenticated dashboard visits. No persistent tracking cookies or cross-site behavioral telemetry scripts are deployed on our infrastructure.",
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
            <span>[ DATA PROTECTION PROTOCOL v2.4 ]</span>
          </div>
          <h1 className="font-tech text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="font-mono-tech text-xs text-[#6E5CFF] tracking-wider">
            LAST UPDATED: {lastUpdated}
          </p>
        </div>

        {/* Overview Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0e26]/70 border border-[#2d356b]/50 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 rounded-xl bg-[#12163b] border border-[#2d356b]/60 shrink-0">
            <Cpu className="w-8 h-8 text-[#8B94FF]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-tech text-lg font-semibold text-white">
              Institutional Security Standard
            </h3>
            <p className="font-tech text-sm leading-relaxed text-[#A6ABC9]">
              At <strong className="text-white">AURA.AI</strong>, privacy is engineered directly into our core algorithmic pipeline. We prioritize zero-trust credential handling so you maintain total control over your funds and exchange permissions at all times.
            </p>
          </div>
        </div>

        {/* Sections Grid */}
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

        {/* Contact/Privacy Officer Box */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0d0a28] via-[#12163b] to-[#080a1e] border border-[#3b2b73]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-tech text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#8B94FF]" />
              Data Protection & Privacy Contact
            </h3>
            <p className="font-sans text-xs text-[#A6ABC9]">
              To request key deletion, data export, or inquire about processing protocols:
            </p>
          </div>
          <a
            href="mailto:privacy@aura.ai"
            className="px-6 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider text-white bg-[#6E5CFF]/20 border border-[#6E5CFF]/40 hover:bg-[#6E5CFF]/40 transition-all duration-300 whitespace-nowrap shadow-[0_0_12px_rgba(110,92,255,0.2)]"
          >
            privacy@aura.ai
          </a>
        </div>

      </div>
    </main>
  );
}