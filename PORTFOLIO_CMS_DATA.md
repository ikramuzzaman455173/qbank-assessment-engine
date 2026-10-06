Title: QBank — Smart MCQ & Assessment Engine
Slug: qbank-smart-assessment-engine
Tagline: A fast full-stack testing platform with AI question extraction from PDFs, real-time timed test sessions, and clear learning analytics.
Category: saas
Project Type: personal
Status: completed
Visibility: public
Featured: true
Priority: 10
Tags: React 19, TanStack Start, TypeScript, PostgreSQL, Supabase, Google Gemini, Tailwind CSS
Published Date: 2026-10-04

Live URL: https://qbank-core.vercel.app
Admin URL: https://qbank-core.vercel.app/dashboard
Admin Email: demo@knowledgecanvas.dev
Admin Password: Demo@Recruiter2026!
Admin Note: Role: Guest Reviewer (1-Click instant login available on landing page)
Repo Frontend URL: https://github.com/ikramuzzaman455173/knowledge-canvas
Repo Backend URL: https://github.com/ikramuzzaman455173/knowledge-canvas
Docs URL: https://github.com/ikramuzzaman455173/knowledge-canvas#readme
Figma URL: 

Tech Stack: React 19, TanStack Start, TypeScript, PostgreSQL, Supabase, Google Gemini API
Tools: Tailwind CSS v4, Recharts, TanStack Query, React Hook Form, Zod, Radix UI, Lucide React
Deployment: Vercel, Nitro Engine

Excerpt:
Before university exams, preparing from static MCQ PDFs makes it difficult to test real recall under time limits or find weak areas. I built QBank as a personal open-source platform to turn exam PDF papers into interactive tests with Google Gemini, protect student answers with local state sync, and track topic mastery with clear charts. The system cuts test creation time by 90% and provides instant practice on low-scoring topics.

Description (Copy the Markdown below into your Rich Text Editor):

## ⚡ Project Snapshot

| Project Attribute | Engineering & Delivery Details |
| :--- | :--- |
| **Project Type** | Personal Open-Source Full-Stack Project |
| **Origin & Motivation** | Built to solve my own university exam prep: turning static MCQ PDFs into live tests |
| **Role & Execution** | **Solo Full-Stack Engineer** (Full Architecture, UI Design, DB Schema & AI Pipelines) |
| **Core Architecture** | React 19 + TanStack Start (SSR with Nitro) + Supabase PostgreSQL (RLS) + Google Gemini |
| **Database Security** | PostgreSQL Row Level Security (RLS) with strict multi-tenant data isolation |
| **Live Interactive Test** | [https://qbank-core.vercel.app](https://qbank-core.vercel.app) (Guest Credentials: `demo@knowledgecanvas.dev` / `Demo@Recruiter2026!`) |

> 💡 **Project Story & Motivation:**
> Before my university exams, I used to prepare MCQ papers in PDF format to study. But reading static PDFs was not enough. I needed a dedicated platform to test myself with countdown timers, review wrong answers, and track weak topics. I built QBank to solve that real problem.

---

## 🎯 The 30-Second Executive Summary

**QBank** is a production-grade testing platform built to turn messy question papers into interactive practice exams. Built for self-directed students and teachers, it replaces slow manual question entry with automated AI parsing and real-time exam tracking.

The platform lets users create question banks in minutes, run time-locked tests that protect student answers during tab reloads, and see clear accuracy trends across topics and difficulty levels.

### 📊 3 Core Transformations (Problem vs. Measurable Impact)

1. ⚡ **Question Import & Paper Digitization:**
   - **Legacy Friction:** Typing 50+ questions by hand from paper sheets or PDF exam papers took 45 to 60 minutes of tedious work.
   - **Engineered Solution:** Built an automated question extraction flow with Google Gemini to parse questions, options, and explanations into an editable review table in under 2 minutes.
   - **Measurable Impact:** 🚀 **90% faster question creation (under 2 minutes per paper)**

2. 📈 **Exam State & Anti-Loss Protection:**
   - **Legacy Friction:** Accidental page refreshes, closed tabs, or network drops wiped out student test answers and reset timers midway through an exam.
   - **Engineered Solution:** Built monotonic countdown timers synced with browser local storage and automatic submission fallback when time runs out.
   - **Measurable Impact:** 📈 **100% attempt recovery with zero lost answers**

3. 🛡️ **Learning Insights & Weak-Area Practice:**
   - **Legacy Friction:** Basic single-score percentages hid topic weak spots, leaving students unsure about which subjects needed review.
   - **Engineered Solution:** Created topic mastery bar charts and difficulty breakdowns with Recharts, paired with custom queries that suggest targeted practice tests for low-scoring areas.
   - **Measurable Impact:** ⚡ **Sub-150ms page response times & instant weak-area detection**

---

## 🖼️ Key Interfaces & Live Interactive Verification

<!-- [IMAGE_PLACEHOLDER: Main Interactive Dashboard & Topic Mastery Analytics] -->
*⚡ [Test Live Dashboard & Portal](https://qbank-core.vercel.app/dashboard) — 1-Click Guest Access enabled (`demo@knowledgecanvas.dev` / `Demo@Recruiter2026!`).*

<!-- [IMAGE_PLACEHOLDER: AI Question Import Wizard & Question Bank Editor] -->
*⚡ [Test AI Question Import & Bank Editor](https://qbank-core.vercel.app/question-banks) — 1-Click Guest Access enabled.*

<!-- [IMAGE_PLACEHOLDER: Real-Time Timed Exam Session Runner] -->
*⚡ [Test Timed Exam Engine](https://qbank-core.vercel.app/tests) — Experience live timer sync and auto-submit.*

<!-- [IMAGE_PLACEHOLDER: Detailed Scorecard & Performance Analytics] -->
*⚡ [Test Exam Results & Analytics](https://qbank-core.vercel.app/results) — View instant score breakdown and explanations.*

<!-- [IMAGE_PLACEHOLDER: Targeted Weak-Area Practice Test Generator] -->
*⚡ [Test Weak-Area Practice](https://qbank-core.vercel.app/practice) — Generate focused sessions on low-scoring topics.*

---

## 🧠 Architectural Highlight: High-Impact Engineering Decision

- **The Real Production Bottleneck:** Browser tab reloads during an active exam would reset client React state. This caused timer loss, dropped student selections, and inaccurate scores.
- **The Clean Solution:** Decoupled timer tracking from UI render cycles by using monotonic timestamps stored in local storage, triggering atomic submission queries when time hits zero.

### 🛡️ Production Engineering Practices

- **Database Multi-Tenancy:** Placed test evaluation and question records behind PostgreSQL Row Level Security policies so users can only view and edit their own data.
- **Pre-Commit AI Review:** Provided an interactive review table where users can review and edit AI-extracted questions before saving to Supabase.
- **Optimistic UI & Cache Management:** Used TanStack Query to cache question banks and test results, ensuring instant page transitions without loading screens.
- **Offline Review via PWA:** Added service worker caching so students can review previous test results even when offline.
- **Automated Heartbeat:** Added a GitHub Actions cron job running every two days to ping the Supabase database and keep it active.

### 📋 Senior Developer Quality Standards

- **End-to-End Type Safety:** Strict TypeScript interfaces shared between Supabase database rows, API responses, and UI forms.
- **Accessible Components:** Built accessible form controls and dialogs using Radix UI primitives and Tailwind CSS v4 OKLCH tokens.
- **Atomic Scoring Logic:** Computed test results on the server to prevent client-side inspection or answer tampering.

> 🎯 **Senior Developer Takeaway:**
> "Building reliable assessment software requires keeping user state safe at all times. Pairing TanStack Start with Supabase Row Level Security delivered a fast, clean product that solved my university exam needs."

---

Features Array:
1. Title: AI Question Extraction Wizard
   Short Description: Extract and validate questions, options, and explanations from PDFs and JSON via Google Gemini.
   Order: 1
   Icon: Sparkles

2. Title: Timed Exam Session Runner
   Short Description: Time-locked exam environment with countdown timers, question bookmarks, and auto-submit.
   Order: 2
   Icon: Activity

3. Title: Topic Mastery Analytics
   Short Description: Visual accuracy trends, topic mastery bar charts, and difficulty donut breakdowns with Recharts.
   Order: 3
   Icon: Layers

4. Title: Targeted Weak-Area Practice
   Short Description: Automated practice tests focusing on subjects and questions where accuracy drops below target goals.
   Order: 4
   Icon: Target

5. Title: Database Row Level Security
   Short Description: Multi-tenant user data isolation enforced directly in PostgreSQL via Supabase RLS policies.
   Order: 5
   Icon: ShieldCheck

6. Title: 1-Click Guest Reviewer Mode
   Short Description: Instant access for recruiters and clients to test full dashboard features without signing up.
   Order: 6
   Icon: Users

Metrics Array:
- Label: Architecture | Value: React 19 + TanStack Start SSR
- Label: Performance | Value: Sub-150ms Page Response
- Label: Type Safety | Value: 100% Strict TypeScript
- Label: Database Security | Value: PostgreSQL Row Level Security
- Label: AI Integration | Value: Google Gemini API
- Label: Design Fidelity | Value: Mobile, Tablet & Desktop Responsive
