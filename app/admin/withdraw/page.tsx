"use client";

import { useState } from "react";
import {
  Landmark,
  Wallet,
  Coins,
  SendHorizontal,
  ChevronDown,
} from "lucide-react";

export default function WithdrawPage() {
  const [form, setForm] = useState({
    gateway: "",
    walletAddress: "",
    amount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#8B84FF]/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#5D58F8]/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-white">
            Withdraw Funds
          </h1>

          <p className="mt-2 text-white/50">
            Withdraw your earnings securely.
          </p>
        </div>

        {/* Card */}
        <div
          className="
            mx-auto
            max-w-2xl
            rounded-[34px]
            border
            border-white/10
            bg-white/5
            p-8
            backdrop-blur-3xl
            shadow-[0_35px_90px_rgba(0,0,0,.45)]
          "
        >
          {/* Icon */}
          <div className="mb-10 text-center">
            <div
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-[#8B84FF]
                to-[#5D58F8]
                shadow-[0_20px_45px_rgba(139,132,255,.35)]
              "
            >
              <SendHorizontal size={36} className="text-white" />
            </div>

            <h2 className="mt-6 text-2xl font-light text-white">
              Withdraw Request
            </h2>

            <p className="mt-2 text-sm text-white/45">
              Submit your withdrawal request.
            </p>
          </div>

          <div className="space-y-6">
            {/* Gateway */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <Landmark size={16} className="text-[#8B84FF]" />
                Gateway
              </label>

              <div className="relative">
                <Landmark
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40"
                />

                <select
                  name="gateway"
                  value={form.gateway}
                  onChange={handleChange}
                  className="
                    h-14
                    w-full
                    appearance-none
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    pl-12
                    pr-14
                    text-white
                    outline-none
                    transition-all
                    focus:border-[#8B84FF]
                    focus:bg-white/10
                  "
                >
                  <option value="" className="bg-[#111827]">
                    Select Gateway
                  </option>

                  <option value="usdt" className="bg-[#111827]">
                    USDT (TRC20)
                  </option>

                  <option value="binance" className="bg-[#111827]">
                    Binance (TRC20)
                  </option>

                  <option value="tronlink" className="bg-[#111827]">
                    TronLink
                  </option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/40"
                />
              </div>
            </div>

            {/* Conditional Fields */}
            {form.gateway && (
              <>
                {/* Wallet Address */}
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                    <Wallet size={16} className="text-[#8B84FF]" />
                    Wallet Address (TRC20)
                  </label>

                  <div className="relative">
                    <Wallet
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40"
                    />

                    <input
                      type="text"
                      name="walletAddress"
                      value={form.walletAddress}
                      onChange={handleChange}
                      placeholder="Enter your TRC20 wallet address"
                      className="
                        h-14
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        pl-12
                        pr-5
                        text-white
                        placeholder:text-white/25
                        outline-none
                        transition-all
                        focus:border-[#8B84FF]
                        focus:bg-white/10
                      "
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                    <Coins size={16} className="text-[#8B84FF]" />
                    Total Amount
                  </label>

                  <div className="relative">
                    <Coins
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40"
                    />

                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="Enter withdrawal amount"
                      className="
                        h-14
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        pl-12
                        pr-5
                        text-white
                        placeholder:text-white/25
                        outline-none
                        transition-all
                        focus:border-[#8B84FF]
                        focus:bg-white/10
                      "
                    />
                  </div>
                </div>

              </>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Button */}
            <button
              type="button"
              className="
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-full
                bg-white
                font-medium
                text-[#5D58F8]
                shadow-[0_20px_45px_rgba(255,255,255,.15)]
                transition-all
                hover:scale-[1.02]
                hover:shadow-[0_25px_60px_rgba(255,255,255,.25)]
                active:scale-[0.98]
              "
            >
              <SendHorizontal size={18} />
              Withdraw Funds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}