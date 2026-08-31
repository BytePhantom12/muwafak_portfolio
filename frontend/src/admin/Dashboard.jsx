import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiUser, HiAcademicCap, HiCodeBracket, HiBriefcase,
  HiRectangleStack, HiEnvelope, HiArrowRightOnRectangle,
  HiChartBar, HiBars3, HiXMark, HiChevronLeft, HiChevronRight,
  HiHome, HiUserCircle, HiCheckBadge
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import AboutManager from './sections/AboutManager';
import EducationManager from './sections/EducationManager';
import SkillsManager from './sections/SkillsManager';
import ExperienceManager from './sections/ExperienceManager';
import ProjectsManager from './sections/ProjectsManager';
import CertificationsManager from './sections/CertificationsManager';
import ContactManager from './sections/ContactManager';
import ProfileManager from './sections/ProfileManager';
import { usePortfolioData } from '../context/usePortfolioData';
import { contactAPI } from '../services/api';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: HiChartBar },
  { id: 'profile', label: 'Profile', icon: HiUserCircle },
  { id: 'about', label: 'About', icon: HiUser },
  { id: 'skills', label: 'Skills & Tech Stack', icon: HiCodeBracket },
  { id: 'education', label: 'Education', icon: HiAcademicCap },
  { id: 'experience', label: 'Experience', icon: HiBriefcase },
  { id: 'projects', label: 'Projects', icon: HiRectangleStack },
  { id: 'certifications', label: 'Certifications', icon: HiCheckBadge },
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
      case 'certifications': return <CertificationsManager />;
      case 'contact': return <ContactManager />;
      default: return <Overview setActiveSection={setActiveSection} />;
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const close = (event) => event.key === 'Escape' && setSidebarOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', close);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-[#E2E8F0]/30">
        <div className="flex min-h-[68px] items-center justify-between gap-2 px-3 py-3 sm:px-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="touch-target lg:hidden flex items-center justify-center rounded-xl glass-card text-[#64748B] hover:text-[#2563EB] transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
            >
              {sidebarOpen ? <HiXMark className="w-5 h-5" /> : <HiBars3 className="w-5 h-5" />}
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-xl glass-card text-[#64748B] hover:text-[#2563EB] transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? <HiChevronRight className="w-5 h-5" /> : <HiChevronLeft className="w-5 h-5" />}
            </button>

            <h1 className="truncate text-base font-bold font-display text-gradient sm:text-lg lg:text-xl">
              {sidebarCollapsed ? 'Admin' : 'Admin Dashboard'}
            </h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Go Home Button */}
            <Link
              to="/"
              className="p-2 sm:px-4 sm:py-2 rounded-xl glass-card text-[#64748B] hover:text-[#2563EB] hover:border-[#2563EB]/30 hover:shadow-[0_0_15px_rgba(37, 99, 235,0.15)] transition-all duration-300 flex items-center gap-2"
              title="Go to Homepage"
            >
              <HiHome className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Home</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 sm:px-4 sm:py-2 rounded-xl border border-red-500/30 text-red-600 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 flex items-center gap-2"
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-[68px] left-0 z-50 lg:z-auto
          ${sidebarCollapsed ? 'w-16' : 'w-[min(18rem,86vw)] lg:w-64'} h-[calc(100dvh-68px)]
          glass-card overflow-y-auto border-r border-[#E2E8F0]/30 p-4
          transform transition-all duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `} id="admin-sidebar" aria-label="Admin sections">
          <nav className="space-y-2">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleSectionChange(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${activeSection === id
                    ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/20'
                  }`}
                title={sidebarCollapsed ? label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`truncate transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}>
                  {label}
                </span>

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#F8FAFC] text-xs text-[#0F172A] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-[#E2E8F0]">
                    {label}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Footer Actions */}
          <div className="lg:hidden absolute bottom-4 left-4 right-4 space-y-2 border-t border-[#E2E8F0]/30 pt-4">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/20 transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
            >
              <HiHome className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Go Home</span>
            </Link>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-500/10 transition-all duration-300"
            >
              <HiArrowRightOnRectangle className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`min-w-0 flex-1 overflow-x-hidden p-3 sm:p-5 lg:p-8 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'
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
  const { portfolioData, loading, error, refreshPortfolio } = usePortfolioData();
  const [messageStats, setMessageStats] = useState({ total: 0, unread: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [overviewError, setOverviewError] = useState('');

  const refreshOverview = useCallback(async ({ showProgress = true } = {}) => {
    if (showProgress) setRefreshing(true);
    try {
      const [, messageResponse] = await Promise.all([
        refreshPortfolio(),
        contactAPI.getMessages({ limit: 1 }),
      ]);
      setMessageStats({
        total: messageResponse.pagination?.total || 0,
        unread: messageResponse.unreadCount || 0,
      });
      setOverviewError('');
    } catch (refreshError) {
      console.error('Error refreshing dashboard overview:', refreshError);
      setOverviewError(refreshError.message);
    } finally {
      if (showProgress) setRefreshing(false);
    }
  }, [refreshPortfolio]);

  useEffect(() => {
    refreshOverview();
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') refreshOverview({ showProgress: false });
    }, 15000);
    const refreshOnFocus = () => refreshOverview({ showProgress: false });
    window.addEventListener('focus', refreshOnFocus);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [refreshOverview]);

  const skillCount = portfolioData.skillCategories.reduce(
    (total, category) => total + (category.skills?.length || 0),
    0
  );

  const stats = [
    { label: 'Projects', value: portfolioData.projects.length, icon: HiRectangleStack, color: 'from-[#2563EB] to-[#1D4ED8]' },
    { label: 'Skills', value: skillCount, icon: HiCodeBracket, color: 'from-[#06B6D4] to-[#2563EB]' },
    { label: 'Experience Entries', value: portfolioData.experience.length, icon: HiBriefcase, color: 'from-[#2563EB] to-[#06B6D4]' },
    { label: 'Education Entries', value: portfolioData.education.length, icon: HiAcademicCap, color: 'from-[#BFDBFE] to-[#2563EB]' },
    { label: 'Messages', value: messageStats.total, detail: `${messageStats.unread} unread`, icon: HiEnvelope, color: 'from-[#1D4ED8] to-[#06B6D4]' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between lg:mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold font-display mb-2">Portfolio Overview</h2>
          <p className="text-[#64748B] text-sm lg:text-base">Live totals from your portfolio and inbox</p>
        </div>
        <button type="button" onClick={() => refreshOverview()} disabled={refreshing} className="btn-outline text-sm">
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {(error || overviewError) && (
        <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">
          Dashboard data could not be refreshed. {overviewError || error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 lg:gap-6 mb-6 lg:mb-8" aria-busy={loading || refreshing}>
        {stats.map(({ label, value, detail, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 lg:p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 lg:mb-4`}>
              <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold font-display text-gradient mb-1">{value}</h3>
            <p className="text-xs lg:text-sm text-[#64748B]">{label}</p>
            {detail && <p className="mt-1 text-xs font-medium text-[#2563EB]">{detail}</p>}
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
