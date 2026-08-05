import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaPython,
  FaNodeJs,
  FaGithub,
  FaFigma,
  FaCode,
  FaChartBar,
  FaJava,
  FaDocker,
  FaGlobe,
} from 'react-icons/fa';
import {
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFramer,
  SiDjango,
  SiPostman,
  SiPostgresql,
  SiMysql,
  SiVercel,
  SiFastapi,
  SiTensorflow,
  SiPytorch,
  SiPandas,
  SiScikitlearn,
  SiNumpy,
  SiApachespark,
  SiMongodb,
  SiFirebase,
  SiRedis,
  SiElasticsearch,
  SiInfluxdb,
  SiPlotly,
} from 'react-icons/si';
import { HiHome, HiAcademicCap, HiBriefcase, HiDocumentText } from 'react-icons/hi2';

export const iconMap = {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaPython,
  FaNodeJs,
  FaGithub,
  FaFigma,
  FaCode,
  FaChartBar,
  FaJava,
  FaDocker,
  FaGlobe,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFramer,
  SiDjango,
  SiPostman,
  SiPostgresql,
  SiMysql,
  SiVercel,
  SiFastapi,
  SiTensorflow,
  SiPytorch,
  SiPandas,
  SiScikitlearn,
  SiNumpy,
  SiApachespark,
  SiMongodb,
  SiFirebase,
  SiRedis,
  SiElasticsearch,
  SiInfluxdb,
  SiPlotly,
  SiVisualstudiocode: FaCode,
  HiHome,
  HiAcademicCap,
  HiBriefcase,
  HiDocumentText,
};

export const iconEntries = Object.entries(iconMap).sort(([left], [right]) => left.localeCompare(right));
export const iconNames = iconEntries.map(([name]) => name);

export const getIconComponent = (iconName) => {
  if (!iconName) return null;
  return iconMap[iconName] || null;
};

export const getIconMap = getIconComponent;
