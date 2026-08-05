import { Trophy } from 'lucide-react'

export default function RankCard() {
  return (
    <div className="w-full relative overflow-hidden rounded-[36px] border border-[#2B3164]/80 bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A] p-6 min-h-[300px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(114,132,255,.16),transparent_35%)]" />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <p className="text-[13px] uppercase tracking-[5px] text-[#8892C6]">
            CURRENT RANK
          </p>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2A2D63]/70 border border-white/5">
            <Trophy className="h-5 w-5 text-[#EEF1FF]" />
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-[36px] font-extralight leading-none tracking-[-0.05em] text-white">
            Unranked
          </h2>

          <p className="mt-3 text-[#A6ABC9] text-lg">
            Refer <span className="font-semibold text-white">5 more</span> to reach
            <span className="text-[#7C84FF] font-semibold"> Bronze</span>
          </p>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-[#A6ABC9]">Progress</span>
            <span className="text-white font-semibold">20 / 25</span>
          </div>

          <div className="h-3 rounded-full bg-[#242754] overflow-hidden">
            <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-[#6F79FF] to-[#8B94FF]" />
          </div>
        </div>

        <div className="mt-auto pt-8 grid grid-cols-3 gap-3">
          <button className="h-8 rounded-full bg-gradient-to-r from-[#5D72FF] to-[#7B84FF] text-white text-sm font-semibold shadow-[0_10px_30px_rgba(93,114,255,.35)]">
            Bronze
          </button>

          <button className="h-8 rounded-full bg-[#242754] text-[#9EA5D0] text-sm font-semibold border border-white/5">
            Silver
          </button>

          <button className="h-8 rounded-full bg-[#242754] text-[#9EA5D0] text-sm font-semibold border border-white/5">
            Gold
          </button>
        </div>
      </div>
    </div>
  )
}