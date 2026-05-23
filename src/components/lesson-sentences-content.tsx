import { DeText } from "@/components/de-text";
import data from "@/data/sentences.json";

type Row = { de: string; en: string; note?: string };
type Dialogue = { title: string; titleEn: string; lines: Row[]; variations: Row[] };
type Data = { meeting: Dialogue; firstMeeting: Dialogue; orderBeer: Dialogue };
const D = data as Data;

function Dialog({ rows }: { rows: Row[] }) {
  return (
    <div className="divide-y divide-border">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
          <div className="col-span-6 font-medium text-foreground"><DeText>{r.de}</DeText></div>
          <div className="col-span-6 text-muted-foreground">{r.en}</div>
        </div>
      ))}
    </div>
  );
}

function VarTable({ rows }: { rows: Row[] }) {
  return (
    <div className="divide-y divide-border">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
          <div className="col-span-5 font-medium text-foreground"><DeText>{r.de}</DeText></div>
          <div className="col-span-3 text-muted-foreground">{r.en}</div>
          <div className="col-span-4 text-xs italic text-muted-foreground/80">{r.note ?? ""}</div>
        </div>
      ))}
    </div>
  );
}

function Section({ d }: { d: Dialogue }) {
  return (
    <section className="rounded-lg border border-border bg-card overflow-hidden">
      <header className="px-5 py-3 border-b border-border bg-muted/40">
        <h2 className="font-semibold text-foreground"><DeText>{d.title}</DeText></h2>
        <p className="text-xs text-muted-foreground">{d.titleEn}</p>
      </header>
      <Dialog rows={d.lines} />
      {d.variations.length > 0 && (
        <>
          <div className="px-5 py-2 border-y border-border bg-muted/20 text-xs uppercase tracking-wide text-muted-foreground">
            Variationen — Variations
          </div>
          <VarTable rows={d.variations} />
        </>
      )}
    </section>
  );
}

export function LessonSentencesContent() {
  return (
    <div className="space-y-8">
      <Section d={D.meeting} />
      <Section d={D.firstMeeting} />
      <Section d={D.orderBeer} />
    </div>
  );
}