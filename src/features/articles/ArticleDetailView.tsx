
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArticleItem } from '../../App/types';
import { ExternalLink } from 'lucide-react'; // Assuming ExternalLink is used, adjust if not

interface ArticleDetailViewProps {
  article: ArticleItem;
}

const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ article }) => {
  const markdownContent = article?.body_markdown || "# Article content not available";
  const imageUrl = article?.cover_image;
  const title = article?.title || "Article Not Found";
  const description = article?.description; // Used as summary
  const authorName = article?.user?.name || "Unknown Author";
  const publishDate = article?.readable_publish_date || "Date not available";
  const readingTime = article?.reading_time_minutes ?? 0;
  const tags = article?.tag_list || [];

  return (
    <div className="p-0 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Cover image for ${title}`}
          className="w-full h-48 md:h-64 object-cover"
        />
      )}
      <article
        className={`
          prose prose-sm md:prose-base dark:prose-invert
          max-w-3xl mx-auto
          px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10
          markdown-content
        `}
      >
        <h1 className="text-2xl md:text-3xl font-bold !mb-3 md:!mb-4 text-[var(--text-accent)]">{title}</h1>
        <p className="text-xs !text-[var(--text-muted)] !mb-4 md:!mb-6">
          By {authorName} &bull; Published on {publishDate} &bull; {readingTime > 0 ? `${readingTime} min read` : 'Reading time not available'}
        </p>
        {description && (
          <p className="!text-md md:!text-lg !text-[var(--text-muted)] !italic !my-4 md:!my-6 border-l-4 border-[var(--border-color)] pl-4 py-2">
            {description}
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 !mb-6 md:!mb-8">
            {tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--editor-tab-inactive-background)] text-[var(--text-muted)] border border-[var(--border-color)] no-underline">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[var(--link-foreground)] hover:underline">
                {props.children} <ExternalLink size={12} className="ml-1 opacity-70" />
              </a>
            )
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default ArticleDetailView;
