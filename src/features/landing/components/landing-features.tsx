import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  FileCode,
  FileText,
  Filter,
  Layers,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LandingFeatures() {
  const [activeFilterDifficulty, setActiveFilterDifficulty] = useState<"All" | "Easy" | "Hard">("All");

  return (
    <section id="features" className="scroll-mt-20 py-20 border-b border-border bg-muted/20 relative">
      <div className="container-page space-y-14">
        {/* Section Header with Sketch Badge */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-2xs rotate-[-1.5deg]">
            <Sparkles className="size-3 text-primary" />
            <span>Engineered For Mastery</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything You Need to Ace Any Exam
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            From smart PDF question extraction to timed exam simulations and weakness analysis,
            Knowledge Canvas provides a playful yet serious toolkit for learners.
          </p>
        </div>

        {/* Bento Grid Features with Dashed Borders & Playful Tilts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: PDF & JSON Import */}
          <Card className="flex flex-col justify-between border-2 border-dashed border-border bg-card shadow-2xs hover:border-solid hover:border-primary/50 hover:shadow-lg transition-all duration-300 -rotate-1 hover:rotate-0 hover:scale-[1.02] rounded-xl relative group">
            {/* Top Pin Sticker */}
            <div className="absolute -top-3 left-6 z-10 size-6 rounded-full bg-amber-400 dark:bg-amber-500 border-2 border-background shadow-xs flex items-center justify-center text-[10px]">
              📌
            </div>

            <CardHeader className="space-y-3 pt-6">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                <FileText className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Smart PDF & File Importer</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Turn your textbooks, lecture notes, and test sheets into interactive question banks
                in seconds with automated AI parsing.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground font-mono">
                  <span>Input File:</span>
                  <span className="font-semibold text-foreground bg-background px-2 py-0.5 rounded border border-border">biology_notes.pdf</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle className="size-3.5" />
                  <span>50 MCQs extracted with explanations</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2: Realistic Test Simulation */}
          <Card className="flex flex-col justify-between border-2 border-dashed border-border bg-card shadow-2xs hover:border-solid hover:border-primary/50 hover:shadow-lg transition-all duration-300 rotate-1 hover:rotate-0 hover:scale-[1.02] rounded-xl relative group">
            <div className="absolute -top-3 right-6 z-10 size-6 rounded-full bg-emerald-400 dark:bg-emerald-500 border-2 border-background shadow-xs flex items-center justify-center text-[10px]">
              ⏱️
            </div>

            <CardHeader className="space-y-3 pt-6">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                <Clock className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Timed Test Simulator</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Practice under realistic exam constraints with countdown timers, question review
                palettes, and complete attempt histories.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Exam Clock:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-background px-2 py-0.5 rounded border border-border">44:59 REMAINING</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle className="size-3.5" />
                  <span>Auto-save and instant graded review</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: Deep Analytics & Weak Areas */}
          <Card className="flex flex-col justify-between border-2 border-dashed border-border bg-card shadow-2xs hover:border-solid hover:border-primary/50 hover:shadow-lg transition-all duration-300 -rotate-1 hover:rotate-0 hover:scale-[1.02] rounded-xl relative group">
            <div className="absolute -top-3 left-6 z-10 size-6 rounded-full bg-blue-400 dark:bg-blue-500 border-2 border-background shadow-xs flex items-center justify-center text-[10px]">
              🎯
            </div>

            <CardHeader className="space-y-3 pt-6">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                <BarChart3 className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Weak-Area Recommendations</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Spot topic-level gaps in real-time. Our diagnostic charts pinpoint exactly which
                subjects need more practice before exam day.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Genetics Mastery</span>
                  <span className="font-mono font-bold text-red-500">42% (Needs Focus)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-red-500 h-1.5 rounded-full w-[42%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 4: Question Banks Organization */}
          <Card className="flex flex-col justify-between border-2 border-dashed border-border bg-card shadow-2xs hover:border-solid hover:border-primary/50 hover:shadow-lg transition-all duration-300 rotate-1 hover:rotate-0 hover:scale-[1.02] rounded-xl relative group">
            <CardHeader className="space-y-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                <BookOpen className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Organized Question Banks</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Tag and categorize questions by subjects, topics, and difficulty levels (Easy, Medium,
                Hard) with instant search filtering.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                {(["All", "Easy", "Hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setActiveFilterDifficulty(diff)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border",
                      activeFilterDifficulty === diff
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                        : "border-dashed border-border bg-muted/50 hover:bg-muted text-muted-foreground",
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feature 5: Adaptive Practice Engine */}
          <Card className="flex flex-col justify-between border-2 border-dashed border-border bg-card shadow-2xs hover:border-solid hover:border-primary/50 hover:shadow-lg transition-all duration-300 -rotate-1 hover:rotate-0 hover:scale-[1.02] rounded-xl relative group">
            <CardHeader className="space-y-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                <Zap className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Instant Feedback Practice</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Learn without time pressure. Reveal step-by-step rationales, source references,
                and review why wrong answers are incorrect.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs font-normal border border-dashed border-border">Detailed Solutions</Badge>
                <Badge variant="secondary" className="text-xs font-normal border border-dashed border-border">Zero Pressure</Badge>
                <Badge variant="secondary" className="text-xs font-normal border border-dashed border-border">Source References</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Feature 6: Privacy & Modern Vercel Aesthetics */}
          <Card className="flex flex-col justify-between border-2 border-dashed border-border bg-card shadow-2xs hover:border-solid hover:border-primary/50 hover:shadow-lg transition-all duration-300 rotate-1 hover:rotate-0 hover:scale-[1.02] rounded-xl relative group">
            <CardHeader className="space-y-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                <Target className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Distraction-Free Focus</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Clean, high-contrast dark and light themes crafted for reading endurance
                and uninterrupted study flow.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs font-normal border border-dashed border-border">Pitch Dark Mode</Badge>
                <Badge variant="secondary" className="text-xs font-normal border border-dashed border-border">Clean White Mode</Badge>
                <Badge variant="secondary" className="text-xs font-normal border border-dashed border-border">Zero Ads</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
