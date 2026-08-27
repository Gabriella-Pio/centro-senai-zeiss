"use client";

import { useEffect, useRef, useState } from "react";

/** Some ao descer, volta ao subir. Fica visível no topo da página. */
export function useHideOnScroll({
  disabled = false,
  threshold = 8,
}: {
  disabled?: boolean;
  threshold?: number;
} = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (disabled) {
      setHidden(false);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < 24) {
        setHidden(false);
      } else if (delta > threshold) {
        setHidden(true);
      } else if (delta < -threshold) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [disabled, threshold]);

  return hidden;
}
