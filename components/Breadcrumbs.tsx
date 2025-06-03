
import React from 'react';
import { Tab, PortfolioData, SidebarItemConfig } from '../types'; // Added SidebarItemConfig
import { ICONS } from '../constants';


interface BreadcrumbsProps {
  activeTab: Tab | undefined | null;
  portfolioData: PortfolioData;
  onOpenTab: (itemOrConfig: SidebarItemConfig | { id?: string, fileName: string, type?: Tab['type'], title?: string }) => void; 
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
    // Fallback for titles that might not have an index, e.g., if ID format changes
    const genericMatch = projectId.match(/project_\d+_(.+)\.json/);
    if (genericMatch && genericMatch[1]) {
        return genericMatch[1].replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    // Last resort if no pattern matches, use the tab title if available, or a default
    return activeTab?.title || 'Project Detail';
  };
  
  const RootIcon = ICONS['projects.json']; 
  const SeparatorIcon = ICONS.chevron_right_icon;
  const ProjectsJSONIcon = ICONS['projects.json']; // Icon for the 'projects.json' link

  // Determine the icon for the final segment of the breadcrumb
  let FinalSegmentIcon: React.ElementType | undefined = ICONS.default;
  if (activeTab.type === 'file' && activeTab.fileName && ICONS[activeTab.fileName]) {
    FinalSegmentIcon = ICONS[activeTab.fileName];
  } else if (activeTab.type === 'project_detail') {
    FinalSegmentIcon = ICONS['project_detail'] || ICONS.default;
  } else if (activeTab.type === 'ai_chat') {
    FinalSegmentIcon = ICONS.ai_chat_icon || ICONS.default;
  } else if (activeTab.type === 'article_detail') {
    FinalSegmentIcon = ICONS.article_detail || ICONS.default;
  } else if (activeTab.type === 'json_preview' && activeTab.fileName && ICONS[activeTab.fileName]) {
    FinalSegmentIcon = ICONS[activeTab.fileName];
  }


  return (
    <div className="flex items-center px-3 py-1.5 text-xs text-[var(--breadcrumbs-foreground)] bg-[var(--breadcrumbs-background)] border-t border-[var(--border-color)] shadow-sm">
      {RootIcon && (
        <button 
          onClick={() => { /* Optional: Define action for clicking root, e.g., open sidebar or specific file */}} 
          className="flex items-center hover:text-[var(--breadcrumbs-focus-foreground)] transition-colors duration-150"
          title="Portfolio Root"
        >
          <RootIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)]" />
          <span className="font-medium">PORTFOLIO</span>
        </button>
      )}
      
      {SeparatorIcon && <SeparatorIcon size={16} className="mx-1 text-[var(--breadcrumbs-separator-color)]" />}

      {/* Path based on activeTab type */}
      {activeTab.type === 'project_detail' && (
        <>
          {ProjectsJSONIcon && (
            <button 
              onClick={() => onOpenTab({ fileName: 'projects.json', type: 'file', title: 'projects.json' })}
              className="flex items-center hover:text-[var(--breadcrumbs-focus-foreground)] transition-colors duration-150"
              title="Open projects.json"
            >
              <ProjectsJSONIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)] opacity-75" />
              <span>projects.json</span>
            </button>
          )}
          {SeparatorIcon && <SeparatorIcon size={16} className="mx-1 text-[var(--breadcrumbs-separator-color)]" />}
          <div className="flex items-center text-[var(--breadcrumbs-focus-foreground)]">
            {FinalSegmentIcon && <FinalSegmentIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)]" />}
            <span>{getProjectTitleFromId(activeTab.id)}</span>
          </div>
        </>
      )}
      
      {activeTab.type === 'article_detail' && (
        <>
           {/* Placeholder for "Articles" link - ideally links to ArticlesPanel */}
           {ICONS.articles_icon && (
            <button 
              onClick={() => { /* TODO: Action to show/focus ArticlesPanel */ }}
              className="flex items-center hover:text-[var(--breadcrumbs-focus-foreground)] transition-colors duration-150"
              title="Go to Articles"
            >
              <ICONS.articles_icon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)] opacity-75" />
              <span>Articles</span>
            </button>
          )}
          {SeparatorIcon && <SeparatorIcon size={16} className="mx-1 text-[var(--breadcrumbs-separator-color)]" />}
          <div className="flex items-center text-[var(--breadcrumbs-focus-foreground)]">
            {FinalSegmentIcon && <FinalSegmentIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)]" />}
            <span className="truncate max-w-xs">{activeTab.title}</span>
          </div>
        </>
      )}

      {(activeTab.type === 'file' || activeTab.type === 'json_preview') && (
         <div className="flex items-center text-[var(--breadcrumbs-focus-foreground)]">
            {FinalSegmentIcon && <FinalSegmentIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)]" />}
            <span>{activeTab.title}</span>
        </div>
      )}

      {activeTab.type === 'ai_chat' && (
        <div className="flex items-center text-[var(--breadcrumbs-focus-foreground)]">
            {FinalSegmentIcon && <FinalSegmentIcon size={14} className="mr-1.5 text-[var(--breadcrumbs-icon-foreground)]" />}
            <span>{activeTab.title}</span>
        </div>
      )}
    </div>
  );
};

export default Breadcrumbs;