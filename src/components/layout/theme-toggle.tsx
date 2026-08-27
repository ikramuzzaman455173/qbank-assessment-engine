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

      if (isGoingToDark) {
        // Light -> Dark: Dark view expands outward from the button
        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 450,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      } else {
        // Dark -> Light: Dark view shrinks inward into the sun button (revealing the bright canvas underneath)
        document.documentElement.animate(
          {
            clipPath: [...clipPath].reverse(),
          },
          {
            duration: 450,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-old(root)",
          },
        );
      }
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
        <Sun className="size-4 rotate-0 scale-100 transition-all duration-300 text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="size-4 rotate-0 scale-100 transition-all duration-300 text-slate-700 dark:text-slate-200" aria-hidden="true" />
      )}
    </Button>
  );
}
