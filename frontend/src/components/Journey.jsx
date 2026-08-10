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
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#185FA5]/10 text-[#185FA5]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="break-words font-display text-lg font-bold text-[#1C1B19]">{title || organization}</h3>
          {title && organization && <p className="text-sm font-medium text-[#185FA5]">{organization}</p>}
          {(start || end) && <p className="mt-1 text-xs text-[#626058]">{[start, end].filter(Boolean).join(' – ')}</p>}
        </div>
      </div>
      {item.field && <p className="mb-2 text-sm font-medium text-[#1C1B19]">{item.field}</p>}
      {item.description && <p className="text-sm leading-6 text-[#626058]">{item.description}</p>}
      {Array.isArray(item.technologies) && item.technologies.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
          {item.technologies.map((technology) => <li key={technology} className="rounded-full bg-[#185FA5]/8 px-3 py-1 text-xs text-[#0C447C]">{technology}</li>)}
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
    <section id="journey" className="section-space bg-[#DDDBD3]">
      <div className="container-custom">
        <header className="mb-10 sm:mb-14">
          <h2 className="section-title">Experience &amp; <span className="text-gradient">Education</span></h2>
          <p className="section-subtitle mx-0">My professional and academic journey.</p>
        </header>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {experience.length > 0 && <div><h3 className="mb-4 font-display text-xl font-bold">Experience</h3><div className="space-y-4">{experience.map((item, index) => <JourneyCard key={item._id || `${item.company}-${index}`} item={item} type="experience" index={index} />)}</div></div>}
          {education.length > 0 && <div><h3 className="mb-4 font-display text-xl font-bold">Education</h3><div className="space-y-4">{education.map((item, index) => <JourneyCard key={item._id || `${item.institution}-${index}`} item={item} type="education" index={index} />)}</div></div>}
        </div>
      </div>
    </section>
  );
}
