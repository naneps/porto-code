
import React, { useState, useEffect } from 'react';
import { ArticleItem } from '../../types'; // Adjusted path
import { ICONS } from '../../constants'; // Adjusted path

interface ArticlesPanelProps {
  isVisible: boolean;
  articles: ArticleItem[];
  onClose: () => void;
  onSelectArticle: (article: ArticleItem) => void;
  activeArticleSlug: string | null; // New prop
}

const ArticlesPanel: React.FC<ArticlesPanelProps> = ({
  isVisible,
  articles,
  onClose,
  onSelectArticle,
  activeArticleSlug, // Destructure new prop
}) => {
  const [filterTerm, setFilterTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<ArticleItem[]>(articles);

  const CloseIcon = ICONS.x_icon || ICONS.default;
  const SearchIcon = ICONS.search_icon || ICONS.default;

  useEffect(() => {
    if (!filterTerm.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const lowercasedFilter = filterTerm.toLowerCase();
    const results = articles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(lowercasedFilter);
      const summaryMatch = article.summary.toLowerCase().includes(lowercasedFilter);
      const tagsMatch = article.tags?.some(tag => tag.toLowerCase().includes(lowercasedFilter));
      return titleMatch || summaryMatch || tagsMatch;
    });
    setFilteredArticles(results);
  }, [filterTerm, articles]);

  useEffect(() => {
    if (isVisible) {
        setFilterTerm(''); 
    }
    setFilteredArticles(articles); 
  }, [isVisible, articles]);


  return (
    <aside
      className={`
        bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)]
        text-[var(--sidebar-foreground)] flex flex-col h-full w-full flex-shrink-0
        overflow-hidden min-w-0
      `}
      style={{ padding: isVisible ? '0.25rem 0.5rem' : '0' }}
      aria-label="Articles Panel"
      aria-hidden={!isVisible}
    >
      <div
        className={`
          w-full h-full flex flex-col
          transition-opacity duration-200 ease-in-out
          ${isVisible ? 'opacity-100 delay-100' : 'opacity-0'}
        `}
      >
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <h2 className="text-xs text-[var(--sidebar-section-header-foreground)] uppercase tracking-wider whitespace-nowrap">
            ARTICLES
          </h2>
          {CloseIcon && (
            <button
              onClick={onClose}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--titlebar-button-hover-background)] rounded"
              title="Close Articles Panel"
              aria-label="Close Articles Panel"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        <div className="relative mb-2"> {/* Filter input area */}
          {SearchIcon && (
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <SearchIcon size={14} className="text-[var(--text-muted)]" />
            </div>
          )}
          <input
            type="text"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            placeholder="Filter articles..."
            className="w-full bg-[var(--editor-background)] text-[var(--sidebar-foreground)] placeholder-[var(--text-muted)] border border-[var(--border-color)] focus:border-[var(--focus-border)] focus:outline-none rounded-md py-1 pr-2 text-xs"
            style={{ paddingLeft: SearchIcon ? '1.75rem' : '0.5rem' }}
            aria-label="Filter articles input"
          />
        </div>


        <div className="flex-1 overflow-y-auto overflow-x-hidden mt-1 space-y-1.5">
          {filteredArticles.length === 0 && isVisible && (
            <p className="text-sm text-[var(--text-muted)] px-1 py-2 text-center">
              {filterTerm ? "No articles match your filter." : "No articles available yet."}
            </p>
          )}
          {filteredArticles.map((article) => {
            const isActive = article.slug === activeArticleSlug;
            return (
              <button
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className={`
                  w-full text-left p-2 rounded transition-colors
                  ${isActive
                    ? 'bg-[var(--sidebar-item-focus-background)] text-[var(--sidebar-item-focus-foreground)] border border-[var(--focus-border)]'
                    : 'hover:bg-[var(--sidebar-item-hover-background)] focus:bg-[var(--sidebar-item-focus-background)] border border-transparent focus:border-[var(--focus-border)]'
                  }
                  focus:outline-none
                `}
                title={`Read article: ${article.title}`}
              >
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={`Cover for ${article.title}`}
                    className="w-full h-24 object-cover rounded-sm mb-2"
                  />
                )}
                <h3
                  className="text-sm font-semibold mb-0.5 truncate text-[var(--text-accent)]"
                >
                  {article.title}
                </h3>
                <p className={`text-xs mb-1 ${isActive ? 'text-[var(--sidebar-item-focus-foreground)] opacity-80' : 'text-[var(--text-muted)]'}`}>
                  {new Date(article.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className={`text-xs leading-snug line-clamp-3 ${isActive ? 'text-[var(--sidebar-item-focus-foreground)] opacity-90' : 'text-[var(--sidebar-foreground)]'}`}>
                  {article.summary}
                </p>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {article.tags.map(tag => (
                      <span
                        key={tag}
                        className={`text-xs px-1.5 py-0.5 rounded-sm flex items-center
                          ${isActive
                            ? 'bg-[var(--tag-active-background)] text-[var(--tag-active-text)]'
                            : 'bg-[var(--editor-tab-inactive-background)] text-[var(--text-muted)]'
                          }
                        `}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default ArticlesPanel;
