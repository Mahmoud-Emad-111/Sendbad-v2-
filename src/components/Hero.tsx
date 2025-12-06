import { useState } from 'react';
import { Button } from './Button';
import { Play, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onOpenConsultation: () => void;
  onOpenGallery: () => void;
}

export function Hero({ onOpenConsultation, onOpenGallery }: HeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image/Video Container */}
      <div className="absolute inset-0 z-0">
        {!videoLoaded && (
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1610177534644-34d881503b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY0ODU0MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="مطبخ حديث"
            className="w-full h-full object-cover"
          />
        )}
        {/* Video overlay - يمكن استبداله بفيديو حقيقي */}
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1610177534644-34d881503b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        >
          <source src="#" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neutral-dark)]/80 via-[var(--color-neutral-dark)]/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 text-white">
        <div className="max-w-3xl">
          {/* Main Heading */}
          <h1 className="mb-4 md:mb-6 animate-[fadeIn_0.8s_ease-out]">
            خزائن مطابخ مُصمّمة خصيصاً — جودة تلامس التفاصيل
          </h1>
          
          {/* Subtitle */}
          <p className="mb-6 md:mb-8 text-gray-200 animate-[fadeIn_1s_ease-out]">
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