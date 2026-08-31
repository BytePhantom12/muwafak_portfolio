import { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-scroll';
import { usePortfolioData } from '../context/usePortfolioData';

const iconMap = { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp };

const navLinks = [
  { label: 'Home', to: 'home' },
  { label: 'About', to: 'about' },
  { label: 'Skills', to: 'skills' },
  { label: 'Projects', to: 'projects' },
  { label: 'Experience', to: 'journey' },
  { label: 'Certifications', to: 'certifications' },
  { label: 'Contact', to: 'contact' },
];

const FALLBACK_IDENTITY = 'Data Analyst & Backend Developer';

export default function Footer() {
  const year = new Date().getFullYear();
  const { portfolioData } = usePortfolioData();
  const { contact, socials } = portfolioData;
  const socialLinks = socials.filter((social) => social.href);
  const [firstName = '', ...remainingNames] = portfolioData.name.trim().split(/\s+/);

  return (
    <footer className="relative border-t border-[#E2E8F0]/20 bg-[#F8FAFC] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563EB]/50 to-transparent" />
      <div className="blob w-[400px] h-[400px] bg-[#2563EB] top-[-200px] left-1/2 -translate-x-1/2 opacity-[0.04]" />

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#E2E8F0] flex items-center justify-center shadow-[0_0_15px_rgba(37, 99, 235,0.2)]">
                <span className="text-white font-bold font-display">{firstName.charAt(0)}</span>
              </div>
              <span className="text-[#0F172A] font-display font-extrabold text-xl">
                {firstName}{remainingNames.length > 0 && ' '}
                <span className="text-gradient font-extrabold text-xl">{remainingNames.join(' ')}</span>
              </span>
            </div>
            <p className="text-[#64748B] text-sm font-medium">
              {portfolioData.role || FALLBACK_IDENTITY}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ id, label, href, icon }) => {
                const Icon = iconMap[icon];
                return (
                  <a
                    key={id}
                    id={`footer-${id}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-xl glass-card text-[#64748B]
                      hover:text-[#2563EB] hover:border-[#2563EB]/30 transition-all duration-300"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#0F172A] font-semibold font-display mb-5 text-sm tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    smooth={true}
                    duration={600}
                    offset={-80}
                    className="text-[#64748B] hover:text-[#2563EB] transition-colors duration-200 text-sm cursor-pointer
                      flex items-center gap-2 group"
                    id={`footer-nav-${link.to}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Snippet */}
          <div>
            <h4 className="text-[#0F172A] font-semibold font-display mb-5 text-sm tracking-wide">Contact</h4>
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                id="footer-email"
                className="break-all text-sm font-medium text-[#2563EB] transition-all hover:underline"
              >
                {contact.email}
              </a>
            )}
            {portfolioData.profile?.availability && <div className="mt-4">
              <div className="inline-flex items-center gap-2 text-xs text-[#64748B]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                {portfolioData.profile.availability}
              </div>
            </div>}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E2E8F0]/20 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#64748B] text-xs">
              © {year} {portfolioData.name}. All rights reserved.
            </p>
            <p className="text-[#64748B] text-xs">
              Built with React &amp; Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
