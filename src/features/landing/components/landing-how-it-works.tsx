import { useState } from "react";
import { CheckCircle2, FileUp, LineChart, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  shortDesc: string;
  icon: typeof FileUp;
  badge: string;
  previewTitle: string;
  previewPoints: string[];
  mockStats: { label: string; value: string }[];
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "1. Upload & Ingest Questions",
    shortDesc: "Upload your PDFs or author structured multiple-choice questions in seconds with AI assistance.",
    icon: FileUp,
    badge: "Step 01 • Ingestion",
    previewTitle: "Smart PDF & JSON Parser",
    previewPoints: [
      "Instant multi-page PDF question extraction",
      "Automatic topic classification & difficulty tagging",
      "Rich explanation generation and schema validation",
    ],
    mockStats: [
      { label: "Extraction Speed", value: "< 2.5s" },
      { label: "AI Accuracy", value: "99.4%" },
    ],
  },
  {
    id: 2,
    title: "2. Practice or Run Timed Tests",
    shortDesc: "Choose untimed practice mode for learning or start real exam simulations with timers.",
    icon: PlayCircle,
    badge: "Step 02 • Execution",
    previewTitle: "Dual-Engine Test Simulator",
    previewPoints: [
      "Practice Mode: Reveal instant solutions and step-by-step rationales",
      "Test Mode: Timed countdowns with question navigation palette",
      "Mark questions for review and auto-save attempts live",
    ],
    mockStats: [
      { label: "Study Modes", value: "2 (Practice / Exam)" },
      { label: "Progress Sync", value: "Live & Saved" },
    ],
  },
  {
    id: 3,
    title: "3. Analyze Mastery & Fix Weak Areas",
    shortDesc: "Review your detailed diagnostic reports, uncover weak topics, and track improvement.",
    icon: LineChart,
    badge: "Step 03 • Mastery",
    previewTitle: "Diagnostic Analytics & Recommendations",
    previewPoints: [
      "Topic-wise breakdown and accuracy percentages",
      "Actionable recommendations to fix weak areas",
      "Historical score trends and test attempt logs",
    ],
    mockStats: [
      { label: "Diagnostic Accuracy", value: "Topic-Level" },
      { label: "Feedback", value: "Actionable" },
    ],
  },
];

export function LandingHowItWorks() {
  const [activeStepId, setActiveStepId] = useState(1);
  const activeStep = STEPS.find((s) => s.id === activeStepId) ?? STEPS[0];
  if (!activeStep) return null;

  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 border-b border-border bg-background">
      <div className="container-page space-y-12">
        {/* Clean Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="outline" className="text-xs font-medium uppercase tracking-wider">
            Simple 3-Step Flow
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How Knowledge Canvas Works
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            A frictionless learning loop designed to help you prepare faster, retain better,
            and pass with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Step Selectors */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === activeStepId;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepId(step.id)}
                  className={cn(
                    "text-left p-5 rounded-xl border transition-all cursor-pointer flex items-start gap-4",
                    isActive
                      ? "border-primary bg-card shadow-xs"
                      : "border-border/80 bg-muted/20 hover:bg-muted/50 hover:border-border text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className={cn("text-base font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {step.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Clean Preview Card */}
          <div className="lg:col-span-7">
            <Card className="h-full border border-border bg-card shadow-xs flex flex-col justify-between overflow-hidden rounded-xl">
              <CardHeader className="border-b border-border bg-muted/20 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {activeStep.badge}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Workflow Overview</span>
                </div>
                <CardTitle className="text-xl font-bold pt-2 text-foreground">
                  {activeStep.previewTitle}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {activeStep.shortDesc}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Core Benefits:
                  </span>
                  <div className="space-y-2.5">
                    {activeStep.previewPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="size-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                  {activeStep.mockStats.map((st, i) => (
                    <div key={i} className="rounded-lg border border-border bg-muted/30 p-3">
                      <span className="text-xs text-muted-foreground block">{st.label}</span>
                      <span className="text-lg font-bold font-mono text-foreground block pt-0.5">
                        {st.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
