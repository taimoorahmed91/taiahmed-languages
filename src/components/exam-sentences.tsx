import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { DeText } from "@/components/de-text";

type MatchQ = { de: string; en: string };
type TfQ = { de: string; statement: string; answer: boolean; explain?: string };
type FillQ = { de: string; prompt: string; answer: string; hint?: string };

const MATCH: MatchQ[] = [
  { de: "Wie geht's dir heute?", en: "How are you today?" },
  { de: "Mir geht's gut, danke!", en: "I'm fine, thanks!" },
  { de: "Auf Wiedersehen!", en: "Goodbye!" },
  { de: "Darf ich mich vorstellen?", en: "May I introduce myself?" },
  { de: "Es freut mich, Sie kennenzulernen.", en: "I'm happy to get to know you." },
  { de: "Woher kommen Sie?", en: "Where do you come from?" },
  { de: "Sind Sie verheiratet?", en: "Are you married?" },
  { de: "Ein alkoholfreies Bier, bitte.", en: "An alcohol-free beer, please." },
];

const TF: TfQ[] = [
  { de: "„Tschüß!“ ist eine informelle Verabschiedung.", statement: "“Tschüß!” is an informal goodbye.", answer: true },
  { de: "„Guten Abend.“ benutzt man am Morgen.", statement: "“Guten Abend.” is used in the morning.", answer: false, explain: "It's used in the evening; mornings use „Guten Morgen.“" },
  { de: "„Wie heißen Sie?“ ist die formelle Form.", statement: "“Wie heißen Sie?” is the formal form.", answer: true },
  { de: "„Bist du ledig?“ ist die formelle Form.", statement: "“Bist du ledig?” is the formal form.", answer: false, explain: "It's informal. The formal version is „Sind Sie ledig?“." },
  { de: "„Mir geht es prima!“ bedeutet, es geht mir schlecht.", statement: "“Mir geht es prima!” means I feel bad.", answer: false, explain: "It means “I feel great!”." },
  { de: "„Bis morgen!“ heißt „until tomorrow“.", statement: "“Bis morgen!” means “until tomorrow”.", answer: true },
  { de: "„Ich komme aus Hamburg.“ heißt „I'm from Hamburg.“", statement: "“Ich komme aus Hamburg.” means “I'm from Hamburg.”", answer: true },
  { de: "„Wie geht’s dir?“ bedeutet wörtlich „How goes it to you?“", statement: "'Wie geht's dir?' literally means 'How goes it to you?'", answer: true },
  { de: "„Es freut mich, Sie kennenzulernen.“ bedeutet wörtlich „It pleases me, you to-know-to-learn.“", statement: "'Es freut mich, Sie kennenzulernen.' literally means 'It pleases me, you to-know-to-learn.'", answer: true },
  { de: "Das Reinheitsgebot erlaubt Mango-Bier.", statement: "The Reinheitsgebot allows mango beer.", answer: false, explain: "The purity law allows only water, malt, hops (and yeast)." },
];

const FILL: FillQ[] = [
  { de: "Mir geht's ___, danke!", prompt: "“I'm fine, thanks!”", answer: "gut" },
  { de: "Wie ___ es dir?", prompt: "“How are you?” (verb).", answer: "geht" },
  { de: "Ich ___ aus Hamburg.", prompt: "“I come from Hamburg.” (verb).", answer: "komme" },
  { de: "Es freut mich, Sie ___.", prompt: "“to get to know you” (one verb).", answer: "kennenzulernen" },
  { de: "Wie ___ Sie, bitte?", prompt: "Formal: “What is your name?”", answer: "heißen" },
  { de: "Ich ___ Anna.", prompt: "“My name is Anna.” (verb).", answer: "heiße" },
  { de: "Ein ___, bitte!", prompt: "Ordering a beer.", answer: "Bier" },
  { de: "Auf ___!", prompt: "Formal goodbye.", answer: "Wiedersehen" },
];

const TOTAL = MATCH.length + TF.length + FILL.length;

function norm(s: string) {
  return s.trim().toLowerCase().replace(/[.!?,]/g, "");
}

export function ExamSentences({ onComplete }: { onComplete?: (score: number, total: number) => void }) {
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
          <p className="text-xs text-muted-foreground">Pair each German sentence with its English meaning.</p>
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