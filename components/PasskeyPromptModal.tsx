
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants'; // Assuming ICONS for CloseIcon

interface PasskeyPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (passkey: string | null) => void;
  title?: string;
  message?: string;
}

const PasskeyPromptModal: React.FC<PasskeyPromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Enter Passkey",
  message = "Please enter the passkey to proceed:",
}) => {
  const [passkey, setPasskey] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const CloseIcon = ICONS.x_icon;
  const KeyIcon = ICONS.settings_icon; // Using settings icon as a generic key/auth icon

  useEffect(() => {
    if (isOpen) {
      setPasskey(''); // Reset passkey on open
      setTimeout(() => inputRef.current?.focus(), 0); // Autofocus after modal is visible
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleSubmit = () => {
    onSubmit(passkey);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} onKeyDown={handleKeyDown} role="dialog" aria-modal="true" aria-labelledby="passkey-prompt-title">
      <div
        className="passkey-prompt-content bg-[var(--modal-background)] border border-[var(--modal-border)] rounded-lg shadow-2xl flex flex-col overflow-hidden text-[var(--modal-foreground)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b border-[var(--modal-border)]">
          <div className="flex items-center">
            {KeyIcon && <KeyIcon size={18} className="text-[var(--text-accent)] mr-2" />}
            <h2 id="passkey-prompt-title" className="text-md font-semibold text-[var(--modal-foreground)]">{title}</h2>
          </div>
          {CloseIcon && (
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--modal-foreground)] p-1 rounded hover:bg-[var(--titlebar-button-hover-background)]"
              aria-label="Close passkey prompt"
            >
              <CloseIcon size={18} />
            </button>
          )}
        </div>

        <div className="p-4 space-y-3">
          <p className="text-sm text-[var(--text-muted)]" id="passkey-prompt-message">{message}</p>
          <input
            ref={inputRef}
            type="password" // Changed to password for basic obfuscation
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="w-full p-2 bg-[var(--modal-input-background)] text-[var(--modal-foreground)] border border-[var(--modal-input-border)] rounded-md focus:outline-none focus:border-[var(--focus-border)] focus:ring-1 focus:ring-[var(--focus-border)] text-sm"
            aria-describedby="passkey-prompt-message"
          />
        </div>

        <div className="p-3 border-t border-[var(--modal-border)] bg-[var(--sidebar-background)] flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs bg-[var(--sidebar-item-hover-background)] hover:bg-[var(--activitybar-hover-background)] text-[var(--modal-foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1.5 text-xs bg-[var(--modal-button-background)] hover:bg-[var(--modal-button-hover-background)] text-[var(--modal-button-foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasskeyPromptModal;
