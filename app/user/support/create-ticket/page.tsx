"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TicketPlus,
  Tag,
  FileText,
  MessageSquareText,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

const TICKET_TYPES = [
  { value: "deposit", label: "Deposit" },
  { value: "withdraw", label: "Withdrawal" },
  { value: "account", label: "Account" },
  { value: "technical", label: "Technical Support" },
  { value: "package", label: "Package / Investment" },
  { value: "other", label: "Other" },
];

export default function CreateTicketPage() {
  const router = useRouter();

  const [form, setForm] = useState({ type: "", subject: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.type) {
      setError("Please select a ticket type.");
      return;
    }
    if (!form.subject.trim()) {
      setError("Subject is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/tickets/create", form);
      if (res.data?.status) {
        setCreatedId(res.data.ticket?.ticket_id ?? null);
        setSuccess(true);
      } else {
        setError(res.data?.message || "Failed to create ticket. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Success Screen ─────────────────────────── */
  if (success) {
    return (
      <div className="relative min-h-full overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#8B84FF]/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#5D58F8]/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-md rounded-[34px] border border-white/10 bg-white/5 p-10 text-center shadow-[0_35px_90px_rgba(0,0,0,.45)] backdrop-blur-3xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8B84FF] to-[#5D58F8] shadow-[0_20px_45px_rgba(139,132,255,.35)]">
              <CheckCircle2 size={36} className="text-white" />
            </div>

            <h2 className="mt-6 text-2xl font-light text-white">
              Ticket Submitted!
            </h2>
            <p className="mt-2 text-sm text-white/45">
              Our support team will review and respond shortly.
            </p>

            {createdId && (
              <div className="mt-5 inline-block rounded-2xl border border-[#8B84FF]/30 bg-[#8B84FF]/10 px-5 py-2 font-mono text-sm text-[#C4C0FF]">
                #{createdId}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3">
              {createdId && (
                <button
                  onClick={() =>
                    router.push(`/user/support/tickets/${createdId}`)
                  }
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white font-medium text-[#5D58F8] shadow-[0_20px_45px_rgba(255,255,255,.12)] transition hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(255,255,255,.2)] active:scale-[0.98]"
                >
                  View Ticket
                </button>
              )}
              <Link
                href="/user/support/tickets"
                className="flex h-12 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10"
              >
                Back to Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ─────────────────────────────────────── */
  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#8B84FF]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#5D58F8]/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-white">
            Create Ticket
          </h1>
          <p className="mt-2 text-white/50">
            Submit a support request and our team will get back to you.
          </p>
        </div>

        {/* Card */}
        <div className="mx-auto max-w-2xl rounded-[34px] border border-white/10 bg-white/5 p-8 shadow-[0_35px_90px_rgba(0,0,0,.45)] backdrop-blur-3xl">
          {/* Icon */}
          <div className="mb-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8B84FF] to-[#5D58F8] shadow-[0_20px_45px_rgba(139,132,255,.35)]">
              <TicketPlus size={36} className="text-white" />
            </div>
            <h2 className="mt-6 text-2xl font-light text-white">
              New Support Ticket
            </h2>
            <p className="mt-2 text-sm text-white/45">
              Fill in the details below to create a support ticket.
            </p>
          </div>

          <div className="space-y-6">
            {/* Type */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <Tag size={16} className="text-[#8B84FF]" />
                Type <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Tag
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 pl-12 pr-14 text-white outline-none transition-all focus:border-[#8B84FF] focus:bg-white/10"
                >
                  <option value="" className="bg-[#111827]">
                    Select Ticket Type
                  </option>
                  {TICKET_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-[#111827]">
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/40"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <FileText size={16} className="text-[#8B84FF]" />
                Subject <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-5 top-5 text-white/40"
                />
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  maxLength={150}
                  placeholder="Enter ticket subject"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-5 text-white placeholder:text-white/25 outline-none transition-all focus:border-[#8B84FF] focus:bg-white/10"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm text-white/60">
                <MessageSquareText size={16} className="text-[#8B84FF]" />
                Description <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MessageSquareText
                  size={18}
                  className="absolute left-5 top-5 text-white/40"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe your issue in detail..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 text-white placeholder:text-white/25 outline-none transition-all focus:border-[#8B84FF] focus:bg-white/10"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                {error}
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white font-medium text-[#5D58F8] shadow-[0_20px_45px_rgba(255,255,255,.15)] transition-all hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(255,255,255,.25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <TicketPlus size={18} />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}