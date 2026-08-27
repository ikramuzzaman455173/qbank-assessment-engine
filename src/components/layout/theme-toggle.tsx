import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const nextLabel = resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Check if View Transition API is supported and user doesn't prefer reduced motion
    const isAppearanceTransition =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition) {
      setTheme(nextTheme);
      return;
    }

    // Get click position (or center of button if triggered via keyboard)
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;

    // Calculate maximum radius to the furthest corner of the screen
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const isGoingToDark = nextTheme === "dark";

    // Start View Transition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transition = (document as any).startViewTransition(async () => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      // Light -> Dark: Dark view expands from the button corner
      // Dark -> Light: Dark view shrinks into the button corner revealing the light mode
      document.documentElement.animate(
        {
          clipPath: isGoingToDark ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 420,
          easing: "ease-in-out",
          pseudoElement: isGoingToDark
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        },
      );
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={nextLabel}
      title={nextLabel}
      className="relative overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="size-4 rotate-0 scale-100 transition-all text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="size-4 rotate-0 scale-100 transition-all text-slate-700 dark:text-slate-200" aria-hidden="true" />
      )}
    </Button>
  );
}
