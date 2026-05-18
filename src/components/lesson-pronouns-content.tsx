import { DeText } from "@/components/de-text";
import pronounsData from "@/data/pronouns.json";

type PronounRow = { forms: string; en: string; person: string; gender: string; ending: string };
type Verb = { inf: string; en: string; forms: Record<string, string> };

const PRONOUNS = pronounsData.pronouns as PronounRow[];
const VERBS = pronounsData.verbs as Verb[];

const SLOTS: { key: keyof Verb["forms"] | string; label: string }[] = [
  { key: "ich", label: "ich" },
  { key: "du", label: "du" },
  { key: "er_sie_es", label: "er / sie / es" },
  { key: "wir", label: "wir" },
  { key: "ihr", label: "ihr" },
  { key: "sie", label: "sie" },
  { key: "Sie", label: "Sie" },
];

export function LessonPronounsContent() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground"><DeText>die Pronomen / die Fürwörter</DeText></h2>
          <p className="text-xs text-muted-foreground">Pronouns — Nominativ / Akkusativ / Dativ (subject / direct object / indirect object)</p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2 font-medium">Nom / Akk / Dat</th>
                <th className="text-left px-5 py-2 font-medium">English</th>
                <th className="text-left px-5 py-2 font-medium">Person</th>
                <th className="text-left px-5 py-2 font-medium">Gender</th>
                <th className="text-left px-5 py-2 font-medium">Verb ending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PRONOUNS.map((p, i) => (
                <tr key={i}>
                  <td className="px-5 py-2 font-medium text-foreground"><DeText>{p.forms}</DeText></td>
                  <td className="px-5 py-2 text-muted-foreground">{p.en}</td>
                  <td className="px-5 py-2 text-muted-foreground">{p.person}</td>
                  <td className="px-5 py-2 text-muted-foreground italic"><DeText>{p.gender}</DeText></td>
                  <td className="px-5 py-2 font-mono text-foreground">{p.ending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground"><DeText>nutzvolle Verben</DeText></h2>
          <p className="text-xs text-muted-foreground">Useful verbs — regular conjugation in the present tense.</p>
        </header>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {VERBS.map((v) => (
            <div key={v.inf} className="rounded-md border border-border overflow-hidden">
              <div className="px-4 py-2 bg-muted/40 border-b border-border">
                <p className="font-semibold text-foreground"><DeText>{v.inf}</DeText></p>
                <p className="text-xs text-muted-foreground">{v.en}</p>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  {SLOTS.map((s) => (
                    <tr key={s.key}>
                      <td className="px-4 py-1.5 text-muted-foreground w-1/2"><DeText>{s.label}</DeText></td>
                      <td className="px-4 py-1.5 font-medium text-foreground"><DeText>{v.forms[s.key]}</DeText></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
