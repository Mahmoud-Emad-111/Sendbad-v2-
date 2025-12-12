import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from './Button';

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setEmail('');
    }, 500);
  };

  return (
    <footer className="bg-[var(--color-neutral-dark)] text-white">
      {/* Newsletter */}
      {/* <div className="border-b border-white/10">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
            <h3 className="text-white mb-3">احصل على كتالوج Sindbad</h3>
            <p className="text-gray-400 mb-6">
              اشترك في نشرتنا البريدية واحصل على كتالوج PDF مجاني
            </p>
            
            {!submitted ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
                <Button variant="accent" size="md" type="submit">
                  <Send className="w-5 h-5" />
                  اشترك الآن
                </Button>
              </form>
            ) : (
              <div className="bg-[var(--color-success)]/20 border border-[var(--color-success)] rounded-xl px-6 py-4 max-w-md mx-auto">
                <p className="text-white m-0">✓ شكراً! تم إرسال الكتالوج إلى بريدك</p>
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Main Footer */}
      <div className="container py-12" style={{ paddingTop: '1rem'}}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">S</span>
              </div>
              <span className="">Sindbad</span>
            </div>
            <p className="text-gray-400 text-sm">
              خزائن مطابخ مخصصة بجودة عالية وتصميم عصري. نحول مطبخك إلى تحفة فنية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  من نحن
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  المعرض
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  تواصل معنا
                </a>
              </li>
              <li>
                <a href="#careers" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  الوظائف
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white mb-4">خدماتنا</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  تصميم مطابخ عصرية
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  تصميم مطابخ كلاسيكية
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  تصميم 3D مجاني
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  استشارة منزلية
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white mb-4">قانوني</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a href="#warranty" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  سياسة الضمان
                </a>
              </li>
              <li>
                <a href="#returns" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">
                  سياسة الاسترجاع
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p className="m-0">
              © 2025 Sindbad. جميع الحقوق محفوظة.
            </p>
            <p className="m-0">
              صنع بـ ❤️ في المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
