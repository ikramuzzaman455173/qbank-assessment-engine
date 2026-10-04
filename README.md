<img width="1672" height="941" alt="Image" src="https://github.com/user-attachments/assets/856bd794-269b-41f8-8735-af213b49ae40" />

<div align="center">
  <h1>🚀 QBank — Smart MCQ & Assessment Engine</h1>
  <p>
    <strong>A high-performance full-stack examination and question bank platform with AI question extraction, timed testing sessions, and granular mastery analytics.</strong>
  </p>
  <p>
    <a href="https://qbank-core.vercel.app">
      <img src="https://img.shields.io/badge/Live_Demo-Visit_Platform-00C7B7?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
    <img src="https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Framework-TanStack_Start-FF4154?style=for-the-badge&logo=react" alt="TanStack Start" />
    <img src="https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini" alt="Google Gemini" />
  </p>
  <p>
    <a href="#-overview">Overview</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#️-tech-stack">Tech Stack</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-database--security">Security</a> •
    <a href="#-license">License</a>
  </p>
</div>

---

## 📖 Overview

**QBank** is an enterprise-grade assessment platform designed for educators, institutions, and self-directed learners. It bridges the gap between raw question storage and intelligent testing by offering AI-assisted question ingestion from PDFs and structured JSON, strict time-bounded exam environments, and deep analytical feedback loops.

Built on **TanStack Start (Full-Stack SSR with Nitro)** and **React 19**, the platform delivers sub-second navigation, complete type safety from database query to UI component, and resilient offline capabilities via PWA architecture. Multi-tenant security is enforced directly at the database engine level via PostgreSQL Row Level Security (RLS), ensuring complete isolation across question repositories and attempt telemetry.

---

## 🌐 Live Demo & Credentials

Experience the platform live with instant guest evaluation or test credentials:

- **Live Application:** [https://qbank-core.vercel.app](https://qbank-core.vercel.app)
- **1-Click Reviewer Access:** Click **"Explore as Guest Reviewer"** on the landing page for immediate instant-login with pre-seeded demo assessment data.
- **Demo Reviewer Credentials:**
  - **Email:** `demo@knowledgecanvas.dev`
  - **Password:** `Demo@Recruiter2026!`

---

## ✨ Key Features

- ⚡ **AI-Powered Question Extraction & Ingestion:** Upload PDF exam papers or raw JSON datasets; Google Gemini parses, formats, and validates questions, choices, and explanations with interactive pre-commit review.
- ⏱️ **Real-Time Timed Exam Engine:** Live session countdowns, question bookmarks, flag-for-review navigation, and automated client/server submission on timer exhaustion.
- 📊 **Linear-Grade Analytics & Mastery Curves:** Recharts-powered performance trajectories, topic-level mastery horizontal bar charts, and difficulty tier donut distributions.
- 🎯 **Targeted Weak-Area Remediation:** Intelligent algorithms identify subjects and difficulty tiers where accuracy falls below the 75% benchmark, dynamically suggesting focused practice tests.
- 🔒 **Database-Enforced Row Level Security (RLS):** Strict PostgreSQL access policies guarantee users can only query, mutate, and evaluate their own question banks and historical attempts.
- 📱 **Progressive Web App (PWA) & Offline Resilient:** Service-worker asset caching, installable on mobile/desktop, and offline capability for continuous review.

---

## 🛠️ Tech Stack

### Frontend & UI
- **Framework:** [TanStack Start](https://tanstack.com/start) (Full-Stack SSR, Nitro Engine) with [React 19](https://react.dev)
- **Routing:** [TanStack Router](https://tanstack.com/router) (100% type-safe file-based routes & search param schemas)
- **State & Data Fetching:** [TanStack Query v5](https://tanstack.com/query) (stale-while-revalidate, optimistic updates)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) with OKLCH Design Tokens and dark/light mode synchronization
- **Component Primitives:** [Radix UI](https://www.radix-ui.com) & [Lucide React](https://lucide.dev)
- **Data Visualization:** [Recharts](https://recharts.org)

### Backend, Database & AI
- **Database:** [PostgreSQL](https://www.postgresql.org) via [Supabase](https://supabase.com)
- **Security:** PostgreSQL Row Level Security (RLS) policies, triggers, and RPC functions
- **AI Integration:** Google Gemini API (structured extraction of unstructured questions)
- **Storage:** Supabase Storage (authenticated avatar and document uploads)

### Tooling & Automation
- **Validation:** [Zod](https://zod.dev) & [React Hook Form](https://react-hook-form.com)
- **Code Quality:** ESLint 9, TypeScript 5.8 (Strict Mode), Prettier
- **Continuous Keep-Alive:** GitHub Actions automated cron heartbeat for Supabase free-tier persistence

---

## 📁 System Architecture & Directory Structure

```text
qbank/
├── .github/
│   └── workflows/
│       └── supabase-keep-alive.yml # Automated 2-day database heartbeat cron
├── public/                         # Public assets, web manifest & Service Worker
├── src/
│   ├── app/                        # Navigation configuration & global app providers
│   ├── components/                 # Shared UI elements, dialogs, layout & shell
│   │   ├── common/                 # Page headers, states, pagination, pickers
│   │   ├── layout/                 # Navigation bar, user menu, theme switcher
│   │   └── ui/                     # Accessible UI primitives (buttons, cards, forms)
│   ├── constants/                  # Route constants & platform defaults
│   ├── features/                   # Feature-driven modular architecture
│   │   ├── analytics/              # Topic mastery & difficulty breakdown charts
│   │   ├── auth/                   # Supabase authentication & guest reviewer session
│   │   ├── dashboard/              # Key metric KPIs, trend chart, recent activity
│   │   ├── landing/                # Public landing hero, features, CTA, how-it-works
│   │   ├── practice/               # Quick practice configuration & live practice engine
│   │   ├── questions/              # Question bank editor & AI PDF/JSON import wizard
│   │   ├── results/                # Attempt evaluation scorecards & breakdown
│   │   ├── settings/               # Profile, avatar upload, and AI key management
│   │   └── tests/                  # Formal timed exam creator, session & runner
│   ├── hooks/                      # Custom React hooks (fullscreen, timer, auth)
│   ├── integrations/
│   │   └── supabase/               # Supabase browser client & query configurations
│   ├── routes/                     # TanStack Router file-based route definitions
│   │   ├── _authenticated/         # Guarded routes (Dashboard, Banks, Tests, Analytics)
│   │   ├── __root.tsx              # Root HTML shell, providers & route tree
│   │   └── index.tsx               # High-converting landing page
│   ├── styles.css                  # Tailwind CSS v4 OKLCH theme configuration
│   └── types/                      # Domain entities, attempt models & dashboard DTOs
├── supabase/
│   └── migrations/                 # Versioned SQL migrations (RLS, triggers, RPCs)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

Follow these steps to run QBank locally on your development environment.

### 📋 Prerequisites
- **Node.js:** `v20.x` or higher
- **Package Manager:** `npm` or `pnpm`
- **Git**
- A free [Supabase](https://supabase.com) project (or use the pre-configured guest mode)

### ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ikramuzzaman455173/knowledge-canvas.git
   cd knowledge-canvas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
   VITE_GEMINI_API_KEY="your-google-gemini-api-key"
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Typecheck & Linting:**
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

---

## 🛡️ Database & Security Design

- **Multi-Tenant Isolation:** Every table (`question_banks`, `questions`, `tests`, `attempts`) enforces `auth.uid() = owner_id` via PostgreSQL Row Level Security.
- **Atomic Scoring:** Attempt evaluations and question aggregates are computed via server RPCs to prevent client-side score tampering.
- **Secure Key Management:** Users can either supply their personal Google Gemini API key securely in settings (stored encrypted) or leverage system-level AI orchestration.

---

## 👨‍💻 Author
 
- **Developer:** [Md. Ikramuzzaman](https://github.com/ikramuzzaman455173)
- **Portfolio:** [ikramuzzaman.vercel.app](https://ikramuzzaman.vercel.app)
- **GitHub:** [@ikramuzzaman455173](https://github.com/ikramuzzaman455173)
- **Role:** Full-Stack Software Engineer (3+ Years Experience)

---

## 📄 License & Copyright

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
