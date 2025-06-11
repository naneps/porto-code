import { AppMenuItem, SidebarItemConfig, Tab, ProjectDetail, EditorPaneId, FeaturesStatusState, FeatureId, LogLevel, NotificationType } from '../../App/types';
import { ALL_FEATURE_IDS, ICONS as AppIcons } from '../../App/constants'; // Use AppIcons to avoid conflict
import { LucideIcon, Command, Eye, EyeOff, Play, FileTerminal, Cat, BarChart3 as StatisticsIconLucide, Settings, Columns, Rows, ArrowLeftRight, ListChecks, Github, MessageSquare } from 'lucide-react';

interface MenuConfigArgs {
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
  onOpenAboutModal: () => void;
  icons: { [key: string]: LucideIcon }; // Keep this as it's directly used from App.tsx
  sidebarItems: SidebarItemConfig[];
  projectsData: ProjectDetail[];
  onRunItem: (config: { id: string, fileName: string, title: string, type: Tab['type'] }) => void;
  onRunCVGenerator: () => void;
  onToggleTerminal: () => void;
  onTogglePetsPanel: () => void;
  onToggleLogsPanel: () => void;
  onToggleStatisticsPanel: () => void;
  onToggleGitHubPanel: () => void; 
  onToggleGuestBookPanel: () => void; 
  onOpenSettingsEditor: () => void;
  onToggleRightEditorPane: () => void;
  onFocusEditorPane: (paneId: EditorPaneId) => void;
  onMoveEditorToOtherPane: () => void;
  isSoundMuted: boolean; 
  onToggleSoundMute: () => void;
  featuresStatus: FeaturesStatusState;
  addNotificationAndLog: (message: string, type: NotificationType, duration?: number, actions?: any[], icon?: LucideIcon) => void;
}

export const generateMenuConfig = (args: MenuConfigArgs): { name: string; subItems?: AppMenuItem[] }[] => {
  const { featuresStatus, addNotificationAndLog } = args;

  const createMaintenanceAwareAction = (originalAction: () => void, featureId: FeatureId, featureName: string, defaultIcon?: LucideIcon): AppMenuItem => {
    const status = featuresStatus[featureId];
    if (status !== 'active') {
      return {
        label: `${featureName} [Maintenance]`,
        action: () => {
          addNotificationAndLog(`The ${featureName} feature is currently under maintenance.`, 'warning', 5000, undefined, AppIcons.HardHatIcon);
          args.onOpenCommandPalette(); // Close menu by opening palette
        },
        icon: AppIcons.HardHatIcon || defaultIcon,
      };
    }
    return { label: featureName, action: originalAction, icon: defaultIcon };
  };


  const getAllFileItems = (items: SidebarItemConfig[]): SidebarItemConfig[] => {
    const files: SidebarItemConfig[] = [];
    const collect = (currentItems: SidebarItemConfig[]) => {
      currentItems.forEach(item => {
        if (item.isFolder && item.children) {
          collect(item.children);
        } else if (!item.isFolder && item.fileName) {
          files.push(item);
        }
      });
    };
    collect(items);
    return files;
  };

  const allSidebarFiles = getAllFileItems(args.sidebarItems);

  return [
  { name: 'File' },
  { name: 'Edit' },
  { name: 'Selection' },
  {
    name: 'View',
    subItems: [
      { label: 'Command Palette...', action: args.onOpenCommandPalette, icon: Command },
      createMaintenanceAwareAction(args.onToggleSidebar, 'explorer', args.isSidebarVisible ? 'Hide Explorer Sidebar' : 'Show Explorer Sidebar', args.isSidebarVisible ? EyeOff : Eye),
      { separator: true },
      {
        label: 'Toggle Second Editor Group',
        action: args.onToggleRightEditorPane,
        icon: args.icons.split_square_horizontal_icon || Columns,
      },
      {
        label: 'Focus Left Editor Group',
        action: () => args.onFocusEditorPane('left'),
        icon: Rows, 
      },
      {
        label: 'Focus Right Editor Group',
        action: () => args.onFocusEditorPane('right'),
        icon: Rows, 
      },
      {
        label: 'Move Active Editor to Other Group',
        action: args.onMoveEditorToOtherPane,
        icon: ArrowLeftRight,
      },
      { separator: true },
      createMaintenanceAwareAction(args.onToggleStatisticsPanel, 'statisticsPanel', 'Toggle Statistics Panel', args.icons.statistics_icon || StatisticsIconLucide),
      createMaintenanceAwareAction(args.onToggleGitHubPanel, 'githubProfileView', 'Open GitHub Profile Tab', args.icons.github_icon || Github),
      createMaintenanceAwareAction(args.onToggleGuestBookPanel, 'guestBook', 'Open Guest Book', args.icons.guest_book_icon || MessageSquare),
      { separator: true },
      createMaintenanceAwareAction(args.onToggleTerminal, 'terminal', 'Toggle Terminal', args.icons.TerminalIcon || FileTerminal),
      createMaintenanceAwareAction(args.onTogglePetsPanel, 'petsPanel', 'Toggle Pets Panel', args.icons.CatIcon || Cat),
      createMaintenanceAwareAction(args.onToggleLogsPanel, 'logsPanel', 'Toggle Logs Panel', args.icons.LogsIcon || ListChecks),
    ]
  },
  {
    name: 'Go'
  },
  {
    name: 'Run',
    subItems: [
      createMaintenanceAwareAction(args.onRunCVGenerator, 'cvGenerator', 'Run CV Generator Script', args.icons.generate_cv_icon || Play),
      { separator: true },
      ...allSidebarFiles
        .filter(item => item.fileName !== 'generate_cv.ts')
        .map(item => ({
          label: `Run ${item.fileName}`,
          action: () => args.onRunItem({
            id: `${item.id}_preview`,
            fileName: item.fileName!,
            title: `Preview: ${item.title || item.fileName}`,
            type: 'json_preview',
          }),
          icon: args.icons.PlayIcon || Play,
        })),
      ...(args.projectsData.length > 0 && allSidebarFiles.filter(item => item.fileName !== 'generate_cv.ts').length > 0 ? [{ separator: true }] : []),
      ...args.projectsData.map((project) => {
        return {
          label: `Run Project: ${project.title}`,
          action: () => args.onRunItem({
            id: `${project.id}_preview`,
            fileName: project.id,
            title: `Preview: ${project.title}`,
            type: 'json_preview',
          }),
          icon: args.icons.PlayIcon || Play,
        };
      }),
    ],
  },
  {
    name: 'Settings',
    subItems: [
        createMaintenanceAwareAction(args.onOpenSettingsEditor, 'settingsEditor', 'Settings', args.icons.settings_icon || Settings),
    ]
  },
  {
    name: 'Terminal',
    subItems: [
        createMaintenanceAwareAction(args.onToggleTerminal, 'terminal', 'New Terminal', args.icons.TerminalIcon || FileTerminal),
    ]
  },
  {
    name: 'Help',
    subItems: [
      { label: 'About Portfolio', action: args.onOpenAboutModal, icon: args.icons.about_portfolio },
    ]
  },
];
}
