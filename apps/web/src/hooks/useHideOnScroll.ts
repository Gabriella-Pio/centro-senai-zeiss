"use client";

import { useEffect, useRef, useState } from "react";

const TOP_PX = 24;

/** Some ao descer, volta ao subir. No topo da página permanece visível. */
export function useHideOnScroll({
  disabled = false,
  threshold = 16,
}: {
  disabled?: boolean;
  threshold?: number;
} = {}) {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < TOP_PX);

      if (!disabled && !reduceMotion) {
        const delta = y - lastY.current;
        if (y < TOP_PX) {
          setHidden(false);
        } else if (delta > threshold) {
          setHidden(true);
        } else if (delta < -threshold) {
          setHidden(false);
        }
      }

      lastY.current = y;
    };

    lastY.current = window.scrollY;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [disabled, threshold]);

  return { hidden: disabled ? false : hidden, atTop };
}
