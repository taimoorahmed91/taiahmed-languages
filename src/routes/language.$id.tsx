import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  ArrowLeft,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Lock,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SessionTimer } from "@/components/session-timer";
import lesson1Data from "@/data/lesson1.json";
import { Exam1 } from "@/components/exam1";
import lesson2Data from "@/data/lesson2.json";
import { Exam2 } from "@/components/exam2";

type VocabGroup = { de: string; en: string; note: string; entries: { de: string; en: string; note: string }[] };
const LESSON1: VocabGroup[] = lesson1Data as VocabGroup[];
const LESSON2: VocabGroup[] = lesson2Data as VocabGroup[];

function VocabContent({ data }: { data: VocabGroup[] }) {
  return (
    <div className="space-y-8">
      {data.map((group, gi) => (
        <section key={gi} className="rounded-lg border border-border bg-card overflow-hidden">
          <header className="px-5 py-3 border-b border-border bg-muted/40">
            <h2 className="font-semibold text-foreground">{group.de}</h2>
            <p className="text-xs text-muted-foreground">{group.en}</p>
          </header>
          <div className="divide-y divide-border">
            {group.entries.map((e, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
                <div className="col-span-4 font-medium text-foreground">{e.de}</div>
                <div className="col-span-4 text-muted-foreground">{e.en}</div>
                <div className="col-span-4 text-xs italic text-muted-foreground/80">{e.note}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}


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
type Topic = { num: number; title: string; lesson: Item; exam: Item };

const TOPICS: Topic[] = [
  {
    num: 1,
    title: "Hello",
    lesson: { type: "lesson", num: 1, title: "Hello" },
    exam: { type: "exam", num: 1, title: "Greetings basics" },
  },
  {
    num: 2,
    title: "Pronunciation",
    lesson: { type: "lesson", num: 2, title: "Pronunciation" },
    exam: { type: "exam", num: 2, title: "Pronunciation check" },
  },
  {
    num: 3,
    title: "Common phrases",
    lesson: { type: "lesson", num: 3, title: "Common phrases" },
    exam: { type: "exam", num: 3, title: "Phrase quiz" },
  },
];

const ITEMS: Item[] = TOPICS.flatMap((t) => [t.lesson, t.exam]);

function LanguagePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const meta = LANG_META[id] ?? { name: cap(id), flag: "🌐" };
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [active, setActive] = useState<number>(0);
  const [started, setStarted] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

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

  // no auto-expand; topics start collapsed and the user controls them

  if (authed === null) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;

  const current = ITEMS[active];
  const currentTopicIndex = Math.floor(active / 2);
  const isCurrentExamLocked =
    current.type === "exam" && !completed.has(currentTopicIndex * 2);

  const markStarted = () => {
    setStarted((prev) => new Set(prev).add(active));
  };

  const markComplete = () => {
    setCompleted((prev) => new Set(prev).add(active));
  };

  const markReset = () => {
    setCompleted((prev) => {
      if (!prev.has(active)) return prev;
      const next = new Set(prev);
      next.delete(active);
      return next;
    });
    setStarted((prev) => {
      if (!prev.has(active)) return prev;
      const next = new Set(prev);
      next.delete(active);
      return next;
    });
  };

  const toggleTopic = (ti: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(ti)) next.delete(ti);
      else next.add(ti);
      return next;
    });
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
          {(() => {
            const topicsDone = TOPICS.filter(
              (_, ti) => completed.has(ti * 2) && completed.has(ti * 2 + 1),
            ).length;
            return (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {topicsDone} / {TOPICS.length} topics completed
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${(topicsDone / TOPICS.length) * 100}%` }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {TOPICS.map((topic, ti) => {
            const lessonIdx = ti * 2;
            const examIdx = ti * 2 + 1;
            const topicDone =
              completed.has(lessonIdx) && completed.has(examIdx);
            const isExpanded = expanded.has(ti);
            return (
              <div key={ti}>
                <button
                  onClick={() => toggleTopic(ti)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-colors hover:bg-muted"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex-1">
                    Lesson {topic.num}: {topic.title}
                  </span>
                  {topicDone && (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="space-y-1 pl-6">
                    {[
                      { item: topic.lesson, idx: lessonIdx, sub: "Learn" },
                      { item: topic.exam, idx: examIdx, sub: "Exam" },
                    ].map(({ item, idx, sub }) => {
                      const Icon = item.type === "lesson" ? BookOpen : GraduationCap;
                      const isActive = idx === active;
                      const isComplete = completed.has(idx);
                      const isStarted = started.has(idx) && !isComplete;
                      const isLocked = item.type === "exam" && !completed.has(lessonIdx);
                      return (
                        <button
                          key={idx}
                          onClick={() => setActive(idx)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : isLocked
                                ? "text-muted-foreground hover:bg-muted"
                                : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {isLocked ? (
                            <Lock className="w-4 h-4 shrink-0" />
                          ) : (
                            <Icon className="w-4 h-4 shrink-0" />
                          )}
                          <span className="truncate flex-1">{sub}</span>
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
                  </div>
                )}
              </div>
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
        <div className="max-w-4xl space-y-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {current.type === "lesson" ? `Lesson ${current.num}` : `Exam ${current.num}`}
          </p>
          <h1 className="text-4xl font-bold text-foreground -mt-4">{current.title}</h1>
          {isCurrentExamLocked ? (
            <div className="rounded-lg border border-border bg-muted/30 p-10 text-center space-y-3">
              <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-foreground font-medium">Exam locked</p>
              <p className="text-sm text-muted-foreground">
                Complete the skill first to unlock the exam.
              </p>
            </div>
          ) : (
            <>
              <SessionTimer
                resetKey={`${id}-${active}`}
                label={current.type === "lesson" ? "Lesson" : "Exam"}
                onStart={markStarted}
                onEnd={markComplete}
                onReset={markReset}
              />
              {started.has(active) ? (
                id === "german" && current.type === "lesson" && current.num === 1 ? (
                  <VocabContent data={LESSON1} />
                ) : id === "german" && current.type === "exam" && current.num === 1 ? (
                  <Exam1 onComplete={() => markComplete()} />
                ) : id === "german" && current.type === "lesson" && current.num === 2 ? (
                  <VocabContent data={LESSON2} />
                ) : id === "german" && current.type === "exam" && current.num === 2 ? (
                  <Exam2 onComplete={() => markComplete()} />
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center text-muted-foreground">
                    Placeholder content for{" "}
                    <span className="text-foreground font-medium">{current.title}</span>. Real
                    lesson material will live here.
                  </div>
                )
              ) : (
                <div className="rounded-lg border border-border bg-muted/30 p-10 text-center space-y-2">
                  <p className="text-muted-foreground text-sm">
                    Press <span className="font-semibold text-foreground">Start</span> to begin.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}