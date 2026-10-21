import type { CSSProperties } from "react";

function Chars({ text }: { text: string }) {
  return (
    <>
      {[...text].map((c, i) => (
        <span className="ch" style={{ "--i": i } as CSSProperties} key={i}>
          {c === " " ? "\u00a0" : c}
        </span>
      ))}
    </>
  );
}

/** A label that rolls up to a copy of itself on hover. */
export function Roll({ text }: { text: string }) {
  return (
    <span className="roll">
      <span>
        <Chars text={text} />
      </span>
      <span aria-hidden="true">
        <Chars text={text} />
      </span>
    </span>
  );
}

/** Text split into characters for staggered animation. */
export function SplitChars({ text }: { text: string }) {
  return <Chars text={text} />;
}
