"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Don't worry! It happens. We'll help you reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}