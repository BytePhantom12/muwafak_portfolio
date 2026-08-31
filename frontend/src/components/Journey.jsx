import { motion } from 'framer-motion';
import { HiAcademicCap, HiBriefcase } from 'react-icons/hi2';
import { usePortfolioData } from '../context/usePortfolioData';

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
};

function JourneyCard({ item, type, index }) {
  const isExperience = type === 'experience';
  const Icon = isExperience ? HiBriefcase : HiAcademicCap;
  const title = isExperience ? item.position : item.degree;
  const organization = isExperience ? item.company : item.institution;
  const start = formatDate(item.startDate);
  const end = item.current ? 'Present' : formatDate(item.endDate);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="glass-card relative min-w-0 p-5 sm:p-6"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h4 className="break-words font-display text-lg font-bold text-[#0F172A]">{title || organization}</h4>
          {title && organization && <p className="text-sm font-medium text-[#2563EB]">{organization}</p>}
          {(start || end) && <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#64748B]">{[start, end].filter(Boolean).join(' – ')}</p>}
        </div>
      </div>
      {item.field && <p className="mb-2 text-sm font-medium text-[#0F172A]">{item.field}</p>}
      {item.description && <p className="text-sm leading-6 text-[#64748B]">{item.description}</p>}
      {isExperience && Array.isArray(item.technologies) && item.technologies.length > 0 && (
        <ul className="mt-4 space-y-2" aria-label="Key responsibilities">
          {item.technologies.map((responsibility) => (
            <li key={responsibility} className="flex items-start gap-2 text-sm leading-relaxed text-[#334155]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2563EB]" aria-hidden="true" />
              <span className="break-words">{responsibility}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}

export default function Journey() {
  const { portfolioData, loading } = usePortfolioData();
  const experience = portfolioData.experience || [];
  const education = portfolioData.education || [];

  if (loading || (experience.length === 0 && education.length === 0)) return null;

  return (
    <section id="journey" className="section-space bg-[#F8FAFC]">
      <div className="container-custom">
        <header className="mb-10 sm:mb-14">
          <h2 className="section-title">Experience &amp; <span className="text-gradient">Education</span></h2>
          <p className="section-subtitle mx-0">Professional experience and academic background.</p>
        </header>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {experience.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-[#0F172A]">
                <HiBriefcase className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                Experience
              </h3>
              <div className="space-y-4">
                {experience.map((item, index) => <JourneyCard key={item._id || `${item.company}-${index}`} item={item} type="experience" index={index} />)}
              </div>
            </div>
          )}
          {education.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-[#0F172A]">
                <HiAcademicCap className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                Education
              </h3>
              <div className="space-y-4">
                {education.map((item, index) => <JourneyCard key={item._id || `${item.institution}-${index}`} item={item} type="education" index={index} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
