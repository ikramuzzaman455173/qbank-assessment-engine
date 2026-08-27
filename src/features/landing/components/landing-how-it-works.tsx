import { useState } from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  FileUp,
  LineChart,
  Play,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
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
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "1. Upload & Ingest Questions",
    shortDesc: "Upload your PDFs or author structured multiple-choice questions in seconds with AI assistance.",
    icon: FileUp,
    badge: "Stage 01 • INGESTION",
    previewTitle: "Smart PDF & JSON Parser",
  },
  {
    id: 2,
    title: "2. Practice or Run Timed Tests",
    shortDesc: "Choose untimed practice mode for learning or start real exam simulations with timers.",
    icon: PlayCircle,
    badge: "Stage 02 • EXECUTION",
    previewTitle: "Dual-Engine Test Simulator",
  },
  {
    id: 3,
    title: "3. Analyze Mastery & Fix Weak Areas",
    shortDesc: "Review your detailed diagnostic reports, uncover weak topics, and track improvement.",
    icon: LineChart,
    badge: "Stage 03 • MASTERY",
    previewTitle: "Diagnostic Analytics & Recommendations",
  },
];

export function LandingHowItWorks() {
  const [activeStepId, setActiveStepId] = useState(1);

  // Interactive state for Stage 1 (PDF Ingestion Demo)
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionDone, setExtractionDone] = useState(false);

  // Interactive state for Stage 2 (Mini Quiz Demo)
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  // Interactive state for Stage 3 (Weakness Radar Demo)
  const [selectedTopic, setSelectedTopic] = useState<"Biology" | "Genetics" | "Chemistry">("Genetics");

  const handleSimulateExtraction = () => {
    setIsExtracting(true);
    setExtractionDone(false);
    setTimeout(() => {
      setIsExtracting(false);
      setExtractionDone(true);
    }, 1200);
  };

  const activeStep = STEPS.find((s) => s.id === activeStepId) ?? STEPS[0];
  if (!activeStep) return null;

  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 border-b border-border bg-canvas-grid bg-background relative">
      <div className="container-page space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-2xs rotate-[1deg]">
            <Sparkles className="size-3 text-primary" />
            <span>Interactive 3-Step Engine</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How Knowledge Canvas Works
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Click through each stage to test the interactive simulation live on this screen.
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
                      : "border-dashed border-border bg-card/60 hover:bg-card hover:border-solid hover:border-border text-muted-foreground",
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
                    <div className="flex items-center gap-2">
                      <h3 className={cn("text-base font-bold", isActive ? "text-foreground" : "text-muted-foreground")}>
                        {step.title}
                      </h3>
                      {isActive && (
                        <span className="text-[10px] uppercase font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {step.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Stage Simulator Widget */}
          <div className="lg:col-span-7">
            <Card className="h-full border-2 border-dashed border-border bg-card/95 shadow-md flex flex-col justify-between overflow-hidden rounded-xl">
              <CardHeader className="border-b border-dashed border-border/70 bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs border border-border">
                    {activeStep.badge}
                  </Badge>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                    Interactive Sandbox
                  </span>
                </div>
                <CardTitle className="text-xl font-bold pt-2 text-foreground">
                  {activeStep.previewTitle}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {activeStep.shortDesc}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                {/* STAGE 1 INTERACTIVE PREVIEW */}
                {activeStepId === 1 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <FileText className="size-4 text-primary" />
                          <span>biology_exam_prep.pdf (1.4 MB)</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={handleSimulateExtraction}
                          disabled={isExtracting}
                          className="text-xs h-8 gap-1.5 shadow-2xs"
                        >
                          <Bot className="size-3.5" />
                          <span>{isExtracting ? "Extracting..." : "Simulate AI Parse"}</span>
                        </Button>
                      </div>

                      {isExtracting && (
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between text-xs text-muted-foreground font-mono">
                            <span>Processing with Gemini 3.7 Flash...</span>
                            <span>80%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div className="bg-primary h-2 rounded-full w-4/5 animate-pulse" />
                          </div>
                        </div>
                      )}

                      {extractionDone && (
                        <div className="space-y-2 pt-2 border-t border-dashed border-border/70 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="size-3.5" />
                              <span>25 Questions Extracted Successfully</span>
                            </span>
                            <span className="font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              0.8s elapsed
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground bg-card p-2.5 rounded-lg border border-border">
                            <span className="font-medium text-foreground">Q1.</span> What is the role of ATP synthase in cellular respiration? <span className="text-emerald-500 font-mono font-bold">(MCQ Generated)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STAGE 2 INTERACTIVE PREVIEW */}
                {activeStepId === 2 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">Active Recall Mode</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-background px-2 py-0.5 rounded border border-border">
                          ⏱️ 14:32 REMAINING
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        Which phase of mitosis involves chromosomes lining up at the cell equator?
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {["Prophase", "Metaphase", "Anaphase", "Telophase"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setQuizAnswer(opt)}
                            className={cn(
                              "p-2 rounded-lg border text-left font-medium transition-all cursor-pointer",
                              quizAnswer === opt
                                ? opt === "Metaphase"
                                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                                  : "bg-red-500/15 border-red-500 text-red-900 dark:text-red-200"
                                : "bg-card border-border/80 hover:bg-muted",
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {quizAnswer && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1 flex items-center justify-between">
                          <span>{quizAnswer === "Metaphase" ? "✓ Correct answer selected!" : "✗ Metaphase is the correct answer."}</span>
                          <button
                            type="button"
                            onClick={() => setQuizAnswer(null)}
                            className="text-muted-foreground hover:text-foreground text-[10px] underline cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STAGE 3 INTERACTIVE PREVIEW */}
                {activeStepId === 3 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">Diagnostic Topic Mastery</span>
                        <span className="text-muted-foreground text-[11px]">Click topic to view advice</span>
                      </div>

                      {/* Topic Switcher Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        {(["Biology", "Genetics", "Chemistry"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setSelectedTopic(t)}
                            className={cn(
                              "p-2 rounded-lg border text-center text-xs font-mono font-bold transition-all cursor-pointer",
                              selectedTopic === t
                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                : "bg-card border-border text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {/* Diagnostic Feedback Callout */}
                      <div className="bg-card p-3 rounded-lg border border-border space-y-1.5 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span>{selectedTopic} Accuracy:</span>
                          <span className={cn("font-mono font-bold", selectedTopic === "Genetics" ? "text-red-500" : "text-emerald-500")}>
                            {selectedTopic === "Biology" ? "92% (Mastered)" : selectedTopic === "Genetics" ? "44% (Weak Area ⚠️)" : "88% (Proficient)"}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          {selectedTopic === "Genetics"
                            ? "Recommendation: Practice 15 additional Mendelian inheritance questions before your test."
                            : "Recommendation: Topic is strong. Maintain score with 5-minute quick revision tests."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom stats summary */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-border/70">
                  <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3">
                    <span className="text-[11px] text-muted-foreground block font-mono">Response Sync</span>
                    <span className="text-base font-bold font-mono text-foreground block pt-0.5">
                      Sub-second
                    </span>
                  </div>
                  <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3">
                    <span className="text-[11px] text-muted-foreground block font-mono">Exam Readiness</span>
                    <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 block pt-0.5">
                      +42% Average
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
