export interface ShapFeature {
  name: string;
  value: number;
  direction: "fraud" | "legitimate";
}

export interface RiskScores {
  text_quality: number;
  company_signals: number;
  offer_realism: number;
  red_flag_score: number;
}

export interface PredictionResult {
  verdict: "REAL" | "FAKE" | "SUSPICIOUS";
  fraud_probability: number;
  risk_scores: RiskScores;
  top_shap_features: ShapFeature[];
  red_flags: string[];
  explanation: string;
  job_title: string;
  company_name: string;
}

export interface AnalysisRecord {
  id: string;
  user_id: string | null;
  job_title: string;
  company_name: string;
  form_data: JobFormData;
  verdict: "REAL" | "FAKE" | "SUSPICIOUS";
  fraud_probability: number;
  risk_scores: RiskScores;
  top_shap_features: ShapFeature[];
  red_flags: string[];
  explanation: string;
  is_public: boolean;
  deleted_at: string | null;
  created_at: string;
}

export interface JobFormData {
  title: string;
  company_name: string;
  company_profile: string;
  description: string;
  requirements: string;
  benefits: string;
  employment_type: string;
  required_experience: string;
  required_education: string;
  industry: string;
  function_field: string;
  has_company_logo: boolean;
  has_questions: boolean;
  telecommuting: boolean;
  red_flags: string[];
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  sklearn_version: string;
  uptime_seconds: number;
}

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Other",
];

export const EXPERIENCE_LEVELS = [
  "Entry level",
  "Mid-Senior level",
  "Associate",
  "Executive",
  "Director",
  "Internship",
  "Not Applicable",
];

export const EDUCATION_LEVELS = [
  "Bachelor's Degree",
  "Master's Degree",
  "High School or equivalent",
  "Associate Degree",
  "Some College Coursework Completed",
  "Certification",
  "Doctorate",
  "Vocational",
  "Vocational - Degree",
  "Vocational - HS Diploma",
  "Professional",
  "Some High School Coursework",
  "Unspecified",
];

export const INDUSTRIES = [
  "Information Technology and Services",
  "Computer Software",
  "Marketing and Advertising",
  "Hospital & Health Care",
  "Financial Services",
  "Staffing and Recruiting",
  "Internet",
  "Oil & Energy",
  "Management Consulting",
  "Telecommunications",
  "Consumer Services",
  "Education Management",
  "Retail",
  "Banking",
  "Automotive",
  "Other",
];

export const JOB_FUNCTIONS = [
  "Sales",
  "Information Technology",
  "Engineering",
  "Marketing",
  "Customer Service",
  "Administrative",
  "Management",
  "Education",
  "Health Care Provider",
  "Design",
  "Human Resources",
  "Business Development",
  "Accounting/Auditing",
  "Writing/Editing",
  "Other",
];

export const RED_FLAG_OPTIONS = [
  { label: "Unrealistic salary", helper: "Far above market rate for this role" },
  { label: "Requested personal info", helper: "SSN, bank details, or photo ID upfront" },
  { label: "No company web presence", helper: "No website or LinkedIn page found" },
  { label: "Poor writing quality", helper: "Noticeable grammar or spelling errors" },
  { label: "Unsolicited contact", helper: "You were contacted without applying" },
  { label: "Upfront payment required", helper: "Asked to pay for equipment or training" },
  { label: "Vague job description", helper: "Duties are unclear or extremely generic" },
  { label: "Non-company email domain", helper: "Gmail, Yahoo, Hotmail, or similar" },
  { label: "Too-fast hiring process", helper: "Job offered within hours of applying" },
  { label: "Interview via text or chat", helper: "WhatsApp, Telegram, or SMS only" },
];

export const FEATURE_LOOKUP: Record<string, string> = {
  "tfidf__work": "work-related terminology emphasis",
  "tfidf__home": "home-based work references",
  "tfidf__earn": "earning potential mentions",
  "tfidf__apply": "application language frequency",
  "tfidf__experience": "experience requirement references",
  "tfidf__skill": "skill requirement mentions",
  "tfidf__team": "team environment references",
  "tfidf__company": "company reference frequency",
  "tfidf__position": "position-specific details",
  "tfidf__salary": "salary/compensation references",
  "tfidf__require": "requirement language frequency",
  "tfidf__opportunity": "promotional opportunity language",
  "tfidf__job": "general job terminology frequency",
  "tfidf__benefit": "benefits/perks mentions",
  "tfidf__qualification": "qualification references",
  "tfidf__training": "training program mentions",
  "tfidf__data": "data responsibility references",
  "tfidf__manage": "management terminology",
  "tfidf__great": "superlative/promotional adjectives",
  "tfidf__career": "career growth language",
  "tfidf__flexible": "flexible arrangement emphasis",
  "tfidf__income": "direct income references",
  "tfidf__hire": "hiring urgency language",
  "tfidf__immediate": "immediate start indicators",
  "tfidf__part": "part-time employment references",
  "tfidf__customer": "customer-facing language",
  "tfidf__drive": "driving/travel requirements",
  "tfidf__travel": "travel requirement mentions",
  "tfidf__worldwide": "worldwide operation claims",
  "tfidf__weekly": "weekly payment references",
  "tfidf__commission": "commission-based compensation",
  "tfidf__bonus": "bonus/incentive references",
  "tfidf__urgent": "urgency-driven language",
  "tfidf__online": "online/internet work references",
  "tfidf__simple": "work described as simple/easy",
  "tfidf__paid": "paid training/upfront payment language",
  "tfidf__hour": "hourly rate mentions",
  "tfidf__free": "free training/no-cost references",
  "tfidf__register": "registration/sign-up language",
  "tfidf__click": "click-based action patterns",
  "tfidf__send": "send personal info instructions",
  "tfidf__profile": "profile creation/data requests",
  "tfidf__fast": "fast/quick result promises",
  "tfidf__entry": "entry-level/no-barrier language",
  "tfidf__no_experience": "no experience needed mentions",
  "binary__has_company_logo": "company logo presence",
  "binary__has_questions": "screening questions presence",
  "binary__telecommuting": "remote work designation",
  "has_company_logo": "company logo presence",
  "has_questions": "screening questions presence",
  "telecommuting": "remote work designation",
  "onehot__employment_type_Full-time": "full-time classification",
  "onehot__employment_type_Part-time": "part-time classification",
  "onehot__employment_type_Contract": "contract classification",
  "onehot__employment_type_Temporary": "temporary classification",
  "onehot__employment_type_Other": "non-standard employment type",
  "onehot__required_experience_Entry level": "entry-level requirement",
  "onehot__required_experience_Mid-Senior level": "mid-senior requirement",
  "onehot__required_experience_Not Applicable": "unspecified experience",
  "onehot__required_experience_Internship": "internship level",
  "onehot__required_education_Bachelor's Degree": "bachelor's degree requirement",
  "onehot__required_education_Unspecified": "unspecified education",
  "onehot__industry_Information Technology and Services": "IT industry",
  "onehot__industry_Marketing and Advertising": "marketing industry",
  "onehot__function_Sales": "sales function",
  "onehot__function_Other": "unspecified function",
};

export function lookupFeatureName(raw: string): string {
  if (FEATURE_LOOKUP[raw]) return FEATURE_LOOKUP[raw];
  const clean = raw
    .replace("tfidf__", "")
    .replace("onehot__", "")
    .replace("binary__", "")
    .replace(/_/g, " ");
  return clean;
}
