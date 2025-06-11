
import React, { useEffect, useRef } from 'react';
import { ICONS, ALL_FEATURE_IDS } from '../../App/constants';
import { FeatureStatus } from '../../App/types'; // Added FeatureStatus
import MaintenanceView from '../../UI/MaintenanceView'; // Added MaintenanceView

interface TerminalPanelProps {
  output: string[];
  onClose: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onCommandSubmit: () => void;
  featureStatus: FeatureStatus; // Added featureStatus
}

// Define keyword styles using CSS variables for theme compatibility
const KEYWORD_STYLES: Record<string, string> = {
  // Error/Warning
  'error': 'var(--notification-error-foreground)',
  'failed': 'var(--notification-error-foreground)',
  'warning': 'var(--notification-warning-foreground)',
  'Error': 'var(--notification-error-foreground)',
  'Failed': 'var(--notification-error-foreground)',
  'Warning': 'var(--notification-warning-foreground)',

  // Success
  'success': 'var(--notification-success-foreground)',
  'successfully': 'var(--notification-success-foreground)',
  'complete': 'var(--notification-success-foreground)',
  'completed': 'var(--notification-success-foreground)',
  'finished': 'var(--notification-success-foreground)',
  'ok': 'var(--notification-success-foreground)',

  // Info
  'info': 'var(--notification-info-foreground)',
  'note': 'var(--notification-info-foreground)',
  'message': 'var(--notification-info-foreground)',
  'Virtual': 'var(--notification-info-foreground)',
  'Session': 'var(--notification-info-foreground)',
  'Welcome,': 'var(--text-muted)',

  // Action/Process
  'Running': 'var(--syntax-keyword)',
  'Initializing': 'var(--syntax-keyword)',
  'Processing': 'var(--syntax-keyword)',
  'Fetching': 'var(--syntax-keyword)',
  'Generating': 'var(--syntax-keyword)',
  'disabled': 'var(--syntax-property)',
  'enabled': 'var(--syntax-property)',
  'download': 'var(--syntax-keyword)',
  'initiated': 'var(--syntax-keyword)',
  'script': 'var(--syntax-keyword)',

  // Specific terms
  'PORTO': 'var(--text-accent)', // For PORTO CODE
  'CODE': 'var(--text-accent)',  // For PORTO CODE
  'User': 'var(--text-accent)', // For "User #1234"
  'CodeCat_': 'var(--text-accent)', // For pet name prefix

  // File types (extensions as keys)
  '.json': 'var(--syntax-string)',
  '.ts': 'var(--syntax-string)',
  '.pdf': 'var(--syntax-string)',
  '.js': 'var(--syntax-string)',
  '.py': 'var(--syntax-string)',
  '.java': 'var(--syntax-string)',
  '.config': 'var(--syntax-comment)',
  '.xml': 'var(--syntax-comment)',
  '.html': 'var(--syntax-string)',
  '.css': 'var(--syntax-property)',
};

const NUMBER_REGEX = /\b\d+(\.\d+)?\b/g;
const FILE_EXTENSION_REGEX = /(\.(?:json|ts|pdf|js|py|java|cs|config|xml|html|css))$/i;
const PROMPT_PREFIX_REGEX = /^>\s*/; // Regex to detect user command prefix

const colorizeLine = (line: string, lineKey: string | number): JSX.Element[] => {
  const elements: JSX.Element[] = [];
  let remainingLine = line;
  let partKey = 0;

  // Handle prompt prefix for user commands
  const promptMatch = remainingLine.match(PROMPT_PREFIX_REGEX);
  if (promptMatch) {
    elements.push(<span key={`${lineKey}-prompt-${partKey++}`} style={{ color: 'var(--text-muted)' }}>{promptMatch[0]}</span>);
    remainingLine = remainingLine.substring(promptMatch[0].length);
  }

  const segments = remainingLine.split(/(\s+)/);

  segments.forEach((segment) => {
    if (segment.match(/^\s+$/)) { 
      elements.push(<React.Fragment key={`${lineKey}-space-${partKey++}`}>{segment}</React.Fragment>);
      return;
    }
    if (!segment) return; 

    if (KEYWORD_STYLES[segment]) {
      elements.push(<span key={`${lineKey}-kw-${partKey++}`} style={{ color: KEYWORD_STYLES[segment] }}>{segment}</span>);
    }
    else {
      const extMatch = segment.match(FILE_EXTENSION_REGEX);
      if (extMatch && KEYWORD_STYLES[extMatch[1].toLowerCase()]) { 
        const namePart = segment.substring(0, segment.length - extMatch[1].length);
        elements.push(<React.Fragment key={`${lineKey}-fname-${partKey++}`}>{namePart}</React.Fragment>);
        elements.push(<span key={`${lineKey}-ext-${partKey++}`} style={{ color: KEYWORD_STYLES[extMatch[1].toLowerCase()] }}>{extMatch[1]}</span>);
      }
      else {
        let lastIndex = 0;
        const subParts: JSX.Element[] = [];
        let hasMatches = false;
        NUMBER_REGEX.lastIndex = 0; 
        let match;
        while ((match = NUMBER_REGEX.exec(segment)) !== null) {
          hasMatches = true;
          if (match.index > lastIndex) {
            subParts.push(<React.Fragment key={`${lineKey}-subtext-${partKey++}-${lastIndex}`}>{segment.substring(lastIndex, match.index)}</React.Fragment>);
          }
          subParts.push(<span key={`${lineKey}-num-${partKey++}-${match.index}`} style={{ color: 'var(--syntax-number)' }}>{match[0]}</span>);
          lastIndex = NUMBER_REGEX.lastIndex;
        }

        if (hasMatches) {
          if (lastIndex < segment.length) {
            subParts.push(<React.Fragment key={`${lineKey}-subtext-${partKey++}-${lastIndex}`}>{segment.substring(lastIndex)}</React.Fragment>);
          }
          elements.push(...subParts);
        } else {
          elements.push(<React.Fragment key={`${lineKey}-text-${partKey++}`}>{segment}</React.Fragment>);
        }
      }
    }
  });

  return elements;
};


const TerminalPanel: React.FC<TerminalPanelProps> = ({ output, onClose, inputValue, onInputChange, onCommandSubmit, featureStatus }) => {
  const outputEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const CloseIcon = ICONS.x_icon;
  const TerminalIcon = ICONS.TerminalIcon;

  useEffect(() => {
    if (featureStatus === 'active') {
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, featureStatus]);

  useEffect(() => {
    if (featureStatus === 'active') {
      inputRef.current?.focus();
    }
  }, [featureStatus]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCommandSubmit();
    }
  };

  if (featureStatus !== 'active') {
    return <MaintenanceView featureName={ALL_FEATURE_IDS.terminal} featureIcon={TerminalIcon} />;
  }

  return (
    <div
      className="h-full flex flex-col bg-[var(--terminal-background)] text-[var(--terminal-foreground)] border-t border-[var(--terminal-border)] shadow-md"
      role="log"
      aria-live="polite"
      onClick={() => inputRef.current?.focus()} 
    >
      <div className="flex items-center justify-between px-2 py-1 bg-[var(--terminal-toolbar-background)] border-b border-[var(--terminal-border)] text-xs flex-shrink-0">
        <div className="flex items-center">
          {TerminalIcon && <TerminalIcon size={14} className="mr-2 text-[var(--text-accent)]" />}
          <span>TERMINAL</span>
        </div>
        {CloseIcon && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--terminal-close-button-hover-background)] focus:outline-none"
            title="Close Panel"
            aria-label="Close Panel"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
      <div
        className="flex-1 p-2 overflow-y-auto font-mono"
        style={{
            fontSize: 'var(--terminal-font-size)',
            lineHeight: 'var(--terminal-line-height)',
        }}
      >
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-words">
            {colorizeLine(line, index)}
          </div>
        ))}
        <div ref={outputEndRef} />
      </div>
      <div className="flex items-center p-1 border-t border-[var(--terminal-border)] bg-[var(--terminal-background)]">
        <span className="text-[var(--text-muted)] pl-1 pr-1" style={{ fontSize: 'var(--terminal-font-size)', lineHeight: 'var(--terminal-line-height)'}}>&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[var(--terminal-foreground)] focus:outline-none font-mono w-full"
          style={{
            fontSize: 'var(--terminal-font-size)',
            lineHeight: 'var(--terminal-line-height)',
            padding: '2px 0', 
          }}
          aria-label="Terminal command input"
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
};

export default TerminalPanel;
