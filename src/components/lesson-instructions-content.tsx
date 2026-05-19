import { DeText } from "@/components/de-text";
import instructionsData from "@/data/instructions.json";

type Row = { formal: string; informal: string; en: string };
const ROWS = instructionsData as Row[];

export function LessonInstructionsContent() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card overflow-hidden">
        <header className="px-5 py-3 border-b border-border bg-muted/40">
          <h2 className="font-semibold text-foreground"><DeText>Prüfungsanweisungen</DeText></h2>
          <p className="text-xs text-muted-foreground">
            Exam instructions — formal (Sie) vs. informal (du) imperatives you'll see throughout the course.
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-2 font-medium">German (formal)</th>
                <th className="text-left px-5 py-2 font-medium">German (informal)</th>
                <th className="text-left px-5 py-2 font-medium">English</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map((r, i) => (
                <tr key={i}>
                  <td className="px-5 py-2 font-medium text-foreground"><DeText>{r.formal}</DeText></td>
                  <td className="px-5 py-2 text-foreground"><DeText>{r.informal}</DeText></td>
                  <td className="px-5 py-2 text-muted-foreground">{r.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}