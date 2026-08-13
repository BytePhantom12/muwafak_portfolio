import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { usePortfolioData } from '../context/usePortfolioData';
import { resolveBackendUrl } from '../services/api';

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

      {/* Tech Scanning Overlay */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#2563EB] to-transparent opacity-50 z-10"
        animate={{
          top: ["-10%", "110%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

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

function ProjectTag({ tag, accentColor }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#E2E8F0]/30 bg-[#F8FAFC] text-[#64748B]
        hover:-translate-y-0.5 transition-all duration-300 cursor-default"
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

function ProjectTitle({ title, accentColor }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <h3
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-lg font-bold font-display text-[#0F172A] mb-2 transition-colors duration-300 line-clamp-1 w-fit cursor-default"
      style={{ color: isHovered ? accentColor : '#0F172A' }}
    >
      {title}
    </h3>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const imageSrc = project.image ? getImageUrl(project.image) : null;

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
      <div className="relative h-48 sm:h-52 overflow-hidden shrink-0 bg-[#F8FAFC]">
        {Array.isArray(project.images) && project.images.length > 0 ? (
          <ProjectSlideshow images={project.images} title={project.title} hovered={hovered} />
        ) : imageSrc ? (
          <div className="relative w-full h-full overflow-hidden">
            {/* Project Image */}
            <motion.img
              src={imageSrc}
              alt={project.title}
              className="w-full h-full object-cover object-top"
              loading="lazy"
              decoding="async"
              width={600}
              height={400}
              animate={{
                scale: hovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Tech Scanning Overlay */}
            <motion.div
              className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#2563EB] to-transparent opacity-50 z-10"
              animate={{
                top: ["-10%", "110%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Corner Markers */}
            <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-[#2563EB]/50 z-20" />
            <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-[#2563EB]/50 z-20" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-[#2563EB]/50 z-20" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-[#2563EB]/50 z-20" />

            {/* Digital Grid Overlay */}
            <div className="absolute inset-0 bg-grid-black/[0.03] pointer-events-none" />
          </div>
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: `linear-gradient(135deg, ${project.gradientStart}, ${project.gradientEnd})` }}
            />
            <div className="absolute inset-0 dot-grid opacity-30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <span className="text-[10px] mb-4 opacity-30 group-hover:scale-110 transition-transform duration-500">
                {project.emoji || '🚀'}
              </span>
              <span className="text-xl font-bold font-display text-[#0F172A]/40 tracking-wider uppercase group-hover:text-[#0F172A]/60 transition-colors duration-500">
                {project.title}
              </span>
            </div>
          </>
        )}

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 z-30 hidden items-center justify-center gap-4 sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.12), rgba(15, 23, 42, 0.32))',
            backdropFilter: 'blur(1px)',
          }}
        >
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-[#64748B]
                hover:text-[#2563EB] hover:border-[#2563EB]/30 transition-all duration-200 text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub className="w-4 h-4" />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-2.5 text-sm px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <HiArrowTopRightOnSquare className="w-4 h-4 flex-shrink-0" />
              Live
            </a>
          )}
        </motion.div>

        {/* Featured badge */}
        {project.isFeatured && (
          <div className="absolute top-3 right-3 z-30">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: `${project.accentColor}20`,
                border: `1px solid ${project.accentColor}40`,
                color: project.accentColor,
              }}
            >
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ProjectTitle title={project.title} accentColor={project.accentColor} />
        <p className="text-sm text-[#64748B] leading-relaxed mb-6 flex-grow mt-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto relative z-10 pointer-events-auto">
          {project.tags && project.tags.split(',').map((tag_item) => tag_item.trim()).filter(Boolean).map((tag) => (
            <ProjectTag key={tag} tag={tag} accentColor={project.accentColor} />
          ))}
        </div>
        {(project.githubUrl || project.liveUrl) && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:hidden">
            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline px-3">Code</a>}
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary px-3">Live</a>}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const _isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, loading } = usePortfolioData();
  const githubUrl = portfolioData.socials.find((social) => social.icon === 'FaGithub')?.href;

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
            A selection of projects that showcase my skills and passion for building great products
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-5 min-[700px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {portfolioData.projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

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
    </section>
  );
}
