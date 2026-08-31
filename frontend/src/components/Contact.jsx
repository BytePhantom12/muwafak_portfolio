import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  HiEnvelope, HiMapPin, HiPaperAirplane, HiCheckCircle,
} from 'react-icons/hi2';
import { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { usePortfolioData } from '../context/usePortfolioData';
import { contactAPI } from '../services/api';

const iconMap = { FaGithub, FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp };

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { portfolioData } = usePortfolioData();
  const { contact, socials } = portfolioData;

  const contactInfo = [
    { icon: HiEnvelope, label: 'Email', value: contact.email, href: contact.email ? `mailto:${contact.email}` : null, color: '#2563EB' },
    { icon: HiMapPin, label: 'Location', value: contact.location, href: null, color: '#10b981' },
  ].filter((item) => item.value);

  const socialLinks = socials.filter((social) => social.href);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setLoading(true);
    try {
      // Save to our database first
      await contactAPI.submitMessage(formData);

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
          from_name: `${portfolioData.name} Portfolio`,
        }),
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitError('Something went wrong. Please try again or contact me directly by email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-space relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F1F5F9] to-[#F8FAFC]" />
      <div className="blob w-[500px] h-[500px] bg-[#2563EB] top-0 left-0 opacity-[0.05]" />
      <div className="blob w-[400px] h-[400px] bg-[#E2E8F0] bottom-0 right-0 opacity-[0.08]" />

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
            Have an opportunity, project, or collaboration in mind? Feel free to get in touch.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Left - Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href, color }) => (
                <motion.div
                  key={label}
                  className="glass-card group flex min-w-0 items-center gap-3 rounded-2xl p-4 transition-all duration-300 hover:border-[#E2E8F0]/60 sm:gap-4"
                  whileHover={{ x: 4 }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-[#64748B] uppercase tracking-wider block mb-0.5">{label}</span>
                    {href ? (
                      <a href={href} className="break-all text-sm font-medium text-[#0F172A] transition-colors hover:text-[#2563EB]">
                        {value}
                      </a>
                    ) : (
                      <span className="break-words text-sm font-medium text-[#0F172A]">{value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
            <div>
              <p className="text-sm text-[#64748B] mb-4">Connect with me</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ id, label, href, icon }) => {
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
                        text-[#64748B] hover:text-[#2563EB] hover:border-[#2563EB]/30
                        hover:shadow-[0_0_15px_rgba(37, 99, 235,0.1)] transition-all duration-300"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                    </a>
                  );
                })}
              </div>
            </div>
            )}

            {/* Availability */}
            {portfolioData.profile?.availability && (
              <div className="glass-card flex items-center gap-2.5 rounded-2xl p-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-sm font-medium text-[#0F172A]">{portfolioData.profile.availability}</span>
              </div>
            )}
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="glass-card relative overflow-hidden rounded-2xl p-5 sm:rounded-[2rem] sm:p-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2563EB]/10 to-[#E2E8F0]/10 blur-3xl rounded-full" />

              {submitted ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-16 text-center h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                    <HiCheckCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-[#0F172A] mb-3">Message Sent!</h3>
                  <p className="text-[#64748B] max-w-sm mb-8">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline py-2.5 px-6 text-sm">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  {submitError && (
                    <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">
                      {submitError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-semibold text-[#64748B] uppercase tracking-wider pl-1">Your Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe"
                        className="form-input" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-semibold text-[#64748B] uppercase tracking-wider pl-1">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com"
                        className="form-input" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-semibold text-[#64748B] uppercase tracking-wider pl-1">Subject</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Project Inquiry"
                      className="form-input" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-semibold text-[#64748B] uppercase tracking-wider pl-1">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell me about your project..."
                      className="form-input resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(37, 99, 235,0.2)] disabled:opacity-70 disabled:cursor-not-allowed transition-all">
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
