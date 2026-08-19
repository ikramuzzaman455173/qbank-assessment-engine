import { useEffect, useState, useRef } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestTimerProps {
  startedAt: string;
  durationSeconds: number;
  onExpire: () => void;
}

export function TestTimer({ startedAt, durationSeconds, onExpire }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const start = new Date(startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - start) / 1000);
    return Math.max(0, durationSeconds - elapsed);
  });

  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const hasExpiredRef = useRef(false);

  useEffect(() => {
    const start = new Date(startedAt).getTime();

    const tick = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = durationSeconds - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          onExpireRef.current?.();
        }
      } else {
        setTimeLeft(remaining);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [startedAt, durationSeconds]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft > 0 && timeLeft <= 300; // 5 minutes warning
  const isDanger = timeLeft > 0 && timeLeft <= 60; // 1 minute warning

  return (
    <div className={cn(
      "flex items-center gap-2 font-mono text-sm sm:text-base font-semibold px-3.5 py-1.5 rounded-lg border transition-colors",
      isDanger ? "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30 animate-pulse" 
      : isWarning ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" 
      : "bg-muted/60 text-foreground border-border"
    )}>
      <Clock className="w-4 h-4 shrink-0" />
      <span>{formatTime(Math.max(0, timeLeft))}</span>
    </div>
  );
}
