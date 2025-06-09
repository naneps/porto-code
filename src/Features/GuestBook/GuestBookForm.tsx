
import React, { useState } from 'react';
import type { FirebaseUser } from '../../Utils/firebase'; 
import { Github, LogIn, LogOut } from 'lucide-react'; 
import { ICONS } from '../../App/constants';
import { GuestBookFormProps } from '../../App/types'; 


const GoogleIcon: React.FC<{ size?: number, className?: string }> = ({ size = 18, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);


const GuestBookForm: React.FC<GuestBookFormProps> = ({
  currentUser,
  effectiveNickname, // Use effectiveNickname
  onSignIn,
  onSignOut,
  onSubmitMessage,
  isSubmitting,
}) => {
  const [message, setMessage] = useState('');
  const MAX_MESSAGE_LENGTH = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser || isSubmitting) return;
    await onSubmitMessage(message);
    setMessage(''); 
  };

  return (
    <div className="p-3 sm:p-4 border-b border-[var(--border-color)] bg-[var(--sidebar-background)]">
      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {currentUser.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt={effectiveNickname || 'User Avatar'} // Use effectiveNickname
                  className="w-8 h-8 rounded-full mr-2 border border-[var(--focus-border)]"
                />
              )}
              <span className="text-sm font-medium text-[var(--editor-foreground)]">
                {effectiveNickname || 'Authenticated User'} {/* Display effectiveNickname */}
              </span>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--link-foreground)] px-2 py-1 rounded hover:bg-[var(--editor-tab-inactive-background)] transition-colors flex items-center"
              title="Sign out"
            >
              <LogOut size={14} className="mr-1" /> Sign Out
            </button>
          </div>
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message for Nandang..."
              maxLength={MAX_MESSAGE_LENGTH}
              rows={3}
              className="w-full p-2 text-sm bg-[var(--editor-background)] text-[var(--editor-foreground)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--focus-border)] focus:ring-1 focus:ring-[var(--focus-border)] placeholder-[var(--text-muted)] resize-none"
              aria-label="Guest book message input"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-right text-[var(--text-muted)] mt-1">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !message.trim() || message.length > MAX_MESSAGE_LENGTH}
            className="w-full sm:w-auto px-4 py-2 bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] rounded-md text-sm font-medium hover:bg-[var(--modal-button-hover-background)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <ICONS.SpinnerIcon size={18} className="animate-spin mr-2" />
            ) : (
              <ICONS.send_icon size={16} className="mr-2" />
            )}
            {isSubmitting ? 'Submitting...' : 'Post Message'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-md font-semibold text-[var(--editor-foreground)] mb-3">
            Sign in to leave a message!
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-3">
            <button
              onClick={() => onSignIn('google')}
              className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-border)] transition-colors"
              title="Sign in with Google"
            >
              <GoogleIcon size={18} className="mr-2" /> Sign in with Google
            </button>
            <button
              onClick={() => onSignIn('github')}
              className="flex items-center justify-center px-4 py-2 bg-[#333] text-white border border-[#333] rounded-md text-sm font-medium hover:bg-[#444] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-border)] transition-colors"
              title="Sign in with GitHub"
            >
              <Github size={18} className="mr-2" /> Sign in with GitHub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestBookForm;
