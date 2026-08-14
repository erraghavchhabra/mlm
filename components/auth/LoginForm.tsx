"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import api from "@/lib/api";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    try {
      const res = await api.post("/login", {
        email: data.email,
        password: data.password,
      });

      const { status, message, token, user } = res.data;

      if (!status) {
        setServerError(message || "Login failed");
        return;
      }

      // Store token for future authenticated requests
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to dashboard
      router.push("/user/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setServerError(err.response.data.message);
        } else if (err.response?.status === 401) {
          setServerError("Invalid credentials");
        } else if (err.response?.status === 422) {
          const validationErrors = err.response.data?.errors;
          const firstError = validationErrors
            ? (Object.values(validationErrors)[0] as string[])[0]
            : "Validation failed";
          setServerError(firstError);
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      } else {
        setServerError("Network error. Please try again.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-3xl bg-[#0b0e26]/60 border border-[#2d356b]/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden max-w-lg mx-auto"
    >
      {/* Inner Radial Glow on Hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6E5CFF]/20 rounded-full blur-3xl group-hover:bg-[#6E5CFF]/40 transition-colors duration-500 pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="text-center space-y-3 mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#8B94FF]" />
          <span className="font-mono text-xs font-medium text-[#D1D5FF] tracking-wider uppercase">
          Sign In
          </span>
        </div>

        <h2 className="font-tech text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Welcome Back
        </h2>

        <p className="font-sans text-xs sm:text-sm text-[#A6ABC9]">
          Authenticate to access your active neural trading protocols.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        {/* Error Alert */}
        {serverError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A608F]" />
            <input
              {...register("email")}
              type="email"
              placeholder="satoshi@network.org"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
            />
          </div>
          {errors.email && (
            <p className="font-mono text-[10px] text-red-400 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A608F]" />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
            />
          </div>
          {errors.password && (
            <p className="font-mono text-[10px] text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between font-sans text-xs">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#2d356b] bg-[#12163b] text-[#6E5CFF] focus:ring-[#6E5CFF]"
            />
            <span className="text-[#A6ABC9]">Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-[#8B94FF] hover:text-white font-mono transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5D72FF] to-[#6E5CFF] text-white font-mono text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(110,92,255,0.4)] hover:shadow-[0_0_30px_rgba(110,92,255,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 group/btn"
        >
          {isSubmitting ? (
            <span>Signing In...</span>
          ) : (
            <>
              <span>Authorize Login</span>
              <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2d356b]/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0b0e26] px-3 font-mono text-[10px] text-[#A6ABC9]">
              or continue with
            </span>
          </div>
        </div>

        {/* Google Authentication */}
        <button
          type="button"
          className="w-full py-3 rounded-xl border border-[#2d356b] bg-[#12163b]/50 text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-[#6E5CFF] hover:bg-[#12163b] flex items-center justify-center gap-3"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="h-4 w-4"
            alt="Google Logo"
          />
          <span>Google SSO</span>
        </button>

        {/* Register Redirect */}
        <div className="pt-2 text-center font-sans text-xs">
          <span className="text-[#A6ABC9]">Don't have an account?</span>
          <Link
            href="/register"
            className="ml-2 font-mono font-medium text-[#8B94FF] hover:text-white transition-colors"
          >
            Create Account
          </Link>
        </div>
      </form>
    </motion.div>
  );
}