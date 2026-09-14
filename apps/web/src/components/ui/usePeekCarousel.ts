"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const PEEK_DESKTOP = 0.22;
const PEEK_MOBILE = 0.48;
const EASE = "transform .55s cubic-bezier(0.45, 0, 0.15, 1)";
const MOBILE_MQ = "(max-width: 768px)";
const TWO_CARD_MQ = "(max-width: 64rem)";

export function peekSlides<T>(items: T[], keyOf: (item: T, index: number) => string) {
  return [0, 1, 2].flatMap((copy) =>
    items.map((item, index) => ({
      item,
      index,
      copy,
      key: `${copy}-${keyOf(item, index)}`,
    })),
  );
}

function centeredPos(count: number, index: number, focusCount: number) {
  const centerOffset = focusCount % 2 === 0 ? 0 : Math.floor((focusCount - 1) / 2);
  return count + index - centerOffset;
}

interface UsePeekCarouselOptions {
  count: number;
  reduceMotion: boolean;
  intervalMs?: number;
  autoplay?: boolean;
  initialIndex?: number;
  centerInitial?: boolean;
}

function getStartPos(
  count: number,
  initialIndex: number,
  centerInitial: boolean,
  focusCount = 3,
) {
  if (count < 1) return 0;
  return centerInitial ? centeredPos(count, initialIndex, focusCount) : count;
}

export function usePeekCarousel({
  count,
  reduceMotion,
  intervalMs = 4200,
  autoplay = true,
  initialIndex = 0,
  centerInitial = false,
}: UsePeekCarouselOptions) {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const startPos = getStartPos(count, initialIndex, centerInitial);
  const posRef = useRef(startPos);
  const pausedRef = useRef(false);
  const metricsRef = useRef({ step: 0, cardW: 0, focusCount: 3, peek: PEEK_DESKTOP });
  const [pos, setPos] = useState(startPos);
  const [paused, setPaused] = useState(false);
  const [focusCount, setFocusCount] = useState(3);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const mobile = window.matchMedia(MOBILE_MQ).matches;
    const twoCards = window.matchMedia(TWO_CARD_MQ).matches;
    const nextFocus = mobile ? 1 : twoCards ? 2 : 3;
    const peek = mobile ? PEEK_MOBILE : PEEK_DESKTOP;
    const gap =
      Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 12;
    const visible = nextFocus + 2;
    const width = (viewport.clientWidth - (visible - 1) * gap) / (nextFocus + 2 * peek);

    for (const card of track.children) {
      (card as HTMLElement).style.flex = `0 0 ${width}px`;
    }

    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    const step = first && second ? second.offsetLeft - first.offsetLeft : width + gap;
    const cardW = first ? first.getBoundingClientRect().width : width;
    metricsRef.current = { step, cardW, focusCount: nextFocus, peek };
    setFocusCount(nextFocus);
  }, []);

  const apply = useCallback(
    (nextPos: number, animate: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      const { step, cardW, peek } = metricsRef.current;
      const peekHide = (1 - peek) * cardW;
      track.style.transition = animate && !reduceMotion ? EASE : "none";
      track.style.transform = `translate3d(${-((nextPos - 1) * step + peekHide)}px,0,0)`;
    },
    [reduceMotion],
  );

  const snap = useCallback(
    (to: number) => {
      posRef.current = to;
      setPos(to);
      apply(to, false);
      void trackRef.current?.offsetWidth;
    },
    [apply],
  );

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      measure();
      let next = posRef.current;
      if (delta > 0 && next >= 2 * count) snap(next - count);
      if (delta < 0 && next <= 1) snap(next + count);
      next = posRef.current + delta;
      posRef.current = next;
      setPos(next);
      apply(next, !reduceMotion);
    },
    [apply, count, measure, reduceMotion, snap],
  );

  const goTo = useCallback(
    (target: number) => {
      if (count < 2) return;
      measure();
      const n = metricsRef.current.focusCount;
      const offset = n % 2 === 0 ? 0 : Math.floor((n - 1) / 2);
      let next = posRef.current;
      if (next >= 2 * count) snap(next - count);
      if (next < count) snap(next + count);
      next = count + target - offset;
      posRef.current = next;
      setPos(next);
      apply(next, !reduceMotion);
    },
    [apply, count, measure, reduceMotion, snap],
  );

  const goRef = useRef(go);
  goRef.current = go;

  useLayoutEffect(() => {
    measure();
    apply(posRef.current, false);
  }, [apply, count, measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count < 2) return;

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return;
      const current = posRef.current;
      if (current >= 2 * count) snap(current - count);
      if (current < 1) snap(current + count);
    };

    track.addEventListener("transitionend", onEnd);
    return () => track.removeEventListener("transitionend", onEnd);
  }, [count, snap]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onResize = () => {
      measure();
      apply(posRef.current, false);
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(viewport);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [apply, measure]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!autoplay || reduceMotion || paused || count < 2) return;
    const id = window.setTimeout(() => {
      if (!pausedRef.current) goRef.current(1);
    }, intervalMs);
    return () => window.clearTimeout(id);
  }, [autoplay, count, intervalMs, paused, pos, reduceMotion]);

  const leftPeek = pos - 1;
  const centerOffset = focusCount % 2 === 0 ? 0 : Math.floor((focusCount - 1) / 2);
  const centerRel = focusCount % 2 === 0 ? -1 : 1 + centerOffset;
  const centerIndex = (((pos + centerOffset) % count) + count) % count;

  const slideState = useCallback(
    (copy: number, index: number) => {
      const rel = copy * count + index - leftPeek;
      return {
        isPeek: rel === 0 || rel === focusCount + 1,
        isFocus: rel >= 1 && rel <= focusCount,
        isCenter: rel === centerRel,
        decorative: copy !== 1,
      };
    },
    [centerRel, count, focusCount, leftPeek],
  );

  const playing = autoplay && !reduceMotion && !paused && count >= 2;

  return useMemo(
    () => ({
      stageRef,
      viewportRef,
      trackRef,
      pos,
      paused,
      playing,
      intervalMs,
      setPaused,
      focusCount,
      centerIndex,
      go,
      goTo,
      slideState,
    }),
    [centerIndex, focusCount, go, goTo, intervalMs, playing, pos, paused, slideState],
  );
}
