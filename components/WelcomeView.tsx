
import React from 'react';
import { APP_VERSION, ICONS, REPO_URL, SIDEBAR_ITEMS } from '../constants';
import { PortfolioData, SidebarItemConfig } from '../types';

interface WelcomeViewProps {
  portfolioData: PortfolioData;
  onOpenTab: (item: SidebarItemConfig | { id?: string, fileName: string, type?: 'file' | 'project_detail' | 'ai_chat' | 'json_preview', title?: string }) => void;
  onOpenAIChat: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ portfolioData, onOpenTab, onOpenAIChat }) => {
  const AppLogoIcon = ICONS.file_code_icon || ICONS.default;
  const AboutIcon = ICONS['about.json'] || ICONS.default;
  const ProjectsIcon = ICONS['projects.json'] || ICONS.default;
  const ChatIcon = ICONS.ai_chat_icon || ICONS.default;
  const GithubIcon = ICONS.GitFork || ICONS.default;
  const ContactFileIcon = ICONS.Mail || ICONS.default;
  const ExplorerIcon = ICONS.Eye || ICONS.default;
  const CommandPaletteIcon = ICONS.Command || ICONS.default; // Use the Command icon
  const RightClickIcon = ICONS.MousePointerClick || ICONS.default;


  const handleOpenSidebarItem = (itemId: string) => {
    // Find the 'portfolio-folder' first
    const portfolioFolder = SIDEBAR_ITEMS.find(item => item.id === 'portfolio-folder');
    if (portfolioFolder && portfolioFolder.children) {
      // Then find the actual file item within its children
      const itemToOpen = portfolioFolder.children.find(child => child.id === itemId && !child.isFolder);
      if (itemToOpen) {
        onOpenTab(itemToOpen);
      } else {
        console.warn(`WelcomeView: Could not find sidebar item with id: ${itemId} in portfolio-folder`);
      }
    } else {
      console.warn('WelcomeView: Could not find portfolio-folder in SIDEBAR_ITEMS');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 md:p-8 bg-[var(--editor-background)] text-[var(--editor-foreground)] text-center overflow-auto">
      <AppLogoIcon size={64} className="mb-4 sm:mb-6 text-[var(--titlebar-icon-blue)]" />
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2 sm:mb-3">
        PORTO <span className="text-[var(--text-accent)]">CODE</span>
      </h1>
      <p className="text-md sm:text-lg text-[var(--text-muted)] mb-1">
        Welcome to the portfolio of <span className="text-[var(--text-default)] font-medium">{portfolioData.name}</span>.
      </p>
      <p className="text-sm sm:text-md text-[var(--text-muted)] mb-6 md:mb-10 max-w-xl sm:max-w-2xl">
        This interactive space is designed to showcase skills and projects in a familiar VSCode-like environment. Explore files in the sidebar or use the quick links below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mb-8 md:mb-12">
        {/* Start Exploring Section */}
        <div className="bg-[var(--sidebar-background)] p-4 sm:p-6 rounded-lg shadow-md border border-[var(--border-color)] text-left">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--text-accent)]">Start Exploring</h2>
          <ul className="space-y-2 sm:space-y-3">
            <li>
              <button
                onClick={() => handleOpenSidebarItem('about.json')}
                className="flex items-center w-full text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] hover:underline transition-colors duration-150 text-sm sm:text-base"
              >
                <AboutIcon size={18} className="mr-2 flex-shrink-0" />
                View About Me (<code className="text-xs sm:text-sm bg-[var(--editor-tab-inactive-background)] px-1 py-0.5 rounded">about.json</code>)
              </button>
            </li>
            <li>
              <button
                onClick={() => handleOpenSidebarItem('projects.json')}
                className="flex items-center w-full text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] hover:underline transition-colors duration-150 text-sm sm:text-base"
              >
                <ProjectsIcon size={18} className="mr-2 flex-shrink-0" />
                Explore Projects (<code className="text-xs sm:text-sm bg-[var(--editor-tab-inactive-background)] px-1 py-0.5 rounded">projects.json</code>)
              </button>
            </li>
            <li>
              <button
                onClick={onOpenAIChat}
                className="flex items-center w-full text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] hover:underline transition-colors duration-150 text-sm sm:text-base"
              >
                <ChatIcon size={18} className="mr-2 flex-shrink-0" />
                Ask AI Assistant
              </button>
            </li>
             <li>
              <button
                onClick={() => handleOpenSidebarItem('contact.json')}
                className="flex items-center w-full text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] hover:underline transition-colors duration-150 text-sm sm:text-base"
              >
                <ContactFileIcon size={18} className="mr-2 flex-shrink-0" />
                Contact Info (<code className="text-xs sm:text-sm bg-[var(--editor-tab-inactive-background)] px-1 py-0.5 rounded">contact.json</code>)
              </button>
            </li>
          </ul>
        </div>

        {/* How to Navigate Section */}
        <div className="bg-[var(--sidebar-background)] p-4 sm:p-6 rounded-lg shadow-md border border-[var(--border-color)] text-left">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--text-accent)]">How to Navigate</h2>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-[var(--text-muted)]">
                <li className="flex items-start">
                    <ExplorerIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-[var(--text-accent)]" />
                    <span>Use the <strong className="text-[var(--text-default)]">Explorer</strong> (left sidebar) to open different files.</span>
                </li>
                <li className="flex items-start">
                    <CommandPaletteIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-[var(--text-accent)]" />
                    <span>Press <code className="bg-[var(--editor-tab-inactive-background)] px-1 py-0.5 rounded text-xs sm:text-sm text-[var(--text-default)]">Ctrl+Shift+P</code> (or <code className="bg-[var(--editor-tab-inactive-background)] px-1 py-0.5 rounded text-xs sm:text-sm text-[var(--text-default)]">Cmd+Shift+P</code>) to open the <strong className="text-[var(--text-default)]">Command Palette</strong>.</span>
                </li>
                 <li className="flex items-start">
                    <RightClickIcon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-[var(--text-accent)]" />
                    <span><strong className="text-[var(--text-default)]">Right-click</strong> on file tabs or content for context menus.</span>
                </li>
            </ul>
        </div>

        {/* Project Info Section */}
        <div className="bg-[var(--sidebar-background)] p-4 sm:p-6 rounded-lg shadow-md border border-[var(--border-color)] text-left">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--text-accent)]">Project Info</h2>
          <ul className="space-y-2 sm:space-y-3">
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] hover:underline transition-colors duration-150 text-sm sm:text-base"
              >
                <GithubIcon size={18} className="mr-2 flex-shrink-0" />
                View Source on GitHub
              </a>
            </li>
            <li className="text-xs sm:text-sm text-[var(--text-muted)]">
                This portfolio is inspired by VSCode. <br />
                Built with React, TypeScript, and Tailwind CSS.
            </li>
          </ul>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)] mt-4 md:mt-8 mb-2 sm:mb-4">
        Version: {APP_VERSION} | &copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
      </p>
    </div>
  );
};

export default WelcomeView;
