# Customizing Your Portfolio

This tutorial shows you how to replace the default portfolio content with your own information. By the end, all portfolio files (`about.json`, `experience.json`, `projects.json`, `skills.json`, `contact.json`) will reflect your data.

**Time required:** ~20 minutes  
**Prerequisites:** [Getting Started](./getting-started.md) completed — the dev server should be running.

---

## 1. Open the Constants File

All portfolio data is defined as a single TypeScript constant in:

```
src/App/constants.tsx
```

The relevant export is `PORTFOLIO_DATA` (starts around line 9). This is the **only file you need to edit** to customize your portfolio content.

---

## 2. Update Personal Information

Find the `PORTFOLIO_DATA` object and update the following top-level fields:

```ts
export const PORTFOLIO_DATA: PortfolioData = {
  name: "Your Full Name",
  nickname: "YourNick",
  email: "you@example.com",
  phone: "+1234567890",
  avatarUrl: "https://link-to-your-profile-photo.jpg",
  role: "Your Role (e.g., Fullstack Developer)",
  address: {
    city: "Your City",
    full: "Your City, Your Country",
  },
  summary: "A compelling 2–3 sentence summary of your professional background...",
  // ... continue below
};
```

**Tips:**
- `avatarUrl` accepts any publicly accessible image URL (e.g., your LinkedIn profile photo URL).
- `summary` is displayed in `about.json` and passed to the AI assistant as context.

---

## 3. Update Education

```ts
education: [
  {
    school: "Your University or Polytechnic",
    major: "Your Degree (e.g., Bachelor of Computer Science)",
    period: "2019 - 2023",
  },
  // Add more entries if needed
],
```

---

## 4. Update Current Position & Work Experience

```ts
current_position: {
  role: "Software Engineer",
  company: "Acme Corp",
  period: "Jan 2024 - Present",
  description: "Describe your main responsibilities and achievements here...",
},
work_experience: [
  {
    role: "Software Engineer",
    company: "Acme Corp",
    period: "Jan 2024 - Present",
    description: "Same as current_position or more detailed...",
  },
  {
    role: "Junior Developer",
    company: "Startup Ltd.",
    period: "Jun 2022 - Dec 2023",
    description: "What you built or achieved here...",
  },
],
```

> **Important:** `current_position` and the first entry of `work_experience` are usually the same. Both exist so the AI assistant can format them separately.

---

## 5. Update Skills

Update the `skills` array with your own skill set:

```ts
skills: [
  "React", "TypeScript", "Node.js", "GraphQL",
  "PostgreSQL", "Docker", "Git & GitHub",
  // ... add or remove as needed
],
```

---

## 6. Update Projects

Each project entry requires an `id`, `title`, `description`, `technologies` array, and optional `imageUrls` and `webLink`:

```ts
projects: [
  {
    id: "project_0_my_project",   // Must be unique; used as the tab ID
    title: "My Awesome Project",
    description: "A brief but compelling description of what this project does and its impact.",
    technologies: ["React", "Node.js", "Firebase"],
    related_skills: ["React", "Firebase"],  // Subset of `skills` — used by AI suggestions
    webLink: "https://myproject.example.com",
    imageUrls: [
      "https://raw.githubusercontent.com/you/repo/main/screenshot1.png",
    ],
  },
  // Add more projects...
],
```

**Tips:**
- `imageUrls` should point to raw/direct image URLs (GitHub raw content URLs work well).
- Keep `id` values unique and use the format `project_{index}_{slug}` for consistency.

---

## 7. Update Social Links

```ts
linkedIn: "https://www.linkedin.com/in/your-profile",
instagram: "https://instagram.com/yourhandle",   // Optional
tiktok: "https://www.tiktok.com/@yourhandle",    // Optional
otherSocial: {
  name: "GitHub",
  url: "https://github.com/yourusername",
},
```

> The `otherSocial.url` is used to populate the GitHub Profile tab. The username is extracted from the URL automatically.

---

## 8. Verify Your Changes

Save the file. Vite's hot module replacement (HMR) will update the browser automatically. Check the following:

| Location | Expect to see |
|---|---|
| `about.json` tab | Your name, role, summary, and education |
| `experience.json` tab | Your work history |
| `skills.json` tab | Your skill list |
| `projects.json` tab | Your project cards |
| `contact.json` tab | Your email, phone, and social links |
| AI Assistant | Responds with your personal info when asked |

---

## 9. (Optional) Update the Mock GitHub Stats

The GitHub Profile tab uses mock statistics since the GitHub API doesn't provide contribution graphs to anonymous clients. To update these, find the `MOCK_GITHUB_STATS` export in `constants.tsx`:

```ts
export const MOCK_GITHUB_STATS: MockGitHubStats = {
  totalContributionsLastYear: 1250,  // Your approximate total
  commitStreak: 45,                  // Your longest streak (days)
  topLanguages: [
    { name: 'TypeScript', percentage: 50, color: '#3178C6' },
    { name: 'JavaScript', percentage: 30, color: '#F7DF1E' },
    // ...
  ],
  contributionGraphData: generateMockContributionGraph(), // auto-generated random grid
};
```

---

## Next Steps

- **Add a new feature panel** → [How-to: Add a New Feature Panel](../how-to/add-feature-panel.md)
- **Control feature availability** → [How-to: Manage Feature Status via Firebase](../how-to/manage-feature-status.md)
