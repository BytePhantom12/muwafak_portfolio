import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { HiArrowDownTray, HiCog6Tooth } from 'react-icons/hi2';
import { usePortfolioData } from '../context/usePortfolioData';
import { getDownloadUrl } from '../services/api';

const navLinks = [
  { label: 'Home', to: 'home' },
  { label: 'About', to: 'about' },
  { label: 'Skills', to: 'skills' },
  { label: 'Projects', to: 'projects' },
  { label: 'Experience', to: 'journey' },
  { label: 'Contact', to: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { portfolioData } = usePortfolioData();
  const [firstName = ''] = portfolioData.name.trim().split(/\s+/);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const closeOnEscape = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-[#F8FAFC]/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.05)]'
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
              className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden md:flex-none"
            >
              <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#E2E8F0] flex items-center justify-center shadow-[0_0_15px_rgba(37, 99, 235,0.25)]">
                <span className="text-white font-bold text-sm font-display">{firstName.charAt(0)}</span>
              </div>
              <span className="truncate text-[#0F172A] font-display font-extrabold text-lg sm:text-xl lg:text-2xl">
                <span className="font-extrabold text-[#0F172A]">{firstName}</span>
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
                className="p-2.5 rounded-xl glass-card text-[#64748B] hover:text-[#2563EB] hover:border-[#2563EB]/30 hover:shadow-[0_0_15px_rgba(37, 99, 235,0.1)] transition-all duration-300"
                title="Admin Panel"
              >
                <HiCog6Tooth className="w-4 h-4" />
              </RouterLink>
              {portfolioData.cvUrl && <a
                href={getDownloadUrl(portfolioData.cvUrl) || '#'}
                download="Muwafak-Abubakar-CV.pdf"
                id="nav-download-cv"
                className="btn-primary text-sm py-2.5 px-5"
              >
                <HiArrowDownTray className="w-4 h-4" />
                Download CV
              </a>}
            </motion.div>

            {/* Hamburger */}
            <button
              id="mobile-menu-toggle"
              className="touch-target md:hidden flex shrink-0 items-center justify-center rounded-xl glass-card text-[#64748B] hover:text-[#0F172A] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <HiX className="w-5 h-5" /> : <HiMenuAlt3 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            id="mobile-navigation"
            className="fixed inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-[#E2E8F0] bg-[#F8FAFC]/98 shadow-lg backdrop-blur-xl md:hidden"
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
                    className="block py-3 px-4 rounded-xl nav-link text-base hover:bg-[#F8FAFC] cursor-pointer"
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
                className="pt-2 border-t border-[#E2E8F0]/20 space-y-3"
              >
                <RouterLink
                  to="/admin"
                  className="btn-outline w-full justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <HiCog6Tooth className="w-4 h-4" />
                  Admin Panel
                </RouterLink>
                {portfolioData.cvUrl && <a href={getDownloadUrl(portfolioData.cvUrl) || '#'} download="Muwafak-Abubakar-CV.pdf" id="mobile-download-cv" className="btn-primary w-full justify-center">
                  <HiArrowDownTray className="w-4 h-4" />
                  Download CV
                </a>}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
