"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  History,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Gift,
  Coins,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import api from "@/lib/api";

interface Transaction {
  id: number;
  trans_id: string;
  description: string;
  amount: string | number;
  type: string;
  read: number;
  created_at: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const TRANSACTION_TYPES = [
  { label: "All Types", value: "" },
  { label: "Withdrawals", value: "Withdrawal" },
  { label: "Deposits", value: "Deposit" },
  { label: "ROI Bonus", value: "Roi Bouns" },
  { label: "Binary Bonus", value: "Binary Bouns" },
  { label: "Referral Bonus", value: "Referral Bouns" },
];

function getTransactionIcon(type: string) {
  switch (type) {
    case "Withdrawal":
      return <ArrowUpRight className="h-4 w-4 text-red-400" />;
    case "Deposit":
      return <ArrowDownLeft className="h-4 w-4 text-emerald-400" />;
    case "Roi Bouns":
      return <TrendingUp className="h-4 w-4 text-indigo-400" />;
    case "Referral Bouns":
    case "Binary Bouns":
      return <Gift className="h-4 w-4 text-[#8B84FF]" />;
    default:
      return <Coins className="h-4 w-4 text-slate-400" />;
  }
}

function getTransactionBadge(type: string) {
  switch (type) {
    case "Withdrawal":
      return "border-red-500/20 bg-red-500/10 text-red-400";
    case "Deposit":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    case "Roi Bouns":
      return "border-indigo-500/20 bg-indigo-500/10 text-indigo-400";
    case "Referral Bouns":
    case "Binary Bouns":
      return "border-purple-500/20 bg-purple-500/10 text-purple-400";
    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-300";
  }
}

function TransactionsPageContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (page: number, type: string) => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page };
      if (type) {
        params.type = type;
      }
      
      const res = await api.get("/transactions", { params });
      
      if (res?.data?.status && res.data.data) {
        const paginator = res.data.data;
        setTransactions(paginator.data || []);
        setPagination({
          current_page: paginator.current_page || 1,
          last_page: paginator.last_page || 1,
          per_page: paginator.per_page || 20,
          total: paginator.total || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage, filterType);
  }, [currentPage, filterType]);

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.last_page) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="relative min-h-full space-y-8 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#8B84FF]/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#5D58F8]/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
              <History className="text-[#8B84FF]" /> Transaction Ledger
            </h1>
            <p className="mt-2 text-white/50">
              View, filter, and audit all transaction logs associated with your user node account.
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B84FF]" />
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-[#141632] pl-11 pr-10 text-sm text-white outline-none focus:border-[#8B84FF] transition-all"
            >
              {TRANSACTION_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#141632]">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-4 lg:p-6 shadow-[0_35px_80px_rgba(0,0,0,.45)] backdrop-blur-3xl">
          {loading ? (
            <div className="flex h-60 items-center justify-center rounded-3xl text-slate-400">
              <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#8B84FF]" />
              Loading transactions ledger...
            </div>
          ) : transactions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center text-sm text-slate-400">
              No transaction logs found for the selected criteria.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
                <table className="min-w-full whitespace-nowrap text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-widest text-white/50">
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-white/5 hover:bg-white/[0.05]">
                        <td className="px-6 py-4 font-mono text-white text-xs">{txn.trans_id}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getTransactionBadge(txn.type)}`}>
                            {getTransactionIcon(txn.type)}
                            {txn.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/80">{txn.description}</td>
                        <td className={`px-6 py-4 font-semibold ${txn.type === "Withdrawal" ? "text-red-400" : "text-emerald-400"}`}>
                          {txn.type === "Withdrawal" ? "-" : "+"}${Number(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-white/60 text-xs">
                          {new Date(txn.created_at).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-4 text-sm text-slate-400">
                  <span>
                    Showing page {pagination.current_page} of {pagination.last_page} ({pagination.total} total transactions)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={pagination.current_page === 1}
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      // Logic to center the pages list around the current page
                      let pageNumber = i + 1;
                      if (pagination.current_page > 3) {
                        pageNumber = pagination.current_page - 3 + i;
                      }
                      if (pageNumber + (4 - i) > pagination.last_page) {
                        pageNumber = pagination.last_page - 4 + i;
                      }
                      if (pageNumber < 1) pageNumber = i + 1;

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`h-9 min-w-9 px-2 rounded-xl border text-xs font-semibold transition-all ${
                            pagination.current_page === pageNumber
                              ? "bg-gradient-to-r from-[#8B84FF] to-[#5D58F8] border-none text-white shadow-md"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-60 items-center justify-center text-slate-400">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#8B84FF]" />
        Loading ledger...
      </div>
    }>
      <TransactionsPageContent />
    </Suspense>
  );
}
