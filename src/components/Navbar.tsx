import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  onOpenConsultation: () => void;
  onNavigateToDashboard?: () => void;
}

export function Navbar({ onOpenConsultation, onNavigateToDashboard }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', href: '#home' },
    { label: 'المعرض', href: '#gallery' },
    { label: 'من نحن', href: '#about' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-[var(--shadow-md)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">S</span>
            </div>
            <span
              className={`transition-colors ${
                isScrolled ? 'text-[var(--color-neutral-dark)]' : 'text-white'
              }`}
            >
              Sindbad
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-[var(--color-primary)] ${
                  isScrolled ? 'text-[var(--color-neutral-dark)]' : 'text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            {onNavigateToDashboard && (
              <button
                onClick={onNavigateToDashboard}
                className={`transition-colors hover:text-[var(--color-primary)] ${
                  isScrolled ? 'text-[var(--color-neutral-dark)]' : 'text-white'
                }`}
              >
                لوحة التحكم
              </button>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+966501234567"
              className={`p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-white/10'
              }`}
            >
              <Phone
                className={`w-5 h-5 ${
                  isScrolled ? 'text-[var(--color-primary)]' : 'text-white'
                }`}
              />
            </a>
            <Button
              variant={isScrolled ? 'primary' : 'accent'}
              size="sm"
              onClick={onOpenConsultation}
            >
              استشارة مجانية
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isScrolled ? 'text-[var(--color-neutral-dark)]' : 'text-white'
            }`}
            aria-label="القائمة"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-col gap-4 bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-md)] p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[var(--color-neutral-dark)] hover:text-[var(--color-primary)] py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {onNavigateToDashboard && (
                <button
                  onClick={() => {
                    onNavigateToDashboard();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[var(--color-neutral-dark)] hover:text-[var(--color-primary)] py-2 transition-colors text-right"
                >
                  لوحة التحكم
                </button>
              )}
              <hr className="border-gray-200" />
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  onOpenConsultation();
                  setIsMobileMenuOpen(false);
                }}
              >
                <Phone className="w-5 h-5" />
                استشارة مجانية
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
