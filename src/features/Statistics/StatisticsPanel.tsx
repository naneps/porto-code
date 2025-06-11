
import React, { useMemo } from 'react';
import { StatisticsData, StatisticsPanelProps, FeatureStatus } from '../../App/types'; 
import { ICONS, ALL_FEATURE_IDS } from '../../App/constants';
import { Users, Eye, Clock, FileText, Palette, Loader2, AlertTriangle, BarChart3, DownloadCloud, MessageCircle, LayoutDashboard } from 'lucide-react';
import MaintenanceView from '../../UI/MaintenanceView';

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ 
  isVisible, 
  statisticsData, 
  isLoading, 
  error, 
  onClose, 
  featureStatus 
}) => {
  const CloseIcon = ICONS.x_icon || Users; 
  const PanelIcon = ICONS.statistics_icon || BarChart3;

  const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ElementType; unit?: string, isLoading?: boolean }> = 
  ({ title, value, icon: Icon, unit, isLoading: cardIsLoading }) => (
    <div className="bg-[var(--editor-background)] p-3 rounded-md shadow border border-[var(--border-color)]">
      <div className="flex items-center text-xs text-[var(--text-muted)] mb-1">
        {Icon && <Icon size={14} className="mr-1.5 text-[var(--text-accent)]" />}
        <span>{title}</span>
      </div>
      {cardIsLoading ? (
        <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
      ) : (
        <div className="text-xl font-semibold text-[var(--editor-foreground)]">
          {value}
          {unit && <span className="text-xs ml-1">{unit}</span>}
        </div>
      )}
    </div>
  );
  
  const uptimeRef = React.useRef(Date.now());
  const [sessionUptime, setSessionUptime] = React.useState('0s');

  React.useEffect(() => {
    if (!isVisible || featureStatus !== 'active') return;
    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - uptimeRef.current) / 1000);
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      setSessionUptime(`${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [isVisible, featureStatus]);

  const mostViewedPage = useMemo(() => {
    if (!statisticsData?.tab_views) return 'N/A';
    let maxViews = 0;
    let pageName = 'N/A';
    for (const tabId in statisticsData.tab_views) {
      const views = statisticsData.tab_views[tabId]?.count || 0;
      if (views > maxViews) {
        maxViews = views;
        pageName = tabId.replace(/_/g, '.'); // Convert back from sanitized key
      }
    }
    return pageName === 'N/A' ? pageName : `${pageName} (${maxViews} views)`;
  }, [statisticsData]);

  const mostPopularTheme = useMemo(() => {
    if (!statisticsData?.theme_usage) return 'N/A';
    let maxUsage = 0;
    let theme = 'N/A';
    for (const themeKey in statisticsData.theme_usage) {
      const usage = statisticsData.theme_usage[themeKey]?.count || 0;
      if (usage > maxUsage) {
        maxUsage = usage;
        theme = themeKey.replace(/_plus_/g, '+').replace(/_/g, ' '); // Convert back
      }
    }
    return theme === 'N/A' ? theme : `${theme} (${maxUsage} uses)`;
  }, [statisticsData]);


  if (featureStatus !== 'active') {
    return <MaintenanceView featureName={ALL_FEATURE_IDS.statisticsPanel} featureIcon={PanelIcon} />;
  }

  return (
    <aside
      className={`
        bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)]
        text-[var(--sidebar-foreground)] flex flex-col h-full w-full flex-shrink-0
        overflow-hidden min-w-0
      `}
      style={{ padding: isVisible ? '0.25rem 0.5rem' : '0' }}
      aria-label="Statistics Panel"
      aria-hidden={!isVisible}
    >
      <div
        className={`
          w-full h-full flex flex-col
          transition-opacity duration-200 ease-in-out
          ${isVisible ? 'opacity-100 delay-100' : 'opacity-0'}
        `}
      >
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <h2 className="text-xs text-[var(--sidebar-section-header-foreground)] uppercase tracking-wider whitespace-nowrap">
            Application Statistics
          </h2>
          {CloseIcon && (
            <button
              onClick={onClose}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--titlebar-button-hover-background)] rounded"
              title="Close Statistics Panel"
              aria-label="Close Statistics Panel"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        {error && !isLoading && (
            <div className="p-3 m-1 rounded-md bg-[var(--notification-error-background)] text-[var(--notification-error-foreground)] border border-[var(--notification-error-border)] text-xs text-center">
                <div className="flex items-center justify-center mb-1">
                    <AlertTriangle size={16} className="mr-2 text-[var(--notification-error-icon)]" />
                    <span className="font-semibold">Error Loading Statistics</span>
                </div>
                <p>{error}</p>
            </div>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-0.5">
          <StatCard title="Total App Loads" value={statisticsData?.app_loads?.total || 0} icon={LayoutDashboard} isLoading={isLoading} />
          <StatCard title="CV Downloads" value={statisticsData?.action_counts?.cv_downloads || 0} icon={DownloadCloud} isLoading={isLoading} />
          <StatCard title="AI Project Suggestions" value={statisticsData?.action_counts?.ai_project_suggestions || 0} icon={ICONS.SparklesIcon} isLoading={isLoading} />
          <StatCard title="Guest Book Entries" value={statisticsData?.guestbook?.total_entries || 0} icon={MessageCircle} isLoading={isLoading} />
          
          <StatCard title="Most Viewed Content" value={mostViewedPage} icon={FileText} isLoading={isLoading} />
          <StatCard title="Most Popular Theme" value={mostPopularTheme} icon={Palette} isLoading={isLoading} />
          <StatCard title="Current Session Uptime" value={sessionUptime} icon={Clock} />
          
           <p className="text-center text-[var(--text-muted)] text-[0.65rem] mt-3">
            Statistics are updated from Firebase.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default StatisticsPanel;
