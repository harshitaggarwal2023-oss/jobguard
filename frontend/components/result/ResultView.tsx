"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { AnalysisRecord } from "@/lib/types";
import { lookupFeatureName } from "@/lib/types";

function CountUp({ target, className, style }: { target: number; className?: string; style?: React.CSSProperties }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <span className={className} style={style}>{value}</span>;
}

export default function ResultView({
  result,
  showDemoBanner = false,
  copied, setCopied,
  shapExpanded, setShapExpanded,
  detailsExpanded, setDetailsExpanded,
}: {
  result: AnalysisRecord;
  showDemoBanner?: boolean;
  copied: boolean;
  setCopied: (v: boolean) => void;
  shapExpanded: boolean;
  setShapExpanded: (v: boolean) => void;
  detailsExpanded: boolean;
  setDetailsExpanded: (v: boolean) => void;
}) {
  const verdictClass = result.verdict === "REAL" ? "verdict-real" : result.verdict === "FAKE" ? "verdict-fake" : "verdict-suspicious";
  const verdictColor = result.verdict === "REAL" ? "#10b981" : result.verdict === "FAKE" ? "#f43f5e" : "#f59e0b";
  const pct = Math.round(result.fraud_probability * 100);

  const copyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const maxShapValue = Math.max(...result.top_shap_features.map((f) => Math.abs(f.value)));

  return (
    <main className="min-h-screen pb-20">
      <div className="aurora-background" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24">
        {showDemoBanner && (
          <div className="glass mb-6 p-4 border-[rgba(245,158,11,0.4)] bg-[rgba(245,158,11,0.06)]">
            <p className="text-center text-sm text-[#f59e0b]">DEMO PREVIEW — This is a demonstration. No real model was run on this data.</p>
          </div>
        )}

        {/* Verdict Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass p-8 ${verdictClass} flex flex-col md:flex-row items-center justify-between gap-6 mb-8`}
        >
          <div className="flex items-center gap-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={verdictColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              {result.verdict === "REAL" && <path d="M9 12l2 2 4-4" />}
              {result.verdict === "FAKE" && <><path d="M15 9l-6 6" /><path d="M9 9l6 6" /></>}
              {result.verdict === "SUSPICIOUS" && <><path d="M12 9v4" /><circle cx="12" cy="16" r="0.5" fill={verdictColor} /></>}
            </svg>
            <div>
              <div className="font-sora text-2xl font-bold" style={{ color: verdictColor }}>{result.verdict}</div>
              <div className="text-white/60 text-sm">{result.job_title} at {result.company_name}</div>
            </div>
          </div>
          <div className="text-right">
            <CountUp target={pct} className="font-mono text-6xl md:text-[80px] font-medium" style={{ color: verdictColor }} />
            <div className="text-white/40 text-xs font-mono">% fraud probability</div>
          </div>
        </motion.div>

        {/* Confidence Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-8 mb-8 flex justify-center"
        >
          <div className="relative w-[280px]">
            <svg viewBox="0 0 280 160" className="w-full">
              <path d="M 20 140 A 120 120 0 0 1 260 140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
              <path d="M 20 140 A 120 120 0 0 1 260 140" fill="none" stroke={verdictColor} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 377} 377`} className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
              <span className="font-mono text-4xl font-medium" style={{ color: verdictColor }}>{pct}%</span>
              <span className="text-white/[0.38] text-[13px]">fraud probability</span>
            </div>
            <div className="flex justify-between text-[11px] text-white/[0.38] mt-1 px-2">
              <span>Legitimate</span><span>Fraudulent</span>
            </div>
          </div>
        </motion.div>

        {/* Risk Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {([
            { label: "TEXT QUALITY", value: result.risk_scores.text_quality, desc: "Higher is better", invert: false },
            { label: "COMPANY SIGNALS", value: result.risk_scores.company_signals, desc: "Higher is better", invert: false },
            { label: "OFFER REALISM", value: result.risk_scores.offer_realism, desc: "Higher is better", invert: false },
            { label: "RED FLAG SCORE", value: result.risk_scores.red_flag_score, desc: "Lower is better", invert: true },
          ] as const).map((metric, i) => {
            const color = metric.invert
              ? metric.value > 50 ? "#f43f5e" : metric.value > 25 ? "#f59e0b" : "#10b981"
              : metric.value > 60 ? "#10b981" : metric.value > 30 ? "#f59e0b" : "#f43f5e";
            return (
              <motion.div key={metric.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12 }} className="glass p-6">
                <div className="text-[11px] text-white/[0.38] uppercase tracking-[0.10em] mb-2">{metric.label}</div>
                <div className="font-mono text-4xl font-medium mb-3" style={{ color }}>{metric.value}</div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${metric.value}%` }} transition={{ delay: 0.5 + i * 0.12, duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: color }} />
                </div>
                <div className="text-[13px] text-white/[0.38]">{metric.desc}</div>
              </motion.div>
            );
          })}
        </div>

        {/* SHAP Features */}
        <div className="glass p-6 mb-8">
          <button onClick={() => setShapExpanded(!shapExpanded)} className="w-full flex items-center justify-between text-left">
            <h3 className="font-sora text-lg font-semibold">Feature Analysis</h3>
            <span className="text-white/50 text-sm">{shapExpanded ? "Hide ↑" : "Show feature analysis ↓"}</span>
          </button>
          <motion.div animate={{ height: shapExpanded ? "auto" : 0, opacity: shapExpanded ? 1 : 0 }} className="overflow-hidden">
            <div className="mt-6 space-y-3">
              {result.top_shap_features.map((feat, i) => {
                const barWidth = maxShapValue > 0 ? (Math.abs(feat.value) / maxShapValue) * 100 : 0;
                const isFraud = feat.direction === "fraud";
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-[200px] text-right text-xs text-white/60 truncate">{lookupFeatureName(feat.name)}</div>
                    <div className="flex-1 h-4 relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-white/10" /><div className="absolute left-1/2 w-px h-4 bg-white/20" /></div>
                      {isFraud ? (
                        <div className="absolute left-1/2 h-4 rounded-r bg-[#f43f5e]" style={{ width: `${barWidth / 2}%` }} />
                      ) : (
                        <div className="absolute h-4 rounded-l bg-[#10b981]" style={{ width: `${barWidth / 2}%`, right: "50%" }} />
                      )}
                    </div>
                    <div className="w-[60px] text-xs font-mono text-white/50">{feat.value > 0 ? "+" : ""}{feat.value.toFixed(4)}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Explanation */}
        <div className="glass p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-sora text-lg font-semibold">Analysis Summary</h3>
            <span className="bg-white/[0.06] border border-white/[0.10] rounded-full px-3 py-1 text-[11px] text-white/[0.45]">MODEL OUTPUT</span>
          </div>
          {result.explanation.split("\n\n").map((para, i) => (
            <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.35 }} className="text-[16px] leading-[1.85] text-white/[0.72] mb-4 last:mb-0">{para}</motion.p>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/check" className="btn-ghost">← Check Another</Link>
          <button onClick={copyUrl} className="btn-ghost">{copied ? "Copied ✓" : "Share Result"}</button>
        </div>
      </div>
    </main>
  );
}
