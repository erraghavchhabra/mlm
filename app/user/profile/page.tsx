"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  UserCircle2,
  Mail,
  Phone,
  Wallet,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/api";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<"erc" | "bep" | "trc">("erc");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    country: "",
    wallet_address: "",
    wallet_address_bep: "",
    wallet_address_trc: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        const d = res.data;
        if (d) {
          setForm({
            full_name: d.full_name || d.name || "",
            email: d.email || "",
            mobile: d.mobile || d.phone || "",
            country: d.country || "",
            wallet_address: d.wallet_address || "",
            wallet_address_bep: d.wallet_address_bep || "",
            wallet_address_trc: d.wallet_address_trc || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await api.post("/profile/update", {
        full_name: form.full_name,
        email: form.email,
        mobile: form.mobile,
        country: form.country,
        wallet_address: form.wallet_address,
        wallet_address_bep: form.wallet_address_bep,
        wallet_address_trc: form.wallet_address_trc,
      });

      // Sync updated data into localStorage
      const storedUser = localStorage.getItem("user");
      const currentUser = storedUser ? JSON.parse(storedUser) : {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          full_name: form.full_name,
          email: form.email,
          mobile: form.mobile,
          country: form.country,
          wallet_address: form.wallet_address,
          wallet_address_bep: form.wallet_address_bep,
          wallet_address_trc: form.wallet_address_trc,
        })
      );

      setMessage({ type: "success", text: res.data?.message || "Profile updated successfully!" });
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to update profile.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none transition-all placeholder:text-white/25 focus:border-[#8B84FF] focus:bg-white/10";
  const labelCls = "mb-3 flex items-center gap-2 text-sm text-white/60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      <div className="relative z-10">
        {/* Heading */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Profile Settings
            </h1>
            <p className="mt-2 text-white/55">
              Manage your personal information and account preferences.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 text-sm ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {message.type === "success" && <CheckCircle2 size={18} />}
            {message.text}
          </div>
        )}

        {/* Card */}
        <motion.form
          onSubmit={handleSubmit}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.25 }}
          className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-8 shadow-[0_35px_80px_rgba(0,0,0,.45)] backdrop-blur-3xl"
        >
          {loading ? (
            <div className="flex h-64 items-center justify-center text-white/50">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Loading profile data...
            </div>
          ) : (
            <>
              {/* Form Grid */}
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2">

                {/* Full Name */}
                <div>
                  <label className={labelCls}>
                    <User size={16} className="text-[#8B84FF]" />
                    Full Name
                  </label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={inputCls}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={labelCls}>
                    <Mail size={16} className="text-[#8B84FF]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={inputCls}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className={labelCls}>
                    <Phone size={16} className="text-[#8B84FF]" />
                    Phone Number
                  </label>
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={inputCls}
                  />
                </div>

                {/* Country */}
                <div>
                  <label className={labelCls}>
                    <Globe size={16} className="text-[#8B84FF]" />
                    Country
                  </label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Section Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Wallet Addresses Section Header with Switcher Tabs */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Wallet size={20} className="text-[#8B84FF]" />
                    Wallet Addresses
                  </h3>
                  <p className="mt-1 text-sm text-white/55">
                    Select a network tab to view and update your deposit/withdrawal address.
                  </p>
                </div>

                {/* Switcher Buttons */}
                <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl self-start md:self-auto">
                  {(["erc", "bep", "trc"] as const).map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setActiveNetwork(net)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                        activeNetwork === net
                          ? "bg-gradient-to-r from-[#8B84FF] to-[#5D58F8] text-white shadow-md shadow-indigo-500/25"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {net === "erc" ? "ERC-20" : net === "bep" ? "BEP-20" : "TRC-20"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Network Input Form Section */}
              <div className="rounded-2xl border border-white/5 bg-[#141632]/30 p-6 mb-8">
                {activeNetwork === "erc" && (
                  <div>
                    <label className={labelCls}>
                      <Wallet size={16} className="text-[#8B84FF]" />
                      Ethereum (ERC-20) Wallet Address
                    </label>
                    <input
                      name="wallet_address"
                      value={form.wallet_address}
                      onChange={handleChange}
                      placeholder="Enter ERC-20 Address (0x...)"
                      className={inputCls}
                    />
                    <p className="mt-2 text-xs text-white/35">
                      Ensure your wallet address supports the Ethereum (ERC-20) network.
                    </p>
                  </div>
                )}

                {activeNetwork === "bep" && (
                  <div>
                    <label className={labelCls}>
                      <Wallet size={16} className="text-[#8B84FF]" />
                      BNB Chain (BEP-20) Wallet Address
                    </label>
                    <input
                      name="wallet_address_bep"
                      value={form.wallet_address_bep}
                      onChange={handleChange}
                      placeholder="Enter BEP-20 Address (0x...)"
                      className={inputCls}
                    />
                    <p className="mt-2 text-xs text-white/35">
                      Ensure your wallet address supports the Binance Smart Chain (BEP-20) network.
                    </p>
                  </div>
                )}

                {activeNetwork === "trc" && (
                  <div>
                    <label className={labelCls}>
                      <Wallet size={16} className="text-[#8B84FF]" />
                      TRON (TRC-20) Wallet Address
                    </label>
                    <input
                      name="wallet_address_trc"
                      value={form.wallet_address_trc}
                      onChange={handleChange}
                      placeholder="Enter TRC-20 Address (T...)"
                      className={inputCls}
                    />
                    <p className="mt-2 text-xs text-white/35">
                      Ensure your wallet address supports the TRON (TRC-20) network.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Divider */}
              <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Footer */}
              <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Account Information
                  </h3>
                  <p className="mt-1 text-sm text-white/45">
                    Keep your profile information up to date.
                  </p>
                </div>

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 rounded-full bg-white px-8 py-4 font-medium text-[#5D58F8] shadow-[0_20px_45px_rgba(255,255,255,.18)] transition-all hover:shadow-[0_25px_60px_rgba(255,255,255,.25)] disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Update Profile
                </motion.button>
              </div>
            </>
          )}
        </motion.form>
      </div>
    </motion.div>
  );
}