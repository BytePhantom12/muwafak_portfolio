import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { usePortfolioData } from '../context/PortfolioContext';

// Helper function to get image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) {
    return `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${imagePath}`;
  }
  return imagePath;
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
          src={currentImageUrl || 'https://via.placeholder.com/600x400?text=Project'}
          alt={`${title} - slide ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-top"
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
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#185FA5] to-transparent opacity-50 z-10"
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
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#185FA5] w-4' : 'bg-[#C2C0B8]/60'
              }`}
          />
        ))}
      </div>

      {/* Corner Markers */}
      <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-[#185FA5]/50 z-20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-[#185FA5]/50 z-20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-[#185FA5]/50 z-20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-[#185FA5]/50 z-20" />

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
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#C2C0B8]/30 bg-[#DDDBD3] text-[#626058]
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
      className="text-lg font-bold font-display text-[#1C1B19] mb-2 transition-colors duration-300 line-clamp-1 w-fit cursor-default"
      style={{ color: isHovered ? accentColor : '#1C1B19' }}
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
      <div className="relative h-48 sm:h-52 overflow-hidden shrink-0 bg-[#DDDBD3]">
        {project.images ? (
          <ProjectSlideshow images={project.images} title={project.title} hovered={hovered} />
        ) : imageSrc ? (
          <div className="relative w-full h-full overflow-hidden">
            {/* Project Image */}
            <motion.img
              src={imageSrc}
              alt={project.title}
              className="w-full h-full object-cover object-top"
              animate={{
                scale: hovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Tech Scanning Overlay */}
            <motion.div
              className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#185FA5] to-transparent opacity-50 z-10"
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
            <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-[#185FA5]/50 z-20" />
            <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-[#185FA5]/50 z-20" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-[#185FA5]/50 z-20" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-[#185FA5]/50 z-20" />

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
              <span className="text-xl font-bold font-display text-[#1C1B19]/40 tracking-wider uppercase group-hover:text-[#1C1B19]/60 transition-colors duration-500">
                {project.title}
              </span>
            </div>
          </>
        )}

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center gap-4 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: 'rgba(232,230,222,0.92)', backdropFilter: 'blur(4px)' }}
        >
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-[#626058]
                hover:text-[#185FA5] hover:border-[#185FA5]/30 transition-all duration-200 text-sm font-medium"
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
      <div className="p-6 flex flex-col flex-1">
        <ProjectTitle title={project.title} accentColor={project.accentColor} />
        <p className="text-sm text-[#626058] leading-relaxed mb-6 flex-grow mt-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto relative z-10 pointer-events-auto">
          {project.tags && project.tags.split(',').map((tag_item) => tag_item.trim()).filter(Boolean).map((tag) => (
            <ProjectTag key={tag} tag={tag} accentColor={project.accentColor} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, loading } = usePortfolioData();

  if (loading) {
    return (
      <section id="projects" className="py-24 md:py-32 relative overflow-hidden">
        <div className="container-custom flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#185FA5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#626058]">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#DDDBD3] to-[#E8E6DE]" />
      <div className="blob w-[500px] h-[500px] bg-[#185FA5] top-1/2 right-0 opacity-[0.05] -translate-y-1/2" />
      <div className="blob w-[400px] h-[400px] bg-[#C2C0B8] bottom-0 left-1/4 opacity-[0.08]" />

      <div className="container-custom relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-left mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            My <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-[#626058] text-lg max-w-2xl">
            A selection of projects that showcase my skills and passion for building great products
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* View More CTA */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#626058] hover:text-[#1C1B19] transition-colors text-sm font-medium"
          >
            <FaGithub className="w-5 h-5" />
            View more on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
