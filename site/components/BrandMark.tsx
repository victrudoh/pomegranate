/**
 * The pomegranate mark. Drawn from geometric primitives (circle + line), the
 * same construction as the inline icon set, and tinted with the aril ramp.
 * Not a traced or hand-drawn illustration.
 */
export function BrandMark({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 21c-3.9 0-6.5-2.9-6.5-6.6C5.5 10.5 8.4 7 12 7s6.5 3.5 6.5 7.4C18.5 18.1 15.9 21 12 21Z" />
      <path d="M12 7V4.2" />
      <path d="M12 4.2 10.2 2.6" />
      <path d="M12 4.2l1.8-1.6" />
      <circle cx="8.6" cy="14.4" r="1.1" />
      <circle cx="12" cy="17.2" r="1.1" />
      <circle cx="15.4" cy="13.6" r="1.1" />
    </svg>
  );
}
