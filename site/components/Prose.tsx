import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

/**
 * Renders post markdown. Long-form styling lives in the .article-content rules
 * in globals.css so the typography stays consistent across every article
 * instead of being re-specified per page.
 */
export function Prose({ children }: { children: string }) {
  return (
    <div className="article-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
