import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function LandingCTA() {
  return (
    <section className="py-20 border-b border-border bg-background relative overflow-hidden">
      <div className="container-page">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 sm:p-12 text-center space-y-6 shadow-sm relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            <span>Ready to Elevate Your Exam Prep?</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Start Building Your Intelligent Question Bank Today
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join Knowledge Canvas for free. Import your study material, simulate real timed tests,
            and monitor your topic-level mastery with precision analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="w-full sm:w-auto gap-2 shadow-xs font-medium">
              <Link to={ROUTES.auth}>
                <span>Get Started Free</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to={ROUTES.auth}>
                <span>Sign In to Account</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-muted-foreground border-t border-border/60">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-emerald-500" />
              Free tier available
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-emerald-500" />
              Instant AI question extraction
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-emerald-500" />
              100% Private data
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
