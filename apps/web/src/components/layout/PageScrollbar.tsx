"use client";

import { useEffect, useRef, useState } from "react";
import "./page-scrollbar.css";

const THUMB_MIN = 48;
/** Distância da borda direita em que a barra reaparece. */
const EDGE_PX = 36;
const HIDE_MS = 320;
const SCROLL_HIDE_MS = 900;

type Thumb = { top: number; height: number };

export function PageScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; offset: number } | null>(null);
  const thumbRef = useRef<Thumb | null>(null);
  const nearRef = useRef(false);
  const hideTimer = useRef(0);
  const [thumb, setThumb] = useState<Thumb | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const enable = () => {
      const on = fine.matches;
      setEnabled(on);
      document.documentElement.classList.toggle("has-page-scrollbar", on);
    };
    enable();
    fine.addEventListener("change", enable);
    return () => {
      fine.removeEventListener("change", enable);
      document.documentElement.classList.remove("has-page-scrollbar");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const clearHide = () => window.clearTimeout(hideTimer.current);

    const hideSoon = (delay: number) => {
      clearHide();
      hideTimer.current = window.setTimeout(() => {
        if (!dragRef.current && !nearRef.current) setVisible(false);
      }, delay);
    };

    const reveal = (delay: number) => {
      setVisible(true);
      hideSoon(delay);
    };

    const sync = () => {
      if (dragRef.current) return;
      const view = window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const max = total - view;
      const track = trackRef.current?.clientHeight ?? 0;
      if (max <= 1 || track <= 0) {
        thumbRef.current = null;
        setThumb(null);
        return;
      }
      const height = Math.max(THUMB_MIN, (view / total) * track);
      const next = { height, top: (window.scrollY / max) * (track - height) };
      thumbRef.current = next;
      setThumb(next);
    };

    const onPointerMove = (event: PointerEvent) => {
      const near = event.clientX >= window.innerWidth - EDGE_PX;
      if (near === nearRef.current) return;
      nearRef.current = near;
      if (near) {
        clearHide();
        setVisible(true);
        return;
      }
      if (!dragRef.current) hideSoon(HIDE_MS);
    };

    const onScroll = () => {
      sync();
      reveal(SCROLL_HIDE_MS);
    };

    sync();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync);
    const observer = new ResizeObserver(sync);
    observer.observe(document.body);
    return () => {
      clearHide();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
      observer.disconnect();
    };
  }, [enabled]);

  const scrollToClientY = (clientY: number, grabOffset: number) => {
    const track = trackRef.current;
    const current = thumbRef.current;
    if (!track || !current) return;
    const rect = track.getBoundingClientRect();
    const range = rect.height - current.height;
    if (range <= 0) return;
    const y = Math.min(range, Math.max(0, clientY - rect.top - grabOffset));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, (y / range) * max);
    const next = { height: current.height, top: y };
    thumbRef.current = next;
    setThumb(next);
  };

  if (!enabled) return null;

  return (
    <div
      ref={trackRef}
      className={`page-scrollbar${visible ? " is-visible" : ""}`}
      aria-hidden="true"
      onPointerDown={(event) => {
        const current = thumbRef.current;
        if (!current) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const y = event.clientY - rect.top;
        const onThumb = y >= current.top && y <= current.top + current.height;
        const offset = onThumb ? y - current.top : current.height / 2;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { pointerId: event.pointerId, offset };
        setVisible(true);
        if (!onThumb) scrollToClientY(event.clientY, offset);
      }}
      onPointerMove={(event) => {
        if (dragRef.current?.pointerId !== event.pointerId) return;
        scrollToClientY(event.clientY, dragRef.current.offset);
      }}
      onPointerUp={(event) => {
        if (dragRef.current?.pointerId !== event.pointerId) return;
        dragRef.current = null;
        if (!nearRef.current) setVisible(false);
      }}
      onPointerCancel={() => {
        dragRef.current = null;
        if (!nearRef.current) setVisible(false);
      }}
    >
      {thumb ? (
        <div
          className="page-scrollbar__thumb"
          style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }}
        />
      ) : null}
    </div>
  );
}
