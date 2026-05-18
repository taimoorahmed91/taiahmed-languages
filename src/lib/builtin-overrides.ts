export type BuiltinOverride = {
  title?: string;
  content?: string;
};

type Store = {
  edits: Record<string, BuiltinOverride>;
  deleted: string[];
  hidden: string[];
};

const KEY = "lingua.builtinOverrides.v1";

function read(): Store {
  if (typeof window === "undefined") return { edits: {}, deleted: [], hidden: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { edits: {}, deleted: [], hidden: [] };
    const parsed = JSON.parse(raw);
    return {
      edits: parsed.edits ?? {},
      deleted: parsed.deleted ?? [],
      hidden: parsed.hidden ?? [],
    };
  } catch {
    return { edits: {}, deleted: [], hidden: [] };
  }
}

function write(s: Store) {
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function keyFor(language: string, num: number) {
  return `${language}-${num}`;
}

export function getOverrides(): Store {
  return read();
}

export function getOverride(language: string, num: number): BuiltinOverride | undefined {
  return read().edits[keyFor(language, num)];
}

export function isDeleted(language: string, num: number): boolean {
  return read().deleted.includes(keyFor(language, num));
}

export function isHidden(language: string, num: number): boolean {
  return read().hidden.includes(keyFor(language, num));
}

export function setOverride(language: string, num: number, patch: BuiltinOverride) {
  const s = read();
  s.edits[keyFor(language, num)] = { ...s.edits[keyFor(language, num)], ...patch };
  write(s);
}

export function clearOverride(language: string, num: number) {
  const s = read();
  delete s.edits[keyFor(language, num)];
  write(s);
}

export function markDeleted(language: string, num: number) {
  const s = read();
  const k = keyFor(language, num);
  if (!s.deleted.includes(k)) s.deleted.push(k);
  // remove from hidden if present
  s.hidden = s.hidden.filter((x) => x !== k);
  // drop edits — lesson is gone
  delete s.edits[k];
  write(s);
}

export function unmarkDeleted(language: string, num: number) {
  const s = read();
  s.deleted = s.deleted.filter((k) => k !== keyFor(language, num));
  write(s);
}

export function markHidden(language: string, num: number) {
  const s = read();
  const k = keyFor(language, num);
  if (!s.hidden.includes(k)) s.hidden.push(k);
  write(s);
}

export function unmarkHidden(language: string, num: number) {
  const s = read();
  s.hidden = s.hidden.filter((k) => k !== keyFor(language, num));
  write(s);
}