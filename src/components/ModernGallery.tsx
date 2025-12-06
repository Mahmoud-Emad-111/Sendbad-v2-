import { useState } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './Button';

interface GalleryItem {
  id: number;
  title: string;
  before: string;
  after: string;
  style: string;
  material: string;
  area: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'مطبخ عصري فاخر',
    before: 'https://images.unsplash.com/photo-1593068658336-4588efd97854?w=800',
    after: 'https://images.unsplash.com/photo-1610177534644-34d881503b83?w=800',
    style: 'عصري',
    material: 'خشب بريميوم',
    area: '15 متر مربع',
  },
  {
    id: 2,
    title: 'مطبخ كلاسيكي أنيق',
    before: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
    after: 'https://images.unsplash.com/photo-1686023858216-4f54c853acf2?w=800',
    style: 'كلاسيكي',
    material: 'خشب طبيعي',
    area: '18 متر مربع',
  },
  {
    id: 3,
    title: 'مطبخ بسيط معاصر',
    before: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
    after: 'https://images.unsplash.com/photo-1714860534425-7ce04e013dec?w=800',
    style: 'بسيط',
    material: 'MDF ع��لي الجودة',
    area: '12 متر مربع',
  },
  {
    id: 4,
    title: 'مطبخ داكن فخم',
    before: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
    after: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800',
    style: 'داكن',
    material: 'خشب ماهوجني',
    area: '20 متر مربع',
  },
  {
    id: 5,
    title: 'مطبخ مفتوح حديث',
    before: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
    after: 'https://images.unsplash.com/photo-1610177534644-34d881503b83?w=800',
    style: 'عصري',
    material: 'خشب وحجر',
    area: '22 متر مربع',
  },
  {
    id: 6,
    title: 'مطبخ صغير ذكي',
    before: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
    after: 'https://images.unsplash.com/photo-1714860534425-7ce04e013dec?w=800',
    style: 'بسيط',
    material: 'MDF',
    area: '8 متر مربع',
  },
];

interface ModernGalleryProps {
  onRequestSimilar?: (item: GalleryItem) => void;
}

export function ModernGallery({ onRequestSimilar }: ModernGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.style.toLowerCase().includes(filter.toLowerCase()));

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = galleryItems.findIndex(item => item.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setSelectedItem(galleryItems[nextIndex]);

  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = galleryItems.findIndex(item => item.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setSelectedItem(galleryItems[prevIndex]);

  };

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
      </div>

      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">أعمالنا المميزة</span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-4">معرض التحولات الساحرة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            شاهد كيف نحوّل المطابخ العادية إلى مساحات استثنائية
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'عصري', 'كلاسيكي', 'بسيط', 'داكن'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${filter === filterOption
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
            >
              {filterOption === 'all' ? 'الكل' : filterOption}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 animate-[fadeIn_0.5s_ease-out]"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedItem(item)}
            >
              {/* Image Container */}
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={item.after}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <h4 className="text-white text-xl mb-2">{item.title}</h4>
                  <p className="text-white/90 text-sm mb-3">{item.area} • {item.material}</p>
                  <div className="flex items-center gap-2 text-white">
                    <Maximize2 className="w-4 h-4" />
                    <span className="text-sm">اضغط للعرض الكامل</span>
                  </div>
                </div>

                {/* Style Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg">
                  {item.style}
                </div>


              </div>

              {/* Card Footer */}
              <div className="p-5 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.material}</div>
                  </div>
                  <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:scale-110 transition-all duration-300">
                    <ExternalLink className="w-5 h-5 text-[var(--color-primary)] group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-[fadeIn_0.2s_ease-out]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:rotate-90"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="السابق"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="التالي"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Content */}
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
              {/* Image */}
              <div className="relative aspect-[16/10] mb-4 rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={selectedItem.after}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />


              </div>

              {/* Info Card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white text-3xl mb-4">{selectedItem.title}</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-white/70 mb-1">النمط</div>
                        <div className="font-semibold">{selectedItem.style}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70 mb-1">المادة</div>
                        <div className="font-semibold">{selectedItem.material}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70 mb-1">المساحة</div>
                        <div className="font-semibold">{selectedItem.area}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="accent"
                      size="lg"
                      fullWidth
                      onClick={() => {
                        onRequestSimilar?.(selectedItem);
                        setSelectedItem(null);
                      }}
                    >
                      <Sparkles className="w-5 h-5" />
                      اطلب تصميم مشابه
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
