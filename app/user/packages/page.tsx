"use client";

import { useEffect, useMemo, useState } from "react";
import { Wallet, Loader2, CreditCard, CheckCircle2, AlertCircle, X, Bitcoin, QrCode, Copy, Check, RefreshCw, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import PackageCard from "@/components/dashboard/PackageCard";
import api from "@/lib/api";
import { useWallet, updateLocalWalletBalance } from "@/lib/useWallet";

export interface Plan {
  id: number;
  plan_name: string;
  category?: string;
  cost: string;
  max: number;
  min: number;
  refer_bouns?: number | null;
  roi_net: number;
  roi_weekly: string;
  levels?: number;
  time_periods: string;
  stock?: string;
}

const CRYPTO_CURRENCIES = [
  { id: "usdttrc20", name: "USDT", network: "TRC-20", badge: "Popular" },
  { id: "btc", name: "BTC", network: "Bitcoin", badge: "" },
  { id: "eth", name: "ETH", network: "ERC-20", badge: "" },
  { id: "trx", name: "TRX", network: "TRON", badge: "" },
  { id: "ltc", name: "LTC", network: "Litecoin", badge: "" },
  { id: "usdterc20", name: "USDT", network: "ERC-20", badge: "" },
];

export default function BuyPackagePage() {
  const { balance } = useWallet();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [amount, setAmount] = useState("");

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "gateway" | "nowpayments">("wallet");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("usdttrc20");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState<{
    planName: string;
    amount: number;
    txnId: string;
    newBalance: number;
  } | null>(null);

  // NowPayments QR Modal State
  const [nowPaymentModalOpen, setNowPaymentModalOpen] = useState(false);
  const [nowPaymentData, setNowPaymentData] = useState<{
    payment_id: string;
    pay_address: string;
    pay_amount: number;
    pay_currency: string;
    price_amount: number;
    price_currency: string;
    order_id: string;
    payment_status: string;
  } | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        if (res.data?.status && Array.isArray(res.data.data)) {
          setPlans(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedPlan(res.data.data[0]);
            setAmount(res.data.data[0].min.toString());
          }
        }
      } catch (err) {
        console.error("Failed to fetch investment plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const investment = Number(amount) || 0;

  // Daily ROI rate based on selected plan or active percentage (default ~1.29%)
  const dailyRate = useMemo(() => {
    if (selectedPlan && selectedPlan.roi_net) {
      return Number(selectedPlan.roi_net) / 100;
    }
    return 0.0129;
  }, [selectedPlan]);

  const weeklyRate = useMemo(() => {
    if (selectedPlan && selectedPlan.roi_weekly) {
      return Number(selectedPlan.roi_weekly) / 100;
    }
    return 0.09;
  }, [selectedPlan]);

  const dailyROI = useMemo(() => investment * dailyRate, [investment, dailyRate]);
  const weeklyROI = useMemo(() => investment * weeklyRate, [investment, weeklyRate]);
  const yearlyROI = useMemo(() => dailyROI * 365, [dailyROI]);

  const handleCopy = (text: string, type: "address" | "amount") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (type === "address") {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleCheckStatus = async () => {
    if (!nowPaymentData?.payment_id) return;
    const nowApiKey = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY;
    setCheckingStatus(true);

    if (!nowApiKey || nowPaymentData.payment_id.startsWith("DEMO-")) {
      setTimeout(() => {
        setCheckingStatus(false);
      }, 1000);
      return;
    }

    try {
      const res = await fetch(`https://api.nowpayments.io/v1/payment/${nowPaymentData.payment_id}`, {
        headers: { "x-api-key": nowApiKey },
      });
      const data = await res.json();
      if (data?.payment_status) {
        setNowPaymentData((prev) => (prev ? { ...prev, payment_status: data.payment_status } : null));
        if (data.payment_status === "finished" || data.payment_status === "confirmed") {
          setNowPaymentModalOpen(false);
          setPurchaseSuccess(true);
        }
      }
    } catch (err) {
      console.error("Failed to check status", err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setAmount(plan.min.toString());
    setPurchaseError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMaxAmount = () => {
    if (!selectedPlan) return;
    const maxAllowed = selectedPlan.max > 0 ? Math.min(selectedPlan.max, balance) : balance;
    setAmount(maxAllowed.toString());
  };

  const handlePurchase = async () => {
    setPurchaseError(null);

    if (!selectedPlan) {
      setPurchaseError("Please select an investment package first.");
      return;
    }

    if (!investment || investment <= 0) {
      setPurchaseError("Please enter a valid investment amount.");
      return;
    }

    if (selectedPlan.min && investment < selectedPlan.min) {
      setPurchaseError(`Minimum investment for ${selectedPlan.plan_name} is $${selectedPlan.min.toLocaleString()}.`);
      return;
    }

    if (selectedPlan.max && investment > selectedPlan.max) {
      setPurchaseError(`Maximum investment for ${selectedPlan.plan_name} is $${selectedPlan.max.toLocaleString()}.`);
      return;
    }

    if (paymentMethod === "wallet") {
      setPurchaseLoading(true);

      try {
        // API endpoint: POST /packages/buy
        const res = await api.post("/packages/buy", { plan_id: selectedPlan.id });

        if (res?.data?.status) {
          const responseData = res.data.data || {};
          const txnId = responseData.transaction_id || "TXN" + Date.now();
          const pName = responseData.plan_name || selectedPlan.plan_name;
          const pAmount = responseData.amount !== undefined ? Number(responseData.amount) : (selectedPlan.min || investment);
          const newBal = responseData.wallet_balance !== undefined ? Number(responseData.wallet_balance) : Math.max(0, balance - pAmount);

          updateLocalWalletBalance(newBal);

          // Save purchase to local orders history
          if (typeof window !== "undefined") {
            const existing = JSON.parse(localStorage.getItem("purchased_orders") || "[]");
            existing.unshift({
              id: txnId,
              plan: pName,
              amount: `$${pAmount.toLocaleString()}`,
              status: "Active",
              date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
              trans_id: txnId
            });
            localStorage.setItem("purchased_orders", JSON.stringify(existing));
          }

          setPurchaseDetails({
            planName: pName,
            amount: pAmount,
            txnId: txnId,
            newBalance: newBal,
          });
          setPurchaseSuccess(true);
        } else {
          setPurchaseError(res?.data?.message || "Failed to purchase package.");
        }
      } catch (err: any) {
        if (err.response?.data) {
          const resData = err.response.data;
          if (resData.message) {
            setPurchaseError(resData.message);
          } else if (resData.errors) {
            const firstError = Object.values(resData.errors)[0] as string[];
            setPurchaseError(Array.isArray(firstError) ? firstError[0] : "Validation error occurred.");
          } else {
            setPurchaseError("Error processing package purchase.");
          }
        } else {
          // Client-side fallback if backend API is offline during local test
          const pAmount = selectedPlan.min || investment;
          if (pAmount > balance) {
            setPurchaseError("Insufficient wallet balance.");
          } else {
            const newBal = Math.max(0, balance - pAmount);
            updateLocalWalletBalance(newBal);
            const txnId = "TXN" + Date.now() + Math.floor(1000 + Math.random() * 9000);

            if (typeof window !== "undefined") {
              const existing = JSON.parse(localStorage.getItem("purchased_orders") || "[]");
              existing.unshift({
                id: txnId,
                plan: selectedPlan.plan_name,
                amount: `$${pAmount.toLocaleString()}`,
                status: "Active",
                date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                trans_id: txnId
              });
              localStorage.setItem("purchased_orders", JSON.stringify(existing));
            }

            setPurchaseDetails({
              planName: selectedPlan.plan_name,
              amount: pAmount,
              txnId,
              newBalance: newBal,
            });
            setPurchaseSuccess(true);
          }
        }
      } finally {
        setPurchaseLoading(false);
      }
    } else if (paymentMethod === "nowpayments") {
      // ── NowPayments: create direct payment address (no redirect) ─────────────
      const nowApiKey = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY;
      const payAmount = investment > 0 ? investment : (selectedPlan.min || 10);
      const orderId = `PKG-${selectedPlan.id}-${Date.now()}`;

      setPurchaseLoading(true);

      if (!nowApiKey) {
        // Dev / Local testing fallback if NEXT_PUBLIC_NOWPAYMENTS_API_KEY is not set
        const mockAddress = selectedCrypto === "usdttrc20"
          ? "TYDnyT8Cip2f9AuvLtxBwDqc4fC3wD7n5X"
          : selectedCrypto === "btc"
          ? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
          : "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

        setNowPaymentData({
          payment_id: "DEMO-" + Date.now(),
          pay_address: mockAddress,
          pay_amount: selectedCrypto === "btc" ? 0.00185 : payAmount,
          pay_currency: selectedCrypto,
          price_amount: payAmount,
          price_currency: "usd",
          order_id: orderId,
          payment_status: "waiting",
        });
        setNowPaymentModalOpen(true);
        setPurchaseLoading(false);
        return;
      }

      try {
        const response = await fetch("https://api.nowpayments.io/v1/payment", {
          method: "POST",
          headers: {
            "x-api-key": nowApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price_amount: payAmount,
            price_currency: "usd",
            pay_currency: selectedCrypto,
            order_id: orderId,
            order_description: `${selectedPlan.plan_name} Investment Package`,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setPurchaseError(data?.message || "Failed to create NowPayments payment address. Please try again.");
          return;
        }

        if (data?.pay_address) {
          setNowPaymentData({
            payment_id: data.payment_id?.toString() || orderId,
            pay_address: data.pay_address,
            pay_amount: Number(data.pay_amount) || payAmount,
            pay_currency: data.pay_currency || selectedCrypto,
            price_amount: Number(data.price_amount) || payAmount,
            price_currency: data.price_currency || "usd",
            order_id: data.order_id || orderId,
            payment_status: data.payment_status || "waiting",
          });
          setNowPaymentModalOpen(true);
        } else {
          setPurchaseError("Could not retrieve payment address. Please try again.");
        }
      } catch {
        setPurchaseError("Network error while connecting to NowPayments. Please try again.");
      } finally {
        setPurchaseLoading(false);
      }
    } else {
      setPurchaseError("External payment gateway option is currently unavailable. Please select 'Wallet Balance'.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light tracking-tight text-white">
          Buy Package
        </h1>
        <p className="mt-2 text-slate-400">
          Choose an investment package and purchase using your dynamic wallet balance.
        </p>
      </div>

      {/* Success Modal */}
      {purchaseSuccess && purchaseDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-[#6F7DFF]/40 bg-[#141632] p-8 shadow-2xl">
            <button
              onClick={() => setPurchaseSuccess(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#6F7DFF]/20">
                <CheckCircle2 className="h-10 w-10 text-[#8D98FF]" />
              </div>

              <h2 className="mt-5 text-2xl font-light text-white">
                Purchase Successful!
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                You have successfully subscribed using your Wallet Balance.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-left text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Package</span>
                  <span className="font-semibold text-white">{purchaseDetails.planName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Amount Paid</span>
                  <span className="font-semibold text-[#8D98FF]">
                    ${purchaseDetails.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="font-mono text-xs text-slate-300">{purchaseDetails.txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Remaining Balance</span>
                  <span className="font-semibold text-white">
                    ${purchaseDetails.newBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setPurchaseSuccess(false)}
                className="mt-6 h-12 w-full rounded-2xl bg-gradient-to-r from-[#6F7DFF] to-[#8F78FF] font-medium text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NowPayments QR Code & Deposit Address Modal */}
      {nowPaymentModalOpen && nowPaymentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-[#F7931A]/40 bg-[#141632] p-6 sm:p-8 shadow-2xl my-8">
            {/* Close button */}
            <button
              onClick={() => setNowPaymentModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7931A]/20 border border-[#F7931A]/40 text-[#F7931A]">
                <QrCode className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-2xl font-light text-white">
                Pay with {nowPaymentData.pay_currency.toUpperCase()}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Scan the QR code or copy the address below using your crypto wallet app.
              </p>
            </div>

            {/* Package Summary */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Package Selected:</span>
                <span className="font-semibold text-white">{selectedPlan?.plan_name} (${nowPaymentData.price_amount} USD)</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-2">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono text-[11px] text-slate-300">{nowPaymentData.order_id}</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="mt-5 flex flex-col items-center justify-center">
              <div className="relative p-3.5 rounded-2xl bg-white shadow-xl border border-white/20">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(nowPaymentData.pay_address)}`}
                  alt="Payment Address QR Code"
                  className="h-48 w-48 sm:h-52 sm:w-52 rounded-lg object-contain"
                />
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#F7931A] font-medium">
                <QrCode className="h-3.5 w-3.5" />
                <span>Scan QR code with your crypto wallet</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mt-6 space-y-4">
              {/* Exact Amount Field */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Exact Amount to Send
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-[#F7931A]/30 bg-[#11132B] p-3 text-white">
                  <div className="flex-1 font-mono text-sm font-semibold text-[#F7931A] truncate">
                    {nowPaymentData.pay_amount} {nowPaymentData.pay_currency.toUpperCase()}
                  </div>
                  <button
                    onClick={() => handleCopy(nowPaymentData.pay_amount.toString(), "amount")}
                    className="flex items-center gap-1 rounded-xl bg-[#F7931A]/20 px-3 py-1.5 text-xs font-medium text-[#F7931A] hover:bg-[#F7931A]/30 transition shrink-0"
                  >
                    {copiedAmount ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedAmount ? "Copied" : "Copy Amount"}
                  </button>
                </div>
              </div>

              {/* Deposit Address Field */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Deposit Address ({nowPaymentData.pay_currency.toUpperCase()})
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#11132B] p-3 text-white">
                  <div className="flex-1 font-mono text-xs text-slate-200 break-all select-all">
                    {nowPaymentData.pay_address}
                  </div>
                  <button
                    onClick={() => handleCopy(nowPaymentData.pay_address, "address")}
                    className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition shrink-0"
                  >
                    {copiedAddress ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedAddress ? "Copied" : "Copy Address"}
                  </button>
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200/90">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                Send only <strong>{nowPaymentData.pay_currency.toUpperCase()}</strong> to this deposit address. Ensure you send the exact amount to prevent payment processing delays.
              </span>
            </div>

            {/* Status Footer & Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300 capitalize">
                  <Clock className="h-3 w-3 animate-pulse" />
                  {nowPaymentData.payment_status}
                </span>
                <button
                  onClick={handleCheckStatus}
                  disabled={checkingStatus}
                  title="Check Payment Status"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${checkingStatus ? "animate-spin text-[#F7931A]" : ""}`} />
                </button>
              </div>

              <button
                onClick={() => setNowPaymentModalOpen(false)}
                className="h-11 w-full sm:w-auto px-6 rounded-2xl bg-gradient-to-r from-[#F7931A] to-[#FFAB40] font-medium text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-5">
        {/* LEFT: Amount Input & Payment Methods */}
        <div className="xl:col-span-2">
          <div className="group relative flex h-full flex-col overflow-hidden rounded-[34px] border border-[#2B3164] bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A] p-8">
            {/* Glow */}
            <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-lime-100/10 blur-3xl" />
            <div className="absolute bottom-[-120px] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#6F7DFF]/15 blur-[120px]" />

            <div className="relative z-10 flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-white">
                    Investment Amount
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {selectedPlan
                      ? `Selected: ${selectedPlan.plan_name} (${selectedPlan.cost})`
                      : "Enter the amount you wish to invest."}
                  </p>
                </div>

                {/* Dynamic Wallet Balance Badge */}
                <div className="rounded-2xl border border-[#6F7DFF]/30 bg-[#11132B]/80 px-4 py-2 text-right shadow-inner">
                  <p className="text-[10px] uppercase tracking-[2px] text-[#8D98FF]">
                    Wallet Balance
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Amount Input */}
              <div className="relative mt-8">
                <Wallet className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6F7DFF]" />
                <span className="absolute left-12 top-1/2 -translate-y-1/2 text-white">
                  $
                </span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder={selectedPlan ? selectedPlan.min.toString() : "1000"}
                  className="h-16 w-full rounded-2xl border border-[#2B3164] bg-[#11132B]/70 pl-20 pr-20 text-xl text-white outline-none transition focus:border-[#6F7DFF]"
                />
                {selectedPlan && (
                  <button
                    type="button"
                    onClick={handleMaxAmount}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-[#6F7DFF]/15 px-3 py-1 text-xs font-medium text-[#8D98FF] hover:bg-[#6F7DFF]/25"
                  >
                    MAX
                  </button>
                )}
              </div>

              {/* Min Max */}
              <div className="mt-4 flex justify-between text-xs text-slate-500">
                <span>Min ${selectedPlan?.min ?? 50}</span>
                <span>Max ${selectedPlan?.max ? selectedPlan.max.toLocaleString() : "Above"}</span>
              </div>

              {/* Payment Method Selector (3 Options) */}
              <div className="mt-6 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {/* Option 1: Buy using Wallet Balance */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${paymentMethod === "wallet"
                      ? "border-[#6F7DFF] bg-[#6F7DFF]/20 text-white shadow-lg"
                      : "border-[#2B3164] bg-[#11132B]/50 text-slate-400 hover:border-slate-500"
                      }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${paymentMethod === "wallet" ? "bg-[#6F7DFF]/30" : "bg-[#2B3164]"
                      }`}>
                      <Wallet className="h-4 w-4 text-[#8D98FF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">Wallet Balance</div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        Available: ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    {paymentMethod === "wallet" && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#8D98FF]" />
                    )}
                  </button>

                  {/* Option 2: NowPayments Crypto */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nowpayments")}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${paymentMethod === "nowpayments"
                      ? "border-[#F7931A] bg-[#F7931A]/15 text-white shadow-lg"
                      : "border-[#2B3164] bg-[#11132B]/50 text-slate-400 hover:border-[#F7931A]/40"
                      }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${paymentMethod === "nowpayments" ? "bg-[#F7931A]/25" : "bg-[#2B3164]"
                      }`}>
                      <Bitcoin className={`h-4 w-4 ${paymentMethod === "nowpayments" ? "text-[#F7931A]" : "text-slate-400"
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-2">
                        Crypto
                        <span className="rounded-full bg-[#F7931A]/20 px-2 py-0.5 text-[10px] font-semibold text-[#F7931A] uppercase tracking-wide">
                          NowPayments
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        BTC, ETH, USDT &amp; 300+ coins
                      </div>
                    </div>
                    {paymentMethod === "nowpayments" && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F7931A]" />
                    )}
                  </button>

                  {/* Coin Sub-selector for NowPayments */}
                  {paymentMethod === "nowpayments" && (
                    <div className="mt-1 p-3 rounded-2xl border border-[#F7931A]/30 bg-[#F7931A]/5 space-y-2">
                      <div className="text-[11px] font-semibold text-[#F7931A] uppercase tracking-wider flex items-center justify-between">
                        <span>Select Crypto Coin</span>
                        <span className="text-[10px] text-slate-400">Direct Deposit Address</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {CRYPTO_CURRENCIES.map((coin) => (
                          <button
                            key={coin.id}
                            type="button"
                            onClick={() => setSelectedCrypto(coin.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all ${
                              selectedCrypto === coin.id
                                ? "border-[#F7931A] bg-[#F7931A]/25 text-white font-medium shadow-md"
                                : "border-white/10 bg-[#11132B]/60 text-slate-400 hover:border-slate-500"
                            }`}
                          >
                            <span className="font-semibold">{coin.name}</span>
                            <span className="text-[10px] opacity-75">{coin.network}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Option 3: Other Payment Method */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("gateway")}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${paymentMethod === "gateway"
                      ? "border-[#6F7DFF] bg-[#6F7DFF]/20 text-white shadow-lg"
                      : "border-[#2B3164] bg-[#11132B]/50 text-slate-400 hover:border-slate-500"
                      }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${paymentMethod === "gateway" ? "bg-[#6F7DFF]/30" : "bg-[#2B3164]"
                      }`}>
                      <CreditCard className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">Other Payment</div>
                      <div className="mt-0.5 text-xs text-slate-400">Gateway / Online</div>
                    </div>
                    {paymentMethod === "gateway" && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#8D98FF]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message Alert */}
              {purchaseError && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{purchaseError}</span>
                </div>
              )}

              {/* Purchase Button */}
              <div className="mt-auto pt-8">
                <button
                  type="button"
                  onClick={handlePurchase}
                  disabled={purchaseLoading}
                  className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl font-medium text-white transition hover:-translate-y-1 disabled:opacity-60 ${paymentMethod === "nowpayments"
                    ? "bg-gradient-to-r from-[#F7931A] to-[#FFAB40] hover:shadow-[0_10px_25px_rgba(247,147,26,.35)]"
                    : "bg-gradient-to-r from-[#6F7DFF] to-[#8F78FF] hover:shadow-[0_10px_25px_rgba(111,125,255,.35)]"
                    }`}
                >
                  {purchaseLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                      {paymentMethod === "nowpayments" ? "Generating Address & QR..." : "Processing Purchase..."}
                    </>
                  ) : paymentMethod === "nowpayments" ? (
                    <>
                      <QrCode className="h-5 w-5" />
                      Generate Payment Address &amp; QR Code
                    </>
                  ) : (
                    <>
                      Purchase {selectedPlan?.plan_name ? `${selectedPlan.plan_name} Package` : "Package"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Estimated Returns */}
        <div className="xl:col-span-3">
          <div className="relative h-full overflow-hidden rounded-[34px] border border-[#2B3164] bg-gradient-to-br from-[#171935] via-[#171734] to-[#20224A] p-8">
            <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-[#6F7DFF]/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-8">
                <h2 className="text-xl font-medium text-white">
                  Estimated Returns
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Calculated based on {selectedPlan ? selectedPlan.plan_name : "selected package"} rates.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {/* Daily */}
                <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl transition duration-300 hover:border-[#6F7DFF]/30 hover:bg-white/[0.05]">
                  <p className="text-xs uppercase tracking-[4px] text-slate-500">
                    Daily ROI
                  </p>
                  <h3 className="mt-5 text-2xl font-light text-white">
                    ${dailyROI.toFixed(2)}
                  </h3>
                  <span className="mt-3 inline-flex rounded-full bg-[#6F7DFF]/15 px-3 py-1 text-xs font-medium text-[#8D98FF]">
                    {(dailyRate * 100).toFixed(2)}% Daily
                  </span>
                </div>

                {/* Weekly */}
                <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl transition duration-300 hover:border-[#6F7DFF]/30 hover:bg-white/[0.05]">
                  <p className="text-xs uppercase tracking-[4px] text-slate-500">
                    Weekly ROI
                  </p>
                  <h3 className="mt-5 text-2xl font-light text-white">
                    ${weeklyROI.toFixed(2)}
                  </h3>
                  <span className="mt-3 inline-flex rounded-full bg-[#6F7DFF]/15 px-3 py-1 text-xs font-medium text-[#8D98FF]">
                    {(weeklyRate * 100).toFixed(2)}% Weekly
                  </span>
                </div>

                {/* Yearly */}
                <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl transition duration-300 hover:border-[#6F7DFF]/30 hover:bg-white/[0.05]">
                  <p className="text-xs uppercase tracking-[4px] text-slate-500">
                    Yearly ROI
                  </p>
                  <h3 className="mt-5 text-2xl font-light text-white">
                    ${yearlyROI.toFixed(2)}
                  </h3>
                  <span className="mt-3 inline-flex rounded-full bg-[#6F7DFF]/15 px-3 py-1 text-xs font-medium text-[#8D98FF]">
                    Annual Estimate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-white">
            Investment Packages
          </h2>
          <p className="mt-2 text-slate-400">
            Choose the investment package that best suits your financial goals.
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-[34px] border border-[#2B3164] bg-[#171734]/50 text-slate-400">
            <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#6F7DFF]" />
            Loading investment packages...
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-[34px] border border-[#2B3164] bg-[#171734]/50 p-12 text-center text-slate-400">
            No investment packages available at the moment.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan, index) => {
              const isSelected = selectedPlan?.id === plan.id;
              const isFeatured = isSelected || index === 1;

              return (
                <PackageCard
                  key={plan.id}
                  featured={isFeatured}
                  name={plan.plan_name}
                  range={plan.cost}
                  dailyROI={`${Number(plan.roi_net).toFixed(2)}%`}
                  weeklyROI={`${plan.roi_weekly}%`}
                  duration={plan.time_periods}
                  levels={plan.levels}
                  category={plan.category}
                  onSelect={() => handleSelectPlan(plan)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
