/**
 * The pomegranate mark.
 *
 * Geometry lives on a 32-unit grid and is kept in sync with tools/build-brand.mjs,
 * which generates the favicon and social card from the same numbers.
 *
 * This is intentionally a pure silhouette: a rounded body with a bold
 * three-point crown. Testing at real pixel sizes showed interior seed detail
 * blurs into an unreadable smudge below roughly 24px, and 16px is the size that
 * actually matters in a browser tab. The crown is what makes it a pomegranate
 * rather than a generic berry, so the crown carries the identity and the
 * interior stays empty.
 *
 * Two tones:
 *   'rind'  crimson mark on transparent, for the header
 *   'tile'  cream mark on a crimson rounded tile, matching the favicon
 */
type Tone = 'rind' | 'tile';

export function BrandMark({
  size = 20,
  tone = 'rind',
  className,
}: {
  size?: number;
  tone?: Tone;
  className?: string;
}) {
  const body = { cx: 16, cy: 19.6, rx: 11.4, ry: 11 };
  const crown = 'M8.6 12.4 L10.6 3.2 L13.3 9.2 L16 1.4 L18.7 9.2 L21.4 3.2 L23.4 12.4 Z';
  const markFill = tone === 'tile' ? 'var(--brand-cream, #f6ece7)' : 'var(--accent, #d94f5c)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className ? `shrink-0 ${className}` : 'shrink-0'}
    >
      {tone === 'tile' && (
        <rect width="32" height="32" rx="7.5" fill="var(--brand-rind, #8e2839)" />
      )}
      <ellipse
        cx={body.cx}
        cy={body.cy}
        rx={body.rx}
        ry={body.ry}
        fill={markFill}
      />
      <path d={crown} fill={markFill} />
    </svg>
  );
}
