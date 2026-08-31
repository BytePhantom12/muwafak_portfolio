export const PROJECT_CATEGORIES = ['Data Analytics', 'Backend', 'Full Stack'];

const FRONTEND_TECH_HINTS = ['react', 'next.js', 'nextjs', 'javascript', 'html', 'html5', 'css', 'css3', 'tailwind css', 'tailwindcss'];
const BACKEND_TECH_HINTS = ['node.js', 'nodejs', 'express', 'django', 'fastapi', 'flask', 'mongodb', 'mongoose', 'postgresql', 'mysql', 'rest api', 'jwt'];
const ANALYTICS_TECH_HINTS = ['pandas', 'numpy', 'matplotlib', 'scikit-learn', 'tensorflow', 'pytorch', 'power bi', 'excel', 'jupyter', 'plotly', 'seaborn', 'sql'];

// Best-effort category for projects saved before the category field existed — display-only, never persisted.
const inferProjectCategory = (technologies = []) => {
  const techList = technologies.map((tech) => String(tech).toLowerCase());
  const hasFrontend = techList.some((tech) => FRONTEND_TECH_HINTS.includes(tech));
  const hasBackend = techList.some((tech) => BACKEND_TECH_HINTS.includes(tech));
  const hasAnalytics = techList.some((tech) => ANALYTICS_TECH_HINTS.includes(tech));

  if (hasAnalytics && !hasBackend) return 'Data Analytics';
  if (hasFrontend && hasBackend) return 'Full Stack';
  if (hasBackend) return 'Backend';
  return 'Full Stack';
};

export const normalizeProjectCategory = (project) => {
  return PROJECT_CATEGORIES.includes(project?.category)
    ? project.category
    : inferProjectCategory(project?.technologies);
};
