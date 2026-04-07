"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getResults, deleteResult } from "@/lib/api";
import type { AnalysisRecord } from "@/lib/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<AnalysisRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      getResults(page, 12)
        .then(({ results: r, total: t }) => {
          setResults(r);
          setTotal(t);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status, page]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="aurora-background" />
        <div className="w-12 h-12 border-2 border-white/20 border-t-[#6366f1] rounded-full animate-spin relative z-10" />
      </main>
    );
  }

  const fakeCount = results.filter((r) => r.verdict === "FAKE").length;
  const realCount = results.filter((r) => r.verdict === "REAL").length;
  const avgProb = results.length ? (results.reduce((sum, r) => sum + r.fraud_probability, 0) / results.length * 100).toFixed(1) : "0";

  const handleDelete = async (id: string) => {
    if (confirm("Delete this analysis?")) {
      await deleteResult(id);
      setResults((prev) => prev.filter((r) => r.id !== id));
      setTotal((t) => t - 1);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <div className="aurora-background" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24">
        <div className="flex items-center gap-4 mb-8">
          {session?.user?.image && (
            <img src={session.user.image} alt="" className="w-12 h-12 rounded-full border-2 border-white/10" />
          )}
          <div>
            <h1 className="font-sora text-[28px] font-semibold">
              Welcome back, {session?.user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-white/[0.45] text-sm">{total} analyse{total !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Analyses", value: total },
            { label: "Flagged Fake", value: fakeCount },
            { label: "Cleared Legitimate", value: realCount },
            { label: "Avg Probability %", value: avgProb },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 text-center"
            >
              <div className="font-mono text-4xl font-medium mb-2">{stat.value}</div>
              <div className="text-[11px] text-white/[0.38] uppercase tracking-[0.10em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* History */}
        {results.length === 0 ? (
          <div className="glass p-16 text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="mx-auto mb-6">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 15h8M9 9h.01M15 9h.01" />
            </svg>
            <h3 className="font-sora text-xl font-semibold mb-2">No analyses yet</h3>
            <p className="text-white/40 mb-6">Start by analyzing your first job posting.</p>
            <Link href="/check" className="btn-primary">Check Your First Job →</Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((r, i) => {
                const verdictColor = r.verdict === "REAL" ? "#10b981" : r.verdict === "FAKE" ? "#f43f5e" : "#f59e0b";
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass p-6 hover:bg-white/[0.09] transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${verdictColor}20`, color: verdictColor }}
                      >
                        {r.verdict}
                      </span>
                      <span className="text-xs text-white/30">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-sora font-semibold text-lg mb-1">{r.job_title}</h3>
                    <p className="text-white/40 text-sm mb-3">{r.company_name}</p>
                    <div className="font-mono text-sm text-white/60 mb-4">
                      {Math.round(r.fraud_probability * 100)}% fraud probability
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/result/${r.id}`} className="text-sm text-[#6366f1] hover:underline">View →</Link>
                      <button onClick={() => handleDelete(r.id)} className="text-sm text-white/30 hover:text-[#f43f5e]">Delete</button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {results.length < total && (
              <div className="text-center mt-8">
                <button onClick={() => setPage((p) => p + 1)} className="btn-ghost">
                  Load more · Showing {results.length} of {total}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
