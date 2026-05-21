import { DeText } from "@/components/de-text";
import data from "@/data/beer-stuff.json";

type Row = { de: string; en: string; note?: string };
type Data = { phrases: Row[]; types: Row[]; process: Row[] };
const D = data as Data;

function Table({ rows, hideNote }: { rows: Row[]; hideNote?: boolean }) {
  return (
    <div className="divide-y divide-border">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
          <div className="col-span-5 font-medium text-foreground"><DeText>{r.de}</DeText></div>
          <div className={hideNote ? "col-span-7 text-muted-foreground" : "col-span-3 text-muted-foreground"}>{r.en}</div>
          {!hideNote && (
            <div className="col-span-4 text-xs italic text-muted-foreground/80">{r.note ?? ""}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export function LessonBeerStuffContent() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground"><DeText>allgemeine Sätze</DeText></h2>
          <p className="text-xs text-muted-foreground">Common sentences — ordering, thanking, asking again.</p>
        </header>
        <Table rows={D.phrases} hideNote />
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground"><DeText>Bierarten</DeText></h2>
          <p className="text-xs text-muted-foreground">Types of beer.</p>
        </header>
        <Table rows={D.types} />
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">How our beer is made</h2>
          <p className="text-xs text-muted-foreground">The brewing process — from brewhouse to bottling.</p>
        </header>
        <Table rows={D.process} />
      </section>
    </div>
  );
}
