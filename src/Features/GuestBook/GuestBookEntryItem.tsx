
import React, { useState } from 'react';
import { GuestBookEntry } from '../../App/types';
import type { FirebaseUser } from '../../Utils/firebase'; 
import { PREDEFINED_EMOJIS, ICONS } from '../../App/constants';
import { CheckCircle, AlertTriangle, MessageSquare, Info, ExternalLink, Github } from 'lucide-react'; 

interface GuestBookEntryItemProps {
  entry: GuestBookEntry;
  currentUser: FirebaseUser | null;
  onReaction: (emoji: string) => void;
  className?: string;
}

const AI_STATUS_ICONS: { [key in GuestBookEntry['aiValidationStatus']]: { icon: React.ElementType, color: string, title: string } } = {
  validated_ok: { icon: CheckCircle, color: 'text-green-500', title: 'AI Validated: Message seems appropriate.' },
  validated_flagged: { icon: AlertTriangle, color: 'text-yellow-500', title: 'AI Flagged: Message may need review.' },
  validation_skipped: { icon: MessageSquare, color: 'text-[var(--text-muted)]', title: 'AI Validation Skipped.' },
  validation_error: { icon: Info, color: 'text-red-500', title: 'AI Validation Error.' },
  pending: { icon: ICONS.SpinnerIcon, color: 'text-[var(--text-muted)] animate-spin', title: 'AI Validation Pending...'}
};

interface UserProfileLinkProps {
  nickname: string;
  avatarUrl?: string;
  githubLogin?: string;
  authProvider: 'google' | 'github';
  children?: React.ReactNode; 
}

const UserProfileDisplay: React.FC<UserProfileLinkProps> = ({ nickname, avatarUrl, githubLogin, authProvider }) => {
  const content = (
    <>
      {avatarUrl ? (
        <img src={avatarUrl} alt={`${nickname}'s avatar`} className="w-10 h-10 rounded-full border border-[var(--focus-border)]" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-[var(--sidebar-item-hover-background)] flex items-center justify-center text-[var(--text-accent)] text-lg font-semibold border border-[var(--focus-border)]">
          {nickname.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-sm font-semibold text-[var(--editor-foreground)] ml-3">{nickname}</span>
      {authProvider === 'github' && githubLogin && (
        <Github size={14} className="ml-1.5 text-[var(--text-muted)] group-hover:text-[var(--link-foreground)] transition-colors" />
      )}
    </>
  );

  if (authProvider === 'github' && githubLogin) {
    return (
      <a
        href={`https://github.com/${githubLogin}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center hover:text-[var(--link-hover-foreground)] group"
        title={`View ${nickname}'s GitHub profile (@${githubLogin})`}
      >
        {content}
        <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-70 transition-opacity text-[var(--link-foreground)]" />
      </a>
    );
  }
  
  return <div className="inline-flex items-center">{content}</div>;
};


const GuestBookEntryItem: React.FC<GuestBookEntryItemProps> = ({ entry, currentUser, onReaction, className }) => {
  const [showFullMessage, setShowFullMessage] = useState(false);
  const MAX_DISPLAY_LENGTH = 200; 

  const { nickname, avatarUrl, githubLogin, message, timestamp, aiValidationStatus, reactions, authProvider } = entry;

  const formattedTimestamp = timestamp instanceof Date 
    ? timestamp.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Invalid Date';

  const displayMessage = showFullMessage || message.length <= MAX_DISPLAY_LENGTH
    ? message
    : `${message.substring(0, MAX_DISPLAY_LENGTH)}...`;

  const ValidationIcon = AI_STATUS_ICONS[aiValidationStatus]?.icon || MessageSquare;
  const validationIconColor = AI_STATUS_ICONS[aiValidationStatus]?.color || 'text-[var(--text-muted)]';
  const validationTitle = AI_STATUS_ICONS[aiValidationStatus]?.title || 'AI Validation Status Unknown';
  
  return (
    <div className={`p-3 sm:p-4 bg-[var(--sidebar-background)] border border-[var(--border-color)] rounded-lg shadow-sm ${className || ''} ${entry.isNew ? 'animate-spawnItem' : ''}`}>
      <div className="flex items-start space-x-0"> 
        <div className="flex-1"> 
          <div className="flex items-center justify-between mb-1.5"> 
             <UserProfileDisplay 
                nickname={nickname} 
                avatarUrl={avatarUrl} 
                githubLogin={githubLogin}
                authProvider={authProvider}
             />
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[var(--text-muted)]" title={timestamp.toISOString()}>{formattedTimestamp}</span>
              <span title={validationTitle}>
                <ValidationIcon size={14} className={validationIconColor} />
              </span>
            </div>
          </div>
          
          <div className="mt-1 pl-[calc(2.5rem+0.75rem)]"> 
            <div className="text-sm text-[var(--text-default)] whitespace-pre-line break-words">
                {displayMessage}
            </div>
            {message.length > MAX_DISPLAY_LENGTH && (
                <button
                onClick={() => setShowFullMessage(!showFullMessage)}
                className="text-xs text-[var(--link-foreground)] hover:underline mt-1"
                >
                {showFullMessage ? 'Show Less' : 'Show More'}
                </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[var(--border-color)] border-opacity-50">
        <div className="flex items-center space-x-1.5">
          {PREDEFINED_EMOJIS.map((emoji) => {
            const userHasReacted = currentUser && reactions[emoji]?.includes(currentUser.uid);
            const count = reactions[emoji]?.length || 0;
            return (
              <button
                key={emoji}
                onClick={() => onReaction(emoji)}
                disabled={!currentUser}
                className={`px-1.5 py-0.5 rounded-full text-xs flex items-center transition-colors duration-150
                  ${userHasReacted ? 'bg-[var(--focus-border)] bg-opacity-30 border border-[var(--focus-border)] text-[var(--text-accent)]' : 'bg-[var(--editor-tab-inactive-background)] hover:bg-[var(--sidebar-item-hover-background)] border border-transparent hover:border-[var(--border-color)] text-[var(--text-muted)]'}
                  ${!currentUser ? 'cursor-not-allowed opacity-70' : ''}
                `}
                title={currentUser ? (userHasReacted ? `Remove ${emoji} reaction` : `React with ${emoji}`) : "Sign in to react"}
                aria-pressed={userHasReacted}
              >
                <span className="text-sm mr-0.5">{emoji}</span>
                {count > 0 && (
                  <span 
                    className={`font-mono ${userHasReacted ? 'text-[var(--editor-foreground)]' : 'text-[var(--text-muted)]'}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GuestBookEntryItem;
