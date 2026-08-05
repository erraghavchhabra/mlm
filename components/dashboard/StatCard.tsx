import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  positive = true,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[34px] border border-[#2B3164] bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A] p-4 min-h-[160px] transition-all duration-300 hover:-translate-y-1">

      {/* Top Right Glow */}
      <div className="absolute -top-8 -right-8 h-28 w-28 blob bg-lime-50 blur-xl opacity-80 group-hover:scale-110 transition-transform" />

      {/* Bottom Glow */}
      <div className="absolute left-1/2 bottom-[-120px] h-64 w-64 -translate-x-1/2 rounded-full bg-[#6E57FF]/15 blur-[120px]" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[4px] text-slate-400">
              {title}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center bg-[#1e1e5a] justify-center rounded-full border border-white/5  backdrop-blur-xl">
            <Icon className="h-4 w-4 text-[#FFFFFF]" />
          </div>
        </div>

        <h3
          className="
            mt-4
            text-3xl
            sm:text-4xl
            font-light
            text-white
            tracking-tight
          "
        >
          {value}
        </h3>

        {change && (
          <div
            className={`mt-4 text-sm font-medium ${
              positive ? "text-[#6F7DFF]" : "text-red-400"
            }`}
          >
            {change}
          </div>
        )}
      </div>
    </div>
  );
}