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
} from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import AuthInput from "./AuthInput";
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
    watch,
    setValue,
    handleSubmit,
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
      // Send payload matching Laravel register(Request $request) controller
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
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {serverError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      {/* Sponsor Code */}
      <AuthInput
        label={isLocked ? "Sponsor Code (ucode - Locked)" : "Sponsor Code (ucode)"}
        icon={UserCheck}
        value={watch("sponsor")}
        onChange={(e) => !isLocked && setValue("sponsor", e.target.value)}
        error={errors.sponsor?.message}
        placeholder="Enter sponsor code (e.g. QB100001)"
        readOnly={isLocked}
        disabled={isLocked}
        required
      />

      {/* Position Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium tracking-wide text-slate-300">
          Placement Position {isLocked && <span className="text-xs text-[#8D98FF] font-normal">(Locked by Referral Link)</span>} <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isLocked}
            onClick={() => !isLocked && setValue("position", "L")}
            className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all ${
              currentPosition === "L"
                ? "border-[#6E57FF] bg-[#6E57FF]/25 text-white shadow-lg"
                : "border-[#2B3164] bg-[#101226] text-slate-400 hover:border-slate-500"
            } ${isLocked ? "cursor-not-allowed opacity-80" : ""}`}
          >
            <Compass className="h-4 w-4" />
            Left Position (L)
          </button>

          <button
            type="button"
            disabled={isLocked}
            onClick={() => !isLocked && setValue("position", "R")}
            className={`flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-all ${
              currentPosition === "R"
                ? "border-[#6E57FF] bg-[#6E57FF]/25 text-white shadow-lg"
                : "border-[#2B3164] bg-[#101226] text-slate-400 hover:border-slate-500"
            } ${isLocked ? "cursor-not-allowed opacity-80" : ""}`}
          >
            <Compass className="h-4 w-4" />
            Right Position (R)
          </button>
        </div>
        {errors.position && (
          <p className="text-xs text-red-400">{errors.position.message}</p>
        )}
      </div>

      {/* Username */}
      <AuthInput
        label="Username"
        icon={User}
        value={watch("username")}
        onChange={(e) => setValue("username", e.target.value)}
        error={errors.username?.message}
        placeholder="Enter username (max 15 chars)"
        required
      />

      {/* Full Name */}
      <AuthInput
        label="Full Name"
        icon={User}
        value={watch("full_name")}
        onChange={(e) => setValue("full_name", e.target.value)}
        error={errors.full_name?.message}
        placeholder="Enter full name"
        required
      />

      {/* Email Address */}
      <AuthInput
        label="Email Address"
        icon={Mail}
        type="email"
        value={watch("email")}
        onChange={(e) => setValue("email", e.target.value)}
        error={errors.email?.message}
        placeholder="name@example.com"
        required
      />

      {/* Mobile Number */}
      <AuthInput
        label="Mobile Number"
        icon={Phone}
        type="tel"
        value={watch("mobile")}
        onChange={(e) => setValue("mobile", e.target.value)}
        error={errors.mobile?.message}
        placeholder="+91 9876543210"
        required
      />

      {/* Country */}
      <AuthInput
        label="Country"
        icon={Globe}
        value={watch("country")}
        onChange={(e) => setValue("country", e.target.value)}
        error={errors.country?.message}
        placeholder="Enter your country"
        required
      />

      {/* Password */}
      <AuthInput
        label="Password"
        icon={Lock}
        type="password"
        value={watch("password")}
        onChange={(e) => setValue("password", e.target.value)}
        error={errors.password?.message}
        placeholder="Create password (min 6 chars)"
        required
      />

      {/* Confirm Password */}
      <AuthInput
        label="Confirm Password"
        icon={Lock}
        type="password"
        value={watch("confirmPassword")}
        onChange={(e) => setValue("confirmPassword", e.target.value)}
        error={errors.confirmPassword?.message}
        placeholder="Confirm password"
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="
        group
        mt-2
        flex
        h-14
        w-full
        items-center
        justify-center
        gap-3
        rounded-2xl
        bg-gradient-to-r
        from-[#6E57FF]
        to-[#8B7DFF]
        font-medium
        text-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        hover:shadow-[#6E57FF]/40
        disabled:opacity-60
      "
      >
        {isSubmitting ? (
          "Registering Account..."
        ) : (
          <>
            Create Account
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="pt-2 text-center text-sm text-slate-400">
        Already have an account?
        <Link
          href="/login"
          className="ml-2 font-medium text-[#8B7DFF] hover:text-white"
        >
          Sign In
        </Link>
      </p>
    </motion.form>
  );
}