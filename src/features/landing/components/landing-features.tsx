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
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: FileText,
    title: "Smart PDF & File Importer",
    desc: "Turn your textbooks, lecture notes, and test sheets into interactive question banks in seconds with automated AI parsing.",
    benefit: "Auto-detects options, answers, and explanations",
    tilt: "-rotate-1",
  },
  {
    icon: Clock,
    title: "Timed Test Simulator",
    desc: "Practice under realistic exam constraints with countdown timers, question review palettes, and graded results.",
    benefit: "Flag questions for review & custom time limits",
    tilt: "rotate-1",
  },
  {
    icon: BarChart3,
    title: "Weak-Area Diagnostics",
    desc: "Spot topic-level gaps in real-time. Diagnostic analytics pinpoint exactly which subjects need more practice before exam day.",
    benefit: "Topic-level accuracy percentages & study advice",
    tilt: "-rotate-1",
  },
  {
    icon: BookOpen,
    title: "Organized Question Banks",
    desc: "Tag and categorize questions by subjects, topics, and difficulty levels (Easy, Medium, Hard) with instant search.",
    benefit: "Flexible tags, filters, and easy bank export",
    tilt: "rotate-1",
  },
  {
    icon: Zap,
    title: "Instant Feedback Practice",
    desc: "Learn without time pressure. Reveal step-by-step rationales, explanations, and review why incorrect options are wrong.",
    benefit: "Zero timer stress with step-by-step solutions",
    tilt: "-rotate-1",
  },
  {
    icon: Lock,
    title: "100% Private & Secure",
    desc: "Your question banks, PDFs, and exam scores belong strictly to you. Protected by Row Level Security in PostgreSQL.",
    benefit: "Zero data selling and full deletion control",
    tilt: "rotate-1",
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="scroll-mt-20 py-14 md:py-20 border-b border-border bg-muted/30"
    >
      <div className="container-page space-y-10 md:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-2xs rotate-[-1.5deg]">
            <Sparkles className="size-3 text-primary" />
            <span>Key Capabilities</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything You Need to Ace Any Exam
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            A complete suite designed to turn static study materials into active, high-retention
            practice.
          </p>
        </div>

        {/* Bento Grid with Dashed Borders & Playful Tilts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className={cn(
                  "flex flex-col justify-between border-2 border-dashed border-border bg-card shadow-2xs hover:border-solid hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-xl hover:rotate-0 hover:scale-[1.02]",
                  item.tilt,
                )}
              >
                <CardHeader className="space-y-3">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{item.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-dashed border-border/80">
                    <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />
                    <span>{item.benefit}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
