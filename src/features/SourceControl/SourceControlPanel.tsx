import React from 'react';
import { GitBranch, GitCommit, RefreshCw } from 'lucide-react';
import { ICONS, ALL_FEATURE_IDS } from '../../App/constants';
import MaintenanceView from '../../UI/MaintenanceView';
import { FeatureStatus } from '../../App/types';

interface SourceControlPanelProps {
  isVisible: boolean;
  onClose: () => void;
  featureStatus: FeatureStatus;
  // We can later pass real GitHub data here
}

const SourceControlPanel: React.FC<SourceControlPanelProps> = ({
  isVisible,
  onClose,
  featureStatus,
}) => {
  const CloseIcon = ICONS.x_icon || ICONS.default;

  if (featureStatus !== 'active') {
    return <MaintenanceView featureName={ALL_FEATURE_IDS.sourceControl} featureIcon={ICONS.source_control_icon} />;
  }

  // Mock data for now (we can connect real GitHub commits later)
  const currentBranch = 'main';
  const commits = [
    { hash: 'a4f2c9e', message: 'feat: add interactive achievements system', author: 'Nandang', time: '2 hours ago' },
    { hash: '7b3d1a2', message: 'fix: improve article detail image loading', author: 'Nandang', time: 'yesterday' },
    { hash: 'e9c4f71', message: 'chore: update feature flags + add new icons', author: 'Nandang', time: '2 days ago' },
    { hash: 'c2a8b44', message: 'feat: source control panel (initial)', author: 'Nandang', time: '3 days ago' },
  ];

  return (
    <aside
      className="bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)] text-[var(--sidebar-foreground)] flex flex-col h-full w-full flex-shrink-0 overflow-hidden"
      style={{ padding: isVisible ? '0.25rem 0.5rem' : '0' }}
    >
      <div className="flex items-center justify-between px-2 py-1 mb-2">
        <div className="flex items-center gap-2">
          <GitBranch size={14} className="text-[var(--text-accent)]" />
          <h2 className="text-[10px] text-[var(--sidebar-section-header-foreground)] uppercase tracking-wider font-bold">
            SOURCE CONTROL
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {}}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--titlebar-button-hover-background)] rounded-md"
            title="Refresh"
          >
            <RefreshCw size={13} />
          </button>
          {CloseIcon && (
            <button
              onClick={onClose}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--titlebar-button-hover-background)] rounded-md"
              title="Close Source Control"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Current Branch */}
      <div className="px-2 mb-3">
        <div className="flex items-center gap-2 text-xs bg-[var(--editor-tab-inactive-background)] border border-[var(--border-color)] rounded px-2 py-1">
          <GitBranch size={14} className="text-[var(--text-accent)]" />
          <span className="font-mono font-semibold">{currentBranch}</span>
          <span className="ml-auto text-[10px] text-[var(--text-muted)]">↑3</span>
        </div>
      </div>

      {/* Changes */}
      <div className="px-2 mb-2">
        <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 font-bold">CHANGES</div>
        <div className="text-xs text-[var(--text-muted)] italic">No local changes (demo)</div>
      </div>

      {/* Commits */}
      <div className="flex-1 overflow-y-auto px-1">
        <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 px-1 font-bold flex items-center gap-1.5">
          <GitCommit size={12} /> RECENT COMMITS
        </div>

        <div className="space-y-1">
          {commits.map((commit, index) => (
            <div
              key={index}
              className="p-2 rounded hover:bg-[var(--sidebar-item-hover-background)] border border-transparent hover:border-[var(--border-color)] text-xs group"
            >
              <div className="font-mono text-[10px] text-[var(--text-accent)]">{commit.hash}</div>
              <div className="text-[var(--editor-foreground)] leading-tight line-clamp-2 mt-0.5">
                {commit.message}
              </div>
              <div className="flex justify-between text-[9px] text-[var(--text-muted)] mt-1.5">
                <span>{commit.author}</span>
                <span>{commit.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 text-[9px] text-[var(--text-muted)] border-t border-[var(--border-color)]/40 mt-2">
        Real GitHub integration coming soon
      </div>
    </aside>
  );
};

export default SourceControlPanel;
