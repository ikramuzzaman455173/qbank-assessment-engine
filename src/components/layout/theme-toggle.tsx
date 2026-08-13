import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/app/providers/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const nextLabel = resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={nextLabel} title={nextLabel}>
      {resolvedTheme === "dark" ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
