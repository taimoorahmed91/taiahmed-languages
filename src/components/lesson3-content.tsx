import lesson3 from "@/data/lesson3.json";
import { DeText } from "@/components/de-text";

type Pronoun = { forms: string; en: string; person: string; gender: string; ending: string };
type Verb = { de: string; en: string; forms: string[] };
const DATA = lesson3 as { pronouns: Pronoun[]; verbs: Verb[] };

export function Lesson3Content() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">die Pronomen</h2>
          <p className="text-xs text-muted-foreground">
            Pronouns — Nominativ / Akkusativ / Dativ (subject / direct object / indirect object)
          </p>
        </header>
        <div className="grid grid-cols-12 gap-4 px-5 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground border-b border-border bg-muted/20">
          <div className="col-span-4">Nom / Akk / Dat</div>
          <div className="col-span-3">English</div>
          <div className="col-span-4">Person</div>
          <div className="col-span-1 text-right">Verb ending</div>
        </div>
        <div className="divide-y divide-border">
          {DATA.pronouns.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm items-center">
              <div className="col-span-4 font-medium text-foreground">
                <DeText>{p.forms}</DeText>
              </div>
              <div className="col-span-3 text-muted-foreground">{p.en}</div>
              <div className="col-span-4 text-xs text-muted-foreground">
                {p.person}
                {p.gender && <span className="italic"> · {p.gender}</span>}
              </div>
              <div className="col-span-1 text-right font-mono text-foreground">{p.ending}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">nützliche Verben</h2>
          <p className="text-xs text-muted-foreground">Useful verbs — regular conjugation</p>
        </header>
        <div className="divide-y divide-border">
          {DATA.verbs.map((v, i) => (
            <div key={i} className="px-5 py-3 text-sm">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-semibold text-foreground text-base">
                  <DeText>{v.de}</DeText>
                </span>
                <span className="text-muted-foreground">— {v.en}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-foreground">
                {v.forms.map((f, j) => (
                  <div key={j}>
                    <DeText>{f}</DeText>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}