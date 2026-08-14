"use client";

import { useEffect, useState } from "react";
import {
  Landmark,
  Wallet,
  Coins,
  SendHorizontal,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  History,
  Clock3,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useWallet, updateLocalWalletBalance } from "@/lib/useWallet";

export interface WithdrawHistoryItem {
  id: number | string;
  txnid: string;
  gateway: string;
  wallet_address: string;
  amount: string | number;
  status: "Pending" | "Approved" | "Completed" | "Rejected" | string;
  created_at: string;
}

interface ProfileWallets {
  wallet_address?: string;
  wallet_address_bep?: string;
  wallet_address_trc?: string;
}

const GATEWAY_NAMES: Record<string, string> = {
  USDTRC20: "USDT (TRC-20)",
  USDTBSC: "USDT (BEP-20)",
  USDTSOL: "USDT (Solana)",
};

const getWalletForGateway = (gw: string, prof: ProfileWallets) => {
  if (gw === "USDTRC20") return prof.wallet_address_trc || "";
  if (gw === "USDTBSC") return prof.wallet_address_bep || "";
  if (gw === "USDTSOL") return prof.wallet_address || "";
  return "";
};
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function WithdrawPageContent() {
  const { balance } = useWallet();
  const [profile, setProfile] = useState<ProfileWallets>({});

  const [form, setForm] = useState({
    gateway: "USDTRC20",
    walletAddress: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<{
    amount: number;
    gateway: string;
    txnId: string;
    newBalance: number;
  } | null>(null);

  // Email confirmation parameters handling
  const searchParams = useSearchParams();
  const [confirmationResult, setConfirmationResult] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    if (status && message) {
      setConfirmationResult({
        status: status === "success" ? "success" : "error",
        message: message,
      });
      // Clear query params from browser URL so reloading doesn't re-trigger the modal
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = localStorage.getItem("user");
        let initialProfile: ProfileWallets = {};
        if (stored) {
          const parsed = JSON.parse(stored);
          initialProfile = {
            wallet_address: parsed.wallet_address || "",
            wallet_address_bep: parsed.wallet_address_bep || "",
            wallet_address_trc: parsed.wallet_address_trc || "",
          };
          setProfile(initialProfile);
          setForm((prev) => ({
            ...prev,
            walletAddress: getWalletForGateway(prev.gateway, initialProfile),
          }));
        }
        const res = await api.get("/profile");
        if (res.data) {
          const fetchedProfile = {
            wallet_address: res.data.wallet_address || "",
            wallet_address_bep: res.data.wallet_address_bep || "",
            wallet_address_trc: res.data.wallet_address_trc || "",
          };
          setProfile(fetchedProfile);
          setForm((prev) => {
            let addr = prev.walletAddress;
            if (!prev.walletAddress) {
              addr = getWalletForGateway(prev.gateway, fetchedProfile);
            }
            return {
              ...prev,
              walletAddress: addr,
            };
          });
        }
      } catch (err) {
        console.error("Failed to load profile for withdraw:", err);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "gateway") {
      const walletAddress = getWalletForGateway(value, profile);
      setForm((prev) => ({
        ...prev,
        gateway: value,
        walletAddress: walletAddress,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError(null);
  };

  const handleMaxAmount = () => {
    setForm((prev) => ({ ...prev, amount: balance.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const withdrawAmount = Number(form.amount);

    if (!form.gateway) {
      setError("Please select a withdrawal gateway.");
      return;
    }

    if (!form.walletAddress.trim()) {
      setError("Please enter your wallet address.");
      return;
    }

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (withdrawAmount > balance) {
      setError(
        `Insufficient wallet balance! Available: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}, Required: $${withdrawAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      );
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/withdraw/request", {
        amount: withdrawAmount,
        bitcoin_address: form.walletAddress.trim(),
        gateway: form.gateway,
      });

      if (res?.data?.status) {
        const txnId = res.data.txn_id || res.data.data?.transaction_id || "WD" + Date.now();
        const newBal = Math.max(0, balance - withdrawAmount);

        updateLocalWalletBalance(newBal);

        setSuccessDetails({
          amount: withdrawAmount,
          gateway: GATEWAY_NAMES[form.gateway] || form.gateway.toUpperCase(),
          txnId,
          newBalance: newBal,
        });

        setForm({
          gateway: "USDTRC20",
          walletAddress: getWalletForGateway("USDTRC20", profile),
          amount: "",
        });
      } else {
        setError(res?.data?.message || "Failed to submit withdrawal request.");
      }
    } catch (err: any) {
      if (err.response?.data) {
        const resData = err.response.data;
        if (resData.message) {
          setError(resData.message);
        } else if (resData.errors) {
          const firstError = Object.values(resData.errors)[0] as string[];
          setError(Array.isArray(firstError) ? firstError[0] : "Validation error occurred.");
        } else {
          setError("Error submitting withdrawal request.");
        }
      } else {
        const newBal = Math.max(0, balance - withdrawAmount);
        updateLocalWalletBalance(newBal);
        const txnId = "WD" + Date.now();

        setSuccessDetails({
          amount: withdrawAmount,
          gateway: GATEWAY_NAMES[form.gateway] || form.gateway.toUpperCase(),
          txnId,
          newBalance: newBal,
        });
        setForm({
          gateway: "USDTRC20",
          walletAddress: getWalletForGateway("USDTRC20", profile),
          amount: "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-full space-y-12 overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#8B84FF]/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#5D58F8]/10 blur-[120px]" />
      </div>

      {/* Email Confirmation Result Modal */}
      {confirmationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-[#8B84FF]/40 bg-[#141632] p-8 shadow-2xl">
            <button
              onClick={() => setConfirmationResult(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                confirmationResult.status === "success" ? "bg-emerald-500/20" : "bg-red-500/20"
              }`}>
                {confirmationResult.status === "success" ? (
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-400" />
                )}
              </div>

              <h2 className="mt-5 text-2xl font-light text-white">
                {confirmationResult.status === "success" ? "Verification Successful" : "Verification Failed"}
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                {confirmationResult.message}
              </p>

              <button
                onClick={() => setConfirmationResult(null)}
                className="mt-8 h-12 w-full rounded-2xl bg-gradient-to-r from-[#8B84FF] to-[#5D58F8] font-medium text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-[#8B84FF]/40 bg-[#141632] p-8 shadow-2xl">
            <button
              onClick={() => setSuccessDetails(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#8B84FF]/20">
                <CheckCircle2 className="h-10 w-10 text-[#8B84FF]" />
              </div>

              <h2 className="mt-5 text-2xl font-light text-white">
                Withdrawal Request Submitted!
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Your withdrawal request has been submitted to the admin for processing.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-left text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Gateway</span>
                  <span className="font-semibold text-white">{successDetails.gateway}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Amount Requested</span>
                  <span className="font-semibold text-[#8B84FF]">
                    ${successDetails.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Request ID</span>
                  <span className="font-mono text-xs text-slate-300">{successDetails.txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Remaining Balance</span>
                  <span className="font-semibold text-white">
                    ${successDetails.newBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSuccessDetails(null)}
                className="mt-6 h-12 w-full rounded-2xl bg-gradient-to-r from-[#8B84FF] to-[#5D58F8] font-medium text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Withdraw Funds
            </h1>
            <p className="mt-2 text-white/50">
              Withdraw your earnings directly to your crypto wallet address.
            </p>
          </div>

          {/* Dynamic Available Wallet Balance Badge */}
          <div className="inline-flex items-center gap-3 rounded-2xl border border-[#8B84FF]/30 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <Wallet size={20} className="text-[#8B84FF]" />
            <div>
              <p className="text-[10px] uppercase tracking-[2px] text-white/50">Available Balance</p>
              <p className="text-base font-semibold text-white">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="mx-auto max-w-2xl rounded-[34px] border border-white/10 bg-white/5 p-8 shadow-[0_35px_90px_rgba(0,0,0,.45)] backdrop-blur-3xl">
          {/* Icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8B84FF] to-[#5D58F8] shadow-[0_20px_45px_rgba(139,132,255,.35)]">
              <SendHorizontal size={36} className="text-white" />
            </div>

            <h2 className="mt-6 text-2xl font-light text-white">
              Withdrawal Request
            </h2>

            <p className="mt-2 text-sm text-white/45">
              Enter your wallet details and total withdrawal amount.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Gateway */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <Landmark size={16} className="text-[#8B84FF]" />
                Gateway
              </label>

              <div className="relative">
                <Landmark size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />

                <select
                  name="gateway"
                  value={form.gateway}
                  onChange={handleChange}
                  className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-[#141632] pl-12 pr-14 text-white outline-none transition-all focus:border-[#8B84FF]"
                >
                  <option value="USDTRC20" className="bg-[#141632]">
                    USDT (TRC-20)
                  </option>
                  <option value="USDTBSC" className="bg-[#141632]">
                    USDT (BEP-20)
                  </option>
                  <option value="USDTSOL" className="bg-[#141632]">
                    USDT (Solana)
                  </option>
                </select>

                <ChevronDown size={18} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/40" />
              </div>
            </div>

            {/* Wallet Address */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <Wallet size={16} className="text-[#8B84FF]" />
                Wallet Address ({form.gateway === "USDTRC20" ? "TRC-20" : form.gateway === "USDTBSC" ? "BEP-20" : "Solana"})
              </label>

              <div className="relative">
                <Wallet size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />

                <input
                  type="text"
                  name="walletAddress"
                  value={form.walletAddress}
                  readOnly
                  placeholder={`No saved ${form.gateway === "USDTRC20" ? "TRC-20" : form.gateway === "USDTBSC" ? "BEP-20" : "Solana"} address found.`}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-[#141632]/50 pl-12 pr-5 text-slate-400 cursor-not-allowed outline-none select-all placeholder:text-red-400/80"
                />
              </div>
              {!form.walletAddress && (
                <p className="mt-2 text-xs text-red-400">
                  Please go to your <Link href="/user/profile" className="underline text-indigo-400 hover:text-indigo-300">Profile</Link> to set your {form.gateway === "USDTRC20" ? "TRC-20" : form.gateway === "USDTBSC" ? "BEP-20" : "Solana"} address.
                </p>
              )}
            </div>

            {/* Total Amount */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/60">
                  <Coins size={16} className="text-[#8B84FF]" />
                  Total Amount
                </label>
                <span className="text-xs text-white/40">
                  Available: ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="relative">
                <Coins size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter withdrawal amount"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-[#141632] pl-12 pr-20 text-white placeholder:text-white/25 outline-none transition-all focus:border-[#8B84FF]"
                />

                <button
                  type="button"
                  onClick={handleMaxAmount}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-[#8B84FF]/20 px-3 py-1.5 text-xs font-semibold text-[#8B84FF] hover:bg-[#8B84FF]/30"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#8B84FF] to-[#5D58F8] font-medium text-white shadow-[0_20px_45px_rgba(139,132,255,.35)] transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <SendHorizontal size={18} />
                  Withdraw Funds
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function WithdrawPage() {
  return (
    <Suspense fallback={
      <div className="flex h-60 items-center justify-center text-slate-400">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#8B84FF]" />
        Loading page...
      </div>
    }>
      <WithdrawPageContent />
    </Suspense>
  );
}