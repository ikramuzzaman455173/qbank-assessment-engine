import { useState } from "react";
import { ArrowRight, CheckCircle2, FileUp, LineChart, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    title: "1. Create or Import Questions",
    shortDesc: "Upload your PDFs or author structured multiple-choice questions in seconds.",
    icon: FileUp,
    badge: "Step 1: Ingestion",
    previewTitle: "PDF & JSON Import Engine",
    previewPoints: [
      "Instant multi-page PDF question extraction",
      "Assign topic tags and difficulty ratings (Easy, Medium, Hard)",
      "Set rich explanations and source references",
    ],
    mockStats: [
      { label: "Extraction Speed", value: "< 2.5s" },
      { label: "Accuracy", value: "99.4%" },
    ],
  },
  {
    id: 2,
    title: "2. Practice or Run Timed Tests",
    shortDesc: "Choose untimed practice mode for learning or start real exam simulations.",
    icon: PlayCircle,
    badge: "Step 2: Execution",
    previewTitle: "Flexible Test Taking Engine",
    previewPoints: [
      "Practice Mode: Reveal instant solutions and explanations",
      "Test Mode: Timed sessions with question navigation palette",
      "Mark questions for review and auto-save attempts",
    ],
    mockStats: [
      { label: "Test Modes", value: "2 (Study / Exam)" },
      { label: "Session Saving", value: "Auto & Live" },
    ],
  },
  {
    id: 3,
    title: "3. Analyze Mastery & Excel",
    shortDesc: "Review your detailed diagnostic reports, uncover weak topics, and track improvement.",
    icon: LineChart,
    badge: "Step 3: Mastery",
    previewTitle: "Diagnostic Analytics & Weak Areas",
    previewPoints: [
      "Topic-wise breakdown and accuracy percentages",
      "Actionable recommendations to fix weak areas",
      "Historical score trends and test attempt logs",
    ],
    mockStats: [
      { label: "Accuracy Insights", value: "Per Topic" },
      { label: "Feedback", value: "Actionable" },
    ],
  },
];

export function LandingHowItWorks() {
  const [activeStepId, setActiveStepId] = useState(1);
  const activeStep = STEPS.find((s) => s.id === activeStepId) ?? STEPS[0];
  if (!activeStep) return null;

  return (
    <section id="how-it-works" className="py-20 border-b border-border">
      <div className="container-page space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="outline" className="text-xs font-medium uppercase tracking-wider">
            Simple 3-Step Workflow
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
                    "text-left p-5 rounded-lg border transition-all cursor-pointer flex items-start gap-4",
                    isActive
                      ? "border-foreground/40 bg-card shadow-xs"
                      : "border-border/60 bg-muted/20 hover:bg-muted/50 hover:border-border",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {step.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Visual Stage Card */}
          <div className="lg:col-span-7">
            <Card className="h-full border border-border bg-card shadow-sm flex flex-col justify-between overflow-hidden">
              <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {activeStep.badge}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Interactive Stage Preview</span>
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
                    Core Capabilities:
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

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60">
                  {activeStep.mockStats.map((st, i) => (
                    <div key={i} className="rounded-md border border-border/80 bg-muted/30 p-3">
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
