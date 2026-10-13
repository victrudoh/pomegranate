import { FileTextIcon, DatabaseIcon, DownloadIcon } from './Icons';

/**
 * The CV downloads. Both PDFs live in site/public/cv, so these are plain anchor
 * downloads. They work without JavaScript, are keyboard reachable, and expose
 * the file type and size in the visible label rather than hiding it behind an
 * icon.
 */
const CVS = [
  {
    href: '/cv/victory-udoh-cv-frontend-2026.pdf',
    title: 'Frontend focused',
    meta: 'PDF · 90 KB · 2026',
    Icon: FileTextIcon,
  },
  {
    href: '/cv/victory-udoh-cv-backend-2026.pdf',
    title: 'Backend focused',
    meta: 'PDF · 49 KB · 2026',
    Icon: DatabaseIcon,
  },
];

export function CvDownloads() {
  return (
    <div className="mt-6 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
      {CVS.map(({ href, title, meta, Icon }) => (
        <a key={href} href={href} download className="cv-card group">
          <span className="cv-icon">
            <Icon size={17} />
          </span>
          <span className="flex-1">
            <strong className="block text-[15.5px] font-semibold tracking-[-0.012em]">
              {title}
            </strong>
            <span className="mono-meta">{meta}</span>
          </span>
          <span className="cv-download">
            <DownloadIcon size={16} />
          </span>
        </a>
      ))}
    </div>
  );
}
