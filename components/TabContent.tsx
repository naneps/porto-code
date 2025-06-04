

import React from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'; // Import TypeScript language
import { Tab, PortfolioData, ProjectDetail, ProjectListingItem, EditorPaneId, LogLevel } from '../types';
import ProjectCard from './ProjectCard';
import AIChatInterface from './AIChat/AIChatInterface';
import JsonPreviewView from './JsonPreviewView';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getSyntaxHighlighterTheme } from '../utils/syntaxHighlighterUtils';
import { ICONS } from '../constants';
import { Loader2 } from 'lucide-react';
import CVPreview from './CVPreview'; // Import CVPreview
import SettingsEditor from './Settings/SettingsEditor';


SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('typescript', typescript); // Register TypeScript

interface TabContentProps {
  tab: Tab;
  content: any; // This will be the object from getActiveContentDetailsForPane, or string/object for other types
  portfolioData: PortfolioData;
  onOpenProjectTab: (projectId: string, projectTitle: string) => void;
  currentThemeName: string; 
  onContextMenuRequest: (x: number, y: number, tabId: string, isCVGeneratorContext?: boolean) => void;
  aiGeneratedProjects: ProjectDetail[];
  onSuggestNewAIProject: () => void;
  isAISuggestingProject: boolean;
  paneId: EditorPaneId;
  addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  tab,
  content, // This is the object from getActiveContentDetailsForPane
  portfolioData,
  onOpenProjectTab,
  currentThemeName,
  onContextMenuRequest,
  aiGeneratedProjects,
  onSuggestNewAIProject,
  isAISuggestingProject,
  paneId,
  addAppLog,
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
        onContextMenuRequest(event.pageX, event.pageY, tab.id, true);
        return;
    }
    if (tab.type === 'cv_preview' || tab.type === 'settings_editor') return;
    const eligibleForPreview = ['about.json', 'experience.json', 'skills.json', 'contact.json', 'projects.json'].includes(tab.fileName || '');
    if (((tab.type === 'file' && eligibleForPreview) || (tab.type === 'project_detail' && !tab.id.startsWith('ai_project_'))) && !tab.id.endsWith('_preview')) {
        event.preventDefault();
        onContextMenuRequest(event.pageX, event.pageY, tab.id, false);
    }
  };

  if (tab.type === 'ai_chat') {
    return <AIChatInterface portfolioData={portfolioData} addAppLog={addAppLog} />;
  }

  if (tab.type === 'cv_preview') {
    return <CVPreview portfolioData={content as PortfolioData} />;
  }

  if (tab.type === 'settings_editor') {
    const settingsProps = content as any; 
    if (
      typeof settingsProps.isSoundMuted === 'boolean' && settingsProps.handleToggleSoundMute && // Expect handleToggleSoundMute from content
      settingsProps.themes && settingsProps.onThemeChange && settingsProps.currentThemeName &&
      settingsProps.fontFamilies && settingsProps.currentFontFamilyId && settingsProps.onFontFamilyChange &&
      settingsProps.editorFontSizes && settingsProps.currentEditorFontSizeId && settingsProps.onEditorFontSizeChange &&
      settingsProps.terminalFontSizes && settingsProps.currentTerminalFontSizeId && settingsProps.onTerminalFontSizeChange &&
      typeof settingsProps.isDevModeEnabled === 'boolean' && settingsProps.onToggleDevMode
    ) {
        return ( 
          <SettingsEditor 
            isSoundMuted={settingsProps.isSoundMuted} 
            handleToggleSoundMute={settingsProps.handleToggleSoundMute} // Pass handleToggleSoundMute
            themes={settingsProps.themes} currentThemeName={settingsProps.currentThemeName} onThemeChange={settingsProps.onThemeChange} 
            fontFamilies={settingsProps.fontFamilies} currentFontFamilyId={settingsProps.currentFontFamilyId} onFontFamilyChange={settingsProps.onFontFamilyChange} 
            editorFontSizes={settingsProps.editorFontSizes} currentEditorFontSizeId={settingsProps.currentEditorFontSizeId} onEditorFontSizeChange={settingsProps.onEditorFontSizeChange}
            terminalFontSizes={settingsProps.terminalFontSizes} currentTerminalFontSizeId={settingsProps.currentTerminalFontSizeId} onTerminalFontSizeChange={settingsProps.onTerminalFontSizeChange}
            isDevModeEnabled={settingsProps.isDevModeEnabled} onToggleDevMode={settingsProps.onToggleDevMode}
          /> 
        );
    }
    console.error("SettingsEditor missing props:", settingsProps);
    return <div className="p-4">Error: Settings Editor props not fully provided. Check console.</div>;
  }
  
  const getSyntaxHighlighterContent = (rawContent: any, language: string): string => {
    let contentStr = typeof rawContent === 'string' ? rawContent : '// Error: Expected code string';
    if (language === 'json' && typeof rawContent !== 'string') {
        contentStr = JSON.stringify(rawContent, null, 2);
    }
    return (contentStr && contentStr.trim() !== '') ? contentStr : `// No content to display for ${tab.fileName || 'this file'}`;
  };


  if (tab.type === 'file' && tab.fileName === 'generate_cv.ts') {
    const displayContent = getSyntaxHighlighterContent(content, 'typescript');
    return (
      <div onContextMenu={handleContextMenu} className="h-full w-full">
        <SyntaxHighlighter
          language="typescript"
          style={finalSyntaxTheme}
          showLineNumbers={true}
          lineNumberStyle={{ color: 'var(--editor-line-number-foreground)', marginRight: '1em', fontSize: 'var(--editor-font-size)', fontFamily: 'var(--editor-font-family)' }}
          wrapLines={true}
          wrapLongLines={false}
          className="h-full w-full" 
          customStyle={{padding: '1rem'}}
        >
          {displayContent}
        </SyntaxHighlighter>
      </div>
    );
  }

  if (tab.type === 'project_detail' && tab.id.startsWith('ai_project_')) {
    const aiProject = content as ProjectDetail;
    if (aiProject) {
      return <JsonPreviewView jsonData={aiProject} fileId={tab.id} portfolioData={portfolioData} />;
    }
  }

  // For 'file', 'json_preview', 'project_detail' (non-AI) - content is expected to be stringifiable JSON or code
  const codeContentString = (typeof content === 'string') ? content : JSON.stringify(content, null, 2);

  if (tab.type === 'article_detail') {
    // content for article_detail is an object { markdown: string; imageUrl?: string }
    const articleContentData = content as { markdown: string; imageUrl?: string };
    const childrenForMarkdown: string = Array.isArray(articleContentData.markdown)
        ? (articleContentData.markdown as string[]).join('\n')
        : (articleContentData.markdown as string || '');

    return (
      <div className="p-0 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {articleContentData.imageUrl && (
          <img
            src={articleContentData.imageUrl}
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
            {childrenForMarkdown}
          </ReactMarkdown>
        </article>
      </div>
    );
  }
  
  if (tab.type === 'json_preview' && tab.fileName) {
    try {
      const parsedData = JSON.parse(codeContentString);
      return <JsonPreviewView jsonData={parsedData} fileId={tab.fileName} portfolioData={portfolioData} />;
    }
    catch (error) {
      console.error(`Failed to parse JSON for preview tab ${tab.id} in pane ${paneId}:`, error);
      return <div className="p-4 text-red-400 bg-[var(--editor-background)]">Error displaying preview: Invalid JSON data.</div>;
    }
  }


  if (tab.id === 'projects.json' && tab.type === 'file') {
    try {
      const projectsData = JSON.parse(codeContentString);
      const projectsList = projectsData.projects as ProjectListingItem[];
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
                imageUrls={project.imageUrls}
                technologies={project.technologies} 
                onClick={() => onOpenProjectTab(project.id, project.title)}
              />
            ))}
          </div>
        </div>
      );
    } catch (error) {
      console.error(`Failed to parse JSON for projects.json in pane ${paneId}:`, error);
      return <div className="p-4 text-red-400 bg-[var(--editor-background)]">Error displaying projects: Invalid JSON data.</div>;
    }
  }

  if (tab.type === 'project_detail' && !tab.id.startsWith('ai_project_')) {
     try {
       const projectJson = JSON.parse(codeContentString);
       return <JsonPreviewView jsonData={projectJson} fileId={tab.id} portfolioData={portfolioData} />;
     }
     catch (e) {
       console.error(`Error parsing project_detail for JsonPreviewView in pane ${paneId}`, e);
       return <div className="p-4 text-red-400 bg-[var(--editor-background)]">Error: Could not parse project detail.</div>;
     }
  }

  if (tab.type === 'file') {
    const displayContent = getSyntaxHighlighterContent(codeContentString, 'json');
    return (
      <div onContextMenu={handleContextMenu} className="h-full w-full">
        <SyntaxHighlighter
          language="json"
          style={finalSyntaxTheme}
          showLineNumbers={true}
          lineNumberStyle={{ color: 'var(--editor-line-number-foreground)', marginRight: '1em', fontSize: 'var(--editor-font-size)', fontFamily: 'var(--editor-font-family)' }}
          wrapLines={true}
          wrapLongLines={false}
          className="h-full w-full"  
          customStyle={{padding: '1rem'}}
        >
          {displayContent}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <div className="p-4 text-red-400 bg-[var(--editor-background)]">
      Error: Unhandled tab type or content issue.
      <pre>{`Tab Type: ${tab.type}, Content Type: ${typeof content}`}</pre>
    </div>
  );
};

export default TabContent;
