import { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "How does the PDF MCQ extraction work?",
    answer:
      "Upload any textbook chapter, notes, or test sheet in PDF format. Our system securely parses the text using Google Gemini AI models (gemini-3.7-flash, gemini-3.6-flash) with structured JSON schemas to extract questions, correct answers, and thorough explanations automatically.",
  },
  {
    id: 2,
    question: "Can I manually author or edit questions?",
    answer:
      "Yes. You have complete control to edit questions, add custom answer options, set tags, or build new question banks from scratch with our built-in question editor.",
  },
  {
    id: 3,
    question: "What is the difference between Practice Mode and Test Mode?",
    answer:
      "Practice Mode is untimed and provides immediate solutions and explanations after every answer click. Test Mode simulates real exams with countdown timers, question review palettes, and comprehensive graded reports.",
  },
  {
    id: 4,
    question: "How does the Weak-Area Radar identify my difficult topics?",
    answer:
      "Whenever you complete test attempts or practice sessions, Knowledge Canvas tracks your accuracy percentage per topic and highlights subjects needing reinforcement on your private dashboard.",
  },
  {
    id: 5,
    question: "Is Knowledge Canvas free to use?",
    answer:
      "Yes, Knowledge Canvas is completely free to get started. You can create question banks, import study documents, simulate timed exams, and track your progress without entering a credit card.",
  },
];

export function LandingFAQ() {
  const [openIds, setOpenIds] = useState<number[]>([1]);

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <section
      id="faq"
      className="scroll-mt-20 py-14 md:py-20 border-b border-border bg-muted/30 relative"
    >
      <div className="container-page max-w-3xl space-y-8 md:space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-2xs rotate-[1.5deg]">
            <HelpCircle className="size-3 text-primary" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Quick answers to common questions about question banks, timed tests, and privacy.
          </p>
        </div>

        {/* Clean Accordion List with Dashed Borders */}
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className={cn(
                  "rounded-xl border-2 transition-all duration-200 overflow-hidden bg-card",
                  isOpen
                    ? "border-primary/50 shadow-xs"
                    : "border-dashed border-border hover:border-foreground/30",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-semibold text-sm sm:text-base text-foreground">
                    {faq.question}
                  </span>
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
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-dashed border-border/80 animate-in fade-in-50 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Help Callout */}
        <div className="p-5 rounded-xl border-2 border-dashed border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-0.5">
            <h4 className="font-semibold text-sm text-foreground">Have a specific question?</h4>
            <p className="text-xs text-muted-foreground">
              Feel free to reach out to the developer directly.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-dashed gap-1.5 shadow-2xs hover:border-solid"
          >
            <a
              href="https://github.com/ikramuzzaman455173"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="size-3.5" />
              <span>Contact Developer</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
