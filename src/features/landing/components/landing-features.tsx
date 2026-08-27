import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LandingFeatures() {
  return (
    <section id="features" className="scroll-mt-20 py-20 border-b border-border bg-muted/20">
      <div className="container-page space-y-12">
        {/* Clean Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="outline" className="text-xs font-medium uppercase tracking-wider">
            Key Capabilities
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything You Need to Ace Any Exam
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            A complete suite designed to turn static study materials into active, high-retention practice.
          </p>
        </div>

        {/* Clean Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: PDF Import */}
          <Card className="flex flex-col justify-between border border-border bg-card shadow-2xs hover:border-foreground/25 hover:shadow-sm transition-all rounded-xl">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Smart PDF & File Importer</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Turn your textbooks, lecture notes, and test sheets into interactive question banks in seconds with automated AI parsing.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                <span>Auto-detects options, answers, and explanations</span>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2: Timed Tests */}
          <Card className="flex flex-col justify-between border border-border bg-card shadow-2xs hover:border-foreground/25 hover:shadow-sm transition-all rounded-xl">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Clock className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Timed Test Simulator</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Practice under realistic exam constraints with countdown timers, question review palettes, and graded results.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                <span>Flag questions for review & custom time limits</span>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: Weak Areas */}
          <Card className="flex flex-col justify-between border border-border bg-card shadow-2xs hover:border-foreground/25 hover:shadow-sm transition-all rounded-xl">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Weak-Area Diagnostics</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Spot topic-level gaps in real-time. Diagnostic analytics pinpoint exactly which subjects need more practice before exam day.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                <span>Topic-level accuracy percentages & study advice</span>
              </div>
            </CardContent>
          </Card>

          {/* Feature 4: Question Banks */}
          <Card className="flex flex-col justify-between border border-border bg-card shadow-2xs hover:border-foreground/25 hover:shadow-sm transition-all rounded-xl">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Organized Question Banks</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Tag and categorize questions by subjects, topics, and difficulty levels (Easy, Medium, Hard) with instant search.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                <span>Flexible tags, filters, and easy bank export</span>
              </div>
            </CardContent>
          </Card>

          {/* Feature 5: Instant Practice */}
          <Card className="flex flex-col justify-between border border-border bg-card shadow-2xs hover:border-foreground/25 hover:shadow-sm transition-all rounded-xl">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">Instant Feedback Practice</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Learn without time pressure. Reveal step-by-step rationales, explanations, and review why incorrect options are wrong.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                <span>Zero timer stress with step-by-step solutions</span>
              </div>
            </CardContent>
          </Card>

          {/* Feature 6: Privacy */}
          <Card className="flex flex-col justify-between border border-border bg-card shadow-2xs hover:border-foreground/25 hover:shadow-sm transition-all rounded-xl">
            <CardHeader className="space-y-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Lock className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">100% Private & Secure</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Your question banks, PDFs, and exam scores belong strictly to you. Protected by Row Level Security in PostgreSQL.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                <span>Zero data selling and full deletion control</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
