import { DeText } from "@/components/de-text";
import data from "@/data/verb-theory.json";

type Line = { de: string; en: string };
type EndingRow = { person: string; singular: string; plural: string };
type Verb = { de: string; en: string; note?: string };
type VowelChange = { rule: string; example: string };
type Conjugation = { infinitive: string; en: string; rows: EndingRow[] };
type Data = {
  title: string;
  titleEn: string;
  intro: Line[];
  regularEndings: EndingRow[];
  regularVerbs: Verb[];
  vowelChanges: VowelChange[];
  irregularVerbs: Verb[];
  conjugations: Conjugation[];
  regularSentences: Line[];
  irregularSentences: Line[];
};
const D = data as Data;

function EndingsTable({ rows }: { rows: EndingRow[] }) {
  return (
    <div className="divide-y divide-border">
      <div className="grid grid-cols-12 gap-4 px-5 py-2 text-xs uppercase tracking-wide text-muted-foreground">
        <div className="col-span-4">Person</div>
        <div className="col-span-4">Singular</div>
        <div className="col-span-4">Plural</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
          <div className="col-span-4 text-muted-foreground">{r.person}</div>
          <div className="col-span-4 font-medium text-foreground"><DeText>{r.singular}</DeText></div>
          <div className="col-span-4 font-medium text-foreground"><DeText>{r.plural}</DeText></div>
        </div>
      ))}
    </div>
  );
}

export function LessonVerbTheoryContent() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground"><DeText>{D.title}</DeText></h2>
          <p className="text-xs text-muted-foreground">{D.titleEn}</p>
        </header>
        <div className="divide-y divide-border">
          {D.intro.map((l, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
              <div className="col-span-6 font-medium text-foreground"><DeText>{l.de}</DeText></div>
              <div className="col-span-6 text-muted-foreground">{l.en}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Endungen von regelmäßigen Verben</h2>
          <p className="text-xs text-muted-foreground">Endings of regular verbs</p>
        </header>
        <EndingsTable rows={D.regularEndings} />
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Beispiele: regelmäßige Verben</h2>
          <p className="text-xs text-muted-foreground">Regular verb examples</p>
        </header>
        <div className="divide-y divide-border">
          {D.regularVerbs.map((v, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
              <div className="col-span-4 font-medium text-foreground"><DeText>{v.de}</DeText></div>
              <div className="col-span-4 text-muted-foreground">{v.en}</div>
              <div className="col-span-4 text-xs italic text-muted-foreground/80">{v.note ?? ""}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Vokalwechsel</h2>
          <p className="text-xs text-muted-foreground">Vowel changes in irregular verbs</p>
        </header>
        <div className="divide-y divide-border">
          {D.vowelChanges.map((v, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
              <div className="col-span-3 font-semibold text-foreground">{v.rule}</div>
              <div className="col-span-9 text-foreground"><DeText>{v.example}</DeText></div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Beispiele: unregelmäßige Verben</h2>
          <p className="text-xs text-muted-foreground">Irregular verb examples</p>
        </header>
        <div className="divide-y divide-border">
          {D.irregularVerbs.map((v, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
              <div className="col-span-4 font-medium text-foreground"><DeText>{v.de}</DeText></div>
              <div className="col-span-8 text-muted-foreground">{v.en}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">Konjugationstabellen</h2>
          <p className="text-xs text-muted-foreground">Conjugation tables for irregular verbs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {D.conjugations.map((c) => (
            <div key={c.infinitive} className="rounded-lg border border-border bg-card overflow-hidden">
              <header className="px-5 py-2.5 border-b border-border bg-muted/40">
                <h3 className="font-semibold text-foreground"><DeText>{c.infinitive}</DeText></h3>
                <p className="text-xs text-muted-foreground">{c.en}</p>
              </header>
              <EndingsTable rows={c.rows} />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Sätze (regelmäßige Verben)</h2>
          <p className="text-xs text-muted-foreground">Sentences with regular verbs</p>
        </header>
        <div className="divide-y divide-border">
          {D.regularSentences.map((s, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
              <div className="col-span-6 font-medium text-foreground"><DeText>{s.de}</DeText></div>
              <div className="col-span-6 text-muted-foreground">{s.en}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Sätze (unregelmäßige Verben)</h2>
          <p className="text-xs text-muted-foreground">Sentences with irregular verbs</p>
        </header>
        <div className="divide-y divide-border">
          {D.irregularSentences.map((s, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
              <div className="col-span-6 font-medium text-foreground"><DeText>{s.de}</DeText></div>
              <div className="col-span-6 text-muted-foreground">{s.en}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}