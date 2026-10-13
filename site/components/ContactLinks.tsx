import { GithubIcon, LinkedinIcon, MailIcon, ArrowRight } from './Icons';

const LINKS = [
  { href: 'https://github.com/victrudoh', label: 'GitHub', handle: '/victrudoh', Icon: GithubIcon },
  {
    href: 'https://linkedin.com/in/victory-udoh-71ba6b20a',
    label: 'LinkedIn',
    handle: '/victory-udoh',
    Icon: LinkedinIcon,
  },
  { href: 'mailto:victrudoh@gmail.com', label: 'Email', handle: 'victrudoh@gmail.com', Icon: MailIcon },
];

export function ContactLinks() {
  return (
    <div className="flex flex-col border-t" style={{ borderColor: 'var(--border)' }}>
      {LINKS.map(({ href, label, handle, Icon }) => (
        <a
          key={href}
          href={href}
          rel="me noopener"
          className="group flex items-center justify-between gap-4 border-b py-4 transition-all hover:pl-1.5 hover:text-[var(--accent)]"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="flex items-center gap-3 text-[15.5px]">
            <Icon className="transition-colors group-hover:text-[var(--accent)]" />
            {label}
          </span>
          <span className="flex items-center gap-2">
            <span className="mono-meta">{handle}</span>
            <ArrowRight
              size={14}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            />
          </span>
        </a>
      ))}
    </div>
  );
}
