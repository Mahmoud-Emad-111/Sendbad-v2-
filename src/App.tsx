import { useState } from 'react';
import { ModernNavbar } from './components/ModernNavbar';
import { MobileNav } from './components/MobileNav';
import { ModernHero } from './components/ModernHero';
import { ModernEstimator } from './components/ModernEstimator';
import { ModernGallery } from './components/ModernGallery';
import { TrustStrip } from './components/TrustStrip';
import { Reviews } from './components/Reviews';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ConsultationForm } from './components/ConsultationForm';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Dashboard } from './components/Dashboard';

type AppView = 'website' | 'dashboard';

export default function App() {
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('website');

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

  if (currentView === 'dashboard') {
    return <Dashboard onBackToSite={() => setCurrentView('website')} />;
  }

  return (
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

      {/* Consultation Form Modal */}
      <ConsultationForm 
        isOpen={isConsultationFormOpen}
        onClose={handleCloseConsultation}
      />
    </div>
  );
}