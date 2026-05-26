import { DeText } from "@/components/de-text";
import data from "@/data/help-verbs.json";

type Line = { de: string; en: string; note?: string };
type Row = { person: string; singular: string; plural: string };
type Conj = { infinitive: string; en: string; rows: Row[] };
type Data = {
  title: string;
  titleEn: string;
  intro: { de: string; en: string }[];
  conjugations: Conj[];
  habenSentences: Line[];
  seinSentences: Line[];
};
const D = data as Data;

function ConjTable({ rows }: { rows: Row[] }) {
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

function SentenceList({ items }: { items: Line[] }) {
  return (
    <div className="divide-y divide-border">
      {items.map((l, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
          <div className="col-span-5 font-medium text-foreground"><DeText>{l.de}</DeText></div>
          <div className="col-span-4 text-muted-foreground">{l.en}</div>
          <div className="col-span-3 text-xs italic text-muted-foreground/80">{l.note ?? ""}</div>
        </div>
      ))}
    </div>
  );
}

export function LessonHelpVerbsContent() {
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

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {D.conjugations.map((c) => (
          <div key={c.infinitive} className="rounded-lg border border-border bg-card overflow-hidden">
            <header className="px-5 py-2.5 border-b border-border bg-muted/40">
              <h3 className="font-semibold text-foreground"><DeText>{c.infinitive}</DeText></h3>
              <p className="text-xs text-muted-foreground">{c.en}</p>
            </header>
            <ConjTable rows={c.rows} />
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Sätze mit <DeText>haben</DeText></h2>
          <p className="text-xs text-muted-foreground">Sentences with haben (to have)</p>
        </header>
        <SentenceList items={D.habenSentences} />
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Sätze mit <DeText>sein</DeText></h2>
          <p className="text-xs text-muted-foreground">Sentences with sein (to be)</p>
        </header>
        <SentenceList items={D.seinSentences} />
      </section>
    </div>
  );
}