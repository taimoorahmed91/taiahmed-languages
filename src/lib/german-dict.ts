import lesson1 from "@/data/lesson1.json";
import lesson2 from "@/data/lesson2.json";
import lesson3 from "@/data/lesson3.json";
import numbersData from "@/data/numbers.json";
import instructionsData from "@/data/instructions.json";

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
  for (const tok of de.split(/[\s.,!?„""()\-/]+/)) {
    if (tok && !dict.has(tok.toLowerCase())) {
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

const L3 = lesson3 as {
  pronouns: { forms: string; en: string }[];
  verbs: { de: string; en: string; forms: string[] }[];
};
for (const p of L3.pronouns) {
  const forms = p.forms.split("/").map((s) => s.trim());
  const ens = p.en.split("/").map((s) => s.trim());
  forms.forEach((f, i) => add(f, ens[i] ?? ens[0] ?? p.en));
}
for (const v of L3.verbs) {
  addPhrase(v.de, v.en);
  for (const f of v.forms) addPhrase(f, v.en);
}

for (const n of numbersData as { de: string; en: string }[]) {
  add(n.de.trim(), n.en.trim());
  const tokens = n.de.split(/[\s/]+/);
  if (tokens.length > 1) {
    for (const tok of tokens) {
      const t = tok.toLowerCase().replace(/[.,!?]/g, "");
      if (t && !dict.has(t)) dict.set(t, n.en.trim());
    }
  }
}

for (const row of instructionsData as { formal: string; informal: string; en: string }[]) {
  addPhrase(row.formal, row.en);
  addPhrase(row.informal, row.en);
}

const COMMON: Record<string, string> = {
  ich: "I", du: "you (informal)", sie: "she / they / you (formal)", er: "he", es: "it", wir: "we", ihr: "you (plural)",
  mich: "me (acc.)", dich: "you (acc.)", ihn: "him (acc.)", uns: "us", euch: "you all (acc./dat.)", mir: "me (dat.)", dir: "you (dat.)", ihm: "him/it (dat.)", ihnen: "you (formal, dat.) / them (dat.)",
  bin: "am", bist: "are", ist: "is", sind: "are", war: "was", haben: "to have", habe: "have", hast: "have", hat: "has", habt: "have (plural)", wird: "is / becomes", werden: "to become", kann: "can", können: "can / to be able to",
  heißen: "to be called", heiße: "am called", heißt: "is called / are called", komme: "come", kommst: "come", kommt: "comes", wohne: "live", wohnst: "live", wohnt: "lives",
  antworten: "to answer", beantworten: "to answer (a question)", berichten: "to report", bilden: "to form / build", diskutieren: "to discuss", ergänzen: "to complete / supplement", fragen: "to ask", fragt: "asks", hören: "to hear / listen", vervollständigen: "to complete", kombinieren: "to combine", kreuzen: "to cross / tick", lesen: "to read", markieren: "to mark", ordnen: "to sort / organize", schreiben: "to write", spielen: "to play", sprechen: "to speak", wiederholen: "to repeat",
  antworte: "answer! (informal)", beantworte: "answer the question! (informal)", bilde: "form! (informal)", diskutiere: "discuss! (informal)", ergänze: "complete! (informal)", kombiniere: "combine! (informal)", kreuze: "tick! (informal)", lies: "read! (informal imperative of lesen)", markiere: "mark! (informal)", ordne: "sort! (informal)", spiele: "play! (informal)", sprich: "speak! (informal imperative of sprechen)", wiederhole: "repeat! (informal)",
  benutzen: "to use", benutzt: "used", bedeuten: "to mean", bedeutet: "means", drückt: "expresses", endet: "ends", enthält: "contains", geschrieben: "written",
  gut: "good / well", guten: "good (acc.)", gute: "good", schlecht: "bad / badly", sehr: "very", alt: "old", wörtlich: "literally", häufig: "often / frequently", typischerweise: "typically", persönlich: "in person", genauso: "the same", meistens: "usually / mostly", korrekt: "correct", richtig: "correct / right", richtige: "correct", regelmäßig: "regular", regelmäßige: "regular", informell: "informal", informelle: "informal", formell: "formal", formelle: "formal", phonetisch: "phonetic", phonetische: "phonetic",
  der: "the (m.)", die: "the (f./pl.)", das: "the (n.) / that", ein: "a / an", eine: "a / an", einen: "a / an (acc. m.)", einem: "a / an (dat. m./n.)", einer: "a / an (dat. f.)", kein: "no / not a", keine: "no / not a (f.)", keinen: "no / not a (m. acc.)",
  aus: "from / out of", in: "in", auf: "on / up", an: "at / on", am: "at the / on the", im: "in the", zu: "to / at", zum: "to the (m./n.)", zur: "to the (f.)", von: "from / of", vom: "from the", mit: "with", ohne: "without", nach: "to / after", bei: "at / by", beim: "at the / by the", für: "for", den: "the (m. acc. / dat. pl.)", dem: "the (dat. m./n.)", bis: "until",
  und: "and", oder: "or", nicht: "not", auch: "also / too", als: "as / than", sowohl: "both / as well as", aber: "but", weil: "because", denn: "because / for",
  wie: "how", was: "what", wer: "who", wo: "where", woher: "where from", wohin: "where to",
  man: "one / you (general)", alle: "all", etwas: "something", vor: "before / in front of", nur: "only", noch: "still / yet", schon: "already", mehr: "more", viel: "much / many", viele: "many",
  geht: "goes", "geht's": "how goes it (geht es)", "wird's": "it gets / it becomes (wird es)", morgen: "morning / tomorrow", nacht: "night", wiedersehen: "goodbye (in person)", wiederhören: "goodbye (on the phone)", tschüß: "bye (informal)", bald: "soon", später: "later", dann: "then", grüß: "greet", gott: "god",
  akkusativ: "accusative case", dativ: "dative case", nominativ: "nominative case", genitiv: "genitive case", endung: "ending / suffix", form: "form", pronomen: "pronoun / pronouns", verb: "verb", verben: "verbs", plural: "plural", singular: "singular", anrede: "form of address", werfall: "nominative (who-case)", wenfall: "accusative (whom-case)", wemfall: "dative (to-whom-case)", subjekt: "subject", objekt: "object", großgeschrieben: "capitalized",
  männlich: "masculine", weiblich: "feminine", sachlich: "neuter",
  buchstabe: "letter (of alphabet)", wort: "word", wortanfang: "start of a word", klingt: "sounds (like)", englische: "English", englisch: "English", umlaut: "umlaut", digraph: "digraph", diphthong: "diphthong", laut: "sound", silbe: "syllable", vokal: "vowel", konsonant: "consonant", alternative: "alternative", formen: "forms",
  fürwörter: "pronouns", nutzvolle: "useful", nützliche: "useful", nummern: "numbers", zahlen: "numbers", prüfungsanweisungen: "exam instructions",
  ledig: "single / unmarried", verheiratet: "married", mobilnummer: "mobile number", deine: "your (informal f.)", deinen: "your (informal m. acc.)", deinem: "your (informal dat.)", meine: "my (f.)", meinen: "my (m. acc.)", meinem: "my (dat.)",
  jahre: "years", jahr: "year", zehner: "tens digit", zwo: "two (phonetic alternative)",
  wahr: "true", falsch: "false / wrong", mehrfachauswahl: "multiple choice", negativ: "negative", negatives: "something negative",
  vierzig: "forty", polen: "Poland", münchen: "Munich", anna: "Anna", text: "text", sätze: "sentences", satz: "sentence", gespräch: "conversation", dialog: "dialogue", nachbarin: "female neighbor", nachbarn: "neighbor (m. / plural)", "e-mail": "email",
  bayerisch: "Bavarian", bayern: "Bavaria", österreich: "Austria",
  hallo: "hello", ja: "yes", nein: "no", bitte: "please", danke: "thanks", dank: "thanks", heute: "today", hier: "here", neu: "new", na: "well / so", oh: "oh", hey: "hey", ok: "ok",
  tag: "day", familie: "family", kinder: "children", partner: "partner (m.)", partnerin: "partner (f.)", ehe: "marriage", freiheit: "freedom",
  muss: "must", muß: "must", darf: "may / am allowed to", will: "want / will", lebe: "live", fahren: "to drive", sagen: "to say", sagst: "say", kommen: "to come", lange: "long / for a long time",
  freut: "pleases", vorstellen: "to introduce", kennenzulernen: "to get to know", weiß: "know",
  frech: "cheeky / naughty", gemein: "mean / nasty", ansonsten: "otherwise", alles: "everything", super: "super / great", toll: "great / awesome", leider: "unfortunately",
  vielen: "many (acc.)", seit: "since", los: "go / leave", gemacht: "made", vorsichtig: "careful", nichts: "nothing", deiner: "your (dat. f.)", mein: "my (m.)", dein: "your (m., informal)",
  bier: "beer", helles: "light beer", dunkles: "dark beer", weißbier: "wheat beer", dunkelweizen: "dark wheat beer", alkoholfreies: "alcohol-free", bierschiß: "beer-shit (slang)",
  reinheitsgebot: "purity law", deutschland: "Germany", hamburg: "Hamburg", nürnberg: "Nuremberg",
  name: "name", mango: "mango",
  groß: "big / tall", klein: "small", schnell: "fast", langsam: "slow", glücklich: "happy", traurig: "sad",
  lang: "long", kurz: "short", heiß: "hot", kalt: "cold", warm: "warm", kühl: "cool",
  dick: "fat / thick", dünn: "thin", jung: "young", reich: "rich", arm: "poor",
  intelligent: "intelligent", klug: "smart", dumm: "dumb", doof: "stupid / dumb",
  schwer: "heavy / hard / difficult", leicht: "light / easy", teuer: "expensive", billig: "cheap",
  dunkel: "dark", hell: "light / bright",
  lieber: "rather / prefer", wenn: "when / if", natürlich: "naturally / of course", seine: "his", zweite: "second",
  macht: "makes", brauchen: "to need", lachen: "to laugh", spazierender: "walking",
  blauwal: "blue whale", kampfjet: "fighter jet", mensch: "person / human", maus: "mouse",
  lottogewinn: "lottery win", rechnung: "bill / invoice", pflege: "care / maintenance",
  haare: "hairs / hair (pl.)", kurze: "short (adj. pl.)", neues: "new (adj.)", altes: "old (adj.)", voller: "full (adj.)",
  antwort: "answer", erste: "first", leichtesten: "easiest / lightest",
  prüfung: "test / exam",
  sommer: "summer", winter: "winter", frühling: "spring", herbst: "autumn",
  auto: "car", fahrrad: "bicycle", koffer: "suitcase", handtasche: "handbag",
  schule: "school", mathe: "math", kunst: "art", stress: "stress",
  deutschlehrer: "German teacher", studenten: "students (m./pl.)", studentinnen: "students (f.)", rest: "rest / remainder",
  cola: "cola", wasser: "water", geld: "money",
};
for (const [k, v] of Object.entries(COMMON)) dict.set(k, v);

export function lookupGerman(word: string): string | null {
  const k = word.trim().toLowerCase().replace(/[.,!?„""()]/g, "");
  if (!k) return null;
  return dict.get(k) ?? null;
}
