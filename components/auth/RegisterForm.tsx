"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Globe,
  UserCheck,
  Compass,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import api from "@/lib/api";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must be at most 15 characters")
      .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric (letters and numbers only)"),
    full_name: z.string().min(2, "Full name is required").max(255),
    email: z.string().email("Enter a valid email address"),
    mobile: z.string().min(8, "Enter a valid mobile number"),
    country: z.string().min(1, "Country is required"),
    sponsor: z.string().min(1, "Sponsor code is required"),
    position: z.enum(["L", "R"]),
    password: z.string().min(6, "Minimum 6 characters required"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

interface RegisterFormProps {
  initialSponsor?: string;
  initialPosition?: "L" | "R";
  isLocked?: boolean;
}

export default function RegisterForm({
  initialSponsor = "",
  initialPosition = "L",
  isLocked = false,
}: RegisterFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      mobile: "",
      country: "India",
      sponsor: initialSponsor,
      position: initialPosition,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (initialSponsor) {
      setValue("sponsor", initialSponsor);
    }
    if (initialPosition) {
      setValue("position", initialPosition);
    }
  }, [initialSponsor, initialPosition, setValue]);

  const currentPosition = watch("position");

  const onSubmit = async (data: FormData) => {
    setServerError(null);

    try {
      const res = await api.post("/register", {
        username: data.username,
        full_name: data.full_name,
        email: data.email,
        mobile: data.mobile,
        country: data.country,
        sponsor: data.sponsor,
        position: data.position,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      const { status, message, token, user } = res.data;

      if (!status) {
        setServerError(message || "Registration failed");
        return;
      }

      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      router.push("/user/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400 || err.response?.status === 500) {
          setServerError(err.response.data?.message || "Registration error occurred.");
        } else if (err.response?.status === 422) {
          const validationErrors = err.response.data?.errors;
          if (validationErrors) {
            const firstKey = Object.keys(validationErrors)[0];
            const firstMsg = validationErrors[firstKey][0];
            setServerError(`${firstKey.toUpperCase()}: ${firstMsg}`);
          } else {
            setServerError(err.response.data?.message || "Validation failed.");
          }
        } else {
          setServerError(
            err.response?.data?.message || "Something went wrong. Please try again."
          );
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
      className="group relative rounded-3xl bg-[#0b0e26]/60 border border-[#2d356b]/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden max-w-2xl mx-auto"
    >
      {/* Inner Radial Glow on Hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6E5CFF]/20 rounded-full blur-3xl group-hover:bg-[#6E5CFF]/40 transition-colors duration-500 pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="text-center space-y-3 mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6E5CFF]/30 bg-[#6E5CFF]/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#8B94FF]" />
          <span className="font-mono text-xs font-medium text-[#D1D5FF] tracking-wider uppercase">
            Protocol Onboarding
          </span>
        </div>

        <h2 className="font-tech text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Create Account
        </h2>

        <p className="font-sans text-xs sm:text-sm text-[#A6ABC9]">
          Register your identity to join the autonomous node network.
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

        {/* 1. Sponsor Code */}
        <div className="space-y-2">
          <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
            {isLocked ? "Sponsor Code (ucode - Locked)" : "Sponsor Code (ucode)"} <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A608F]" />
            <input
              {...register("sponsor")}
              type="text"
              readOnly={isLocked}
              disabled={isLocked}
              placeholder="e.g. QB100001"
              className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm ${
                isLocked ? "opacity-70 cursor-not-allowed bg-[#12163b]/40" : ""
              }`}
            />
          </div>
          {errors.sponsor && (
            <p className="font-mono text-[10px] text-red-400 mt-1">{errors.sponsor.message}</p>
          )}
        </div>

        {/* 2. Position Selection */}
        <div className="space-y-2">
          <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
            Placement Position {isLocked && <span className="text-[10px] text-[#8B94FF] lowercase font-normal">(Locked by Referral)</span>} <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isLocked}
              onClick={() => !isLocked && setValue("position", "L")}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all ${
                currentPosition === "L"
                  ? "border-[#6E5CFF] bg-[#6E5CFF]/20 text-white shadow-[0_0_15px_rgba(110,92,255,0.25)] font-bold"
                  : "border-[#2d356b] bg-[#12163b]/70 text-[#A6ABC9] hover:border-[#6E5CFF]/50 hover:text-white"
              } ${isLocked ? "cursor-not-allowed opacity-80" : ""}`}
            >
              <Compass className="h-4 w-4 text-[#8B94FF]" />
              Left Position (L)
            </button>

            <button
              type="button"
              disabled={isLocked}
              onClick={() => !isLocked && setValue("position", "R")}
              className={`flex h-12 items-center justify-center gap-2 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all ${
                currentPosition === "R"
                  ? "border-[#6E5CFF] bg-[#6E5CFF]/20 text-white shadow-[0_0_15px_rgba(110,92,255,0.25)] font-bold"
                  : "border-[#2d356b] bg-[#12163b]/70 text-[#A6ABC9] hover:border-[#6E5CFF]/50 hover:text-white"
              } ${isLocked ? "cursor-not-allowed opacity-80" : ""}`}
            >
              <Compass className="h-4 w-4 text-[#8B94FF]" />
              Right Position (R)
            </button>
          </div>
          {errors.position && (
            <p className="font-mono text-[10px] text-red-400 mt-1">{errors.position.message}</p>
          )}
        </div>

        {/* 3. Grid for Username & Full Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
              Username <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A608F]" />
              <input
                {...register("username")}
                type="text"
                placeholder="satoshi123"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
              />
            </div>
            {errors.username && (
              <p className="font-mono text-[10px] text-red-400 mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A608F]" />
              <input
                {...register("full_name")}
                type="text"
                placeholder="Satoshi Nakamoto"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
              />
            </div>
            {errors.full_name && (
              <p className="font-mono text-[10px] text-red-400 mt-1">{errors.full_name.message}</p>
            )}
          </div>
        </div>

        {/* 4. Grid for Email & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A608F]" />
              <input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
              />
            </div>
            {errors.email && (
              <p className="font-mono text-[10px] text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A608F]" />
              <input
                {...register("mobile")}
                type="tel"
                placeholder="+91 9876543210"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
              />
            </div>
            {errors.mobile && (
              <p className="font-mono text-[10px] text-red-400 mt-1">{errors.mobile.message}</p>
            )}
          </div>
        </div>

        {/* 5. Country */}
        <div className="space-y-2">
          <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
            Country <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A608F]" />
            <input
              {...register("country")}
              type="text"
              placeholder="Enter your country"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
            />
          </div>
          {errors.country && (
            <p className="font-mono text-[10px] text-red-400 mt-1">{errors.country.message}</p>
          )}
        </div>

        {/* 6. Grid for Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
              Password <span className="text-red-400">*</span>
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
              <p className="font-mono text-[10px] text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-wider text-[#D1D5FF]">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A608F]" />
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#12163b]/70 border border-[#2d356b] text-white placeholder-[#5A608F] focus:outline-none focus:border-[#6E5CFF] focus:ring-1 focus:ring-[#6E5CFF] transition-all font-sans text-sm"
              />
            </div>
            {errors.confirmPassword && (
              <p className="font-mono text-[10px] text-red-400 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#5D72FF] to-[#6E5CFF] text-white font-mono text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(110,92,255,0.4)] hover:shadow-[0_0_30px_rgba(110,92,255,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 group/btn"
        >
          {isSubmitting ? (
            <span>Registering Account...</span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Sign In Link */}
        <p className="pt-2 text-center font-sans text-xs text-[#A6ABC9]">
          Already have an account?
          <Link
            href="/login"
            className="ml-2 font-mono font-medium text-[#8B94FF] hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </p>
      </form>
    </motion.div>
  );
}