'use client';

import { useEffect, useRef } from 'react';

/**
 * A card whose surface lighting follows the cursor.
 *
 * The pointer position is written to CSS custom properties via a ref, which the
 * radial-gradient in globals.css reads. React never re-renders on pointer move,
 * so this stays off the render path entirely.
 *
 * Disabled for coarse pointers (touch) and under prefers-reduced-motion, where
 * the wrapper simply renders nothing extra.
 */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    let frame = 0;
    function onMove(e: PointerEvent) {
      // coalesce to one write per frame rather than one per pointer event
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        node.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        node.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    }

    el.addEventListener('pointermove', onMove);
    return () => {
      el.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`card-glow ${className}`}>
      {children}
    </div>
  );
}
