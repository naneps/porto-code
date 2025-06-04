
import React from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'; // Import TypeScript language
import { Tab, PortfolioData, ProjectDetail } from '../types';
import ProjectCard from './ProjectCard';
import AIChatInterface from './AIChat/AIChatInterface';
import JsonPreviewView from './JsonPreviewView';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getSyntaxHighlighterTheme } from '../utils/syntaxHighlighterUtils';
import { ICONS } from '../constants';
import { Loader2 } from 'lucide-react';
import CVPreview from './CVPreview'; // Import CVPreview


SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('typescript', typescript); // Register TypeScript

interface TabContentProps {
  tab: Tab;
  content: string | { markdown: string; imageUrl?: string } | ProjectDetail | PortfolioData; // Content can now be PortfolioData for CV Preview
  portfolioData: PortfolioData;
  onOpenProjectTab: (projectId: string, projectTitle: string) => void;
  currentThemeName: string;
  onContextMenuRequest: (x: number, y: number, tabId: string, isCVGeneratorContext?: boolean) => void; // Updated signature
  aiGeneratedProjects: ProjectDetail[]; 
  onSuggestNewAIProject: () => void; 
  isAISuggestingProject: boolean; 
}

const TabContent: React.FC<TabContentProps> = ({ 
  tab, 
  content, 
  portfolioData, 
  onOpenProjectTab, 
  currentThemeName, 
  onContextMenuRequest,
  aiGeneratedProjects, 
  onSuggestNewAIProject, 
  isAISuggestingProject, 
}) => {
  const [finalSyntaxTheme, setFinalSyntaxTheme] = React.useState<any>({});
  const SparklesIcon = ICONS.SparklesIcon;

  React.useLayoutEffect(() => {
    setFinalSyntaxTheme(getSyntaxHighlighterTheme(currentThemeName));
  }, [currentThemeName]);

  const handleContextMenu = (event: React.MouseEvent) => {
    const isCVGeneratorScript = tab.fileName === 'generate_cv.ts';
    
    if (isCVGeneratorScript) {
        event.preventDefault();
        onContextMenuRequest(event.pageX, event.pageY, tab.id, true); // Pass true for CV generator context
        return;
    }

    if (tab.type === 'cv_preview') {
        // No custom context menu for CV Preview tab
        return;
    }

    const eligibleForPreview = ['about.json', 'experience.json', 'skills.json', 'contact.json', 'projects.json'].includes(tab.fileName || '');
    if (((tab.type === 'file' && eligibleForPreview) || (tab.type === 'project_detail' && !tab.id.startsWith('ai_project_'))) && !tab.id.endsWith('_preview')) {
        event.preventDefault();
        onContextMenuRequest(event.pageX, event.pageY, tab.id, false); // Pass false
    }
    // If none of the above, default browser context menu will show if event.preventDefault() was not called
  };
  

  if (tab.type === 'ai_chat') {
    return <AIChatInterface portfolioData={portfolioData} />;
  }

  if (tab.type === 'cv_preview') {
    return <CVPreview portfolioData={content as PortfolioData} />;
  }

  if (tab.type === 'file' && tab.fileName === 'generate_cv.ts') {
    return (
        <div onContextMenu={handleContextMenu} className="h-full w-full">
            <SyntaxHighlighter
                language="typescript"
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
                {typeof content === 'string' ? content : '// Error: Expected code string for generate_cv.ts'}
            </SyntaxHighlighter>
        </div>
    );
  }

  // Handle AI Generated Project Detail
  if (tab.type === 'project_detail' && tab.id.startsWith('ai_project_')) {
    const aiProject = content as ProjectDetail; 
    if (aiProject) {
      return <JsonPreviewView jsonData={aiProject} fileId={tab.id} portfolioData={portfolioData} />;
    }
  }
  
  const contentAsString = typeof content === 'string' ? content : (typeof (content as {markdown: string}).markdown === 'string' ? (content as {markdown: string}).markdown : JSON.stringify(content, null, 2));


  if (tab.type === 'json_preview' && tab.fileName) {
    try {
      const parsedData = JSON.parse(contentAsString); 
      return <JsonPreviewView jsonData={parsedData} fileId={tab.fileName} portfolioData={portfolioData} />;
    } catch (error) {
      console.error(`Failed to parse JSON for preview tab ${tab.id}:`, error);
      return <div className="p-4 text-red-400 bg-[var(--editor-background)]">Error displaying preview: Invalid JSON data.</div>;
    }
  }

  if (tab.type === 'article_detail') {
    const articleContent = content as { markdown: string; imageUrl?: string };
    return (
      <div className="p-0 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {articleContent.imageUrl && (
          <img
            src={articleContent.imageUrl}
            alt={`Cover image for ${tab.title}`}
            className="w-full h-48 md:h-64 object-cover mb-4 md:mb-6"
          />
        )}
        <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none markdown-content p-4 md:p-8 pt-0 md:pt-0">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
            }}
          >
            {articleContent.markdown}
          </ReactMarkdown>
        </article>
      </div>
    );
  }

  if (tab.id === 'projects.json' && tab.type === 'file') {
    try {
      const projectsData = JSON.parse(contentAsString);
      const projectsList = projectsData.projects as { id: string; title: string }[];
      return (
        <div
          className="p-2 md:p-4 h-full overflow-auto bg-[var(--editor-background)] text-[var(--editor-foreground)]"
          onContextMenu={handleContextMenu}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--text-accent)] mb-2 sm:mb-0">// projects.json</h2>
            {SparklesIcon && (
              <button
                onClick={onSuggestNewAIProject}
                disabled={isAISuggestingProject}
                className="flex items-center self-start sm:self-center px-2 sm:px-3 py-1 sm:py-1.5 bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] hover:bg-[var(--modal-button-hover-background)] rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] disabled:opacity-60 transition-colors"
                title="Suggest a new project idea using AI"
              >
                {isAISuggestingProject ? (
                  <Loader2 size={14} className="animate-spin mr-1 sm:mr-2" />
                ) : (
                  <SparklesIcon size={14} className="mr-1 sm:mr-2" />
                )}
                <span className="hidden sm:inline">{isAISuggestingProject ? 'Suggesting...' : 'Suggest New Project Idea'}</span>
                <span className="sm:hidden">{isAISuggestingProject ? '...' : 'AI Suggest'}</span>
              </button>
            )}
          </div>
          <p className="mb-4 md:mb-6 text-sm text-[var(--text-muted)]">
            {`Explore my projects. Click on any project card to view its details in a new "file". Or, try the AI suggestion feature!`}
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


  if (tab.type === 'project_detail' && !tab.id.startsWith('ai_project_')) {
     try {
        const projectJson = JSON.parse(contentAsString); 
        return <JsonPreviewView jsonData={projectJson} fileId={tab.id} portfolioData={portfolioData} />;
    } catch (e) {
        console.error("Error parsing project_detail for JsonPreviewView", e);
    }
  }


  // Default JSON rendering for other 'file' types
  if (tab.type === 'file') {
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
            {contentAsString}
        </SyntaxHighlighter>
        </div>
    );
  }

  // Fallback for unhandled types or errors
  return (
    <div className="p-4 text-red-400 bg-[var(--editor-background)]">
        Error: Unhandled tab type or content issue.
        <pre>{`Tab Type: ${tab.type}, Content Type: ${typeof content}`}</pre>
    </div>
  );
};

export default TabContent;