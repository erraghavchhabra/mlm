"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2, RefreshCw, Users, Network } from "lucide-react";
import api from "@/lib/api";
import NetworkTree from "./components/NetworkTree";
import { NetworkTreeData, TreeNode } from "./types";

export default function NetworkPage() {
  const [treeData, setTreeData] = useState<NetworkTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation history: stack of { id, name }
  const [history, setHistory] = useState<{ id: number | null; name: string }[]>([
    { id: null, name: "My Network" },
  ]);

  const current = history[history.length - 1];

  const fetchTree = useCallback(async (id: number | null) => {
    setLoading(true);
    setError(null);
    try {
      const url = id ? `/network/tree/${id}` : "/network/tree";
      const res = await api.get(url);
      if (res.data?.status) {
        setTreeData(res.data.data as NetworkTreeData);
      } else {
        setError(res.data?.message || "Failed to load network.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Network request failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree(current.id);
  }, [current.id, fetchTree]);

  // Drill down into a member's tree
  const handleNodeClick = (node: TreeNode) => {
    // Don't navigate if already on this node (it's the root)
    if (treeData?.root?.id === node.id) return;
    setHistory((prev) => [...prev, { id: node.id, name: node.full_name }]);
  };

  // Go back in history
  const handleBack = () => {
    if (history.length <= 1) return;
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white flex items-center gap-3">
            <Network size={32} className="text-[#6F7DFF]" />
            Network
          </h1>
          <p className="mt-2 text-slate-400">
            View your referral network and team hierarchy.
          </p>
        </div>

        <button
          onClick={() => fetchTree(current.id)}
          className="
            flex items-center gap-2 rounded-full
            border border-[#2B3164] bg-[#171935]
            px-5 py-2.5 text-sm text-slate-400
            hover:text-white hover:border-[#6F7DFF]
            transition-all duration-200
          "
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Breadcrumb / Back navigation */}
      {history.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {history.map((h, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-600">/</span>}
              <button
                onClick={() => {
                  if (i < history.length - 1) {
                    setHistory((prev) => prev.slice(0, i + 1));
                  }
                }}
                className={`text-sm transition-colors ${
                  i === history.length - 1
                    ? "text-white font-medium"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {h.name}
              </button>
            </span>
          ))}
        </motion.div>
      )}

      {/* Tree Container */}
      <div className="
        relative rounded-[34px]
        border border-[#2B3164]
        bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A]
        p-8 min-h-[420px]
      ">

        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden rounded-[34px] pointer-events-none">
          <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#6F7DFF]/10 blur-[120px]" />
          <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-[#4ADE80]/5 blur-[120px]" />
        </div>

        {/* Back button */}
        {history.length > 1 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="
              relative z-10 mb-6 flex items-center gap-2
              rounded-full border border-[#2B3164]
              bg-[#171935] px-4 py-2
              text-sm text-slate-400
              hover:text-white hover:border-[#6F7DFF]
              transition-all duration-200
            "
          >
            <ChevronLeft size={14} />
            Back to {history[history.length - 2].name}
          </motion.button>
        )}

        {/* Content area */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-24"
              >
                <Loader2 size={36} className="animate-spin text-[#6F7DFF]" />
                <p className="text-slate-400">Loading network tree…</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-24"
              >
                <Users size={40} className="text-red-500/60" />
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  onClick={() => fetchTree(current.id)}
                  className="
                    mt-2 rounded-full border border-red-500/30
                    bg-red-500/10 px-5 py-2
                    text-sm text-red-400
                    hover:bg-red-500/20 transition-all
                  "
                >
                  Try Again
                </button>
              </motion.div>
            ) : treeData ? (
              <motion.div
                key={`tree-${current.id ?? "root"}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <NetworkTree
                  data={treeData}
                  onNodeClick={handleNodeClick}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}