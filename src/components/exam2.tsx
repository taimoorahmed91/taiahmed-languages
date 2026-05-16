import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

type MatchQ = { de: string; en: string };
type TfQ = { statement: string; answer: boolean; explain?: string };
type FillQ = { prompt: string; answer: string; hint?: string };

const MATCH: MatchQ[] = [
  { de: "Guten Morgen.", en: "good morning" },
  { de: "Gute Nacht.", en: "good night" },
  { de: "Auf Wiedersehen!", en: "goodbye (in person)" },
  { de: "Tschüß!", en: "bye (informal)" },
  { de: "Bis bald!", en: "until soon" },
];

const TF: TfQ[] = [
  { statement: "“Grüß Gott” is commonly used in Bayern and Österreich.", answer: true },
  { statement: "“Auf Wiederhören!” is typically used in person.", answer: false, explain: "It's used on the phone." },
  { statement: "“Wie heißt du?” literally means “How are you called?”.", answer: true },
  { statement: "“Mir geht es schlecht” means “I feel great”.", answer: false, explain: "It means “I feel bad”." },
  { statement: "“Sie” forms (e.g. “Wie geht es Ihnen?”) are formal.", answer: true },
];

const FILL: FillQ[] = [
  { prompt: "Ich ___ Anna. (My name is Anna.)", answer: "heiße", hint: "verb for “to be called”" },
  { prompt: "Ich komme ___ Polen.", answer: "aus" },
  { prompt: "Ich ___ in München. (live)", answer: "wohne" },
  { prompt: "Wie ___ bist du? (age question)", answer: "alt" },
  { prompt: "Ich bin vierzig Jahre ___ .", answer: "alt" },
];

const TOTAL = MATCH.length + TF.length + FILL.length;

function norm(s: string) {
  return s.trim().toLowerCase().replace(/[.!?,]/g, "");
}

export function Exam1({ onComplete }: { onComplete?: (score: number, total: number) => void }) {
  // Shuffled English options for the match section (stable per mount)
  const enOptions = useMemo(() => {
    const arr = MATCH.map((m, i) => ({ i, en: m.en }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [matchAns, setMatchAns] = useState<Record<number, string>>({});
  const [tfAns, setTfAns] = useState<Record<number, boolean | null>>({});
  const [fillAns, setFillAns] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    let s = 0;
    MATCH.forEach((m, i) => {
      if (matchAns[i] === m.en) s++;
    });
    TF.forEach((q, i) => {
      if (tfAns[i] === q.answer) s++;
    });
    FILL.forEach((q, i) => {
      if (fillAns[i] && norm(fillAns[i]) === norm(q.answer)) s++;
    });
    return s;
  }, [matchAns, tfAns, fillAns]);

  const submit = () => {
    setSubmitted(true);
    onComplete?.(score, TOTAL);
  };

  const reset = () => {
    setMatchAns({});
    setTfAns({});
    setFillAns({});
    setSubmitted(false);
  };

  const pct = Math.round((score / TOTAL) * 100);

  return (
    <div className="space-y-8">
      {/* Section I — Match */}
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">I. Match the column</h2>
          <p className="text-xs text-muted-foreground">Pair each German phrase with its English meaning.</p>
        </header>
        <div className="divide-y divide-border">
          {MATCH.map((m, i) => {
            const val = matchAns[i] ?? "";
            const correct = submitted && val === m.en;
            const wrong = submitted && val !== m.en;
            return (
              <div key={i} className="grid grid-cols-12 gap-4 items-center px-5 py-3 text-sm">
                <div className="col-span-5 font-medium text-foreground">{m.de}</div>
                <div className="col-span-6">
                  <select
                    disabled={submitted}
                    value={val}
                    onChange={(e) => setMatchAns({ ...matchAns, [i]: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">— choose —</option>
                    {enOptions.map((o) => (
                      <option key={o.i} value={o.en}>{o.en}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1 flex justify-end">
                  {correct && <Check className="w-4 h-4 text-emerald-500" />}
                  {wrong && <X className="w-4 h-4 text-rose-500" />}
                </div>
                {wrong && (
                  <div className="col-span-12 -mt-1 text-xs text-muted-foreground">
                    Correct: <span className="text-foreground">{m.en}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section II — True/False */}
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">II. True or False</h2>
        </header>
        <div className="divide-y divide-border">
          {TF.map((q, i) => {
            const val = tfAns[i];
            const correct = submitted && val === q.answer;
            const wrong = submitted && val !== undefined && val !== null && val !== q.answer;
            return (
              <div key={i} className="px-5 py-3 text-sm space-y-2">
                <div className="flex items-start gap-3">
                  <p className="flex-1 text-foreground">{i + 1}. {q.statement}</p>
                  {correct && <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />}
                  {wrong && <X className="w-4 h-4 text-rose-500 shrink-0 mt-1" />}
                </div>
                <div className="flex gap-2">
                  {[true, false].map((b) => (
                    <button
                      key={String(b)}
                      disabled={submitted}
                      onClick={() => setTfAns({ ...tfAns, [i]: b })}
                      className={`px-3 py-1.5 rounded-md border text-xs transition-colors ${
                        val === b
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {b ? "True" : "False"}
                    </button>
                  ))}
                </div>
                {submitted && wrong && q.explain && (
                  <p className="text-xs text-muted-foreground">{q.explain}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section III — Fill in the blank */}
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">III. Fill in the blank</h2>
        </header>
        <div className="divide-y divide-border">
          {FILL.map((q, i) => {
            const val = fillAns[i] ?? "";
            const correct = submitted && norm(val) === norm(q.answer);
            const wrong = submitted && !correct;
            return (
              <div key={i} className="grid grid-cols-12 gap-4 items-center px-5 py-3 text-sm">
                <div className="col-span-7 text-foreground">{i + 1}. {q.prompt}</div>
                <div className="col-span-4">
                  <input
                    disabled={submitted}
                    value={val}
                    onChange={(e) => setFillAns({ ...fillAns, [i]: e.target.value })}
                    placeholder={q.hint ?? "your answer"}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  {correct && <Check className="w-4 h-4 text-emerald-500" />}
                  {wrong && <X className="w-4 h-4 text-rose-500" />}
                </div>
                {wrong && (
                  <div className="col-span-12 -mt-1 text-xs text-muted-foreground">
                    Correct: <span className="text-foreground">{q.answer}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4">
        {submitted ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Your score</p>
              <p className="text-2xl font-bold text-foreground">
                {score} / {TOTAL}{" "}
                <span className={`text-sm font-medium ${pct >= 70 ? "text-emerald-500" : "text-amber-500"}`}>
                  ({pct}%)
                </span>
              </p>
            </div>
            <Button variant="outline" onClick={reset}>Try again</Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{TOTAL} questions in total</p>
            <Button onClick={submit}>Submit exam</Button>
          </>
        )}
      </div>
    </div>
  );
}