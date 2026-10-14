import Link from 'next/link';
import { tagHref } from '@/lib/tags';

/**
 * A row of tag chips.
 *
 * Variants:
 *   'chip'  small pill, used in list rows
 *   'meta'  same size, used on a post's own header where the current tag should
 *           be visually marked rather than linked to itself
 *
 * Rendered as links everywhere except inside a clickable parent row. HTML does
 * not allow an <a> inside another <a>, and the browser will repair that markup
 * differently from React, causing hydration errors. In row previews, the whole
 * row is already the link, so the tags render as inert chips there.
 */
export function TagList({
  tags,
  variant = 'chip',
  activeTag,
  links = true,
  layout = 'wrap',
}: {
  tags: string[];
  variant?: 'chip' | 'meta';
  /** On a tag page, the tag being viewed: shown as current, not a link. */
  activeTag?: string;
  /** Disable when the list is nested inside another link. */
  links?: boolean;
  /** Stack row-preview tags so their pill edges align cleanly. */
  layout?: 'wrap' | 'stack';
}) {
  if (tags.length === 0) return null;

  const base =
    variant === 'chip'
      ? 'rounded-full border px-2.5 py-0.5 text-[11.5px]'
      : 'rounded-full border px-2.5 py-0.5 text-[11.5px]';

  const listClass =
    layout === 'stack'
      ? 'flex flex-col items-end gap-3'
      : 'flex flex-wrap gap-2';

  return (
    <span className={listClass}>
      {tags.map((tag) => {
        const isCurrent = activeTag && tag.toLowerCase() === activeTag.toLowerCase();
        const style = { fontFamily: 'var(--font-mono)' } as const;

        if (isCurrent || !links) {
          return (
            <span
              key={tag}
              className={links ? base : `${base} tag-link`}
              style={{
                ...style,
                color: isCurrent ? 'var(--accent)' : 'var(--muted)',
                borderColor: isCurrent
                  ? 'color-mix(in oklab, var(--accent) 45%, transparent)'
                  : 'var(--border)',
                background: isCurrent
                  ? 'color-mix(in oklab, var(--accent) 10%, transparent)'
                  : 'transparent',
              }}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {tag}
            </span>
          );
        }

        return (
          <Link
            key={tag}
            href={tagHref(tag)}
            className={`${base} tag-link`}
            style={{ ...style, color: 'var(--muted)' }}
          >
            {tag}
          </Link>
        );
      })}
    </span>
  );
}
