"use client";

import { useRef, useState } from "react";
import { TreeNode } from "../types";
import { getAvatarGradient, getInitials } from "../utils";
import NetworkTooltip from "./NetworkTooltip";

interface Props {
  node: TreeNode;
  onNodeClick: (node: TreeNode) => void;
  isRoot?: boolean;
  label?: "L" | "R";
  small?: boolean;
}

const cardBorder: Record<string, string> = {
  green:  "border-emerald-500/60 hover:border-emerald-400 hover:shadow-[0_15px_40px_rgba(52,211,153,.35)]",
  yellow: "border-yellow-500/60 hover:border-yellow-400 hover:shadow-[0_15px_40px_rgba(234,179,8,.30)]",
  red:    "border-red-500/60    hover:border-red-400    hover:shadow-[0_15px_40px_rgba(239,68,68,.30)]",
};

const statusDot: Record<string, string> = {
  green:  "bg-emerald-400",
  yellow: "bg-yellow-400",
  red:    "bg-red-500",
};

export default function NetworkNode({ node, onNodeClick, isRoot, label, small }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);

  const size = isRoot ? "h-24 w-24" : small ? "h-16 w-16" : "h-20 w-20";
  const avatarSize = isRoot ? "h-16 w-16" : small ? "h-10 w-10" : "h-13 w-13";
  const textSize = isRoot ? "text-lg" : small ? "text-xs" : "text-sm";
  const nameSize = isRoot ? "text-sm" : small ? "text-[10px]" : "text-xs";

  const showTooltip = () => {
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) setTooltipPos({ top: rect.top, left: rect.left + rect.width / 2 });
  };

  const hideTooltip = () => setTooltipPos(null);

  const border = cardBorder[node.card_color] ?? cardBorder.red;
  const dot = statusDot[node.card_color] ?? statusDot.red;

  return (
    <div
      ref={nodeRef}
      className="group relative flex flex-col items-center"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {tooltipPos && (
        <NetworkTooltip node={node} position={tooltipPos} />
      )}

      {/* Label badge */}
      {label && (
        <span className={`
          mb-1 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full
          ${label === "L"
            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
            : "bg-purple-500/20 text-purple-300 border border-purple-500/30"}
        `}>
          {label === "L" ? "LEFT" : "RIGHT"}
        </span>
      )}

      {/* Avatar button */}
      <button
        type="button"
        onClick={() => onNodeClick(node)}
        title={`View ${node.full_name}'s network`}
        className={`
          relative flex items-center justify-center rounded-full
          border-4 bg-[#171935] transition-all duration-300
          hover:scale-110 cursor-pointer
          ${size} ${border}
        `}
      >
        {/* Glow */}
        <div className="
          absolute inset-0 rounded-full
          bg-[#6F7DFF]/10 blur-xl opacity-0
          transition group-hover:opacity-100
        " />

        {/* Avatar initials */}
        <div className={`
          relative flex items-center justify-center
          rounded-full bg-gradient-to-br
          ${getAvatarGradient(node.id)}
          ${avatarSize}
        `}>
          <span className={`font-semibold text-white ${textSize}`}>
            {getInitials(node.full_name)}
          </span>
        </div>

        {/* Status dot */}
        <span className={`
          absolute bottom-1 right-2 h-3.5 w-3.5
          rounded-full border-2 border-[#171734]
          ${dot}
        `} />
      </button>

      {/* Name */}
      <p className={`mt-2 text-center font-medium text-white leading-tight ${nameSize} max-w-[90px]`}>
        {node.full_name}
      </p>

      {/* Ucode */}
      <p className="mt-0.5 text-[10px] text-slate-500">
        {node.ucode}
      </p>
    </div>
  );
}