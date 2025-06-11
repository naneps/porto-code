
import React, { useEffect, useRef } from 'react';
import { SearchResultItem, FeatureStatus } from '../../App/types'; 
import { ICONS, ALL_FEATURE_IDS } from '../../App/constants'; 
import MaintenanceView from '../../UI/MaintenanceView';

interface SearchPanelProps {
  isVisible: boolean;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  results: SearchResultItem[];
  onResultClick: (result: SearchResultItem) => void;
  onClose: () => void; 
  featureStatus: FeatureStatus;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  isVisible,
  searchTerm,
  onSearchTermChange,
  results,
  onResultClick,
  onClose,
  featureStatus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const SearchIcon = ICONS.search_icon || ICONS.Search; // Fallback to Lucide Search if search_icon is not in ICONS
  const CloseIcon = ICONS.x_icon || ICONS.default; // Fallback for CloseIcon

  useEffect(() => {
    if (isVisible && featureStatus === 'active' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible, featureStatus]);

  if (featureStatus !== 'active') {
    return <MaintenanceView featureName={ALL_FEATURE_IDS.searchPanel} featureIcon={SearchIcon} />;
  }

  const highlightMatch = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-[var(--text-accent)] bg-opacity-30 text-[var(--text-default)] font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

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

        <div className="relative mb-2">
          {SearchIcon && (
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <SearchIcon size={14} className="text-[var(--text-muted)]" />
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-[var(--editor-background)] text-[var(--sidebar-foreground)] placeholder-[var(--text-muted)] border border-[var(--border-color)] focus:border-[var(--focus-border)] focus:outline-none rounded-md py-1 pr-2 text-xs"
            style={{ paddingLeft: SearchIcon ? '1.75rem' : '0.5rem' }}
            aria-label="Search input"
          />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden mt-1 space-y-0.5 pr-0.5">
          {results.length === 0 && searchTerm && (
            <p className="text-sm text-[var(--text-muted)] px-1 py-4 text-center">
              No results found for "{searchTerm}".
            </p>
          )}
          {results.length === 0 && !searchTerm && (
            <p className="text-sm text-[var(--text-muted)] px-1 py-4 text-center">
              Type to start searching.
            </p>
          )}
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => onResultClick(result)}
              className="w-full text-left p-1.5 rounded-md hover:bg-[var(--sidebar-item-hover-background)] focus:outline-none focus:bg-[var(--sidebar-item-hover-background)] transition-colors duration-150 ease-in-out"
              title={`Open ${result.fileDisplayPath} at line ${result.lineNumber}`}
            >
              <div className="text-xs font-medium text-[var(--link-foreground)] truncate">
                {result.fileDisplayPath}
                <span className="text-[var(--text-muted)]">:{result.lineNumber}</span>
              </div>
              <div className="text-[0.7rem] text-[var(--text-muted)] truncate">
                {highlightMatch(result.lineContent.trim(), searchTerm)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SearchPanel;
