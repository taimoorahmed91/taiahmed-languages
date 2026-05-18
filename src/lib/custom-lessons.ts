export type CustomLesson = {
  id: string;
  language: string;
  title: string;
  content: string;
  createdAt: number;
};

const KEY = "lingua.customLessons.v1";

export function getCustomLessons(language?: string): CustomLesson[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const all: CustomLesson[] = raw ? JSON.parse(raw) : [];
    return language ? all.filter((l) => l.language === language) : all;
  } catch {
    return [];
  }
}

export function saveCustomLesson(lesson: Omit<CustomLesson, "id" | "createdAt">): CustomLesson {
  const all = getCustomLessons();
  const created: CustomLesson = {
    ...lesson,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  all.push(created);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return created;
}

export function deleteCustomLesson(id: string) {
  const all = getCustomLessons().filter((l) => l.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function updateCustomLesson(
  id: string,
  patch: Partial<Pick<CustomLesson, "language" | "title" | "content">>,
) {
  const all = getCustomLessons().map((l) => (l.id === id ? { ...l, ...patch } : l));
  window.localStorage.setItem(KEY, JSON.stringify(all));
}