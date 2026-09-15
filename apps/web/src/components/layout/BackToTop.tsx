"use client";

import { ArrowUp } from "lucide-react";
import { Button } from "@cem/ui";

let frame = 0;

function scrollToTop() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, 0);
    return;
  }

  const start = window.scrollY;
  if (start < 8) return;

  const duration = Math.min(2400, Math.max(900, start * 0.32));
  const origin = performance.now();
  cancelAnimationFrame(frame);

  const easeInOut = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

  const step = (now: number) => {
    const t = Math.min(1, (now - origin) / duration);
    window.scrollTo(0, Math.round(start * (1 - easeInOut(t))));
    if (t < 1) frame = requestAnimationFrame(step);
  };

  frame = requestAnimationFrame(step);
}

export function BackToTop({ label }: { label: string }) {
  return (
    <Button
      size="icon-lg"
      variant="outline"
      render={<a href="#top" />}
      aria-label={label}
      title={label}
      className="footer-top-btn"
      onClick={(event) => {
        event.preventDefault();
        scrollToTop();
      }}
    >
      <ArrowUp size={18} strokeWidth={1.75} />
    </Button>
  );
}
