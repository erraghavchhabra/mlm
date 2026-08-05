import { ArrowUpRight, TrendingUp } from "lucide-react";

export default function RoiCard() {
  return (
    <div className="relative w-full min-h-[300px] overflow-hidden rounded-[36px] border border-[#2B3164]/80 bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A] p-6">
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(114,132,255,.18),transparent_35%)]" />
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#4742ca]/90 blur-[110px]" />
      <div className="absolute bottom-[-140px] right-1/2 h-72 w-72 translate-x-1/2 rounded-full bg-[#6e57ff]/10 blur-[130px]" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] uppercase tracking-[5px] text-[#8892C6]">
            ROI
          </p>

          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-[#2A2D63]/70 backdrop-blur-2xl">
            <TrendingUp className="h-6 w-6 text-[#EEF1FF]" />
          </div>
        </div>

        {/* Value */}
        <div className="mt-2">
          <h1 className="text-[34px] font-extralight leading-none tracking-[-0.06em] text-white xl:text-[56px]">
            248%
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#8B94FF] px-3 py-1 text-xs font-semibold text-[#14162C]">
              <ArrowUpRight size={14} />
              +18.6%
            </span>

            <span className="text-sm text-[#98A2C9]">
              Compared to last month
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-auto pt-8">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-[#98A2C9]">Growth Progress</span>
            <span className="font-medium text-white">248%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-[#262A57]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6E57FF] via-[#8B94FF] to-[#B8BEFF]"
              style={{ width: "82%" }}
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8892C6]">
                Invested
              </p>
              <h4 className="mt-1 text-lg font-light text-white">$12.5K</h4>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#8892C6]">
                Profit
              </p>
              <h4 className="mt-1 text-lg font-light text-white">$31K</h4>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#8892C6]">
                ROI
              </p>
              <h4 className="mt-1 text-lg font-light text-[#8B94FF]">
                +248%
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}