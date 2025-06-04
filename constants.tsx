
import { ArrowLeft, ArrowRight, BarChart3, Bell, Bot, Briefcase, Cat, Check, ChevronDown, ChevronRight, Code2, Command, Eye, FileBadge, FileCode2 as FileCodeIcon, FileJson2, Files, FileTerminal, FileText, Folder as FolderClosed, FolderKanban, FolderOpen, Type as FontIcon, GitFork, HelpCircle, LayoutGrid, Link, LucideIcon, Mail, Minus, MousePointerClick, Newspaper, Palette, Phone, Play, Search, Settings, Sparkles, SplitSquareHorizontal, Square, TerminalSquare, User, UserCircle2 as UserProfileIcon, Volume2, VolumeX, X } from 'lucide-react';
import { MOCK_CV_GENERATOR_CODE } from './assets/generate_cv_code';
import { ActivityBarItemDefinition, Command as AppCommandType, PortfolioData, ProjectDetail, SidebarItemConfig } from './types';


export const PORTFOLIO_DATA: PortfolioData = {
  name: "Nandang Eka Prasetya",
  nickname: "Nande",
  avatar: "https://github.com/nandangeka.png",
  email: "ekaprasetya2244@gmail.com",
  phone: "+6281802192111",
  address: {
    city: "Indramayu",
    full: "Indramayu, Indonesia"
  },
  summary: "Experienced Mobile Developer specializing in Flutter, with a proven track record of creating innovative and high-performance mobile applications. Proficient in developing cross-platform solutions and integrating advanced technologies such as AI and robotics. Skilled in delivering end-to-end solutions for industries including retail, entertainment, F&B, and logistics. Adept at working in Agile Scrum environments and quickly learning emerging technologies.",
  education: [
    {
      school: "Politeknik Negeri Indramayu",
      major: "Diploma (D3) in Informatics",
      period: "2020 - 2023"
    }
  ],
  current_position: {
    role: "Mobile Developer",
    company: "Yubi Technology",
    period: "Oct 2023 - Present",
    description: "Developed a variety of mobile applications using Flutter, including POS systems, self-service kiosks, warehouse management, and HR solutions, reducing manual steps by an average of 5 per workflow and cutting processing time by several minutes per transaction. Successfully developed a self-service kiosk application for Kios Kopi, integrating with a robotic barista to automate coffee preparation, handling up to 200 orders per day with minimal human intervention. Proficient in utilizing REST APIs for efficient communication between mobile applications and backend servers, reducing data retrieval time from seconds to milliseconds and handling thousands of requests per day."
  },
  work_experience: [
    {
      role: "Mobile Developer",
      company: "Yubi Technology",
      period: "Oct 2023 - Present",
      description: "Developed a variety of mobile applications using Flutter, including POS systems, self-service kiosks, warehouse management, and HR solutions, reducing manual steps by an average of 5 per workflow and cutting processing time by several minutes per transaction. Successfully developed a self-service kiosk application for Kios Kopi, integrating with a robotic barista to automate coffee preparation, handling up to 200 orders per day with minimal human intervention. Proficient in utilizing REST APIs for efficient communication between mobile applications and backend servers, reducing data retrieval time from seconds to milliseconds and handling thousands of requests per day."
    },
    {
      role: "Mobile Developer",
      company: "PT ACQ Teknologi Indonesia",
      period: "Jul 2024 - Jan 2025", 
      description: "Developed and maintained a mobile app for a startup, ensuring reliable communication and a seamless user experience, leading to an increase in positive user feedback and higher daily active users. Collaborated with the team to design and implement key features, enhancing app usability and simplifying the booking process, reducing steps from 5 to 3 and cutting booking time by 10 seconds. Focused on delivering a user-friendly interface and optimizing app performance, reducing app load time by 2 seconds and improving session duration per user."
    },
    {
      role: "Frontend Developer",
      company: "Latena Teknologi Nusantara",
      period: "Apr 2023 - Jun 2023",
      description: "Developed and designed intuitive and responsive user interfaces (UI) for web applications, ensuring seamless user experiences. Contributed to the development of a CMS platform for Job Portal and Company Profile using NuxtJS, enhancing dynamic web page functionality. Collaborated closely with backend teams to ensure proper alignment between frontend and backend functionalities, integrating data from multiple sources through APIs for accurate data presentation."
    },
    {
      role: "Frontend Developer",
      company: "Roketin",
      period: "Jul 2022 - Dec 2022",
      description: "Developed and designed user interfaces (UI) for web applications using Vue.js, ensuring a visually appealing and user-friendly experience. Collaborated with backend teams in an Agile Scrum environment to align frontend and backend logic, enhancing overall functionality. Integrated APIs from various sources, ensuring accurate data presentation and improving app functionality."
    }
  ],
  skills: [ 
    "Flutter", "Dart", "REST API", "Firebase", "State Management (Provider, GetX)",
    "Freezed", "Google ML Kit", "POS System", "HR Apps", "Warehouse System",
    "Self-Service Kiosk Integration", "Git & GitHub", "NuxtJS", "Vue.js" 
  ],
  projects: [ 
    "POS mobile system (offline & online)",
    "HR attendance mobile app",
    "Technician reporting system",
    "Widget builder & portal (Buildyf)",
    "Self-development platform (Wheel of Life concept)",
    "AI-based Mobile Legends stats predictor",
    "Click Rate game with multiplayer"
  ],
  linkedIn: "https://www.linkedin.com/in/nandang-eka-prasetya",
  instagram: "https://instagram.com/_nannnde", 
  tiktok: "https://tiktok.com/@nandangprasetyaa", 
  otherSocial: { 
    name: "GitHub",
    url: "https://github.com/naneps"
  }
};

export const ICONS: { [key: string]: LucideIcon } = {
  default: FileJson2,
  'about.json': User,
  'experience.json': Briefcase,
  'skills.json': Code2,
  'projects.json': FolderKanban, 
  'contact.json': Mail,
  'article_detail': Newspaper, 
  'project_detail': FileJson2,
  'command_palette_icon': Command,
  'toggle_sidebar': Eye,
  'about_portfolio': HelpCircle,
  'theme_command': Palette,
  'font_command': FontIcon,
  'files_icon': Files, 
  'settings_icon': Settings,
  'ai_chat_icon': Bot,
  'articles_icon': Newspaper, 
  'statistics_icon': BarChart3, 
  'bell_icon': Bell,
  'terminal_square_icon': TerminalSquare,
  'arrow_left_icon': ArrowLeft,
  'arrow_right_icon': ArrowRight,
  'split_square_horizontal_icon': SplitSquareHorizontal,
  'layout_grid_icon': LayoutGrid,
  'user_profile_icon': UserProfileIcon,
  'minus_icon': Minus,
  'square_icon': Square,
  'x_icon': X,
  'chevron_down_icon': ChevronDown,
  'chevron_right_icon': ChevronRight,
  'search_icon': Search,
  'check_icon': Check,
  'file_code_icon': FileCodeIcon, 
  'FileText': FileText, 
  'Eye': Eye, 
  'PlayIcon': Play, 
  'TerminalIcon': FileTerminal,
  'CatIcon': Cat,
  'Volume2Icon': Volume2,
  'VolumeXIcon': VolumeX,
  'SparklesIcon': Sparkles,
  'Mail': Mail,
  'Phone': Phone,
  'User': User,
  'Briefcase': Briefcase,
  'Code2': Code2,
  'Linkedin': GitFork,
  'Instagram': GitFork,
  'Tiktok': GitFork,
  'GitFork': GitFork,
  'Link': Link,
  'MousePointerClick': MousePointerClick,
  'Command': Command, 
  'Search': Search, 
  'Newspaper': Newspaper, 
  'folder_open_icon': FolderOpen,
  'folder_closed_icon': FolderClosed,
  'generate_cv_icon': FileCodeIcon, // Changed to FileCodeIcon for script file
  'cv_preview_icon': FileBadge, // Icon for the CV preview tab
};

export const SIDEBAR_ITEMS: SidebarItemConfig[] = [
  {
    id: 'portfolio-folder',
    label: 'PORTFOLIO',
    icon: ICONS.folder_closed_icon, 
    isFolder: true,
    defaultOpen: true, 
    actionType: 'open_tab', 
    children: [
      { id: 'about.json', label: 'about.json', fileName: 'about.json', icon: ICONS['about.json'], type: 'file', title: 'about.json', actionType: 'open_tab' },
      { id: 'experience.json', label: 'experience.json', fileName: 'experience.json', icon: ICONS['experience.json'], type: 'file', title: 'experience.json', actionType: 'open_tab' },
      { id: 'skills.json', label: 'skills.json', fileName: 'skills.json', icon: ICONS['skills.json'], type: 'file', title: 'skills.json', actionType: 'open_tab' },
      { id: 'projects.json', label: 'projects.json', fileName: 'projects.json', icon: ICONS['projects.json'], type: 'file', title: 'projects.json', actionType: 'open_tab' },
      { id: 'contact.json', label: 'contact.json', fileName: 'contact.json', icon: ICONS['contact.json'], type: 'file', title: 'contact.json', actionType: 'open_tab' },
      {
        id: 'cv-generator-folder',
        label: 'CV_GENERATOR',
        icon: ICONS.folder_closed_icon,
        isFolder: true,
        defaultOpen: false,
        actionType: 'open_tab', 
        children: [
          {
            id: 'generate_cv.ts',
            label: 'generate_cv.ts',
            icon: ICONS.generate_cv_icon,
            fileName: 'generate_cv.ts', 
            title: 'generate_cv.ts', // Title for the tab when viewing code
            actionType: 'open_tab', // Click opens the code
          },
        ],
      },
    ],
  },
];


export const APP_VERSION = "1.8.5"; 
export const REPO_URL = "https://github.com/naneps";

export const COMMANDS_CONFIG: Omit<AppCommandType, 'action' | 'isSelected'>[] = [];


export function generateFileContent(fileName: string, data: PortfolioData): string {
  let content: any;
  switch (fileName) {
    case 'about.json':
      content = {
        name: data.name,
        nickname: data.nickname,
        summary: data.summary,
        current_position: data.current_position,
        education: data.education,
      };
      break;
    case 'experience.json':
      content = {
        work_experience: data.work_experience.map(exp => ({
          role: exp.role,
          company: exp.company,
          period: exp.period,
          description: exp.description,
        })),
      };
      break;
    case 'skills.json':
      content = {
        skills: data.skills,
      };
      break;
    case 'projects.json':
      content = {
        projects: data.projects.map((title, index) => ({
          id: `project_${index}_${title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, '')}.json`,
          title: title,
        })),
      };
      break;
    case 'contact.json':
      content = {
        email: data.email,
        phone: data.phone,
        address: data.address,
        linkedIn: data.linkedIn,
      };
      if (data.instagram) {
        content.instagram = data.instagram;
      }
      if (data.tiktok) {
        content.tiktok = data.tiktok;
      }
      if (data.otherSocial) {
        content.otherSocial = data.otherSocial;
      }
      break;
    case 'generate_cv.ts': // New case for the mock CV generator code
      return MOCK_CV_GENERATOR_CODE;
    default:
      content = { error: 'File not found or content generation not implemented.' };
  }
  return JSON.stringify(content, null, 2);
}

export function generateProjectDetailContent(projectId: string, data: PortfolioData): string {
  const projectIndexMatch = projectId.match(/project_(\d+)_/);
  let projectTitle = "Unknown Project";
  if (projectIndexMatch && projectIndexMatch[1]) {
    const index = parseInt(projectIndexMatch[1], 10);
    if (index >= 0 && index < data.projects.length) {
      projectTitle = data.projects[index];
    }
  }

  let detailedDescription = `This is a detailed description for ${projectTitle}. It showcases various aspects of the project including its goals, challenges, and outcomes. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

  if (projectTitle.toLowerCase().includes("pos mobile system")) {
    detailedDescription = "Developed a comprehensive Point of Sale (POS) mobile system designed for both offline and online operations. Features include inventory management, sales tracking, customer relationship management, and integration with payment gateways. Built with Flutter for cross-platform compatibility.";
  } else if (projectTitle.toLowerCase().includes("hr attendance mobile app")) {
    detailedDescription = "Created an HR attendance mobile application allowing employees to clock in/out using geolocation and facial recognition. The app also supports leave requests and provides administrators with real-time attendance dashboards. Utilized Flutter and Firebase.";
  }

  const projectDetail: ProjectDetail = {
    id: projectId,
    title: projectTitle,
    description: detailedDescription,
    technologies: ["Flutter", "Dart", "Firebase", "REST API"], 
    year: 2023, 
    related_skills: data.skills.filter(skill => 
        detailedDescription.toLowerCase().includes(skill.toLowerCase()) || 
        projectTitle.toLowerCase().includes(skill.toLowerCase())
    ).slice(0,4), 
  };
  return JSON.stringify(projectDetail, null, 2);
}

export const DEFAULT_ACTIVITY_BAR_ITEMS: ActivityBarItemDefinition[] = [
  { id: 'explorer-activity', label: 'Explorer', iconName: 'files_icon', viewId: 'explorer' },
  { id: 'search-activity', label: 'Search', iconName: 'search_icon', viewId: 'search' },
  { id: 'ai_chat-activity', label: 'AI Assistant', iconName: 'ai_chat_icon', viewId: 'ai_chat_tab' },
  { id: 'articles-activity', label: 'Articles', iconName: 'articles_icon', viewId: 'articles' },
  { id: 'statistics-activity', label: 'Statistics', iconName: 'statistics_icon', viewId: 'statistics' },
];
