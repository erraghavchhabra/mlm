"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import AuthInput from "./AuthInput";
import api from "@/lib/api";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

// Laravel Password::sendResetLink success statuses
const SUCCESS_STATUSES = [
  "passwords.sent",
  "sent",
  "we have emailed your password reset link",
];

// Laravel throttle / user-not-found statuses (errors)
const ERROR_STATUSES = [
  "passwords.throttled",
  "passwords.user",
  "throttled",
];

function isSuccessMessage(msg: string) {
  const lower = msg.toLowerCase();
  return SUCCESS_STATUSES.some((s) => lower.includes(s));
}

function isThrottledMessage(msg: string) {
  const lower = msg.toLowerCase();
  return lower.includes("throttl") || lower.includes("too many");
}

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    try {
      const res = await api.post("/forgot-password", { email: data.email });

      const msg: string = res.data?.message || "";

      if (isSuccessMessage(msg)) {
        setSentEmail(data.email);
        setSuccess(true);
      } else if (isThrottledMessage(msg)) {
        setServerError("Too many attempts. Please wait a moment before trying again.");
      } else if (msg) {
        setServerError(msg);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const msg: string = err.response?.data?.message || "";

        if (status === 422) {
          // Validation errors from Laravel
          const validationErrors = err.response?.data?.errors;
          const firstError = validationErrors
            ? (Object.values(validationErrors)[0] as string[])[0]
            : "Validation failed.";
          setServerError(firstError);
        } else if (status === 429 || isThrottledMessage(msg)) {
          setServerError("Too many attempts. Please wait a moment before trying again.");
        } else if (msg) {
          setServerError(msg);
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      } else {
        setServerError("Network error. Please check your connection and try again.");
      }
    }
  };

  // ── Success State ──────────────────────────────────────────────
  if (success) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30"
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          </motion.div>

          <div>
            <h3 className="text-2xl font-semibold text-white">Check your inbox</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              We've sent a password reset link to{" "}
              <span className="text-white font-medium">{sentEmail}</span>.
              <br />
              Check your inbox and follow the instructions.
            </p>
          </div>

          <div className="rounded-2xl border border-[#2B3164] bg-[#101226]/70 p-4 text-left">
            <p className="text-xs text-slate-400 leading-relaxed">
              💡 <strong className="text-slate-300">Didn't receive it?</strong> Check your spam
              folder, or{" "}
              <button
                onClick={() => {
                  setSuccess(false);
                  setServerError(null);
                }}
                className="text-[#8B7DFF] underline underline-offset-2 hover:text-white transition-colors"
              >
                try a different email
              </button>
              .
            </p>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Form State ─────────────────────────────────────────────────
  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Info banner */}
      <div className="rounded-2xl border border-[#2B3164] bg-[#101226]/70 p-4">
        <p className="text-sm leading-7 text-slate-400">
          Enter the email address associated with your account and we'll send
          you a password reset link.
        </p>
      </div>

      {/* Server error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthInput
        label="Email Address"
        icon={Mail}
        type="email"
        placeholder="Enter your email"
        value={watch("email")}
        onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })}
        error={errors.email?.message}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          group flex h-14 w-full items-center justify-center gap-3
          rounded-2xl bg-gradient-to-r from-[#6E57FF] to-[#8B7DFF]
          font-medium text-white transition-all duration-300
          hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6E57FF]/30
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Reset Link
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </>
        )}
      </button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>
    </motion.form>
  );
}