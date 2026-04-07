"use client";

import { useState } from "react";
import ResultView from "@/components/result/ResultView";
import type { AnalysisRecord } from "@/lib/types";

const DEMO_DATA: AnalysisRecord = {
  id: "demo-preview",
  user_id: null,
  job_title: "Senior Data Analyst",
  company_name: "DataVision Analytics LLC",
  form_data: {
    title: "Senior Data Analyst",
    company_name: "DataVision Analytics LLC",
    company_profile: "",
    description: "Work from home and earn $5000 per week. No experience needed. Join our global team today. Simple data entry tasks. Unlimited earning potential.",
    requirements: "",
    benefits: "Flexible hours, weekly pay, work from anywhere",
    employment_type: "Full-time",
    required_experience: "Not Applicable",
    required_education: "Unspecified",
    industry: "Information Technology and Services",
    function_field: "Other",
    has_company_logo: false,
    has_questions: false,
    telecommuting: true,
    red_flags: ["Unrealistic salary", "Requested personal info", "No company web presence", "Upfront payment required", "Non-company email domain", "Too-fast hiring process", "Interview via text or chat"],
  },
  verdict: "FAKE",
  fraud_probability: 0.847,
  risk_scores: { text_quality: 15, company_signals: 15, offer_realism: 21, red_flag_score: 70 },
  top_shap_features: [
    { name: "binary__has_company_logo", value: 0.0651, direction: "fraud" },
    { name: "tfidf__earn", value: 0.0423, direction: "fraud" },
    { name: "tfidf__home", value: 0.0312, direction: "fraud" },
    { name: "tfidf__work home", value: 0.0287, direction: "fraud" },
    { name: "tfidf__weekly", value: 0.0198, direction: "fraud" },
    { name: "binary__has_questions", value: 0.0165, direction: "fraud" },
    { name: "tfidf__simple", value: 0.0134, direction: "fraud" },
    { name: "tfidf__unlimited", value: 0.0112, direction: "fraud" },
    { name: "tfidf__senior", value: -0.0098, direction: "legitimate" },
    { name: "tfidf__data", value: -0.0076, direction: "legitimate" },
  ],
  red_flags: ["Unrealistic salary", "Requested personal info", "No company web presence", "Upfront payment required", "Non-company email domain", "Too-fast hiring process", "Interview via text or chat"],
  explanation: "Our model has flagged the posting for Senior Data Analyst at DataVision Analytics LLC as highly likely fraudulent with 84.7% confidence. The combination of features detected matches known fraud patterns across our entire training dataset.\n\nThe most influential signals driving this classification were: absence of a company logo in the posting, mentions of earning potential or income promises, and references to home-based or work-from-home arrangements. The posting lacked standard employer verification markers such as a company logo and structured screening questions, both of which are present in the overwhelming majority of legitimate postings. The language patterns within the posting text showed characteristics commonly associated with templated or copy-pasted fraudulent content. The stated employment terms appear inconsistent with typical verified postings for this role type and experience level.\n\n7 red flags were reported, including Unrealistic salary and Requested personal info. We strongly advise against engaging further. Do not provide personal information. Consider reporting this posting to your country\u2019s consumer protection agency.",
  is_public: true,
  deleted_at: null,
  created_at: new Date().toISOString(),
};

export default function PreviewPage() {
  const [copied, setCopied] = useState(false);
  const [shapExpanded, setShapExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
    <ResultView
      result={DEMO_DATA}
      showDemoBanner
      copied={copied}
      setCopied={setCopied}
      shapExpanded={shapExpanded}
      setShapExpanded={setShapExpanded}
      detailsExpanded={detailsExpanded}
      setDetailsExpanded={setDetailsExpanded}
    />
  );
}
