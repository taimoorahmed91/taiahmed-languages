import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, ArrowLeft, Check, AlertTriangle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SessionTimer } from "@/components/session-timer";

export const Route = createFileRoute("/language/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${cap(params.id)} — Lingua` }],
  }),
  component: LanguagePage,
});

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const LANG_META: Record<string, { name: string; flag: string }> = {
  german: { name: "German", flag: "🇩🇪" },
  english: { name: "English", flag: "🇬🇧" },
};

type Item = { type: "lesson" | "exam"; num: number; title: string };

const ITEMS: Item[] = [
  { type: "lesson", num: 1, title: "Hello" },
  { type: "exam", num: 1, title: "Greetings basics" },
  { type: "lesson", num: 2, title: "Numbers" },
  { type: "exam", num: 2, title: "Counting check" },
  { type: "lesson", num: 3, title: "Common phrases" },
  { type: "exam", num: 3, title: "Phrase quiz" },
];

function LanguagePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const meta = LANG_META[id] ?? { name: cap(id), flag: "🌐" };
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [active, setActive] = useState<number>(0);
  const [started, setStarted] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
      if (!session) navigate({ to: "/login" });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      if (!session) navigate({ to: "/login" });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (authed === null) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;

  const current = ITEMS[active];

  const markStarted = () => {
    setStarted((prev) => new Set(prev).add(active));
  };

  const markComplete = () => {
    setCompleted((prev) => new Set(prev).add(active));
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-72 border-r border-border bg-card flex flex-col">
        <div className="p-5 border-b border-border">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="w-4 h-4 mr-1" /> Languages
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.flag}</span>
            <div>
              <h2 className="font-semibold text-foreground">{meta.name}</h2>
              <p className="text-xs text-muted-foreground">Course outline</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {ITEMS.map((it, i) => {
            const Icon = it.type === "lesson" ? BookOpen : GraduationCap;
            const label = `${it.type === "lesson" ? "Lesson" : "Exam"} ${it.num}: ${it.title}`;
            const isActive = i === active;
            const isComplete = completed.has(i);
            const isStarted = started.has(i) && !isComplete;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate flex-1">{label}</span>
                {isComplete && (
                  <Check className="w-4 h-4 shrink-0 ml-auto text-emerald-500" />
                )}
                {isStarted && (
                  <AlertTriangle className="w-4 h-4 shrink-0 ml-auto text-amber-500" />
                )}
                {!isComplete && !isStarted && (
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ml-auto ${
                      isActive ? "bg-primary-foreground/40" : "bg-border"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {current.type === "lesson" ? `Lesson ${current.num}` : `Exam ${current.num}`}
          </p>
          <h1 className="text-4xl font-bold text-foreground -mt-4">{current.title}</h1>
          <SessionTimer
            resetKey={`${id}-${active}`}
            label={current.type === "lesson" ? "Lesson" : "Exam"}
            onStart={markStarted}
            onEnd={markComplete}
          />
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center text-muted-foreground">
            Placeholder content for{" "}
            <span className="text-foreground font-medium">{current.title}</span>. Real
            lesson material will live here.
          </div>
        </div>
      </main>
    </div>
  );
}