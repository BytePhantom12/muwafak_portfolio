import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { useEffect, useState } from 'react';
import { HiArrowDownTray, HiChartBar, HiEnvelope } from 'react-icons/hi2';
import { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { SiFastapi, SiMysql, SiReact } from 'react-icons/si';
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

const iconMap = {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
};

const orbitSkills = [
  { name: 'React', Icon: SiReact, color: '#149ECA', position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
  { name: 'FastAPI', Icon: SiFastapi, color: '#009688', position: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2' },
  { name: 'MySQL', Icon: SiMysql, color: '#4479A1', position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
  { name: 'Matplotlib', Icon: HiChartBar, color: '#11557C', position: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2' },
];

function RotatingRole({ phrases, role }) {
  const availablePhrases = phrases.length > 0 ? phrases : [role].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    if (availablePhrases.length < 2) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % availablePhrases.length);
    }, 2600);
    return () => window.clearInterval(intervalId);
  }, [availablePhrases.length]);

  return (
    <motion.span
      key={`${activeIndex}-${availablePhrases[activeIndex]}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="inline-block text-gradient"
    >
      {availablePhrases[activeIndex]}
    </motion.span>
  );
}

// Counter namespace — unique to this portfolio
const COUNTER_NS = 'muwafak-portfolio';
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
  const _visitorCount = useVisitorCount();
  const profileImgRaw = portfolioData.profile?.profileImage;
  const profileImage = (typeof profileImgRaw === 'object' ? profileImgRaw?.secure_url || profileImgRaw?.url : profileImgRaw) || '/profile.png';

  const stats = [
    { value: `${portfolioData.about.yearsOfExperience}+`, label: 'Years Experience' },
    { value: `${portfolioData.projects.length}`, label: 'Projects Completed' },
    { value: '5+', label: 'Technologies' },
    { value: '100%', label: 'Dedication' },
  ];

  if (loading) {
    return (
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#185FA5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#626058]">Loading portfolio...</p>
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
      <div className="absolute inset-0 bg-[#E8E6DE]">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="blob w-[500px] h-[500px] bg-[#185FA5] top-[-100px] right-[-100px] opacity-[0.07]" />
        <div className="blob w-[600px] h-[600px] bg-[#C2C0B8] bottom-[-150px] left-[-150px] opacity-[0.15]" />
        <div className="blob w-[300px] h-[300px] bg-[#185FA5] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" />
      </div>

      <div className="container-custom relative z-10 pb-12 pt-24 sm:pb-16 md:pt-28">
        <div className="flex flex-col-reverse items-center gap-10 lg:flex-row lg:gap-16 xl:gap-20">
          {/* Text Content */}
          <motion.div
            className="w-full min-w-0 flex-1 overflow-hidden text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* <motion.div variants={itemVariants}>
              <span className="section-badge">👋 Welcome to my portfolio</span>
            </motion.div> */}


            <motion.h1 variants={itemVariants} className="mb-3 break-words font-display text-[clamp(2rem,10vw,4.5rem)] font-extrabold leading-[0.98] tracking-tight text-[#1C1B19]">
              {portfolioData.name}
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="mb-5 min-h-14 max-w-full break-words font-display text-lg font-semibold text-[#1C1B19] sm:text-2xl md:text-3xl [&_span]:whitespace-normal"
            >
              I'm a{' '}
              <RotatingRole phrases={portfolioData.typingPhrases} role={portfolioData.role} />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-[#626058] text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
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
                    className="w-10 h-10 flex items-center justify-center rounded-xl glass-card text-[#626058]
                      hover:text-[#185FA5] hover:border-[#185FA5]/30 hover:shadow-[0_0_15px_rgba(24,95,165,0.2)]
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
              className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4 justify-center lg:justify-start [&>*]:w-full sm:[&>*]:w-auto"
            >
              <Link to="contact" smooth={true} duration={600} offset={-80}>
                <button id="hero-hire-me" className="btn-primary w-full sm:w-auto">
                  <HiEnvelope className="w-4 h-4" />
                  Hire Me
                </button>
              </Link>
              {portfolioData.cvUrl && <a
                href={getDownloadUrl(portfolioData.cvUrl) || '#'}
                download="Muwafak-Abubakar-CV.pdf"
                id="hero-download-cv"
                className="btn-outline w-full sm:w-auto"
              >
                <HiArrowDownTray className="w-4 h-4" />
                Download CV
              </a>}
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
              <div className="absolute inset-[-16px] rounded-full bg-gradient-to-br from-[#185FA5]/20 to-[#C2C0B8]/20 blur-xl animate-pulse-slow" />
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
                  bg-[#DDDBD3] border border-[#C2C0B8]/30 rounded-full px-4 py-2 shadow-card whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-[#626058] font-medium">{portfolioData.profile.availability}</span>
              </motion.div>
              }

              <div className="pointer-events-none absolute inset-0 hidden items-center justify-center xl:flex" aria-hidden="true">
                <motion.div
                  className="relative h-[360px] w-[360px] rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                >
                  {orbitSkills.map(({ name, Icon, color, position }) => (
                    <div key={name} className={`absolute ${position}`}>
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                        className="glass-card flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#DDDBD3]/90 px-3 py-2 shadow-card backdrop-blur-md"
                      >
                        <Icon className="h-4 w-4" style={{ color }} />
                        <span className="text-xs font-semibold tracking-wide text-[#1C1B19]">{name}</span>
                      </motion.div>
                    </div>
                  ))}
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
          <div className="relative rounded-2xl bg-[#DDDBD3] border border-[#C2C0B8]/30 overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.08)]">

            {/* Tech Grid Background Animation */}
            <div
              className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700"
              style={{
                backgroundImage: 'linear-gradient(#185FA5 1px, transparent 1px), linear-gradient(90deg, #185FA5 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                backgroundPosition: 'center center'
              }}
            />

            {/* Corner HUD Markers */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#185FA5] rounded-tl-xl opacity-70" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C2C0B8] rounded-tr-xl opacity-70" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C2C0B8] rounded-bl-xl opacity-70" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#185FA5] rounded-br-xl opacity-70" />

            {/* Content Container */}
            <div className="relative z-10 w-full backdrop-blur-sm">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#185FA5]/10">
                {stats.map(({ value, label }, i) => (
                  <motion.div
                    key={label}
                    className="flex flex-col items-center justify-center py-6 px-4 gap-1.5
                      hover:bg-[#185FA5]/[0.03] transition-colors duration-300 relative group/stat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    {/* Hover tech overlay on individual stat */}
                    <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-between p-2">
                      <div className="w-1.5 h-1.5 bg-[#185FA5]/40 rounded-sm" />
                      <div className="w-1.5 h-1.5 bg-[#C2C0B8]/40 rounded-sm" />
                    </div>

                    <span className="text-3xl md:text-4xl font-bold font-display text-gradient drop-shadow-[0_0_12px_rgba(24,95,165,0.2)]">
                      {value}
                    </span>
                    <span className="text-[11px] md:text-xs text-[#626058] text-center font-semibold tracking-wider uppercase">
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
        <span className="text-xs text-[#626058]">Scroll down</span>
        <div className="w-5 h-9 border border-[#C2C0B8]/40 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-[#185FA5] rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
