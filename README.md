# JobGuard — ML-Powered Fake Job Detector

## Overview
JobGuard is a production-grade web application that detects fraudulent job postings using a pre-trained RandomForest machine learning model. Trained on 17,880 real labeled job postings with 5,193 features, it achieves 96% accuracy. The system provides fraud probability scores, SHAP feature explanations, risk breakdowns, and plain-English analysis summaries — all generated directly from the ML model output with zero AI dependencies.

## Architecture

```
Browser (Cloudflare Pages Edge)
  └─→ Next.js API Routes (edge/nodejs runtime)
        ├─→ Railway FastAPI /predict
        │     └─→ pipeline.pkl (RandomForest)
        │     └─→ shap_explainer.pkl (TreeExplainer)
        └─→ Supabase PostgreSQL
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Three.js, Framer Motion |
| Backend | Python 3.11, FastAPI, Uvicorn, scikit-learn 1.6.1, SHAP |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js v4, Google OAuth |
| Deploy | Cloudflare Pages (frontend), Railway (backend) |

## URLs
- **Frontend**: https://3000-ifrc34k16efq8ywonn6jw-de59bda9.sandbox.novita.ai
- **Backend API**: https://8000-ifrc34k16efq8ywonn6jw-de59bda9.sandbox.novita.ai
- **Health Check**: https://8000-ifrc34k16efq8ywonn6jw-de59bda9.sandbox.novita.ai/health

## Currently Completed Features
- Full Python FastAPI backend with ML model serving (pipeline.pkl, shap_explainer.pkl)
- Exact prediction sequence per spec: DataFrame build → predict_proba → SHAP values → top 10 features
- Deterministic explanation generator with FEATURE_LOOKUP (70+ entries)
- Risk score computation (text_quality, company_signals, offer_realism, red_flag_score)
- Rate limiting (30 req/min) and API key authentication
- Next.js 14 frontend with App Router, TypeScript strict mode
- Apple Liquid Glass design system (aurora background, glass cards, pill buttons)
- Three.js particle field with 6000 instanced points, holographic core, scan plane
- 5-section landing page (Hero, Fraud Reality, How It Works, Features, CTA)
- 12-step typeform-style questionnaire with Framer Motion transitions
- Result page with animated verdict banner, confidence gauge, risk breakdown, SHAP chart
- Static preview page with hardcoded FAKE demo data
- Auth page with Google OAuth sign-in
- Dashboard with analysis history grid and stats
- API routes: /api/analyze, /api/results, /api/results/[id], /api/health
- Supabase migration SQL with RLS policies
- Full sanitization middleware
- Security headers (X-Content-Type-Options, X-Frame-Options, CSP, HSTS)

## Prerequisites
- GitHub account
- Cloudflare account (free)
- Railway account (free tier works)
- Supabase account (free tier works)
- Google Cloud Console account (free)

## Step 1 — Deploy Backend to Railway
1. Fork or push the `backend/` directory to a GitHub repo
2. Go to Railway → New Project → Deploy from GitHub
3. Select the repo, set Root Directory to `backend/`
4. Upload ML model files to `backend/ml_models/` (pipeline.pkl, shap_explainer.pkl, feature_names.pkl, feature_cols.pkl)
5. Set environment variables:
   - `INTERNAL_API_KEY=<generate-a-strong-secret>`
   - `ALLOWED_ORIGIN=https://jobguard.pages.dev`
6. Railway will auto-detect the Dockerfile and deploy
7. Test: `curl https://YOUR-RAILWAY-URL.railway.app/health`

## Step 2 — Set Up Google OAuth
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Authorized redirect URI: `https://jobguard.pages.dev/api/auth/callback/google`
4. Copy Client ID and Client Secret

## Step 3 — Set Up Supabase
1. Create a new Supabase project
2. Go to SQL Editor → paste contents of `supabase/migration.sql` → Run
3. Copy the project URL and service_role key

## Step 4 — Deploy to Cloudflare Pages
1. Push code to GitHub
2. Cloudflare dashboard → Workers & Pages → Pages → Create
3. Connect GitHub repo
4. Build settings:
   - Framework: Next.js
   - Build command: `npx @cloudflare/next-on-pages`
   - Output dir: `.vercel/output/static`
   - Root dir: `frontend`
5. Set environment variables:
   - `NEXTAUTH_SECRET=<generate-a-strong-secret>`
   - `NEXTAUTH_URL=https://jobguard.pages.dev`
   - `GOOGLE_CLIENT_ID=<from-step-2>`
   - `GOOGLE_CLIENT_SECRET=<from-step-2>`
   - `NEXT_PUBLIC_SUPABASE_URL=<from-step-3>`
   - `SUPABASE_SERVICE_ROLE_KEY=<from-step-3>`
   - `FASTAPI_URL=https://your-backend.railway.app`
   - `INTERNAL_API_KEY=<same-as-railway>`
6. Save and Deploy

## Verification Checklist
1. ✅ Backend health: `curl https://backend.railway.app/health` returns `model_loaded: true`
2. ✅ Frontend loads at `https://jobguard.pages.dev`
3. ✅ Preview page shows demo FAKE result at `/preview`
4. ✅ Questionnaire at `/check` accepts input and submits
5. ✅ Analysis returns real model predictions (not simulated)
6. ✅ SHAP features display in result page
7. ✅ Google Sign In works and redirects to dashboard
8. ✅ Dashboard shows saved analyses

## Troubleshooting
- **scikit-learn version mismatch** → Pin to 1.6.1 exactly in requirements.txt
- **Cloudflare build failure** → Run `npx @cloudflare/next-on-pages` locally first
- **edge runtime dynamic require** → Add `export const runtime = 'nodejs'` to affected route
- **Google redirect_uri_mismatch** → URI must match NEXTAUTH_URL exactly
- **CORS blocked** → ALLOWED_ORIGIN must be exact Cloudflare URL (no trailing slash)
- **NextAuth JWT error** → NEXTAUTH_SECRET must be set in CF env vars
- **NLTK wordnet missing** → Redeploy Railway (Dockerfile downloads it)
- **Supabase RLS blocking** → Anonymous analyses need user_id = null policy

## Data Architecture
- **ML Models**: scikit-learn Pipeline (ColumnTransformer + RandomForestClassifier), SHAP TreeExplainer
- **Storage**: Supabase PostgreSQL for analysis history, user profiles
- **Features**: 5,193 total (5,000 TF-IDF + ~190 one-hot encoded + 3 binary)

## User Guide
1. Visit the landing page to learn about JobGuard
2. Click "Analyze a Job Posting" or navigate to /check
3. Answer 12 questions about the job posting (one at a time)
4. Submit and wait ~2 seconds for the ML model to analyze
5. View the verdict, fraud probability, risk breakdown, and SHAP analysis
6. Sign in with Google to save results to your dashboard
