import { useState } from "react";
import { Check, Flame, Sparkles, TrendingUp, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COMPARISON_ROWS = [
  {
    feature: "Question Creation",
    traditional: "Manual copy-pasting or retyping questions for hours",
    canvas: "Instant AI extraction from PDF documents in seconds",
    canvasBonus: "50+ MCQs/min",
  },
  {
    feature: "Study Technique",
    traditional: "Passive reading and highlighting (low retention)",
    canvas: "Active recall & timed exam simulations (maximum retention)",
    canvasBonus: "3x Memory Retention",
  },
  {
    feature: "Weak Area Identification",
    traditional: "Guessing which topics need review before test day",
    canvas: "Diagnostic topic accuracy radar & actionable recommendations",
    canvasBonus: "Topic-Level Accuracy",
  },
  {
    feature: "Learning Modes",
    traditional: "One-size-fits-all reading with answer sheets at the end",
    canvas: "Dual modes: untimed study with instant explanations or real exam simulation",
    canvasBonus: "Instant Rationales",
  },
  {
    feature: "Question Organization",
    traditional: "Messy folders of PDFs and scattered notes",
    canvas: "Clean searchable banks tagged by subject, topic, and difficulty",
    canvasBonus: "Instant Filter & Search",
  },
];

export function LandingComparison() {
  const [activeView, setActiveView] = useState<"side-by-side" | "canvas-only">("side-by-side");

  return (
    <section id="comparison" className="scroll-mt-20 py-20 border-b border-border bg-background relative overflow-hidden bg-canvas-dots">
      <div className="container-page space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-2xs rotate-[-1deg]">
            <Sparkles className="size-3 text-primary" />
            <span>Proven Study Methodology</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Why Active Practice Outperforms Passive Reading
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Scientific studies prove that testing yourself produces higher exam scores than
            re-reading notes. Here is how Knowledge Canvas supercharges your preparation.
          </p>

          {/* Interactive View Filter Pills */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveView("side-by-side")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                activeView === "side-by-side"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "border-dashed border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              Side-by-Side Comparison
            </button>
            <button
              type="button"
              onClick={() => setActiveView("canvas-only")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                activeView === "canvas-only"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "border-dashed border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              ✨ Knowledge Canvas Advantage
            </button>
          </div>
        </div>

        {/* Comparison Bento Table Card */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border-2 border-dashed border-border bg-card shadow-md overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-dashed border-border/80 bg-muted/40 p-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              <div className="md:col-span-4 flex items-center gap-1.5">
                <span>Study Dimension</span>
              </div>
              {activeView === "side-by-side" && (
                <div className="md:col-span-4 text-destructive hidden md:flex items-center gap-1.5">
                  <X className="size-4 text-red-500" />
                  <span>Traditional Method</span>
                </div>
              )}
              <div className={cn("text-primary flex items-center gap-1.5", activeView === "side-by-side" ? "md:col-span-4" : "md:col-span-8")}>
                <Check className="size-4 text-emerald-500" />
                <span>Knowledge Canvas Way</span>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-dashed divide-border/70">
              {COMPARISON_ROWS.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 gap-3 items-center hover:bg-muted/20 transition-colors"
                >
                  {/* Dimension */}
                  <div className="md:col-span-4 space-y-1">
                    <span className="font-bold text-sm text-foreground block">{row.feature}</span>
                    <span className="inline-block md:hidden text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {row.canvasBonus}
                    </span>
                  </div>

                  {/* Traditional Method */}
                  {activeView === "side-by-side" && (
                    <div className="md:col-span-4 text-xs sm:text-sm text-muted-foreground flex items-start gap-2 bg-red-500/5 md:bg-transparent p-2.5 md:p-0 rounded-lg">
                      <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{row.traditional}</span>
                    </div>
                  )}

                  {/* Knowledge Canvas Advantage */}
                  <div className={cn("text-xs sm:text-sm text-foreground font-medium flex items-start gap-2 bg-emerald-500/5 md:bg-transparent p-2.5 md:p-0 rounded-lg", activeView === "side-by-side" ? "md:col-span-4" : "md:col-span-8")}>
                    <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span>{row.canvas}</span>
                      <span className="hidden md:inline-block text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded ml-2 border border-primary/20">
                        {row.canvasBonus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom summary bar */}
            <div className="border-t border-dashed border-border/80 bg-muted/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Flame className="size-4 text-amber-500" />
                <span>Result: Faster preparation, deeper understanding, higher exam scores.</span>
              </div>
              <Badge variant="outline" className="border-dashed font-mono">
                Active Recall Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
