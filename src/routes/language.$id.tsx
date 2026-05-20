import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SessionTimer } from "@/components/session-timer";
import lesson1Data from "@/data/lesson1.json";
import { Exam1 } from "@/components/exam1";
import lesson2Data from "@/data/lesson2.json";
import { Exam2 } from "@/components/exam2";
import { DeText } from "@/components/de-text";
import { Lesson3Content } from "@/components/lesson3-content";
import { Exam3 } from "@/components/exam3";
import greetingsData from "@/data/greetings.json";
import { ExamGreetings } from "@/components/exam-greetings";
import pronounceData from "@/data/pronounce.json";
import { ExamPronounce } from "@/components/exam-pronounce";
import { LessonPronounsContent } from "@/components/lesson-pronouns-content";
import { ExamPronouns } from "@/components/exam-pronouns";
import { LessonInstructionsContent } from "@/components/lesson-instructions-content";
import { ExamInstructions } from "@/components/exam-instructions";
import { LessonNumbersContent } from "@/components/lesson-numbers-content";
import { ExamNumbers } from "@/components/exam-numbers";
import { getCustomLessons, type CustomLesson } from "@/lib/custom-lessons";
import { getOverrides, keyFor } from "@/lib/builtin-overrides";
import { DownloadPDFButton } from "@/components/download-pdf-button";

type VocabGroup = { de: string; en: string; note: string; entries: { de: string; en: string; note: string }[] };
type PhonGroup = { de: string; en: string; entries: { de: string; en: string; examples: { de: string; en: string }[] }[] };
const LESSON1: VocabGroup[] = lesson1Data as VocabGroup[];
const LESSON2: PhonGroup[] = lesson2Data as PhonGroup[];
const GREETINGS: VocabGroup[] = greetingsData as VocabGroup[];
const PRONOUNCE: PhonGroup[] = pronounceData as PhonGroup[];

function VocabContent({ data }: { data: VocabGroup[] }) {
  return (
    <div className="space-y-8">
      {data.map((group, gi) => (
        <section key={gi} className="rounded-lg border border-border bg-card overflow-hidden">
          <header className="px-5 py-3 border-b border-border bg-muted/40">
            <h2 className="font-semibold text-foreground"><DeText>{group.de}</DeText></h2>
            <p className="text-xs text-muted-foreground">{group.en}</p>
          </header>
          <div className="divide-y divide-border">
            {group.entries.map((e, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
                <div className="col-span-4 font-medium text-foreground"><DeText>{e.de}</DeText></div>
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

function PhoneticsContent({ data }: { data: PhonGroup[] }) {
  return (
    <div className="space-y-8">
      {data.map((group, gi) => (
        <section key={gi} className="rounded-lg border border-border bg-card overflow-hidden">
          <header className="px-5 py-3 border-b border-border bg-muted/40">
            <h2 className="font-semibold text-foreground"><DeText>{group.de}</DeText></h2>
            <p className="text-xs text-muted-foreground">{group.en}</p>
          </header>
          <div className="divide-y divide-border">
            {group.entries.map((e, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
                <div className="col-span-1 font-semibold text-foreground">{e.de}</div>
                <div className="col-span-3 text-muted-foreground italic">{e.en}</div>
                <div className="col-span-8 flex flex-wrap gap-x-6 gap-y-1">
                  {e.examples.map((ex, j) => (
                    <div key={j} className="text-foreground">
                      <span className="font-medium"><DeText>{ex.de}</DeText></span>
                      <span className="text-muted-foreground"> — {ex.en}</span>
                    </div>
                  ))}
                </div>
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

/** Renders the lesson or exam content component for a given item. */
function renderContent(
  id: string,
  current: Item,
  contentOverride: string | undefined,
  onComplete: (score?: number, total?: number) => void,
): React.ReactNode {
  if (contentOverride) {
    return (
      <article className="rounded-lg border border-border bg-card p-8 whitespace-pre-wrap text-foreground leading-relaxed">
        {contentOverride}
      </article>
    );
  }
  if (id === "german") {
    if (current.type === "lesson") {
      switch (current.num) {
        case 1: return <VocabContent data={LESSON1} />;
        case 2: return <PhoneticsContent data={LESSON2} />;
        case 3: return <Lesson3Content />;
        case 4: return <VocabContent data={GREETINGS} />;
        case 5: return <PhoneticsContent data={PRONOUNCE} />;
        case 6: return <LessonPronounsContent />;
        case 7: return <LessonInstructionsContent />;
        case 8: return <LessonNumbersContent />;
      }
    } else {
      switch (current.num) {
        case 1: return <Exam1 onComplete={(s, t) => onComplete(s, t)} />;
        case 2: return <Exam2 onComplete={(s, t) => onComplete(s, t)} />;
        case 3: return <Exam3 onComplete={(s, t) => onComplete(s, t)} />;
        case 4: return <ExamGreetings onComplete={(s, t) => onComplete(s, t)} />;
        case 5: return <ExamPronounce onComplete={(s, t) => onComplete(s, t)} />;
        case 6: return <ExamPronouns onComplete={(s, t) => onComplete(s, t)} />;
        case 7: return <ExamInstructions onComplete={(s, t) => onComplete(s, t)} />;
        case 8: return <ExamNumbers onComplete={(s, t) => onComplete(s, t)} />;
      }
    }
  }
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center text-muted-foreground">
      Placeholder content for{" "}
      <span className="text-foreground font-medium">{current.title}</span>. Real lesson material
      will live here.
    </div>
  );
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
    title: "Pronouns",
    lesson: { type: "lesson", num: 3, title: "Pronouns" },
    exam: { type: "exam", num: 3, title: "Pronouns check" },
  },
  {
    num: 4,
    title: "Greetings",
    lesson: { type: "lesson", num: 4, title: "Greetings" },
    exam: { type: "exam", num: 4, title: "Greetings check" },
  },
  {
    num: 5,
    title: "Pronounce",
    lesson: { type: "lesson", num: 5, title: "Pronounce" },
    exam: { type: "exam", num: 5, title: "Pronounce check" },
  },
  {
    num: 6,
    title: "Pronouns",
    lesson: { type: "lesson", num: 6, title: "Pronouns" },
    exam: { type: "exam", num: 6, title: "Pronouns check" },
  },
  {
    num: 7,
    title: "Instructions",
    lesson: { type: "lesson", num: 7, title: "Instructions" },
    exam: { type: "exam", num: 7, title: "Instructions check" },
  },
  {
    num: 8,
    title: "Numbers",
    lesson: { type: "lesson", num: 8, title: "Numbers" },
    exam: { type: "exam", num: 8, title: "Numbers check" },
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
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [scores, setScores] = useState<Record<number, { score: number; total: number }>>({});
  const [customLessons, setCustomLessons] = useState<CustomLesson[]>([]);
  const [activeCustomId, setActiveCustomId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<{ edits: Record<string, { title?: string; content?: string }>; deleted: string[]; hidden: string[] }>({ edits: {}, deleted: [], hidden: [] });

  useEffect(() => {
    setCustomLessons(getCustomLessons(id));
    getOverrides().then(setOverrides);
  }, [id]);

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

  const activeCustom = activeCustomId ? customLessons.find((l) => l.id === activeCustomId) ?? null : null;
  const current = ITEMS[active];
  const currentLessonNum = TOPICS[Math.floor(active / 2)].num;
  const currentKey = keyFor(id, currentLessonNum);
  const currentOverride = overrides.edits[currentKey];
  const currentTitle =
    !activeCustom && current.type === "lesson" && currentOverride?.title
      ? currentOverride.title
      : current.title;
  const currentContentOverride =
    !activeCustom && current.type === "lesson" ? currentOverride?.content : undefined;
  const currentTopicIndex = Math.floor(active / 2);
  const visibleTopicIndices = TOPICS
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => {
      const k = keyFor(id, t.num);
      return !overrides.deleted.includes(k) && !overrides.hidden.includes(k);
    });
  const currentVisiblePos = visibleTopicIndices.findIndex(({ i }) => i === currentTopicIndex);
  const currentDisplayNum = currentVisiblePos >= 0 ? currentVisiblePos + 1 : currentTopicIndex + 1;
  const isCurrentExamLocked =
    !activeCustom && current.type === "exam" && !completed.has(currentTopicIndex * 2);

  const markStarted = () => {
    setStarted((prev) => new Set(prev).add(active));
  };

  const markComplete = (score?: number, total?: number) => {
    setCompleted((prev) => new Set(prev).add(active));
    if (typeof score === "number" && typeof total === "number") {
      setScores((prev) => ({ ...prev, [active]: { score, total } }));
    }
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
    setScores((prev) => {
      if (!(active in prev)) return prev;
      const next = { ...prev };
      delete next[active];
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
      <aside
        className={`${collapsed ? "w-14" : "w-72"} border-r border-border bg-card flex flex-col transition-[width] duration-200 overflow-hidden`}
      >
        <div className="p-3 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Languages
            </Link>
          )}
          {collapsed && (
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              title="Languages"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </Button>
        </div>

        {!collapsed && (
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{meta.flag}</span>
              <div>
                <h2 className="font-semibold text-foreground">{meta.name}</h2>
                <p className="text-xs text-muted-foreground">Course outline</p>
              </div>
            </div>
            {(() => {
              const visibleTopics = TOPICS.filter((t) => {
                const k = keyFor(id, t.num);
                return !overrides.deleted.includes(k) && !overrides.hidden.includes(k);
              });
              const topicsDone = visibleTopics.filter((t, _vi, arr) => {
                const ti = TOPICS.indexOf(t);
                return completed.has(ti * 2) && completed.has(ti * 2 + 1);
              }).length;
              const total = visibleTopics.length;
              return (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {topicsDone} / {total} topics completed
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: total > 0 ? `${(topicsDone / total) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {collapsed && (
          <div className="flex justify-center py-3 border-b border-border">
            <span className="text-2xl" title={meta.name}>{meta.flag}</span>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {TOPICS.map((t, ti) => ({ topic: t, ti }))
            .filter(({ topic }) => {
              const k = keyFor(id, topic.num);
              return !overrides.deleted.includes(k) && !overrides.hidden.includes(k);
            })
            .map(({ topic, ti }, vi) => {
            const ovKey = keyFor(id, topic.num);
            const ovTitle = overrides.edits[ovKey]?.title ?? topic.title;
            const displayNum = vi + 1;
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
                  title={collapsed ? ovTitle : undefined}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                  )}
                  {!collapsed && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex-1">
                      {displayNum}. {ovTitle}
                    </span>
                  )}
                  {collapsed && (
                    <span className="text-xs font-semibold text-muted-foreground flex-1 text-center">
                      {displayNum}
                    </span>
                  )}
                  {topicDone && !collapsed && (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                  {topicDone && collapsed && (
                    <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className={`space-y-1 ${collapsed ? "pl-1" : "pl-6"}`}>
                    {[
                      { item: topic.lesson, idx: lessonIdx, sub: "Learn" },
                      { item: topic.exam, idx: examIdx, sub: "Exam" },
                    ].map(({ item, idx, sub }) => {
                      const Icon = item.type === "lesson" ? BookOpen : GraduationCap;
                      const isActive = idx === active;
                      const isComplete = completed.has(idx);
                      const isStarted = started.has(idx) && !isComplete;
                      const isLocked = item.type === "exam" && !completed.has(lessonIdx);
                      const score = scores[idx];
                      return (
                        <button
                          key={idx}
                          onClick={() => { setActive(idx); setActiveCustomId(null); }}
                          className={`w-full flex items-center gap-3 rounded-md text-sm text-left transition-colors ${
                            collapsed ? "px-2 py-2 justify-center" : "px-3 py-2"
                          } ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : isLocked
                                ? "text-muted-foreground hover:bg-muted"
                                : "text-foreground hover:bg-muted"
                          }`}
                          title={sub}
                        >
                          {isLocked ? (
                            <Lock className="w-4 h-4 shrink-0" />
                          ) : (
                            <Icon className="w-4 h-4 shrink-0" />
                          )}
                          {!collapsed && <span className="truncate flex-1">{sub}</span>}
                          {!collapsed && item.type === "exam" && score ? (
                            <span
                              className={`text-xs font-semibold tabular-nums ml-auto ${
                                isActive
                                  ? "text-primary-foreground"
                                  : score.score / score.total >= 0.7
                                    ? "text-emerald-500"
                                    : "text-amber-500"
                              }`}
                            >
                              {score.score}/{score.total}
                            </span>
                          ) : !collapsed && isComplete ? (
                            <Check className="w-4 h-4 shrink-0 ml-auto text-emerald-500" />
                          ) : null}
                          {!collapsed && isStarted && !(item.type === "exam" && score) && (
                            <AlertTriangle className="w-4 h-4 shrink-0 ml-auto text-amber-500" />
                          )}
                          {!collapsed && !isComplete && !isStarted && !(item.type === "exam" && score) && (
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
          {customLessons.length > 0 && (
            <div className="pt-3 mt-3 border-t border-border">
              {!collapsed && (
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Custom lessons
                </p>
              )}
              {customLessons.map((l) => {
                const isActive = activeCustomId === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      setActiveCustomId(l.id);
                    }}
                    className={`w-full flex items-center gap-3 rounded-md text-sm text-left transition-colors ${
                      collapsed ? "px-2 py-2 justify-center" : "px-3 py-2"
                    } ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
                    title={l.title}
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate flex-1">{l.title}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </nav>
        <div className="p-3 border-t border-border">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => supabase.auth.signOut()}
              title="Sign out"
              className={collapsed ? "px-2" : ""}
            >
              {!collapsed && "Sign out"}
            </Button>
            {!collapsed && <ThemeToggle />}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-4xl space-y-6">
          {/* ── Label row: type label + Download PDF button ──────────────── */}
          <div className="flex items-center justify-between no-print">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              {activeCustom
                ? "Custom lesson"
                : current.type === "lesson"
                  ? `Lesson ${currentDisplayNum}`
                  : `Exam ${currentDisplayNum}`}
            </p>
            <DownloadPDFButton
              title={
                activeCustom
                  ? activeCustom.title
                  : current.type === "lesson"
                    ? `Lesson ${currentDisplayNum} – ${currentTitle}`
                    : `Exam ${currentDisplayNum} – ${currentTitle}`
              }
            />
          </div>

          {/* Print-only label (button hidden, label shown cleanly) */}
          <p className="print-only text-sm text-muted-foreground uppercase tracking-wide">
            {activeCustom
              ? "Custom lesson"
              : current.type === "lesson"
                ? `Lesson ${currentDisplayNum}`
                : `Exam ${currentDisplayNum}`}
          </p>

          <h1 className="text-4xl font-bold text-foreground -mt-4">
            {activeCustom ? activeCustom.title : currentTitle}
          </h1>

          {/* ── Screen-only interactive content ──────────────────────────── */}
          <div className="no-print">
            {activeCustom ? (
              <article className="rounded-lg border border-border bg-card p-8 whitespace-pre-wrap text-foreground leading-relaxed">
                {activeCustom.content}
              </article>
            ) : isCurrentExamLocked ? (
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
                  onEnd={() => markComplete()}
                  onReset={markReset}
                  showEnd={current.type !== "exam"}
                />
                {started.has(active) ? (
                  renderContent(id, current, currentContentOverride, markComplete)
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

          {/* ── Print-only content — always renders regardless of started/locked ── */}
          <div className="print-only">
            {activeCustom ? (
              <article className="whitespace-pre-wrap text-foreground leading-relaxed">
                {activeCustom.content}
              </article>
            ) : (
              renderContent(id, current, currentContentOverride, () => {})
            )}
          </div>
        </div>
      </main>
    </div>
  );
}