
import React from 'react';
import { ICONS, REPO_URL, SIDEBAR_ITEMS, APP_VERSION } from '../../App/constants';
import { PortfolioData, SidebarItemConfig } from '../../App/types';
import { Play, TerminalSquare, MessageSquare as GuestBookFeatureIcon } from 'lucide-react'; // Added icons for features

interface WelcomeViewProps {
  portfolioData: PortfolioData;
  onOpenTab: (item: SidebarItemConfig | { id?: string, fileName: string, type?: 'file' | 'project_detail' | 'ai_chat' | 'json_preview', title?: string }) => void;
  onOpenAIChat: () => void;
  onFocusTerminal: () => void; // New prop
  onOpenGuestBook: () => void; // New prop for Guest Book
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ portfolioData, onOpenTab, onOpenAIChat, onFocusTerminal, onOpenGuestBook }) => {
  const AppLogoIcon = ICONS.file_code_icon || ICONS.default;
  const AboutIcon = ICONS['about.json'] || ICONS.default;
  const ProjectsIcon = ICONS['projects.json'] || ICONS.default;
  const ChatIcon = ICONS.ai_chat_icon || ICONS.default;
  const GithubIcon = ICONS.GitFork || ICONS.default;
  const ContactFileIcon = ICONS.Mail || ICONS.default;
  const ExplorerIcon = ICONS.Eye || ICONS.default;
  const CommandPaletteIcon = ICONS.Command || ICONS.default;
  const RightClickIcon = ICONS.MousePointerClick || ICONS.default;
  const TerminalFeatureIcon = ICONS.TerminalIcon || TerminalSquare;


  const handleOpenSidebarItem = (itemId: string) => {
    const findItem = (items: SidebarItemConfig[]): SidebarItemConfig | undefined => {
      for (const item of items) {
        if (item.id === itemId && !item.isFolder) return item;
        if (item.isFolder && item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const itemToOpen = findItem(SIDEBAR_ITEMS);
    if (itemToOpen) {
      onOpenTab(itemToOpen);
    } else {
      console.warn(`WelcomeView: Could not find sidebar item with id: ${itemId}`);
    }
  };
  
  const FeatureCard: React.FC<{icon: React.ElementType, title: string, description: string, buttonText: string, onButtonClick: () => void}> = ({icon: Icon, title, description, buttonText, onButtonClick}) => (
    <div className="bg-[var(--sidebar-item-hover-background)] p-4 rounded-lg border border-[var(--border-color)] flex flex-col text-left">
      <div className="flex items-center mb-2">
        <Icon size={20} className="mr-2 text-[var(--text-accent)] flex-shrink-0" />
        <h3 className="text-md font-semibold text-[var(--editor-foreground)]">{title}</h3>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-3 flex-grow">{description}</p>
      <button
        onClick={onButtonClick}
        className="mt-auto self-start text-xs px-3 py-1.5 bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] rounded-md hover:bg-[var(--modal-button-hover-background)] transition-colors flex items-center"
      >
        <Play size={12} className="mr-1.5" /> {buttonText}
      </button>
    </div>
  );


  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 bg-[var(--editor-background)] text-[var(--editor-foreground)] text-center"> {/* Removed h-full, overflow-auto, justify-center */}
      <AppLogoIcon size={56} className="mb-3 sm:mb-4 text-[var(--titlebar-icon-blue)]" />
      <h1 className="text-2xl sm:text-3xl font-semibold mb-1 sm:mb-2">
        PORTO <span className="text-[var(--text-accent)]">CODE</span>
      </h1>
      <p className="text-sm sm:text-md text-[var(--text-muted)] mb-1">
        Welcome to the portfolio of <span className="text-[var(--text-default)] font-medium">{portfolioData.name}</span>.
      </p>
      <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-6 md:mb-8 max-w-lg sm:max-w-xl">
        This interactive space is designed to showcase skills and projects in a familiar VSCode-like environment.
      </p>

      <div className="w-full max-w-4xl mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--text-accent)]">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <FeatureCard 
            icon={ChatIcon}
            title="AI Assistant"
            description="Ask about my skills, projects, or experience. Powered by Gemini."
            buttonText="Open AI Chat"
            onButtonClick={onOpenAIChat}
          />
          <FeatureCard 
            icon={TerminalFeatureIcon}
            title="Interactive Terminal"
            description="Try VSCode-like commands. Type 'help' to get started."
            buttonText="Focus Terminal"
            onButtonClick={onFocusTerminal}
          />
          <FeatureCard 
            icon={GuestBookFeatureIcon}
            title="Guest Book"
            description="Leave a message and see what others have said about this portfolio."
            buttonText="Open Guest Book"
            onButtonClick={onOpenGuestBook}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full max-w-4xl mb-6 md:mb-8">
        <div className="bg-[var(--sidebar-background)] p-4 sm:p-5 rounded-lg shadow-sm border border-[var(--border-color)] text-left">
          <h2 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3 text-[var(--text-accent)]">Start Exploring</h2>
          <ul className="space-y-1.5 sm:space-y-2">
            {[
              { id: 'about.json', icon: AboutIcon, text: "View About Me" },
              { id: 'projects.json', icon: ProjectsIcon, text: "Explore Projects" },
              { id: 'contact.json', icon: ContactFileIcon, text: "Contact Info" },
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleOpenSidebarItem(item.id)}
                  className="group/button flex items-center w-full text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] transition-colors duration-150 text-xs sm:text-sm p-1.5 rounded-md hover:bg-[var(--sidebar-item-hover-background)]"
                >
                  <item.icon size={16} className="mr-2 flex-shrink-0 text-[var(--text-muted)] group-hover/button:text-[var(--text-accent)] transition-colors" />
                  {item.text} (<code className="text-xs bg-[var(--editor-tab-inactive-background)] px-1 py-0.5 rounded group-hover/button:text-[var(--link-hover-foreground)]">{item.id}</code>)
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[var(--sidebar-background)] p-4 sm:p-5 rounded-lg shadow-sm border border-[var(--border-color)] text-left">
            <h2 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3 text-[var(--text-accent)]">How to Navigate</h2>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[var(--text-muted)]">
                {[
                    {icon: ExplorerIcon, text: "Use the Explorer (sidebar) to open files."},
                    {icon: CommandPaletteIcon, text: "Ctrl+Shift+P (or Cmd+Shift+P) for Command Palette."},
                    {icon: RightClickIcon, text: "Right-click on file tabs or content for context menus."},
                ].map(item => (
                    <li key={item.text} className="flex items-start p-1">
                        <item.icon size={16} className="mr-2 mt-0.5 flex-shrink-0 text-[var(--text-accent)]" />
                        <span dangerouslySetInnerHTML={{ __html: item.text.replace(/<code.*?>.*?<\/code>/g, match => match.replace('text-xs', 'text-[0.7rem]')) }}></span>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      <div className="text-left w-full max-w-4xl bg-[var(--sidebar-background)] p-4 sm:p-5 rounded-lg shadow-sm border border-[var(--border-color)]">
        <h2 className="text-md sm:text-lg font-semibold mb-2 sm:mb-3 text-[var(--text-accent)]">Project Info</h2>
        <ul className="space-y-1.5 sm:space-y-2">
        <li>
            <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group/button flex items-center w-full text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] transition-colors duration-150 text-xs sm:text-sm p-1.5 rounded-md hover:bg-[var(--sidebar-item-hover-background)]"
            >
            <GithubIcon size={16} className="mr-2 flex-shrink-0 text-[var(--text-muted)] group-hover/button:text-[var(--text-accent)] transition-colors" />
            View Source on GitHub
            </a>
        </li>
        <li className="text-xs sm:text-sm text-[var(--text-muted)] p-1">
            This portfolio is inspired by VSCode. Built with React, TypeScript, and Tailwind CSS.
        </li>
        </ul>
      </div>


      <p className="text-xs text-[var(--text-muted)] mt-6 md:mt-8 mb-2 sm:mb-3">
        Version: {APP_VERSION} | &copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
      </p>
    </div>
  );
};

export default WelcomeView;
