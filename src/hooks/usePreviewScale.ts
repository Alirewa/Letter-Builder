'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const A4_WIDTH_PX = 794;
const MIN_SCALE   = 0.3;
const PADDING     = 56; // generous padding — prevents scrollbar-appear/disappear loop

export function usePreviewScale() {
  // containerRef  → the overflow-auto scroll area (used by LetterPreview)
  // measureRef    → a stable outer div whose width never changes due to zoom (used for measurement)
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef   = useRef<HTMLDivElement>(null);
  const rafId        = useRef<number | undefined>(undefined);
  const [scale, setScale] = useState(1);

  const recalculate = useCallback(() => {
    // Prefer measuring the stable outer div; fall back to the scroll container
    const el = measureRef.current ?? containerRef.current;
    if (!el) return;
    const available = el.clientWidth - PADDING;
    const raw = Math.max(MIN_SCALE, Math.min(1, available / A4_WIDTH_PX));
    // Round to 3 dp and only update when the change is ≥ 1% — kills micro-oscillations
    const rounded = Math.round(raw * 1000) / 1000;
    setScale((prev) => (Math.abs(prev - rounded) >= 0.01 ? rounded : prev));
  }, []);

  useEffect(() => {
    recalculate();

    // Observe the STABLE outer container (measureRef), NOT the zoom-affected inner one
    const target = measureRef.current ?? containerRef.current;
    if (!target) return;

    const observer = new ResizeObserver(() => {
      if (rafId.current !== undefined) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(recalculate);
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (rafId.current !== undefined) cancelAnimationFrame(rafId.current);
    };
  }, [recalculate]);

  return { containerRef, measureRef, scale };
}
