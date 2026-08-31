import { getIconComponent } from './iconMap';

// Single source of truth for canonical category names and their recruiter-facing priority order.
// Data Analysis leads (primary focus); Web Development merges backend + frontend, ordered backend-first below.
export const SKILL_CATEGORY_ORDER = [
  'Data Analysis',
  'Web Development',
  'Databases',
  'Tools & Deployment',
];

export const SKILL_CATEGORY_CONFIG = {
  'Data Analysis': { color: '#f59e0b', emoji: '📊' },
  'Web Development': { color: '#2563EB', emoji: '⚙️' },
  Databases: { color: '#10b981', emoji: '🗄️' },
  'Tools & Deployment': { color: '#06B6D4', emoji: '🛠️' },
};

// Backend-first ordering within the merged "Web Development" category (unlisted skills keep their
// original relative order at the end, via a stable sort).
const CATEGORY_ITEM_ORDER = {
  'Web Development': [
    'Python', 'Django', 'Django REST Framework', 'FastAPI', 'REST API',
    'JWT', 'JWT / Authentication', 'Authentication', 'Node.js', 'Express',
    'React', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS',
  ],
};

// Maps legacy/raw stored category names to the canonical display name (also covers identity mappings).
const CATEGORY_ALIASES = {
  'Data & Analytics': 'Data Analysis',
  'Data Analytics': 'Data Analysis',
  'Data Analysis': 'Data Analysis',
  Backend: 'Web Development',
  Frontend: 'Web Development',
  'Backend Development': 'Web Development',
  'Frontend Development': 'Web Development',
  'Web Development': 'Web Development',
  Database: 'Databases',
  Databases: 'Databases',
  'Tools & Cloud': 'Tools & Deployment',
  Tools: 'Tools & Deployment',
  Cloud: 'Tools & Deployment',
  'Tools & Deployment': 'Tools & Deployment',
};

export const SKILL_CATEGORY_OPTIONS = SKILL_CATEGORY_ORDER;

export const normalizeCategoryName = (category) => {
  if (!category) return 'Web Development';
  return CATEGORY_ALIASES[category] || category;
};

export const isImageUrl = (value) => {
  return typeof value === 'string' && /^(https?:\/\/|\/)/i.test(value);
};

const formatSkillNameFromUrl = (url) => {
  const fileName = decodeURIComponent((url || '').split('/').pop() || 'skill');
  return fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Skill';
};

export const getSkillCategoryConfig = (category) => {
  const normalizedCategory = normalizeCategoryName(category);
  return SKILL_CATEGORY_CONFIG[normalizedCategory] || SKILL_CATEGORY_CONFIG['Web Development'];
};

export const normalizeSkillIcon = (iconValue, iconType) => {
  if (iconType === 'image') {
    if (!iconValue) return { iconType: 'image', icon: null };

    if (typeof iconValue === 'object') {
      return {
        iconType: 'image',
        icon: {
          url: iconValue.url || iconValue.secureUrl || '',
          publicId: iconValue.publicId || iconValue.public_id || null,
          filename: iconValue.filename || null,
          cloudinary: iconValue.cloudinary ?? true,
        },
      };
    }

    return {
      iconType: 'image',
      icon: {
        url: iconValue,
        publicId: null,
        filename: null,
        cloudinary: true,
      },
    };
  }

  if (iconType === 'react') {
    return {
      iconType: 'react',
      icon: typeof iconValue === 'string' ? iconValue : iconValue?.name || iconValue?.icon || 'FaCode',
    };
  }

  if (typeof iconValue === 'object' && iconValue) {
    if (iconValue.url || iconValue.publicId || iconValue.public_id) {
      return {
        iconType: 'image',
        icon: {
          url: iconValue.url || iconValue.secureUrl || '',
          publicId: iconValue.publicId || iconValue.public_id || null,
          filename: iconValue.filename || null,
          cloudinary: iconValue.cloudinary ?? true,
        },
      };
    }

    return {
      iconType: 'react',
      icon: iconValue.name || iconValue.icon || 'FaCode',
    };
  }

  if (isImageUrl(iconValue)) {
    return {
      iconType: 'image',
      icon: {
        url: iconValue,
        publicId: null,
        filename: formatSkillNameFromUrl(iconValue),
        cloudinary: false,
      },
    };
  }

  return {
    iconType: 'react',
    icon: typeof iconValue === 'string' && iconValue ? iconValue : 'FaCode',
  };
};

export const normalizeSkillItem = (item, fallbackCategory = 'Web Development', fallbackColor = getSkillCategoryConfig('Web Development').color) => {
  const category = normalizeCategoryName(item?.category || fallbackCategory);
  const categoryConfig = getSkillCategoryConfig(category);
  const normalizedIcon = normalizeSkillIcon(item?.icon ?? item, item?.iconType);
  const itemName = item?.name || item?.label || (normalizedIcon.iconType === 'image' && normalizedIcon.icon?.url ? formatSkillNameFromUrl(normalizedIcon.icon.url) : 'Skill');

  return {
    name: itemName,
    category,
    color: item?.color || fallbackColor || categoryConfig.color,
    iconType: normalizedIcon.iconType,
    icon: normalizedIcon.icon,
  };
};

// Groups a flat skill list by canonical category, then orders categories by SKILL_CATEGORY_ORDER
// (any unrecognized category is appended at the end rather than dropped).
export const groupSkillsByCategory = (skills = []) => {
  const grouped = new Map();

  skills.forEach((skill) => {
    const normalizedSkill = normalizeSkillItem(skill, skill?.category, skill?.color);
    const category = normalizedSkill.category;

    if (!grouped.has(category)) {
      const categoryConfig = getSkillCategoryConfig(category);
      grouped.set(category, {
        name: category,
        color: categoryConfig.color,
        emoji: categoryConfig.emoji,
        skills: [],
      });
    }

    grouped.get(category).skills.push(normalizedSkill);
  });

  const orderedNames = [
    ...SKILL_CATEGORY_ORDER.filter((name) => grouped.has(name)),
    ...[...grouped.keys()].filter((name) => !SKILL_CATEGORY_ORDER.includes(name)),
  ];

  return orderedNames.map((name) => {
    const category = grouped.get(name);
    const itemOrder = CATEGORY_ITEM_ORDER[name];
    if (!itemOrder) return category;

    const priorityIndex = (skillName) => {
      const idx = itemOrder.indexOf(skillName);
      return idx === -1 ? Infinity : idx;
    };
    return { ...category, skills: [...category.skills].sort((a, b) => priorityIndex(a.name) - priorityIndex(b.name)) };
  });
};

export const serializeSkillItem = (skill) => {
  const normalizedSkill = normalizeSkillItem(skill, skill?.category, skill?.color);

  return {
    name: normalizedSkill.name,
    category: normalizedSkill.category,
    color: normalizedSkill.color,
    iconType: normalizedSkill.iconType,
    icon: normalizedSkill.icon,
  };
};

export const toBackendSkillSections = (skills = []) => {
  return groupSkillsByCategory(skills).map((category) => ({
    category: category.name,
    items: category.skills.map(serializeSkillItem),
  }));
};

export const resolveSkillIconComponent = (skill) => {
  const normalizedSkill = normalizeSkillItem(skill, skill?.category, skill?.color);

  if (normalizedSkill.iconType !== 'react') {
    return null;
  }

  return getIconComponent(normalizedSkill.icon);
};
