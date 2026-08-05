import { getIconComponent } from './iconMap';

export const DEFAULT_SKILL_LEVEL = 85;

export const SKILL_CATEGORY_CONFIG = {
  Frontend: { color: '#185FA5', emoji: '🎨' },
  Backend: { color: '#626058', emoji: '⚙️' },
  Database: { color: '#10b981', emoji: '🗄️' },
  Databases: { color: '#10b981', emoji: '🗄️' },
  'Data Analysis': { color: '#f59e0b', emoji: '📊' },
  'Tools & Cloud': { color: '#10b981', emoji: '🛠️' },
  Tools: { color: '#10b981', emoji: '🛠️' },
  Cloud: { color: '#10b981', emoji: '🛠️' },
};

const CATEGORY_ALIASES = {
  Databases: 'Database',
  Database: 'Database',
  Tools: 'Tools & Cloud',
  Cloud: 'Tools & Cloud',
};

export const SKILL_CATEGORY_OPTIONS = [
  'Frontend',
  'Backend',
  'Database',
  'Data Analysis',
  'Tools & Cloud',
];

export const normalizeCategoryName = (category) => {
  if (!category) return 'Frontend';
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
  return SKILL_CATEGORY_CONFIG[normalizedCategory] || SKILL_CATEGORY_CONFIG.Frontend;
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

export const normalizeSkillItem = (item, fallbackCategory = 'Frontend', fallbackColor = getSkillCategoryConfig('Frontend').color) => {
  const category = normalizeCategoryName(item?.category || fallbackCategory);
  const categoryConfig = getSkillCategoryConfig(category);
  const normalizedIcon = normalizeSkillIcon(item?.icon ?? item, item?.iconType);
  const itemName = item?.name || item?.label || (normalizedIcon.iconType === 'image' && normalizedIcon.icon?.url ? formatSkillNameFromUrl(normalizedIcon.icon.url) : 'Skill');

  return {
    name: itemName,
    level: item?.level ?? DEFAULT_SKILL_LEVEL,
    category,
    color: item?.color || fallbackColor || categoryConfig.color,
    iconType: normalizedIcon.iconType,
    icon: normalizedIcon.icon,
  };
};

export const groupSkillsByCategory = (skills = []) => {
  const grouped = new Map();

  skills.forEach((skill) => {
    const normalizedSkill = normalizeSkillItem(skill, skill?.category, skill?.color);
    const category = normalizeCategoryName(normalizedSkill.category);

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

  return [...grouped.values()];
};

export const serializeSkillItem = (skill) => {
  const normalizedSkill = normalizeSkillItem(skill, skill?.category, skill?.color);

  return {
    name: normalizedSkill.name,
    level: normalizedSkill.level,
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