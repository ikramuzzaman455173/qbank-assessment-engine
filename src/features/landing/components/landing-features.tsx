import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Layers,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 border-b border-border bg-muted/20">
      <div className="container-page space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="outline" className="text-xs font-medium uppercase tracking-wider">
            Engineered For Mastery
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything You Need to Ace Any Exam
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            From smart PDF question extraction to timed exam simulations and weakness analysis,
            Knowledge Canvas provides an all-in-one platform for serious learners.
          </p>
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: PDF & JSON Import */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-2xs hover:border-foreground/25 transition-all">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Smart PDF & File Importer</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Turn your textbooks, lecture notes, and test sheets into interactive question banks
                in seconds with automated parsing.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-md border border-border/80 bg-muted/40 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Supported Formats:</span>
                  <span className="font-mono text-foreground font-semibold">PDF, JSON</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle className="size-3.5" />
                  <span>Automatic option & explanation detection</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2: Realistic Test Simulation */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-2xs hover:border-foreground/25 transition-all">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Clock className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Timed Test Simulator</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Practice under realistic exam constraints with countdown timers, question review
                palettes, and complete attempt histories.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-md border border-border/80 bg-muted/40 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Exam Features:</span>
                  <span className="font-mono text-foreground font-semibold">Flag & Review</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle className="size-3.5" />
                  <span>Configurable durations & pass criteria</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: Deep Analytics & Weak Areas */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-2xs hover:border-foreground/25 transition-all">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Weak-Area Recommendations</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Spot topic-level gaps in real-time. Our diagnostic charts pinpoint exactly which
                subjects need more practice before exam day.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-md border border-border/80 bg-muted/40 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Accuracy Tracking:</span>
                  <span className="font-mono text-foreground font-semibold">Topic Mastery %</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle className="size-3.5" />
                  <span>Targeted practice suggestions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 4: Question Banks Organization */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-2xs hover:border-foreground/25 transition-all">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
                <Badge variant="secondary" className="text-xs font-normal">Topic Tags</Badge>
                <Badge variant="secondary" className="text-xs font-normal">Difficulty Filter</Badge>
                <Badge variant="secondary" className="text-xs font-normal">Fast Search</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Feature 5: Adaptive Practice Engine */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-2xs hover:border-foreground/25 transition-all">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
                <Badge variant="secondary" className="text-xs font-normal">Detailed Solutions</Badge>
                <Badge variant="secondary" className="text-xs font-normal">Zero Pressure</Badge>
                <Badge variant="secondary" className="text-xs font-normal">Source References</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Feature 6: Privacy & Modern Vercel Aesthetics */}
          <Card className="flex flex-col justify-between border-border bg-card shadow-2xs hover:border-foreground/25 transition-all">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Target className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Distraction-Free UI</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Minimalist, high-contrast dark and light modes built for maximum reading clarity
                and uninterrupted study focus.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs font-normal">Pitch Dark Mode</Badge>
                <Badge variant="secondary" className="text-xs font-normal">Pure White Mode</Badge>
                <Badge variant="secondary" className="text-xs font-normal">Fast Performance</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
