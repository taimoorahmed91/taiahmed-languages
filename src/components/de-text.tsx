import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { lookupGerman } from "@/lib/german-dict";

function DeWord({ word }: { word: string }) {
  const [open, setOpen] = useState(false);
  const translation = lookupGerman(word);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          className="cursor-pointer underline decoration-dotted decoration-muted-foreground/40 underline-offset-4 hover:decoration-foreground/80"
        >
          {word}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-xs px-3 py-2 text-sm" align="center">
        <div className="font-medium text-foreground">{word}</div>
        <div className="text-muted-foreground text-xs mt-0.5">
          {translation ?? "No translation available"}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Renders German text where every word is click-to-translate.
 * Preserves whitespace and punctuation between words.
 */
export function DeText({ children }: { children: string }) {
  if (!children) return null;
  // split keeping separators
  const parts = children.split(/(\s+|[.,!?()„"“\-/]+)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        // word = contains a letter
        if (/[\p{L}]/u.test(p)) return <DeWord key={i} word={p} />;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}