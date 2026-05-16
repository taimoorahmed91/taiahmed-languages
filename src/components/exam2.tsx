import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { DeText } from "@/components/de-text";

type MatchQ = { de: string; en: string };
type TfQ = { de: string; statement: string; answer: boolean; explain?: string };
type FillQ = { de: string; prompt: string; answer: string; hint?: string };

const MATCH: MatchQ[] = [
  { de: "Apfel", en: "apple" },
  { de: "Haus", en: "house" },
  { de: "Mädchen", en: "girl" },
  { de: "Schule", en: "school" },
  { de: "Vogel", en: "bird" },
];

const TF: TfQ[] = [
  { de: "Der Buchstabe „v“ klingt meistens wie das englische „f“.", statement: "The German letter “v” is usually pronounced like English “f”.", answer: true },
  { de: "Der Buchstabe „w“ klingt wie das englische „w“.", statement: "The German letter “w” is pronounced like English “w”.", answer: false, explain: "It is pronounced like English “v”." },
  { de: "„s“ am Wortanfang klingt wie das englische „z“.", statement: "“s” at the start of a word is pronounced like English “z”.", answer: true },
  { de: "„j“ im Wort klingt wie das englische „j“ in „jam“.", statement: "“j” in a German word is pronounced like English “j” in “jam”.", answer: false, explain: "It is pronounced like English “y”." },
  { de: "„sch“ klingt wie das englische „sh“.", statement: "“sch” is pronounced like English “sh”.", answer: true },
  { de: "„ei“ klingt wie das englische „eye“.", statement: "“ei” is pronounced like English “eye”.", answer: true },
  { de: "„ie“ klingt wie das englische „eye“.", statement: "“ie” is pronounced like English “eye”.", answer: false, explain: "It is pronounced like “ee”." },
  { de: "„eu“ klingt wie das englische „oy“.", statement: "“eu” is pronounced like English “oy”.", answer: true },
  { de: "Der Umlaut „ö“ klingt genauso wie „o“.", statement: "The umlaut “ö” sounds the same as plain “o”.", answer: false, explain: "It is a different, rounded vowel (like “urr”)." },
  { de: "„z“ klingt wie das englische „ts“.", statement: "“z” is pronounced like English “ts”.", answer: true },
];

const FILL: FillQ[] = [
  { de: "M___chen", prompt: "(girl) — fill the umlaut", answer: "ä", hint: "a-umlaut" },
  { de: "sch___n", prompt: "(beautiful) — fill the umlaut", answer: "ö", hint: "o-umlaut" },
  { de: "M___nchen", prompt: "(Munich) — fill the umlaut", answer: "ü", hint: "u-umlaut" },
  { de: "Der Digraph für den „sh“-Laut ist ___ .", prompt: "The digraph for the “sh” sound.", answer: "sch" },
  { de: "Der Digraph, der wie „oy“ klingt, ist ___ .", prompt: "The digraph that sounds like English “oy”.", answer: "eu" },
];

const TOTAL = MATCH.length + TF.length + FILL.length;

function norm(s: string) {
  return s.trim().toLowerCase().replace(/[.!?,]/g, "");
}

export function Exam2({ onComplete }: { onComplete?: (score: number, total: number) => void }) {
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
                <div className="col-span-5 font-medium text-foreground"><DeText>{m.de}</DeText></div>
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
                  <div className="flex-1">
                    <p className="text-foreground">{i + 1}. <DeText>{q.de}</DeText></p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.statement}</p>
                  </div>
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
                <div className="col-span-7">
                  <p className="text-foreground">{i + 1}. <DeText>{q.de}</DeText></p>
                  <p className="text-xs text-muted-foreground mt-0.5">{q.prompt}</p>
                </div>
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