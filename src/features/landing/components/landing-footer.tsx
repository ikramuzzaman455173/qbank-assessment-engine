import { Link } from "@tanstack/react-router";
import { ExternalLink, Github, Globe, Heart } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { ROUTES } from "@/constants/routes";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    // If not on home/landing, allow standard navigation
    if (window.location.pathname !== "/") {
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
  };

  return (
    <footer className="border-t border-border bg-background/60 backdrop-blur-xs text-foreground text-xs">
      <div className="container-page py-12 space-y-8">
        {/* Upper Row: Brand & Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link to={ROUTES.landing} aria-label="Knowledge Canvas Home">
              <Brand />
            </Link>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-muted-foreground text-xs max-w-sm">
              Empowering students, educators, and lifelong learners with smart exam prep.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground font-medium">
            <a
              href="/#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="/#interactive-demo"
              onClick={(e) => scrollToSection(e, "interactive-demo")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Demo
            </a>
            <a
              href="/#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Workflow
            </a>
            <a
              href="/#comparison"
              onClick={(e) => scrollToSection(e, "comparison")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Methodology
            </a>
            <a
              href="/#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              FAQ
            </a>
            <Link to={ROUTES.privacy} className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to={ROUTES.terms} className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Lower Row: Copyright, Developer Credits & Legal Links */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground">
          <p>© {currentYear} Knowledge Canvas. All rights reserved.</p>

          {/* Developer Credit - User-Friendly & Interactive */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs text-foreground transition-all hover:bg-muted/70 hover:border-border/80 shadow-2xs">
            <span className="text-muted-foreground flex items-center gap-1">
              Built with <Heart className="size-3 text-red-500 fill-red-500 animate-pulse" /> by
            </span>
            <a
              href="https://ikramuzzaman.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              Ikramuzzaman
            </a>
            <div className="flex items-center gap-1.5 ml-1 border-l border-border pl-2">
              <a
                href="https://ikramuzzaman.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                title="View Portfolio"
                aria-label="Ikramuzzaman Portfolio"
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-background/80"
              >
                <Globe className="size-3.5" />
              </a>
              <a
                href="https://github.com/ikramuzzaman455173"
                target="_blank"
                rel="noopener noreferrer"
                title="View GitHub Profile"
                aria-label="Ikramuzzaman GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-background/80"
              >
                <Github className="size-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to={ROUTES.privacy} className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link to={ROUTES.terms} className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span>•</span>
            <a
              href="https://github.com/ikramuzzaman455173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
