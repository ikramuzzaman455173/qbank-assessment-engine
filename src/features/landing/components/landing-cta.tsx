import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, QrCode, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function LandingCTA() {
  return (
    <section className="py-20 border-b border-border bg-background relative overflow-hidden bg-canvas-dots">
      <div className="container-page">
        {/* Ticket Style Pass Container */}
        <div className="mx-auto max-w-4xl rounded-2xl border-2 border-dashed border-primary/50 bg-card p-6 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Subtle Ambient Background */}
          <div className="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full bg-primary/10 blur-2xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Ticket Main Content */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary/50 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Ticket className="size-3.5" />
                <span>All-Access Canvas Pass • 100% Free</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Start Building Your Intelligent Question Bank Today
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Join Knowledge Canvas for free. Import your study material, simulate real timed tests,
                and monitor your topic-level mastery with precision analytics.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Button asChild size="lg" className="w-full sm:w-auto gap-2 shadow-sm font-medium hover:scale-105 transition-transform">
                  <Link to={ROUTES.auth}>
                    <span>Claim Your Free Account</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-dashed hover:border-solid">
                  <Link to={ROUTES.auth}>
                    <span>Sign In</span>
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-3.5 text-emerald-500" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-3.5 text-emerald-500" />
                  Instant AI extraction
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-3.5 text-emerald-500" />
                  100% Private data
                </span>
              </div>
            </div>

            {/* Right Column: Ticket Stub (Perforated Pass) */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l-2 border-dashed border-border/80 pt-6 lg:pt-0 lg:pl-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="size-20 rounded-xl border-2 border-dashed border-primary/40 bg-muted/40 p-3 flex flex-col items-center justify-center shadow-inner">
                <Sparkles className="size-8 text-primary animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-xs uppercase font-bold tracking-widest text-foreground block">
                  ADMIT ONE
                </span>
                <span className="text-[11px] text-muted-foreground font-mono block">
                  PASS ID: KC-2026-PRO
                </span>
              </div>

              {/* Barcode-like visual */}
              <div className="w-32 h-6 flex items-center justify-between opacity-60">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-foreground h-full rounded-xs"
                    style={{ width: `${(i % 3) + 1}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
