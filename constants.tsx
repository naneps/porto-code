
import { PortfolioData, SidebarItemConfig, ProjectDetail, Command as AppCommandType, ArticleItem } from './types'; // Renamed Command to AppCommandType to avoid conflict
import { User, Briefcase, Code2, FolderKanban, Mail, FileJson2, LucideIcon, FileTerminal, HelpCircle, Eye, Palette, Type as FontIcon, Settings, GitFork, Bell, TerminalSquare, ArrowLeft, ArrowRight, SplitSquareHorizontal, LayoutGrid, UserCircle2 as UserProfileIcon, Minus, Square, X, ChevronDown, ChevronRight, Search, Check, Files, FileCode, Bot, FileText, Link, Phone, MousePointerClick, Command, Newspaper } from 'lucide-react'; // Removed ClipboardCopy


export const PORTFOLIO_DATA: PortfolioData = {
  name: "Nandang Eka Prasetya",
  nickname: "Nande",
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
      period: "Jul 2024 - Jan 2025", // Note: This period is in the future as per provided text.
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
  skills: [ // Kept existing skills as no explicit update request was made for this list
    "Flutter", "Dart", "REST API", "Firebase", "State Management (Provider, GetX)",
    "Freezed", "Google ML Kit", "POS System", "HR Apps", "Warehouse System",
    "Self-Service Kiosk Integration", "Git & GitHub", "NuxtJS", "Vue.js" // Added based on experience
  ],
  projects: [ // Kept existing projects
    "POS mobile system (offline & online)",
    "HR attendance mobile app",
    "Technician reporting system",
    "Widget builder & portal (Buildyf)",
    "Self-development platform (Wheel of Life concept)",
    "AI-based Mobile Legends stats predictor",
    "Click Rate game with multiplayer"
  ],
  linkedIn: "https://www.linkedin.com/in/nandang-eka-prasetya",
  instagram: "https://instagram.com/nandang.prasetya", // Kept existing
  tiktok: "https://tiktok.com/@nandangprasetyaa", // Kept existing
  otherSocial: { // Kept existing
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
  'article_detail': Newspaper, // Icon for article detail tabs
  Mail,
  Phone,
  User,
  Briefcase,
  Code2,
  Linkedin: GitFork,
  Instagram: GitFork,
  Tiktok: GitFork,
  GitFork,
  Link,
  MousePointerClick,
  Command, // Added Command icon
  Search, // Added Search icon
  Newspaper, // Added Newspaper icon for Articles
  // ClipboardCopy, // REMOVED
  project_detail: FileJson2,
  'command_palette_icon': Command,
  'toggle_sidebar': Eye,
  'about_portfolio': HelpCircle,
  'theme_command': Palette,
  'font_command': FontIcon,
  'files_icon': Files,
  'settings_icon': Settings,
  'ai_chat_icon': Bot,
  'articles_icon': Newspaper,
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
  FileText,
  Eye
};

export const APP_VERSION = "1.8.1"; // Incremented version
export const REPO_URL = "https://github.com/nandangeka";

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
    technologies: ["React", "TypeScript", "Tailwind CSS", "VSCode API (Simulated)"],
    year: 2024,
    related_skills: data.skills.slice(0, Math.floor(Math.random() * 3) + 2),
  };
  return JSON.stringify(projectDetail, null, 2);
}

export const SAMPLE_ARTICLES: ArticleItem[] = [
  {
    id: 'article-1',
    slug: 'my-journey-into-flutter-development',
    title: 'My Journey into Flutter Development',
    date: '2024-07-15',
    summary: 'A brief overview of how I started with Flutter and my key learnings along the way, including building complex UIs and integrating backend services.',
    tags: ['Flutter', 'Mobile Development', 'Career'],
    imageUrl: 'https://picsum.photos/seed/flutterjourney/300/200',
    contentMarkdown: `
## Discovering Flutter
It all started when I was looking for a cross-platform framework that offered great performance and a rich development experience. Flutter immediately stood out with its declarative UI, fast development cycles, and strong community support.

## Key Projects
During my initial phase with Flutter, I focused on practical applications:
- **POS System:** An offline-first Point of Sale system for small businesses.
- **Kiosk Application:** A self-service kiosk for a local coffee shop, which later involved integrating with a robotic barista.

## Challenges and Triumphs
Building complex UIs was initially challenging, especially understanding widget composition and state management at scale. However, resources like the official Flutter documentation, community forums, and online courses were invaluable. One of the biggest triumphs was successfully deploying the Kiosk application, which handled hundreds of orders daily.
    `,
  },
  {
    id: 'article-2',
    slug: 'integrating-ai-robotics-mobile-apps',
    title: 'Integrating AI & Robotics in Mobile Apps: A Case Study',
    date: '2024-06-28',
    summary: 'Exploring the integration of a robotic barista with a self-service kiosk application built using Flutter.',
    tags: ['AI', 'Robotics', 'Flutter', 'Integration', 'IoT'],
    imageUrl: 'https://picsum.photos/seed/airobotics/300/200',
    contentMarkdown: `
## The Robotic Barista Project
The goal was to create a seamless self-service coffee ordering experience where users interact with a Flutter-based kiosk, and their order is prepared by a robotic arm. This project was a fascinating blend of software and hardware.

### Technologies Used
- **Flutter:** For the Kiosk App's user interface and business logic.
- **REST APIs:** For communication between the kiosk, the backend server, and the robot controller.
- **Custom Hardware Integration:** Interfacing with the robot's control system required understanding its specific API and communication protocols.

### Learnings
Real-time communication and robust error handling were critical. Network latency, robot operational errors, and inventory management were significant challenges we had to address to ensure a smooth user experience. This project highlighted the growing importance of IoT principles in modern mobile app development.
    `,
  },
  {
    id: 'article-3',
    slug: 'optimizing-api-communication-flutter',
    title: 'Tips for Optimizing API Communication in Flutter Apps',
    date: '2024-05-10',
    summary: 'Sharing some practical tips and techniques for making API calls more efficient and robust in Flutter applications.',
    tags: ['Flutter', 'API', 'Performance', 'Dart', 'Networking'],
    imageUrl: 'https://picsum.photos/seed/flutterapi/300/200',
    contentMarkdown: `
## Common Pitfalls
When dealing with network requests in mobile apps, several issues can arise:
- **Blocking the UI thread:** Performing network operations directly on the main thread leads to a frozen UI.
- **Not handling errors gracefully:** Unhandled exceptions or lack of feedback for network failures create a poor user experience.
- **Ignoring caching:** Repeatedly fetching the same data unnecessarily consumes bandwidth and slows down the app.

## Best Practices
Here are some strategies to improve API communication:
1.  **Use \`async/await\` effectively:** Dart's concurrency model makes it easy to perform asynchronous operations without blocking the UI.
    \`\`\`dart
    Future<void> fetchData() async {
      try {
        final response = await http.get(Uri.parse('https://api.example.com/data'));
        // Process response
      } catch (e) {
        // Handle error
      }
    }
    \`\`\`
2.  **Implement Caching Strategies:** Store frequently accessed, non-critical data locally using packages like \`shared_preferences\` for simple data or \`sqflite\` / \`hive\` for more complex datasets.
3.  **Use Packages like Dio or Chopper:** These packages offer advanced features like interceptors, FormData support, request cancellation, and better error handling out of the box.
4.  **Provide User Feedback:** Always show loading indicators during network calls and display clear error messages if something goes wrong.
    `,
  },
  {
    id: 'article-4',
    slug: 'the-power-of-declarative-ui-with-flutter',
    title: 'The Power of Declarative UI with Flutter',
    date: '2024-08-01',
    summary: 'A deep dive into why Flutter\'s declarative UI paradigm accelerates development and improves code maintainability.',
    tags: ['Flutter', 'UI', 'Development', 'Dart', 'Software Architecture'],
    imageUrl: 'https://picsum.photos/seed/declarativeui/300/200',
    contentMarkdown: `
# Understanding Declarative UI

In a **declarative** UI model, you describe *what* the UI should look like for a given state, and the framework takes care of updating the actual view when the state changes. This is in contrast to **imperative** UI programming, where you manually manipulate UI elements (e.g., "add this button," "change text color of that label").

## Why Flutter Shines Here

Flutter embraces the declarative approach to its core. Here’s how:

### 1. Widgets Everything
In Flutter, virtually everything is a Widget. From structural elements like \`Row\` and \`Column\` to presentational ones like \`Text\` and \`Icon\`, and even layout helpers like \`Padding\` and \`Center\`.

> "Flutter is a UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase." - Official Flutter Docs

### 2. Composition over Inheritance
You build complex UIs by composing simpler widgets. This makes the widget tree easy to understand and reason about.

An example of a simple composed widget:
\`\`\`dart
class MyCustomCard extends StatelessWidget {
  final String title;
  final String subtitle;

  MyCustomCard({required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(title, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text(subtitle),
          ],
        ),
      ),
    );
  }
}
\`\`\`

### 3. Fast Development Cycles
Flutter's "Hot Reload" feature is a game-changer. Because the UI is just a function of state, when you change your code, Flutter can often rebuild the widget tree and update the UI in milliseconds, without losing the current application state.

### 4. State Management
While Flutter itself provides basic state management (\`StatefulWidget\`), the declarative nature pairs well with more advanced state management solutions like:
*   Provider
*   Riverpod
*   GetX
*   BLoC/Cubit

These solutions help manage application state in a clean, predictable way, making UI updates straightforward.

## Benefits

*   **Readability:** Code that describes the UI's appearance for a given state is often easier to read and understand.
*   **Maintainability:** Changes to the UI are typically localized to the state changes, reducing side effects.
*   **Testability:** UI components can be tested more easily by providing different states and asserting the resulting widget tree.

---

Flutter's declarative approach, combined with its rich widget library and excellent tooling, makes it a powerful choice for building modern, high-performance applications across multiple platforms.
    `,
  },
];
