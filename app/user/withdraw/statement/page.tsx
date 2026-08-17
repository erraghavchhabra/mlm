"use client";

import { useEffect, useState, Suspense } from "react";
import {
  History,
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
  Search,
  Wallet,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import api from "@/lib/api";

export interface WithdrawHistoryItem {
  id: number | string;
  txnid: string;
  gateway: string;
  wallet_address: string;
  amount: number;
  status: "Pending" | "Approved" | "Completed" | "Rejected" | string;
  status_code: number;
  created_at: string;
  otp_status?: number;
}

const GATEWAY_NAMES: Record<string, string> = {
  USDTRC20: "USDT (TRC-20)",
  USDTBSC: "USDT (BEP-20)",
  USDTSOL: "USDT (Solana)",
};

function StatementPageContent() {
  const [history, setHistory] = useState<WithdrawHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let res: any = null;
      try {
        res = await api.get("/withdraw/history");
      } catch (e) {
        res = await api.get("/wallet/history");
      }

      if (res?.data?.status && Array.isArray(res.data.data)) {
        const items = res.data.data.map((item: any, idx: number) => {
          const rawStatus = Number(item.status);
          let statusText = "Pending";
          if (rawStatus === 1) statusText = "Approved";
          else if (rawStatus === 2) statusText = "Rejected";

          return {
            id: item.id || idx + 1,
            txnid: item.txnid || item.transaction_id || item.trans_id || `#WD${item.id || idx + 1}`,
            gateway: GATEWAY_NAMES[item.gateway] || item.gateway || item.type || "USDT (TRC-20)",
            wallet_address: item.bitcoin_address || item.wallet_address || item.ref_from || "N/A",
            amount: Number(item.amount !== undefined ? item.amount : (item.dr || item.cr || 0)),
            status: statusText,
            status_code: rawStatus,
            otp_status: item.otp_status,
            created_at: item.created_at 
              ? new Date(item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) 
              : new Date().toLocaleDateString(),
          };
        });
        setHistory(items);
      }
    } catch (err) {
      console.error("Failed to fetch withdraw statements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Compute stats
  const totalApproved = history
    .filter((item) => item.status_code === 1)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPending = history
    .filter((item) => item.status_code === 0)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalRejected = history
    .filter((item) => item.status_code === 2)
    .reduce((sum, item) => sum + item.amount, 0);

  // Filter items
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.txnid.toLowerCase().includes(search.toLowerCase()) ||
      item.wallet_address.toLowerCase().includes(search.toLowerCase()) ||
      item.gateway.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Pending" && item.status_code === 0) ||
      (statusFilter === "Approved" && item.status_code === 1) ||
      (statusFilter === "Rejected" && item.status_code === 2);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-full space-y-8 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#8B84FF]/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#5D58F8]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Heading */}
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <History className="text-[#8B84FF]" /> Withdrawal Statements
          </h1>
          <p className="mt-2 text-white/50">
            Monitor and track your withdrawal requests and their processing states.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Transacted */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/60">Total Requests</span>
              <div className="rounded-xl bg-[#8B84FF]/20 p-2.5 text-[#8B84FF]">
                <History size={20} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-white">{history.length}</h3>
              <p className="mt-1 text-xs text-white/40">Initiated transactions</p>
            </div>
          </div>

          {/* Card 2: Total Completed */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/60">Total Approved</span>
              <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-emerald-400">
                ${totalApproved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="mt-1 text-xs text-white/40">Processed & completed</p>
            </div>
          </div>

          {/* Card 3: Total Pending */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/60">Total Pending</span>
              <div className="rounded-xl bg-yellow-500/20 p-2.5 text-yellow-400">
                <Clock3 size={20} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-yellow-400">
                ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="mt-1 text-xs text-white/40">Awaiting admin action</p>
            </div>
          </div>

          {/* Card 4: Total Rejected */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/60">Total Rejected</span>
              <div className="rounded-xl bg-red-500/20 p-2.5 text-red-400">
                <XCircle size={20} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-red-400">
                ${totalRejected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="mt-1 text-xs text-white/40">Cancelled or invalid</p>
            </div>
          </div>
        </div>

        {/* Withdrawal History Section */}
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-4 lg:p-6 shadow-[0_35px_80px_rgba(0,0,0,.45)] backdrop-blur-3xl space-y-6">
          
          {/* Controls: Search & Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {(["All", "Pending", "Approved", "Rejected"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    statusFilter === filter
                      ? "bg-gradient-to-r from-[#8B84FF] to-[#5D58F8] text-white shadow-md shadow-indigo-500/20"
                      : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Search statements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-[#141632] pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-all focus:border-[#8B84FF]"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-slate-400">
              <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#8B84FF]" />
              Loading history...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center text-sm text-slate-400">
              No matching withdrawal records found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
              <table className="min-w-full whitespace-nowrap text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-widest text-white/50">
                    <th className="px-6 py-4">Request ID</th>
                    <th className="px-6 py-4">Gateway</th>
                    <th className="px-6 py-4">Wallet Address</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-white/5 hover:bg-white/[0.05]">
                      <td className="px-6 py-4 font-mono text-white flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8B84FF]" />
                        {item.txnid}
                      </td>
                      <td className="px-6 py-4 text-white/80">{item.gateway}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-300 select-all">{item.wallet_address}</td>
                      <td className="px-6 py-4 font-semibold text-white">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {item.status_code === 1 && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            <CheckCircle2 size={14} /> Approved
                          </span>
                        )}
                        {item.status_code === 0 && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                            <Clock3 size={14} /> Pending
                          </span>
                        )}
                        {item.status_code === 2 && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            <XCircle size={14} /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white/60">{item.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StatementPage() {
  return (
    <Suspense fallback={
      <div className="flex h-60 items-center justify-center text-slate-400">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#8B84FF]" />
        Loading statements...
      </div>
    }>
      <StatementPageContent />
    </Suspense>
  );
}
