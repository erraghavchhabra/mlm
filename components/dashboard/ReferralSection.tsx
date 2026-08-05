"use client";

import { useState } from "react";
import { Copy, Check, Share2, Link2 } from "lucide-react";

export default function ReferralLinks() {
  const leftLink = "https://yourdomain.com/ref/LEFT12345";
  const rightLink = "https://yourdomain.com/ref/RIGHT12345";

  const [copied, setCopied] = useState("");

  const copyLink = async (link: string, type: string) => {
    await navigator.clipboard.writeText(link);
    setCopied(type);

    setTimeout(() => setCopied(""), 2000);
  };

  const shareLink = async (link: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join My Network",
          text: "Join using my referral link",
          url: link,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(link);
    }
  };

  const Card = ({
    title,
    link,
    type,
  }: {
    title: string;
    link: string;
    type: string;
  }) => (
    <div className="group relative overflow-hidden rounded-[30px] border border-[#2B3164] bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#6F7DFF]/40">

      {/* Glow */}
      <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#6E57FF]/20 blur-3xl transition-all duration-500 group-hover:scale-125" />

      <div className="relative z-10">

        {/* Title */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#1E1E5A]">
            <Link2 className="h-5 w-5 text-white" />
          </div>

          <span className="font-medium text-white">{title}</span>
        </div>

        {/* Link + Buttons */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          <div className="flex-1 rounded-xl border border-[#2B3164] bg-[#101226]/70 px-4 py-3">
            <p className="truncate text-sm text-slate-300">
              {link}
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => copyLink(link, type)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6F7DFF] px-4 text-sm font-medium text-white transition-all hover:bg-[#5C6BFF]"
            >
              {copied === type ? (
                <>
                  <Check size={16} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>

            <button
              onClick={() => shareLink(link)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2B3164] bg-[#1E1E5A]/70 text-white transition-all hover:border-[#6F7DFF] hover:bg-[#26286B]"
            >
              <Share2 size={18} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <Card
        title="Left Referral Link"
        link={leftLink}
        type="left"
      />

      <Card
        title="Right Referral Link"
        link={rightLink}
        type="right"
      />
    </div>
  );
}