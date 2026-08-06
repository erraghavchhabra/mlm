"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Please enter your credentials to continue."
    >
      <LoginForm />
    </AuthLayout>
  );
}