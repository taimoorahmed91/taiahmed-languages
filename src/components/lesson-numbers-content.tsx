import { DeText } from "@/components/de-text";
import numbersData from "@/data/numbers.json";

type Row = { de: string; en: string; note: string };
const ROWS = numbersData as Row[];

const PHRASES: { de: string; en: string; note?: string }[] = [
  { de: "Wie ist deine Mobilnummer?", en: "What is your mobile number?", note: "lit. \"How is your mobile number?\"" },
  { de: "Meine Mobilnummer ist: xxxxx", en: "My mobile number is: xxx." },
  { de: "Wie alt bist du?", en: "How old are you?", note: "informal" },
  { de: "Wie alt sind Sie?", en: "How old are you?", note: "formal" },
  { de: "Ich bin xx (Jahre alt).", en: "I am xx (years old)." },
];

export function LessonNumbersContent() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground"><DeText>die Nummern / die Zahlen</DeText></h2>
          <p className="text-xs text-muted-foreground">Numbers — counting from 0 upward.</p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2 font-medium">German</th>
                <th className="text-left px-5 py-2 font-medium">Number</th>
                <th className="text-left px-5 py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map((r, i) => (
                <tr key={i}>
                  <td className="px-5 py-2 font-medium text-foreground"><DeText>{r.de}</DeText></td>
                  <td className="px-5 py-2 text-foreground tabular-nums">{r.en}</td>
                  <td className="px-5 py-2 text-xs italic text-muted-foreground/80">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground">Useful phrases</h2>
          <p className="text-xs text-muted-foreground">Asking for phone numbers and ages.</p>
        </header>
        <div className="divide-y divide-border">
          {PHRASES.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-5 py-2.5 text-sm">
              <div className="col-span-5 font-medium text-foreground"><DeText>{p.de}</DeText></div>
              <div className="col-span-4 text-muted-foreground">{p.en}</div>
              <div className="col-span-3 text-xs italic text-muted-foreground/80">{p.note ?? ""}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}