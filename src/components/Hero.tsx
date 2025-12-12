e القريققققimport { useEffect, useState } from 'react';
import { Button } from './Button';
import { Play, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiFetch } from '../lib/api';

interface HeroProps {
  onOpenConsultation: () => void;
  onOpenGallery: () => void;
}

export function Hero({ onOpenConsultation, onOpenGallery }: HeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    let mounted = true;
    apiFetch('settings')
      .then((s) => {
        console.debug('Hero: fetched settings', s);
        if (!mounted) return;
        // parse hero_images if it's a JSON string
        try {
          if (s && s.hero_images && typeof s.hero_images === 'string') {
            s.hero_images = JSON.parse(s.hero_images);
          }
        } catch (e) {
          // ignore parse errors
        }
        setSettings(s || {});
      })
      .catch(() => {})
      .finally(() => {});
    return () => { mounted = false; };
  }, []);

  // Refresh settings when an external update occurs (AdminSettings dispatches this)
  useEffect(() => {
    const onUpdated = () => {
      apiFetch('settings')
        .then((s) => {
          try {
            if (s && s.hero_images && typeof s.hero_images === 'string') s.hero_images = JSON.parse(s.hero_images);
          } catch (e) { /* ignore */ }
          setSettings(s || {});
        })
        .catch(() => {});
    };
    window.addEventListener('settings:updated', onUpdated);
    return () => window.removeEventListener('settings:updated', onUpdated);
  }, []);
  // Carousel state
  const images: string[] = Array.isArray(settings?.hero_images) && settings.hero_images.length > 0
    ? settings.hero_images
    : [
      'https://images.unsplash.com/photo-1610177534644-34d881503b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY0ODU0MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoplayMs = 4000;

  useEffect(() => {
    if (!images || images.length <= 1) return;
    if (paused) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % images.length), autoplayMs);
    return () => clearInterval(id);
  }, [images, paused]);

  // touch handlers for swipe (use ref so value persists between renders)
  const touchStartX = { current: 0 } as { current: number };
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 30) return;
    if (dx < 0) setCurrent((c) => Math.min(images.length - 1, c + 1));
    else setCurrent((c) => Math.max(0, c - 1));
  };

  return (
    <div className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image/Video Container */}
      <div
        className="absolute inset-0 z-0"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        <div className="w-full h-full relative">
          {images.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              aria-hidden={i !== current}
            >
              <img src={src} alt={settings?.hero_title_line1 || `slide-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neutral-dark)]/80 via-[var(--color-neutral-dark)]/60 to-transparent"></div>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
                aria-label="Next slide"
              >
                ›
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3 h-3 rounded-full ${i === current ? 'bg-white' : 'bg-white/40'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container relative z-10 text-white">
        <div className="max-w-3xl">
          {/* Main Heading */}
          <h1 className="mb-4 md:mb-6 animate-[fadeIn_0.8s_ease-out]">
            {settings?.hero_title_line1 || 'خزائن مطابخ مُصمّمة خصيصاً — جودة تلامس التفاصيل'}
            {settings?.hero_title_line2 ? <span className="block">{settings.hero_title_line2}</span> : null}
          </h1>
          
          {/* Subtitle */}
          <p className="mb-6 md:mb-8 text-gray-200 animate-[fadeIn_1s_ease-out]">
            {settings?.hero_subtitle || (
              <>
                <span className="inline-flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" />
                  <span>تصميم 3D مجاني</span>
                </span>
                <span className="inline-flex items-center gap-2 mb-2 mr-4">
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" />
                  <span>تركيب احترافي</span>
                </span>
                <span className="inline-flex items-center gap-2 mb-2 mr-4">
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" />
                  <span>ضمان 10 سنوات</span>
                </span>
              </>
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-[fadeIn_1.2s_ease-out]">
            <Button
              variant="accent"
              size="lg"
              onClick={onOpenConsultation}
              className="shadow-lg"
            >
              احصل على استشارة مجانية
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onOpenGallery}
              className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white hover:text-[var(--color-neutral-dark)]"
            >
              <Play className="w-5 h-5" />
              شاهد الأمثلة — قبل/بعد
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm animate-[fadeIn_1.4s_ease-out]">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)]" />
            <span>استجابة &lt;24 ساعة • معاينة منزلك خلال 48 ساعة</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}