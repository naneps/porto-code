
import React from 'react';
import { MockStatistics } from '../types';
import { ICONS } from '../constants';
import { Users, Eye, Clock, FileText, ListVideo } from 'lucide-react';

interface StatisticsPanelProps {
  isVisible: boolean;
  stats: MockStatistics;
  onClose: () => void;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ isVisible, stats, onClose }) => {
  const CloseIcon = ICONS.x_icon || Users; // Fallback for CloseIcon

  const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ElementType; unit?: string }> = ({ title, value, icon: Icon, unit }) => (
    <div className="bg-[var(--editor-background)] p-3 rounded-md shadow border border-[var(--border-color)]">
      <div className="flex items-center text-xs text-[var(--text-muted)] mb-1">
        {Icon && <Icon size={14} className="mr-1.5 text-[var(--text-accent)]" />}
        <span>{title}</span>
      </div>
      <div className="text-xl font-semibold text-[var(--editor-foreground)]">
        {value}
        {unit && <span className="text-xs ml-1">{unit}</span>}
      </div>
    </div>
  );

  return (
    <aside
      className={`
        bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)]
        text-[var(--sidebar-foreground)] flex flex-col h-full w-full flex-shrink-0
        overflow-hidden min-w-0
      `}
      style={{ padding: isVisible ? '0.25rem 0.5rem' : '0' }}
      aria-label="Statistics Panel"
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
            Website Statistics
          </h2>
          {CloseIcon && (
            <button
              onClick={onClose}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--titlebar-button-hover-background)] rounded"
              title="Close Statistics Panel"
              aria-label="Close Statistics Panel"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-0.5"> {/* Adjusted pr for scrollbar */}
          <StatCard title="Live Visitors" value={stats.liveVisitors} icon={Eye} unit="users" />
          <StatCard title="Today's Total Visits" value={stats.todayVisits} icon={Users} unit="visits" />
          <StatCard title="Session Uptime" value={stats.uptime} icon={Clock} />
          
          <div className="bg-[var(--editor-background)] p-3 rounded-md shadow border border-[var(--border-color)]">
            <div className="flex items-center text-xs text-[var(--text-muted)] mb-1">
              <FileText size={14} className="mr-1.5 text-[var(--text-accent)]" />
              <span>Most Visited Page</span>
            </div>
            <div className="text-sm font-medium text-[var(--link-foreground)] truncate" title={stats.mostVisitedPage}>
              {stats.mostVisitedPage}
            </div>
          </div>

          <div className="bg-[var(--editor-background)] p-3 rounded-md shadow border border-[var(--border-color)]">
            <div className="flex items-center text-xs text-[var(--text-muted)] mb-2">
              <ListVideo size={14} className="mr-1.5 text-[var(--text-accent)]" />
              <span>Currently Viewed Pages (Simulated)</span>
            </div>
            <ul className="space-y-1">
              {stats.currentlyViewed.map((page, index) => (
                <li key={index} className="text-xs text-[var(--editor-foreground)] bg-[var(--sidebar-item-hover-background)] px-2 py-1 rounded-sm border border-[var(--border-color)] truncate" title={page}>
                  {page}
                </li>
              ))}
            </ul>
          </div>
           <p className="text-center text-[var(--text-muted)] text-xs mt-4">
            (Simulated data for demonstration)
          </p>
        </div>
      </div>
    </aside>
  );
};

export default StatisticsPanel;
