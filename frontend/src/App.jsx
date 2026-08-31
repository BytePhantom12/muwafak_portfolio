import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Journey from './components/Journey';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import { Analytics } from '@vercel/analytics/react';
import { PortfolioProvider } from './context/PortfolioContext';

const AdminApp = lazy(() => import('./admin/AdminApp'));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]" role="status">
    <span className="h-12 w-12 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
    <span className="sr-only">Loading page</span>
  </div>
);

const SectionDivider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent" />
);

function Portfolio() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Journey />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Certifications />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/*" element={<Suspense fallback={<RouteFallback />}><AdminApp /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Analytics />}
    </>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <Router>
        <AppContent />
      </Router>
    </PortfolioProvider>
  );
}
