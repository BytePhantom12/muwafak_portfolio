import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePortfolioData } from '../context/usePortfolioData';
import SkillIcon from './SkillIcon';

function Counter({ value }) {
  const ref = useRef(null);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 1500, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v));
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, motionVal, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

function SkillCard({ skill, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#BFDBFE] hover:shadow-card transition-all rounded-[1.25rem] p-6 flex flex-col items-center gap-4 relative overflow-hidden group w-full"
      style={{ '--skill-color': skill.color }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300"
        style={{ background: skill.color }}
      />

      {/* Icon Container */}
      <div className="w-16 h-16 flex items-center justify-center relative mt-2">
        <div
          className="absolute inset-0 rounded-full blur-[24px] opacity-20 group-hover:opacity-50 transition-opacity duration-500 scale-150"
          style={{ background: skill.color }}
        />
        <SkillIcon
          skill={skill}
          className="w-11 h-11 relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
          imageClassName="w-11 h-11 object-contain"
          style={{ color: skill.color }}
        />
      </div>

      {/* Skill Name */}
      <span className="text-base font-bold text-[#0F172A] tracking-wide mt-2">
        {skill.name}
      </span>

    </motion.div>
  );
}

export default function Skills() {
  const { portfolioData, loading } = usePortfolioData();
  const categories = portfolioData.skillCategories;

  if (loading) {
    return (
      <section id="skills" className="py-24 md:py-32 relative overflow-hidden bg-[#F1F5F9]">
        <div className="container-custom flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#64748B]">Loading skills...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="section-space relative overflow-hidden bg-[#F1F5F9]">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E2E8F0]/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#BFDBFE]/20 via-[#F1F5F9] to-[#F1F5F9] pointer-events-none" />

      <div className="container-custom relative z-10">

        {/* Header Section */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 lg:mb-20 lg:flex-row lg:items-end lg:gap-8">
          <div className="max-w-2xl">
            <h2 className="section-title mb-5">
              Skills & <span className="text-[#2563EB]">Technologies</span>
            </h2>
            <p className="section-subtitle mx-0">
              Tools and technologies I work with to bring ideas to life.
            </p>
          </div>

          {/* Top Right Stats */}
          <div className="grid w-full grid-cols-3 gap-2 select-none sm:flex sm:w-auto sm:gap-4">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-2 py-3 sm:rounded-2xl sm:px-6 sm:py-4 flex flex-col items-center hover:border-[#BFDBFE] transition-colors">
              <span className="text-2xl font-bold text-[#0F172A] mb-1"><Counter value={portfolioData.about.yearsOfExperience} />+</span>
              <span className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">Years Exp</span>
            </div>
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-2 py-3 sm:rounded-2xl sm:px-6 sm:py-4 flex flex-col items-center hover:border-[#BFDBFE] transition-colors">
              <span className="text-2xl font-bold text-[#0F172A] mb-1"><Counter value={portfolioData.projects.length} /></span>
              <span className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">Projects</span>
            </div>
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-2 py-3 sm:rounded-2xl sm:px-6 sm:py-4 flex flex-col items-center hover:border-[#BFDBFE] transition-colors">
              <span className="text-2xl font-bold text-[#0F172A] mb-1"><Counter value={portfolioData.skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)} />+</span>
              <span className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">Tech Stack</span>
            </div>
          </div>
        </div>

        {/* All Categories Sequential List */}
        <div className="flex flex-col gap-12 md:gap-20">
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-8">

              {/* Category Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 w-full"
              >
                <div
                  className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0]/30"
                >
                  <div
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: cat.color, boxShadow: `0 0 12px ${cat.color}` }}
                  />
                </div>
                <h3 className="min-w-0 break-words text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A] tracking-wide">
                  {cat.name}
                </h3>

                {/* Divider */}
                <div className="ml-2 h-px flex-1 md:ml-4" style={{ background: `linear-gradient(90deg, ${cat.color}40, transparent)` }} />
              </motion.div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 md:gap-5 xl:grid-cols-6">
                {cat.skills.map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} />
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
