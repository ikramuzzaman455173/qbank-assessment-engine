# Knowledge Canvas

# STEP 01 — PROJECT CONSTITUTION & PRODUCTION FOUNDATION

## ROLE

Act as a senior full-stack software architect, senior React/TypeScript engineer, product engineer, UI/UX engineer, and codebase maintainer.

You are not building a throwaway prototype or a simple demo.

You are establishing the foundation of a real, production-grade web application that will be developed incrementally through multiple controlled development stages.

The application must be maintainable, scalable, secure, responsive, reusable, and professionally structured.

IMPORTANT:

Do not rush into implementing every feature in this step.

This step is primarily about establishing the project's architecture, coding standards, design-system foundation, folder structure, reusable-component strategy, application conventions, and development rules that all future steps must follow.

---

# 1. PRODUCT CONTEXT

We are building a generalized:

"MCQ Question Bank & Smart Test Platform"

The platform allows authenticated users to:

- Create and manage Question Banks

- Manually create MCQs

- Import MCQs from JSON

- Upload PDF files containing MCQs

- Extract and normalize existing MCQs from provided sources

- Review imported questions before saving

- Generate custom tests

- Practice questions

- Take exam-style tests

- Track answers and attempts

- Track weak/wrong/unattempted questions

- Track progress and mastery

- View test history

- View analytics

- Practice weak questions intelligently

The platform must support many different subjects and topics.

It must NOT be designed specifically around one subject, one PDF, or one user's current 90 questions.

The architecture must remain generalized.

---

# 2. CORE PRODUCT PRINCIPLE

The most important data rule of this platform is:

USER-PROVIDED DATA IS THE SOURCE OF TRUTH.

Normal test generation must ONLY use questions that exist inside the authenticated user's selected Question Bank.

Never silently introduce:

- External questions

- Internet questions

- Random AI-generated questions

- General knowledge questions

- Questions from another user's Question Bank

- Questions from another user's uploaded files

unless the user explicitly activates a future, separate AI question-generation feature.

AI must never silently modify the normal Question Bank.

---

# 3. FINAL TECHNOLOGY DIRECTION

Use the following technology direction as the project's foundation.

## Frontend

- React

- TypeScript

- Vite

- React Router

- Tailwind CSS

- shadcn/ui

- TanStack Query

- React Hook Form

- Zod

## Backend / Platform

Use Supabase as the primary backend platform.

Use:

- Supabase Authentication

- Supabase PostgreSQL

- Supabase Storage

- Supabase Row Level Security

- Supabase Edge Functions for server-side/business logic where required

## AI

- Gemini API

AI integration must be server-side and must never expose secret API keys in the browser.

## Important

Do NOT introduce:

- Node.js + Express backend server

- MongoDB

- Prisma

- another authentication provider

- another database

- another backend-as-a-service platform

unless a future requirement explicitly justifies changing the architecture.

Keep the architecture intentionally simple and coherent.

---

# 4. ARCHITECTURE PRINCIPLE

Use a clean, modular, feature-oriented architecture.

Separate:

- UI

- reusable components

- feature logic

- data access

- business logic

- validation

- utilities

- configuration

Do not put complex business logic directly inside React page components.

Do not create giant components.

Do not create duplicate components when an existing reusable component can be used.

Do not mix unrelated responsibilities.

---

# 5. FRONTEND FOLDER STRUCTURE

Establish a clean structure similar to:

src/

├── app/

│ ├── routes/

│ ├── providers/

│ └── config/

│

├── components/

│ ├── ui/

│ ├── common/

│ └── layout/

│

├── features/

│ ├── auth/

│ ├── dashboard/

│ ├── question-banks/

│ ├── questions/

│ ├── imports/

│ ├── tests/

│ ├── practice/

│ └── analytics/

│

├── hooks/

├── lib/

├── services/

├── types/

├── constants/

├── utils/

├── assets/

└── styles/

You may refine this structure if there is a strong technical reason, but keep the same architectural principles.

Do not create unnecessary folders merely for the sake of complexity.

---

# 6. REUSABLE COMPONENT ARCHITECTURE

This is a strict requirement.

The application must use reusable components wherever practical.

Establish three levels:

## UI primitives

Examples:

- Button

- Input

- Textarea

- Select

- Checkbox

- Radio

- Dialog

- Dropdown

- Tooltip

- Badge

- Card

- Tabs

- Table

- Pagination

- Progress

- Skeleton

## Common components

Examples:

- PageHeader

- SearchBar

- FilterBar

- EmptyState

- LoadingState

- ErrorState

- ConfirmDialog

- StatusBadge

- DataTable

- FormSection

## Feature components

Examples:

- QuestionCard

- QuestionEditor

- QuestionBankCard

- TestConfiguration

- TestQuestionNavigator

- ResultSummary

- ProgressCard

Before creating any new component:

1. Inspect the existing component library.

2. Reuse an existing component if possible.

3. Extend an existing component if appropriate.

4. Only create a new component when it has a genuinely different responsibility.

Never create duplicate components with slightly different names.

---

# 7. DESIGN SYSTEM — LOCK THE VISUAL LANGUAGE

Create a professional, modern education/productivity SaaS visual identity.

The application must feel like a real production product, not:

- a school project

- a basic CRUD dashboard

- a generic admin template

- a colorful quiz game

- an AI-generated prototype

The design should feel:

- Clean

- Modern

- Professional

- Calm

- Trustworthy

- Focused

- Comfortable for long study sessions

- Consistent

- Responsive

Avoid excessive gradients, excessive shadows, unnecessary animations, oversized cards, random colors, and decorative elements that do not improve usability.

---

# 8. DESIGN TOKENS

Centralize and consistently use:

- Colors

- Typography

- Font sizes

- Font weights

- Spacing

- Border radius

- Shadows

- Transitions

- Breakpoints

Do not hard-code random visual values throughout individual components when a design token or reusable utility can be used.

If a future feature requires a new visual pattern, extend the established design system instead of creating an isolated visual style.

---

# 9. THEME CONSISTENCY

Theme consistency is mandatory.

Every future page must follow the same:

- color language

- typography

- spacing

- component styling

- interaction patterns

- border treatment

- button styles

- form styles

- table styles

- modal styles

- status styles

Never introduce a random new color or visual pattern for one page.

Support:

- Light theme

- Dark theme

Both themes must remain readable and professionally balanced.

Do not make dark mode an afterthought.

---

# 10. RESPONSIVE DESIGN

The application must be responsive from the beginning.

Support:

- Desktop

- Laptop

- Tablet

- Mobile

Do not build desktop-only layouts and "fix mobile later."

Important areas such as test-taking and question practice must have an excellent mobile experience.

Avoid horizontal scrolling wherever it is not genuinely required.

---

# 11. UX PRINCIPLES

Every future feature must provide appropriate:

- Loading states

- Skeleton states

- Empty states

- Error states

- Success states

- Validation messages

- Confirmation dialogs

- Disabled states

- Hover/focus states

Never leave the user staring at a blank page while data is loading.

Error messages should be understandable to normal users.

Avoid exposing raw technical errors to users.

---

# 12. ACCESSIBILITY

Build with accessibility in mind from the foundation.

Maintain:

- Semantic HTML

- Keyboard navigation

- Visible focus states

- Proper labels

- Accessible dialogs

- Accessible form controls

- Appropriate contrast

- Screen-reader-friendly structure

Do not rely only on color to communicate status.

---

# 13. TYPESCRIPT RULES

Use TypeScript strictly.

Avoid unnecessary:

- `any`

- unsafe type assertions

- duplicated interfaces

- inline anonymous data structures for important domain entities

Create centralized and reusable domain types where appropriate.

Keep API/data types consistent with the application architecture.

Do not disable TypeScript checks simply to make errors disappear.

---

# 14. DATA VALIDATION

Use Zod for important client-side and server/Edge Function validation.

Validate:

- Forms

- API inputs

- Imported JSON

- AI-generated structured responses

- Test configuration

- User-provided data

Never trust client input.

Validation must happen again at the server/database boundary where appropriate.

---

# 15. SUPABASE RULES

Use Supabase as the core backend platform.

Use:

## Supabase Auth

For:

- Registration

- Login

- Logout

- Password recovery

- Session management

## PostgreSQL

For persistent application data.

## Storage

For uploaded files such as:

- PDF sources

- Future supported documents

## Row Level Security

RLS is mandatory for private user-owned data.

A user must never be able to access another user's:

- Question Banks

- Questions

- Tests

- Attempts

- Progress

- Uploaded sources

- Analytics data

Do not rely only on frontend checks for security.

---

# 16. DATABASE DESIGN PRINCIPLES

The final database will eventually contain entities such as:

- profiles/users

- question_banks

- questions

- uploaded_sources

- tests

- test_questions

- attempts

- attempt_answers

- question_progress

Do NOT fully implement all feature schemas in this step unless necessary for the foundation.

However, establish the architecture so these entities can be added cleanly in later steps.

Keep relationships, ownership, timestamps, indexes, constraints, and RLS policies in mind from the beginning.

---

# 17. BUSINESS LOGIC RULE

Business logic must not be tightly coupled to visual components.

For example:

The logic for selecting 20 questions from a 90-question Question Bank must eventually live in a dedicated business-logic/service layer, not inside a React component.

Similarly:

- scoring

- question selection

- progress calculation

- mastery calculation

- import normalization

- PDF processing

- AI processing

must be modular and independently testable.

---

# 18. AI ARCHITECTURE RULES

Gemini will be used for AI-related features such as future PDF/MCQ extraction and optional AI assistance.

Important:

Never expose Gemini API secrets in frontend code.

AI requests requiring secrets must run server-side through Supabase Edge Functions.

AI output must always be validated before being treated as application data.

For normal PDF extraction:

AI must extract existing questions from the provided source.

It must NOT invent new questions unless the user explicitly requests AI-generated questions in a future dedicated feature.

---

# 19. SECURITY PRINCIPLES

Security must be considered from the beginning.

Follow:

- Secure authentication

- RLS

- Least-privilege access

- Input validation

- File validation

- File size limits

- Safe error handling

- Secret management

- No exposed API keys

- No sensitive information in frontend source

- Proper authorization checks

Never trust:

- URL IDs

- client-side user IDs

- client-side permissions

- hidden UI elements

- request payloads

Always verify ownership server-side/database-side.

---

# 20. CODE QUALITY RULES

Follow professional engineering standards.

Requirements:

- Meaningful names

- Small focused components

- Single responsibility

- DRY principles

- No unnecessary duplication

- No dead code

- No commented-out abandoned code

- No temporary hacks

- No console spam

- No fake production implementations

- No unnecessary dependencies

- No magic values when constants/configuration are appropriate

Do not over-engineer.

Prefer simple, maintainable solutions.

---

# 21. MOCK DATA RULE

Mock/demo data may be used ONLY when necessary for visual foundation work in this step.

Do not design the architecture around hardcoded demo data.

Do not permanently embed the current 90-question dataset into the application.

The application must remain generalized.

Future real data must come from Supabase.

---

# 22. ROUTING FOUNDATION

Establish a scalable route structure.

Public:

- Landing

- Login

- Register

- Forgot Password

Protected:

- Dashboard

- Question Banks

- Question Bank Details

- Tests

- Practice

- Analytics

- Settings

Do not fully implement all pages yet.

Create only the routing foundation and appropriate placeholders where needed.

---

# 23. STATE MANAGEMENT PRINCIPLE

Do not introduce a global state library unless it is actually necessary.

Prefer:

- React state for local UI state

- TanStack Query for server state

- Context only for truly global application concerns

Do not duplicate server state into unnecessary global stores.

---

# 24. ERROR HANDLING FOUNDATION

Establish a consistent error-handling strategy.

Differentiate:

- Validation errors

- Authentication errors

- Authorization errors

- Not found

- Network errors

- Server errors

- Unexpected errors

Create reusable error UI patterns.

Do not expose stack traces or internal database errors to end users.

---

# 25. PERFORMANCE PRINCIPLES

Keep performance in mind from the beginning.

Avoid:

- unnecessary re-renders

- huge components

- unnecessary API calls

- loading entire datasets when pagination is appropriate

- unnecessary dependencies

- duplicate network requests

Future Question Banks and test history may contain thousands of records, so architecture must scale beyond demo-sized data.

---

# 26. WHAT NOT TO DO IN THIS STEP

Do NOT:

- Build all application features now

- Build the full PDF extraction system now

- Build the full Test Engine now

- Build analytics now

- Add unnecessary AI features

- Add unrelated features

- Change the chosen technology stack

- Create a second design system

- Create duplicate components

- Create fake backend behavior that will later need to be rewritten

- Use localStorage as the primary database

- hardcode application data as a permanent solution

This step is about establishing a strong foundation.

---

# 27. DEVELOPMENT BEHAVIOR FOR ALL FUTURE STEPS

Treat this project as an existing production codebase after this step.

For every future implementation:

1. Inspect the existing architecture first.

2. Reuse existing components.

3. Reuse existing utilities.

4. Follow the existing design system.

5. Follow the existing naming conventions.

6. Preserve working functionality.

7. Do not rewrite unrelated code.

8. Do not create duplicate functionality.

9. Keep changes scoped to the requested milestone.

10. Test affected functionality.

11. Check for regressions.

12. Keep the application buildable.

If a future requirement conflicts with the established architecture, explain the conflict and choose the smallest maintainable architectural adjustment.

---

# 28. GIT / CHANGE DISCIPLINE

Structure the codebase so future development can be safely version-controlled.

Avoid huge unrelated changes.

Keep each development milestone logically isolated.

Do not generate unnecessary files.

Do not modify configuration files without a technical reason.

---

# 29. ACCEPTANCE CRITERIA FOR STEP 01

This step is complete only when:

### Architecture

- The project uses the agreed React + TypeScript + Vite direction.

- Supabase is established as the backend platform.

- The project has a clean scalable folder structure.

- Feature-oriented organization is established.

### UI

- A consistent design system exists.

- Light and dark themes are supported.

- Reusable UI primitives are established.

- Responsive foundations are established.

### Code Quality

- TypeScript is configured correctly.

- Reusable components are organized properly.

- No unnecessary duplicate components exist.

- Naming conventions are consistent.

- No major lint/type issues remain.

### Application

- The application runs successfully.

- Routing foundation exists.

- Public/protected route architecture is prepared.

- Supabase integration foundation is prepared.

- Environment variable strategy is established.

- No secrets are committed to source code.

### UX

- Loading/error/empty-state patterns are established.

- Accessibility fundamentals are established.

- Responsive behavior is established.

---

# 30. IMPORTANT FINAL INSTRUCTION

Do not treat this prompt as permission to implement the entire application.

This is STEP 01 only.

The goal is to create a strong, clean, production-grade foundation that future development steps can safely build upon.

Before finishing:

1. Inspect the entire generated codebase.

2. Remove unnecessary duplication.

3. Verify the folder structure.

4. Verify TypeScript configuration.

5. Verify the design system.

6. Verify responsive foundations.

7. Verify Supabase configuration strategy.

8. Verify routing foundation.

9. Verify there are no exposed secrets.

10. Run the application and resolve build/type/lint issues.

11. Ensure the project is ready for STEP 02.

Do not move on to STEP 02 automatically.

Stop after STEP 01 is properly implemented and verified.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5de5e5dd-49c0-4e5e-a292-4028fea0716c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
