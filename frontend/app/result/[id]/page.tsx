"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getResultById } from "@/lib/api";
import type { AnalysisRecord } from "@/lib/types";
import ResultView from "@/components/result/ResultView";

export default function ResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<AnalysisRecord | null>(null);
  const [error, setError] = useState("");
  const [shapExpanded, setShapExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    getResultById(id)
      .then(setResult)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="aurora-background" />
        <div className="glass p-12 text-center relative z-10">
          <h1 className="font-sora text-2xl font-semibold mb-4">Error</h1>
          <p className="text-white/60">{error}</p>
          <Link href="/check" className="btn-primary mt-6 inline-block">← Try Another</Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="aurora-background" />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 mx-auto border-2 border-white/20 border-t-[#6366f1] rounded-full animate-spin" />
          <p className="mt-4 text-white/50 font-mono text-sm">Loading result...</p>
        </div>
      </main>
    );
  }

  return (
    <ResultView
      result={result}
      copied={copied}
      setCopied={setCopied}
      shapExpanded={shapExpanded}
      setShapExpanded={setShapExpanded}
      detailsExpanded={detailsExpanded}
      setDetailsExpanded={setDetailsExpanded}
    />
  );
}
