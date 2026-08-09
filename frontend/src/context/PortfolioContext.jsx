import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';
import { getSkillCategoryConfig, normalizeCategoryName, normalizeSkillItem } from '../utils/skillUtils';
import rawSeedData from '@shared/seedData.json';

const extractMediaUrl = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.secure_url || value.secureUrl || value.url || null;
};

const extractPublicId = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.public_id || value.publicId || null;
};

const buildSocialLinks = (dbData) => {
  const dbSocials = dbData?.socials;
  if (Array.isArray(dbSocials) && dbSocials.length > 0) {
    return dbSocials;
  }

  const social = dbData?.contact?.social;
  if (!social) {
    return rawSeedData.socials || [];
  }

  return [
    { id: 'github', label: 'GitHub', href: social.github || '', icon: 'FaGithub' },
    { id: 'linkedin', label: 'LinkedIn', href: social.linkedin || '', icon: 'FaLinkedinIn' },
    { id: 'facebook', label: 'Facebook', href: social.facebook || '', icon: 'FaFacebookF' },
    { id: 'whatsapp', label: 'WhatsApp', href: social.whatsapp || '', icon: 'FaWhatsapp' },
  ];
};

// Transform database data to match frontend format
const transformPortfolioData = (dbData) => {
  const source = dbData || rawSeedData;

  return {
    // Hero
    name: source.profile?.name || rawSeedData.profile.name,
    role: source.profile?.title || rawSeedData.profile.title,
    typingPhrases: source.typingPhrases || rawSeedData.typingPhrases,
    heroDescription: source.profile?.bio || rawSeedData.profile.bio,
    cvUrl: source.profile?.resume || rawSeedData.profile.resume,

    // Profile
    profile: {
      name: source.profile?.name || rawSeedData.profile.name,
      title: source.profile?.title || rawSeedData.profile.title,
      profileImage: extractMediaUrl(source.profile?.profileImage),
      profileImagePublicId: extractPublicId(source.profile?.profileImage),
      email: source.profile?.email || rawSeedData.contact.email,
      location: source.profile?.location || rawSeedData.profile.location || null,
      languages: source.profile?.languages || rawSeedData.profile.languages || null,
      availability: source.profile?.availability || rawSeedData.profile.availability || null,
    },

    // About
    about: {
      introHeading: source.about?.introHeading || source.profile?.title || rawSeedData.about.introHeading,
      introHeadingHighlight: source.about?.introHeadingHighlight || rawSeedData.about.introHeadingHighlight,
      introDescription: source.about?.introDescription || source.about?.description || rawSeedData.about.introDescription,
      yearsOfExperience: source.about?.yearsOfExperience ?? rawSeedData.about.yearsOfExperience,
      projectsDone: source.about?.projectsDone ?? (source.projects?.length || rawSeedData.about.projectsDone),
      location: source.about?.location || source.profile?.location || rawSeedData.about.location,
      role: source.about?.role || source.profile?.title || rawSeedData.about.role,
      education: source.about?.education || source.education?.[0]?.degree || rawSeedData.about.education,
      languages: source.about?.languages || source.profile?.languages || rawSeedData.about.languages,
      highlights: source.about?.highlights || rawSeedData.about.highlights,
    },

    // Social Links
    socials: buildSocialLinks(source),

    // Contact
    contact: {
      email: source.contact?.email || rawSeedData.contact.email,
      phone: source.contact?.phone || rawSeedData.contact.phone,
      location: source.profile?.location || source.contact?.location || rawSeedData.contact.location || rawSeedData.profile.location,
    },

    // Skills - Transform from database format
    skillCategories: (source.skills?.length > 0 ? source.skills : rawSeedData.skills).map((skillCategory) => {
      const categoryName = normalizeCategoryName(skillCategory.category || skillCategory.name || 'Frontend');
      const categoryConfig = getSkillCategoryConfig(categoryName);
      const rawItems = skillCategory.items || skillCategory.skills || [];

      return {
        name: categoryName,
        color: categoryConfig.color,
        emoji: categoryConfig.emoji,
        skills: rawItems.map((item) => normalizeSkillItem(item, categoryName, categoryConfig.color)),
      };
    }),

    // Projects - Transform from database format
    projects: (source.projects?.length > 0 ? source.projects : rawSeedData.projects).map((project, index) => ({
      _id: project._id || null,
      id: project._id || index + 1,
      title: project.title,
      description: project.description,
      gradientStart: '#185FA5',
      gradientEnd: '#C2C0B8',
      accentColor: project.featured ? '#185FA5' : '#626058',
      tags: Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || ''),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      image: project.image && typeof project.image === 'object' ? {
        secure_url: project.image.secure_url || null,
        public_id: project.image.public_id || null,
        width: project.image.width || null,
        height: project.image.height || null,
        format: project.image.format || null
      } : (project.image || null),
      imagePublicId: extractPublicId(project.image),
      emoji: '🚀',
      isFeatured: project.featured || false,
    })),
  };
};

const FALLBACK_DATA = transformPortfolioData(rawSeedData);

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

