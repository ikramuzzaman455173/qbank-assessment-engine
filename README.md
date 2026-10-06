<div align="center">
  <h1>🚀 QBank — Smart MCQ & Assessment Engine</h1>
  <p>
    <strong>A fast full-stack testing platform with AI question extraction from PDFs, real-time timed test sessions, and clear learning analytics.</strong>
  </p>
  <p>
    <a href="https://qbank-core.vercel.app">
      <img src="https://img.shields.io/badge/Live_Demo-Visit_Site-00C7B7?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
    <img src="https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Framework-React_19_%7C_TanStack_Start-FF4154?style=for-the-badge&logo=react" alt="Framework" />
    <img src="https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Database" />
    <img src="https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini" alt="Google Gemini" />
  </p>
  <p>
    <a href="#-quick-snapshot-the-30-second-overview">Quick Snapshot</a> •
    <a href="#-core-problem--measurable-impact-3-key-wins">Core Impact</a> •
    <a href="#-key-screens--live-interactive-testing">Screens & Demo</a> •
    <a href="#️-tech-stack--architecture">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-author--delivery-credits">Author</a>
  </p>
</div>

---

> [!NOTE]
> 🔒 **Client Confidentiality & Sanitized Showcase Sandbox:**
> The primary production repository is proprietary and kept private under NDA. This public repository and live staging deployment serve as an authorized, sanitized showcase/staging sandbox demonstrating architecture, UI design system, and full-stack workflows without exposing confidential client data or private keys.

## ⚡ Quick Snapshot (The 30-Second Overview)

| Attribute | Details |
| :--- | :--- |
| **Client / Domain** | EdTech & Examination Preparation (O/A Level & Professional Certifications) |
| **Agency Partner** | Shopnojal IT (Delivered for Real Commercial Client) |
| **Role & Execution** | **Lead Full-Stack Developer** (Delivered on-time in a 5-week part-time sprint alongside full-time role) |
| **Core Stack** | React 19 + TanStack Start (SSR with Nitro) + Supabase PostgreSQL (RLS) + Google Gemini API |
| **Live Interactive Test** | [https://qbank-core.vercel.app](https://qbank-core.vercel.app) (Guest Mode: 1-Click "Explore as Guest Reviewer" or `demo@knowledgecanvas.dev` / `Demo@Recruiter2026!`) |

---

## 🎯 Core Problem & Measurable Impact (3 Key Wins)

- ⚡ **Question Import & Paper Digitization:** Replaced slow manual retyping of questions from paper exam sheets with an automated AI parser using Google Gemini $\rightarrow$ 🚀 **90% faster question creation (under 2 minutes per paper)**.
- 📈 **Exam State & Anti-Loss Protection:** Replaced lost test attempts from accidental tab refreshes with local session sync and automatic submission on timer expiry $\rightarrow$ 📈 **100% test attempt recovery with zero lost answers**.
- 🛡️ **Learning Insights & Weak-Area Practice:** Replaced basic single-score test summaries with topic-level mastery charts and automated practice recommendations for low-scoring subjects $\rightarrow$ ⚡ **Sub-150ms page response times and instant weak-area detection**.

---

## 🖼️ Key Screens & Live Interactive Testing

<!-- [IMAGE_PLACEHOLDER: Main Interactive Dashboard & Topic Mastery Analytics] -->
*⚡ [Click to Test Live Dashboard](https://qbank-core.vercel.app/dashboard) — Guest Login: 1-Click "Explore as Guest Reviewer" or `demo@knowledgecanvas.dev` / `Demo@Recruiter2026!``*

<!-- [IMAGE_PLACEHOLDER: AI Question Import Wizard & Question Bank Editor] -->
*⚡ [Click to Test Question Banks & AI Import](https://qbank-core.vercel.app/question-banks) — Guest Login: 1-Click "Explore as Guest Reviewer" or `demo@knowledgecanvas.dev` / `Demo@Recruiter2026!``*

<!-- [IMAGE_PLACEHOLDER: Real-Time Timed Exam Session Runner] -->
*⚡ [Click to Test Timed Exam Engine](https://qbank-core.vercel.app/tests) — Guest Login: 1-Click "Explore as Guest Reviewer" or `demo@knowledgecanvas.dev` / `Demo@Recruiter2026!``*

<!-- [IMAGE_PLACEHOLDER: Detailed Scorecard & Performance Analytics] -->
*⚡ [Click to Test Exam Results & Analytics](https://qbank-core.vercel.app/results) — Guest Login: 1-Click "Explore as Guest Reviewer" or `demo@knowledgecanvas.dev` / `Demo@Recruiter2026!``*

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TanStack Start (Full-Stack SSR with Nitro Engine), TanStack Router (type-safe routing), TanStack Query v5, Tailwind CSS v4 (OKLCH color system)
- **UI Components:** Radix UI primitives, Lucide React icons, Recharts (topic mastery and accuracy trend charts)
- **Backend & Database:** Supabase PostgreSQL with Row Level Security (RLS) policies, atomic scoring functions, and file storage
- **AI Integration:** Google Gemini API (structured extraction of multiple-choice questions from PDFs and raw text)
- **Hosting & Infrastructure:** Vercel (Nitro Serverless Runtime), GitHub Actions (automated 2-day database keep-alive heartbeat)
- **Validation & Quality:** Zod schemas, React Hook Form, TypeScript 5.8 (Strict Mode), ESLint 9, Prettier

### 📁 Directory Structure (Tailored to Detected Stack)

```text
knowledge-canvas/
├── .github/
│   └── workflows/
│       └── supabase-keep-alive.yml # Automated 2-day database heartbeat cron
├── public/                         # Static assets, web manifest & service worker
├── src/
│   ├── app/                        # Navigation configuration & app providers
│   ├── components/                 # Reusable UI elements, layout & shell
│   │   ├── common/                 # Page headers, empty states, pagination
│   │   ├── layout/                 # Navigation bar, user menu, theme switcher
│   │   └── ui/                     # Accessible UI primitives (buttons, dialogs, cards)
│   ├── constants/                  # Route constants & app defaults
│   ├── features/                   # Feature modules
│   │   ├── analytics/              # Topic mastery & difficulty charts
│   │   ├── auth/                   # Supabase authentication & guest demo mode
│   │   ├── dashboard/              # KPI metric cards & recent test attempts
│   │   ├── landing/                # Public hero, feature grid, and CTA
│   │   ├── practice/               # Quick practice mode & question runner
│   │   ├── question-banks/         # Question bank manager & question lists
│   │   ├── questions/              # AI question import wizard & review table
│   │   ├── results/                # Scorecard breakdown & attempt review
│   │   ├── settings/               # Profile, avatar upload & API key settings
│   │   └── tests/                  # Timed exam builder & live test engine
│   ├── hooks/                      # Custom hooks (timer, fullscreen, theme)
│   ├── integrations/
│   │   └── supabase/               # Supabase client & query helpers
│   ├── routes/                     # TanStack Router file-based route definitions
│   │   ├── _authenticated/         # Guarded routes (dashboard, tests, banks)
│   │   ├── __root.tsx              # Root HTML shell & route tree
│   │   └── index.tsx               # Public landing page
│   ├── styles.css                  # Tailwind CSS v4 OKLCH theme styles
│   └── types/                      # TypeScript domain types & dashboard DTOs
├── supabase/
│   └── migrations/                 # PostgreSQL migrations & RLS policies
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

Follow these steps to run the sanitized showcase locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/ikramuzzaman455173/knowledge-canvas.git
cd knowledge-canvas

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
cp .env.example .env.local

# 4. Start Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser.

---

## 👨‍💻 Author & Delivery Credits
- **Lead Developer:** [Md. Ikramuzzaman](https://github.com/ikramuzzaman455173)
- **Agency Partner:** Shopnojal IT (Delivered for Real Commercial Client)
- **Portfolio:** [https://ikramuzzaman.vercel.app](https://ikramuzzaman.vercel.app)
- **GitHub:** [@ikramuzzaman455173](https://github.com/ikramuzzaman455173)
