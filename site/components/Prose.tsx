import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

/**
 * Renders post markdown.
 *
 * Long-form typography lives in the .article-content rules in globals.css so it
 * stays consistent across every article rather than being restated per page.
 *
 * One override is needed here: a GFM table renders as a bare <table>, which on a
 * narrow screen is wider than its container and would push the whole page
 * sideways. Wrapping it in a scroll container means the table scrolls on its own
 * and the page does not. This is the standard fix and it has to happen in code,
 * because markdown gives you no way to add a wrapper element.
 */
const components: Components = {
  table({ children, ...props }) {
    return (
      <div className="table-scroll" role="region" aria-label="Data table" tabIndex={0}>
        <table {...props}>{children}</table>
      </div>
    );
  },
};

export function Prose({ children }: { children: string }) {
  return (
    <div className="article-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
