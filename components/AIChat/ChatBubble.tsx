
import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../../types'; // Adjusted path
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Removed: import CodeBlock from './CodeBlock';

interface ChatBubbleProps {
  message: ChatMessage;
  // Removed: currentThemeName?: string;
}

const TYPING_SPEED_MS = 35;
// TYPING_ANIMATION_ID_PREFIX is part of message IDs generated in useGeminiChat.ts
// This component checks for it to enable the typing animation.

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => { // Removed currentThemeName from props
  const [displayedText, setDisplayedText] = useState('');
  const isUser = message.sender === 'user';
  // Check if the message ID starts with the prefix defined in useGeminiChat.ts
  const isTypingMessage = message.sender === 'ai' && !message.error && message.id.startsWith("ai-typing-");


  useEffect(() => {
    if (isTypingMessage) {
      setDisplayedText('');
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        const charToAdd = message.text[charIndex];
        if (charToAdd) {
          setDisplayedText(prev => prev + charToAdd);
        }
        charIndex++;
        if (charIndex >= message.text.length) {
          clearInterval(typingInterval);
        }
      }, TYPING_SPEED_MS);
      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(message.text);
    }
  }, [message.text, message.id, isTypingMessage]);

  const bubbleClasses = isUser
    ? 'bg-[var(--modal-selected-item-background)] text-[var(--modal-selected-item-foreground)] self-end rounded-lg rounded-br-none'
    : 'bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] self-start rounded-lg rounded-bl-none border border-[var(--border-color)]';

  const IconComponent = isUser ? User : Bot;
  const iconColor = isUser ? 'text-[var(--modal-selected-item-foreground)]' : 'text-[var(--text-accent)]';

  return (
    <div className={`flex items-end mb-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-[85%] md:max-w-[75%] p-0 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
            <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-[var(--editor-background)] border border-[var(--border-color)] flex items-center justify-center mr-2 mt-1`}>
                <IconComponent size={18} className={iconColor} />
            </div>
        )}
        <div className={`px-3 py-2 ${bubbleClasses} shadow-sm`}>
            <div className="markdown-content text-sm break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                  // Removed custom code renderer
                }}
              >
                {displayedText}
              </ReactMarkdown>
            </div>
            {message.error && <p className="text-xs text-red-400 mt-1">Error: Could not get response.</p>}
            <p className={`text-xs mt-1.5 ${isUser ? 'text-gray-400' : 'text-[var(--text-muted)]'} text-right`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
         {isUser && (
            <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-[var(--editor-background)] border border-[var(--border-color)] flex items-center justify-center ml-2 mt-1`}>
                <IconComponent size={18} className={iconColor} />
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
