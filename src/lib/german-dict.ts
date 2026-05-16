import lesson1 from "@/data/lesson1.json";
import lesson2 from "@/data/lesson2.json";

type L1 = { de: string; en: string; entries: { de: string; en: string }[] }[];
type L2 = { de: string; en: string; entries: { de: string; en: string; examples: { de: string; en: string }[] }[] }[];

const dict = new Map<string, string>();

function add(de: string, en: string) {
  if (!de || !en) return;
  const k = de.trim().toLowerCase();
  if (!k) return;
  if (!dict.has(k)) dict.set(k, en.trim());
}

function addPhrase(de: string, en: string) {
  add(de, en);
  // also map individual words to the same gloss as a fallback
  for (const tok of de.split(/[\s.,!?„"“()\-/]+/)) {
    if (tok && !dict.has(tok.toLowerCase())) {
      // don't pollute with super common particles, but harmless
      dict.set(tok.toLowerCase(), en.trim());
    }
  }
}

for (const g of lesson1 as L1) {
  addPhrase(g.de, g.en);
  for (const e of g.entries) addPhrase(e.de, e.en);
}
for (const g of lesson2 as L2) {
  addPhrase(g.de, g.en);
  for (const e of g.entries) {
    for (const ex of e.examples) addPhrase(ex.de, ex.en);
  }
}

// Common helpers that appear in exam sentences
const COMMON: Record<string, string> = {
  ich: "I",
  du: "you (informal)",
  sie: "she / they / you (formal)",
  er: "he",
  es: "it",
  wir: "we",
  ihr: "you (plural)",
  bin: "am",
  bist: "are",
  ist: "is",
  sind: "are",
  heiße: "am called",
  heißt: "is called / are called",
  komme: "come",
  kommst: "come",
  kommt: "comes",
  aus: "from / out of",
  in: "in",
  wohne: "live",
  wohnst: "live",
  wohnt: "lives",
  alt: "old",
  jahre: "years",
  und: "and",
  oder: "or",
  nicht: "not",
  der: "the (m.)",
  die: "the (f./pl.)",
  das: "the (n.) / that",
  ein: "a / an",
  eine: "a / an",
  wie: "how",
  was: "what",
  wer: "who",
  wo: "where",
  geht: "goes",
  es: "it",
  mir: "me (dat.)",
  dir: "you (dat.)",
  ihnen: "you (formal, dat.)",
  schlecht: "bad / badly",
  gut: "good / well",
  guten: "good (acc.)",
  gute: "good",
  morgen: "morning / tomorrow",
  nacht: "night",
  auf: "on / up",
  wiedersehen: "goodbye (in person)",
  wiederhören: "goodbye (on the phone)",
  tschüß: "bye (informal)",
  bis: "until",
  bald: "soon",
  grüß: "greet",
  gott: "god",
  bayern: "Bavaria",
  österreich: "Austria",
  buchstabe: "letter",
  wort: "word",
  wortanfang: "start of a word",
  klingt: "sounds",
  englische: "English",
  meistens: "usually / mostly",
  benutzt: "used",
  bedeutet: "means",
  wörtlich: "literally",
  formen: "forms",
  formell: "formal",
  häufig: "often / frequently",
  typischerweise: "typically",
  persönlich: "in person",
  genauso: "the same",
  umlaut: "umlaut",
  digraph: "digraph",
  laut: "sound",
  für: "for",
  den: "the (m. acc.)",
  vierzig: "forty",
  polen: "Poland",
  münchen: "Munich",
  anna: "Anna",
};
for (const [k, v] of Object.entries(COMMON)) dict.set(k, v);

export function lookupGerman(word: string): string | null {
  const k = word.trim().toLowerCase().replace(/[.,!?„"“()]/g, "");
  if (!k) return null;
  return dict.get(k) ?? null;
}