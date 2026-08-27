import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  XCircle,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface DemoQuestion {
  id: number;
  question: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  options: { id: "A" | "B" | "C" | "D"; text: string }[];
  correct: "A" | "B" | "C" | "D";
  explanation: string;
}

const DEMO_QUESTIONS: DemoQuestion[] = [
  {
    id: 1,
    topic: "Computer Science",
    difficulty: "Medium",
    question: "What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?",
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(log n)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(n log n)" },
    ],
    correct: "B",
    explanation: "In a balanced BST, each comparison cuts the search space in half, yielding an average and worst-case time complexity of O(log n).",
  },
  {
    id: 2,
    topic: "General Science",
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
  {
    id: 4,
    topic: "Medicine",
    difficulty: "Medium",
    question: "Which blood type is considered the universal red blood cell donor?",
    options: [
      { id: "A", text: "AB Positive (AB+)" },
      { id: "B", text: "A Negative (A-)" },
      { id: "C", text: "O Negative (O-)" },
      { id: "D", text: "O Positive (O+)" },
    ],
    correct: "C",
    explanation: "O Negative red blood cells lack A, B, and Rh antigens, meaning they can be safely transfused to patients of virtually any blood type.",
  },
];

export function LandingHero() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const sandboxRef = useRef<HTMLDivElement>(null);

  const activeQ = DEMO_QUESTIONS[currentIdx] ?? DEMO_QUESTIONS[0];
  if (!activeQ) return null;

  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === activeQ.correct;

  // Simple live timer for realistic test feel
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
    if (optionId === activeQ.correct) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
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

  // When clicking "Try Interactive Sandbox"
  const triggerSandboxAction = () => {
    setIsHighlighted(true);
    if (sandboxRef.current) {
      sandboxRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setIsHighlighted(false);
    }, 2800);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24 border-b border-border">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground shadow-2xs">
              <Sparkles className="size-3.5 text-primary" />
              <span>Next-Gen Question Bank & Testing Suite</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Master Any Subject with{" "}
              <span className="underline decoration-border decoration-2 underline-offset-4">
                Smart Questions
              </span>{" "}
              & Exam Simulations.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Create and import question banks from PDFs, simulate real timed exams,
              practice with instant explanations, and track your topic mastery with actionable analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2 shadow-xs font-medium">
                <Link to={ROUTES.auth}>
                  <span>Get Started Free</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={triggerSandboxAction}
                className="w-full sm:w-auto gap-2 group cursor-pointer"
              >
                <Play className="size-3.5 fill-current transition-transform group-hover:scale-110" />
                <span>Try Interactive Sandbox</span>
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>PDF & JSON Import</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Timed Tests</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Weak Area Radar</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Sandbox Widget */}
          <div id="interactive-demo" ref={sandboxRef} className="scroll-mt-24 lg:col-span-6">
            <div className="relative mx-auto max-w-lg">
              {/* Topic Switcher Pills */}
              <div className="mb-3 flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
                <div className="flex items-center gap-1.5">
                  {DEMO_QUESTIONS.map((q, idx) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleTopicSwitch(idx)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0",
                        currentIdx === idx
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {q.topic}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                  {streak > 0 && (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                      <Flame className="size-3.5 fill-current" />
                      {streak}
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    Q{currentIdx + 1}/{DEMO_QUESTIONS.length}
                  </span>
                </div>
              </div>

              {/* Sandbox Card with dynamic focus pulse */}
              <Card
                className={cn(
                  "border border-border bg-card shadow-sm relative overflow-hidden transition-all duration-300",
                  isHighlighted && "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-md",
                )}
              >
                {/* Floating Hint Callout when highlighted */}
                {isHighlighted && !isAnswered && (
                  <div className="absolute top-2 right-2 z-20 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-full animate-bounce shadow-md font-medium flex items-center gap-1.5">
                    <Zap className="size-3 fill-current" />
                    <span>Click any option to test live!</span>
                  </div>
                )}

                <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {activeQ.topic}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-normal",
                          activeQ.difficulty === "Easy" && "text-emerald-600 dark:text-emerald-400",
                          activeQ.difficulty === "Medium" && "text-amber-600 dark:text-amber-400",
                          activeQ.difficulty === "Hard" && "text-red-600 dark:text-red-400",
                        )}
                      >
                        {activeQ.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Timer className="size-3.5 text-foreground" />
                      <span>{formatTime(timerSeconds)}</span>
                    </div>
                  </div>

                  <CardTitle className="text-base sm:text-lg font-semibold pt-2 text-foreground leading-snug">
                    {activeQ.question}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="space-y-2">
                    {activeQ.options.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      const isThisCorrect = opt.id === activeQ.correct;

                      let stateStyle = "border-border hover:bg-muted/40 hover:border-foreground/20";
                      if (isAnswered) {
                        if (isThisCorrect) {
                          stateStyle = "border-emerald-500 bg-emerald-500/10 text-foreground font-medium";
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
                            "w-full text-left flex items-start gap-3 p-3 rounded-md border text-sm transition-all cursor-pointer disabled:cursor-default",
                            stateStyle,
                            !isAnswered && isHighlighted && "border-primary/50 animate-pulse",
                          )}
                        >
                          <span
                            className={cn(
                              "font-semibold min-w-[1.25rem] text-center",
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

                  {/* Feedback Banner & Explanation */}
                  {isAnswered && (
                    <div
                      className={cn(
                        "p-3.5 rounded-lg border text-xs sm:text-sm animate-in fade-in-50 duration-200",
                        isCorrect
                          ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                          : "bg-red-500/5 border-red-500/30 text-red-950 dark:text-red-200",
                      )}
                    >
                      <div className="flex items-center justify-between mb-1 font-semibold">
                        <span className="flex items-center gap-1.5">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="size-4 text-emerald-500" />
                              <span>Correct! Great job.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="size-4 text-red-500" />
                              <span>Incorrect Answer.</span>
                            </>
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowExplanation((prev) => !prev)}
                          className="h-6 px-2 text-xs"
                        >
                          <HelpCircle className="size-3.5 mr-1" />
                          {showExplanation ? "Hide" : "Show"} Explanation
                        </Button>
                      </div>
                      {showExplanation && (
                        <p className="text-muted-foreground text-xs leading-relaxed pt-1.5 border-t border-border/40 mt-1">
                          {activeQ.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      disabled={!isAnswered}
                      className="text-xs text-muted-foreground gap-1.5"
                    >
                      <RotateCcw className="size-3.5" />
                      Try Again
                    </Button>

                    <div className="flex items-center gap-2">
                      {score > 0 && (
                        <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
                          Score: {score}
                        </span>
                      )}
                      <Button
                        size="sm"
                        onClick={handleNext}
                        className="text-xs gap-1.5"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
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
