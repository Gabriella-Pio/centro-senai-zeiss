"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getActiveSectionId,
  isSectionActiveInReadingZone,
  scrollToTariffSection,
} from "@/lib/tariff-scroll";

const SCROLL_SETTLE_MS = 2200;

export function useTariffSectionNav(
  sectionIds: readonly string[],
  options?: { offsetExtra?: number },
) {
  const offsetExtra = options?.offsetExtra ?? 16;
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const manualTargetRef = useRef<string | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  const detectActiveSection = useCallback(() => {
    return getActiveSectionId(sectionIds, offsetExtra);
  }, [sectionIds, offsetExtra]);

  const clearManualTarget = useCallback(() => {
    manualTargetRef.current = null;
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const tryReleaseManualTarget = useCallback(() => {
    const manualTarget = manualTargetRef.current;
    if (!manualTarget) return;

    const detected = detectActiveSection();
    const manualIsVisible = isSectionActiveInReadingZone(manualTarget, offsetExtra);

    if (detected === manualTarget || manualIsVisible) {
      clearManualTarget();
      setActiveId(detected);
      return;
    }

    setActiveId(manualTarget);
  }, [clearManualTarget, detectActiveSection, offsetExtra]);

  const updateActiveFromScroll = useCallback(() => {
    if (manualTargetRef.current) {
      tryReleaseManualTarget();
      return;
    }

    setActiveId(detectActiveSection());
  }, [detectActiveSection, tryReleaseManualTarget]);

  useEffect(() => {
    setActiveId(detectActiveSection());
  }, [detectActiveSection]);

  useEffect(() => {
    updateActiveFromScroll();

    const onScrollEnd = () => {
      updateActiveFromScroll();
    };

    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);
    window.addEventListener("scrollend", onScrollEnd);

    return () => {
      window.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      clearManualTarget();
    };
  }, [updateActiveFromScroll, clearManualTarget]);

  const scrollToSection = useCallback(
    (id: string) => {
      setActiveId(id);
      manualTargetRef.current = id;

      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }

      settleTimerRef.current = window.setTimeout(() => {
        settleTimerRef.current = null;
        if (manualTargetRef.current === id) {
          clearManualTarget();
          setActiveId(detectActiveSection());
        }
      }, SCROLL_SETTLE_MS);

      scrollToTariffSection(id, "smooth", offsetExtra);
    },
    [clearManualTarget, detectActiveSection, offsetExtra],
  );

  return { activeId, scrollToSection };
}
