import { motion } from 'framer-motion';
import { HiCheckBadge, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { usePortfolioData } from '../context/usePortfolioData';

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
};

function CertificationCard({ cert, index }) {
  const issueDate = formatDate(cert.issueDate);
  const skills = Array.isArray(cert.skills) ? cert.skills.slice(0, 5).filter(Boolean) : [];
  const logo = cert.image?.secure_url || cert.image?.url || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="glass-card flex min-w-0 flex-col gap-3 p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        {logo ? (
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="h-11 w-11 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
            <HiCheckBadge className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="break-words font-display text-base font-bold leading-snug text-[#0F172A]">{cert.title}</h3>
          {cert.issuer && <p className="text-sm font-medium text-[#2563EB]">{cert.issuer}</p>}
          {issueDate && <p className="mt-0.5 text-xs text-[#64748B]">{issueDate}</p>}
        </div>
      </div>

      {cert.credentialId && (
        <p className="break-all text-xs text-[#64748B]">Credential ID: {cert.credentialId}</p>
      )}

      {skills.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Related skills">
          {skills.map((skill) => (
            <li key={skill} className="rounded-full bg-[#2563EB]/8 px-3 py-1 text-xs text-[#1D4ED8]">{skill}</li>
          ))}
        </ul>
      )}

      {cert.credentialUrl && (
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View credential: ${cert.title}`}
          className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          View Credential
          <HiArrowTopRightOnSquare className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </motion.article>
  );
}

export default function Certifications() {
  const { portfolioData, loading } = usePortfolioData();
  const certifications = portfolioData.certifications || [];

  if (loading || certifications.length === 0) return null;

  return (
    <section id="certifications" className="section-space bg-[#F8FAFC]">
      <div className="container-custom">
        <header className="mb-10 sm:mb-14">
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle mx-0">Selected credentials and continuous learning.</p>
        </header>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <CertificationCard key={cert._id || `${cert.title}-${index}`} cert={cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
