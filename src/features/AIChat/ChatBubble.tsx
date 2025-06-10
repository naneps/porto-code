
import React from 'react';
import { ChatMessage } from '../../App/types';
import { Bot, User, ExternalLink, FileCode2 as FileCodeIconLucide } from 'lucide-react'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ICONS } from '../../App/constants';


interface ChatBubbleProps {
  message: ChatMessage;
  onOpenFileRequest?: (fileName: string) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onOpenFileRequest }) => {
  const isUser = message.sender === 'user';
  
  const displayedText = message.text;

  const bubbleClasses = isUser
    ? 'bg-[var(--modal-selected-item-background)] text-[var(--modal-selected-item-foreground)] self-end rounded-lg rounded-br-none'
    : 'bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] self-start rounded-lg rounded-bl-none border border-[var(--border-color)]';

  const IconComponent = isUser ? User : Bot;
  const iconColor = isUser ? 'text-[var(--modal-selected-item-foreground)]' : 'text-[var(--text-accent)]';

  const OpenFileWidgetIcon = ICONS.file_code_icon || FileCodeIconLucide;


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
                  a: ({node, ...props}) => ( 
                    <a {...props} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[var(--link-foreground)] hover:underline">
                      {props.children}
                      <ExternalLink size={12} className="ml-1 opacity-70" />
                    </a>
                  )
                }}
              >
                {displayedText}
              </ReactMarkdown>
            </div>

            {message.sender === 'ai' && message.recommendedFiles && message.recommendedFiles.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[var(--border-color)] border-opacity-50">
                <p className="text-xs text-[var(--text-muted)] mb-1.5">Suggested files to open:</p>
                <div className="flex flex-wrap gap-1.5">
                  {message.recommendedFiles.map(fileName => (
                    <button
                      key={fileName}
                      onClick={() => onOpenFileRequest && onOpenFileRequest(fileName)}
                      className="ai-chat-file-widget-button" 
                      title={`Open ${fileName} in the editor`}
                    >
                      <OpenFileWidgetIcon size={13} className="mr-1.5 flex-shrink-0" />
                      {fileName}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
    