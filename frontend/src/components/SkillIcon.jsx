import { FaCode } from 'react-icons/fa';
import { normalizeSkillItem, isImageUrl } from '../utils/skillUtils';
import { getIconComponent } from '../utils/iconMap';

export default function SkillIcon({
  skill,
  className = 'w-11 h-11',
  imageClassName = 'object-contain',
  style,
}) {
  const normalizedSkill = normalizeSkillItem(skill, skill?.category, skill?.color);

  if (normalizedSkill.iconType === 'image') {
    const imageUrl = normalizedSkill.icon?.url || (isImageUrl(normalizedSkill.icon) ? normalizedSkill.icon : null);

    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={normalizedSkill.name}
          className={`${className} ${imageClassName}`.trim()}
          style={style}
        />
      );
    }
  }

  const Icon = getIconComponent(normalizedSkill.icon) || FaCode;

  return <Icon className={className} style={style} />;
}