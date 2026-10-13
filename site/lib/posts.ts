import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * Posts are plain markdown files in content/writing. Adding a file is the whole
 * publishing workflow: no registry to update, no CMS, no build step beyond the
 * normal build. Frontmatter is validated here so a missing field fails loudly
 * at build time instead of rendering an empty page.
 */
export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingMinutes: number;
  body: string;
};

const DIR = path.join(process.cwd(), 'content', 'writing');

function required(data: Record<string, unknown>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`content/writing/${file}: frontmatter field "${key}" is required.`);
  }
  return value;
}

/**
 * YAML turns an unquoted `date: 2026-10-02` into a Date, and gray-matter hands it
 * over as-is. Normalise both forms to a plain YYYY-MM-DD string so sorting and
 * formatting never depend on how the frontmatter happened to be typed.
 */
function requiredDate(data: Record<string, unknown>, file: string): string {
  const value = data.date;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const asString = required(data, 'date', file);
  const parsed = new Date(asString);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`content/writing/${file}: frontmatter "date" is not a parseable date.`);
  }
  return parsed.toISOString().slice(0, 10);
}

function readOne(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).length;

  return {
    slug: file.replace(/\.md$/, ''),
    title: required(data, 'title', file),
    date: requiredDate(data, file),
    summary: required(data, 'summary', file),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    // measured from the actual text, not guessed
    readingMinutes: Math.max(1, Math.round(words / 220)),
    body: content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readOne)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
