import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiUser, HiAcademicCap, HiCodeBracket, HiBriefcase, 
  HiRectangleStack, HiEnvelope, HiArrowRightOnRectangle,
  HiChartBar, HiBars3, HiXMark, HiChevronLeft, HiChevronRight,
  HiHome, HiUserCircle, HiCpuChip
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import AboutManager from './sections/AboutManager';
import EducationManager from './sections/EducationManager';
import SkillsManager from './sections/SkillsManager';
import ExperienceManager from './sections/ExperienceManager';
import ProjectsManager from './sections/ProjectsManager';
import ContactManager from './sections/ContactManager';
import ProfileManager from './sections/ProfileManager';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: HiChartBar },
  { id: 'profile', label: 'Profile', icon: HiUserCircle },
  { id: 'about', label: 'About', icon: HiUser },
  { id: 'skills', label: 'Skills & Tech Stack', icon: HiCodeBracket },
  { id: 'education', label: 'Education', icon: HiAcademicCap },
  { id: 'experience', label: 'Experience', icon: HiBriefcase },
  { id: 'projects', label: 'Projects', icon: HiRectangleStack },
  { id: 'contact', label: 'Contact', icon: HiEnvelope },
];

export default function Dashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileManager />;
      case 'about': return <AboutManager />;
      case 'skills': return <SkillsManager />;
      case 'education': return <EducationManager />;
      case 'experience': return <ExperienceManager />;
      case 'projects': return <ProjectsManager />;
      case 'contact': return <ContactManager />;
      default: return <Overview setActiveSection={setActiveSection} />;
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/[0.08]">
        <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl glass-card text-slate-400 hover:text-[#00d4ff] transition-colors"
              aria-label="Toggle mobile menu"
            >
              {sidebarOpen ? <HiXMark className="w-5 h-5" /> : <HiBars3 className="w-5 h-5" />}
            </button>
            
            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-xl glass-card text-slate-400 hover:text-[#00d4ff] transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? <HiChevronRight className="w-5 h-5" /> : <HiChevronLeft className="w-5 h-5" />}
            </button>
            
            <h1 className="text-lg lg:text-xl font-bold font-display text-gradient">
              {sidebarCollapsed ? 'Admin' : 'Admin Dashboard'}
            </h1>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Go Home Button */}
            <Link
              to="/"
              className="p-2 sm:px-4 sm:py-2 rounded-xl glass-card text-slate-400 hover:text-[#00d4ff] hover:border-[#00d4ff]/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all duration-300 flex items-center gap-2"
              title="Go to Homepage"
            >
              <HiHome className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Home</span>
            </Link>
            
            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 sm:px-4 sm:py-2 rounded-xl border border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:border-[#00d4ff] transition-all duration-300 flex items-center gap-2"
              title="Logout"
            >
              <HiArrowRightOnRectangle className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static top-[73px] left-0 z-50 lg:z-auto
          ${sidebarCollapsed ? 'w-16' : 'w-64'} h-[calc(100vh-73px)] lg:min-h-[calc(100vh-73px)]
          glass-card border-r border-white/[0.08] p-4
          transform transition-all duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="space-y-2">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleSectionChange(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                  activeSection === id
                    ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#7c3aed]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
                title={sidebarCollapsed ? label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`truncate transition-all duration-300 ${
                  sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}>
                  {label}
                </span>
                
                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#111118] text-xs text-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                    {label}
                  </div>
                )}
              </button>
            ))}
          </nav>
          
          {/* Mobile Footer Actions */}
          <div className="lg:hidden absolute bottom-4 left-4 right-4 space-y-2 border-t border-white/10 pt-4">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
            >
              <HiHome className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Go Home</span>
            </Link>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
            >
              <HiArrowRightOnRectangle className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 lg:p-8 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'
        }`}>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function Overview({ setActiveSection }) {
  const stats = [
    { label: 'Total Projects', value: '10+', icon: HiRectangleStack, color: 'from-[#00d4ff] to-[#0080a8]' },
    { label: 'Skills', value: '15+', icon: HiCodeBracket, color: 'from-[#7c3aed] to-[#4d1a9b]' },
    { label: 'Experience', value: '2+ Years', icon: HiBriefcase, color: 'from-[#00d4ff] to-[#7c3aed]' },
    { label: 'Education', value: 'BSc CS', icon: HiAcademicCap, color: 'from-[#7c3aed] to-[#00d4ff]' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold font-display mb-2">Welcome Back!</h2>
        <p className="text-slate-400 text-sm lg:text-base">Manage your portfolio content from here</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 lg:p-6 rounded-2xl hover:shadow-neon-both transition-shadow duration-300">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 lg:mb-4`}>
              <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold font-display text-gradient mb-1">{value}</h3>
            <p className="text-xs lg:text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 lg:p-6 rounded-2xl">
        <h3 className="text-lg lg:text-xl font-bold font-display mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <button 
            onClick={() => setActiveSection('profile')}
            className="btn-primary justify-center text-sm lg:text-base py-3"
          >
            <HiUserCircle className="w-4 h-4" />
            Update Profile
          </button>
          <button 
            onClick={() => setActiveSection('skills')}
            className="btn-outline justify-center text-sm lg:text-base py-3"
          >
            <HiCodeBracket className="w-4 h-4" />
            Manage Skills
          </button>
          <button 
            onClick={() => setActiveSection('projects')}
            className="btn-outline justify-center text-sm lg:text-base py-3"
          >
            <HiRectangleStack className="w-4 h-4" />
            Add Project
          </button>
          <button 
            onClick={() => setActiveSection('about')}
            className="btn-outline justify-center text-sm lg:text-base py-3"
          >
            <HiUser className="w-4 h-4" />
            Update About
          </button>
        </div>
      </div>
    </div>
  );
}
