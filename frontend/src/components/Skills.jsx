import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePortfolioData } from '../context/PortfolioContext';
import {
  FaReact, FaHtml5, FaCss3Alt, FaPython, FaNodeJs, FaGithub, FaFigma, FaCode, FaChartBar,
} from 'react-icons/fa';
import {
  SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, SiFramer,
  SiDjango, SiPostman, SiPostgresql, SiMysql, SiVercel, SiFastapi,
  SiTensorflow, SiPytorch, SiPandas, SiScikitlearn, SiNumpy, SiApachespark,
  SiMongodb, SiFirebase, SiRedis, SiElasticsearch, SiInfluxdb, SiPlotly,
} from 'react-icons/si';

const iconMap = {
  FaReact, FaHtml5, FaCss3Alt, FaPython, FaNodeJs, FaGithub, FaFigma, FaCode, FaChartBar,
  SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, SiFramer,
  SiDjango, SiPostman, SiPostgresql, SiMysql, SiVercel, SiFastapi,
  SiTensorflow, SiPytorch, SiPandas, SiScikitlearn, SiNumpy, SiApachespark,
  SiMongodb, SiFirebase, SiRedis, SiElasticsearch, SiInfluxdb, SiPlotly,
  SiVisualstudiocode: FaCode,
};

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
  const Icon = iconMap[skill.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-[#DDDBD3] border border-[#C2C0B8]/30 hover:border-[#C2C0B8]/60 transition-colors rounded-[1.25rem] p-6 pb-5 flex flex-col items-center gap-5 relative overflow-hidden group w-full"
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
        {Icon && (
          <Icon
            className="w-11 h-11 relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
            style={{ color: skill.color }}
          />
        )}
      </div>

      {/* Skill Name */}
      <span className="text-base font-bold text-[#1C1B19] tracking-wide mt-2">
        {skill.name}
      </span>

      {/* Progress Bar & Percentage */}
      <div className="w-full mt-auto pt-2 flex flex-col items-center gap-3">
        <div className="w-full h-1.5 bg-[#C2C0B8]/60 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: skill.color,
              boxShadow: `0 0 10px ${skill.color}80`
            }}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            transition={{ duration: 1.2, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { portfolioData, loading } = usePortfolioData();
  const categories = portfolioData.skillCategories;

  if (loading) {
    return (
      <section id="skills" className="py-24 md:py-32 relative overflow-hidden bg-[#E8E6DE]">
        <div className="container-custom flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#185FA5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#626058]">Loading skills...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden bg-[#E8E6DE]">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C2C0B8]/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#DDDBD3]/40 via-[#E8E6DE] to-[#E8E6DE] pointer-events-none" />

      <div className="container-custom relative z-10">

        {/* Header Section */}
        <div className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-[2.75rem] font-bold text-[#1C1B19] leading-tight mb-5">
              Skills & <span className="text-[#185FA5]">Technologies</span>
            </h2>
            <p className="text-[#626058] text-lg">
              Tools and technologies I work with to bring ideas to life.
            </p>
          </div>

          {/* Top Right Stats */}
          <div className="flex flex-wrap gap-4 select-none">
            <div className="bg-[#DDDBD3] border border-[#C2C0B8]/30 rounded-2xl px-6 py-4 flex flex-col items-center hover:border-[#C2C0B8]/60 transition-colors">
              <span className="text-2xl font-bold text-[#1C1B19] mb-1"><Counter value={portfolioData.about.yearsOfExperience} />+</span>
              <span className="text-[10px] text-[#626058] uppercase tracking-widest font-semibold">Years Exp</span>
            </div>
            <div className="bg-[#DDDBD3] border border-[#C2C0B8]/30 rounded-2xl px-6 py-4 flex flex-col items-center hover:border-[#C2C0B8]/60 transition-colors">
              <span className="text-2xl font-bold text-[#1C1B19] mb-1"><Counter value={portfolioData.projects.length} /></span>
              <span className="text-[10px] text-[#626058] uppercase tracking-widest font-semibold">Projects</span>
            </div>
            <div className="bg-[#DDDBD3] border border-[#C2C0B8]/30 rounded-2xl px-6 py-4 flex flex-col items-center hover:border-[#C2C0B8]/60 transition-colors">
              <span className="text-2xl font-bold text-[#1C1B19] mb-1"><Counter value={portfolioData.skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0)} />+</span>
              <span className="text-[10px] text-[#626058] uppercase tracking-widest font-semibold">Tech Stack</span>
            </div>
          </div>
        </div>

        {/* All Categories Sequential List */}
        <div className="flex flex-col gap-16 md:gap-20">
          {categories.map((cat, catIdx) => (
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
                  className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#DDDBD3] border border-[#C2C0B8]/30"
                >
                  <div
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: cat.color, boxShadow: `0 0 12px ${cat.color}` }}
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#1C1B19] tracking-wide shrink-0">
                  {cat.name}
                </h3>

                {/* Modern Tech Animated Line */}
                <div className="flex-1 flex items-center gap-2 ml-2 md:ml-4 overflow-hidden opacity-80">
                  <div className="h-px w-full bg-[#C2C0B8]/40 relative overflow-hidden rounded-full">
                    {/* Fast moving data packet */}
                    <motion.div
                      className="absolute top-0 bottom-0 w-32"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
                        boxShadow: `0 0 10px ${cat.color}`
                      }}
                      animate={{ x: ['-200%', '500%'] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay: catIdx * 0.4 // Stagger the animation per category
                      }}
                    />
                    {/* Slow moving ambient glow */}
                    <motion.div
                      className="absolute top-0 bottom-0 w-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${cat.color}40, transparent)`,
                      }}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "linear",
                        delay: catIdx * 0.2
                      }}
                    />
                  </div>
                  {/* Circuit/tech node at the end */}
                  <div
                    className="w-1.5 h-1.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }}
                  />
                  <div
                    className="w-1 h-3 shrink-0 rounded-sm opacity-50"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </motion.div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 md:gap-6">
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
