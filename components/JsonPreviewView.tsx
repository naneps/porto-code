
import React from 'react';
import { PortfolioData, EducationEntry, WorkExperienceEntry, Position } from '../types';
import { ICONS } from '../constants'; // For icons if needed

interface JsonPreviewViewProps {
  jsonData: any; // The parsed JSON data
  fileId: string; // Original file ID (e.g., "about.json") to determine structure
  portfolioData: PortfolioData; // Full portfolio data for context if needed
}

const JsonPreviewView: React.FC<JsonPreviewViewProps> = ({ jsonData, fileId, portfolioData }) => {
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
  const InfoIcon = ICONS.about_portfolio || UserIcon; // For summary


  const renderSectionTitle = (title: string, Icon?: React.ElementType) => (
    <div className="flex items-center mb-3 mt-5 first:mt-0">
      {Icon && <Icon size={20} className="text-[var(--text-accent)] mr-2" />}
      <h2 className="text-xl font-semibold text-[var(--text-accent)]">{title}</h2>
    </div>
  );

  const renderClickableLink = (href: string, text: string, Icon?: React.ElementType) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="inline-flex items-center text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] hover:underline break-all"
    >
      {Icon && <Icon size={16} className="mr-1.5 flex-shrink-0" />}
      {text}
    </a>
  );

  const renderDetailItem = (label: string, value: string | JSX.Element, Icon?: React.ElementType) => (
    <div className="mb-2 flex items-start">
      {Icon && <Icon size={16} className="text-[var(--text-muted)] mr-2 mt-1 flex-shrink-0" />}
      <div>
        <span className="font-medium text-[var(--editor-foreground)]">{label}: </span>
        <span className="text-[var(--text-default)]">{value}</span>
      </div>
    </div>
  );


  if (fileId === 'about.json') {
    const { name, nickname, summary, current_position, education } = jsonData as {
      name: string; nickname: string; summary?: string; current_position: Position; education: EducationEntry[];
    };
    return (
      <div className="p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {renderSectionTitle("About Me", UserIcon)}
        {renderDetailItem("Full Name", name)}
        {renderDetailItem("Nickname", nickname)}

        {summary && (
          <>
            {renderSectionTitle("Summary", InfoIcon)}
            <p className="text-[var(--text-default)] mb-4 whitespace-pre-line text-sm leading-relaxed">{summary}</p>
          </>
        )}

        {renderSectionTitle("Current Position", BriefcaseIcon)}
        {renderDetailItem("Role", current_position.role)}
        {renderDetailItem("Company", current_position.company)}
        {renderDetailItem("Period", current_position.period)}
        {current_position.description && <p className="text-sm text-[var(--text-muted)] mt-1 ml-6 whitespace-pre-line">{current_position.description}</p>}


        {renderSectionTitle("Education", Code2Icon)}
        {education.map((edu, index) => (
          <div key={index} className="mb-3 pl-4 border-l-2 border-[var(--text-accent)]">
            <p className="font-semibold">{edu.school}</p>
            <p className="text-sm text-[var(--text-muted)]">{edu.major} ({edu.period})</p>
          </div>
        ))}
      </div>
    );
  }

  if (fileId === 'experience.json') {
    const { work_experience } = jsonData as { work_experience: WorkExperienceEntry[] };
    return (
      <div className="p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {renderSectionTitle("Work Experience", BriefcaseIcon)}
        {work_experience.map((exp, index) => (
          <div key={index} className="mb-4 p-3 border border-[var(--border-color)] rounded-md bg-[var(--sidebar-background)]">
            <h3 className="text-lg font-semibold text-[var(--link-foreground)]">{exp.role}</h3>
            <p className="text-md text-[var(--text-default)]">{exp.company}</p>
            <p className="text-sm text-[var(--text-muted)] mb-1">{exp.period}</p>
            {exp.description && <p className="text-sm text-[var(--text-muted)] whitespace-pre-line">{exp.description}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (fileId === 'skills.json') {
    const { skills } = jsonData as { skills: string[] };
    return (
      <div className="p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
        {renderSectionTitle("Skills", Code2Icon)}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-[var(--sidebar-item-hover-background)] text-[var(--text-accent)] rounded-full text-sm border border-[var(--text-accent)] shadow-sm">
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
      <div className="p-4 md:p-6 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto">
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

  // Fallback for unknown fileId or if jsonData is not in expected format
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