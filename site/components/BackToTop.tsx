'use client';

import { useEffect, useState } from 'react';

/**
 * The trigger element. Rendered FIRST in <body>.
 *
 * It is a normal-flow block 1.5 viewport heights tall with an equal negative
 * bottom margin, so it takes no visual space while its bottom edge still lands
 * at 150vh. The observer watches this element: while any of it is on screen the
 * reader is within the first screen and a half, and the button stays hidden.
 *
 * A DOM id is used rather than a React ref because the button and the trigger
 * are separate components, and passing a ref across them would mean lifting
 * state up into the layout for something that is purely presentational.
 */
export const SENTINEL_ID = 'scroll-sentinel';

export function BackToTopSentinel() {
  return (
    <div className="back-to-top-sentinel-wrap" aria-hidden="true">
      <div id={SENTINEL_ID} className="back-to-top-sentinel" />
    </div>
  );
}

/**
 * Back-to-top button with a reading-progress ring.
 *
 * Two deliberate choices:
 *
 *  1. **No scroll event listener.** Visibility comes from an IntersectionObserver
 *     on the sentinel, and the ring is a CSS scroll-driven animation
 *     (`animation-timeline: scroll(root)`) which runs on the compositor. That is
 *     the same mechanism the top progress bar uses, so the two cannot disagree.
 *
 *  2. **The button is navigation, not decoration.** Under prefers-reduced-motion
 *     it appears with no transition, but it still appears and still works.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = document.getElementById(SENTINEL_ID);

    // If the sentinel is missing there is no way to know the scroll position
    // cheaply, so show the button rather than hiding a navigation control
    // forever.
    if (!node || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        // Once the sentinel's bottom edge is above the viewport top, the reader
        // is past 150vh and the button should be available. The default
        // (unscrolled) state is also non-intersecting, which is why the position
        // of the rect, not just isIntersecting, has to be part of the test:
        // a target that has never been on screen reports isIntersecting false
        // and a rect at the bottom of the viewport.
        const past = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
        setVisible(past);
      },
      { threshold: 0 },
    );

    io.observe(node);

    // Re-evaluate once on mount, in case the page is loaded already scrolled
    // (a refresh part-way down, or a deep link to an anchor).
    const rect = node.getBoundingClientRect();
    if (rect.bottom <= 0) setVisible(true);

    return () => io.disconnect();
  }, []);

  function toTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  // ring geometry: 44px circle, 2px stroke, starting at 12 o'clock
  const R = 20;
  const C = 2 * Math.PI * R;

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className="back-to-top"
      data-visible={visible ? '1' : '0'}
      // Keep it out of the tab order and away from assistive tech while hidden.
      // Without this a keyboard user tabs into a control they cannot see.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 44 44" aria-hidden="true" className="back-to-top-ring">
        <circle cx="22" cy="22" r={R} fill="none" stroke="var(--border)" strokeWidth="2" />
        <circle
          cx="22"
          cy="22"
          r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={C}
          // resting value for browsers without scroll-driven animation support;
          // the @supports block in globals.css overrides it where supported
          strokeDashoffset={C}
          transform="rotate(-90 22 22)"
        />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="back-to-top-arrow">
        <path
          d="M12 19V5M6 11l6-6 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
