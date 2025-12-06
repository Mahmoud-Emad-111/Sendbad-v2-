import { useState, useEffect } from 'react';
import { Phone, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface ModernNavbarProps {
  onOpenConsultation: () => void;
  onNavigateToDashboard?: () => void;
}

export function ModernNavbar({ onOpenConsultation, onNavigateToDashboard }: ModernNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Detect active section
      const sections = ['home', 'estimator', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', href: '#home', id: 'home' },
    { label: 'احسب التكلفة', href: '#estimator', id: 'estimator' },
    { label: 'المعرض', href: '#gallery', id: 'gallery' },
    { label: 'تواصل معنا', href: '#contact', id: 'contact' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group" onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-600)] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-600)] rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
            </div>
            <div>
              <div
                className={`font-bold text-xl transition-colors ${
                  isScrolled ? 'text-[var(--color-neutral-dark)]' : 'text-white'
                }`}
              >
                Sindbad
              </div>
              <div className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
                خزائن المطابخ
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.id)}
                className={`relative px-5 py-2 rounded-full transition-all duration-300 ${
                  activeSection === link.id
                    ? 'bg-white text-[var(--color-primary)] shadow-lg'
                    : isScrolled
                    ? 'text-[var(--color-neutral-dark)] hover:bg-white/50'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span className="relative z-10 font-medium">{link.label}</span>
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+966501234567"
              className={`p-3 rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'bg-gray-100 hover:bg-gray-200'
                  : 'bg-white/10 hover:bg-white/20 backdrop-blur-md'
              }`}
            >
              <Phone
                className={`w-5 h-5 ${
                  isScrolled ? 'text-[var(--color-primary)]' : 'text-white'
                }`}
              />
            </a>
            <button
              onClick={onOpenConsultation}
              className="group relative px-6 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[#d4a557] text-[var(--color-neutral-dark)] rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                استشارة مجانية
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4a557] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
