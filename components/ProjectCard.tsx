
import React from 'react';
import { ICONS } from '../constants';


interface ProjectCardProps {
  projectId: string;
  projectTitle: string;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectId, projectTitle, onClick }) => {
  // Generate a placeholder image URL based on project ID hash for variety
  const hash = projectId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageHue = hash % 360;
  const placeholderImage = `https://picsum.photos/seed/${projectId}/400/200?hue=${imageHue}`;
  
  const FileIcon = ICONS.default; // Default to FileJson2 or similar
  const ArrowIcon = ICONS.arrow_right_icon;

  return (
    <div
      onClick={onClick}
      className="bg-[var(--sidebar-background)] rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 border border-[var(--border-color)] hover:border-[var(--focus-border)]"
    >
      <img
        src={placeholderImage}
        alt={`Placeholder for ${projectTitle}`}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center mb-2">
          {FileIcon && <FileIcon size={18} className="text-[var(--text-accent)] mr-2 flex-shrink-0" />}
          <h3 className="text-md font-semibold text-[var(--link-foreground)] truncate" title={projectTitle}>
            {projectTitle}
          </h3>
        </div>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Click to view details for this project.
        </p>
        <div className="flex items-center text-sm text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)]">
          <span>Open Details</span>
          {ArrowIcon && <ArrowIcon size={16} className="ml-1" />}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;