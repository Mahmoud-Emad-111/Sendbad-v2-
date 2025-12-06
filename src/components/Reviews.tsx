import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  project: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'أحمد السالم',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    text: 'خدمة ممتازة وجودة عالية. الفريق محترف جداً وملتزم بالمواعيد. مطبخي الجديد فاق كل توقعاتي!',
    project: 'مطبخ عصري 15 م²',
    date: 'منذ أسبوعين',
  },
  {
    id: 2,
    name: 'فاطمة العتيبي',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    text: 'تعامل راقي من البداية للنهاية. التصميم 3D ساعدني كثير في اختيار التصميم المناسب.',
    project: 'مطبخ كلاسيكي 18 م²',
    date: 'منذ شهر',
  },
  {
    id: 3,
    name: 'محمد الغامدي',
    avatar: 'https://i.pravatar.cc/150?img=33',
    rating: 5,
    text: 'أفضل قرار اتخذته! الجودة ممتازة والأسعار منافسة. أنصح بهم بشدة.',
    project: 'مطبخ بسيط 12 م²',
    date: 'منذ 3 أسابيع',
  },
  {
    id: 4,
    name: 'نورة الشهري',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    text: 'الاستشارة المجانية كانت مفيدة جداً. الفريق أعطاني أفكار رائعة لتحسين المساحة.',
    project: 'مطبخ داكن 20 م²',
    date: 'منذ أسبوع',
  },
];

export function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

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
                      i < currentReview.rating
                        ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
                        : 'text-gray-500'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-xl md:text-2xl text-center mb-8 text-white leading-relaxed">
                "{currentReview.text}"
              </p>

              {/* Reviewer Info */}
              <div className="flex items-center justify-center gap-4">
                <ImageWithFallback
                  src={currentReview.avatar}
                  alt={currentReview.name}
                  className="w-16 h-16 rounded-full border-2 border-[var(--color-accent)]"
                />
                <div className="text-right">
                  <div className="text-white">{currentReview.name}</div>
                  <div className="text-sm text-gray-400">{currentReview.project}</div>
                  <div className="text-xs text-gray-500">{currentReview.date}</div>
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
