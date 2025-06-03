import React from 'react';
import { ICONS, APP_VERSION, REPO_URL, PORTFOLIO_DATA } from '../constants';


interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const InfoIcon = ICONS.about_portfolio; // Usually HelpCircle
  const CloseIcon = ICONS.x_icon;
  const CodeIcon = ICONS.file_code_icon; // Using FileCode for VSCode Portfolio icon
  const UserIcon = ICONS['about.json']; // User icon
  const LinkIcon = ICONS.arrow_right_icon; // Placeholder for ExternalLink


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="about-modal-content bg-[var(--modal-background)] border border-[var(--modal-border)] rounded-lg shadow-2xl flex flex-col overflow-hidden text-[var(--modal-foreground)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--modal-border)]">
          <div className="flex items-center">
            {InfoIcon && <InfoIcon size={20} className="text-[var(--text-accent)] mr-2" />}
            <h2 className="text-lg font-semibold text-[var(--modal-foreground)]">About VSCode Portfolio</h2>
          </div>
          {CloseIcon && (
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--modal-foreground)] p-1 rounded hover:bg-[var(--titlebar-button-hover-background)]">
              <CloseIcon size={20} />
            </button>
          )}
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div className="flex items-center">
            {CodeIcon && <CodeIcon size={24} className="text-[var(--titlebar-icon-blue)] mr-3" />}
            <div>
              <p className="font-semibold text-[var(--modal-foreground)]">VSCode Portfolio</p>
              <p className="text-[var(--text-muted)]">Version: {APP_VERSION}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            {UserIcon && <UserIcon size={18} className="text-[var(--text-accent)] mr-3 mt-0.5 flex-shrink-0" />}
            <div>
              <p className="font-semibold text-[var(--modal-foreground)]">Author: {PORTFOLIO_DATA.name}</p>
              <p className="text-[var(--text-muted)]">A developer portfolio inspired by the Visual Studio Code interface.</p>
            </div>
          </div>

          <p className="text-[var(--text-muted)]">
            This project is built with React, TypeScript, and Tailwind CSS, aiming to replicate
            the look and feel of VSCode for showcasing personal projects and skills.
          </p>

          <a 
            href={REPO_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] hover:underline transition-colors"
          >
            {LinkIcon && <LinkIcon size={16} className="mr-2" />} {/* Using ArrowRight as placeholder for ExternalLink */}
            View Source Code on GitHub
          </a>
        </div>

        <div className="p-4 border-t border-[var(--modal-border)] text-right bg-[var(--sidebar-background)]"> {/* Slightly different bg for footer */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--modal-button-background)] hover:bg-[var(--modal-button-hover-background)] text-[var(--modal-button-foreground)] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] focus:ring-opacity-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;