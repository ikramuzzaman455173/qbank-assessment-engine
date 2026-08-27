import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/layout/brand";
import { ROUTES } from "@/constants/routes";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
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
    <footer className="py-12 bg-background text-foreground text-xs">
      <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Brand />
          <span className="text-muted-foreground hidden sm:inline">|</span>
          <span className="text-muted-foreground text-center sm:text-left">
            Empowering students, educators, and lifelong learners.
          </span>
        </div>

        <div className="flex items-center gap-6 text-muted-foreground font-medium">
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, "features")}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Features
          </a>
          <a
            href="#interactive-demo"
            onClick={(e) => scrollToSection(e, "interactive-demo")}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Demo
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, "how-it-works")}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            Workflow
          </a>
          <Link to={ROUTES.auth} className="hover:text-foreground transition-colors">
            Sign In
          </Link>
        </div>
      </div>

      <div className="container-page mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground">
        <p>© {currentYear} Knowledge Canvas. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-foreground transition-colors">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-foreground transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
