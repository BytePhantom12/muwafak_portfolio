import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { HiArrowDownTray, HiCog6Tooth } from 'react-icons/hi2';
import { usePortfolioData } from '../context/PortfolioContext';

const navLinks = [
  { label: 'Home',     to: 'home'     },
  { label: 'About',   to: 'about'   },
  { label: 'Skills',  to: 'skills'  },
  { label: 'Projects',to: 'projects'},
  { label: 'Contact', to: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { portfolioData } = usePortfolioData();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                <span className="text-white font-bold text-sm font-display">M</span>
              </div>
              <span className="text-white font-display font-bold text-lg">
                Muwafak <span className="text-gradient text-base">Portfolio</span>
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                >
                  <Link
                    to={link.to}
                    spy={true}
                    smooth={true}
                    duration={600}
                    offset={-80}
                    onSetActive={() => setActiveSection(link.to)}
                    className={`nav-link cursor-pointer ${activeSection === link.to ? 'active' : ''}`}
                    id={`nav-${link.to}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden md:flex items-center gap-3"
            >
              <RouterLink
                to="/admin"
                className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-[#00d4ff] hover:border-[#00d4ff]/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all duration-300"
                title="Admin Panel"
              >
                <HiCog6Tooth className="w-4 h-4" />
              </RouterLink>
              <a
                href={portfolioData.cvUrl}
                download
                id="nav-download-cv"
                className="btn-primary text-sm py-2.5 px-5"
              >
                <HiArrowDownTray className="w-4 h-4" />
                Download CV
              </a>
            </motion.div>

            {/* Hamburger */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl glass-card text-white/80 hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX className="w-5 h-5" /> : <HiMenuAlt3 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/[0.06] overflow-hidden"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    to={link.to}
                    spy={true}
                    smooth={true}
                    duration={600}
                    offset={-80}
                    className="block py-3 px-4 rounded-xl nav-link text-base hover:bg-white/[0.04] cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                    id={`mobile-nav-${link.to}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-2 border-t border-white/[0.06] space-y-3"
              >
                <RouterLink
                  to="/admin"
                  className="btn-outline w-full justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <HiCog6Tooth className="w-4 h-4" />
                  Admin Panel
                </RouterLink>
                <a href={portfolioData.cvUrl} download id="mobile-download-cv" className="btn-primary w-full justify-center">
                  <HiArrowDownTray className="w-4 h-4" />
                  Download CV
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
