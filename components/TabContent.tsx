
import React from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { Tab, PortfolioData } from '../types';
import ProjectCard from './ProjectCard';
import AIChatInterface from './AIChatInterface';
import JsonPreviewView from './JsonPreviewView';
import { getSyntaxHighlighterTheme } from '../utils/syntaxHighlighterUtils'; // Import the utility

SyntaxHighlighter.registerLanguage('json', json);

interface TabContentProps {
  tab: Tab;
  content: string; 
  portfolioData: PortfolioData;
  onOpenProjectTab: (projectId: string, projectTitle: string) => void;
  currentThemeName: string;
  onContextMenuRequest: (x: number, y: number, tabId: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({ tab, content, portfolioData, onOpenProjectTab, currentThemeName, onContextMenuRequest }) => {
  const [finalSyntaxTheme, setFinalSyntaxTheme] = React.useState<any>({});

  React.useLayoutEffect(() => {
    setFinalSyntaxTheme(getSyntaxHighlighterTheme(currentThemeName));
  }, [currentThemeName]);

  const handleContextMenu = (event: React.MouseEvent) => {
    const eligibleForPreview = ['about.json', 'experience.json', 'skills.json', 'contact.json'].includes(tab.id);
    if (tab.type === 'file' && eligibleForPreview) {
      event.preventDefault();
      onContextMenuRequest(event.pageX, event.pageY, tab.id);
    }
  };


  if (tab.type === 'ai_chat') {
    return <AIChatInterface portfolioData={portfolioData} />;
  }

  if (tab.type === 'json_preview' && tab.fileName) {
    try {
      const parsedData = JSON.parse(content);
      return <JsonPreviewView jsonData={parsedData} fileId={tab.fileName} portfolioData={portfolioData} />;
    } catch (error) {
      console.error(`Failed to parse JSON for preview tab ${tab.id}:`, error);
      return <div className="p-4 text-red-400 bg-[var(--editor-background)]">Error displaying preview: Invalid JSON data.</div>;
    }
  }

  if (tab.id === 'projects.json' && tab.type === 'file') {
    try {
      const projectsData = JSON.parse(content);
      const projectsList = projectsData.projects as { id: string; title: string }[];
      return (
        <div 
          className="p-2 md:p-4 h-full overflow-auto bg-[var(--editor-background)] text-[var(--editor-foreground)]"
          onContextMenu={handleContextMenu}
        >
          <h2 className="text-2xl font-semibold mb-6 text-[var(--text-accent)]">// projects.json</h2>
          <p className="mb-6 text-[var(--text-muted)]">
            {`Explore my projects. Click on any project card to view its details in a new "file".`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projectsList.map((project) => (
              <ProjectCard
                key={project.id}
                projectId={project.id}
                projectTitle={project.title}
                onClick={() => onOpenProjectTab(project.id, project.title)}
              />
            ))}
          </div>
        </div>
      );
    } catch (error) { 
        console.error(`Failed to parse JSON for projects.json:`, error);
        return <div className="p-4 text-red-400 bg-[var(--editor-background)]">Error displaying projects: Invalid JSON data.</div>;
    }
  }
  
  return (
    <div onContextMenu={handleContextMenu} className="h-full w-full">
      <SyntaxHighlighter
        language="json"
        style={finalSyntaxTheme} 
        showLineNumbers={true}
        lineNumberStyle={{ 
          color: 'var(--editor-line-number-foreground)', 
          marginRight: '1em', 
          fontSize: 'var(--editor-font-size)',
          fontFamily: 'var(--editor-font-family)'
        }}
        wrapLines={true}
        wrapLongLines={false}
        className="h-full w-full text-[length:var(--editor-font-size)]"
        customStyle={{padding: '1rem'}}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

export default TabContent;
