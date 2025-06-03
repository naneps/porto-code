
import React, { useEffect, useRef } from 'react';
import { SearchResultItem } from '../../types'; // Adjusted path
import { ICONS } from '../../constants'; // Adjusted path

interface SearchPanelProps {
  isVisible: boolean;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  results: SearchResultItem[];
  onResultClick: (result: SearchResultItem) => void;
  onClose: () => void; // To allow closing the panel
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
        ${isVisible ? 'w-64 md:w-72' : 'w-0'}
        bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)] 
        text-[var(--sidebar-foreground)] flex flex-col h-full flex-shrink-0
        overflow-hidden
        transition-all duration-300 ease-in-out 
      `}
      aria-label="Search Panel"
      aria-hidden={!isVisible}
    >
      <div 
        className={`
          w-full h-full flex flex-col
          transition-opacity duration-200 ease-in-out
          ${isVisible ? 'opacity-100 delay-100 p-2' : 'opacity-0 p-0'}
        `}
      >
        <div className="flex items-center justify-between mb-1">
            <h2 className="text-xs text-[var(--sidebar-section-header-foreground)] uppercase tracking-wider px-1 whitespace-nowrap">
            Search
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
        <div className="relative">
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
          <div className="px-1 py-1 text-xs text-[var(--text-muted)]">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </div>
        )}

        <div className="flex-1 overflow-y-auto mt-1">
          {searchTerm && results.length === 0 && !isVisible && ( // Check !isVisible to avoid flash when panel is closing
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