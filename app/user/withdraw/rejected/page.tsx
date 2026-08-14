"use client";

import { useEffect, useState, Suspense } from "react";
import {
  History,
  XCircle,
  Loader2,
  Wallet,
} from "lucide-react";
import api from "@/lib/api";

export interface WithdrawHistoryItem {
  id: number | string;
  txnid: string;
  gateway: string;
  wallet_address: string;
  amount: string | number;
  status: "Pending" | "Approved" | "Completed" | "Rejected" | string;
  created_at: string;
  otp_status?: number;
}

const GATEWAY_NAMES: Record<string, string> = {
  USDTRC20: "USDT (TRC-20)",
  USDTBSC: "USDT (BEP-20)",
  USDTSOL: "USDT (Solana)",
};

function RejectedWithdrawPageContent() {
  const [history, setHistory] = useState<WithdrawHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Filter: status 2
        const rawItems = res.data.data.filter(
          (item: any) => Number(item.status) === 2
        );

        const items = rawItems.map((item: any, idx: number) => ({
          id: item.id || idx + 1,
          txnid: item.txnid || item.transaction_id || item.trans_id || `#WD${item.id || idx + 1}`,
          gateway: GATEWAY_NAMES[item.gateway] || item.gateway || item.type || "USDT (TRC-20)",
          wallet_address: item.bitcoin_address || item.wallet_address || item.ref_from || "N/A",
          amount: item.amount !== undefined ? item.amount : (item.dr || item.cr || 0),
          status: item.status === 1 || item.status === "Approved" || item.status === "Completed" ? "Approved" : item.status === 0 || item.status === "Pending" ? "Pending" : "Rejected",
          otp_status: item.otp_status,
          created_at: item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : new Date().toLocaleDateString(),
        }));
        setHistory(items);
      }
    } catch (err) {
      console.error("Failed to fetch rejected withdraw history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="relative min-h-full space-y-8 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#8B84FF]/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#5D58F8]/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
            <XCircle className="text-red-400" /> Rejected Withdrawals
          </h1>
          <p className="mt-2 text-white/50">
            View withdrawal requests that have been rejected or cancelled.
          </p>
        </div>

        {/* Withdrawal History Section */}
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-4 lg:p-6 shadow-[0_35px_80px_rgba(0,0,0,.45)] backdrop-blur-3xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-[#8B84FF]" />
              <h2 className="text-xl font-medium text-white">Rejected Requests</h2>
            </div>
            <span className="text-xs text-white/50">{history.length} Requests</span>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-slate-400">
              <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#8B84FF]" />
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
              No rejected withdrawal requests found.
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
                  {history.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-white/5 hover:bg-white/[0.05]">
                      <td className="px-6 py-4 font-mono text-white">{item.txnid}</td>
                      <td className="px-6 py-4 text-white/80">{item.gateway}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-300">{item.wallet_address}</td>
                      <td className="px-6 py-4 font-semibold text-white">
                        ${typeof item.amount === "number" ? item.amount.toFixed(2) : item.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                          <XCircle size={14} /> Rejected
                        </span>
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

export default function RejectedWithdrawPage() {
  return (
    <Suspense fallback={
      <div className="flex h-60 items-center justify-center text-slate-400">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#8B84FF]" />
        Loading...
      </div>
    }>
      <RejectedWithdrawPageContent />
    </Suspense>
  );
}
