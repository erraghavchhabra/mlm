"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import AuthInput from "./AuthInput";
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
    watch,
    setValue,
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

      // Redirect to dashboard (adjust as needed)
      router.push("/user/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setServerError(err.response.data?.message || "Invalid credentials");
        } else if (err.response?.status === 422) {
          // Laravel validation errors
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
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {serverError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      {/* Email */}
      <AuthInput
        label="Email Address"
        icon={Mail}
        type="email"
        placeholder="Enter your email"
        value={watch("email")}
        onChange={(e) => setValue("email", e.target.value)}
        error={errors.email?.message}
      />

      {/* Password */}
      <AuthInput
        label="Password"
        icon={Lock}
        type="password"
        placeholder="Enter your password"
        value={watch("password")}
        onChange={(e) => setValue("password", e.target.value)}
        error={errors.password?.message}
      />

      {/* Remember */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#2B3164] bg-[#171734] text-[#6E57FF] focus:ring-[#6E57FF]"
          />
          <span className="text-sm text-slate-400">Remember me</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-sm text-[#8B7DFF] transition hover:text-white"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#6E57FF] to-[#8B7DFF] text-white font-medium shadow-xl shadow-[#6E57FF]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[#6E57FF]/60 disabled:opacity-60"
      >
        {isSubmitting ? (
          "Signing In..."
        ) : (
          <>
            Login
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2B3164]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#171734] px-4 text-sm text-slate-500">or continue with</span>
        </div>
      </div>

      {/* Google */}
      <button
        type="button"
        className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#2B3164] bg-[#101226] text-white transition-all duration-300 hover:border-[#6E57FF] hover:bg-[#171734]"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="h-5 w-5"
          alt=""
        />
        Continue with Google
      </button>

      {/* Register */}
      <div className="pt-2 text-center">
        <span className="text-slate-400">Don't have an account?</span>
        <Link href="/register" className="ml-2 font-medium text-[#8B7DFF] hover:text-white">
          Create Account
        </Link>
      </div>
    </motion.form>
  );
}