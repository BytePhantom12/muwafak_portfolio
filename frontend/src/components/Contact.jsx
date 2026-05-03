import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  HiEnvelope, HiPhone, HiMapPin, HiPaperAirplane, HiCheckCircle,
} from 'react-icons/hi2';
import { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { usePortfolioData } from '../context/PortfolioContext';

const iconMap = { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp };

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { portfolioData } = usePortfolioData();
  const { contact, socials } = portfolioData;

  const contactInfo = [
    { icon: HiEnvelope, label: 'Email',    value: contact.email,    href: `mailto:${contact.email}`, color: '#00d4ff' },
    { icon: HiPhone,    label: 'Phone',    value: contact.phone,    href: `tel:${contact.phone}`,    color: '#7c3aed' },
    { icon: HiMapPin,   label: 'Location', value: contact.location, href: null,                      color: '#10b981' },
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to our database first
      const dbResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!dbResponse.ok) {
        throw new Error('Failed to save message');
      }

      // Also send via Web3Forms for email notification
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '19cf4002-4951-4f54-99f1-4d1e927da89f',
          name: formData.name,
          email: formData.email,
          subject: `Portfolio Contact: ${formData.subject}`,
          message: formData.message,
          from_name: 'Muwafak Portfolio',
        }),
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Something went wrong. Please try again or contact me directly via email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] to-[#0d1117]" />
      <div className="blob w-[500px] h-[500px] bg-[#00d4ff] top-0 left-0 opacity-[0.07]" />
      <div className="blob w-[400px] h-[400px] bg-[#7c3aed] bottom-0 right-0 opacity-[0.07]" />

      <div className="container-custom relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="section-subtitle">
            Have a project in mind? Let's discuss how we can work together to bring your ideas to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left - Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div>
              <h3 className="text-2xl font-bold font-display text-white mb-3">
                Ready to Start a <span className="text-gradient">Project?</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                I'm always open to discussing new opportunities, creative projects, or just
                having a chat about tech. Let's build something awesome together!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                <motion.div
                  key={label}
                  className="glass-card rounded-2xl p-4 flex items-center gap-4 group hover:border-white/[0.12] transition-all duration-300"
                  whileHover={{ x: 4 }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-0.5">{label}</span>
                    {href ? (
                      <a href={href} className="text-sm text-slate-200 font-medium hover:text-[#00d4ff] transition-colors">
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-200 font-medium">{value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm text-slate-500 mb-4">Follow me on social media</p>
              <div className="flex gap-3">
                {socials.map(({ id, label, href, icon }) => {
                  const Icon = iconMap[icon];
                  return (
                    <a
                      key={id}
                      id={`contact-social-${id}`}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-11 h-11 flex items-center justify-center rounded-xl glass-card
                        text-slate-400 hover:text-[#00d4ff] hover:border-[#00d4ff]/30
                        hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all duration-300"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Availability Card */}
            <div className="glass-card rounded-2xl p-5 neon-border">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-white">Currently Available</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Open to freelance projects, full-time roles, and exciting collaborations.
              </p>
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="glass-card rounded-[2rem] p-6 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00d4ff]/10 to-[#7c3aed]/10 blur-3xl rounded-full" />

              {submitted ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-16 text-center h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                    <HiCheckCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white mb-3">Message Sent!</h3>
                  <p className="text-slate-400 max-w-sm mb-8">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline py-2.5 px-6 text-sm">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Your Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00d4ff]/50 focus:bg-white/[0.05] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00d4ff]/50 focus:bg-white/[0.05] transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Project Inquiry"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00d4ff]/50 focus:bg-white/[0.05] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell me about your project..."
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00d4ff]/50 focus:bg-white/[0.05] transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed transition-all">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <HiPaperAirplane className="w-5 h-5 -mt-0.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
