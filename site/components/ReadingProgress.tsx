'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reading progress.

 * Under the hood this is a CSS scroll-driven animation (animation-timeline),
 * which runs on the compositor instead of the main thread. A scroll event
 * listener would execute on every frame, so it is not used here.
 *
 * Two fallbacks keep it honest:
 *  - browsers without scroll-driven animation support get an IntersectionObserver
 *    sentinel at the document end, which reports progress in coarse steps
 *  - the bar is hidden entirely under prefers-reduced-motion
 *
 * Nothing here is load-bearing for reading: if it never renders, the page is
 * unaffected.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const ok =
      typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline', 'scroll()');
    setSupported(Boolean(ok));
  }, []);

  useEffect(() => {
    if (supported !== false) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Coarse fallback: marks how far down the document the reader has reached.
    const marks = [0.25, 0.5, 0.75, 1];
    const nodes: HTMLDivElement[] = [];

    marks.forEach((f) => {
      const node = document.createElement('div');
      node.setAttribute('aria-hidden', 'true');
      node.style.cssText = `position:absolute;left:0;top:${f * 100}%;width:1px;height:1px;pointer-events:none`;
      document.body.appendChild(node);
      nodes.push(node);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = nodes.indexOf(entry.target as HTMLDivElement);
          const pct = marks[index];
          el.style.transform = `scaleX(${pct})`;
          el.style.transition = 'transform .4s ease-out';
        });
      },
      { threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));

    return () => {
      io.disconnect();
      nodes.forEach((n) => n.remove());
    };
  }, [supported]);

  return <div ref={ref} className="progress-bar" aria-hidden="true" />;
}
