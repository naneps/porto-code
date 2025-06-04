
import { AppMenuItem, Theme, FontFamilyOption, FontSizeOption, SidebarItemConfig, Tab, ProjectDetail, EditorPaneId } from '../../types';
import { LucideIcon, Command, Eye, EyeOff, Play, FileTerminal, Cat, BarChart3 as StatisticsIconLucide, Settings, Columns, Rows, ArrowLeftRight, ListChecks } from 'lucide-react';

interface MenuConfigArgs {
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
  onOpenAboutModal: () => void;
  icons: { [key: string]: LucideIcon };
  sidebarItems: SidebarItemConfig[];
  projectsData: ProjectDetail[];
  onRunItem: (config: { id: string, fileName: string, title: string, type: Tab['type'] }) => void;
  onRunCVGenerator: () => void;
  onToggleTerminal: () => void;
  onTogglePetsPanel: () => void;
  onToggleLogsPanel: () => void; // Added
  onToggleStatisticsPanel: () => void;
  onOpenSettingsEditor: () => void;
  onToggleRightEditorPane: () => void;
  onFocusEditorPane: (paneId: EditorPaneId) => void;
  onMoveEditorToOtherPane: () => void;
  isSoundMuted: boolean; 
  onToggleSoundMute: () => void;
}

export const generateMenuConfig = (args: MenuConfigArgs): { name: string; subItems?: AppMenuItem[] }[] => [
  { name: 'File' },
  { name: 'Edit' },
  { name: 'Selection' },
  {
    name: 'View',
    subItems: [
      { label: 'Command Palette...', action: args.onOpenCommandPalette, icon: Command },
      {
        label: 'Toggle Explorer Sidebar',
        action: args.onToggleSidebar,
        icon: args.isSidebarVisible ? EyeOff : Eye
      },
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
      {
        label: 'Toggle Statistics Panel',
        action: args.onToggleStatisticsPanel,
        icon: args.icons.statistics_icon || StatisticsIconLucide,
      },
      {
        label: 'Toggle Terminal',
        action: args.onToggleTerminal,
        icon: args.icons.TerminalIcon || FileTerminal,
      },
      {
        label: 'Toggle Pets Panel',
        action: args.onTogglePetsPanel,
        icon: args.icons.CatIcon || Cat,
      },
      {
        label: 'Toggle Logs Panel',
        action: args.onToggleLogsPanel,
        icon: args.icons.LogsIcon || ListChecks,
      },
    ]
  },
  {
    name: 'Go'
  },
  {
    name: 'Run',
    subItems: [
      {
        label: 'Run CV Generator Script',
        action: args.onRunCVGenerator,
        icon: args.icons.generate_cv_icon || Play,
      },
      { separator: true },
      ...args.sidebarItems.filter(item => item.fileName !== 'generate_cv.ts').map(item => ({
        label: `Run ${item.fileName}`,
        action: () => args.onRunItem({
          id: `${item.id}_preview`,
          fileName: item.fileName!,
          title: `Preview: ${item.title || item.fileName}`,
          type: 'json_preview',
        }),
        icon: args.icons.PlayIcon || Play,
      })),
      ...(args.projectsData.length > 0 && args.sidebarItems.filter(item => item.fileName !== 'generate_cv.ts').length > 0 ? [{ separator: true }] : []),
      ...args.projectsData.map((project) => {
        return {
          label: `Run Project: ${project.title}`,
          action: () => args.onRunItem({
            id: `${project.id}_preview`,
            fileName: project.id, // Use project.id as fileName for project previews
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
        {
            label: 'Settings',
            action: args.onOpenSettingsEditor,
            icon: args.icons.settings_icon || Settings,
        },
    ]
  },
  {
    name: 'Terminal',
    subItems: [
        {
            label: 'New Terminal',
            action: args.onToggleTerminal,
            icon: args.icons.TerminalIcon || FileTerminal,
        }
    ]
  },
  {
    name: 'Help',
    subItems: [
      { label: 'About Portfolio', action: args.onOpenAboutModal, icon: args.icons.about_portfolio },
    ]
  },
];