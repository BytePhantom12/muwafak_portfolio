import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';

// ─── FALLBACK DATA (Used while loading or if API fails) ────────────────────
// This data is used as a fallback if the API is not available

const FALLBACK_DATA = {
  // Hero
  name: 'Muwafak Abubakar',
  role: 'Full Stack Developer',
  typingPhrases: [
    'Full Stack Developer',
    'Data Analyst',
    'AI/ML Enthusiast',
  ],
  heroDescription:
    'I build modern web applications powered by data. Full Stack Developer and Data Analyst, I create responsive, high-performance systems using React, FastAPI, and modern databases—while turning data into insights that drive smarter decisions.',
  cvUrl: '/muwafak-cv.pdf',

  // About
  about: {
    introHeading: 'Full Stack Developer',
    introHeadingHighlight: 'Creative Problem Solver',
    introDescription:
      "Hi! I’m Muwafak, a Full Stack Developer and Data Analyst who builds scalable, data-driven web applications. I specialize in React, Next.js, and FastAPI, combining clean, maintainable code with thoughtful design to create seamless user experiences. I enjoy turning complex ideas into practical solutions and using data to build systems that are both intelligent and impactful. ",
    yearsOfExperience: 2,
    projectsDone: 6,
    location: 'Malaysia (Available Remotely)',
    role: 'Frontend & Full Stack Developer',
    education: "Bachelor's in Computer Science",
    languages: 'English, Arabic. Hausa',
    highlights: [
      'Building responsive, accessible web applications',
      'Passionate about clean code and best practices',
      'Experience with React, Tailwind, Next.js ecosystem',
      'Strong eye for design and user experience',
    ],
  },

  // Social Links
  socials: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/BytePhantom12', icon: 'FaGithub' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/muwafak-abubakar-8504822a1/', icon: 'FaLinkedinIn' },
    { id: 'facebook', label: 'Facebook', href: '', icon: 'FaFacebookF' },
    { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/+60179591694', icon: 'FaWhatsapp' },
  ],

  // Contact
  contact: {
    email: 'muwafaqabubakr11@gmail.com',
    phone: '+60 17-959 1694',
    location: 'Malaysia (Available Remotely)',
  },

  // Skills
  skillCategories: [
    {
      name: 'Frontend',
      color: '#185FA5',
      emoji: '🎨',
      skills: [
        { name: 'React', level: 90, icon: 'FaReact', color: '#61dafb' },
        { name: 'Next.js', level: 85, icon: 'SiNextdotjs', color: '#1C1B19' },
        { name: 'TypeScript', level: 80, icon: 'SiTypescript', color: '#3178c6' },
        { name: 'JavaScript', level: 92, icon: 'SiJavascript', color: '#f7df1e' },
        { name: 'HTML5', level: 95, icon: 'FaHtml5', color: '#e34f26' },
        { name: 'CSS3', level: 90, icon: 'FaCss3Alt', color: '#1572b6' },
        { name: 'Tailwind', level: 88, icon: 'SiTailwindcss', color: '#06b6d4' },
      ],
    },
    {
      name: 'Backend',
      color: '#626058',
      emoji: '⚙️',
      skills: [
        { name: 'Python', level: 80, icon: 'FaPython', color: '#3776ab' },
        { name: 'Django', level: 75, icon: 'SiDjango', color: '#44b78b' },
        { name: 'FastAPI', level: 80, icon: 'SiFastapi', color: '#009688' },
        { name: 'REST API', level: 72, icon: 'SiPostman', color: '#ff6c37' },
      ],
    },
    {
      name: 'Databases',
      color: '#10b981',
      emoji: '🗄️',
      skills: [
        { name: 'PostgreSQL', level: 80, icon: 'SiPostgresql', color: '#336791' },
        { name: 'MySQL', level: 78, icon: 'SiMysql', color: '#4479a1' },
        { name: 'Redis', level: 70, icon: 'SiRedis', color: '#dc382d' }
      ]
    },
    {
      name: 'Data Analysis',
      color: '#f59e0b',
      emoji: '📊',
      skills: [
        { name: 'Pandas', level: 85, icon: 'SiPandas', color: '#150458' },
        { name: 'NumPy', level: 80, icon: 'SiNumpy', color: '#013243' },
        { name: 'Scikit-learn', level: 78, icon: 'SiScikitlearn', color: '#f7931e' },
        { name: 'Data Analysis', level: 88, icon: 'FaChartBar', color: '#22c55e' },
        { name: 'Matplotlib', level: 75, icon: 'SiPlotly', color: '#3b82f6' }
      ]
    },

    {
      name: 'Tools & Cloud',
      color: '#10b981',
      emoji: '🛠️',
      skills: [
        { name: 'Git', level: 88, icon: 'FaGithub', color: '#f54d27' },
        { name: 'VS Code', level: 95, icon: 'SiVisualstudiocode', color: '#007acc' },
        { name: 'Figma', level: 75, icon: 'FaFigma', color: '#f24e1e' },
        { name: 'PostgreSQL', level: 65, icon: 'SiPostgresql', color: '#336791' },
        { name: 'Vercel', level: 85, icon: 'SiVercel', color: '#1C1B19' },
      ],
    },
  ],

  // Projects
  projects: [
    {
      id: 1,
      title: 'Muwafak Portfolio',
      description:
        'A modern personal portfolio website built with React and Vite. Features a warm charcoal and blue light theme design, Framer Motion animations, and smooth scroll navigation between all sections.',
      gradientStart: '#185FA5',
      gradientEnd: '#C2C0B8',
      accentColor: '#185FA5',
      tags: 'React, Vite, Framer Motion, Tailwind',
      githubUrl: '',
      liveUrl: '',
      emoji: '🚀',
      images: ['muwafak-portfolio.png', 'proex.png', 'crafthub.png'],
      isFeatured: true,
    },
    {
      id: 2,
      title: 'ProEx Consulting Corporate Website',
      description:
        'Built a modern corporate website and full-featured admin dashboard. Implemented dynamic content management for services and media, and integrated a backend for real-time CRUD operations.',
      gradientStart: '#f59e0b',
      gradientEnd: '#ef4444',
      accentColor: '#f59e0b',
      tags: 'React, Next.js, Full Stack, Dashboard',
      githubUrl: '',
      liveUrl: '#',
      emoji: '🏢',
      isFeatured: true,
    },
    {
      id: 3,
      title: 'CraftHub Manufacturing System',
      description:
        'Developed a comprehensive manufacturing management system to streamline operations, inventory, and production workflows. Designed for scalability to support real-time business processes.',
      gradientStart: '#3b82f6',
      gradientEnd: '#2563eb',
      accentColor: '#3b82f6',
      tags: 'React, Management System, Scalability',
      githubUrl: '',
      liveUrl: '#',
      emoji: '🏭',
      isFeatured: false,
    },
    {
      id: 4,
      title: 'Ajwah Cultural Council',
      description:
        'Created a modern, fully responsive website to showcase events, media, and community initiatives. Focused intensely on a clean UI and smooth user experience across all devices.',
      gradientStart: '#10b981',
      gradientEnd: '#059669',
      accentColor: '#10b981',
      tags: 'React, Next.js, HTML, CSS, JS',
      githubUrl: '',
      liveUrl: '#',
      emoji: '🌐',
      isFeatured: false,
    },
    {
      id: 5,
      title: 'LanguageHub Platform',
      description:
        'A web-based platform connecting students with native-speaking teachers worldwide. Features a teacher booking system, virtual coin payments, class management, and resource sharing.',
      gradientStart: '#eab308',
      gradientEnd: '#ca8a04',
      accentColor: '#eab308',
      tags: 'HTML, CSS, JavaScript',
      githubUrl: '',
      liveUrl: '#',
      emoji: '🗣️',
      isFeatured: false,
    },
    {
      id: 6,
      title: 'Ilham Education',
      description:
        'A comprehensive educational management system designed to empower students and educators. Features advanced learning modules, progress tracking, and interactive virtual classrooms built for the modern digital era.',
      gradientStart: '#8b5cf6',
      gradientEnd: '#3b82f6',
      accentColor: '#a78bfa',
      tags: 'React, Node.js, Educational Tech, In Progress',
      githubUrl: '',
      liveUrl: '',
      emoji: '🎓',
      isFeatured: true,
    },
  ],
};

// Transform database data to match frontend format
const transformPortfolioData = (dbData) => {
  if (!dbData) return FALLBACK_DATA;

  return {
    // Hero
    name: dbData.profile?.name || FALLBACK_DATA.name,
    role: dbData.profile?.title || FALLBACK_DATA.role,
    typingPhrases: FALLBACK_DATA.typingPhrases, // Keep static for now
    heroDescription: dbData.profile?.bio || FALLBACK_DATA.heroDescription,
    cvUrl: dbData.profile?.resume || FALLBACK_DATA.cvUrl,

    // Profile
    profile: {
      name: dbData.profile?.name || FALLBACK_DATA.name,
      title: dbData.profile?.title || FALLBACK_DATA.role,
      profileImage: dbData.profile?.profileImage || null,
      email: dbData.profile?.email || FALLBACK_DATA.contact.email,
      location: dbData.profile?.location || null,
      languages: dbData.profile?.languages || null,
      availability: dbData.profile?.availability || null,
    },

    // About
    about: {
      introHeading: dbData.about?.introHeading || dbData.profile?.title || FALLBACK_DATA.about.introHeading,
      introHeadingHighlight: dbData.about?.introHeadingHighlight || FALLBACK_DATA.about.introHeadingHighlight,
      introDescription: dbData.about?.introDescription || dbData.about?.description || FALLBACK_DATA.about.introDescription,
      yearsOfExperience: dbData.about?.yearsOfExperience ?? (dbData.experience?.filter(exp => exp.current).length || 1),
      projectsDone: dbData.about?.projectsDone ?? (dbData.projects?.length || 0),
      location: dbData.about?.location || dbData.profile?.location || FALLBACK_DATA.about.location,
      role: dbData.about?.role || dbData.profile?.title || FALLBACK_DATA.about.role,
      education: dbData.about?.education || dbData.education?.[0]?.degree || FALLBACK_DATA.about.education,
      languages: dbData.about?.languages || dbData.profile?.languages || FALLBACK_DATA.about.languages,
      highlights: dbData.about?.highlights || FALLBACK_DATA.about.highlights,
    },

    // Social Links - Keep static for now
    socials: FALLBACK_DATA.socials,

    // Contact
    contact: {
      email: dbData.contact?.email || FALLBACK_DATA.contact.email,
      phone: dbData.contact?.phone || FALLBACK_DATA.contact.phone,
      location: dbData.profile?.location || FALLBACK_DATA.contact.location,
    },

    // Skills - Transform from database format
    skillCategories: dbData.skills?.length > 0 ? dbData.skills.map(skillCategory => {
      // Map category names to colors and emojis
      const categoryConfig = {
        'Frontend': { color: '#185FA5', emoji: '🎨' },
        'Backend': { color: '#626058', emoji: '⚙️' },
        'Tools & Cloud': { color: '#10b981', emoji: '🛠️' },
        'Database': { color: '#10b981', emoji: '🗄️' },
        'Tools': { color: '#10b981', emoji: '🛠️' },
      };

      const config = categoryConfig[skillCategory.category] || { color: '#185FA5', emoji: '🎨' };

      return {
        name: skillCategory.category,
        color: config.color,
        emoji: config.emoji,
        skills: skillCategory.items?.map(item => ({
          name: item,
          level: 85, // Default level
          icon: 'FaCode',
          color: config.color
        })) || []
      };
    }) : FALLBACK_DATA.skillCategories,

    // Projects - Transform from database format
    projects: dbData.projects?.map((project, index) => ({
      id: project._id || index + 1,
      title: project.title,
      description: project.description,
      gradientStart: '#185FA5',
      gradientEnd: '#C2C0B8',
      accentColor: project.featured ? '#185FA5' : '#626058',
      tags: project.technologies?.join(', ') || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      image: project.image || null,
      emoji: '🚀',
      isFeatured: project.featured || false,
    })) || FALLBACK_DATA.projects,
  };
};

const deepMerge = (target, partial) => {
  if (typeof target !== 'object' || target === null) return partial;
  if (typeof partial !== 'object' || partial === null) return partial;
  if (Array.isArray(partial)) return partial;

  return Object.keys({ ...target, ...partial }).reduce((memo, key) => {
    if (
      key in target &&
      key in partial &&
      typeof target[key] === 'object' &&
      target[key] !== null &&
      !Array.isArray(target[key]) &&
      typeof partial[key] === 'object' &&
      partial[key] !== null &&
      !Array.isArray(partial[key])
    ) {
      memo[key] = deepMerge(target[key], partial[key]);
    } else if (key in partial) {
      memo[key] = partial[key];
    } else {
      memo[key] = target[key];
    }
    return memo;
  }, {});
};

// Context
const PortfolioContext = createContext(null);

export const usePortfolioData = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Broadcast updates across tabs/windows (and fallback to localStorage)
  const broadcastUpdate = (data) => {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const ch = new BroadcastChannel('portfolio_updates');
        ch.postMessage({ type: 'update', data });
        ch.close();
      }
      // also write to localStorage to trigger storage events
      localStorage.setItem('portfolio_update', JSON.stringify({ data, ts: Date.now() }));
    } catch (e) {
      console.warn('Broadcast failed', e);
    }
  };

  // Update local context and broadcast the change
  const updateLocalPortfolio = (partial) => {
    setPortfolioData((prev) => {
      const next = deepMerge(prev, partial);
      try { localStorage.setItem('portfolio_snapshot', JSON.stringify(next)); } catch { }
      broadcastUpdate(next);
      return next;
    });
  };

  useEffect(() => {
    const storedSnapshot = localStorage.getItem('portfolio_snapshot');
    if (storedSnapshot) {
      try {
        const parsedSnapshot = JSON.parse(storedSnapshot);
        if (parsedSnapshot && typeof parsedSnapshot === 'object') {
          setPortfolioData(parsedSnapshot);
        }
      } catch (err) {
        console.warn('Unable to parse stored portfolio snapshot', err);
      }
    }

    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const data = await portfolioAPI.getPortfolio();
        const transformedData = transformPortfolioData(data);
        setPortfolioData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err.message);
        // Keep using fallback data on error
        setPortfolioData(FALLBACK_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
    // Listen for cross-tab updates via BroadcastChannel or storage
    let ch;
    if (typeof BroadcastChannel !== 'undefined') {
      ch = new BroadcastChannel('portfolio_updates');
      ch.onmessage = (ev) => {
        if (ev.data?.type === 'update' && ev.data.data) {
          setPortfolioData(ev.data.data);
        }
      };
    }

    const onStorage = (e) => {
      if (e.key === 'portfolio_update' || e.key === 'portfolio_snapshot') {
        try {
          const payload = JSON.parse(e.newValue);
          const maybeData = payload?.data || payload || null;
          if (maybeData) setPortfolioData(maybeData);
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      if (ch) ch.close();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const refreshPortfolio = async () => {
    try {
      const data = await portfolioAPI.getPortfolio();
      const transformedData = transformPortfolioData(data);
      setPortfolioData(transformedData);
      return transformedData;
    } catch (err) {
      console.error('Error refreshing portfolio:', err);
      throw err;
    }
  };

  return (
    <PortfolioContext.Provider value={{
      portfolioData,
      loading,
      error,
      refreshPortfolio,
      updateLocalPortfolio
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

