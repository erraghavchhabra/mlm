"use client";

import { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface AuthInputProps {
  label: string;
  type?: string;
  icon: LucideIcon;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

export default function AuthInput({
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  placeholder,
  error,
  required,
  readOnly,
  disabled,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium tracking-wide text-slate-300 block pb-1">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      <div className="group relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-[#6E57FF]/0 blur-xl transition-all duration-300 group-focus-within:bg-[#6E57FF]/20" />

        <div
          className={`relative flex h-14 items-center rounded-2xl border transition-all duration-300 ${
            readOnly || disabled ? "bg-[#181938] border-[#2B3164]/70 opacity-90 cursor-not-allowed" : "bg-[#101226]/90"
          } ${
            error
              ? "border-red-500"
              : "border-[#2B3164] focus-within:border-[#6E57FF]"
          }`}
        >
          {/* Left Icon */}
          <div className="flex h-full w-14 items-center justify-center">
            <Icon className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-[#6E57FF]" />
          </div>

          {/* Input */}
          <input
            type={isPassword && showPassword ? "text" : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            className={`h-full w-full bg-transparent pr-12 text-white outline-none placeholder:text-slate-500 ${
              readOnly || disabled ? "cursor-not-allowed opacity-90" : ""
            }`}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 transition hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}