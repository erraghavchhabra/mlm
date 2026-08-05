"use client";

import { use } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

interface Params {
  position: string;
  ucode: string;
}

export default function DynamicRegisterPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = use(params);
  const positionRaw = resolvedParams?.position?.toLowerCase() || "";
  const initialPosition = positionRaw === "right" || positionRaw === "r" ? "R" : "L";
  const initialSponsor = resolvedParams?.ucode || "";

  return (
    <AuthLayout
      title="Create Account"
      subtitle={`Referral Link: Sponsor ${initialSponsor} (${initialPosition === "L" ? "Left" : "Right"} Position)`}
    >
      <RegisterForm initialSponsor={initialSponsor} initialPosition={initialPosition} isLocked={true} />
    </AuthLayout>
  );
}
