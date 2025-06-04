
import React, { useEffect, useRef } from 'react';
import { PortfolioData, LogLevel } from '../../types'; // Adjusted path, added LogLevel
import ChatBubble from './ChatBubble'; // Updated path
import { Send, AlertTriangle, Loader2 } from 'lucide-react';
import { useGeminiChat } from '../../hooks/useGeminiChat'; // Adjusted path

interface AIChatInterfaceProps {
  portfolioData: PortfolioData;
  addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ portfolioData, addAppLog }) => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    apiKeyAvailable,
    handleSendMessage,
  } = useGeminiChat(portfolioData, addAppLog); // Pass addAppLog here

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[var(--editor-background)] text-[var(--editor-foreground)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="p-3 bg-red-500/20 text-red-300 text-sm flex items-center">
          <AlertTriangle size={18} className="mr-2" /> {error}
        </div>
      )}
      {!apiKeyAvailable && messages.length > 0 && messages[0].error && messages[0].text.includes("API key has not been configured") && (
         <div className="p-3 bg-yellow-500/20 text-yellow-300 text-sm flex items-center justify-center">
            <AlertTriangle size={18} className="mr-2" />
            AI Assistant features are disabled. API key not configured.
        </div>
      )}
      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--sidebar-background)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
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