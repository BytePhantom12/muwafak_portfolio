import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { TypeAnimation } from 'react-type-animation';
import { useEffect, useState } from 'react';
import { HiArrowDownTray, HiEnvelope } from 'react-icons/hi2';
import { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { usePortfolioData } from '../context/PortfolioContext';
import profileImage from '../assets/favicon/android-chrome-192x192.png';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const iconMap = {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
};

// Counter namespace — unique to this portfolio
const COUNTER_NS = 'muhib-nabil-portfolio';
const COUNTER_KEY = 'visitors';

function useVisitorCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    // Only count once per browser session so page refreshes don't spam the counter
    const alreadyCounted = sessionStorage.getItem('visit_counted');

    const fetchAndIncrement = async () => {
      try {
        const endpoint = alreadyCounted
          ? `https://api.counterapi.dev/v1/${COUNTER_NS}/${COUNTER_KEY}`
          : `https://api.counterapi.dev/v1/${COUNTER_NS}/${COUNTER_KEY}/up`;

        const res = await fetch(endpoint);
        const data = await res.json();
        setCount(data.count ?? data.value ?? null);

        if (!alreadyCounted) sessionStorage.setItem('visit_counted', 'true');
      } catch {
        // Silently fail — don't break the page if the counter API is down
      }
    };

    fetchAndIncrement();
  }, []);

  return count;
}

export default function Hero() {
  const { portfolioData, loading } = usePortfolioData();
  const visitorCount = useVisitorCount();

  // Use portfolioData instead of PORTFOLIO_DATA
  const typingSequence = portfolioData.typingPhrases.flatMap(p => [p, 2000]);

  const stats = [
    { value: `${portfolioData.about.yearsOfExperience}+`, label: 'Years Experience' },
    { value: `${portfolioData.about.projectsDone}+`,      label: 'Projects Completed' },
    { value: '5+',                                          label: 'Technologies' },
    { value: '100%',                                        label: 'Dedication' },
    { value: visitorCount !== null ? visitorCount.toLocaleString() : '...', label: '👁️ Portfolio Views' },
  ];

  if (loading) {
    return (
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading portfolio...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background layer */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="blob w-[500px] h-[500px] bg-[#00d4ff] top-[-100px] right-[-100px]" />
        <div className="blob w-[600px] h-[600px] bg-[#7c3aed] bottom-[-150px] left-[-150px]" />
        <div className="blob w-[300px] h-[300px] bg-[#00d4ff] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" />
      </div>

      <div className="container-custom relative z-10 pt-24 pb-16 md:pt-32">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="section-badge">👋 Welcome to my portfolio</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold font-display leading-tight mb-4"
            >
              Hello, I'm{'  '}
              <span className="text-gradient block sm:inline">{portfolioData.name}</span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-slate-300 mb-6 h-10"
            >
              I'm a{' '}
              <TypeAnimation
                sequence={typingSequence}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-gradient"
              />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
            >
              {portfolioData.heroDescription}
            </motion.p>

            {/* Social Icons */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 justify-center lg:justify-start mb-8"
            >
              {portfolioData.socials.map(({ id, label, href, icon }) => {
                const Icon = iconMap[icon];
                return (
                  <a
                    key={id}
                    id={`hero-social-${id}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 flex items-center justify-center rounded-xl glass-card text-slate-400
                      hover:text-[#00d4ff] hover:border-[#00d4ff]/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]
                      transition-all duration-300 group"
                  >
                    {Icon && <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />}
                  </a>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link to="contact" smooth={true} duration={600} offset={-80}>
                <button id="hero-hire-me" className="btn-primary">
                  <HiEnvelope className="w-4 h-4" />
                  Hire Me
                </button>
              </Link>
              <a 
                href={portfolioData.cvUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${portfolioData.cvUrl}` : '#'} 
                download 
                id="hero-download-cv" 
                className="btn-outline"
                onClick={(e) => {
                  if (!portfolioData.cvUrl) {
                    e.preventDefault();
                    alert('CV not available');
                  }
                }}
              >
                <HiArrowDownTray className="w-4 h-4" />
                Download CV
              </a>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            className="flex-shrink-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="relative animate-float">
              <div className="absolute inset-[-16px] rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#7c3aed]/20 blur-xl animate-pulse-slow" />
              <div className="profile-ring" style={{ width: 280, height: 280 }}>
                <img
                  src={profileImage}
                  alt="Muwafak – Full Stack Developer"
                  className="w-full h-full rounded-full object-cover object-top"
                  style={{ width: '272px', height: '272px' }}
                />
              </div>
              <div className="absolute inset-[-8px] rounded-full border border-[#00d4ff]/20 animate-spin-slow" />
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2
                  bg-[#111118] border border-white/[0.08] rounded-full px-4 py-2 shadow-card whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-medium">Available for work</span>
              </motion.div>

              {/* Orbiting skill badges */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden sm:flex">
                <motion.div
                  className="relative w-[380px] h-[380px] rounded-full border border-white/[0.05]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                      className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 bg-[#111118]/80 backdrop-blur-md border-[#61dafb]/20"
                    >
                      <span className="text-base">⚛️</span>
                      <span className="text-xs text-slate-200 font-semibold tracking-wide">React</span>
                    </motion.div>
                  </div>
                  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                      className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 bg-[#111118]/80 backdrop-blur-md border-[#06b6d4]/20"
                    >
                      <span className="text-base">🎨</span>
                      <span className="text-xs text-slate-200 font-semibold tracking-wide">Tailwind</span>
                    </motion.div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                      className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 bg-[#111118]/80 backdrop-blur-md border-white/20"
                    >
                      <span className="text-base">⚡</span>
                      <span className="text-xs text-slate-200 font-semibold tracking-wide">Next.js</span>
                    </motion.div>
                  </div>
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                      className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 bg-[#111118]/80 backdrop-blur-md border-[#3178c6]/20"
                    >
                      <span className="text-base">📘</span>
                      <span className="text-xs text-slate-200 font-semibold tracking-wide">TypeScript</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          className="mt-4 md:mt-5 relative w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* Cyberpunk / High-Tech HUD Container */}
          <div className="relative rounded-2xl bg-[#09090b] border border-white/5 overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            
            {/* Tech Grid Background Animation */}
            <div 
              className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700"
              style={{
                backgroundImage: 'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                backgroundPosition: 'center center'
              }}
            />

            {/* Animated Data Streams (Vertical & Horizontal scanning lines) */}
            <motion.div
              className="absolute w-full h-[1px] shadow-[0_0_15px_#00d4ff]"
              style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }}
              animate={{ top: ['-10%', '110%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute h-full w-[1px] shadow-[0_0_15px_#7c3aed]"
              style={{ background: 'linear-gradient(180deg, transparent, #7c3aed, transparent)' }}
              animate={{ left: ['-10%', '110%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1.5 }}
            />

            {/* Corner HUD Markers */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00d4ff] rounded-tl-xl opacity-70" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#7c3aed] rounded-tr-xl opacity-70" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#7c3aed] rounded-bl-xl opacity-70" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00d4ff] rounded-br-xl opacity-70" />

            {/* Content Container */}
            <div className="relative z-10 w-full backdrop-blur-sm">
              <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-[#00d4ff]/10">
                {stats.map(({ value, label }, i) => (
                  <motion.div
                    key={label}
                    className="flex flex-col items-center justify-center py-6 px-4 gap-1.5
                      hover:bg-[#00d4ff]/[0.02] transition-colors duration-300 relative group/stat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    {/* Hover tech overlay on individual stat */}
                    <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-between p-2">
                       <div className="w-1.5 h-1.5 bg-[#00d4ff]/40 rounded-sm" />
                       <div className="w-1.5 h-1.5 bg-[#7c3aed]/40 rounded-sm" />
                    </div>

                    <span className="text-3xl md:text-4xl font-bold font-display text-gradient drop-shadow-[0_0_12px_rgba(0,212,255,0.2)]">
                      {value}
                    </span>
                    <span className="text-[11px] md:text-xs text-slate-400 text-center font-semibold tracking-wider uppercase">
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs text-slate-500">Scroll down</span>
        <div className="w-5 h-9 border border-white/20 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-[#00d4ff] rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
