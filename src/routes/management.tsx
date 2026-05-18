import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Trash2, LogOut, ArrowLeft, Pencil, X, Save } from "lucide-react";
import {
  getCustomLessons,
  saveCustomLesson,
  deleteCustomLesson,
  updateCustomLesson,
  type CustomLesson,
} from "@/lib/custom-lessons";

export const Route = createFileRoute("/management")({
  head: () => ({ meta: [{ title: "Management — Lingua" }] }),
  component: ManagementPage,
});

const ADMIN_USER = "admin";
const ADMIN_PASS = "lingua-admin";
const AUTH_KEY = "lingua.adminAuth.v1";

const BUILTIN: { language: string; num: number; title: string }[] = [
  { language: "german", num: 1, title: "Hello" },
  { language: "german", num: 2, title: "Pronunciation" },
  { language: "german", num: 3, title: "Pronouns" },
];

function ManagementPage() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  const onLogin = (e: FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
      setErr(null);
    } else {
      setErr("Invalid credentials");
    }
  };

  const onLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setUser("");
    setPass("");
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
        <ThemeToggle className="absolute top-4 right-4" />
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Management</h1>
          <p className="text-sm text-muted-foreground mb-6">Admin sign in required.</p>
          <form onSubmit={onLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">Username</Label>
              <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass">Password</Label>
              <Input id="pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
          <p className="mt-6 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground inline-flex items-center">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back to app
            </Link>
          </p>
        </Card>
      </div>
    );
  }

  return <Dashboard onLogout={onLogout} />;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [custom, setCustom] = useState<CustomLesson[]>([]);
  const [language, setLanguage] = useState("german");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLang, setEditLang] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const refresh = () => setCustom(getCustomLessons());
  useEffect(() => { refresh(); }, []);

  const onCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    saveCustomLesson({ language: language.trim().toLowerCase(), title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
    refresh();
  };

  const onDelete = (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    deleteCustomLesson(id);
    refresh();
  };

  const startEdit = (l: CustomLesson) => {
    setEditingId(l.id);
    setEditLang(l.language);
    setEditTitle(l.title);
    setEditContent(l.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!editTitle.trim() || !editContent.trim()) return;
    updateCustomLesson(editingId, {
      language: editLang.trim().toLowerCase(),
      title: editTitle.trim(),
      content: editContent.trim(),
    });
    setEditingId(null);
    refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Management</h1>
            <p className="text-xs text-muted-foreground">Create or delete lessons</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-4">Create a lesson</h2>
          <form onSubmit={onCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lang">Language</Label>
                <Input id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. german" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Lesson content (plain text or markdown-style notes)"
                rows={6}
              />
            </div>
            <Button type="submit">Create lesson</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-4">Custom lessons</h2>
          {custom.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom lessons yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {custom.map((l) => (
                <li key={l.id} className="py-3">
                  {editingId === l.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor={`el-${l.id}`}>Language</Label>
                          <Input id={`el-${l.id}`} value={editLang} onChange={(e) => setEditLang(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`et-${l.id}`}>Title</Label>
                          <Input id={`et-${l.id}`} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`ec-${l.id}`}>Content</Label>
                        <Textarea id={`ec-${l.id}`} rows={5} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>
                          <Save className="w-4 h-4 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">{l.language}</span>
                          <span className="font-medium text-foreground truncate">{l.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{l.content}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(l)}>
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(l.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-2">Built-in lessons</h2>
          <p className="text-xs text-muted-foreground mb-4">Bundled with the app — not deletable.</p>
          <ul className="divide-y divide-border">
            {BUILTIN.map((l) => (
              <li key={`${l.language}-${l.num}`} className="py-2 flex items-center gap-3 text-sm">
                <span className="text-xs uppercase tracking-wide text-muted-foreground w-20">{l.language}</span>
                <span className="text-muted-foreground">Lesson {l.num}</span>
                <span className="font-medium text-foreground">{l.title}</span>
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </div>
  );
}