"use client";

import { useEffect, useRef, useState } from "react";

const TOP_PX = 24;
/** Mesmo corte da navbar: abaixo disso o menu é sanduíche e a barra fica travada. */
const WIDE_NAV = "(min-width: 90rem)";

/** Some ao descer, volta ao subir — só no desktop. No topo permanece visível. */
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
  const primed = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wideNav = window.matchMedia(WIDE_NAV);

    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < TOP_PX);

      if (!primed.current) {
        lastY.current = y;
        primed.current = true;
        setHidden(false);
        return;
      }

      const canHide = !disabled && !reduceMotion && wideNav.matches;
      if (canHide) {
        const delta = y - lastY.current;
        if (y < TOP_PX) {
          setHidden(false);
        } else if (delta > threshold) {
          setHidden(true);
        } else if (delta < -threshold) {
          setHidden(false);
        }
      } else {
        setHidden(false);
      }

      lastY.current = y;
    };

    primed.current = false;
    lastY.current = window.scrollY;
    setAtTop(window.scrollY < TOP_PX);
    setHidden(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    wideNav.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      wideNav.removeEventListener("change", onScroll);
    };
  }, [disabled, threshold]);

  return { hidden: disabled ? false : hidden, atTop };
}
