import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";
import { SiteBackground } from "@/components/site-background";
import { BrandMark } from "@/components/brand-mark";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center px-4">
      <SiteBackground variant="admin" />
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <BrandMark href="/" />
        <h1 className="mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Reset Your Password
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        <ForgotPasswordForm />
        <Link
          href="/admin/login"
          className="mt-6 block text-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
