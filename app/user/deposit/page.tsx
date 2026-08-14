"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark, Wallet, Coins, ArrowDownToLine, ChevronDown,
  Loader2, CheckCircle2, AlertCircle, X, Copy, Check,
  History, Clock3, XCircle, QrCode, RefreshCw, ShieldCheck, Clock,
} from "lucide-react";
import api from "@/lib/api";

interface PaymentGateway {
  key: string;
  label: string;
  network: string;
  color: string;
  walletAddress: string;
}
interface NowPaymentData {
  payment_id: string; pay_address: string; pay_amount: number;
  pay_currency: string; price_amount: number; price_currency: string;
  order_id: string; payment_status: string;
}
interface DepositHistoryItem {
  id: number | string; txnid: string; gateway: string;
  amount: string | number; status: string; created_at: string;
}
interface ProfileWallets {
  wallet_address?: string; wallet_address_bep?: string; wallet_address_trc?: string;
}
const GATEWAYS: Omit<PaymentGateway, "walletAddress">[] = [
  { key: "USDTRC20",  label: "USDT (TRC-20)",  network: "TRON Network",          color: "#FF060A" },
  { key: "USDTBSC",   label: "USDT (BEP-20)",  network: "Binance Smart Chain",   color: "#F0B90B" },
  { key: "USDTSOL",   label: "USDT (Solana)",  network: "Solana Network",         color: "#9945FF" },
];
const GATEWAY_WALLET_FIELD: Record<string, keyof ProfileWallets> = {
  USDTRC20:  "wallet_address_trc",
  USDTBSC:   "wallet_address_bep",
  USDTSOL:   "wallet_address",
};
function buildGateways(p: ProfileWallets): PaymentGateway[] {
  return GATEWAYS.map((gw) => ({ ...gw, walletAddress: p[GATEWAY_WALLET_FIELD[gw.key]] || "" }));
}
const QUICK_AMOUNTS = [50, 100, 250, 500, 1000];

export default function DepositPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>(GATEWAYS[0].key);
  const [amount, setAmount] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nowData, setNowData] = useState<NowPaymentData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [history, setHistory] = useState<DepositHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setProfileLoading(true);
      try {
        const stored = localStorage.getItem("user");
        if (stored) setGateways(buildGateways(JSON.parse(stored)));
        const res = await api.get("/profile");
        if (res.data) setGateways(buildGateways({ wallet_address: res.data.wallet_address, wallet_address_bep: res.data.wallet_address_bep, wallet_address_trc: res.data.wallet_address_trc }));
      } catch (e) { console.error(e); } finally { setProfileLoading(false); }
    };
    load();
  }, []);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await api.get("/deposit/history");
      if (res?.data?.status && Array.isArray(res.data.data)) {
        setHistory(res.data.data.map((item: any, idx: number) => ({
          id: item.id || idx + 1,
          txnid: item.txnid || item.transaction_id || `#DEP${item.id || idx + 1}`,
          gateway: item.gateway || item.type || "USDT",
          amount: item.amount !== undefined ? item.amount : (item.dr || item.cr || 0),
          status: (item.status === 1 || item.status === "Confirmed" || item.status === "Completed") ? "Confirmed" : (item.status === 0 || item.status === "Pending") ? "Pending" : "Rejected",
          created_at: item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : new Date().toLocaleDateString(),
        })));
      }
    } catch { } finally { setHistoryLoading(false); }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  useEffect(() => {
    if (!modalOpen || !nowData?.payment_id) return;
    const interval = setInterval(handleCheckStatus, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, nowData?.payment_id]);

  // Check payment status via backend (which proxies NowPayments)
  const handleCheckStatus = async () => {
    if (!nowData?.payment_id) return;
    setCheckingStatus(true);
    try {
      const res = await api.get(`/deposit/status/${nowData.payment_id}`);
      const status = res?.data?.payment_status || res?.data?.data?.payment_status;
      if (status) {
        setNowData((prev) => prev ? { ...prev, payment_status: status } : null);
        if (status === "finished" || status === "confirmed") fetchHistory();
      }
    } catch (e) { console.error(e); } finally { setCheckingStatus(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const depositAmount = Number(amount);
    if (!selectedKey) { setError("Please select a payment gateway."); return; }
    if (!depositAmount || depositAmount <= 0) { setError("Please enter a valid deposit amount."); return; }
    setLoading(true);

    try {
      /**
       * Single call to backend — mirrors PHP flow:
       *   1. Backend applies fee logic (e.g. +$4 for USDTRC20)
       *   2. Backend calls NowPayments createPayment()
       *   3. Backend saves Deposit record to DB
       *   4. Backend returns the NowPayments response fields
       *
       * Payload matches $request->amount and $request->currency_thro in PHP.
       */
      const res = await api.post("/deposit/request", {
        amount: depositAmount,
        currency_thro: selectedKey, // matches $request->currency_thro in PHP
      });

      // Backend returns the saved deposit fields (mirrors $response from NowPayments)
      const d = res?.data?.data || res?.data;

      if (!d?.pay_address) {
        setError(d?.message || "Payment address not returned. Please try again.");
        return;
      }

      setNowData({
        payment_id:     String(d.payment_id   || ""),
        pay_address:    d.pay_address,
        pay_amount:     Number(d.pay_amount)   || depositAmount,
        pay_currency:   d.pay_currency         || selectedKey,
        price_amount:   Number(d.price_amount) || depositAmount,
        price_currency: d.price_currency       || "usd",
        order_id:       d.order_id             || "",
        payment_status: d.payment_status       || "waiting",
      });
      setModalOpen(true);
      fetchHistory(); // refresh table so the new pending row appears
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create payment. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: "address" | "amount") => {
    navigator.clipboard.writeText(text);
    if (type === "address") { setCopiedAddress(true); setTimeout(() => setCopiedAddress(false), 2000); }
    else { setCopiedAmount(true); setTimeout(() => setCopiedAmount(false), 2000); }
  };

  const activeGateway = gateways.find((g) => g.key === selectedKey) ?? (GATEWAYS.find((g) => g.key === selectedKey) as any);

  return (
    <div className="relative min-h-full space-y-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#F7931A]/8 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#FFAB40]/8 blur-[120px]" />
      </div>

      {/* NowPayments Modal */}
      <AnimatePresence>
        {modalOpen && nowData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="relative my-8 w-full max-w-lg overflow-hidden rounded-[32px] border border-[#F7931A]/40 bg-[#141632] p-6 shadow-2xl sm:p-8">
              <button onClick={() => setModalOpen(false)} className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F7931A]/40 bg-[#F7931A]/20 text-[#F7931A]"><QrCode className="h-7 w-7" /></div>
                <h2 className="mt-4 text-2xl font-light text-white">Pay with {nowData.pay_currency.toUpperCase()}</h2>
                <p className="mt-1 text-xs text-slate-400">Scan the QR code or copy the address to your crypto wallet.</p>
              </div>
              <div className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs">
                <div className="flex items-center justify-between"><span className="text-slate-400">Deposit Amount:</span><span className="font-semibold text-white">${nowData.price_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span></div>
                <div className="flex items-center justify-between border-t border-white/5 pt-2"><span className="text-slate-400">Order ID:</span><span className="font-mono text-[11px] text-slate-300">{nowData.order_id}</span></div>
              </div>
              <div className="mt-5 flex flex-col items-center">
                <div className="rounded-2xl border border-white/20 bg-white p-3.5 shadow-xl">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(nowData.pay_address)}`} alt="QR Code" className="h-48 w-48 rounded-lg object-contain sm:h-52 sm:w-52" />
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#F7931A]"><QrCode className="h-3.5 w-3.5" /><span>Scan QR code with your crypto wallet</span></div>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Exact Amount to Send</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-[#F7931A]/30 bg-[#11132B] p-3">
                    <div className="flex-1 truncate font-mono text-sm font-semibold text-[#F7931A]">{nowData.pay_amount} {nowData.pay_currency.toUpperCase()}</div>
                    <button onClick={() => handleCopy(nowData.pay_amount.toString(), "amount")} className="flex shrink-0 items-center gap-1 rounded-xl bg-[#F7931A]/20 px-3 py-1.5 text-xs font-medium text-[#F7931A] transition hover:bg-[#F7931A]/30">
                      {copiedAmount ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copiedAmount ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Deposit Address ({nowData.pay_currency.toUpperCase()})</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#11132B] p-3">
                    <div className="flex-1 select-all break-all font-mono text-xs text-slate-200">{nowData.pay_address}</div>
                    <button onClick={() => handleCopy(nowData.pay_address, "address")} className="flex shrink-0 items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20">
                      {copiedAddress ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}{copiedAddress ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200/90">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>Send only <strong>{nowData.pay_currency.toUpperCase()}</strong> to this address. Sending any other coin will result in permanent loss of funds.</span>
              </div>
              <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium capitalize text-amber-300"><Clock className="h-3 w-3 animate-pulse" />{nowData.payment_status}</span>
                  <button onClick={handleCheckStatus} disabled={checkingStatus} title="Refresh" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50">
                    <RefreshCw className={`h-3.5 w-3.5 ${checkingStatus ? "animate-spin text-[#F7931A]" : ""}`} />
                  </button>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  {nowData.payment_id.startsWith("DEMO-") && (
                    <button onClick={() => { fetchHistory(); setModalOpen(false); }} className="h-11 shrink-0 rounded-2xl border border-[#F7931A]/40 bg-[#F7931A]/20 px-4 text-xs font-medium text-[#F7931A] transition hover:bg-[#F7931A]/30">Simulate Paid (Demo)</button>
                  )}
                  <button onClick={() => setModalOpen(false)} className="h-11 w-full rounded-2xl bg-gradient-to-r from-[#F7931A] to-[#FFAB40] font-medium text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:px-6">Done / Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page */}
      <div className="relative z-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white">Deposit Funds</h1>
            <p className="mt-2 text-white/50">Powered by <span className="font-semibold text-[#F7931A]">NOWPayments</span> — instant crypto payment addresses.</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 backdrop-blur-xl">
            <ShieldCheck size={20} className="text-emerald-400" />
            <div>
              <p className="text-[10px] uppercase tracking-[2px] text-emerald-400/70">Secure Deposit</p>
              <p className="text-sm font-semibold text-emerald-300">NOWPayments</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl rounded-[34px] border border-white/10 bg-white/5 p-8 shadow-[0_35px_90px_rgba(0,0,0,.45)] backdrop-blur-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#F7931A] to-[#FFAB40] shadow-[0_20px_45px_rgba(247,147,26,.35)]">
              <ArrowDownToLine size={36} className="text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-light text-white">New Deposit</h2>
            <p className="mt-2 text-sm text-white/45">Select a network, enter the amount, and get your payment address instantly.</p>
          </div>

          {profileLoading ? (
            <div className="flex h-40 items-center justify-center text-white/50">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#F7931A]" />Loading gateways...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Gateway */}
              <div>
                <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                  <Landmark size={16} className="text-[#F7931A]" />Payment Gateway
                </label>
                <div className="relative">
                  <button type="button" onClick={() => setDropdownOpen((v) => !v)}
                    className="flex h-14 w-full items-center gap-4 rounded-2xl border border-white/10 bg-[#141632] px-5 text-left text-white outline-none transition-all hover:border-white/20 focus:border-[#F7931A]">
                    {activeGateway && (<span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: activeGateway.color, boxShadow: `0 0 8px ${activeGateway.color}88` }} />)}
                    <span className="flex-1 text-[15px]">{activeGateway ? activeGateway.label : "Select Gateway"}</span>
                    {activeGateway && <span className="text-xs text-white/35">{activeGateway.network}</span>}
                    <ChevronDown size={18} className={`shrink-0 text-white/40 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-[#141632] shadow-[0_20px_50px_rgba(0,0,0,.55)] backdrop-blur-2xl">
                        {GATEWAYS.map((gw) => {
                          const walletAddr = gateways.find((g) => g.key === gw.key)?.walletAddress || "";
                          return (
                            <button key={gw.key} type="button" onClick={() => { setSelectedKey(gw.key); setDropdownOpen(false); setError(null); }}
                              className={`flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/5 ${selectedKey === gw.key ? "bg-[#F7931A]/10" : ""}`}>
                              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: gw.color, boxShadow: `0 0 8px ${gw.color}88` }} />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white">{gw.label}</p>
                                <p className="text-xs text-white/40">{gw.network}</p>
                                {walletAddr && <p className="mt-0.5 truncate font-mono text-[10px] text-white/25">{walletAddr.slice(0, 22)}…</p>}
                              </div>
                              {selectedKey === gw.key && <CheckCircle2 size={16} className="shrink-0 text-[#F7931A]" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Wallet preview */}
              {activeGateway && (activeGateway as PaymentGateway).walletAddress && (
                <motion.div key={selectedKey} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: activeGateway.color + "22" }}>
                      <Wallet size={15} style={{ color: activeGateway.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-white/35">Your saved wallet · {activeGateway.network}</p>
                      <p className="mt-0.5 truncate font-mono text-xs text-white/60">{(activeGateway as PaymentGateway).walletAddress}</p>
                    </div>
                    <QrCode size={16} className="shrink-0 text-white/15" />
                  </div>
                </motion.div>
              )}

              {/* Amount */}
              <div>
                <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                  <Coins size={16} className="text-[#F7931A]" />Deposit Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-light text-white/30">$</span>
                  <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setError(null); }} placeholder="0.00" min="1" step="0.01"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-[#141632] pl-9 pr-5 text-white placeholder:text-white/20 outline-none transition-all focus:border-[#F7931A] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((v) => (
                    <button key={v} type="button" onClick={() => { setAmount(v.toString()); setError(null); }}
                      className={`rounded-xl border px-4 py-1.5 text-xs font-medium transition-all ${amount === v.toString() ? "border-[#F7931A]/60 bg-[#F7931A]/20 text-[#F7931A]" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white"}`}>
                      ${v}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" /><span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <button type="submit" disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#F7931A] to-[#FFAB40] font-medium text-white shadow-[0_20px_45px_rgba(247,147,26,.35)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? (<><Loader2 className="h-5 w-5 animate-spin" />Generating Address...</>) : (<><ArrowDownToLine size={18} />Generate Payment Address</>)}
              </button>
              <p className="text-center text-[11px] text-white/25">Payment addresses generated securely via <span className="font-medium text-[#F7931A]/60">NOWPayments API</span></p>
            </form>
          )}
        </div>

        {/* History */}
        <div className="mt-12 rounded-[34px] border border-white/10 bg-white/5 p-4 shadow-[0_35px_80px_rgba(0,0,0,.45)] backdrop-blur-3xl lg:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-[#F7931A]" />
              <h2 className="text-xl font-medium text-white">Deposit History</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50">{history.length} Records</span>
              <button onClick={fetchHistory} disabled={historyLoading} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/40 transition hover:bg-white/10 hover:text-white disabled:opacity-40" title="Refresh">
                <RefreshCw className={`h-4 w-4 ${historyLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
          {historyLoading ? (
            <div className="flex h-40 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-slate-400">
              <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#F7931A]" />Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">No deposit records found. Make your first deposit above!</div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
              <table className="min-w-full whitespace-nowrap text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-widest text-white/50">
                    <th className="px-6 py-4">Request ID</th><th className="px-6 py-4">Gateway</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-white/5 transition hover:bg-white/[0.05]">
                      <td className="px-6 py-4 font-mono text-white">{item.txnid}</td>
                      <td className="px-6 py-4 text-white/80">{item.gateway}</td>
                      <td className="px-6 py-4 font-semibold text-white">${typeof item.amount === "number" ? item.amount.toFixed(2) : item.amount}</td>
                      <td className="px-6 py-4">
                        {item.status === "Confirmed" || item.status === "Completed" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"><CheckCircle2 size={14} /> Confirmed</span>
                        ) : item.status === "Pending" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400"><Clock3 size={14} /> Pending</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400"><XCircle size={14} /> Rejected</span>
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
