import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  LayoutDashboard,
  Target,
  Sparkles,
  ClipboardList,
  Compass,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface QuickLink {
  title: string;
  description: string;
  to: string;
  search?: Record<string, unknown>;
  icon: typeof LayoutDashboard;
  badge?: string;
  keywords: string[];
}

const QUICK_LINKS: QuickLink[] = [
  {
    title: "Dashboard",
    description: "Overview of your readiness score, recent activity & progress",
    to: "/dashboard",
    icon: LayoutDashboard,
    badge: "Home",
    keywords: ["home", "stats", "overview", "progress", "score", "dashboard", "main"],
  },
  {
    title: "Practice Engine",
    description: "Targeted practice on weak areas and difficult questions",
    to: "/practice/config",
    icon: Target,
    badge: "Smart Practice",
    keywords: ["practice", "mcq", "questions", "weak", "drill", "study", "exam"],
  },
  {
    title: "Question Banks",
    description: "Browse, manage, and import question collections",
    to: "/question-banks",
    icon: BookOpen,
    badge: "Repository",
    keywords: ["banks", "questions", "pdf", "import", "database", "bank"],
  },
  {
    title: "Create Mock Test",
    description: "Build timed exam simulations tailored to your curriculum",
    to: "/tests/create",
    icon: ClipboardList,
    badge: "Exam Mode",
    keywords: ["test", "exam", "mock", "quiz", "timed", "simulation", "new test"],
  },
  {
    title: "AI & API Keys",
    description: "Configure Gemini API keys and AI question generation",
    to: "/settings",
    search: { tab: "ai" },
    icon: Sparkles,
    badge: "Gemini AI",
    keywords: ["api", "gemini", "ai", "keys", "settings", "token", "google"],
  },
  {
    title: "Mastery Analytics",
    description: "Deep dive into question accuracy, topic breakdown & trends",
    to: "/analytics",
    icon: BarChart3,
    badge: "Insights",
    keywords: ["analytics", "chart", "insights", "metrics", "trend", "accuracy"],
  },
];

interface MiniTrivia {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const TRIVIA_QUESTIONS: MiniTrivia[] = [
  {
    question: "What does the HTTP 404 status code officially indicate?",
    options: [
      "Server Internal Crash",
      "Resource Not Found",
      "Unauthorized Access",
      "Network Timeout",
    ],
    correctIndex: 1,
    explanation: "HTTP 404 Not Found indicates that the server cannot find the requested URL resource.",
  },
  {
    question: "Which data structure uses LIFO (Last In, First Out) ordering?",
    options: ["Queue", "Stack", "Binary Search Tree", "Linked List"],
    correctIndex: 1,
    explanation: "A Stack operates on the LIFO principle where the last element inserted is removed first.",
  },
  {
    question: "What is the time complexity of searching a balanced Binary Search Tree?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctIndex: 2,
    explanation: "Searching in a balanced BST takes O(log n) time by halving search space at each level.",
  },
  {
    question: "In web development, which HTTP method is typically used to create a new resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctIndex: 1,
    explanation: "POST is standard for submitting data to create a new resource on the server.",
  },
];

export function NotFoundPage() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPath, setCurrentPath] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Mini-game state
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [triviaAnswered, setTriviaAnswered] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }

    // Keyboard shortcut '/' to search
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyCurrentUrl = () => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return QUICK_LINKS;
    const q = searchQuery.toLowerCase().trim();
    return QUICK_LINKS.filter(
      (link) =>
        link.title.toLowerCase().includes(q) ||
        link.description.toLowerCase().includes(q) ||
        link.keywords.some((k) => k.includes(q))
    );
  }, [searchQuery]);

  const activeTrivia: MiniTrivia =
    TRIVIA_QUESTIONS[triviaIndex % TRIVIA_QUESTIONS.length] ?? TRIVIA_QUESTIONS[0]!;

  const handleSelectAnswer = (index: number) => {
    if (triviaAnswered) return;
    setSelectedAnswer(index);
    setTriviaAnswered(true);
  };

  const handleNextTrivia = () => {
    setSelectedAnswer(null);
    setTriviaAnswered(false);
    setTriviaIndex((prev) => (prev + 1) % TRIVIA_QUESTIONS.length);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background overflow-hidden selection:bg-primary/20">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 my-auto">
        {/* Brand Bar */}
        <div className="flex items-center justify-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-4.5" />
          </span>
          <span className="font-display text-base font-bold text-foreground tracking-tight">QBank</span>
        </div>

        {/* Top Header & Visual 404 Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Compass className="size-3.5 animate-spin" style={{ animationDuration: "12s" }} />
            <span>404 &bull; Page Not Found</span>
          </div>

          <div className="relative inline-block">
            <h1 className="text-7xl sm:text-9xl font-black tracking-tighter text-foreground/90 font-display select-none">
              4
              <span className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                0
              </span>
              4
            </h1>
            <div className="absolute -bottom-2 inset-x-0 h-4 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground font-display">
              Lost in the Knowledge Canvas?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The page you're searching for doesn't exist, has been moved, or the link may be outdated.
            </p>
          </div>

          {/* Missing URL Pill */}
          {currentPath && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/40 text-xs font-mono text-muted-foreground max-w-full truncate shadow-xs">
              <span className="text-foreground/70 font-semibold">Missing Route:</span>
              <span className="truncate max-w-[200px] sm:max-w-[320px] text-foreground font-medium">{currentPath}</span>
              <button
                onClick={copyCurrentUrl}
                title="Copy full URL"
                className="ml-1 p-1 hover:text-foreground text-muted-foreground transition-colors rounded hover:bg-background cursor-pointer"
              >
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              </button>
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Button size="lg" className="gap-2 shadow-md shadow-primary/10 h-10 px-5" asChild>
              <Link to="/dashboard">
                <Home className="size-4" />
                Go to Dashboard
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 bg-background/80 h-10 px-5"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  window.history.back();
                } else {
                  void router.navigate({ to: "/" });
                }
              }}
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
          </div>
        </div>

        {/* Interactive Quick Destinations & Instant Search */}
        <Card className="border-border/60 bg-card/70 backdrop-blur-md shadow-xl overflow-hidden">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  Popular Destinations
                </h3>
                <p className="text-xs text-muted-foreground">Jump directly to your study modules</p>
              </div>

              {/* Instant Search Bar with shortcut hint */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search destinations... (press /)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-7 h-8 text-xs bg-background/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.title}
                      to={link.to}
                      search={link.search as any}
                      className="group flex flex-col justify-between p-3.5 rounded-xl border border-border/50 bg-background/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200 shadow-xs hover:shadow-sm"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Icon className="size-4" />
                            </span>
                            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                              {link.title}
                            </span>
                          </div>
                          {link.badge && (
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                              {link.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {link.description}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-border/30 flex items-center text-[11px] font-medium text-primary opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        <span>Navigate</span>
                        <ArrowRight className="size-3 ml-1" />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full py-6 text-center text-xs text-muted-foreground space-y-2">
                  <p>No destinations found matching "{searchQuery}"</p>
                  <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="text-xs h-7">
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Knowledge Trivia Easter Egg */}
        <Card className="border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-primary/5 backdrop-blur-md shadow-md">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="size-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <HelpCircle className="size-4" />
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                    Quick Knowledge Trivia 🧠
                  </h4>
                  <p className="text-[11px] text-muted-foreground">Stay sharp while finding your way</p>
                </div>
              </div>

              <Badge variant="outline" className="text-[10px] py-0.5 px-2 font-mono">
                Q {triviaIndex + 1}/{TRIVIA_QUESTIONS.length}
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">{activeTrivia.question}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeTrivia.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === activeTrivia.correctIndex;

                  let btnStyle = "border-border/60 bg-background/60 hover:bg-accent/40 text-foreground";
                  if (triviaAnswered) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium";
                    } else if (isSelected) {
                      btnStyle = "border-destructive/50 bg-destructive/10 text-destructive font-medium";
                    } else {
                      btnStyle = "opacity-50 border-border/30 bg-background/30 text-muted-foreground";
                    }
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={triviaAnswered}
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-lg border text-xs text-left transition-all ${btnStyle} cursor-pointer disabled:cursor-default`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="size-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-tight">{option}</span>
                      </span>

                      {triviaAnswered && isCorrect && <CheckCircle2 className="size-4 text-emerald-500 shrink-0 ml-1" />}
                      {triviaAnswered && isSelected && !isCorrect && <XCircle className="size-4 text-destructive shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>

              {triviaAnswered && (
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">
                      {selectedAnswer === activeTrivia.correctIndex ? "🎉 Correct! " : "💡 Note: "}
                    </span>
                    {activeTrivia.explanation}
                  </p>
                  <Button size="sm" variant="secondary" onClick={handleNextTrivia} className="gap-1 text-xs shrink-0 self-end sm:self-auto h-7 px-2.5">
                    <RotateCcw className="size-3.5" />
                    Next Question
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer info & support */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>QBank Platform Operational</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:support@qbank.app?subject=Broken%20Link%20Report"
              className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Report Issue
            </a>
            <span>&bull;</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
              Privacy
            </Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
