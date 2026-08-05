"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import AuthInput from "./AuthInput";
import api from "@/lib/api";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

// Laravel Password::reset success statuses
const SUCCESS_STATUSES = [
  "passwords.reset",
  "your password has been reset",
  "password has been reset",
  "reset successfully",
];

function isSuccessMessage(msg: string) {
  const lower = msg.toLowerCase();
  return SUCCESS_STATUSES.some((s) => lower.includes(s));
}

function extractFirstValidationError(errors: Record<string, string[]>): string {
  const first = Object.values(errors)[0];
  return Array.isArray(first) ? first[0] : "Validation failed.";
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    if (!token || !email) {
      setServerError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    try {
      const res = await api.post("/reset-password", {
        email,
        token,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      const msg: string = res.data?.message || "";

      if (isSuccessMessage(msg)) {
        setSuccess(true);
        // Redirect to login after 2.5s
        setTimeout(() => router.push("/login"), 2500);
      } else if (msg) {
        // Could be "passwords.token" (invalid/expired token) or similar
        setServerError(
          msg.includes("passwords.token")
            ? "This reset link has expired or is invalid. Please request a new one."
            : msg
        );
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;

        if (status === 422 && data?.errors) {
          setServerError(extractFirstValidationError(data.errors));
        } else if (status === 422 && data?.message) {
          setServerError(data.message);
        } else if (status === 429) {
          setServerError("Too many attempts. Please wait and try again.");
        } else {
          const msg: string = data?.message || "";
          setServerError(
            msg.includes("passwords.token")
              ? "This reset link has expired or is invalid. Please request a new one."
              : msg || "Something went wrong. Please try again."
          );
        }
      } else {
        setServerError("Network error. Please check your connection and try again.");
      }
    }
  };

  // ── Success state ──────────────────────────────────────────────
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30"
        >
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
        </motion.div>

        <div>
          <h3 className="text-2xl font-semibold text-white">Password Reset!</h3>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Your password has been updated successfully.
            <br />
            Redirecting you to login…
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#2B3164]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#6E57FF] to-emerald-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "linear" }}
          />
        </div>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Go to Login now
        </Link>
      </motion.div>
    );
  }

  // ── Invalid link warning ────────────────────────────────────────
  const isLinkInvalid = !token || !email;

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Invalid link banner */}
      {isLinkInvalid && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Invalid or expired reset link. Please{" "}
            <Link href="/forgot-password" className="underline underline-offset-2 hover:text-amber-300 transition-colors">
              request a new one
            </Link>
            .
          </span>
        </div>
      )}

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
            {serverError.toLowerCase().includes("expired") && (
              <span>
                {" "}
                <Link
                  href="/forgot-password"
                  className="ml-1 underline underline-offset-2 hover:text-red-300 transition-colors"
                >
                  Request a new link →
                </Link>
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthInput
        label="New Password"
        icon={Lock}
        type="password"
        placeholder="Enter new password (min 6 chars)"
        value={watch("password")}
        onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })}
        error={errors.password?.message}
        disabled={isLinkInvalid}
      />

      <AuthInput
        label="Confirm Password"
        icon={Lock}
        type="password"
        placeholder="Re-enter your new password"
        value={watch("confirmPassword")}
        onChange={(e) => setValue("confirmPassword", e.target.value, { shouldValidate: true })}
        error={errors.confirmPassword?.message}
        disabled={isLinkInvalid}
      />

      <button
        type="submit"
        disabled={isSubmitting || isLinkInvalid}
        className="
          group flex h-14 w-full items-center justify-center gap-3
          rounded-2xl bg-gradient-to-r from-[#6E57FF] to-[#8B7DFF]
          font-medium text-white shadow-xl shadow-[#6E57FF]/20
          transition-all duration-300
          hover:-translate-y-1 hover:shadow-[#6E57FF]/40
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Resetting…
          </>
        ) : (
          <>
            Reset Password
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
