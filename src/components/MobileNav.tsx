import { useEffect, useState } from 'react';
import { Home, Grid3x3, Phone, User, Sparkles } from 'lucide-react';

interface MobileNavProps {
  onOpenConsultation: () => void;
}

export function MobileNav({ onOpenConsultation }: MobileNavProps) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'estimator', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

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

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'estimator', label: 'احسب', icon: Sparkles },
    { id: 'gallery', label: 'المعرض', icon: Grid3x3 },
    { id: 'contact', label: 'تواصل', icon: Phone },
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
    <>
      {/* Spacer to prevent content from being hidden behind the nav */}
      <div className=" md:hidden" />
      
      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_30px_rgba(0,0,0,0.1)] safe-area-inset-bottom">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                  isActive ? 'text-[var(--color-primary)]' : 'text-gray-500'
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--color-primary)] rounded-full" />
                )}
                
                {/* Icon Container */}
                <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                  
                  {/* Glow Effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-[var(--color-primary)] rounded-full blur-lg opacity-20 animate-pulse" />
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs transition-all duration-300 ${
                  isActive ? 'font-semibold opacity-100' : 'opacity-70'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Safe area for iPhone notch */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* Floating CTA Button - Shows on scroll */}
      <FloatingCTA onOpenConsultation={onOpenConsultation} />
    </>
  );
}

function FloatingCTA({ onOpenConsultation }: { onOpenConsultation: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={onOpenConsultation}
      className={`hidden md:flex fixed bottom-8 left-8 z-40 items-center gap-3 px-6 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] text-white rounded-full shadow-[0_8px_30px_rgba(75,163,179,0.4)] hover:shadow-[0_12px_40px_rgba(75,163,179,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <Sparkles className="w-5 h-5" />
      <span className="font-semibold">استشارة مجانية</span>
    </button>
  );
}
