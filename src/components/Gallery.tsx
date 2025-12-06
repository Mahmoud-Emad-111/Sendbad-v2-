import { useState } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
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
    material: 'MDF عالي الجودة',
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
];

interface GalleryProps {
  onRequestSimilar?: (item: GalleryItem) => void;
}

export function Gallery({ onRequestSimilar }: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showBefore, setShowBefore] = useState(false);
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
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2>معرض أعمالنا</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            شاهد مشاريعنا المنجزة - قبل وبعد التحويل
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['all', 'عصري', 'كلاسيكي', 'بسيط', 'داكن'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-5 py-2 rounded-full transition-all ${
                filter === filterOption
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption === 'all' ? 'الكل' : filterOption}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] overflow-hidden cursor-pointer hover:shadow-[var(--shadow-lg)] transition-all duration-300"
              onClick={() => setSelectedItem(item)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <ImageWithFallback
                  src={item.after}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-white m-0">{item.title}</h4>
                    <p className="text-sm text-white/90 m-0">{item.area}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
                  {item.style}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>المادة: {item.material}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              aria-label="السابق"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
              aria-label="التالي"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-5xl w-full">
              <div className="relative aspect-[16/10] mb-4 rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={showBefore ? selectedItem.before : selectedItem.after}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setShowBefore(!showBefore)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-[var(--color-neutral-dark)] rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {showBefore ? 'عرض: بعد' : 'عرض: قبل'}
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
                <h3 className="text-white mb-3">{selectedItem.title}</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-white/70">النمط</div>
                    <div className="">{selectedItem.style}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">المادة</div>
                    <div className="">{selectedItem.material}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">المساحة</div>
                    <div className="">{selectedItem.area}</div>
                  </div>
                </div>
                <Button
                  variant="accent"
                  size="md"
                  onClick={() => onRequestSimilar?.(selectedItem)}
                >
                  اطلب تصميم مشابه
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
