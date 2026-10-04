import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  Github,
  Globe,
  HelpCircle,
  RefreshCw,
  Scale,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { LandingFooter } from "@/features/landing/components/landing-footer";

export const Route = createFileRoute("/terms")({
  component: TermsOfServicePage,
});

export function TermsOfServicePage() {
  const lastUpdated = "August 28, 2026";

  const keyHighlights = [
    {
      icon: Users,
      title: "For Learners & Educators",
      desc: "Designed to help students, teachers, and professionals practice and master knowledge.",
    },
    {
      icon: FileCheck,
      title: "Your Content Ownership",
      desc: "You retain all rights and ownership to the questions, PDFs, and data you upload.",
    },
    {
      icon: Sparkles,
      title: "AI Study Assistance",
      desc: "AI helps extract and structure MCQs quickly, with full manual review capability.",
    },
    {
      icon: ShieldAlert,
      title: "Responsible Use",
      desc: "Please respect copyrights and use the platform for lawful learning purposes.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground scroll-smooth">
      <main className="flex-1 py-8 md:py-12">
        <div className="container-page max-w-4xl space-y-10">
          {/* Top Navigation Bar (Headerless, clean) */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Link to={ROUTES.landing}>
                <ArrowLeft className="size-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Effective Date: {lastUpdated}
              </span>
              <ThemeToggle />
            </div>
          </div>

          {/* Header Banner */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Scale className="size-3.5 text-primary" />
              <span>Terms of Service</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
              Welcome to Knowledge Canvas. By accessing or using our application, you agree to
              comply with and be bound by these terms. Please read them carefully.
            </p>
          </div>

          {/* Quick Summary Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx} className="border-border bg-card/60 shadow-2xs">
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <CardTitle className="text-sm font-semibold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator />

          {/* Detail Sections */}
          <div className="space-y-10 text-sm leading-relaxed text-foreground/90">
            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  01
                </Badge>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Acceptance of Terms
                </h2>
              </div>
              <p className="text-muted-foreground">
                By creating an account, accessing, or using Knowledge Canvas, you signify your
                agreement to these Terms of Service. If you do not agree with any part of these
                terms, please discontinue using the service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  02
                </Badge>
                <h2 className="font-display text-xl font-bold text-foreground">
                  User Accounts & Security
                </h2>
              </div>
              <p className="text-muted-foreground">
                To access test creation, question banks, and progress analytics, you must register
                for an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                <li>Maintaining the confidentiality of your login credentials.</li>
                <li>All activities that occur under your registered account.</li>
                <li>Notifying us immediately if you suspect unauthorized access.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  03
                </Badge>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Acceptable Use Policy
                </h2>
              </div>
              <p className="text-muted-foreground">
                Knowledge Canvas is intended as an educational platform. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                <li>Upload materials containing malicious code, viruses, or disruptive scripts.</li>
                <li>
                  Attempt to bypass database security, API rate limits, or user authentication.
                </li>
                <li>
                  Use automated scripts or scrapers to overwhelm the application infrastructure.
                </li>
                <li>
                  Upload content that violates third-party intellectual property or copyright laws.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  04
                </Badge>
                <h2 className="font-display text-xl font-bold text-foreground">
                  User Content & Ownership
                </h2>
              </div>
              <p className="text-muted-foreground">
                You retain complete intellectual property rights to the questions, answers, notes,
                and PDF documents you create or upload to Knowledge Canvas. We do not claim
                ownership of your study content. By uploading content, you grant Knowledge Canvas
                the limited license to store, process, and display that content solely for your
                private usage and testing.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  05
                </Badge>
                <h2 className="font-display text-xl font-bold text-foreground">
                  AI Features & Accuracy Disclaimer
                </h2>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <Sparkles className="size-4 text-primary" />
                  <span>AI Assistance Notice</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our PDF-to-MCQ conversion and question parsing features utilize Gemini AI to
                  assist you. While we strive for high precision, AI-generated outputs can
                  occasionally contain inaccuracies. Users are encouraged to review extracted
                  questions before taking high-stakes practice exams.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  06
                </Badge>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Limitation of Liability
                </h2>
              </div>
              <p className="text-muted-foreground">
                Knowledge Canvas is provided on an "as is" and "as available" basis without
                warranties of any kind. We are not liable for any direct, indirect, incidental, or
                consequential damages resulting from the use or inability to use the platform.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  07
                </Badge>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Developer Attribution & Inquiries
                </h2>
              </div>
              <p className="text-muted-foreground">
                This project is developed and maintained by <strong>Ikramuzzaman</strong>. For
                questions regarding these terms, feedback, or collaboration:
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button variant="outline" size="sm" asChild className="gap-2 shadow-2xs">
                  <a
                    href="https://ikramuzzaman.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="size-4 text-primary" />
                    <span>Developer Portfolio</span>
                    <ExternalLink className="size-3 opacity-60" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="gap-2 shadow-2xs">
                  <a
                    href="https://github.com/ikramuzzaman455173"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-4" />
                    <span>GitHub Profile</span>
                    <ExternalLink className="size-3 opacity-60" />
                  </a>
                </Button>
              </div>
            </section>
          </div>

          <Separator />

          {/* Footer Navigation Link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="size-3.5" />
              <span>Looking for our data privacy details?</span>
            </div>
            <Button variant="default" size="sm" asChild className="font-medium">
              <Link to={ROUTES.privacy}>Read Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
