import { supabase } from "@/integrations/supabase/client";

export type BuiltinOverride = {
  title?: string;
  content?: string;
};

export type Store = {
  edits: Record<string, BuiltinOverride>;
  deleted: string[];
  hidden: string[];
};

export function keyFor(language: string, num: number) {
  return `${language}-${num}`;
}

export async function getOverrides(): Promise<Store> {
  const { data } = await supabase.from("lesson_overrides").select("*");
  const store: Store = { edits: {}, deleted: [], hidden: [] };
  for (const row of data ?? []) {
    if (row.is_deleted) {
      store.deleted.push(row.key);
    } else if (row.is_hidden) {
      store.hidden.push(row.key);
    }
    if (row.title_override || row.content_override) {
      store.edits[row.key] = {
        ...(row.title_override ? { title: row.title_override } : {}),
        ...(row.content_override ? { content: row.content_override } : {}),
      };
    }
  }
  return store;
}

export async function setOverride(language: string, num: number, patch: BuiltinOverride) {
  await supabase.from("lesson_overrides").upsert(
    {
      key: keyFor(language, num),
      language,
      lesson_num: num,
      title_override: patch.title ?? null,
      content_override: patch.content ?? null,
      is_deleted: false,
      is_hidden: false,
    },
    { onConflict: "key" }
  );
}

export async function clearOverride(language: string, num: number) {
  await supabase
    .from("lesson_overrides")
    .update({ title_override: null, content_override: null })
    .eq("key", keyFor(language, num));
}

export async function markDeleted(language: string, num: number) {
  await supabase.from("lesson_overrides").upsert(
    {
      key: keyFor(language, num),
      language,
      lesson_num: num,
      is_deleted: true,
      is_hidden: false,
      title_override: null,
      content_override: null,
    },
    { onConflict: "key" }
  );
}

export async function markHidden(language: string, num: number) {
  await supabase.from("lesson_overrides").upsert(
    {
      key: keyFor(language, num),
      language,
      lesson_num: num,
      is_hidden: true,
      is_deleted: false,
    },
    { onConflict: "key" }
  );
}

export async function unmarkHidden(language: string, num: number) {
  await supabase
    .from("lesson_overrides")
    .update({ is_hidden: false })
    .eq("key", keyFor(language, num));
}

export async function restoreLesson(language: string, num: number) {
  await supabase
    .from("lesson_overrides")
    .delete()
    .eq("key", keyFor(language, num));
}
