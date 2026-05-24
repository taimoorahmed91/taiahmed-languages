import { DeText } from "@/components/de-text";
import data from "@/data/adj-opposites.json";

type Word = { de: string; en: string };
type Pair = { a: Word; b: Word };
type Example = { de: string; en: string; note?: string };
type Data = { title: string; titleEn: string; pairs: Pair[]; examples: Example[] };
const D = data as Data;

export function LessonAdjOppositesContent() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground"><DeText>{D.title}</DeText></h2>
          <p className="text-xs text-muted-foreground">{D.titleEn}</p>
        </header>
        <div className="divide-y divide-border">
          {D.pairs.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
              <div className="col-span-3 font-medium text-foreground"><DeText>{p.a.de}</DeText></div>
              <div className="col-span-3 text-muted-foreground">{p.a.en}</div>
              <div className="col-span-3 font-medium text-foreground"><DeText>{p.b.de}</DeText></div>
              <div className="col-span-3 text-muted-foreground">{p.b.en}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Beispielsätze</h2>
          <p className="text-xs text-muted-foreground">Example sentences</p>
        </header>
        <div className="divide-y divide-border">
          {D.examples.map((e, i) => {
            const hasNote = !!e.note;
            return (
              <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
                <div className={hasNote ? "col-span-5 font-medium text-foreground" : "col-span-6 font-medium text-foreground"}><DeText>{e.de}</DeText></div>
                <div className={hasNote ? "col-span-5 text-muted-foreground" : "col-span-6 text-muted-foreground"}>{e.en}</div>
                {hasNote && <div className="col-span-2 text-xs italic text-muted-foreground/80">{e.note}</div>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
