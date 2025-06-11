
import React, { useState, useEffect } from 'react';
import { ArticleItem, ArticlesPanelProps, FeatureStatus } from '../../App/types'; 
import { ICONS, ALL_FEATURE_IDS } from '../../App/constants'; 
import { Loader2, AlertTriangle } from 'lucide-react'; 
import MaintenanceView from '../../UI/MaintenanceView';

const ArticlesPanel: React.FC<ArticlesPanelProps> = ({
  isVisible,
  articles,
  isLoading,
  error,
  onClose,
  onSelectArticle,
  activeArticleSlug,
  onRetryFetch,
  featureStatus,
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
      const summaryMatch = article.description.toLowerCase().includes(lowercasedFilter); 
      const tagsMatch = article.tag_list?.some(tag => tag.toLowerCase().includes(lowercasedFilter));
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

  if (featureStatus !== 'active') {
    return <MaintenanceView featureName={ALL_FEATURE_IDS.articlesPanel} featureIcon={ICONS.articles_icon} />;
  }


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
            ARTICLES (FROM DEV.TO)
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

        <div className="relative mb-2"> 
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
            disabled={isLoading || !!error}
          />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden mt-1 space-y-1.5 relative"> {/* Added relative for progress bar */}
          {isLoading && (
            <>
              <div className="linear-progress-bar !top-0 !bottom-auto" aria-label="Loading articles...">
                <div className="linear-progress-bar-indicator"></div>
              </div>
              <div className="flex flex-col items-center justify-center h-full p-4 text-[var(--text-muted)] pt-10"> {/* Added pt-10 for space below progress */}
                <Loader2 size={32} className="animate-spin text-[var(--text-accent)] mb-3" />
                <p>Loading articles from dev.to...</p>
              </div>
            </>
          )}
          {error && !isLoading && (
            <div className="p-3 m-2 rounded-md bg-[var(--notification-error-background)] text-[var(--notification-error-foreground)] border border-[var(--notification-error-border)] text-xs text-center">
              <div className="flex items-center justify-center mb-1">
                 {ICONS.AlertTriangle ? <ICONS.AlertTriangle size={16} className="mr-2 text-[var(--notification-error-icon)]" /> : <AlertTriangle size={16} className="mr-2 text-[var(--notification-error-icon)]" />}
                 <span className="font-semibold">Error Loading Articles</span>
              </div>
              <p className="mb-2">{error}</p>
              {onRetryFetch && (
                <button 
                    onClick={onRetryFetch}
                    className="px-3 py-1 bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] rounded-md hover:bg-[var(--modal-button-hover-background)] text-xs"
                >
                    Retry
                </button>
              )}
            </div>
          )}
          {!isLoading && !error && filteredArticles.length === 0 && isVisible && (
            <p className="text-sm text-[var(--text-muted)] px-1 py-6 text-center">
              {filterTerm ? "No articles match your filter." : "No articles found on dev.to for the configured user."}
            </p>
          )}
          {!isLoading && !error && filteredArticles.map((article) => {
            const isActive = article.slug === activeArticleSlug;
            return (
              <button
                key={article.id} 
                onClick={() => onSelectArticle(article)}
                className={`w-full text-left p-2 rounded-md transition-colors duration-150 ease-in-out 
                            focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--focus-border)]
                            ${isActive ? 'bg-[var(--sidebar-item-focus-background)] text-[var(--sidebar-item-focus-foreground)]' : 'hover:bg-[var(--sidebar-item-hover-background)]'}`}
              >
                <h3 className="text-sm font-semibold truncate text-[var(--editor-foreground)]">{article.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{article.description}</p>
                <div className="flex items-center justify-between mt-1.5 text-[0.7rem] text-[var(--text-muted)]">
                  <span>By {article.user.name}</span>
                  <span>{article.readable_publish_date} &bull; {article.reading_time_minutes} min read</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default ArticlesPanel;
