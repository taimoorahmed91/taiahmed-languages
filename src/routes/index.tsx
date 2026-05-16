import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lingua — Learn Languages" },
      { name: "description", content: "Pick a language and start learning today." },
    ],
  }),
  component: Index,
});

const LANGUAGES = [
  { id: "german", name: "German", flag: "🇩🇪", tagline: "Guten Tag!" },
  { id: "english", name: "English", flag: "🇬🇧", tagline: "Hello there!" },
];

function Index() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
      if (!session) navigate({ to: "/login" });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
      if (!session) navigate({ to: "/login" });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Lingua</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground hidden sm:inline">{email}</span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>Sign out</Button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-foreground mb-2">Choose a language</h2>
        <p className="text-muted-foreground mb-10">Pick what you want to learn today.</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {LANGUAGES.map((lang) => (
            <Link key={lang.id} to="/language/$id" params={{ id: lang.id }}>
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer hover:border-primary">
                <div className="text-6xl mb-4">{lang.flag}</div>
                <h3 className="text-2xl font-semibold text-foreground">{lang.name}</h3>
                <p className="text-muted-foreground mt-1">{lang.tagline}</p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
