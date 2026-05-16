import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw } from "lucide-react";

function fmt(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

type Status = "idle" | "running" | "paused" | "ended";

export function SessionTimer({
  resetKey,
  label,
  onStart,
  onEnd,
}: {
  resetKey: string;
  label: string;
  onStart?: () => void;
  onEnd?: () => void;
}) {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset whenever the parent section changes
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setSeconds(0);
    setStatus("idle");
  }, [resetKey]);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const start = () => setStatus("running");
  const pause = () => setStatus("paused");
  const end = () => {
    setStatus("ended");
    onEnd?.();
  };
  const reset = () => {
    setSeconds(0);
    setStatus("idle");
  };

  const statusText: Record<Status, string> = {
    idle: "Not started",
    running: "In progress",
    paused: "Paused",
    ended: "Completed",
  };

  const statusColor: Record<Status, string> = {
    idle: "text-muted-foreground",
    running: "text-primary",
    paused: "text-amber-500",
    ended: "text-emerald-500",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label} timer
          </p>
          <p className={`text-sm font-medium mt-0.5 ${statusColor[status]}`}>
            {statusText[status]}
          </p>
        </div>
        <div className="text-4xl font-mono font-semibold text-foreground tabular-nums">
          {fmt(seconds)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {status !== "running" && status !== "ended" && (
          <Button onClick={start} size="sm">
            <Play className="w-4 h-4 mr-1" />
            {status === "paused" ? "Resume" : "Start"}
          </Button>
        )}
        {status === "running" && (
          <Button onClick={pause} size="sm" variant="secondary">
            <Pause className="w-4 h-4 mr-1" /> Pause
          </Button>
        )}
        {(status === "running" || status === "paused") && (
          <Button onClick={end} size="sm" variant="destructive">
            <Square className="w-4 h-4 mr-1" /> End
          </Button>
        )}
        {status === "ended" && (
          <Button onClick={reset} size="sm" variant="outline">
            <RotateCcw className="w-4 h-4 mr-1" /> Restart
          </Button>
        )}
      </div>
    </div>
  );
}