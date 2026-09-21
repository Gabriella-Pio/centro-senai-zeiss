const STICKY_NAV_SELECTORS = [
  ".tariffs-page-nav",
  ".tariffs-workspace__sticky-label",
  ".tariffs-segmented-bar--panel",
];

/** Altura da faixa de leitura logo abaixo das barras sticky. */
const READING_ZONE_HEIGHT = 168;

/** Desloca o scroll um pouco além do topo da seção para ela "assumir" a faixa de leitura. */
const SCROLL_ANCHOR_BIAS = 12;

const DEFAULT_OFFSET_EXTRA = 16;

function isStickyActive(element: Element) {
  const style = window.getComputedStyle(element);
  if (style.position !== "sticky" && style.position !== "fixed") return false;

  const rect = element.getBoundingClientRect();
  const stickyTop = Number.parseFloat(style.top) || 0;
  return rect.top <= stickyTop + 1 && rect.bottom > stickyTop + 1;
}

/** Altura até o fim das barras sticky realmente fixas no topo. */
export function getTariffScrollOffset(extra = DEFAULT_OFFSET_EXTRA) {
  if (typeof window === "undefined") return 140;

  let offset = extra;
  for (const selector of STICKY_NAV_SELECTORS) {
    const element = document.querySelector(selector);
    if (!element || !isStickyActive(element)) continue;
    offset = Math.max(offset, element.getBoundingClientRect().bottom + 8);
  }

  return offset;
}

function scrollToElement(element: HTMLElement, behavior: ScrollBehavior, extra: number) {
  const offset = getTariffScrollOffset(extra);
  const top =
    element.getBoundingClientRect().top + window.scrollY - offset - SCROLL_ANCHOR_BIAS;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function scrollToTariffSection(
  elementId: string,
  behavior: ScrollBehavior = "smooth",
  extra = DEFAULT_OFFSET_EXTRA,
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const shouldExpandDetails = element instanceof HTMLDetailsElement && !element.open;
  if (shouldExpandDetails) {
    element.open = true;
  }

  if (shouldExpandDetails) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToElement(element, behavior, extra);
      });
    });
    return;
  }

  scrollToElement(element, behavior, extra);
}

function getReadingZone(extra = DEFAULT_OFFSET_EXTRA) {
  const top = getTariffScrollOffset(extra);
  const bottom = Math.min(top + READING_ZONE_HEIGHT, window.innerHeight);
  return { top, bottom };
}

function getSectionVisibilityScore(rect: DOMRect, zoneTop: number, zoneBottom: number) {
  const visibleTop = Math.max(rect.top, zoneTop);
  const visibleBottom = Math.min(rect.bottom, zoneBottom);
  return Math.max(0, visibleBottom - visibleTop);
}

/** Retorna a seção com mais conteúdo visível na faixa de leitura abaixo das barras sticky. */
export function getActiveSectionId(sectionIds: readonly string[], extra = DEFAULT_OFFSET_EXTRA) {
  if (typeof window === "undefined") return sectionIds[0] ?? "";

  const { top: zoneTop, bottom: zoneBottom } = getReadingZone(extra);

  let bestId = sectionIds[0] ?? "";
  let bestScore = -1;
  let bestIndex = -1;

  sectionIds.forEach((id, index) => {
    const element = document.getElementById(id);
    if (!element) return;

    const score = getSectionVisibilityScore(element.getBoundingClientRect(), zoneTop, zoneBottom);
    if (score > bestScore || (score === bestScore && score > 0 && index > bestIndex)) {
      bestScore = score;
      bestIndex = index;
      bestId = id;
    }
  });

  if (bestScore > 0) return bestId;

  // Fallback: última seção que já começou a entrar na faixa de leitura.
  let current = sectionIds[0] ?? "";
  for (const id of sectionIds) {
    const element = document.getElementById(id);
    if (!element) continue;
    if (element.getBoundingClientRect().top <= zoneBottom) {
      current = id;
    }
  }

  return current;
}

export function isSectionActiveInReadingZone(
  sectionId: string,
  extra = DEFAULT_OFFSET_EXTRA,
) {
  const element = document.getElementById(sectionId);
  if (!element) return false;

  const { top: zoneTop, bottom: zoneBottom } = getReadingZone(extra);
  return getSectionVisibilityScore(element.getBoundingClientRect(), zoneTop, zoneBottom) > 0;
}
