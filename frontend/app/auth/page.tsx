"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="aurora-background" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="glass-elevated max-w-[420px] w-full p-[48px_40px] text-center relative z-10"
      >
        <div className="mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h1 className="font-sora font-semibold text-2xl mb-3">JobGuard</h1>
        <div className="h-px bg-white/[0.08] my-5" />
        <h2 className="font-sora font-semibold text-[22px] mb-2">Sign in to continue</h2>
        <p className="text-[15px] text-white/[0.45] mb-8">
          Save your analysis history and track results over time.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="glass-elevated flex items-center justify-center gap-3 h-[54px] rounded-full w-full hover:bg-white/[0.15] transition-colors cursor-pointer"
        >
          <div className="w-[26px] h-[26px] bg-white rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>
          <span className="text-white font-medium">Continue with Google</span>
        </button>

        <p className="text-xs text-white/[0.30] mt-6">
          By continuing you agree to our Terms and Privacy Policy
        </p>

        <Link href="/" className="block mt-6 text-[13px] text-[#6366f1] hover:underline">
          ← Back to home
        </Link>
      </motion.div>
    </main>
  );
}
