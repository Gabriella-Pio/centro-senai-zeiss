"use client";

import { useCallback, useEffect, useState } from "react";

interface UseSnapCarouselOptions {
  infinite?: boolean;
}

export function useSnapCarousel(
  scrollRef: React.RefObject<HTMLElement | null>,
  count: number,
  { infinite = true }: UseSnapCarouselOptions = {},
) {
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el || count < 1) return;

      const next = infinite
        ? ((index % count) + count) % count
        : Math.max(0, Math.min(index, count - 1));
      const child = el.children[next] as HTMLElement | undefined;
      child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      setActive(next);
    },
    [scrollRef, count, infinite],
  );

  const goPrev = useCallback(() => {
    goTo(active - 1);
  }, [active, goTo]);

  const goNext = useCallback(() => {
    goTo(active + 1);
  }, [active, goTo]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || count < 2) return;

    const slides = Array.from(root.children) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = -1;
        let bestRatio = 0;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = slides.indexOf(entry.target as HTMLElement);
          if (index < 0) continue;
          if (entry.intersectionRatio >= bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = index;
          }
        }

        if (bestIndex >= 0) setActive(bestIndex);
      },
      { root, threshold: [0.35, 0.5, 0.65, 0.85] },
    );

    slides.forEach((slide) => observer.observe(slide));

    const onScrollEnd = () => {
      const center = root.scrollLeft + root.clientWidth / 2;
      let closest = 0;
      let minDistance = Infinity;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(center - slideCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closest = index;
        }
      });

      setActive(closest);
    };

    root.addEventListener("scrollend", onScrollEnd);
    root.addEventListener("scroll", onScrollEnd, { passive: true });
    onScrollEnd();

    return () => {
      observer.disconnect();
      root.removeEventListener("scrollend", onScrollEnd);
      root.removeEventListener("scroll", onScrollEnd);
    };
  }, [scrollRef, count]);

  return {
    active,
    goTo,
    goPrev,
    goNext,
    canPrev: infinite || active > 0,
    canNext: infinite || active < count - 1,
  };
}
