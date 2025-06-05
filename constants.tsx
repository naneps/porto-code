
import { ArrowLeft, ArrowRight, BarChart3, Bell, Bot, Briefcase, Cat, Check, ChevronDown, ChevronRight, Code2, Command, ExternalLink as ExternalLinkIcon, Eye, FileBadge, FileCode2 as FileCodeIcon, FileJson2, Files, FileTerminal, FileText, Folder as FolderClosed, FolderKanban, FolderOpen, Type as FontIcon, GitFork, Github, HelpCircle, Image as ImageIcon, LayoutGrid, Link, ListChecks, LucideIcon, Mail, MessageSquare, Minus, MousePointerClick, Newspaper, Palette, Phone, Play, Search, Settings, Sparkles, SplitSquareHorizontal, Square, TerminalSquare, User, UserCircle2 as UserProfileIcon, Volume2, VolumeX, X } from 'lucide-react'; // Added Github, MessageSquare
import { MOCK_CV_GENERATOR_CODE } from './assets/generate_cv_code';
import { ActivityBarItemDefinition, Command as AppCommandType, MockGitHubStats, PortfolioData, ProjectListingItem, SidebarItemConfig } from './types';


export const PORTFOLIO_DATA: PortfolioData = {
  name: "Nandang Eka Prasetya",
  nickname: "Nande",
  email: "ekaprasetya2244@gmail.com",
  phone: "+6281802192111",
  avatarUrl: "https://media.licdn.com/dms/image/D5603AQFovS5UWc6iAA/profile-displayphoto-shrink_200_200/0/1738660203129?e=1754524800&v=beta&t=qovbV5WiLMKwY4d72QXJbRGEnFVmxOpxqSMQ642p8ZY", // Added avatar URL
  role: "Mobile Developer", // Added top-level role
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
    {
      id: "project_0_buildify",
      title: "Buildify",
      description: "Buildify is a web platform designed to simplify Flutter widget creation for developers without writing code. It provides various UI development tools like Gradient Builder, Box Shadow Builder, and a Figma-like drag-and-drop Widget Builder. Additionally, users can share their projects publicly and engage in discussions with available community features.",
      technologies: ["Flutter", "Firebase"],
      related_skills: ["Flutter", "Firebase"],
      webLink: "https://buildify-x.web.app/#/home",
      imageUrls: ["https://github.com/naneps/cv-md/blob/main/assets/buildify.png?raw=true"]
    },
    {
      id: "project_1_easy-h",
      title: "EASY-H",
      description: "EASY-H is an application designed to simplify employee management and HR needs within a company. It offers key features such as: Attendance, Leave Requests, Approvals, Salary Reports, and other supplementary features. With a user-friendly interface, EASY-H helps improve the efficiency of human resource management processes.",
      technologies: ["Flutter", "Laravel"],
      related_skills: ["Flutter", "Laravel"],
      imageUrls: [
        "https://github.com/naneps/cv-md/blob/main/assets/easy-h1.png?raw=true",
        "https://github.com/naneps/cv-md/blob/main/assets/easy-h2.png?raw=true",
        "https://github.com/naneps/cv-md/blob/main/assets/easy-h3.png?raw=true",
        "https://github.com/naneps/cv-md/blob/main/assets/easy-h4.png?raw=true"
      ]
    },
    {
      id: "project_2_yubi_pos",
      title: "YUBI POS",
      description: "YUBI POS is a Point of Sale (POS) application specifically designed for restaurants and cafes. It provides comprehensive features including order management, inventory, sales reporting, and payment integration. The system runs on Android and Desktop devices.",
      technologies: ["Flutter", "Dart", "Laravel", "Firebase"],
      related_skills: ["Flutter", "Dart", "Laravel", "Firebase"],
      imageUrls: ["https://github.com/naneps/cv-md/blob/main/assets/yubipos-convensional.png?raw=true"]
    },
    {
      id: "project_3_yubi_pos_mart",
      title: "YUBI POS MART",
      description: "YUBI POS MART is a POS application tailored for the operational needs of minimarkets and retail stores. It offers features for stock management, sales tracking, cashier system integration, and detailed financial reports. The application supports Android and Desktop platforms.",
      technologies: ["Flutter", "Dart", "Laravel", "Firebase"],
      related_skills: ["Flutter", "Dart", "Laravel", "Firebase"],
      imageUrls: ["https://github.com/naneps/cv-md/blob/main/assets/yubipos-mart.png?raw=true"]
    },
    {
      id: "project_4_inventory_app",
      title: "Inventory APP",
      description: "Inventory APP is designed to assist staff in managing the inflow and outflow of goods across various store branches or stock marts. It features real-time stock tracking, goods movement data management, and inventory reports.",
      technologies: ["Flutter", "Laravel", "Firebase"],
      related_skills: ["Flutter", "Laravel", "Firebase"],
      imageUrls: [
        "https://github.com/naneps/cv-md/blob/main/assets/ventoryaopp1.png?raw=true",
        "https://github.com/naneps/cv-md/blob/main/assets/ventoryapp2.png?raw=true"
      ]
    },
    {
      id: "project_5_kios-k",
      title: "KIOS-K",
      description: "KIOS-K is a self-service application for ordering coffee and non-coffee beverages prepared by a robot barista. It allows customers to easily order their favorite drinks through an intuitive interface, integrating directly with the robot barista and digital payment systems.",
      technologies: ["Flutter", "Laravel", "Firebase"],
      related_skills: ["Flutter", "Laravel", "Firebase"],
      imageUrls: [
        "https://github.com/naneps/cv-md/blob/main/assets/kiosk1.png?raw=true",
        "https://github.com/naneps/cv-md/blob/main/assets/kiosk2.png?raw=true"
      ]
    },
    {
      id: "project_6_counting_system",
      title: "Counting System",
      description: "Counting System is an application specifically designed for factory environments to assist in counting goods on each production line. It facilitates monitoring the number of items that pass criteria (ok) and those that do not meet standards (not ok).",
      technologies: ["Flutter", "Laravel"],
      related_skills: ["Flutter", "Laravel"],
      imageUrls: [
        "https://github.com/naneps/cv-md/blob/main/assets/cs1.png?raw=true",
        "https://github.com/naneps/cv-md/blob/main/assets/cs2.png?raw=true"
      ]
    }
  ],
  linkedIn: "https://www.linkedin.com/in/nandang-eka-prasetya",
  instagram: "https://instagram.com/_nannnde",
  tiktok: "https://www.tiktok.com/@_nannnde",
  otherSocial: {
    name: "GitHub",
    url: "https://github.com/naneps"
  }
};

// Helper to generate random contribution data for the mock graph
const generateMockContributionGraph = (weeks = 52, days = 7): number[][] => {
  const graph: number[][] = [];
  for (let i = 0; i < weeks; i++) {
    const weekData: number[] = [];
    for (let j = 0; j < days; j++) {
      // Ensure Sunday (j=0) and Saturday (j=6) have slightly lower chances of high activity
      const isWeekend = j === 0 || j === 6;
      let activityLevel = 0;
      const randomFactor = Math.random();
      if (randomFactor > 0.3) { // 70% chance of some activity
        activityLevel = Math.floor(Math.random() * 3) + 1; // 1-3
        if (randomFactor > 0.7 && !isWeekend) { // 30% chance of higher activity on weekdays
            activityLevel = Math.floor(Math.random() * 2) + 3; // 3-4
        } else if (randomFactor > 0.6 && isWeekend) { // lower high activity chance on weekends
             activityLevel = Math.floor(Math.random() * 2) + 2; // 2-3
        }
      }
      // Ensure some sparse days
      if (Math.random() < 0.15) activityLevel = 0; // 15% chance of no activity override
      weekData.push(Math.min(activityLevel, 4)); // Cap at 4
    }
    graph.push(weekData);
  }
  return graph;
};


export const MOCK_GITHUB_STATS: MockGitHubStats = {
    totalContributionsLastYear: 3115, // Placeholder from user screenshot
    commitStreak: 128, // Placeholder
    topLanguages: [
        { name: 'Dart', percentage: 45, color: '#00B4AB' },
        { name: 'Flutter (UI)', percentage: 30, color: '#02569B' }, // Representing Flutter's UI aspect
        { name: 'JavaScript', percentage: 10, color: '#F7DF1E' },
        { name: 'Python', percentage: 8, color: '#3572A5' },
        { name: 'Other', percentage: 7, color: '#8B949E' }
    ],
    contributionGraphData: generateMockContributionGraph()
};


export const ICONS: { [key: string]: LucideIcon } = {
  default: FileJson2,
  'about.json': User,
  'experience.json': Briefcase,
  'skills.json': Code2,
  'projects.json': FolderKanban,
  'contact.json': Mail,
  'article_detail': Newspaper,
  'project_detail': FileJson2, // Used for project detail tabs
  'github_profile_view': Github, // Icon for GitHub Profile Tab
  'guestbook_icon': MessageSquare, // Icon for Guestbook
  'command_palette_icon': Command,
  'toggle_sidebar': Eye,
  'about_portfolio': HelpCircle,
  'theme_command': Palette,
  'font_command': FontIcon,
  'files_icon': Files,
  'settings_icon': Settings,
  'settings_editor_icon': Settings,
  'ai_chat_icon': Bot,
  'articles_icon': Newspaper,
  'statistics_icon': BarChart3,
  'github_icon': Github,
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
  'generate_cv_icon': FileCodeIcon,
  'cv_preview_icon': FileBadge,
  'ExternalLinkIcon': ExternalLinkIcon,
  'ImageIcon': ImageIcon,
  'LogsIcon': ListChecks,
  'guestbook.chat': MessageSquare, // For sidebar item
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
            title: 'generate_cv.ts',
            actionType: 'open_tab',
          },
        ],
      },
    ],
  },
  {
    id: 'guestbook.chat',
    label: 'guestbook.chat',
    icon: ICONS['guestbook.chat'],
    title: 'Global Guestbook',
    actionType: 'open_global_guestbook',
    type: 'global_guestbook', // Helps identify this as a special tab opener
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
        role: data.role, // Include top-level role
        avatarUrl: data.avatarUrl, // Include avatarUrl
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
      const projectListItems: ProjectListingItem[] = data.projects.map(p => ({
        id: p.id,
        title: p.title,
        imageUrls: p.imageUrls,
        technologies: p.technologies ? p.technologies.slice(0, 3) : [], // Ensure technologies exist
      }));
      content = {
        projects: projectListItems,
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
    case 'generate_cv.ts':
      return MOCK_CV_GENERATOR_CODE;
    case 'guestbook.chat': // Special case for guestbook "file"
        return "// Global Guestbook: Comments are loaded in real-time. This file just acts as an opener.";
    default:
      content = { error: 'File not found or content generation not implemented.' };
  }
  return JSON.stringify(content, null, 2);
}

export function generateProjectDetailContent(projectId: string, data: PortfolioData): string {
  const project = data.projects.find(p => p.id === projectId);

  if (project) {
    return JSON.stringify(project, null, 2);
  }

  console.warn(`Project with ID '${projectId}' not found in PORTFOLIO_DATA.projects.`);
  return JSON.stringify({
    id: projectId,
    title: "Project Not Found",
    description: "Details for this project could not be loaded. Please check the project ID or data source.",
    technologies: [],
    related_skills: [],
  }, null, 2);
}

export const DEFAULT_ACTIVITY_BAR_ITEMS: ActivityBarItemDefinition[] = [
  { id: 'explorer-activity', label: 'Explorer', iconName: 'files_icon', viewId: 'explorer' },
  { id: 'search-activity', label: 'Search', iconName: 'search_icon', viewId: 'search' },
  { id: 'ai_chat-activity', label: 'AI Assistant', iconName: 'ai_chat_icon', viewId: 'ai_chat_tab' },
  { id: 'articles-activity', label: 'Articles', iconName: 'articles_icon', viewId: 'articles' },
  { id: 'statistics-activity', label: 'Statistics', iconName: 'statistics_icon', viewId: 'statistics' },
  { id: 'github-activity', label: 'GitHub Profile', iconName: 'github_icon', viewId: 'github_profile_view' },
  { id: 'guestbook-activity', label: 'Guestbook', iconName: 'guestbook_icon', viewId: 'global_guestbook_view' }, // Added Guestbook
];
export const MAX_LOG_ENTRIES = 250;

export const AI_CHAT_SHORTCUTS: { label: string; prompt: string }[] = [
  { label: "Tell me about Nandang's skills", prompt: "What are Nandang's key skills?" },
  { label: "What projects has he worked on?", prompt: "Can you list some of Nandang's projects?" },
  { label: "Summarize his experience", prompt: "Briefly summarize Nandang's work experience." },
  { label: "How do I navigate this site?", prompt: "How can I navigate this portfolio website?" },
];
