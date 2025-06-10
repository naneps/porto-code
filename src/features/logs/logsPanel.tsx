
import React, { useEffect, useRef } from 'react';
import { LogEntry, LogLevel } from '../../App/types';
import { ICONS } from '../../App/constants';
import { Info, AlertTriangle, XCircle, ChevronRightSquare, Bug, ListChecks } from 'lucide-react';

interface LogsPanelProps {
  logs: LogEntry[];
  onClose: () => void;
}

const LOG_LEVEL_CONFIG: Record<LogLevel, { icon: React.ElementType; colorClass: string; bgColorClass?: string }> = {
  info: { icon: Info, colorClass: 'text-[var(--notification-info-icon)]', bgColorClass: 'bg-[var(--notification-info-background)]' },
  action: { icon: ChevronRightSquare, colorClass: 'text-[var(--text-accent)]' },
  debug: { icon: Bug, colorClass: 'text-purple-400' },
  warning: { icon: AlertTriangle, colorClass: 'text-[var(--notification-warning-icon)]', bgColorClass: 'bg-[var(--notification-warning-background)]' },
  error: { icon: XCircle, colorClass: 'text-[var(--notification-error-icon)]', bgColorClass: 'bg-[var(--notification-error-background)]' },
};

const LogsPanel: React.FC<LogsPanelProps> = ({ logs, onClose }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const CloseIcon = ICONS.x_icon;
  const PanelIcon = ICONS.LogsIcon || ListChecks;

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const formatTimestamp = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  };

  return (
    <div
      className="h-full flex flex-col bg-[var(--terminal-background)] text-[var(--terminal-foreground)] border-t border-[var(--terminal-border)] shadow-md"
      role="log"
      aria-live="polite"
    >
      <div className="flex items-center justify-between px-2 py-1 bg-[var(--terminal-toolbar-background)] border-b border-[var(--terminal-border)] text-xs flex-shrink-0">
        <div className="flex items-center">
          {PanelIcon && <PanelIcon size={14} className="mr-2 text-[var(--text-accent)]" />}
          <span>LOGS</span>
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
        className="flex-1 p-2 overflow-y-auto font-mono text-xs"
         style={{
            fontSize: 'var(--terminal-font-size)', // Use terminal font size for consistency
            lineHeight: 'var(--terminal-line-height)',
        }}
      >
        {logs.length === 0 && (
          <div className="text-center text-[var(--text-muted)] italic py-4">No logs yet.</div>
        )}
        {logs.map((log) => {
          const config = LOG_LEVEL_CONFIG[log.level];
          const IconComponent = config.icon;
          return (
            <div
              key={log.id}
              className={`flex items-start py-0.5 border-b border-[var(--border-color)] border-opacity-20 last:border-b-0 ${config.bgColorClass ? `${config.bgColorClass} bg-opacity-10` : ''}`}
              title={`Source: ${log.source || 'Unknown'}${log.details ? ` | Details: ${JSON.stringify(log.details)}` : ''}`}
            >
              <span className="w-20 text-[var(--text-muted)] flex-shrink-0">
                {formatTimestamp(log.timestamp)}
              </span>
              <span className={`w-5 mx-1 flex-shrink-0 flex items-center justify-center ${config.colorClass}`}>
                <IconComponent size={12} />
              </span>
              <span className="flex-grow whitespace-pre-wrap break-words">
                <span className={`font-semibold ${config.colorClass} mr-1`}>
                  [{log.level.toUpperCase()}]
                </span>
                 {log.source && <span className="text-[var(--text-muted)] mr-1">({log.source})</span>}
                {log.message}
              </span>
            </div>
          );
        })}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default LogsPanel;
