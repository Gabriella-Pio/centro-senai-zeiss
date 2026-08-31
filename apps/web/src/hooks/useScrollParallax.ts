"use client";

import { useEffect, useRef } from "react";

/**
 * Parallax no hero: a foto desloca em Y conforme a seção sobe/desce na viewport.
 * factor ~0.25 → ~25px a cada 100px de scroll (visível, mas ainda sutil).
 */
export function useScrollParallax(factor = 0.25) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;

    function update() {
      if (!node) return;
      const section = node.closest("section");
      const bounds = (section ?? node).getBoundingClientRect();
      const view = window.innerHeight;
      if (bounds.bottom < 0 || bounds.top > view) return;

      const offset = -bounds.top * factor;
      node.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [factor]);

  return ref;
}
