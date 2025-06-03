
import React from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tab, PortfolioData } from '../types';
import ProjectCard from './ProjectCard';
import AIChatInterface from './AIChatInterface';
import JsonPreviewView from './JsonPreviewView'; // Import JsonPreviewView

SyntaxHighlighter.registerLanguage('json', json);

interface TabContentProps {
  tab: Tab;
  content: string; 
  portfolioData: PortfolioData;
  onOpenProjectTab: (projectId: string, projectTitle: string) => void;
  currentThemeName: string;
  onContextMenuRequest: (x: number, y: number, tabId: string) => void; // New prop
}

const TabContent: React.FC<TabContentProps> = ({ tab, content, portfolioData, onOpenProjectTab, currentThemeName, onContextMenuRequest }) => {
  const [finalSyntaxTheme, setFinalSyntaxTheme] = React.useState<any>(vscDarkPlus);

  React.useLayoutEffect(() => {
    const isAppLightTheme = currentThemeName === 'VSCode Light+';
    const baseTheme = isAppLightTheme ? vs : vscDarkPlus;
    const newTheme = JSON.parse(JSON.stringify(baseTheme));
    const preStyleUpdates = {
      background: 'var(--editor-background)',
      color: 'var(--editor-foreground)',
      margin: '0', padding: '1rem',
      fontSize: 'var(--editor-font-size)',
      fontFamily: 'var(--editor-font-family)',
      lineHeight: 'var(--editor-line-height)',
      height: '100%', overflow: 'auto',
    };
    newTheme['pre[class*="language-"]'] = { ...(newTheme['pre[class*="language-"]'] || {}), ...preStyleUpdates };
    const codeStyleUpdates = {
      background: 'transparent', color: 'var(--editor-foreground)',
      fontFamily: 'var(--editor-font-family)', fontSize: 'var(--editor-font-size)',
      lineHeight: 'var(--editor-line-height)', textShadow: 'none',
    };
    newTheme['code[class*="language-"]'] = { ...(newTheme['code[class*="language-"]'] || {}), ...codeStyleUpdates };
    const tokenStyleOverrides = {
      '.token.string': { color: 'var(--syntax-string)' }, '.token.keyword': { color: 'var(--syntax-keyword)' },
      '.token.comment': { color: 'var(--syntax-comment)' }, '.token.number': { color: 'var(--syntax-number)' },
      '.token.boolean': { color: 'var(--syntax-boolean)' }, '.token.property': { color: 'var(--syntax-property)' },
      '.token.operator': { color: 'var(--syntax-operator)' }, '.token.punctuation': { color: 'var(--syntax-punctuation)' },
      '.token.function': { color: 'var(--syntax-function)' }, '.token.plain-text': { color: 'var(--editor-foreground)' } 
    };
    for (const [selector, styles] of Object.entries(tokenStyleOverrides)) {
      newTheme[selector] = { ...(newTheme[selector] || {}), ...styles };
    }
    setFinalSyntaxTheme(newTheme);
  }, [currentThemeName]);

  const handleContextMenu = (event: React.MouseEvent) => {
    // Only show custom context menu for eligible file types that are not already previews
    const eligibleForPreview = ['about.json', 'experience.json', 'skills.json', 'contact.json'].includes(tab.id);
    if (tab.type === 'file' && eligibleForPreview) {
      event.preventDefault();
      onContextMenuRequest(event.pageX, event.pageY, tab.id);
    }
    // For other tab types or non-eligible files, the default browser context menu will show.
  };


  if (tab.type === 'ai_chat') {
    return <AIChatInterface portfolioData={portfolioData} />;
  }

  if (tab.type === 'json_preview' && tab.fileName) {
    try {
      const parsedData = JSON.parse(content);
      // tab.fileName here refers to the original file ID (e.g., "about.json")
      return <JsonPreviewView jsonData={parsedData} fileId={tab.fileName} portfolioData={portfolioData} />;
    } catch (error) {
      console.error(`Failed to parse JSON for preview tab ${tab.id}:`, error);
      return <div className="p-4 text-red-400 bg-[var(--editor-background)]">Error displaying preview: Invalid JSON data.</div>;
    }
  }

  if (tab.id === 'projects.json' && tab.type === 'file') { // Ensure it's the file, not a preview of it
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
    } catch (error) { /* ... */ }
  }
  
  // Default: Render raw content with SyntaxHighlighter for 'file' and 'project_detail'
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
