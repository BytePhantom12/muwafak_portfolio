import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiCheckBadge } from 'react-icons/hi2';
import { Link } from 'react-scroll';
import { usePortfolioData } from '../context/PortfolioContext';


export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { portfolioData, loading } = usePortfolioData();
  const { about } = portfolioData;

  const facts = [
    { emoji: '📍', label: 'Location',  value: about.location  },
    { emoji: '💼', label: 'Role',      value: about.role      },
    { emoji: '🎓', label: 'Education', value: about.education },
    { emoji: '🌍', label: 'Languages', value: about.languages },
  ];

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8E6DE] via-[#DDDBD3] to-[#E8E6DE]" />
      <div className="blob w-[400px] h-[400px] bg-[#C2C0B8] top-0 right-0 opacity-[0.1]" />

      <div className="container-custom relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="section-subtitle">
            A passionate developer who transforms ideas into exceptional digital experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text & Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col items-start text-left"
          >
            <h3 className="text-2xl md:text-3xl font-bold font-display text-[#1C1B19] mb-4">
              {about.introHeading}{' '}
              &amp;{' '}
              <span className="text-gradient">{about.introHeadingHighlight}</span>
            </h3>

            <p className="text-[#626058] leading-relaxed mb-6">
              {about.introDescription}
            </p>

            {/* Highlights */}
            <div className="space-y-3 mb-8">
              {about.highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <HiCheckBadge className="w-5 h-5 text-[#185FA5] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1C1B19] text-sm">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 w-full">
              {facts.map(({ emoji, label, value }) => (
                <div key={label} className="glass-card p-4 rounded-xl flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <span className="text-[10px] text-[#626058] uppercase tracking-wider block">{label}</span>
                    <span className="text-sm text-[#1C1B19] font-medium">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 flex-wrap">
              <Link to="contact" smooth={true} duration={600} offset={-80}>
                <button id="about-hire-btn" className="btn-primary">Let's Work Together</button>
              </Link>
              <Link to="projects" smooth={true} duration={600} offset={-80}>
                <button id="about-projects-btn" className="btn-outline">View Projects</button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Image Side */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              
              {/* Main Image Container with Spinning Tech Border */}
              <div className="relative w-[300px] sm:w-[360px] rounded-3xl p-[2px] overflow-hidden group shadow-[0_0_40px_rgba(24,95,165,0.15)] bg-[#E8E6DE]">
                
                {/* Techno Spinning Laser Background */}
                <motion.div 
                  className="absolute left-[-50%] top-[-50%] w-[200%] h-[200%]"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 60%, rgba(24, 95, 165, 0.8) 80%, rgba(194, 192, 184, 1) 100%)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Inner Image Mask */}
                <div className="relative rounded-[calc(1.5rem-2px)] overflow-hidden bg-[#DDDBD3] h-full w-full z-10">
                   <img
                    src="/profile.png"
                    alt="Muwafak Abubakar – About"
                    className="w-full h-auto object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    style={{ minHeight: '400px', objectPosition: 'top center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#E8E6DE]/80 via-[#E8E6DE]/20 to-transparent pointer-events-none" />
                  
                  {/* Digital Scanline Overlay */}
                  <motion.div 
                    className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#185FA5]/40 to-transparent blur-[1px] pointer-events-none"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>

              {/* Floating card - Experience */}
              <motion.div
                className="absolute -bottom-6 -right-6 glass-card px-5 py-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] z-20 border border-[#C2C0B8]/30"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                <span className="text-2xl font-bold font-display text-gradient block">{about.yearsOfExperience}+</span>
                <span className="text-xs text-[#626058]">Year of Experience</span>
              </motion.div>

              {/* Floating card - Projects */}
              <motion.div
                className="absolute -top-6 -left-6 glass-card px-5 py-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.1)] z-20 border border-[#C2C0B8]/30"
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
              >
                <span className="text-2xl font-bold font-display text-gradient block">{portfolioData.projects.length}</span>
                <span className="text-xs text-[#626058]">Projects Done</span>
              </motion.div>

              {/* Outer Techno Pulsing Frames (Softened and Elegant) */}
              
              {/* Inner frame - Glowing Pulse */}
              <div className="absolute inset-[-20px] pointer-events-none -z-10">
                <svg className="w-full h-full overflow-visible">
                  <motion.rect
                    x="0" y="0" width="100%" height="100%" rx="36"
                    fill="none"
                    stroke="#185FA5"
                    strokeWidth="1"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(24,95,165,0.3))' }}
                  />
                </svg>
              </div>

              {/* Outer frame - Cyber Flowing Data Track */}
              <div className="absolute inset-[-40px] pointer-events-none -z-10">
                <svg className="w-full h-full overflow-visible">
                  <motion.rect
                    x="0" y="0" width="100%" height="100%" rx="48"
                    fill="none"
                    stroke="#C2C0B8"
                    strokeWidth="1.5"
                    strokeDasharray="20 40"
                    strokeLinecap="round"
                    animate={{ strokeDashoffset: [0, -360] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="opacity-30"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(194,192,184,0.3))' }}
                  />
                </svg>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
