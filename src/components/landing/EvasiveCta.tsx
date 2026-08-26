import type { ReactNode } from "react";
import { useState } from "react";
import { useEvasiveCta } from "./useEvasiveCta";

/**
 * A call to action that backs away from the pointer, harder each time, and
 * surrenders after a few passes so the click can land. Keyboard and touch are
 * never intercepted, so they reach `onCaught` on the first press.
 *
 * Roams within the nearest ancestor carrying `data-evasion-bounds`.
 */
export function EvasiveCta({
  className,
  evadingClassName,
  onCaught,
  children,
}: {
  className?: string;
  evadingClassName?: string;
  onCaught: () => void;
  children: ReactNode;
}) {
  const [caught, setCaught] = useState(false);
  const { buttonRef, style, evading } = useEvasiveCta(!caught);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={[className, evading && evadingClassName].filter(Boolean).join(" ")}
      style={style}
      onClick={() => {
        setCaught(true);
        onCaught();
      }}
    >
      {children}
    </button>
  );
}
