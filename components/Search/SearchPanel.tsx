
import React, { useEffect, useRef } from 'react';
import { SearchResultItem } from '../../types'; // Adjusted path
import { ICONS } from '../../constants'; // Adjusted path

interface SearchPanelProps {
  isVisible: boolean;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  results: SearchResultItem[];
  onResultClick: (result: SearchResultItem) => void;
  onClose: () => void; 
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  isVisible,
  searchTerm,
  onSearchTermChange,
  results,
  onResultClick,
  onClose
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const SearchIcon = ICONS.search_icon || ICONS.default;
  const CloseIcon = ICONS.x_icon || ICONS.default;

  useEffect(() => {
    if (isVisible) {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  return (
    <aside
      className={`
        bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)] 
        text-[var(--sidebar-foreground)] flex flex-col h-full w-full flex-shrink-0
        overflow-hidden min-w-0
      `}
      style={{ padding: isVisible ? '0.25rem 0.5rem' : '0' }}
      aria-label="Search Panel"
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
            SEARCH
            </h2>
            {CloseIcon && (
                 <button
                    onClick={onClose}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--titlebar-button-hover-background)] rounded"
                    title="Close Search Panel"
                    aria-label="Close Search Panel"
                >
                    <CloseIcon size={16} />
                </button>
            )}
        </div>
        <div className="relative mb-1"> {/* Search input area, reduced bottom margin */}
          {SearchIcon && (
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <SearchIcon size={16} className="text-[var(--text-muted)]" />
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search"
            className="w-full bg-[var(--editor-background)] text-[var(--sidebar-foreground)] placeholder-[var(--text-muted)] border border-[var(--border-color)] focus:border-[var(--focus-border)] focus:outline-none rounded-md py-1.5 pr-2 text-sm"
            style={{ paddingLeft: SearchIcon ? '2rem' : '0.5rem' }}
          />
        </div>

        {searchTerm && (
          <div className="px-1 py-0.5 text-xs text-[var(--text-muted)]"> {/* Reduced padding */}
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden mt-1"> 
          {searchTerm && results.length === 0 && isVisible && (
            <p className="text-sm text-[var(--text-muted)] px-1 py-2">No results found.</p>
          )}
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => onResultClick(result)}
              className="w-full text-left p-1.5 mb-1 rounded hover:bg-[var(--sidebar-item-hover-background)] focus:bg-[var(--sidebar-item-focus-background)] focus:outline-none transition-colors"
              title={`Open ${result.fileDisplayPath} at line ${result.lineNumber}`}
            >
              <div className="text-xs text-[var(--text-accent)] truncate">{result.fileDisplayPath}</div>
              <div
                className="text-sm text-[var(--sidebar-foreground)] whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: `${result.lineNumber}: ${result.lineContent}` }}
              />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SearchPanel;
