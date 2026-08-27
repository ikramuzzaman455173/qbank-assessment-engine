import { useState } from "react";
import { CheckCircle2, FileUp, LineChart, PlayCircle, Sparkles } from "lucide-react";
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
    <section id="how-it-works" className="scroll-mt-20 py-20 border-b border-border bg-canvas-grid bg-background relative">
      <div className="container-page space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-2xs rotate-[1deg]">
            <Sparkles className="size-3 text-primary" />
            <span>Simple 3-Step Flow</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How Knowledge Canvas Works
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            A frictionless learning loop designed to help you prepare faster, retain better,
            and pass with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Step Selectors with Dashed Connector Line */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 relative">
            <div className="hidden sm:block absolute left-8 top-10 bottom-10 w-0.5 border-l-2 border-dashed border-border/80 z-0" />

            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === activeStepId;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepId(step.id)}
                  className={cn(
                    "text-left p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer flex items-start gap-4 relative z-10",
                    isActive
                      ? "border-primary bg-card shadow-md -rotate-1 scale-[1.02]"
                      : "border-dashed border-border bg-card/70 hover:bg-card hover:border-solid hover:border-border text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-lg transition-all font-mono font-bold shadow-2xs",
                      isActive
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className={cn("text-base font-bold", isActive ? "text-foreground" : "text-muted-foreground")}>
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

          {/* Right Column: Clean Preview Card with Dashed Border */}
          <div className="lg:col-span-7">
            <Card className="h-full border-2 border-dashed border-border bg-card/95 shadow-md flex flex-col justify-between overflow-hidden rounded-xl">
              <CardHeader className="border-b border-dashed border-border/80 bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs border border-border">
                    {activeStep.badge}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">Stage Overview</span>
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block font-mono">
                    Core Benefits:
                  </span>
                  <div className="space-y-2.5">
                    {activeStep.previewPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm p-2 rounded-md bg-muted/20 border border-border/60">
                        <CheckCircle2 className="size-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-foreground/90 font-medium">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-border/80">
                  {activeStep.mockStats.map((st, i) => (
                    <div key={i} className="rounded-lg border border-dashed border-border bg-muted/40 p-3">
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
