import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to={ROUTES.landing} aria-label="Go to Knowledge Canvas Home">
          <Brand />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground" aria-label="Landing Navigation">
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#interactive-demo"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            Live Demo
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-foreground"
          >
            How It Works
          </a>
          <a
            href="#stats"
            className="transition-colors hover:text-foreground"
          >
            Benefits
          </a>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to={ROUTES.auth}>Sign In</Link>
          </Button>
          <Button size="sm" asChild className="gap-1.5 shadow-xs font-medium">
            <Link to={ROUTES.auth}>
              <span>Get Started</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
