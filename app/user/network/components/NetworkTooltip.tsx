"use client";

import { createPortal } from "react-dom";
import { Crown, CircleDollarSign, ShieldCheck } from "lucide-react";
import { TreeNode } from "../types";
import { getAvatarGradient, getInitials } from "../utils";

interface Props {
  node: TreeNode;
  position: { top: number; left: number };
}

const colorLabel: Record<string, { text: string; cls: string }> = {
  green:  { text: "Active & Paid",   cls: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
  yellow: { text: "Approved",        cls: "text-yellow-400  bg-yellow-500/15  border-yellow-500/30"  },
  red:    { text: "Inactive / Unpaid",cls: "text-red-400    bg-red-500/15     border-red-500/30"     },
};

export default function NetworkTooltip({ node, position }: Props) {
  if (typeof window === "undefined") return null;

  const statusInfo = colorLabel[node.card_color] ?? colorLabel.red;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -115%)",
        zIndex: 999999,
      }}
      className="
        w-72 rounded-[26px]
        border border-[#2B3164]
        bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A]
        p-5 shadow-[0_25px_60px_rgba(0,0,0,.5)]
        pointer-events-none
      "
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`
          flex h-11 w-11 items-center justify-center
          rounded-full bg-gradient-to-br
          ${getAvatarGradient(node.id)}
        `}>
          <span className="text-white font-semibold text-sm">
            {getInitials(node.full_name)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{node.full_name}</h3>
          <p className="text-slate-400 text-xs">#{node.ucode}</p>
        </div>

        {/* Status badge */}
        <span className={`
          text-[10px] font-semibold px-2 py-1
          rounded-full border ${statusInfo.cls}
        `}>
          {node.card_color === "green" ? "●" : node.card_color === "yellow" ? "◑" : "○"}
        </span>
      </div>

      <div className="my-4 h-px bg-white/10" />

      {/* Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 flex items-center gap-2">
            <ShieldCheck size={14} />
            Status
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusInfo.cls}`}>
            {statusInfo.text}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400 flex items-center gap-2">
            <CircleDollarSign size={14} />
            Left BV
          </span>
          <span className="text-white font-medium">
            {node.left_business.toLocaleString("en-GB")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400 flex items-center gap-2">
            <CircleDollarSign size={14} />
            Right BV
          </span>
          <span className="text-white font-medium">
            {node.right_business.toLocaleString("en-GB")}
          </span>
        </div>

        {node.rcode && (
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Crown size={14} />
              Referrer
            </span>
            <span className="text-white">{node.rcode}</span>
          </div>
        )}
      </div>

      {/* Tip: click to navigate */}
      <p className="mt-4 text-center text-[10px] text-slate-600">
        Click node to view their network
      </p>
    </div>,
    document.body
  );
}