import { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  category: "AI & Ingestion" | "Exams & Timers" | "Account & Privacy";
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    category: "AI & Ingestion",
    question: "How does the PDF MCQ extraction work?",
    answer: "You can upload any textbook chapter, study guide, or past paper in PDF format. Our system securely passes the document text to Google Gemini AI models (such as gemini-3.7-flash and gemini-3.6-flash) using structured JSON output schemas to extract questions, correct answers, and thorough explanations automatically.",
  },
  {
    id: 2,
    category: "AI & Ingestion",
    question: "Can I manually add or edit questions after importing?",
    answer: "Yes! You have 100% control. Every question extracted or imported can be reviewed, edited, tagged, or deleted. You can also author questions from scratch using our rich question editor.",
  },
  {
    id: 3,
    category: "Exams & Timers",
    question: "What is the difference between Practice Mode and Test Mode?",
    answer: "Practice Mode is untimed and provides immediate feedback with step-by-step rationales after every option click—ideal for initial learning. Test Mode replicates real exam conditions with countdown timers, question navigation palettes, review flags, and a final scored report.",
  },
  {
    id: 4,
    category: "Exams & Timers",
    question: "How does the Weak-Area Radar identify my difficult topics?",
    answer: "Whenever you take practice sessions or simulated tests, Knowledge Canvas computes your accuracy percentage per topic and subject. Topics falling below your target threshold are flagged on your private analytics dashboard with customized suggestions.",
  },
  {
    id: 5,
    category: "Account & Privacy",
    question: "Is Knowledge Canvas free to use?",
    answer: "Yes, Knowledge Canvas is completely free to get started. You can create question banks, import study documents, simulate timed exams, and track your progress without requiring a credit card.",
  },
  {
    id: 6,
    category: "Account & Privacy",
    question: "Are my uploaded study materials and test results private?",
    answer: "Absolutely. We utilize enterprise PostgreSQL with Row Level Security (RLS) via Supabase. Only your authenticated account can access, view, or manage your question banks, test attempts, and analytics.",
  },
];

export function LandingFAQ() {
  const [openIds, setOpenIds] = useState<number[]>([1]); // first item open by default
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const categories = ["All", "AI & Ingestion", "Exams & Timers", "Account & Privacy"];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="scroll-mt-20 py-20 border-b border-border bg-muted/20 relative">
      <div className="container-page max-w-4xl space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-2xs rotate-[1.5deg]">
            <HelpCircle className="size-3 text-primary" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Find quick answers about AI question parsing, timed test simulations, and account privacy.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-2xs font-semibold"
                    : "border-dashed border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs border-dashed bg-card"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl bg-card p-6 space-y-2">
              <p className="text-sm font-semibold text-foreground">No questions found</p>
              <p className="text-xs text-muted-foreground">Try searching with different keywords or switch categories.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={cn(
                    "rounded-xl border-2 transition-all duration-200 overflow-hidden bg-card",
                    isOpen
                      ? "border-primary/50 shadow-xs"
                      : "border-dashed border-border hover:border-border/90",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-[10px] hidden sm:inline-flex border-dashed">
                        {faq.category}
                      </Badge>
                      <span className="font-semibold text-sm sm:text-base text-foreground">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "size-7 shrink-0 rounded-full border border-border flex items-center justify-center transition-transform duration-200 bg-muted/40",
                        isOpen && "rotate-180 bg-primary text-primary-foreground border-primary",
                      )}
                    >
                      <ChevronDown className="size-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-dashed border-border/60 animate-in fade-in-50 duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Direct Help Callout */}
        <div className="p-4 sm:p-6 rounded-xl border border-dashed border-border bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm text-foreground">Have another question?</h4>
            <p className="text-xs text-muted-foreground">We are here to help you get the most out of Knowledge Canvas.</p>
          </div>
          <Button variant="outline" size="sm" asChild className="border-dashed gap-1.5 shadow-2xs">
            <a href="https://github.com/ikramuzzaman455173" target="_blank" rel="noopener noreferrer">
              <MessageSquare className="size-3.5" />
              <span>Contact Developer</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
