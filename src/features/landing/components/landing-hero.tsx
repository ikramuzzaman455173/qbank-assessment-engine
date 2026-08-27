import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useSession } from "@/features/auth/hooks/use-session";

interface DemoQuestion {
  id: number;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: { id: "A" | "B" | "C" | "D"; text: string }[];
  correct: "A" | "B" | "C" | "D";
  explanation: string;
}

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: 1,
    topic: "Computer Science",
    difficulty: "Medium",
    question: "What is the average time complexity of searching an element in a balanced Binary Search Tree (AVL Tree)?",
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(log n)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(n log n)" },
    ],
    correct: "B",
    explanation: "Because an AVL tree maintains a strictly balanced height of log₂(n), search, insertion, and deletion all execute in O(log n) time.",
  },
  {
    id: 2,
    topic: "Biology",
    difficulty: "Easy",
    question: "Which organelle is widely known as the 'powerhouse of the cell'?",
    options: [
      { id: "A", text: "Nucleus" },
      { id: "B", text: "Ribosome" },
      { id: "C", text: "Mitochondria" },
      { id: "D", text: "Endoplasmic Reticulum" },
    ],
    correct: "C",
    explanation: "Mitochondria generate most of the chemical energy needed to power the biochemical reactions of the cell through cellular respiration.",
  },
  {
    id: 3,
    topic: "Mathematics",
    difficulty: "Hard",
    question: "What is the derivative of f(x) = ln(x² + 1) with respect to x?",
    options: [
      { id: "A", text: "2x / (x² + 1)" },
      { id: "B", text: "1 / (x² + 1)" },
      { id: "C", text: "2 / (x² + 1)" },
      { id: "D", text: "x / (x² + 1)" },
    ],
    correct: "A",
    explanation: "Using the chain rule: d/dx[ln(u)] = (1/u) * du/dx. Here u = x² + 1 and du/dx = 2x, so the derivative is 2x / (x² + 1).",
  },
];

export function LandingHero() {
  const { session } = useSession();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const sandboxRef = useRef<HTMLDivElement>(null);

  const activeQ = DEMO_QUESTIONS[currentIdx] ?? DEMO_QUESTIONS[0];
  if (!activeQ) return null;

  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === activeQ.correct;

  useEffect(() => {
    if (isAnswered) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isAnswered, currentIdx]);

  const handleSelect = (optionId: "A" | "B" | "C" | "D") => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setTimerSeconds(0);
    setCurrentIdx((prev) => (prev + 1) % DEMO_QUESTIONS.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setTimerSeconds(0);
  };

  const handleTopicSwitch = (idx: number) => {
    setCurrentIdx(idx);
    setSelectedOption(null);
    setShowExplanation(false);
    setTimerSeconds(0);
  };

  const triggerSandboxAction = () => {
    if (sandboxRef.current) {
      sandboxRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section className="relative overflow-hidden py-14 md:py-20 border-b border-border bg-canvas-dots bg-background">
      {/* Subtle ambient light */}
      <div className="pointer-events-none absolute -top-24 left-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Hero Copy with Marker Highlights & Playful Badges */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary/50 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground shadow-2xs rotate-[-1deg] hover:rotate-0 transition-transform">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
              <Sparkles className="size-3.5 text-primary" />
              <span>Intelligent Exam Prep & Question Bank</span>
            </div>

            <div className="relative">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.14]">
                Master Any Subject with{" "}
                <span className="relative inline-block px-1.5 py-0.5 rounded bg-primary/10 border-b-2 border-dashed border-primary">
                  Smart Questions
                  <span className="absolute -top-3.5 -right-6 hidden sm:inline-block rotate-6 rounded-md bg-amber-400 dark:bg-amber-500 text-amber-950 font-mono text-[10px] font-bold px-1.5 py-0.5 shadow-xs uppercase tracking-wider">
                    AI Powered ✨
                  </span>
                </span>{" "}
                & Timed Tests.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Transform PDFs and study materials into interactive question banks in seconds.
              Practice with instant rationales, simulate real exams, and track your topic mastery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2 shadow-sm font-medium hover:scale-105 transition-transform">
                <Link to={session ? ROUTES.dashboard : ROUTES.auth}>
                  <span>{session ? "Go to Dashboard" : "Get Started Free"}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={triggerSandboxAction}
                className="w-full sm:w-auto gap-2 cursor-pointer border-dashed hover:border-solid hover:bg-card"
              >
                <Play className="size-3.5 fill-current" />
                <span>Try Live Demo</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-card px-2.5 py-1 rotate-[-1deg] shadow-2xs">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>PDF AI Ingestion</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-card px-2.5 py-1 rotate-[1deg] shadow-2xs">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Timed Exam Mode</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-card px-2.5 py-1 rotate-[-1deg] shadow-2xs">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Topic Diagnostics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Quiz Desk */}
          <div id="interactive-demo" ref={sandboxRef} className="scroll-mt-24 lg:col-span-6">
            <div className="mx-auto max-w-lg space-y-3">
              {/* Topic Selector Tabs with Dashed Style */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto text-xs pb-1">
                <div className="flex items-center gap-1.5">
                  {DEMO_QUESTIONS.map((q, idx) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleTopicSwitch(idx)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer shrink-0 border",
                        currentIdx === idx
                          ? "bg-primary text-primary-foreground font-semibold border-primary shadow-2xs scale-105"
                          : "border-dashed border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {q.topic}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-muted-foreground font-mono bg-card px-2 py-0.5 rounded border border-dashed border-border shrink-0">
                  Q{currentIdx + 1}/{DEMO_QUESTIONS.length}
                </span>
              </div>

              {/* Quiz Desk Card with Binder Header & Dashed Borders */}
              <Card className="border-2 border-dashed border-border bg-card/95 shadow-md rounded-xl overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-primary/30 via-primary/70 to-primary/30 w-full" />

                <CardHeader className="pb-3 border-b border-dashed border-border/80 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-normal border border-border">
                        {activeQ.topic}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-normal border-dashed",
                          activeQ.difficulty === "Easy" && "text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/5",
                          activeQ.difficulty === "Medium" && "text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/5",
                          activeQ.difficulty === "Hard" && "text-red-600 dark:text-red-400 border-red-500/40 bg-red-500/5",
                        )}
                      >
                        {activeQ.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-background px-2 py-0.5 rounded border border-border">
                      <Timer className="size-3.5 text-foreground" />
                      <span>{formatTime(timerSeconds)}</span>
                    </div>
                  </div>

                  <CardTitle className="text-base font-semibold pt-2 text-foreground leading-snug">
                    {activeQ.question}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="space-y-2">
                    {activeQ.options.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      const isThisCorrect = opt.id === activeQ.correct;

                      let stateStyle = "border-border/80 bg-background hover:bg-muted/40 hover:border-foreground/40 hover:translate-x-1";
                      if (isAnswered) {
                        if (isThisCorrect) {
                          stateStyle = "border-emerald-500 bg-emerald-500/10 text-foreground font-medium shadow-2xs";
                        } else if (isSelected && !isThisCorrect) {
                          stateStyle = "border-red-500 bg-red-500/10 text-foreground";
                        } else {
                          stateStyle = "border-border opacity-50";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelect(opt.id)}
                          disabled={isAnswered}
                          className={cn(
                            "w-full text-left flex items-start gap-3 p-3 rounded-lg border text-sm transition-all cursor-pointer disabled:cursor-default",
                            stateStyle,
                          )}
                        >
                          <span
                            className={cn(
                              "font-semibold min-w-[1.25rem] text-center font-mono",
                              isAnswered && isThisCorrect
                                ? "text-emerald-600 dark:text-emerald-400"
                                : isAnswered && isSelected
                                ? "text-red-600 dark:text-red-400"
                                : "text-muted-foreground",
                            )}
                          >
                            {opt.id}.
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {isAnswered && isThisCorrect && (
                            <CheckCircle2 className="size-4.5 text-emerald-500 shrink-0" />
                          )}
                          {isAnswered && isSelected && !isThisCorrect && (
                            <XCircle className="size-4.5 text-red-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {isAnswered && (
                    <div
                      className={cn(
                        "p-3 rounded-lg border text-xs sm:text-sm animate-in fade-in-50 duration-200",
                        isCorrect
                          ? "bg-emerald-500/5 border-emerald-500/40 text-emerald-950 dark:text-emerald-200"
                          : "bg-red-500/5 border-red-500/40 text-red-950 dark:text-red-200",
                      )}
                    >
                      <div className="flex items-center justify-between mb-1 font-semibold">
                        <span className="flex items-center gap-1.5">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="size-4 text-emerald-500" />
                              <span>Correct!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="size-4 text-red-500" />
                              <span>Incorrect.</span>
                            </>
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowExplanation((prev) => !prev)}
                          className="h-6 px-2 text-xs hover:bg-muted"
                        >
                          <HelpCircle className="size-3.5 mr-1" />
                          {showExplanation ? "Hide" : "Show"} Solution
                        </Button>
                      </div>
                      {showExplanation && (
                        <p className="text-muted-foreground text-xs leading-relaxed pt-2 border-t border-dashed border-border/60 mt-1">
                          {activeQ.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-dashed border-border/70">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      disabled={!isAnswered}
                      className="text-xs text-muted-foreground gap-1.5"
                    >
                      <RotateCcw className="size-3.5" />
                      Reset
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="text-xs gap-1.5 shadow-2xs font-medium"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
