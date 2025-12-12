import { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiFetch } from '../lib/api';

interface Review {
  id: number;
  author?: string;
  avatar?: string;
  rating?: number;
  content?: string;
  created_at?: string;
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchReviews = async () => {
    try {
      const res = await apiFetch('reviews');
      const data = res?.data ?? res;
      setReviews(Array.isArray(data) ? data : []);
      setCurrentIndex(0);
    } catch (e) {
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
    const onUpdated = () => fetchReviews();
    window.addEventListener('reviews:updated', onUpdated);
    return () => window.removeEventListener('reviews:updated', onUpdated);
  }, []);

  const next = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex] || ({} as Review);
  const currentAuthor = (currentReview as any).author || (currentReview as any).name || (currentReview as any).username || '';
  const currentContent = (currentReview as any).content || (currentReview as any).text || (currentReview as any).comment || '';
  const currentDate = (currentReview as any).created_at || (currentReview as any).date || (currentReview as any).createdAt || '';

  return (
    <section className="section-padding bg-[var(--color-neutral-dark)] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-white">آراء عملائنا</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            ثقة أكثر من 180 عميل في خدماتنا
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white/5 backdrop-blur-sm rounded-[var(--radius-card)] p-8 md:p-12">
            <Quote className="w-16 h-16 text-[var(--color-accent)] opacity-30 absolute top-4 right-4" />
            
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < (currentReview.rating || 0)
                        ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                        : 'text-gray-500'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-xl md:text-2xl text-center mb-8 text-white leading-relaxed">
                "{currentContent}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center justify-center gap-4">
                <ImageWithFallback
                  src={(currentReview as any).avatar}
                  alt={currentAuthor}
                  className="w-16 h-16 rounded-full border-2 border-[var(--color-accent)]"
                />
                <div className="text-right">
                  <div className="text-white">{currentAuthor}</div>
                  <div className="text-sm text-gray-400">{(currentReview as any).project || ''}</div>
                  <div className="text-xs text-gray-500">{currentDate ? new Date(currentDate).toLocaleDateString() : ''}</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="المراجعة السابقة"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-[var(--color-accent)] w-8'
                        : 'bg-white/30'
                    }`}
                    aria-label={`المراجعة ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="المراجعة التالية"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <a
              href="#reviews"
              className="text-[var(--color-accent)] hover:underline inline-flex items-center gap-2"
            >
              اقرأ جميع المراجعات (180+)
              <ChevronLeft className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
