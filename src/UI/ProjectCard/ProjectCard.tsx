
import React, { useState } from 'react';
import { ICONS } from '../../App/constants';

interface ProjectCardProps {
  projectId: string;
  projectTitle: string;
  imageUrls?: string[];
  technologies?: string[]; 
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ projectId, projectTitle, imageUrls, technologies, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasMultipleImages = imageUrls && imageUrls.length > 1;
  const displayImages = imageUrls && imageUrls.length > 0 ? imageUrls : [];

  const hash = projectId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageHue = hash % 360;
  const placeholderImage = `https://picsum.photos/seed/${projectId.replace(/[^a-zA-Z0-9]/g, '')}/400/200?hue=${imageHue}`;

  const currentDisplayImage = displayImages.length > 0 ? displayImages[currentImageIndex] : placeholderImage;

  const FileIcon = ICONS.default;
  const ArrowIcon = ICONS.arrow_right_icon;
  const PrevIcon = ICONS.arrow_left_icon;
  const NextIcon = ICONS.arrow_right_icon;

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div
      onClick={onClick}
      className="bg-[var(--sidebar-background)] rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 border border-[var(--border-color)] hover:border-[var(--focus-border)] group/card flex flex-col"
    >
      <div className="relative w-full h-40 flex-shrink-0">
        <img
          src={currentDisplayImage}
          alt={`Cover for ${projectTitle} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = placeholderImage)}
        />
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-1 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-0 group-hover/card:opacity-100 hover:bg-black/60 transition-opacity focus:outline-none focus:ring-1 focus:ring-white"
              aria-label="Previous image"
            >
              <PrevIcon size={18} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-0 group-hover/card:opacity-100 hover:bg-black/60 transition-opacity focus:outline-none focus:ring-1 focus:ring-white"
              aria-label="Next image"
            >
              <NextIcon size={18} />
            </button>
            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          {FileIcon && <FileIcon size={18} className="text-[var(--text-accent)] mr-2 flex-shrink-0" />}
          <h3 className="text-md font-semibold text-[var(--link-foreground)] truncate" title={projectTitle}>
            {projectTitle}
          </h3>
        </div>

        {technologies && technologies.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="text-[0.65rem] bg-[var(--editor-tab-inactive-background)] text-[var(--text-muted)] px-1.5 py-0.5 rounded-sm border border-[var(--border-color)]"
                title={tech}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <p className="text-xs text-[var(--text-muted)] mb-3 mt-auto flex-grow"> {/* mt-auto pushes Open Details down */}
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

// No default export, ProjectCard is a named export.
// export default ProjectCard; 
// Already correctly exported as: export const ProjectCard
