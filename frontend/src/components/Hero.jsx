import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { useEffect, useState } from 'react';
import { HiArrowDownTray, HiArrowRight } from 'react-icons/hi2';
import { FaGithub, FaPython, FaDatabase } from 'react-icons/fa';
import { SiDjango, SiFastapi, SiReact, SiTailwindcss } from 'react-icons/si';
import { usePortfolioData } from '../context/usePortfolioData';
import { getDownloadUrl } from '../services/api';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const FALLBACK_HERO_TITLE = 'Data Analyst & Backend Developer';
const FALLBACK_HERO_DESCRIPTION = 'I turn data into actionable insights and build reliable backend systems and full-stack applications.';

const FALLBACK_CAPABILITY_PHRASES = [
  'Building with Python & SQL',
  'Building with Django & FastAPI',
  'Building with React & Tailwind CSS',
  'Skilled in Data Analysis & Visualization',
];

const TECH_STACK = [
  { name: 'Python', Icon: FaPython, color: '#2563EB' },
  { name: 'SQL', Icon: FaDatabase, color: '#64748B' },
  { name: 'Django', Icon: SiDjango, color: '#0F172A' },
  { name: 'FastAPI', Icon: SiFastapi, color: '#009688' },
  { name: 'React', Icon: SiReact, color: '#149ECA' },
  { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
];

const CAPABILITIES = ['Data Analytics', 'Backend APIs', 'Full-Stack Applications'];

function RotatingRole({ phrases }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    if (phrases.length < 2) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % phrases.length);
    }, 2600);
    return () => window.clearInterval(intervalId);
  }, [phrases.length]);

  return (
    <motion.span
      key={`${activeIndex}-${phrases[activeIndex]}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="inline-block"
    >
      {phrases[activeIndex]}
    </motion.span>
  );
}

export default function Hero() {
  const { portfolioData, loading } = usePortfolioData();
  const profileImgRaw = portfolioData.profile?.profileImage;
  const profileImage = (typeof profileImgRaw === 'object' ? profileImgRaw?.secure_url || profileImgRaw?.url : profileImgRaw) || '/profile.png';
  const githubSocial = portfolioData.socials.find((social) => social.id === 'github' || social.icon === 'FaGithub');
  const heroTitle = portfolioData.role || FALLBACK_HERO_TITLE;
  const heroDescription = portfolioData.heroDescription || FALLBACK_HERO_DESCRIPTION;
  const capabilityPhrases = portfolioData.typingPhrases.length > 0 ? portfolioData.typingPhrases : FALLBACK_CAPABILITY_PHRASES;

  if (loading) {
    return (
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading portfolio...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
    >
      {/* Background layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-[#F8FAFC] to-[#F1F5F9]">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="blob w-[500px] h-[500px] bg-[#2563EB] top-[-100px] right-[-100px] opacity-[0.07]" />
        <div className="blob w-[600px] h-[600px] bg-[#E2E8F0] bottom-[-150px] left-[-150px] opacity-[0.15]" />
        <div className="blob w-[300px] h-[300px] bg-[#2563EB] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" />
      </div>

      <div className="container-custom relative z-10 pb-16 pt-24 sm:pb-20 md:pt-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
          {/* Text Content */}
          <motion.div
            className="w-full min-w-0 flex-1 overflow-hidden text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="mb-2 break-words font-display text-[clamp(1.5rem,5vw,2.25rem)] font-bold leading-tight text-[#0F172A]">
              {portfolioData.name}
            </motion.h1>

            <motion.h2 variants={itemVariants} className="mb-5 break-words font-display text-[clamp(1.75rem,6vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-gradient">
              {heroTitle}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-[#64748B] text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-4"
            >
              {heroDescription}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mb-8 min-h-6 max-w-full break-words font-display text-sm font-semibold text-[#2563EB] sm:text-base [&_span]:whitespace-normal"
            >
              <RotatingRole phrases={capabilityPhrases} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4 justify-center lg:justify-start [&>a.btn-primary]:w-full [&>a.btn-primary]:sm:w-auto"
            >
              <Link to="projects" smooth={true} duration={600} offset={-80} className="w-full sm:w-auto">
                <button id="hero-view-work" className="btn-primary w-full sm:w-auto">
                  <HiArrowRight className="w-4 h-4" />
                  View My Work
                </button>
              </Link>
              {portfolioData.cvUrl && (
                <a
                  href={getDownloadUrl(portfolioData.cvUrl) || '#'}
                  download="Muwafak-Abubakar-CV.pdf"
                  id="hero-download-cv"
                  className="btn-outline w-full sm:w-auto"
                >
                  <HiArrowDownTray className="w-4 h-4" />
                  Download CV
                </a>
              )}
              {githubSocial?.href && (
                <a
                  href={githubSocial.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-github"
                  aria-label="GitHub profile"
                  className="flex h-11 w-11 items-center justify-center rounded-xl glass-card text-[#64748B]
                    hover:text-[#2563EB] hover:border-[#2563EB]/30 transition-all duration-300"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
            </motion.div>

            {/* Capability indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              {CAPABILITIES.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#334155]"
                >
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Profile + Tech Stack */}
          <motion.div
            className="flex flex-shrink-0 flex-col items-center gap-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="relative animate-float">
              <div className="absolute inset-[-16px] rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#E2E8F0]/20 blur-xl animate-pulse-slow" />
              <div className="profile-ring h-52 w-52 sm:h-64 sm:w-64 lg:h-[280px] lg:w-[280px]">
                <img
                  src={profileImage}
                  alt={portfolioData.name ? `${portfolioData.name} profile` : 'Portfolio profile'}
                  className="w-full h-full rounded-full object-cover object-top"
                  width={280}
                  height={280}
                  onError={(event) => { event.currentTarget.src = '/profile.png'; }}
                />
              </div>
              {portfolioData.profile?.availability && <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2
                  bg-[#F8FAFC] border border-[#E2E8F0]/30 rounded-full px-4 py-2 shadow-card whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-[#64748B] font-medium">{portfolioData.profile.availability}</span>
              </motion.div>
              }
            </div>

            {/* Core stack — static, uncluttered grid */}
            <motion.div
              className="grid grid-cols-2 gap-2.5 min-[375px]:grid-cols-3 sm:gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {TECH_STACK.map(({ name, Icon, color }) => (
                <div
                  key={name}
                  title={name}
                  className="glass-card flex w-full flex-col items-center gap-1.5 rounded-xl px-2 py-3 min-[375px]:w-20 sm:w-24"
                >
                  <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
                  <span className="text-center text-[10px] font-semibold leading-tight text-[#334155]">{name}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs text-[#64748B]">Scroll down</span>
        <div className="w-5 h-9 border border-[#E2E8F0]/40 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-[#2563EB] rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
