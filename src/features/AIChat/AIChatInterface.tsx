import React, { useEffect, useRef } from 'react';
import { PortfolioData, LogLevel, Tab, ChatMessage, EditorPaneId, FeatureStatus } from '../../App/types'; // Added EditorPaneId, FeatureStatus
import ChatBubble from './ChatBubble';
import { Send, AlertTriangle, Loader2, MessageSquarePlus, Bot } from 'lucide-react'; 
import { AI_CHAT_SHORTCUTS, ALL_FEATURE_IDS, ICONS } from '../../App/constants';
import MaintenanceView from '../../UI/MaintenanceView'; // Import MaintenanceView

interface AIChatInterfaceProps {
  portfolioData: PortfolioData;
  addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void;
  messages: ChatMessage[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  error: string | null;
  apiKeyAvailable: boolean;
  onSendMessage: () => Promise<void>;
  handleOpenTab: (itemOrConfig: { id?: string, fileName?: string, type?: Tab['type'], title?: string, articleSlug?: string, githubUsername?: string }, isRunAction?: boolean, targetPaneId?: EditorPaneId) => void;
  currentPaneIdForChat: EditorPaneId; 
  featureStatus: FeatureStatus; // Added prop for feature status
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ 
  portfolioData, 
  addAppLog,
  messages,
  input,
  setInput,
  isLoading,
  error,
  apiKeyAvailable,
  onSendMessage,
  handleOpenTab,
  currentPaneIdForChat,
  featureStatus // Destructure new prop
}) => {

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (apiKeyAvailable && !isLoading && featureStatus === 'active') { // Only focus if active
        inputRef.current?.focus();
    }
  }, [apiKeyAvailable, isLoading, featureStatus]);

  const handleShortcutClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };
  
  const onOpenFileRequest = (fileName: string) => {
    let tabTitle = fileName;
    // Basic title mapping
    if (fileName === 'about.json') tabTitle = 'about.json';
    else if (fileName === 'experience.json') tabTitle = 'experience.json';
    else if (fileName === 'skills.json') tabTitle = 'skills.json';
    else if (fileName === 'projects.json') tabTitle = 'projects.json';
    else if (fileName === 'contact.json') tabTitle = 'contact.json';
    
    // Use currentPaneIdForChat as the targetPaneId
    handleOpenTab({ fileName: fileName, type: 'file', title: tabTitle }, false, currentPaneIdForChat);
  };

  if (featureStatus !== 'active') {
    return <MaintenanceView featureName={ALL_FEATURE_IDS.aiChat} featureIcon={ICONS.ai_chat_icon} />;
  }


  return (
    <div className="flex flex-col h-full bg-[var(--editor-background)] text-[var(--editor-foreground)]">
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} onOpenFileRequest={onOpenFileRequest} />
        ))}
        {isLoading && (
           <div className="flex items-center justify-start mb-3">
             <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[var(--editor-background)] border border-[var(--border-color)] flex items-center justify-center mr-2 mt-1">
                <Bot size={18} className="text-[var(--text-accent)]" />
            </div>
            <div className="px-3 py-2 bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] self-start rounded-lg rounded-bl-none border border-[var(--border-color)] shadow-sm">
                <div className="ai-thinking-indicator text-sm">
                    AI Assistant is thinking
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {error && (
        <div className="p-2 sm:p-3 bg-red-500/20 text-red-300 text-xs sm:text-sm flex items-center">
          <AlertTriangle size={16} className="mr-2" /> {error}
        </div>
      )}
      {!apiKeyAvailable && messages.length > 0 && messages[0].error && messages[0].text.includes("API key has not been configured") && (
         <div className="p-2 sm:p-3 bg-yellow-500/20 text-yellow-300 text-xs sm:text-sm flex items-center justify-center">
            <AlertTriangle size={16} className="mr-2" />
            AI Assistant features are disabled. API key not configured.
        </div>
      )}

      <div className="p-2 sm:p-3 border-t border-[var(--border-color)] bg-[var(--sidebar-background)]">
        {apiKeyAvailable && !isLoading && AI_CHAT_SHORTCUTS.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {AI_CHAT_SHORTCUTS.map(shortcut => (
              <button
                key={shortcut.label}
                onClick={() => handleShortcutClick(shortcut.prompt)}
                className="ai-chat-shortcut-button flex items-center"
                title={shortcut.prompt}
              >
                <MessageSquarePlus size={12} className="mr-1 opacity-75" />
                {shortcut.label}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage(); 
          }}
          className="flex items-center space-x-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={apiKeyAvailable ? "Ask something about Nandang..." : "AI Assistant unavailable"}
            className="flex-1 p-2 bg-[var(--editor-background)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--focus-border)] text-sm text-[var(--editor-foreground)] placeholder-[var(--text-muted)]"
            disabled={isLoading || !apiKeyAvailable}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !apiKeyAvailable}
            className="p-2.5 bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] hover:bg-[var(--modal-button-hover-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatInterface;
