
import React, { JSX } from 'react';
import { ICONS } from '../constants';
import { EducationEntry, PortfolioData, Position, ProjectDetail, WorkExperienceEntry } from '../types';

interface JsonPreviewViewProps {
  jsonData: any; // Can be parsed JSON or a direct ProjectDetail object for AI projects
  fileId: string; // Used to determine rendering style (e.g., 'about.json', 'project_xyz.json', or 'ai_project_123')
  portfolioData: PortfolioData; // For context, like skills list for projects
}

const JsonPreviewView: React.FC<JsonPreviewViewProps> = ({ jsonData, fileId }) => {
  const MailIcon = ICONS.Mail;
  const PhoneIcon = ICONS.Phone || MailIcon; 
  const BriefcaseIcon = ICONS.Briefcase;
  const UserIcon = ICONS.User;
  const Code2Icon = ICONS.Code2;
  const LinkedinIcon = ICONS.Linkedin || Code2Icon; 
  const InstagramIcon = ICONS.Instagram || Code2Icon;
  const TiktokIcon = ICONS.Tiktok || Code2Icon;
  const GithubIcon = ICONS.GitFork; 
  const LinkIcon = ICONS.Link || Code2Icon;
  const InfoIcon = ICONS.about_portfolio || UserIcon; 
  const ProjectIcon = ICONS.project_detail || BriefcaseIcon; 
  const TechIcon = ICONS.Code2; 
  const CalendarIcon = ICONS.FileText; 
  const SparklesIcon = ICONS.SparklesIcon;


  const renderSectionTitle = (title: string, Icon?: React.ElementType, isAISuggestion?: boolean) => (
    <div className="flex items-center mb-2 sm:mb-3 mt-4 sm:mt-5 first:mt-0">
      {isAISuggestion && SparklesIcon && <SparklesIcon size={18} className="text-yellow-400 mr-1.5 sm:mr-2" />}
      {Icon && <Icon size={18} className="text-[var(--text-accent)] mr-1.5 sm:mr-2" />}
      <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-accent)]">{title}</h2>
    </div>
  );

  const renderClickableLink = (href: string, text: string, Icon?: React.ElementType) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="inline-flex items-center text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] hover:underline break-all text-xs sm:text-sm"
    >
      {Icon && <Icon size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />}
      {text}
    </a>
  );

  const renderDetailItem = (label: string, value: string | JSX.Element | string[] | number | undefined, Icon?: React.ElementType) => {
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
        return null; 
    }
    let displayValue: JSX.Element | string | number;
    if (Array.isArray(value)) {
      displayValue = (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <span key={index} className="px-1.5 sm:px-2 py-0.5 bg-[var(--sidebar-item-hover-background)] text-[var(--text-default)] rounded-sm text-[0.65rem] sm:text-xs border border-[var(--border-color)]">
              {item}
            </span>
          ))}
        </div>
      );
    } else if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('mailto:') || value.startsWith('tel:'))) {
        // If value itself is a link string but not passed through renderClickableLink
        displayValue = <span className="text-xs sm:text-sm break-all">{value}</span>
    } else {
      displayValue = <span className="text-xs sm:text-sm">{value as string | number}</span>;
    }

    return (
      <div className="mb-1.5 sm:mb-2 flex items-start">
        {Icon && <Icon size={14} className="text-[var(--text-muted)] mr-1.5 sm:mr-2 mt-0.5 sm:mt-1 flex-shrink-0" />}
        <div className="text-xs sm:text-sm">
          <span className="font-medium text-[var(--editor-foreground)]">{label}: </span>
          <span className="text-[var(--text-default)]">{displayValue}</span>
        </div>
      </div>
    );
  };


  // Handle AI-generated project details or regular project previews
  if (fileId.startsWith('project_') || fileId.startsWith('ai_project_')) {
    const project = jsonData as ProjectDetail; // jsonData is already the ProjectDetail object for AI projects
    const isAISuggestion = fileId.startsWith('ai_project_');
    
    return (
      <div className="p-3 sm:p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {renderSectionTitle(isAISuggestion ? project.title : `Project Preview: ${project.title}`, ProjectIcon, isAISuggestion)}
        {isAISuggestion && <p className="text-[0.65rem] sm:text-xs text-yellow-500 mb-2 sm:mb-3 ml-6 sm:ml-7 -mt-1 sm:-mt-2">This project idea was suggested by AI.</p>}
        
        {!isAISuggestion && renderDetailItem("ID", project.id)}
        
        {renderSectionTitle("Description", InfoIcon)}
        <p className="text-xs sm:text-sm text-[var(--text-default)] mb-3 sm:mb-4 ml-6 sm:ml-7 whitespace-pre-line leading-relaxed">
          {project.description}
        </p>

        {renderDetailItem("Technologies", project.technologies, TechIcon)}
        {project.year && renderDetailItem("Year", project.year.toString(), CalendarIcon)}
        {project.related_skills && project.related_skills.length > 0 && 
          renderDetailItem("Related Skills", project.related_skills, Code2Icon)}
      </div>
    );
  }


  if (fileId === 'about.json') {
    const { name, nickname, summary, current_position, education } = jsonData as {
      name: string; nickname: string; summary?: string; current_position: Position; education: EducationEntry[];
    };
    return (
      <div className="p-3 sm:p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {renderSectionTitle("About Me", UserIcon)}
        {renderDetailItem("Full Name", name)}
        {renderDetailItem("Nickname", nickname)}

        {summary && (
          <>
            {renderSectionTitle("Summary", InfoIcon)}
            <p className="text-[var(--text-default)] mb-3 sm:mb-4 whitespace-pre-line text-xs sm:text-sm leading-relaxed ml-6 sm:ml-7">{summary}</p>
          </>
        )}

        {renderSectionTitle("Current Position", BriefcaseIcon)}
        {renderDetailItem("Role", current_position.role)}
        {renderDetailItem("Company", current_position.company)}
        {renderDetailItem("Period", current_position.period)}
        {current_position.description && <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 sm:mt-1 ml-6 sm:ml-7 whitespace-pre-line">{current_position.description}</p>}


        {renderSectionTitle("Education", Code2Icon)}
        {education.map((edu, index) => (
          <div key={index} className="mb-2 sm:mb-3 pl-3 sm:pl-4 border-l-2 border-[var(--text-accent)]">
            <p className="font-semibold text-sm sm:text-base">{edu.school}</p>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">{edu.major} ({edu.period})</p>
          </div>
        ))}
      </div>
    );
  }

  if (fileId === 'experience.json') {
    const { work_experience } = jsonData as { work_experience: WorkExperienceEntry[] };
    return (
      <div className="p-3 sm:p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {renderSectionTitle("Work Experience", BriefcaseIcon)}
        {work_experience.map((exp, index) => (
          <div key={index} className="mb-3 sm:mb-4 p-2 sm:p-3 border border-[var(--border-color)] rounded-md bg-[var(--sidebar-background)]">
            <h3 className="text-md sm:text-lg font-semibold text-[var(--link-foreground)]">{exp.role}</h3>
            <p className="text-sm sm:text-md text-[var(--text-default)]">{exp.company}</p>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-0.5 sm:mb-1">{exp.period}</p>
            {exp.description && <p className="text-xs sm:text-sm text-[var(--text-muted)] whitespace-pre-line">{exp.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (fileId === 'skills.json') {
    const { skills } = jsonData as { skills: string[] };
    return (
      <div className="p-3 sm:p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {renderSectionTitle("Skills", Code2Icon)}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="px-2 sm:px-3 py-1 bg-[var(--sidebar-item-hover-background)] text-[var(--text-accent)] rounded-full text-xs sm:text-sm border border-[var(--text-accent)] shadow-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (fileId === 'contact.json') {
    const { email, phone, address, linkedIn, instagram, tiktok, otherSocial } = jsonData as PortfolioData; 
    return (
      <div className="p-3 sm:p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {renderSectionTitle("Contact Information", MailIcon)}
        {email && renderDetailItem("Email", renderClickableLink(`mailto:${email}`, email, MailIcon))}
        {phone && renderDetailItem("Phone", renderClickableLink(`tel:${phone}`, phone, PhoneIcon))}
        
        {address && renderDetailItem("Address", `${address.full}`)}

        {renderSectionTitle("Social Media", LinkIcon)}
        {linkedIn && renderDetailItem("LinkedIn", renderClickableLink(linkedIn, "View LinkedIn Profile", LinkedinIcon))}
        {instagram && renderDetailItem("Instagram", renderClickableLink(instagram, `@${instagram.split('/').pop() || 'nandang.prasetya'}`, InstagramIcon))}
        {tiktok && renderDetailItem("TikTok", renderClickableLink(tiktok, `@${tiktok.split('/').pop() || 'nandangprasetyaa'}`, TiktokIcon))}
        {otherSocial && renderDetailItem(otherSocial.name, renderClickableLink(otherSocial.url, `View ${otherSocial.name} Profile`, 
          otherSocial.name.toLowerCase() === 'github' ? GithubIcon : LinkIcon
        ))}
      </div>
    );
  }

  if (fileId === 'projects.json') {
      const { projects } = jsonData as { projects: { id: string; title: string }[] };
      return (
        <div className="p-3 sm:p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
            {renderSectionTitle("Projects List Preview", ProjectIcon)}
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-3 sm:mb-4 ml-6 sm:ml-7">
                This is a preview of the <code>projects.json</code> file. It lists all available projects.
                To see detailed cards for each project, open <code>projects.json</code> normally (not in preview).
            </p>
            <ul className="text-xs sm:text-sm">
                {projects.map(p => (
                    <li key={p.id} className="mb-1 ml-6 sm:ml-7">
                        <span className="font-semibold">{p.title}</span> (ID: <code>{p.id}</code>)
                    </li>
                ))}
            </ul>
        </div>
      );
  }


  return (
    <div className="p-4 bg-[var(--editor-background)] text-[var(--editor-foreground)]">
      <h2 className="text-xl font-semibold text-red-500">Preview Not Available</h2>
      <p>The preview for this file type ({fileId}) is not configured, or the data is not in the expected format.</p>
      <pre className="mt-4 p-2 bg-[var(--sidebar-background)] border border-[var(--border-color)] rounded text-xs overflow-auto">
        {JSON.stringify(jsonData, null, 2)}
      </pre>
    </div>
  );
};

export default JsonPreviewView;
