import { useState, useEffect } from 'react';
import { useSettings } from '../lib/settings';
import { API_BASE } from '../lib/api';
import { Button } from './Button';
import { Play, CheckCircle2, Sparkles, ArrowDown, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ModernHeroProps {
  onOpenConsultation: () => void;
  onOpenGallery: () => void;
}

export function ModernHero({ onOpenConsultation, onOpenGallery }: ModernHeroProps) {
  const settings = useSettings();
  let heroImages: string[] = [];
  try {
    if (settings?.hero_images) {
      if (Array.isArray(settings.hero_images)) heroImages = settings.hero_images;
      else heroImages = JSON.parse(settings.hero_images || '[]');
    }
  } catch (e) {
    heroImages = [];
  }
  if (!heroImages || heroImages.length === 0) {
    heroImages = [
      'https://images.unsplash.com/photo-1686023858216-4f54c853acf2?w=1400',
      'https://images.unsplash.com/photo-1610177534644-34d881503b83?w=1400',
      'https://images.unsplash.com/photo-1593068658336-4588efd97854?w=1400'
    ];
  }

  // Ensure image URLs are absolute (backend returns '/storage/...' paths)
  const apiOrigin = API_BASE.replace(/\/api\/?$/, '');
  heroImages = heroImages.map((u) => {
    if (!u) return u;
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.startsWith('/')) return apiOrigin + u;
    return u;
  });

  const [currentHero, setCurrentHero] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrentHero((c) => (c + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [paused, heroImages.length]);
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#1a2942]">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-3xl -top-48 -right-48 animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-[var(--color-accent)]/10 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1610177534644-34d881503b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="مطبخ حديث"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f1f3a]/90 to-[#0a1628]" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-white space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full animate-[fadeIn_0.6s_ease-out]">
              <Star className="w-4 h-4 text-[var(--color-accent)] fill-[var(--color-accent)]" />
              <span className="text-sm">الخيار الأول لأكثر من 180+ عميل</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 animate-[fadeIn_0.8s_ease-out]">
              <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight">
                <span className="block text-white">{settings?.hero_title_line1 || 'مطبخ أحلامك'}</span>
                <span className="block bg-gradient-to-r from-[var(--color-accent)] via-[#f0c674] to-[var(--color-accent)] bg-clip-text text-transparent">
                  {settings?.hero_title_line2 || 'يبدأ من هنا'}
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                {settings?.hero_subtitle || 'تصميم وتصنيع خزائن مطابخ مخصصة بجودة عالمية. نحوّل مساحتك إلى تحفة فنية وظيفية.'}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-[fadeIn_1s_ease-out]">
              {[
                { icon: Sparkles, text: 'تصميم 3D واقعي 100%' },
                { icon: CheckCircle2, text: 'ضمان 10 سنوات' },
                { icon: CheckCircle2, text: 'تركيب مجاني ومتابعة مستمرة' },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5 text-[var(--color-accent)]" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-[fadeIn_1.2s_ease-out]">
              <button
                onClick={onOpenConsultation}
                className="group relative px-8 py-4 bg-gradient-to-r from-[var(--color-accent)] to-[#d4a557] text-[var(--color-neutral-dark)] rounded-2xl font-bold shadow-[0_8px_30px_rgba(230,184,107,0.4)] hover:shadow-[0_12px_40px_rgba(230,184,107,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  احصل على استشارة مجانية
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4a557] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                onClick={onOpenGallery}
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                شاهد أعمالنا
              </button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-4 text-sm text-gray-400 animate-[fadeIn_1.4s_ease-out]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                <span>استجابة خلال 24 ساعة</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              {/* <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                <span>معاينة مجانية</span>
              </div> */}
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative hidden lg:block animate-[fadeIn_1s_ease-out]">
            {/* Floating Card */}
            <div className="relative">
                {/* Main Image Card - slideshow */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div
                    className="relative w-full h-[600px]"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                  >
                    {heroImages.map((src, idx) => (
                      <ImageWithFallback
                        key={src}
                        src={src}
                        alt={`مطبخ ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentHero ? 'opacity-100 translate-y-0 scale-100 z-10' : 'opacity-0 -translate-y-6 scale-110 z-0'}`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Stats */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                      <div className="grid grid-cols-3 gap-4 text-center text-white">
                        <div>
                          <div className="text-3xl font-bold text-[var(--color-accent)]">180+</div>
                          <div className="text-sm text-gray-300 mt-1">مشروع منجز</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-[var(--color-accent)]">10</div>
                          <div className="text-sm text-gray-300 mt-1">سنوات ضمان</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-[var(--color-accent)]">100%</div>
                          <div className="text-sm text-gray-300 mt-1">رضا العملاء</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[var(--color-accent)] to-[#d4a557] rounded-3xl opacity-20 blur-2xl animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-600)] rounded-3xl opacity-20 blur-2xl animate-pulse delay-1000" />
              </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-sm">اكتشف المزيد</span>
          <ArrowDown className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
