import { AlertTriangle, Loader2, RotateCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ALL_FEATURE_IDS, ICONS } from '../../App/constants';
import { ArticleItem, ArticlesPanelProps } from '../../App/types';
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
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState<ArticleItem[]>(articles);

  const CloseIcon = ICONS.x_icon || ICONS.default;
  const SearchIcon = ICONS.search_icon || ICONS.default;

  // Extract unique sources and categories dynamically
  const uniqueSources = Array.from(new Set(articles.map(a => a.user.username))).filter(Boolean);
  const uniqueCategories = Array.from(new Set(articles.map(a => a.category))).filter(Boolean);

  // Available categories based on selected source to prevent selecting empty combinations
  const availableCategories = selectedSource === 'all'
    ? uniqueCategories
    : Array.from(new Set(articles.filter(a => a.user.username === selectedSource).map(a => a.category))).filter(Boolean);

  const getSourceName = (username: string) => {
    const sourceNames: Record<string, string> = {
      antara: 'Antara News',
      cnbc: 'CNBC Indonesia',
      detik: 'Detik.com',
      yonhap: 'Yonhap News'
    };
    return sourceNames[username] || username;
  };

  const formatCategoryName = (cat: string) => {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Reset selected category if it is no longer available under the selected source
  useEffect(() => {
    if (selectedSource !== 'all' && selectedCategory !== 'all') {
      if (!availableCategories.includes(selectedCategory)) {
        setSelectedCategory('all');
      }
    }
  }, [selectedSource, articles, availableCategories, selectedCategory]);

  // Main filtering logic
  useEffect(() => {
    let results = articles;

    if (selectedSource !== 'all') {
      results = results.filter(article => article.user.username === selectedSource);
    }

    if (selectedCategory !== 'all') {
      results = results.filter(article => article.category === selectedCategory);
    }

    if (filterTerm.trim()) {
      const lowercasedFilter = filterTerm.toLowerCase();
      results = results.filter(article => {
        const titleMatch = article.title.toLowerCase().includes(lowercasedFilter);
        const summaryMatch = article.description.toLowerCase().includes(lowercasedFilter); 
        const tagsMatch = article.tag_list?.some(tag => tag.toLowerCase().includes(lowercasedFilter));
        return titleMatch || summaryMatch || tagsMatch;
      });
    }

    setFilteredArticles(results);
  }, [filterTerm, selectedSource, selectedCategory, articles]);

  // Reset filters when panel becomes visible or articles data updates
  useEffect(() => {
    if (isVisible) {
      setFilterTerm(''); 
      setSelectedSource('all');
      setSelectedCategory('all');
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
        {/* Header with Title & Refresh / Close actions */}
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <h2 className="text-[10px] text-[var(--sidebar-section-header-foreground)] uppercase tracking-wider font-bold whitespace-nowrap">
            ARTICLES (CRAWLED FEEDS)
          </h2>
          <div className="flex items-center gap-1.5">
            {onRetryFetch && (
              <button
                onClick={() => onRetryFetch(true)}
                className={`p-1 text-[var(--text-muted)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--titlebar-button-hover-background)] rounded-md transition-colors duration-150 ${isLoading ? 'text-[var(--text-accent)]' : ''}`}
                title="Refresh Feeds"
                aria-label="Refresh Feeds"
                disabled={isLoading}
              >
                <RotateCw size={13} className={isLoading ? 'animate-spin' : ''} />
              </button>
            )}
            {CloseIcon && (
              <button
                onClick={onClose}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--titlebar-button-hover-background)] rounded-md transition-colors duration-150"
                title="Close Articles Panel"
                aria-label="Close Articles Panel"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-2 px-1"> 
          {SearchIcon && (
            <div className="absolute inset-y-0 left-1 pl-2 flex items-center pointer-events-none">
              <SearchIcon size={12} className="text-[var(--text-muted)]" />
            </div>
          )}
          <input
            type="text"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-[var(--editor-background)] text-[var(--sidebar-foreground)] placeholder-[var(--text-muted)] border border-[var(--border-color)] focus:border-[var(--focus-border)] focus:outline-none rounded-md py-1 pr-2 text-xs"
            style={{ paddingLeft: SearchIcon ? '1.75rem' : '0.5rem' }}
            aria-label="Filter articles input"
            disabled={isLoading || !!error}
          />
        </div>

        {/* Dropdown Filters for Source & Category */}
        <div className="flex gap-1.5 mb-2.5 px-1">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="flex-1 bg-[var(--editor-background)] text-[var(--sidebar-foreground)] border border-[var(--border-color)] rounded-md px-2 py-1 text-[11px] focus:outline-none focus:border-[var(--focus-border)] transition-colors cursor-pointer"
            style={{
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(156,163,175,0.75)\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 6px center',
              backgroundSize: '10px',
              paddingRight: '20px'
            }}
            disabled={isLoading || !!error}
            aria-label="Filter by source"
          >
            <option value="all">All Sources</option>
            {uniqueSources.map(src => (
              <option key={src} value={src}>{getSourceName(src)}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 bg-[var(--editor-background)] text-[var(--sidebar-foreground)] border border-[var(--border-color)] rounded-md px-2 py-1 text-[11px] focus:outline-none focus:border-[var(--focus-border)] transition-colors cursor-pointer"
            style={{
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(156,163,175,0.75)\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 6px center',
              backgroundSize: '10px',
              paddingRight: '20px'
            }}
            disabled={isLoading || !!error}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{formatCategoryName(cat)}</option>
            ))}
          </select>
        </div>

        {/* Scrollable list of articles */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden mt-0.5 space-y-1.5 relative px-1">
          {isLoading && (
            <>
              <div className="linear-progress-bar !top-0 !bottom-auto" aria-label="Loading articles...">
                <div className="linear-progress-bar-indicator"></div>
              </div>
              <div className="flex flex-col items-center justify-center h-full p-4 text-[var(--text-muted)] pt-12">
                <Loader2 size={24} className="animate-spin text-[var(--text-accent)] mb-2" />
                <p className="text-[11px]">Loading crawled articles...</p>
              </div>
            </>
          )}
          {error && !isLoading && (
            <div className="p-3 m-1 rounded-md bg-[var(--notification-error-background)] text-[var(--notification-error-foreground)] border border-[var(--notification-error-border)] text-xs text-center">
              <div className="flex items-center justify-center mb-1">
                 {ICONS.AlertTriangle ? <ICONS.AlertTriangle size={15} className="mr-2 text-[var(--notification-error-icon)]" /> : <AlertTriangle size={15} className="mr-2 text-[var(--notification-error-icon)]" />}
                 <span className="font-semibold">Error Loading Articles</span>
              </div>
              <p className="mb-2 text-[11px]">{error}</p>
              {onRetryFetch && (
                <button 
                  onClick={() => onRetryFetch(true)}
                  className="px-3 py-1 bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] rounded-md hover:bg-[var(--modal-button-hover-background)] text-xs font-semibold"
                >
                  Retry
                </button>
              )}
            </div>
          )}
          {!isLoading && !error && filteredArticles.length === 0 && isVisible && (
            <p className="text-xs text-[var(--text-muted)] px-1 py-8 text-center">
              {filterTerm || selectedSource !== 'all' || selectedCategory !== 'all'
                ? "No articles match the selected filters."
                : "No crawled articles found."}
            </p>
          )}
          {!isLoading && !error && filteredArticles.map((article) => {
            const isActive = article.slug === activeArticleSlug;
            return (
              <button
                key={article.id} 
                onClick={() => onSelectArticle(article)}
                className={`w-full text-left p-2.5 rounded-md transition-colors duration-150 ease-in-out border border-transparent
                            focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--focus-border)]
                            ${isActive 
                              ? 'bg-[var(--sidebar-item-focus-background)] text-[var(--sidebar-item-focus-foreground)] border-[var(--border-color)]' 
                              : 'hover:bg-[var(--sidebar-item-hover-background)]'}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-xs font-semibold line-clamp-2 leading-snug text-[var(--editor-foreground)] flex-1">{article.title}</h3>
                  {article.category && (
                    <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-[var(--editor-tab-inactive-background)] text-[var(--text-muted)] border border-[var(--border-color)] font-mono leading-none lowercase">
                      {article.category}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">{article.description}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[var(--border-color)]/30 text-[9px] text-[var(--text-muted)]">
                  <span className="font-semibold">{getSourceName(article.user.username)}</span>
                  <span>{article.readable_publish_date} &bull; {article.reading_time_minutes}m read</span>
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
