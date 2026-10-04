import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useSession } from "@/features/auth/hooks/use-session";

const NAV_LINKS = [
  { label: "Features", targetId: "features" },
  { label: "Live Demo", targetId: "interactive-demo", icon: Sparkles },
  { label: "How It Works", targetId: "how-it-works" },
  { label: "FAQ", targetId: "faq" },
];

export function LandingHeader() {
  const { session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      return;
    }
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState(null, "", `#${targetId}`);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to={ROUTES.landing} aria-label="Go to Knowledge Canvas Home">
          <Brand />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground"
          aria-label="Landing Navigation"
        >
          {NAV_LINKS.map(({ label, targetId, icon: Icon }) => (
            <a
              key={targetId}
              href={`/#${targetId}`}
              onClick={(e) => scrollToSection(e, targetId)}
              className="flex items-center gap-1.5 transition-colors hover:text-foreground cursor-pointer"
            >
              {Icon && <Icon className="size-3.5 text-primary" />}
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Action Buttons & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {session ? (
            <Button size="sm" asChild className="gap-1.5 shadow-xs font-medium">
              <Link to={ROUTES.dashboard}>
                <span>Dashboard</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to={ROUTES.auth}>Sign In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="hidden xs:inline-flex gap-1.5 shadow-xs font-medium"
              >
                <Link to={ROUTES.auth}>
                  <span>Get Started</span>
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </>
          )}

          {/* Mobile hamburger button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden size-9"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map(({ label, targetId, icon: Icon }) => (
              <a
                key={targetId}
                href={`/#${targetId}`}
                onClick={(e) => scrollToSection(e, targetId)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {Icon && <Icon className="size-4 text-primary" />}
                <span>{label}</span>
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {session ? (
              <Button
                size="sm"
                asChild
                className="w-full justify-center gap-1.5 shadow-xs font-medium"
              >
                <Link to={ROUTES.dashboard} onClick={() => setMobileMenuOpen(false)}>
                  <span>Go to Dashboard</span>
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild className="w-full justify-center">
                  <Link to={ROUTES.auth} onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="w-full justify-center gap-1.5 shadow-xs font-medium"
                >
                  <Link to={ROUTES.auth} onClick={() => setMobileMenuOpen(false)}>
                    <span>Get Started</span>
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
