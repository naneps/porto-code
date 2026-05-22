
import React from 'react';
import { PortfolioData } from '../../App/types';
import { ICONS } from '../../App/constants'; 

const CVPreview: React.FC<{ portfolioData: PortfolioData }> = ({ portfolioData }) => {
  const { name, nickname, email, phone, address, summary, current_position, work_experience, education, skills, linkedIn, instagram, tiktok, otherSocial } = portfolioData;

  const SectionTitle: React.FC<{ title: string, className?: string }> = ({ title, className }) => (
    <h2 className={`text-xl font-semibold text-[var(--text-accent)] border-b-2 border-[var(--text-accent)] pb-1 mb-3 mt-4 first:mt-0 ${className || ''}`}>
      {title.toUpperCase()}
    </h2>
  );

  const ContactItem: React.FC<{ icon?: React.ElementType, label?: string, value: string, href?: string, className?: string }> = ({ icon: Icon, label, value, href, className }) => (
    <div className={`flex items-center text-xs mb-0.5 ${className || ''}`}>
      {Icon && <Icon size={12} className="mr-1.5 text-[var(--text-muted)]" />}
      {label && <span className="font-semibold mr-1">{label}:</span>}
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--link-foreground)] hover:underline break-all">
          {value}
        </a>
      ) : (
        <span className="text-[var(--editor-foreground)] break-all">{value}</span>
      )}
    </div>
  );
  
  const Pill: React.FC<{ text: string }> = ({ text }) => (
    <span className="bg-[var(--editor-tab-inactive-background)] text-[var(--text-accent)] text-xs px-2 py-0.5 rounded-full border border-[var(--text-accent)]">
      {text}
    </span>
  );

  const renderFormattedDescription = (desc: string) => {
    const lines = desc.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        const content = trimmed.substring(1).trim();
        const isNested = line.startsWith('  -') || line.startsWith('    -') || line.startsWith('\t-');
        elements.push(
          <li 
            key={index} 
            className={`relative pl-3.5 mb-1 leading-relaxed text-xs text-[var(--text-default)] ${
              isNested 
                ? 'ml-4 text-[var(--text-muted)] before:content-["○"] before:absolute before:left-0 before:text-[var(--text-accent)]/70' 
                : 'before:content-["•"] before:absolute before:left-0 before:text-[var(--text-accent)] font-medium'
            }`}
          >
            {content}
          </li>
        );
      } else if (trimmed) {
        elements.push(
          <p key={index} className="text-xs text-[var(--text-default)] mb-1 leading-relaxed font-semibold mt-1">
            {line}
          </p>
        );
      }
    });
    
    return <ul className="space-y-1 my-1 ml-2">{elements}</ul>;
  };


  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[var(--editor-background)] text-[var(--editor-foreground)] h-full overflow-auto font-sans antialiased">
      <style>{`
        .cv-preview-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          font-size: 10pt;
          line-height: 1.5;
        }
        .cv-preview-container h1, .cv-preview-container h2, .cv-preview-container h3 {
            font-family: var(--editor-font-family, 'Fira Code', monospace); 
        }
      `}</style>
      <div className="cv-preview-container max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[var(--editor-tab-active-foreground)] tracking-tight">{name}</h1>
          {nickname && <p className="text-lg text-[var(--text-muted)]">({nickname})</p>}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-2 text-xs">
            <ContactItem icon={ICONS.Mail} value={email} href={`mailto:${email}`} />
            <ContactItem icon={ICONS.Phone} value={phone} href={`tel:${phone}`} />
            <ContactItem icon={ICONS.Link} value={linkedIn} href={linkedIn} />
            {address && <ContactItem value={address.full} />}
          </div>
        </header>

        {summary && (
          <section className="mb-4">
            <SectionTitle title="Summary" />
            <p className="text-sm text-justify">{summary}</p>
          </section>
        )}

        {current_position && (
           <section className="mb-4">
            <SectionTitle title="Current Position" />
            <div className="mb-2">
              <h3 className="text-md font-semibold text-[var(--editor-tab-active-foreground)]">{current_position.role}</h3>
              <p className="text-sm text-[var(--text-default)]">{current_position.company} ({current_position.period})</p>
              {current_position.description && (
                <div className="mt-1 text-justify">
                  {renderFormattedDescription(current_position.description)}
                </div>
              )}
            </div>
          </section>
        )}


        {work_experience && work_experience.length > 0 && (
          <section className="mb-4">
            <SectionTitle title="Work Experience" />
            {work_experience.filter(exp => !(exp.company === current_position.company && exp.role === current_position.role && exp.period === current_position.period)).map((exp, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <h3 className="text-md font-semibold text-[var(--editor-tab-active-foreground)]">{exp.role}</h3>
                <p className="text-sm text-[var(--text-default)]">{exp.company} <span className="text-[var(--text-muted)]">({exp.period})</span></p>
                {exp.description && (
                  <div className="mt-1 text-justify">
                    {renderFormattedDescription(exp.description)}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {education && education.length > 0 && (
          <section className="mb-4">
            <SectionTitle title="Education" />
            {education.map((edu, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <h3 className="text-md font-semibold text-[var(--editor-tab-active-foreground)]">{edu.school}</h3>
                <p className="text-sm text-[var(--text-default)]">{edu.major} <span className="text-[var(--text-muted)]">({edu.period})</span></p>
              </div>
            ))}
          </section>
        )}

        {skills && skills.length > 0 && (
          <section className="mb-4">
            <SectionTitle title="Skills" />
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Pill key={index} text={skill} />
              ))}
            </div>
          </section>
        )}
        
        {(instagram || tiktok || otherSocial) && (
            <section>
                <SectionTitle title="Other Links" />
                <div className="flex flex-col space-y-1">
                    {instagram && <ContactItem icon={ICONS.Instagram} label="Instagram" value={instagram.split('/').pop() || instagram} href={instagram} />}
                    {tiktok && <ContactItem icon={ICONS.Tiktok} label="TikTok" value={tiktok.split('/').pop() || tiktok} href={tiktok} />}
                    {otherSocial && <ContactItem icon={ICONS.GitFork} label={otherSocial.name} value={otherSocial.url.replace(/^https?:\/\//, '')} href={otherSocial.url} />}
                </div>
            </section>
        )}
      </div>
    </div>
  );
};

export default CVPreview;
    