import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as HiIcons from 'react-icons/hi2';

export const getIconMap = (iconName) => {
  if (!iconName) return null;
  if (iconName.startsWith('Fa')) return FaIcons[iconName];
  if (iconName.startsWith('Si')) return SiIcons[iconName];
  if (iconName.startsWith('Hi')) return HiIcons[iconName];
  
  // Return a generic fallback icon if not found
  return FaIcons.FaGlobe;
};
