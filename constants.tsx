
import { PortfolioData, SidebarItemConfig, ProjectDetail, Command } from './types';
import { User, Briefcase, Code2, FolderKanban, Mail, FileJson2, LucideIcon, FileTerminal, HelpCircle, Eye, Palette, Type as FontIcon, Settings, GitFork, Bell, TerminalSquare, ArrowLeft, ArrowRight, SplitSquareHorizontal, LayoutGrid, UserCircle2 as UserProfileIcon, Minus, Square, X, ChevronDown, ChevronRight, Search, Check, Files, FileCode, Bot, FileText, Link, Phone } from 'lucide-react'; // Added Bot, FontIcon alias, Files, ChevronRight, FileCode, FileText, Link, Phone


export const PORTFOLIO_DATA: PortfolioData = {
  name: "Nandang Eka Prasetya",
  nickname: "Nande",
  email: "ekaprasetya2244@gmail.com",
  phone: "+6281802192111",
  address: {
    city: "Indramayu",
    full: "Jl. Venesia Raya, RW.5, Klp. Gading Bar., Kec. Klp. Gading, Jkt Utara, Daerah Khusus Ibukota Jakarta 14240"
  },
  education: [
    {
      school: "SMKN 1 Sindang Indramayu",
      major: "Computer Network Engineering",
      period: "2017 - 2020"
    },
    {
      school: "Politeknik Negeri Indramayu",
      major: "Diploma in Informatics",
      period: "2020 - 2023"
    }
  ],
  current_position: {
    role: "Mobile Developer",
    company: "Yubi Technology",
    period: "Oct 2023 - present"
  },
  work_experience: [
    {
      role: "Mobile Developer",
      company: "PT ACQ Teknologi Indonesia",
      period: "Jul 2024 - Jan 2025"
    },
    {
      role: "Mobile Developer (Freelance)",
      company: "Latena Teknologi Nusantara",
      period: "Apr 2023 - Jun 2023"
    },
    {
      role: "Mobile Developer (Internship)",
      company: "Roketin",
      period: "Jul 2022 - Dec 2022"
    }
  ],
  skills: [
    "Flutter", "Dart", "REST API", "Firebase", "State Management (Provider, GetX)",
    "Freezed", "Google ML Kit", "POS System", "HR Apps", "Warehouse System",
    "Self-Service Kiosk Integration", "Git & GitHub"
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
  instagram: "https://instagram.com/nandang.prasetya",
  tiktok: "https://tiktok.com/@nandangprasetyaa",
  otherSocial: {
    name: "GitHub",
    url: "https://github.com/nandangeka"
  }
};

export const SIDEBAR_ITEMS: SidebarItemConfig[] = [
  { id: 'about.json', label: 'About Me', fileName: 'about.json', icon: User, type: 'file' },
  { id: 'experience.json', label: 'Work Experience', fileName: 'experience.json', icon: Briefcase, type: 'file' },
  { id: 'skills.json', label: 'Skills', fileName: 'skills.json', icon: Code2, type: 'file' },
  { id: 'projects.json', label: 'Projects', fileName: 'projects.json', icon: FolderKanban, type: 'file' },
  { id: 'contact.json', label: 'Contact', fileName: 'contact.json', icon: Mail, type: 'file' },
];

export const ICONS: { [key: string]: LucideIcon } = {
  default: FileJson2,
  'about.json': User,
  'experience.json': Briefcase,
  'skills.json': Code2,
  'projects.json': FolderKanban,
  'contact.json': Mail,
  Mail, // For JsonPreviewView
  Phone, // For JsonPreviewView
  User, // For JsonPreviewView
  Briefcase, // For JsonPreviewView
  Code2, // For JsonPreviewView
  Linkedin: GitFork, // Placeholder, ideally a Linkedin icon
  Instagram: GitFork, // Placeholder
  Tiktok: GitFork, // Placeholder
  GitFork, // For JsonPreviewView (GitHub) and Status Bar
  Link, // For JsonPreviewView (general links)
  project_detail: FileJson2, 
  'command_palette': FileTerminal,
  'toggle_sidebar': Eye, 
  'about_portfolio': HelpCircle,
  'theme_command': Palette,
  'font_command': FontIcon,
  'files_icon': Files, 
  'settings_icon': Settings, 
  'ai_chat_icon': Bot, 
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
  'file_code_icon': FileCode,
  FileText, // For context menu "Show Preview"
};

export const APP_VERSION = "1.3.1"; // Incremented version after refactor
export const REPO_URL = "https://github.com/nandangeka"; 

export const COMMANDS_CONFIG: Omit<Command, 'action' | 'isSelected'>[] = [];


export function generateFileContent(fileName: string, data: PortfolioData): string {
  let content: any;
  switch (fileName) {
    case 'about.json':
      content = {
        name: data.name,
        nickname: data.nickname,
        current_position: data.current_position,
        education: data.education,
      };
      break;
    case 'experience.json':
      content = {
        work_experience: data.work_experience,
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

  const projectDetail: ProjectDetail = {
    id: projectId,
    title: projectTitle,
    description: `This is a detailed description for ${projectTitle}. It showcases various aspects of the project including its goals, challenges, and outcomes. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    technologies: ["React", "TypeScript", "Tailwind CSS", "VSCode API (Simulated)"],
    year: 2024, 
    related_skills: data.skills.slice(0, Math.floor(Math.random() * 3) + 2), 
  };
  return JSON.stringify(projectDetail, null, 2);
}
