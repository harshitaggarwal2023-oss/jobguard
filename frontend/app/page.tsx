"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const Scene = dynamic(() => import("@/components/landing/Scene"), { ssr: false });

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] h-[62px] flex items-center px-6 transition-all duration-[380ms] ease-out ${
        scrolled
          ? "bg-[rgba(8,6,22,0.80)] backdrop-blur-[32px] saturate-[180%] border-b border-white/[0.07]"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-2 mr-auto">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.8">
          <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <span className="font-sora font-semibold text-lg text-white">JobGuard</span>
      </div>

      <div className="hidden md:flex items-center gap-8 mx-auto">
        {["How It Works", "Features", "Dashboard"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
            className="text-sm text-white/55 hover:text-white transition-colors font-inter"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3 ml-auto">
        <Link href="/auth" className="btn-ghost !py-2 !px-5 text-sm">
          Sign In
        </Link>
        <Link href="/check" className="btn-primary !py-2 !px-5 text-sm">
          Analyze a Job →
        </Link>
      </div>

      <button
        className="md:hidden ml-auto flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`w-5 h-0.5 bg-white/80 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`w-5 h-0.5 bg-white/80 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`w-5 h-0.5 bg-white/80 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 top-[62px] bg-[rgba(8,6,22,0.95)] backdrop-blur-[32px] flex flex-col items-center justify-center gap-8 z-[99]"
          >
            {["How It Works", "Features", "Dashboard"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
                className="text-xl text-white/70 hover:text-white font-sora"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </motion.a>
            ))}
            <Link href="/check" className="btn-primary mt-4" onClick={() => setMenuOpen(false)}>
              Analyze a Job →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Scene />
      <div className="relative z-10 text-center max-w-3xl px-6">
        <AnimatePresence>
          {show && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.5 }}
                className="inline-flex items-center gap-2 backdrop-blur-[20px] border border-white/[0.15] rounded-full px-[18px] py-[7px] mb-8"
              >
                <span className="font-mono text-[11px] text-white/60 tracking-wide">
                  RANDOMFOREST MODEL &middot; 17,880 TRAINING SAMPLES &middot; 5,193 SIGNALS
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                className="font-sora text-5xl md:text-[82px] font-bold tracking-[-0.05em] leading-[0.95] text-white mb-2"
              >
                Verify Any Job
              </motion.h1>

              <motion.h1
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                className="font-sora text-5xl md:text-[82px] font-bold tracking-[-0.05em] leading-[0.95] gradient-text mb-8"
              >
                Posting Instantly.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-[17px] text-white/[0.58] max-w-[500px] mx-auto leading-[1.85] mb-10"
              >
                Our RandomForest model — trained on 17,880 real labeled job postings — evaluates 5,193 signals in under 2 seconds. No AI. No guesswork. Pure model-driven fraud detection.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="flex items-center justify-center gap-4 flex-wrap"
              >
                <Link href="/check" className="btn-primary h-[52px] flex items-center">
                  Analyze a Job Posting →
                </Link>
                <Link href="/preview" className="btn-ghost h-[52px] flex items-center">
                  View Sample Result
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-xs text-white/[0.38] mt-8"
              >
                No account required &middot; Under 2 seconds &middot; Privacy first
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FraudRealitySection() {
  const stats = [
    { value: "14 Million", desc: "job seekers encounter fraud annually in the US alone", icon: "M12 8v8m-4-4h8" },
    { value: "$2,000", desc: "average financial loss per victim of job scams", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
    { value: "66%", desc: "of fraudulent postings impersonate real companies", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sora text-[38px] font-semibold tracking-[-0.02em] text-center mb-4"
        >
          The Hidden Crisis in Job Recruitment
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-white/[0.58] max-w-2xl mx-auto mb-16 text-[15px] leading-[1.8]"
        >
          Every year, millions of job seekers fall victim to fraudulent postings designed to steal personal information, extract fees, or enable identity theft.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center bg-white/[0.06] rounded-[28%] border border-white/[0.10]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={stat.icon} />
                </svg>
              </div>
              <div className="font-mono text-4xl font-medium text-white mb-3">{stat.value}</div>
              <p className="text-sm text-white/50">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-elevated p-10"
        >
          <p className="text-[15px] text-white/[0.65] leading-[1.85] max-w-3xl">
            Fraudulent job postings are engineered to appear legitimate. They steal resumes to harvest personal data, charge fake application fees, harvest banking information under the guise of payroll setup, and use real company names to bypass skepticism. Traditional job boards cannot detect them at scale.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const cards = [
    {
      step: "01",
      title: "Fill the Form",
      body: "Enter the job title, company details, description, and any red flags you noticed. Four structured steps capture every signal the model needs to classify this posting.",
      tag: "~60 seconds",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      step: "02",
      title: "Model Evaluates",
      body: "Your input is preprocessed with the exact same TF-IDF and one-hot pipeline used during training, then passed to the RandomForest classifier for prediction across 5,193 features.",
      tag: "< 2 seconds",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    {
      step: "03",
      title: "See the Verdict",
      body: "Get the fraud probability score, top SHAP feature contributions, risk breakdowns, and a plain-English model summary — all generated directly from the classifier output.",
      tag: "Instant result",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
  ];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    e.currentTarget.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
  }, []);

  return (
    <section id="how-it-works" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sora text-[38px] font-semibold tracking-[-0.02em] text-center mb-4"
        >
          How JobGuard Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-white/[0.58] mb-16"
        >
          Three steps from posting URL to fraud verdict.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="glass p-8 cursor-default transition-transform duration-150"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center bg-white/[0.06] rounded-full border border-white/[0.10] transition-all duration-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={card.icon} />
                </svg>
              </div>
              <span className="font-mono text-[11px] text-white/[0.38]">{card.step}</span>
              <h3 className="font-sora text-xl font-semibold mt-2 mb-3">{card.title}</h3>
              <p className="text-sm text-white/50 leading-[1.8] mb-6">{card.body}</p>
              <div className="inline-flex items-center backdrop-blur-[20px] bg-white/[0.06] border border-white/[0.10] rounded-full px-4 py-1.5">
                <span className="font-mono text-xs text-white/60">{card.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: "Zero AI Dependencies", body: "Every prediction comes from your locally-loaded RandomForest model. No API keys, no rate limits, no hallucinations, no network dependency for core functionality. The model is yours.", span: "md:col-span-2" },
    { title: "SHAP Transparency", body: "SHAP (SHapley Additive Explanations) reveals exactly which features pushed the model toward fraud or legitimacy for every single prediction.", span: "md:row-span-2" },
    { title: "Google OAuth", body: "One click to sign in. Save all analyses to your personal history, accessible from any device.", span: "" },
    { title: "Complete History", body: "Every analysis you run is saved with full result data. Filter by verdict, search by company, export to CSV.", span: "" },
    { title: "96% Accuracy", body: "Validated on held-out test data from the same 17,880-sample dataset.", span: "" },
  ];

  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sora text-[38px] font-semibold tracking-[-0.02em] text-center mb-4"
        >
          Why JobGuard
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-white/[0.58] mb-16"
        >
          Built on transparent, open methodology. No black-box AI.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass p-8 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(99,102,241,0.18)] transition-all duration-300 ${feat.span}`}
            >
              <h3 className="font-sora text-xl font-semibold mb-3">{feat.title}</h3>
              <p className="text-sm text-white/50 leading-[1.8]">{feat.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-[640px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-elevated p-[72px_56px] text-center"
        >
          <h2 className="font-sora text-3xl font-semibold mb-4">Analyze Your First Job Posting</h2>
          <p className="text-white/[0.58] mb-8">
            Takes under 3 minutes. Sign in to save results to your dashboard.
          </p>

          <Link
            href="/auth"
            className="glass-elevated flex items-center justify-center gap-3 h-[54px] rounded-full w-full mb-6 hover:bg-white/[0.15] transition-colors cursor-pointer"
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
          </Link>

          <p className="text-xs text-white/[0.38] mb-4">
            No account required to run an analysis — sign in only to save history.
          </p>

          <Link href="/check" className="text-[13px] text-[#6366f1] hover:underline">
            or analyze without signing in →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FraudRealitySection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
      <footer className="text-center py-12 text-white/30 text-sm">
        <p>JobGuard — ML-Powered Fake Job Detector</p>
        <p className="mt-1">RandomForest &middot; 17,880 Samples &middot; 96% Accuracy</p>
      </footer>
    </main>
  );
}
