import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { DeText } from "@/components/de-text";

type MatchQ = { de: string; en: string };
type TfQ = { de: string; statement: string; answer: boolean; explain?: string };
type FillQ = { de: string; prompt: string; answer: string; hint?: string };

const MATCH: MatchQ[] = [
  { de: "Antworten Sie!", en: "Answer!" },
  { de: "Lies den Text!", en: "Read the text!" },
  { de: "Kreuze an!", en: "Tick/check!" },
  { de: "Ordnen Sie zu!", en: "Match!" },
  { de: "Bilde Sätze!", en: "Form sentences!" },
  { de: "Schreiben Sie einen Text!", en: "Write a text!" },
  { de: "Wiederhole!", en: "Repeat!" },
  { de: "Kombinieren Sie!", en: "Combine!" },
];

const TF: TfQ[] = [
  { de: "„Antworte!“ ist die formelle Form.", statement: "“Antworte!” is the formal form.", answer: false, explain: "“Antworte!” is informal (du). The formal form is “Antworten Sie!”." },
  { de: "„Lesen Sie den Text!“ richtet sich an „Sie“ (formell).", statement: "“Lesen Sie den Text!” addresses “Sie” (formal).", answer: true },
  { de: "„Lies!“ ist der Imperativ von „lesen“ in der du-Form.", statement: "“Lies!” is the imperative of “lesen” in the du-form.", answer: true },
  { de: "„Sprich nach!“ bedeutet „Write down!“.", statement: "“Sprich nach!” means “Write down!”.", answer: false, explain: "It means “Repeat (after me)!”." },
  { de: "„Wahr oder falsch?“ heißt auf Englisch „True or false?“.", statement: "“Wahr oder falsch?” means “True or false?”.", answer: true },
  { de: "„Kreuzen Sie an!“ bedeutet „Cross out!“.", statement: "“Kreuzen Sie an!” means “Cross out!”.", answer: false, explain: "It means “Tick/check!” — selecting an option." },
  { de: "„Mehrfachauswahl“ heißt „Multiple choice“.", statement: "“Mehrfachauswahl” means “Multiple choice”.", answer: true },
  { de: "„Diskutiere mit deiner Nachbarin!“ ist die formelle Form.", statement: "“Diskutiere mit deiner Nachbarin!” is the formal form.", answer: false, explain: "It is informal. Formal: “Diskutieren Sie mit Ihrer Nachbarin!”." },
];

const FILL: FillQ[] = [
  { de: "Formell von „Antworte!“: ___ Sie!", prompt: "Formal imperative of antworten.", answer: "Antworten" },
  { de: "Informell von „Lesen Sie!“: ___ !", prompt: "Informal (du) imperative of lesen.", answer: "Lies" },
  { de: "„Ordne ___!“ — match!", prompt: "Complete the informal instruction.", answer: "zu" },
  { de: "„___ Sie an!“ — tick/check (formal).", prompt: "Formal imperative of ankreuzen.", answer: "Kreuzen" },
  { de: "„Bilde ___!“ — form sentences.", prompt: "Missing noun (plural).", answer: "Sätze" },
  { de: "„Sprich ___!“ — repeat after me.", prompt: "Separable prefix.", answer: "nach" },
  { de: "„___ oder falsch?“", prompt: "Opposite of falsch.", answer: "Wahr" },
  { de: "„Schreibe ein ___!“ — write an email.", prompt: "German word for email.", answer: "E-Mail" },
];

const TOTAL = MATCH.length + TF.length + FILL.length;

function norm(s: string) {
  return s.trim().toLowerCase().replace(/[.!?,]/g, "");
}

export function ExamInstructions({ onComplete }: { onComplete?: (score: number, total: number) => void }) {
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
    MATCH.forEach((m, i) => { if (matchAns[i] === m.en) s++; });
    TF.forEach((q, i) => { if (tfAns[i] === q.answer) s++; });
    FILL.forEach((q, i) => { if (fillAns[i] && norm(fillAns[i]) === norm(q.answer)) s++; });
    return s;
  }, [matchAns, tfAns, fillAns]);

  const submit = () => { setSubmitted(true); onComplete?.(score, TOTAL); };
  const reset = () => { setMatchAns({}); setTfAns({}); setFillAns({}); setSubmitted(false); };
  const pct = Math.round((score / TOTAL) * 100);

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">I. Match the column</h2>
          <p className="text-xs text-muted-foreground">Pair each German instruction with its English meaning.</p>
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
                    {enOptions.map((o) => (<option key={o.i} value={o.en}>{o.en}</option>))}
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
                        val === b ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {b ? "True" : "False"}
                    </button>
                  ))}
                </div>
                {submitted && wrong && q.explain && (<p className="text-xs text-muted-foreground">{q.explain}</p>)}
              </div>
            );
          })}
        </div>
      </section>

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

      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4">
        {submitted ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Your score</p>
              <p className="text-2xl font-bold text-foreground">
                {score} / {TOTAL}{" "}
                <span className={`text-sm font-medium ${pct >= 70 ? "text-emerald-500" : "text-amber-500"}`}>({pct}%)</span>
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