import { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-scroll';
import { usePortfolioData } from '../context/PortfolioContext';

const iconMap = { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp };

const navLinks = [
  { label: 'Home', to: 'home' },
  { label: 'About', to: 'about' },
  { label: 'Skills', to: 'skills' },
  { label: 'Projects', to: 'projects' },
  { label: 'Contact', to: 'contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { portfolioData } = usePortfolioData();
  const { contact, socials } = portfolioData;

  return (
    <footer className="relative border-t border-[#C2C0B8]/20 bg-[#DDDBD3] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#185FA5]/50 to-transparent" />
      <div className="blob w-[400px] h-[400px] bg-[#185FA5] top-[-200px] left-1/2 -translate-x-1/2 opacity-[0.04]" />

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#185FA5] to-[#C2C0B8] flex items-center justify-center shadow-[0_0_15px_rgba(24,95,165,0.2)]">
                <span className="text-white font-bold font-display">M</span>
              </div>
              <span className="text-[#1C1B19] font-display font-extrabold text-xl">
                Muwafak <span className="text-gradient font-extrabold text-xl">Abubakar</span>
              </span>
            </div>
            <p className="text-[#626058] text-sm leading-relaxed max-w-xs">
              Building modern, high-performance web experiences. Available for freelance
              projects and full-time opportunities.
            </p>
            <div className="flex gap-3">
              {socials.map(({ id, label, href, icon }) => {
                const Icon = iconMap[icon];
                return (
                  <a
                    key={id}
                    id={`footer-${id}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-xl glass-card text-[#626058]
                      hover:text-[#185FA5] hover:border-[#185FA5]/30 transition-all duration-300"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#1C1B19] font-semibold font-display mb-5 text-sm tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    smooth={true}
                    duration={600}
                    offset={-80}
                    className="text-[#626058] hover:text-[#185FA5] transition-colors duration-200 text-sm cursor-pointer
                      flex items-center gap-2 group"
                    id={`footer-nav-${link.to}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#185FA5] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Snippet */}
          <div>
            <h4 className="text-[#1C1B19] font-semibold font-display mb-5 text-sm tracking-wide">Let's Work Together</h4>
            <p className="text-[#626058] text-sm mb-4 leading-relaxed">
              Have a project in mind? I'm always open to new opportunities.
            </p>
            <a
              href={`mailto:${contact.email}`}
              id="footer-email"
              className="text-[#185FA5] text-sm font-medium hover:underline transition-all"
            >
              {contact.email}
            </a>
            <div className="mt-4">
              <div className="inline-flex items-center gap-2 text-xs text-[#626058]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for hire
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#C2C0B8]/20 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#626058] text-xs">
              © {year} Muwafak. All rights reserved.
            </p>
            <p className="text-[#626058] text-xs">
              Built with React &amp; Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
