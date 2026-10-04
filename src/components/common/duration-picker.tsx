import { useMemo } from "react";
import { Clock, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DurationPickerProps {
  value: number; // In seconds
  onChange: (seconds: number) => void;
  minSeconds?: number;
  maxSeconds?: number;
  disabled?: boolean;
  className?: string;
  showPresets?: boolean;
}

const PRESETS = [
  { label: "30s", seconds: 30 },
  { label: "1m", seconds: 60 },
  { label: "5m", seconds: 300 },
  { label: "10m", seconds: 600 },
  { label: "15m", seconds: 900 },
  { label: "30m", seconds: 1800 },
  { label: "1h", seconds: 3600 },
  { label: "1h 30m", seconds: 5400 },
];

export function DurationPicker({
  value,
  onChange,
  minSeconds = 10,
  maxSeconds = 86400, // 24 hours
  disabled = false,
  className,
  showPresets = true,
}: DurationPickerProps) {
  const currentSeconds = Math.max(0, value || 0);

  const hours = Math.floor(currentSeconds / 3600);
  const minutes = Math.floor((currentSeconds % 3600) / 60);
  const seconds = currentSeconds % 60;

  const handleHoursChange = (h: number) => {
    const validH = Math.max(0, Math.min(23, isNaN(h) ? 0 : h));
    const total = validH * 3600 + minutes * 60 + seconds;
    onChange(Math.min(maxSeconds, total));
  };

  const handleMinutesChange = (m: number) => {
    const validM = Math.max(0, Math.min(59, isNaN(m) ? 0 : m));
    const total = hours * 3600 + validM * 60 + seconds;
    onChange(Math.min(maxSeconds, total));
  };

  const handleSecondsChange = (s: number) => {
    const validS = Math.max(0, Math.min(59, isNaN(s) ? 0 : s));
    const total = hours * 3600 + minutes * 60 + validS;
    onChange(Math.min(maxSeconds, total));
  };

  const formattedSummary = useMemo(() => {
    if (currentSeconds <= 0) return "No duration set";
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || (hours > 0 && seconds > 0)) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    return parts.join(" ");
  }, [hours, minutes, seconds, currentSeconds]);

  const isBelowMin = currentSeconds < minSeconds;

  return (
    <div className={cn("space-y-3", className)}>
      {/* 3-Column Inputs: Hours, Minutes, Seconds */}
      <div className="grid grid-cols-3 gap-3">
        {/* Hours */}
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Hours</Label>
          <div className="relative">
            <Input
              type="number"
              min={0}
              max={23}
              disabled={disabled}
              value={hours.toString()}
              onChange={(e) => handleHoursChange(parseInt(e.target.value, 10))}
              className="text-center font-mono font-medium pr-7"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono select-none pointer-events-none">
              h
            </span>
          </div>
        </div>

        {/* Minutes */}
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Minutes</Label>
          <div className="relative">
            <Input
              type="number"
              min={0}
              max={59}
              disabled={disabled}
              value={minutes.toString()}
              onChange={(e) => handleMinutesChange(parseInt(e.target.value, 10))}
              className="text-center font-mono font-medium pr-7"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono select-none pointer-events-none">
              m
            </span>
          </div>
        </div>

        {/* Seconds */}
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Seconds</Label>
          <div className="relative">
            <Input
              type="number"
              min={0}
              max={59}
              disabled={disabled}
              value={seconds.toString()}
              onChange={(e) => handleSecondsChange(parseInt(e.target.value, 10))}
              className="text-center font-mono font-medium pr-7"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono select-none pointer-events-none">
              s
            </span>
          </div>
        </div>
      </div>

      {/* Summary Badge & Min warning */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Total Duration:</span>
          <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5 font-semibold">
            {formattedSummary} ({currentSeconds.toLocaleString()}s)
          </Badge>
        </div>
        {isBelowMin && <span className="text-destructive font-medium">Min: {minSeconds}s</span>}
      </div>

      {/* Quick Presets */}
      {showPresets && !disabled && (
        <div className="pt-1">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1.5">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Quick Presets:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => {
              const isSelected = currentSeconds === preset.seconds;
              return (
                <Button
                  key={preset.seconds}
                  type="button"
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onChange(preset.seconds)}
                  className={cn("h-6 px-2 text-xs font-mono rounded-md", isSelected && "shadow-xs")}
                >
                  {preset.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
