import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useMemo, useRef, useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { HiArrowTopRightOnSquare, HiChartBarSquare, HiServerStack, HiSquares2X2 } from 'react-icons/hi2';
import { usePortfolioData } from '../context/usePortfolioData';
import { PROJECT_CATEGORIES } from '../utils/projectCategory';
import { resolveBackendUrl } from '../services/api';

const FILTERS = ['All', ...PROJECT_CATEGORIES];

// Data Analytics and Backend carry the primary accent colors; Full Stack is intentionally muted.
const CATEGORY_STYLES = {
  'Data Analytics': '#f59e0b',
  Backend: '#2563EB',
  'Full Stack': '#64748B',
};

// Used for the no-image placeholder so a missing screenshot still reads as intentional.
const CATEGORY_ICONS = {
  'Data Analytics': HiChartBarSquare,
  Backend: HiServerStack,
  'Full Stack': HiSquares2X2,
};

// Featured work leads, then Data Analytics/Backend surface before Full Stack — no invented rankings.
const CATEGORY_SORT_WEIGHT = { 'Data Analytics': 0, Backend: 0, 'Full Stack': 1 };

const HIGHLIGHT_LIMIT = 1;
const TAG_LIMIT = 3;

// Metrics (numbers/percentages) read best to recruiters, so surface those features first.
const getHighlights = (features = []) => {
  const withMetric = features.filter((f) => /\d/.test(f));
  const withoutMetric = features.filter((f) => !/\d/.test(f));
  return [...withMetric, ...withoutMetric].slice(0, HIGHLIGHT_LIMIT);
};

// Helper function to get image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const url = typeof imagePath === 'object' ? (imagePath.secure_url || imagePath.url || imagePath.secureUrl) : imagePath;
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) {
    return resolveBackendUrl(url);
  }
  return url;
};

function ProjectSlideshow({ images, title, hovered }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds rotation

    return () => clearInterval(timer);
  }, [images.length]);

  const currentImageUrl = getImageUrl(images[currentIndex]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={currentImageUrl}
          alt={`${title} - slide ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
          width={600}
          height={400}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: 1,
            scale: hovered ? 1.05 : 1,
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#2563EB] w-4' : 'bg-[#E2E8F0]/60'
              }`}
          />
        ))}
      </div>

      {/* Corner Markers */}
      <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-[#2563EB]/50 z-20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-[#2563EB]/50 z-20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-[#2563EB]/50 z-20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-[#2563EB]/50 z-20" />

      {/* Digital Grid Overlay */}
      <div className="absolute inset-0 bg-grid-black/[0.03] pointer-events-none" />
    </div>
  );
}

function ProjectTag({ tag, accentColor, compact = false }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center gap-1.5 rounded-lg border border-[#E2E8F0]/30 bg-[#F8FAFC] text-xs text-[#64748B]
        ${compact ? 'px-3 py-1' : 'px-3 py-1.5'}
        hover:-translate-y-0.5 transition-all duration-300 cursor-default`}
      style={{
        borderColor: isHovered ? `${accentColor}40` : '',
        color: isHovered ? accentColor : '',
        backgroundColor: isHovered ? `${accentColor}15` : '',
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: accentColor, boxShadow: isHovered ? `0 0 8px ${accentColor}` : '' }} />
      {tag}
    </span>
  );
}

function ProjectCategoryBadge({ category }) {
  const color = CATEGORY_STYLES[category] || CATEGORY_STYLES['Full Stack'];
  return (
    <span
      className="mb-2 inline-flex w-fit items-center rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
      style={{ color, backgroundColor: `${color}17`, border: `1px solid ${color}40` }}
    >
      {category}
    </span>
  );
}

function ProjectImagePlaceholder({ category }) {
  const color = CATEGORY_STYLES[category] || CATEGORY_STYLES['Full Stack'];
  const Icon = CATEGORY_ICONS[category] || HiSquares2X2;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]">
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${color}17`, border: `1px solid ${color}40` }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <span className="relative z-10 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
        {category}
      </span>
    </div>
  );
}

function ProjectTitle({ title, accentColor }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <h3
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-lg font-bold font-display leading-snug text-[#0F172A] mb-2 transition-colors duration-300 cursor-default"
      style={{ color: isHovered ? accentColor : '#0F172A' }}
    >
      {title}
    </h3>
  );
}

function ProjectLinks({ project, compact = false }) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? '' : 'mt-6'}`}>
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-outline px-3 ${compact ? 'py-2 text-sm' : ''}`}
        >
          <FaGithub className="h-4 w-4" />
          GitHub
        </a>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-primary px-3 ${compact ? 'py-2 text-sm' : ''}`}
        >
          <HiArrowTopRightOnSquare className="h-4 w-4" />
          Live Project
        </a>
      )}
    </div>
  );
}

function ProjectMedia({ project, hovered = false, modal = false }) {
  const imageSrc = project.image
    ? getImageUrl(project.image)
    : (Array.isArray(project.images) && project.images.length > 0 ? getImageUrl(project.images[0]) : null);
  const imageClassName = `w-full object-cover object-top ${modal ? 'max-h-[22rem]' : 'h-full'}`;

  if (Array.isArray(project.images) && project.images.length > 0 && !modal) {
    return <ProjectSlideshow images={project.images} title={project.title} hovered={hovered} />;
  }

  if (imageSrc) {
    return <img src={imageSrc} alt={project.title} className={imageClassName} loading={modal ? 'eager' : 'lazy'} decoding="async" />;
  }

  return <ProjectImagePlaceholder category={project.category} />;
}

function ProjectModal({ project, onClose }) {
  const closeButtonRef = useRef(null);
  const allTags = useMemo(
    () => (project.tags ? project.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : []),
    [project.tags]
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/70 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 sm:px-7">
          <div className="min-w-0 pr-4">
            <ProjectCategoryBadge category={project.category} />
            <h2 id="project-modal-title" className="text-xl font-bold leading-tight text-[#0F172A] sm:text-2xl">
              {project.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-2xl text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#0F172A]"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-[#F8FAFC]">
            <ProjectMedia project={project} modal />
            {project.isFeatured && (
              <span className="absolute right-3 top-3 rounded-full border border-[#E2E8F0] bg-white/90 px-2.5 py-1 text-[10px] font-medium text-[#64748B]">
                Featured
              </span>
            )}
          </div>

          <p className="whitespace-pre-line text-sm leading-7 text-[#475569]">{project.description}</p>

          {project.features?.length > 0 && (
            <div className="mt-7">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0F172A]">Highlights</h3>
              <ul className="space-y-2 text-sm leading-6 text-[#475569]">
                {project.features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-[#2563EB]">&#8226;</span>{feature}</li>)}
              </ul>
            </div>
          )}

          {allTags.length > 0 && (
            <div className="mt-7">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0F172A]">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => <ProjectTag key={tag} tag={tag} accentColor={project.accentColor} />)}
              </div>
            </div>
          )}
          <ProjectLinks project={project} />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onReadMore }) {
  const [hovered, setHovered] = useState(false);
  const highlights = useMemo(() => getHighlights(project.features), [project.features]);
  const allTags = useMemo(
    () => (project.tags ? project.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : []),
    [project.tags]
  );
  const visibleTags = allTags.slice(0, TAG_LIMIT);
  const hiddenTagCount = allTags.length - visibleTags.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      className="project-card glass-card rounded-2xl overflow-hidden group cursor-default flex flex-col h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      id={`project-card-${project.id}`}
    >
      {/* Project visual */}
      <div className="relative aspect-[16/9] w-full overflow-hidden shrink-0 bg-[#F8FAFC]">
        <ProjectMedia project={project} hovered={hovered} />

        {/* Featured badge */}
        {project.isFeatured && (
          <div className="absolute top-3 right-3 z-30">
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/85 text-[#64748B] border border-[#E2E8F0] backdrop-blur-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <ProjectCategoryBadge category={project.category} />
        <ProjectTitle title={project.title} accentColor={project.accentColor} />
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#64748B]">
          {project.description}
        </p>

        {highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {highlights.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-[#334155] leading-relaxed">
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: project.accentColor }}
                  aria-hidden="true"
                />
                <span className="line-clamp-2">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="relative z-10 mt-3 flex flex-wrap gap-2 pointer-events-auto">
          {visibleTags.map((tag) => (
            <ProjectTag key={tag} tag={tag} accentColor={project.accentColor} compact />
          ))}
          {hiddenTagCount > 0 && (
            <span
              className="flex items-center rounded-lg border border-dashed border-[#E2E8F0] px-3 py-1 text-xs text-[#94A3B8] cursor-default"
              title={allTags.slice(TAG_LIMIT).join(', ')}
            >
              +{hiddenTagCount} more
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => onReadMore(project)} className="btn-primary px-4 py-2 text-sm">Read More</button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const _isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, loading } = usePortfolioData();
  const githubUrl = portfolioData.socials.find((social) => social.icon === 'FaGithub')?.href;
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const sortedProjects = useMemo(() => {
    return [...portfolioData.projects].sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return (CATEGORY_SORT_WEIGHT[a.category] ?? 1) - (CATEGORY_SORT_WEIGHT[b.category] ?? 1);
    });
  }, [portfolioData.projects]);

  const visibleProjects = activeFilter === 'All'
    ? sortedProjects
    : sortedProjects.filter((project) => project.category === activeFilter);

  if (loading) {
    return (
      <section id="projects" className="py-24 md:py-32 relative overflow-hidden">
        <div className="container-custom flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#64748B]">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-space relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9]" />
      <div className="blob w-[500px] h-[500px] bg-[#2563EB] top-1/2 right-0 opacity-[0.05] -translate-y-1/2" />
      <div className="blob w-[400px] h-[400px] bg-[#E2E8F0] bottom-0 left-1/4 opacity-[0.08]" />

      <div className="container-custom relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="mb-10 text-left sm:mb-14 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="section-title">
            My <span className="text-gradient">Projects</span>
          </h2>
          <p className="section-subtitle mx-0">
            A selection of my Data Analytics and Backend work, alongside full-stack builds
          </p>
        </motion.div>

        {/* Category Filters */}
        <div role="group" aria-label="Filter projects by category" className="mb-8 flex flex-wrap gap-2 sm:mb-10">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${isActive
                    ? 'border-[#2563EB] bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)]'
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#2563EB]/40 hover:text-[#2563EB]'
                  }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onReadMore={setSelectedProject} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-[#64748B]">No projects in this category yet.</p>
        )}

        {/* View More CTA */}
        {githubUrl && <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors text-sm font-medium"
          >
            <FaGithub className="w-5 h-5" />
            View more on GitHub
          </a>
        </motion.div>}
      </div>
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
}
