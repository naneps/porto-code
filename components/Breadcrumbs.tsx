
import React from 'react';
import { Tab, PortfolioData } from '../types';
import { ICONS } from '../constants';


interface BreadcrumbsProps {
  activeTab: Tab | undefined | null;
  portfolioData: PortfolioData;
  onOpenTab: (fileName: string) => void; 
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeTab, portfolioData, onOpenTab }) => {
  if (!activeTab) {
    return <div className="h-8 bg-[var(--breadcrumbs-background)] border-t border-[var(--border-color)]"></div>;
  }

  const getProjectTitleFromId = (projectId: string): string => {
    const projectIndexMatch = projectId.match(/project_(\d+)_/);
    if (projectIndexMatch && projectIndexMatch[1]) {
      const projectIndex = parseInt(projectIndexMatch[1], 10);
      if (projectIndex >= 0 && projectIndex < portfolioData.projects.length) {
        return portfolioData.projects[projectIndex];
      }
    }
    const genericMatch = projectId.match(/project_\d+_(.+)\.json/);
    return genericMatch ? genericMatch[1].replace(/_/g, ' ') : 'Project Detail';
  };
  
  let ActiveTabIcon = ICONS.default; 
  if (activeTab.type === 'project_detail') {
    ActiveTabIcon = ICONS['project_detail'] || ICONS.default;
  } else if (ICONS[activeTab.id]) {
    ActiveTabIcon = ICONS[activeTab.id];
  }
  const ProjectsIcon = ICONS['projects.json'];
  const RootIcon = ICONS['projects.json']; // Using FolderKanban for root, same as projects.json icon
  const SeparatorIcon = ICONS.chevron_right_icon;


  return (
    <div className="flex items-center px-3 py-1.5 text-xs text-[var(--breadcrumbs-foreground)] bg-[var(--breadcrumbs-background)] border-t border-[var(--border-color)] shadow-sm">
      {RootIcon && (
        <button 
          onClick={() => { /* Potentially open root or specific explorer view */}} 
          className="flex items-center hover:text-[var(--breadcrumbs-focus-foreground)] transition-colors duration-150"
          title="Portfolio Root"
        >
          <RootIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)]" />
          <span className="font-medium">PORTFOLIO</span>
        </button>
      )}
      {SeparatorIcon && <SeparatorIcon size={16} className="mx-1 text-[var(--breadcrumbs-separator-color)]" />}

      {activeTab.type === 'project_detail' && ProjectsIcon && (
        <>
          <button 
            onClick={() => onOpenTab('projects.json')}
            className="flex items-center hover:text-[var(--breadcrumbs-focus-foreground)] transition-colors duration-150"
            title="Open projects.json"
          >
            <ProjectsIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)] opacity-75" />
            <span>projects.json</span>
          </button>
          {SeparatorIcon && <SeparatorIcon size={16} className="mx-1 text-[var(--breadcrumbs-separator-color)]" />}
          <div className="flex items-center text-[var(--breadcrumbs-focus-foreground)]">
            <ActiveTabIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)]" />
            <span>{getProjectTitleFromId(activeTab.id)}</span>
          </div>
        </>
      )}

      {activeTab.type === 'file' && (
         <button 
            onClick={() => onOpenTab(activeTab.id)}
            className="flex items-center text-[var(--breadcrumbs-focus-foreground)] hover:opacity-80 transition-opacity duration-150"
            title={`Open ${activeTab.title}`}
        >
            <ActiveTabIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)]" />
            <span>{activeTab.title}</span>
        </button>
      )}
    </div>
  );
};

export default Breadcrumbs;