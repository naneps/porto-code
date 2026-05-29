import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Clock, ExternalLink, Link2, Linkedin, Sparkles, Twitter, User } from 'lucide-react';
import { ArticleItem, NotificationType, NotificationAction } from '../../App/types';

interface ArticleDetailViewProps {
  article: ArticleItem;
  allArticles?: ArticleItem[];
  onOpenArticle?: (article: ArticleItem) => void;
  onCloseTab?: () => void;
  addNotificationAndLog?: (message: string, type: NotificationType, duration?: number, actions?: NotificationAction[], icon?: any) => void;
}

const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  allArticles = [],
  onOpenArticle,
  onCloseTab,
  addNotificationAndLog
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [coverImageFailed, setCoverImageFailed] = useState(false);

  const markdownContent = article?.body_markdown || "# Article content not available";
  const rawImageUrl = article?.cover_image || article?.social_image || null;
  const title = article?.title || "Article Not Found";
  const description = article?.description; // Used as summary
  const authorName = article?.user?.name || "Unknown Author";
  const authorUsername = article?.user?.username || "unknown";
  const publishDate = article?.readable_publish_date || "Date not available";
  const readingTime = article?.reading_time_minutes ?? 0;
  const tags = article?.tag_list || [];

  // Track scroll position to update reading progress bar
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const totalHeight = container.scrollHeight - container.clientHeight;
    if (totalHeight > 0) {
      const progress = (container.scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      // Reset scroll position and progress when article changes
      container.scrollTop = 0;
      setScrollProgress(0);
    }
    // Reset image error state when switching articles
    setCoverImageFailed(false);
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [article]);

  // Curate 3 related articles (prioritize same source/category)
  let relatedArticles = allArticles
    .filter(a => a.id !== article?.id)
    .filter(a => a.user.username === authorUsername || (article?.category && a.category === article.category));

  if (relatedArticles.length < 3) {
    const existingIds = new Set(relatedArticles.map(a => a.id));
    const fallback = allArticles
      .filter(a => a.id !== article?.id && !existingIds.has(a.id))
      .slice(0, 3 - relatedArticles.length);
    relatedArticles = [...relatedArticles, ...fallback];
  }
  relatedArticles = relatedArticles.slice(0, 3);

  const handleCopyLink = () => {
    const urlToCopy = article?.url || window.location.href;
    navigator.clipboard.writeText(urlToCopy);
    if (addNotificationAndLog) {
      addNotificationAndLog(
        "Article link copied to clipboard!",
        "success",
        3000
      );
    } else {
      alert("Link copied!");
    }
  };

  const getSourceName = (username: string) => {
    const sourceNames: Record<string, string> = {
      antara: 'Antara News',
      cnbc: 'CNBC Indonesia',
      detik: 'Detik.com',
      yonhap: 'Yonhap News'
    };
    return sourceNames[username] || username;
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col h-full overflow-y-auto bg-[var(--editor-background)] text-[var(--editor-foreground)] selection:bg-[var(--focus-border)]/30"
    >
      {/* Reading Progress Bar (Pinned at top of content area) */}
      <div className="sticky top-0 left-0 w-full h-[3px] bg-transparent z-50">
        <div 
          className="h-full bg-[var(--text-accent)] transition-all duration-75 ease-out shadow-[0_0_8px_var(--text-accent)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation Header bar */}
      <div className="sticky top-[3px] left-0 w-full flex items-center justify-between gap-3 px-4 py-2 border-b border-[var(--border-color)] bg-[var(--editor-background)]/85 backdrop-blur-md z-40">
        <button
          onClick={onCloseTab}
          className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--editor-foreground)] transition-colors py-0.5 px-2 rounded hover:bg-[var(--sidebar-item-hover-background)]"
          title="Back to Articles list"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <span className="text-xs text-[var(--text-muted)] truncate max-w-md font-mono select-none hidden md:inline">
          crawled_feeds / {authorUsername} / {article?.slug || 'article'}.md
        </span>
      </div>

      {/* Cover Image (with error handling for hotlinked news images) */}
      {rawImageUrl && !coverImageFailed && (
        <div className="w-full h-48 md:h-64 overflow-hidden relative border-b border-[var(--border-color)] bg-[var(--editor-tab-inactive-background)]">
          <img
            src={rawImageUrl}
            alt={`Cover image for ${title}`}
            className="w-full h-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
            onError={() => setCoverImageFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--editor-background)] via-[var(--editor-background)]/70 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-[10px] font-mono text-[var(--text-muted)]/70 tracking-wider select-none pointer-events-none">
            FEATURED IMAGE
          </div>
        </div>
      )}

      {/* Nice fallback when cover image is missing or fails to load (common with hotlinked news images) */}
      {(!rawImageUrl || coverImageFailed) && (
        <div className="w-full h-32 md:h-40 border-b border-[var(--border-color)] bg-[var(--editor-tab-inactive-background)] flex items-center justify-center relative">
          <div className="text-center px-6">
            <div className="text-[10px] font-mono uppercase tracking-[2px] text-[var(--text-accent)]/60 mb-1">FEATURED IMAGE</div>
            <div className="text-sm text-[var(--text-muted)] max-w-md line-clamp-2">
              {article?.category ? article.category.toUpperCase() : 'NEWS'} — {title.length > 80 ? title.substring(0, 77) + '...' : title}
            </div>
          </div>
          <div className="absolute bottom-2 right-3 text-[9px] font-mono text-[var(--text-muted)]/40">image unavailable</div>
        </div>
      )}

      {/* Content wrapper */}
      <div className="w-full max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8">
        
        {/* Category badge */}
        {article?.category && (
          <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--text-accent)] px-2 py-0.5 rounded bg-[var(--text-accent)]/10 border border-[var(--text-accent)]/20 mb-3">
            {article.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-default)] leading-tight mb-4 tracking-tight">
          {title}
        </h1>

        {/* Metadata info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--text-muted)] border-b border-[var(--border-color)]/40 pb-4 mb-4">
          <div className="flex items-center gap-1.5">
            <User size={13} className="text-[var(--text-accent)]" />
            <span className="font-semibold text-[var(--editor-foreground)]">{authorName}</span>
            <span className="opacity-65">({getSourceName(authorUsername)})</span>
          </div>
          <span className="hidden sm:inline opacity-30">&bull;</span>
          <div className="flex items-center gap-1">
            <span>{publishDate}</span>
          </div>
          <span className="hidden sm:inline opacity-30">&bull;</span>
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>{readingTime > 0 ? `${readingTime} min read` : 'Quick read'}</span>
          </div>
        </div>

        {/* Social Share bar */}
        <div className="flex items-center gap-2 mb-6 py-2 border-y border-[var(--border-color)]/20">
          <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1">share_article:</span>
          
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--editor-foreground)] transition-colors py-0.5 px-2 rounded border border-[var(--border-color)] bg-[var(--editor-tab-inactive-background)] hover:bg-[var(--sidebar-item-hover-background)]"
            title="Copy URL"
          >
            <Link2 size={12} />
            <span>copy_link()</span>
          </button>

          {article?.url && (
            <>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(article.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] hover:text-[#1DA1F2] transition-colors py-0.5 px-2 rounded border border-[var(--border-color)] bg-[var(--editor-tab-inactive-background)] hover:bg-[var(--sidebar-item-hover-background)] no-underline"
                title="Share on X"
              >
                <Twitter size={12} />
                <span>tweet()</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] hover:text-[#0A66C2] transition-colors py-0.5 px-2 rounded border border-[var(--border-color)] bg-[var(--editor-tab-inactive-background)] hover:bg-[var(--sidebar-item-hover-background)] no-underline"
                title="Share on LinkedIn"
              >
                <Linkedin size={12} />
                <span>linkedin()</span>
              </a>
            </>
          )}
        </div>

        {/* Article Summary / Description Box */}
        {description && (
          <div className="relative mb-6 p-4 rounded-lg bg-[var(--editor-tab-inactive-background)]/40 border border-[var(--border-color)]/50 border-l-4 border-l-[var(--text-accent)] backdrop-blur-sm shadow-sm">
            <span className="absolute -top-2.5 left-3 text-[9px] font-mono text-[var(--text-accent)] px-1.5 py-0.5 bg-[var(--editor-background)] border border-[var(--border-color)]/30 rounded">
              Summary
            </span>
            <p className="text-xs md:text-sm text-[var(--editor-foreground)] italic leading-relaxed pt-1.5 opacity-90 select-none">
              &ldquo;{description}&rdquo;
            </p>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="text-[10px] px-2 py-0.5 rounded bg-[var(--editor-tab-inactive-background)] text-[var(--text-muted)] border border-[var(--border-color)] font-mono hover:border-[var(--text-accent)]/40 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Main Article Body (Markdown Content) */}
        <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-[var(--editor-foreground)] mt-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[var(--link-foreground)] hover:underline font-medium">
                  {props.children} <ExternalLink size={11} className="ml-1 opacity-80" />
                </a>
              ),
              h1: ({ node, ...props }) => (
                <h2 {...props} className="text-lg md:text-xl font-bold mt-8 mb-4 text-[var(--text-accent)] border-b border-[var(--border-color)]/30 pb-2 font-mono">
                  {props.children}
                </h2>
              ),
              h2: ({ node, ...props }) => (
                <h3 {...props} className="text-base md:text-lg font-semibold mt-6 mb-3 text-[var(--editor-foreground)] border-l-2 border-[var(--text-accent)] pl-2">
                  {props.children}
                </h3>
              ),
              h3: ({ node, ...props }) => (
                <h4 {...props} className="text-sm md:text-base font-semibold mt-4 mb-2 text-[var(--editor-foreground)]">
                  {props.children}
                </h4>
              ),
              p: ({ node, ...props }) => {
                // Check if paragraph is actually a copyright notice or similar, style accordingly
                const contentStr = React.Children.toArray(props.children).join('');
                const isCopyright = contentStr.toLowerCase().includes('copyright') || contentStr.toLowerCase().includes('dilarang keras mengambil konten');
                return (
                  <p {...props} className={`text-[12px] md:text-[13px] leading-relaxed mb-4 text-[var(--editor-foreground)] ${isCopyright ? 'opacity-50 text-[11px] border-t border-[var(--border-color)]/20 pt-4 mt-6 font-mono' : 'opacity-90'}`}>
                    {props.children}
                  </p>
                );
              },
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="border-l-4 border-[var(--focus-border)] pl-4 py-1 my-5 italic bg-[var(--editor-tab-inactive-background)]/20 rounded-r text-[var(--text-muted)] text-[12px] md:text-[13px]">
                  {props.children}
                </blockquote>
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc list-inside mb-4 pl-4 space-y-1.5 text-[12px] md:text-[13px] text-[var(--editor-foreground)] opacity-90">
                  {props.children}
                </ul>
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal list-inside mb-4 pl-4 space-y-1.5 text-[12px] md:text-[13px] text-[var(--editor-foreground)] opacity-90">
                  {props.children}
                </ol>
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="mb-0.5 inline-block w-full">
                  <span className="text-[var(--text-accent)] mr-1">&bull;</span>
                  {props.children}
                </li>
              ),
              code: ({ node, inline, className, children, ...props }: any) => {
                return inline ? (
                  <code {...props} className="px-1.5 py-0.5 rounded bg-[var(--editor-tab-inactive-background)] border border-[var(--border-color)]/50 font-mono text-[11px] text-[var(--text-accent)]">
                    {children}
                  </code>
                ) : (
                  <pre className="p-3.5 my-4 rounded bg-[var(--editor-tab-inactive-background)] border border-[var(--border-color)]/40 overflow-x-auto font-mono text-[11px] text-[var(--editor-foreground)]">
                    <code {...props}>{children}</code>
                  </pre>
                );
              },
              img: ({ node, ...props }) => (
                <span className="block my-5">
                  <img
                    {...props}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="max-w-full h-auto rounded-md border border-[var(--border-color)]/60 shadow-sm mx-auto"
                    style={{ maxHeight: '520px', objectFit: 'contain' }}
                  />
                  {props.alt && (
                    <span className="block text-center text-[10px] text-[var(--text-muted)] mt-1.5 font-mono opacity-70">
                      {props.alt}
                    </span>
                  )}
                </span>
              )
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </article>

        {/* Related Articles Component */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
            <h3 className="text-sm md:text-base font-bold text-[var(--text-accent)] mb-4 flex items-center gap-1.5 font-mono select-none">
              <Sparkles size={14} className="text-[var(--text-accent)] animate-pulse" />
              <span>related_articles.json</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map(related => {
                const relThumb = related.cover_image || related.social_image || null;
                return (
                  <button
                    key={related.id}
                    onClick={() => onOpenArticle?.(related)}
                    className="text-left p-3.5 rounded-lg border border-[var(--border-color)] bg-[var(--editor-tab-inactive-background)]/50 hover:bg-[var(--sidebar-item-hover-background)]/85 hover:border-[var(--focus-border)] transition-all flex flex-col justify-between h-full group"
                  >
                    {/* Small thumbnail for related article */}
                    {relThumb && (
                      <div className="w-full h-20 mb-2.5 rounded overflow-hidden border border-[var(--border-color)]/50 bg-[var(--editor-background)]">
                        <img
                          src={relThumb}
                          alt=""
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                        />
                      </div>
                    )}

                    <div className="w-full">
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-mono">
                          {related.user.username}
                        </span>
                        {related.category && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--border-color)] text-[var(--text-muted)] lowercase font-mono">
                            {related.category}
                          </span>
                        )}
                      </div>
                      <h4 className="text-[12px] font-bold text-[var(--editor-foreground)] line-clamp-2 mb-2 group-hover:text-[var(--text-accent)] transition-colors leading-snug">
                        {related.title}
                      </h4>
                    </div>

                    <div className="text-[9px] text-[var(--text-muted)] mt-auto pt-2 border-t border-[var(--border-color)]/30 w-full flex items-center justify-between font-mono">
                      <span>{related.readable_publish_date}</span>
                      <span>{related.reading_time_minutes}m read</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ArticleDetailView;
