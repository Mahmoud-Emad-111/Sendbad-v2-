import { useState, useEffect } from 'react';
import { ModernNavbar } from './components/ModernNavbar';
import { MobileNav } from './components/MobileNav';
import { ModernHero } from './components/ModernHero';
import { ModernEstimator } from './components/ModernEstimator';
import { ModernGallery } from './components/ModernGallery';
import { TrustStrip } from './components/TrustStrip';
import { Experience } from './components/Experience';
import { Reviews } from './components/Reviews';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ConsultationForm } from './components/ConsultationForm';
import ConsultationPopup from './components/ConsultationPopup';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Dashboard } from './components/Dashboard';
import AdminLoginPage from './components/AdminLoginPage';
import { SettingsProvider } from './lib/settings';

type AppView = 'website' | 'dashboard' | 'admin-login';

export default function App() {
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  let initialView: AppView = 'website';
  if (typeof window !== 'undefined') {
    const initialPath = window.location.pathname;
    if (initialPath === '/dashboard') {
      // if there is a stored token assume authenticated locally, otherwise show full-page login
      const token = localStorage.getItem('api_token');
      initialView = token ? 'dashboard' : 'admin-login';
    } else if (initialPath === '/admin/login' || initialPath === '/dashboard/login') {
      initialView = 'admin-login';
    } else {
      initialView = 'website';
    }
  }

  const [currentView, setCurrentView] = useState<AppView>(initialView);

  // keep URL in sync with currentView so direct links work and history/back navigates
  useEffect(() => {
    try {
      if (currentView === 'dashboard' && window.location.pathname !== '/dashboard') {
        window.history.pushState({}, '', '/dashboard');
      } else if (currentView === 'website' && window.location.pathname === '/dashboard') {
        window.history.pushState({}, '', '/');
      }
    } catch (e) {
      // ignore server-side or restricted environments
    }
  }, [currentView]);

  // respond to browser navigation (back/forward)
  useEffect(() => {
    const onPop = () => {
      if (window.location.pathname === '/dashboard') setCurrentView('dashboard');
      else setCurrentView('website');
    };
    window.addEventListener('popstate', onPop);
    // listen for global open event as a fallback from other components
    const onOpenConsultEvent = () => setIsConsultationFormOpen(true);
    window.addEventListener('open:consultation', onOpenConsultEvent);
    return () => window.removeEventListener('popstate', onPop);
    // cleanup for fallback event
    // note: we return only one cleanup but we'll remove event below explicitly
  }, []);

  // cleanup listener for open:consultation on unmount separately
  useEffect(() => {
    const onOpenConsultEvent = () => setIsConsultationFormOpen(true);
    window.addEventListener('open:consultation', onOpenConsultEvent);
    return () => window.removeEventListener('open:consultation', onOpenConsultEvent);
  }, []);

  const handleOpenConsultation = () => {
    setIsConsultationFormOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationFormOpen(false);
  };

  const handleOpenGallery = () => {
    const gallerySection = document.getElementById('gallery');
    gallerySection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRequestSimilar = () => {
    setIsConsultationFormOpen(true);
  };

  if (currentView === 'admin-login') {
    return <AdminLoginPage onSuccess={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onBackToSite={() => setCurrentView('website')} />;
  }

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-white" dir="rtl">
      {/* Desktop Navigation */}
      <ModernNavbar 
        onOpenConsultation={handleOpenConsultation}
        onNavigateToDashboard={() => setCurrentView('dashboard')}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenConsultation={handleOpenConsultation} />

      {/* Hero Section */}
      <section id="home">
        <ModernHero 
          onOpenConsultation={handleOpenConsultation}
          onOpenGallery={handleOpenGallery}
        />
      </section>

      {/* Estimator Section */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50" id="estimator">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <ModernEstimator onRequestConsultation={handleOpenConsultation} />
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip />

      {/* Experience Section */}
      <Experience />

      {/* Gallery Section */}
      <section id="gallery">
        <ModernGallery onRequestSimilar={handleRequestSimilar} />
      </section>

      {/* Reviews Section */}
      <Reviews />

      {/* Contact Section */}
      <section id="contact">
        <Contact />
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Consultation popup (appears after a short delay) */}
      <ConsultationPopup onOpenConsultation={handleOpenConsultation} />

        {/* Consultation Form Modal */}
        <ConsultationForm 
          isOpen={isConsultationFormOpen}
          onClose={handleCloseConsultation}
        />
      
      </div>
    </SettingsProvider>
  );
}