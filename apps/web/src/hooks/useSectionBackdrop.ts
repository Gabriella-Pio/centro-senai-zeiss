"use client";

import { useEffect, useState, type RefObject } from "react";

/** Cor de fundo da <section> que está atrás da navbar. */
export function useSectionBackdrop(
  headerRef: RefObject<HTMLElement | null>,
  key?: string,
) {
  const [color, setColor] = useState<string>();

  useEffect(() => {
    let frame = 0;

    const sample = () => {
      const header = headerRef.current;
      const y = header ? Math.max(8, header.getBoundingClientRect().height / 2) : 48;
      const x = Math.min(window.innerWidth / 2, window.innerWidth - 8);
      if (header) header.style.pointerEvents = "none";
      const stack = document.elementsFromPoint(x, y);
      if (header) header.style.pointerEvents = "";
      const section = stack.find(
        (el): el is HTMLElement => el instanceof HTMLElement && el.tagName === "SECTION",
      );
      const next = solidBackground(section ?? document.body);
      setColor((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sample);
    };

    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headerRef, key]);

  return color;
}

let mixCanvas: HTMLCanvasElement | undefined;
let mixCtx: CanvasRenderingContext2D | null = null;

/** Compõe a cor da seção sobre o cream do body, para fundo sólido mesmo com /50. */
function solidBackground(el: HTMLElement) {
  const color = getComputedStyle(el).backgroundColor;
  const base = getComputedStyle(document.body).backgroundColor;
  if (!mixCanvas) {
    mixCanvas = document.createElement("canvas");
    mixCanvas.width = 1;
    mixCanvas.height = 1;
    mixCtx = mixCanvas.getContext("2d");
  }
  const ctx = mixCtx;
  if (!ctx) return color;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}
