import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestTimerProps {
  startedAt: string;
  durationSeconds: number;
  onExpire: () => void;
}

export function TestTimer({ startedAt, durationSeconds, onExpire }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(startedAt).getTime();
      const now = new Date().getTime();
      const elapsedSeconds = Math.floor((now - start) / 1000);
      const remaining = durationSeconds - elapsedSeconds;
      
      if (remaining <= 0) {
        onExpire();
        return 0;
      }
      return remaining;
    };

    // Initial calculation
    const initial = calculateTimeLeft();
    setTimeLeft(initial);

    if (initial <= 0) return;

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, durationSeconds, onExpire]);

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
      "flex items-center gap-2 font-mono text-lg font-medium px-4 py-2 rounded-lg border",
      isDanger ? "bg-destructive/10 text-destructive border-destructive" 
      : isWarning ? "bg-yellow-100 text-yellow-800 border-yellow-300" 
      : "bg-muted/50"
    )}>
      <Clock className="w-5 h-5" />
      {formatTime(Math.max(0, timeLeft))}
    </div>
  );
}
