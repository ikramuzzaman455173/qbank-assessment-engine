import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bot,
  Database,
  ExternalLink,
  Github,
  Globe,
  Lock,
  Mail,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingHeader } from "@/features/landing/components/landing-header";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicyPage,
});

export function PrivacyPolicyPage() {
  const lastUpdated = "August 28, 2026";

  const keyPrinciples = [
    {
      icon: ShieldCheck,
      title: "Data Ownership",
      desc: "You own all questions, study notes, and test attempts you create or upload.",
    },
    {
      icon: Lock,
      title: "Zero Data Selling",
      desc: "We do not sell, rent, or monetize your personal or educational data to third parties.",
    },
    {
      icon: Bot,
      title: "Responsible AI Usage",
      desc: "Gemini AI is only invoked to extract or format questions with strict schema validation.",
    },
    {
      icon: UserCheck,
      title: "User Control",
      desc: "You can modify, export, or delete your questions and account data at any time.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground scroll-smooth">
      <LandingHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="container-page max-w-4xl space-y-10">
          {/* Top Breadcrumbs & Back Link */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground hover:text-foreground">
              <Link to={ROUTES.landing}>
                <ArrowLeft className="size-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground">Effective Date: {lastUpdated}</span>
          </div>

          {/* Header Banner */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Shield className="size-3.5 text-primary" />
              <span>Transparency & Security</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
              At Knowledge Canvas, your privacy and trust are our top priorities. This policy explains
              what data we collect, how it is processed, and how your study materials remain secure.
            </p>
          </div>

          {/* Quick Summary Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyPrinciples.map((item, idx) => {
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

          {/* Policy Detail Sections */}
          <div className="space-y-10 text-sm leading-relaxed text-foreground/90">
            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">01</Badge>
                <h2 className="font-display text-xl font-bold text-foreground">Information We Collect</h2>
              </div>
              <p className="text-muted-foreground">
                We only gather information necessary to provide you with smart question bank management and test simulations:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                <li>
                  <strong className="text-foreground">Account Information:</strong> Email address and authentication credentials managed securely via Supabase Auth.
                </li>
                <li>
                  <strong className="text-foreground">Question Banks & Content:</strong> Questions, options, explanations, tags, and topics you manually enter or import via PDF/JSON files.
                </li>
                <li>
                  <strong className="text-foreground">Test & Practice Activity:</strong> Test attempts, question responses, time spent, score percentages, and topic mastery analytics to generate performance metrics.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">02</Badge>
                <h2 className="font-display text-xl font-bold text-foreground">How We Use Your Information</h2>
              </div>
              <p className="text-muted-foreground">
                Your data is strictly used to deliver and enhance the core learning functionality:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                <li>Providing question bank storage, search, and organization.</li>
                <li>Simulating real-time timed tests and computing comprehensive score breakdowns.</li>
                <li>Generating weakness radar and topic performance graphs on your private dashboard.</li>
                <li>Authenticating and maintaining your active login sessions safely.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">03</Badge>
                <h2 className="font-display text-xl font-bold text-foreground">AI Processing & Google Gemini</h2>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <Bot className="size-4 text-primary" />
                  <span>Automated MCQ Extraction</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When you utilize the PDF import or AI question generation features, text from your uploaded document is sent to Google Gemini APIs (<code className="bg-background px-1 py-0.5 rounded text-primary">gemini-3.7-flash</code>, <code className="bg-background px-1 py-0.5 rounded text-primary">gemini-3.6-flash</code>, <code className="bg-background px-1 py-0.5 rounded text-primary">gemini-3.5-flash</code>, or <code className="bg-background px-1 py-0.5 rounded text-primary">gemini-3.1-pro</code>) strictly to structure questions into JSON. We do not use your proprietary documents to train public AI models.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">04</Badge>
                <h2 className="font-display text-xl font-bold text-foreground">Data Storage & Security</h2>
              </div>
              <p className="text-muted-foreground">
                All data is housed in enterprise-grade PostgreSQL infrastructure backed by Supabase with Row Level Security (RLS). Every table requires cryptographic authentication, ensuring that only you can read, modify, or delete your question banks and attempt logs.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">05</Badge>
                <h2 className="font-display text-xl font-bold text-foreground">Your Rights & Data Deletion</h2>
              </div>
              <p className="text-muted-foreground">
                You maintain complete authority over your records. You can delete any individual question, question bank, or clear your test history directly from the user interface. If you wish to delete your entire account, all associated records are permanently purged from the database.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">06</Badge>
                <h2 className="font-display text-xl font-bold text-foreground">Developer Credit & Contact</h2>
              </div>
              <p className="text-muted-foreground">
                Knowledge Canvas is developed with care by <strong>Ikramuzzaman</strong>. If you have any questions, privacy inquiries, or feedback regarding the platform, feel free to reach out directly:
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button variant="outline" size="sm" asChild className="gap-2 shadow-2xs">
                  <a href="https://ikramuzzaman.vercel.app" target="_blank" rel="noopener noreferrer">
                    <Globe className="size-4 text-primary" />
                    <span>Developer Portfolio</span>
                    <ExternalLink className="size-3 opacity-60" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="gap-2 shadow-2xs">
                  <a href="https://github.com/ikramuzzaman455173" target="_blank" rel="noopener noreferrer">
                    <Github className="size-4" />
                    <span>GitHub Profile</span>
                    <ExternalLink className="size-3 opacity-60" />
                  </a>
                </Button>
              </div>
            </section>
          </div>

          <Separator />

          {/* Footer Navigation CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="size-3.5" />
              <span>Review our companion agreement:</span>
            </div>
            <Button variant="default" size="sm" asChild className="font-medium">
              <Link to={ROUTES.terms}>View Terms of Service</Link>
            </Button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
