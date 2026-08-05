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

                {/* Wallet Address (ERC-20 / default) */}
                <div>
                  <label className={labelCls}>
                    <Wallet size={16} className="text-[#8B84FF]" />
                    Wallet Address (ERC-20)
                  </label>
                  <input
                    name="wallet_address"
                    value={form.wallet_address}
                    onChange={handleChange}
                    placeholder="ERC-20 Wallet Address"
                    className={inputCls}
                  />
                </div>

                {/* Wallet Address BEP-20 */}
                <div>
                  <label className={labelCls}>
                    <Wallet size={16} className="text-[#8B84FF]" />
                    Wallet Address (BEP-20)
                  </label>
                  <input
                    name="wallet_address_bep"
                    value={form.wallet_address_bep}
                    onChange={handleChange}
                    placeholder="BEP-20 Wallet Address"
                    className={inputCls}
                  />
                </div>

                {/* Wallet Address TRC-20 */}
                <div>
                  <label className={labelCls}>
                    <Wallet size={16} className="text-[#8B84FF]" />
                    Wallet Address (TRC-20)
                  </label>
                  <input
                    name="wallet_address_trc"
                    value={form.wallet_address_trc}
                    onChange={handleChange}
                    placeholder="TRC-20 Wallet Address"
                    className={inputCls}
                  />
                </div>

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