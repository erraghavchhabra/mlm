"use client";

import { UserRoundPlus } from "lucide-react";

interface Props {
  label?: "L" | "R";
  small?: boolean;
}

export default function EmptyNode({ label, small }: Props) {
  const size = small ? "h-16 w-16" : "h-20 w-20";
  const iconSize = small ? 16 : 20;

  return (
    <div className="flex flex-col items-center">
      {label && (
        <span className={`
          mb-1 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full
          ${label === "L"
            ? "bg-blue-500/10 text-blue-500/50 border border-blue-500/20"
            : "bg-purple-500/10 text-purple-500/50 border border-purple-500/20"}
        `}>
          {label === "L" ? "LEFT" : "RIGHT"}
        </span>
      )}

      <div className={`
        relative flex items-center justify-center rounded-full
        border-2 border-dashed border-[#2B3164]/60
        bg-[#171935]/50 ${size}
        transition-all duration-300
      `}>
        <UserRoundPlus size={iconSize} className="text-[#2B3164]" />
      </div>

      <p className={`mt-2 text-center text-slate-600 ${small ? "text-[10px]" : "text-xs"}`}>
        Empty
      </p>
      <p className="mt-0.5 text-[10px] text-[#2B3164]">
        —
      </p>
    </div>
  );
}
