"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeJob } from "@/lib/api";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  EDUCATION_LEVELS,
  INDUSTRIES,
  JOB_FUNCTIONS,
  RED_FLAG_OPTIONS,
  type JobFormData,
} from "@/lib/types";

const TOTAL_QUESTIONS = 12;

const defaultForm: JobFormData = {
  title: "",
  company_name: "",
  company_profile: "",
  description: "",
  requirements: "",
  benefits: "",
  employment_type: "Full-time",
  required_experience: "Not Applicable",
  required_education: "Unspecified",
  industry: "Information Technology and Services",
  function_field: "Other",
  has_company_logo: true,
  has_questions: true,
  telecommuting: false,
  red_flags: [],
};

export default function CheckPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<JobFormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");

  const update = useCallback((key: keyof JobFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_QUESTIONS - 1)), []);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const autoAdvance = useCallback(
    (key: keyof JobFormData, value: unknown) => {
      update(key, value);
      setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL_QUESTIONS - 1)), 250);
    },
    [update]
  );

  const toggleRedFlag = useCallback(
    (flag: string) => {
      setForm((prev) => ({
        ...prev,
        red_flags: prev.red_flags.includes(flag)
          ? prev.red_flags.filter((f) => f !== flag)
          : [...prev.red_flags, flag],
      }));
    },
    []
  );

  const submit = useCallback(async () => {
    setLoading(true);
    setError("");
    const messages = [
      "Preprocessing job text...",
      "Running RandomForest model...",
      "Extracting SHAP values...",
      "Generating result summary...",
    ];
    const delays = [600, 1300, 2000, 2500];
    messages.forEach((msg, i) => {
      setTimeout(() => setLoadingMsg(msg), delays[i]);
    });

    try {
      const result = await analyzeJob(form);
      const id = result.id || "preview";
      router.push(`/result/${id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
      setLoading(false);
    }
  }, [form, router]);

  const progress = ((step + 1) / TOTAL_QUESTIONS) * 100;

  const categories = ["JOB BASICS", "JOB BASICS", "JOB BASICS", "JOB CONTENT", "JOB CONTENT", "JOB CONTENT", "JOB CONTENT", "COMPANY SIGNALS", "COMPANY SIGNALS", "COMPANY SIGNALS", "ROLE DETAILS", "RED FLAGS"];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      <div className="aurora-background" />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-[3px] bg-white/[0.07] w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="font-mono text-[11px] text-white/[0.45]">
            Question {step + 1} of {TOTAL_QUESTIONS}
          </span>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(8,6,22,0.9)] backdrop-blur-[20px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <svg className="animate-spin-slow" width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" stroke="rgba(99,102,241,0.3)" strokeWidth="3" />
                <path d="M32 4a28 28 0 0124.25 14" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                <path d="M56.25 18A28 28 0 0132 60" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingMsg}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[13px] text-white/[0.65]"
              >
                {loadingMsg}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.28 }}
          >
            <span className="block text-center font-inter text-[11px] text-white/[0.38] uppercase tracking-[0.10em] mb-4">
              {categories[step]}
            </span>

            {step === 0 && (
              <QuestionLayout title="What is the job title?">
                <input
                  className="glass-input text-center text-lg"
                  placeholder="e.g. Senior Data Analyst"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  autoFocus
                />
                <ContinueButton onClick={next} disabled={form.title.length < 3} />
              </QuestionLayout>
            )}

            {step === 1 && (
              <QuestionLayout title="Who is the employer?">
                <input
                  className="glass-input text-center text-lg"
                  placeholder="e.g. Acme Corp"
                  value={form.company_name}
                  onChange={(e) => update("company_name", e.target.value)}
                  autoFocus
                />
                <ContinueButton onClick={next} disabled={form.company_name.length < 1} />
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 2 && (
              <QuestionLayout title="What type of employment is this?">
                <div className="flex flex-wrap justify-center gap-3">
                  {EMPLOYMENT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => autoAdvance("employment_type", type)}
                      className={`px-6 py-3 rounded-full border transition-all duration-200 ${
                        form.employment_type === type
                          ? "bg-[rgba(99,102,241,0.25)] border-[rgba(99,102,241,0.60)] scale-[1.04]"
                          : "bg-white/[0.04] border-white/[0.09] hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="text-sm">{type}</span>
                    </button>
                  ))}
                </div>
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 3 && (
              <QuestionLayout title="Paste the job description." helper="The more detail you include, the more accurate the model prediction.">
                <textarea
                  className="glass-input min-h-[200px] resize-y"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  autoFocus
                />
                <div className="text-right font-mono text-[11px] text-white/[0.38] mt-1">{form.description.length}/5000</div>
                <ContinueButton onClick={next} />
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 4 && (
              <QuestionLayout title="What are the requirements?">
                <textarea
                  className="glass-input min-h-[160px] resize-y"
                  value={form.requirements}
                  onChange={(e) => update("requirements", e.target.value)}
                  autoFocus
                />
                <div className="text-right font-mono text-[11px] text-white/[0.38] mt-1">{form.requirements.length}/3000</div>
                <ContinueButton onClick={next} />
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 5 && (
              <QuestionLayout title="Are any benefits listed?">
                <div className="inline-flex bg-white/[0.06] border border-white/[0.10] rounded-full px-4 py-1 mb-4">
                  <span className="font-inter text-[11px] text-white/[0.45]">Optional</span>
                </div>
                <textarea
                  className="glass-input min-h-[120px] resize-y"
                  value={form.benefits}
                  onChange={(e) => update("benefits", e.target.value)}
                />
                <div className="flex items-center justify-center gap-4 mt-4">
                  <ContinueButton onClick={next} />
                  <button onClick={next} className="text-[13px] text-white/[0.45] hover:text-white/70">Skip this question →</button>
                </div>
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 6 && (
              <QuestionLayout title="Is there a company description?" helper="The 'About Us' or company profile section from the posting.">
                <div className="inline-flex bg-white/[0.06] border border-white/[0.10] rounded-full px-4 py-1 mb-4">
                  <span className="font-inter text-[11px] text-white/[0.45]">Optional</span>
                </div>
                <textarea
                  className="glass-input min-h-[120px] resize-y"
                  value={form.company_profile}
                  onChange={(e) => update("company_profile", e.target.value)}
                />
                <div className="flex items-center justify-center gap-4 mt-4">
                  <ContinueButton onClick={next} />
                  <button onClick={next} className="text-[13px] text-white/[0.45] hover:text-white/70">Skip this question →</button>
                </div>
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 7 && (
              <QuestionLayout title="Does this posting show a company logo?" helper="A logo is present in over 90% of verified legitimate postings.">
                <div className="flex gap-4 justify-center">
                  <ToggleCard selected={form.has_company_logo === true} onClick={() => autoAdvance("has_company_logo", true)} label="Yes, it has a logo" positive />
                  <ToggleCard selected={form.has_company_logo === false} onClick={() => autoAdvance("has_company_logo", false)} label="No logo present" positive={false} />
                </div>
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 8 && (
              <QuestionLayout title="Does it ask screening questions?" helper="Structured questions indicate a real hiring pipeline.">
                <div className="flex gap-4 justify-center">
                  <ToggleCard selected={form.has_questions === true} onClick={() => autoAdvance("has_questions", true)} label="Yes, has questions" positive />
                  <ToggleCard selected={form.has_questions === false} onClick={() => autoAdvance("has_questions", false)} label="No screening questions" positive={false} />
                </div>
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 9 && (
              <QuestionLayout title="Is this a remote or telecommute role?">
                <div className="flex gap-4 justify-center">
                  <ToggleCard selected={form.telecommuting === true} onClick={() => autoAdvance("telecommuting", true)} label="Yes, fully remote" positive />
                  <ToggleCard selected={form.telecommuting === false} onClick={() => autoAdvance("telecommuting", false)} label="On-site or hybrid" positive={false} />
                </div>
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 10 && (
              <QuestionLayout title="A few more details about the role" helper="These structural signals are among the strongest fraud predictors.">
                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="Industry" value={form.industry} options={INDUSTRIES} onChange={(v) => update("industry", v)} />
                  <SelectField label="Required Experience" value={form.required_experience} options={EXPERIENCE_LEVELS} onChange={(v) => update("required_experience", v)} />
                  <SelectField label="Required Education" value={form.required_education} options={EDUCATION_LEVELS} onChange={(v) => update("required_education", v)} />
                  <SelectField label="Job Function" value={form.function_field} options={JOB_FUNCTIONS} onChange={(v) => update("function_field", v)} />
                </div>
                <ContinueButton onClick={next} />
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}

            {step === 11 && (
              <QuestionLayout title="Have you noticed any of these red flags?" helper="Select all that apply. These amplify the model's fraud signal.">
                {form.red_flags.length > 0 && (
                  <div className="inline-flex bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.3)] rounded-full px-4 py-1 mb-4">
                    <span className="font-mono text-xs text-[#f43f5e]">{form.red_flags.length} red flag{form.red_flags.length > 1 ? "s" : ""} selected</span>
                  </div>
                )}
                <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {RED_FLAG_OPTIONS.map((flag) => {
                    const selected = form.red_flags.includes(flag.label);
                    return (
                      <button
                        key={flag.label}
                        onClick={() => toggleRedFlag(flag.label)}
                        className={`w-full text-left glass p-4 flex items-center gap-3 transition-all ${
                          selected ? "border-[rgba(244,63,94,0.40)] bg-[rgba(244,63,94,0.06)]" : ""
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selected ? "border-[#f43f5e] bg-[#f43f5e]" : "border-white/20"
                        }`}>
                          {selected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white/90">{flag.label}</div>
                          <div className="text-xs text-white/40">{flag.helper}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {error && <p className="text-[#f43f5e] text-sm mt-4 text-center">{error}</p>}
                <button onClick={submit} className="btn-primary w-full mt-6 h-[52px]">
                  Analyze This Posting →
                </button>
                <BackButton onClick={prev} />
              </QuestionLayout>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function QuestionLayout({ title, helper, children }: { title: string; helper?: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="font-sora text-[28px] font-semibold text-white mb-2">{title}</h2>
      {helper && <p className="text-[15px] text-white/[0.45] mb-6">{helper}</p>}
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function ContinueButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-primary mt-4 disabled:opacity-40 disabled:cursor-not-allowed">
      Continue →
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="block mx-auto mt-4 text-[13px] text-white/[0.38] hover:text-white/60">
      ← Back
    </button>
  );
}

function ToggleCard({ selected, onClick, label, positive }: { selected: boolean; onClick: () => void; label: string; positive: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`glass p-6 w-[200px] text-center transition-all ${
        selected
          ? positive
            ? "border-[rgba(16,185,129,0.5)] bg-[rgba(16,185,129,0.08)]"
            : "border-[rgba(244,63,94,0.5)] bg-[rgba(244,63,94,0.08)]"
          : "hover:bg-white/[0.06]"
      }`}
    >
      <div className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center border-2 ${
        selected
          ? positive ? "border-[#10b981] text-[#10b981]" : "border-[#f43f5e] text-[#f43f5e]"
          : "border-white/20 text-white/40"
      }`}>
        {positive ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        )}
      </div>
      <span className="text-sm text-white/80">{label}</span>
    </button>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] text-white/[0.45] uppercase tracking-[0.10em] mb-2 font-inter">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass-input appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#080616] text-white">{opt}</option>
        ))}
      </select>
    </div>
  );
}
