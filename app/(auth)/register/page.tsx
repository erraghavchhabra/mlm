"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

function RegisterContent() {
  const searchParams = useSearchParams();
  const sponsor = searchParams.get("sponsor") || searchParams.get("ucode") || searchParams.get("rcode") || "";
  const posParam = searchParams.get("position") || searchParams.get("pos") || "";
  const position = posParam.toUpperCase() === "R" || posParam.toLowerCase() === "right" ? "R" : "L";

  return (
    <AuthLayout
      title="Create Account"
      subtitle={sponsor ? `Sponsor: ${sponsor} (${position === "L" ? "Left" : "Right"})` : "Join us today and start managing your account."}
    >
      <RegisterForm initialSponsor={sponsor} initialPosition={position} isLocked={!!sponsor} />
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading registration form...</div>}>
      <RegisterContent />
    </Suspense>
  );
}