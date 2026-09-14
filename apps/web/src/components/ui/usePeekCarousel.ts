"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const PEEK_DESKTOP = 0.22;
const PEEK_SIDE_FULL = 1;
const PEEK_SIDE_MID = 0.24;
const PEEK_SIDE_MIN = 0.1;
const EASE = "transform .55s cubic-bezier(0.45, 0, 0.15, 1)";
const TRIPLE_MQ = "(min-width: 64rem)";
const PEEK_RANGE_MAX = 1024;
const PEEK_RANGE_MID = 700;
const PEEK_RANGE_MIN = 360;

function sidePeek(viewportWidth: number) {
  if (viewportWidth >= PEEK_RANGE_MID) {
    const t = (PEEK_RANGE_MAX - viewportWidth) / (PEEK_RANGE_MAX - PEEK_RANGE_MID);
    const clamped = Math.min(1, Math.max(0, t));
    return PEEK_SIDE_FULL + clamped * (PEEK_SIDE_MID - PEEK_SIDE_FULL);
  }
  const t = (PEEK_RANGE_MID - viewportWidth) / (PEEK_RANGE_MID - PEEK_RANGE_MIN);
  const clamped = Math.min(1, Math.max(0, t));
  return PEEK_SIDE_MID + clamped * (PEEK_SIDE_MIN - PEEK_SIDE_MID);
}

function focusOffset(focusCount: number) {
  return focusCount % 2 === 0 ? 0 : Math.floor((focusCount - 1) / 2);
}

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
  return count + index - focusOffset(focusCount);
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
  const measuredRef = useRef(false);
  const metricsRef = useRef({ step: 0, cardW: 0, focusCount: 3, peek: PEEK_DESKTOP });
  const [pos, setPos] = useState(startPos);
  const [paused, setPaused] = useState(false);
  const [focusCount, setFocusCount] = useState(3);
  const [peek, setPeek] = useState(PEEK_DESKTOP);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const triple = window.matchMedia(TRIPLE_MQ).matches;
    const nextFocus = triple ? 3 : 1;
    const nextPeek = triple ? PEEK_DESKTOP : sidePeek(window.innerWidth);
    const gap =
      Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 12;
    const visible = nextFocus + 2;
    const width =
      (viewport.clientWidth - Math.max(visible - 1, 0) * gap) / (nextFocus + 2 * nextPeek);

    for (const card of track.children) {
      (card as HTMLElement).style.flex = `0 0 ${width}px`;
    }

    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    const step = first && second ? second.offsetLeft - first.offsetLeft : width + gap;
    const cardW = first ? first.getBoundingClientRect().width : width;
    const prevFocus = metricsRef.current.focusCount;
    if (measuredRef.current && prevFocus !== nextFocus) {
      const shifted = posRef.current + focusOffset(prevFocus) - focusOffset(nextFocus);
      posRef.current = shifted;
      setPos(shifted);
    }
    measuredRef.current = true;
    metricsRef.current = { step, cardW, focusCount: nextFocus, peek: nextPeek };
    setFocusCount(nextFocus);
    setPeek(nextPeek);
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
      const offset = focusOffset(n);
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
  const centerOffset = focusOffset(focusCount);
  const centerRel = 1 + centerOffset;
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
      peek,
      centerIndex,
      go,
      goTo,
      slideState,
    }),
    [centerIndex, focusCount, go, goTo, intervalMs, peek, playing, pos, paused, slideState],
  );
}
