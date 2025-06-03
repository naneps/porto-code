
import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBubbleProps {
  message: ChatMessage;
}

const TYPING_SPEED_MS = 35; // Adjusted for smoother typing animation
const TYPING_ANIMATION_ID_PREFIX = "ai-typing-"; // From AIChatInterface

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const [displayedText, setDisplayedText] = useState('');
  const isUser = message.sender === 'user';
  const isTypingMessage = message.sender === 'ai' && !message.error && message.id.startsWith(TYPING_ANIMATION_ID_PREFIX);

  useEffect(() => {
    if (isTypingMessage) {
      setDisplayedText(''); // Reset for new typing messages
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        const charToAdd = message.text[charIndex];
        if (charToAdd) { // Ensure character exists before appending
          setDisplayedText(prev => prev + charToAdd);
        }
        charIndex++;
        if (charIndex >= message.text.length) { // Use >= for safety
          clearInterval(typingInterval);
        }
      }, TYPING_SPEED_MS);
      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(message.text); // Display full text immediately for user or non-typing AI messages
    }
  }, [message.text, message.id, isTypingMessage]); // Dependencies ensure effect reruns for new typing messages

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
                  // You can add more custom components here if needed for specific Markdown elements
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
