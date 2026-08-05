import { ArrowUpRight, Check, Layers } from "lucide-react";

interface PackageCardProps {
  name: string;
  range: string;
  dailyROI: string;
  weeklyROI: string;
  duration: string;
  levels?: number;
  category?: string;
  featured?: boolean;
  onSelect?: () => void;
}

export default function PackageCard({
  name,
  range,
  dailyROI,
  weeklyROI,
  duration,
  levels,
  category,
  featured = false,
  onSelect,
}: PackageCardProps) {
  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-[34px] border transition-all duration-300 hover:-translate-y-2 ${
        featured ? "border-[#6F7DFF]/50 shadow-[0_20px_50px_rgba(111,125,255,0.15)]" : "border-[#2B3164]"
      } bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A]`}
    >
      {/* Glow */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#6F7DFF]/10 blur-3xl transition-all duration-500 group-hover:scale-125" />

      <div className="relative z-10 flex h-full flex-col p-7">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full border border-[#6F7DFF]/20 bg-[#6F7DFF]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[3px] text-[#8D98FF]">
                {name}
              </span>
              {category && (
                <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400">
                  {category}
                </span>
              )}
            </div>

            <h3 className="mt-5 text-3xl font-light text-white">
              {range}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Investment Range
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-[#1E1F49]">
            <ArrowUpRight className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-[#6F7DFF]" />
              <span className="text-slate-400">Daily ROI</span>
            </div>
            <span className="font-medium text-white">{dailyROI}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-[#6F7DFF]" />
              <span className="text-slate-400">Weekly ROI</span>
            </div>
            <span className="font-medium text-white">{weeklyROI}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-[#6F7DFF]" />
              <span className="text-slate-400">Duration</span>
            </div>
            <span className="font-medium text-white">{duration}</span>
          </div>

          {levels !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-[#6F7DFF]" />
                <span className="text-slate-400">Levels</span>
              </div>
              <span className="font-medium text-white">{levels} Levels</span>
            </div>
          )}
        </div>

        {/* Button */}
        <div className="mt-auto pt-8">
          <button
            onClick={onSelect}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#6F7DFF] to-[#8F78FF] font-medium text-white transition-all duration-300 hover:shadow-[0_15px_40px_rgba(111,125,255,.35)]"
          >
            Select Package
          </button>
        </div>
      </div>
    </div>
  );
}