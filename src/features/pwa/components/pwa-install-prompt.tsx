import { useState } from "react";
import { Download, Share2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "../hooks/use-pwa-install";

export function PwaInstallPrompt() {
  const { canInstall, isIOS, promptInstall, dismissPrompt } = usePwaInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (!canInstall) return null;

  return (
    <div
      role="region"
      aria-label="Install App Prompt"
      className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 md:left-auto md:right-6"
    >
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card/95 p-4 shadow-xl backdrop-blur-md">
        {/* Glow ambient background accent */}
        <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-primary/10 blur-2xl" />

        <div className="flex items-start gap-3.5">
          {/* App Icon */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
            <img
              src="/pwa-192x192.png"
              alt="QBank"
              className="size-10 rounded-lg object-cover"
              onError={(e) => {
                // Fallback if image not ready
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Text Info */}
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-1.5 font-display text-sm font-semibold text-foreground">
              <span>Install QBank App</span>
              <Sparkles className="size-3.5 text-primary" />
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              Install for instant access, distraction-free exams, and offline practice.
            </p>

            {/* iOS Instructions Accordion / Pop */}
            {isIOS && showIosGuide && (
              <div className="mt-2.5 rounded-lg border border-border bg-muted/50 p-2.5 text-xs text-foreground">
                <p className="flex items-center gap-1.5 font-medium">
                  <Share2 className="size-3.5 text-primary" />
                  <span>How to install on iOS:</span>
                </p>
                <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-muted-foreground">
                  <li>Tap the <strong>Share</strong> button in Safari toolbar.</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> at top-right.</li>
                </ol>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-3 flex items-center gap-2">
              {isIOS ? (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => setShowIosGuide(!showIosGuide)}
                  className="h-8 text-xs font-medium"
                >
                  <Share2 className="mr-1.5 size-3.5" />
                  {showIosGuide ? "Hide Guide" : "Install on iPhone"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="default"
                  onClick={promptInstall}
                  className="h-8 text-xs font-medium"
                >
                  <Download className="mr-1.5 size-3.5" />
                  Install Now
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={dismissPrompt}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                Not now
              </Button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismissPrompt}
            aria-label="Dismiss install prompt"
            className="absolute right-2.5 top-2.5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
