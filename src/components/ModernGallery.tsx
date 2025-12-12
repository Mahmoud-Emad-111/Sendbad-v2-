import { useEffect, useState } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './Button';
import { apiFetch, API_BASE } from '../lib/api';

interface GalleryItem {
  id: number;
  title: string;
  before: string;
  after: string;
  style: string;
  material: string;
  area: string;
  text?: string;
  categoryId?: number | string | null;
}
console.log('ModernGallery: component loaded');
const staticGalleryItems: GalleryItem[] = [
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
];

interface ModernGalleryProps {
  onRequestSimilar?: (item: GalleryItem) => void;
}

export function ModernGallery({ onRequestSimilar }: ModernGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[]>(staticGalleryItems);
  const [categories, setCategories] = useState<Array<{id:number|string, name:string}>>([]);

  const [filter, setFilter] = useState<number | string | 'all'>('all');

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => (
      // match by category id if available
      (item.categoryId !== undefined && item.categoryId !== null && String(item.categoryId) === String(filter))
      // or fallback to matching style text
      || (item.style || '').toString().toLowerCase().includes(String(filter).toLowerCase())
    ));

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex === -1 || filteredItems.length === 0) return;
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex === -1 || filteredItems.length === 0) return;
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prevIndex]);
  };

  // resolve image helper (handles absolute urls and storage paths)
  const resolveImage = (img?: string) => {
    if (!img) return undefined;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/storage/') || img.startsWith('storage/')) return img.startsWith('/') ? img : '/' + img;
    try {
      const apiBaseRoot = API_BASE.replace(/\/api\/?$/, '');
      return apiBaseRoot.replace(/\/$/, '') + '/storage/' + img.replace(/^\//, '');
    } catch (e) {
      return img;
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      console.log('[ModernGallery] fetching products/categories');
      try {
        const p = await apiFetch('products');
        const c = await apiFetch('categories');
        const products = (p && (p.data ?? p)) || [];
        const cats = (c && (c.data ?? c)) || [];
        if (!mounted) return;
        const mapped = products.map((pr: any) => ({
          id: pr.id,
          title: pr.title || pr.name || 'بدون عنوان',
          before: resolveImage(pr.image) || undefined,
          after: resolveImage(pr.image) || undefined,
          style: pr.category ? pr.category.name : (pr.style || 'عام'),
          categoryId: pr.category ? pr.category.id : (pr.category_id ?? null),
          material: pr.material || '',
          area: pr.area || '',
          text: pr.text ?? pr.description ?? '',
        }));
        setItems(mapped.length ? mapped : staticGalleryItems);
        const normalizedCats = Array.isArray(cats) ? cats.map((x:any,i:number)=>({ id: x.id ?? i, name: x.name ?? x.title ?? String(x) })) : [];
        if (normalizedCats.length > 0) setCategories(normalizedCats);
        else {
          // derive from products
          const by = {} as Record<string, {id:number|string,name:string}>;
          mapped.forEach(m=>{ if (m.style) by[String(m.style)] = { id: m.style, name: m.style }; });
          setCategories(Object.values(by));
        }
      } catch (err:any) {
        console.error('[ModernGallery] fetch error', err);
        // leave static items
      }
    };
    fetchData();
    const onUpdated = async () => { if (mounted) fetchData(); };
    window.addEventListener('products:updated', onUpdated);
    window.addEventListener('categories:updated', onUpdated);
    return () => { mounted = false; window.removeEventListener('products:updated', onUpdated); window.removeEventListener('categories:updated', onUpdated); };
  }, []);

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
          <button
            key="all"
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${filter === 'all'
                ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
          >
            الكل
          </button>

          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${String(filter) === String(cat.id)
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
              >
                {cat.name}
              </button>
            ))
          ) : (
            // fallback to old static list if API categories are empty
            ['عصري', 'كلاسيكي', 'بسيط', 'داكن'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${filter === filterOption
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
              >
                {filterOption}
              </button>
            ))
          )}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-4 animate-[fadeIn_0.2s_ease-out]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 sm:hover:rotate-90"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="السابق"
              style={{ zIndex: '1255',backgroundColor: 'color-mix(in oklab, var(--color-white) 30%, #000000b5)' }}
            >
              <ChevronLeft className="w-5 sm:w-7 h-5 sm:h-7" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="التالي"
              style={{ zIndex: '1255',backgroundColor: 'color-mix(in oklab, var(--color-white) 30%, #000000b5)' }}
            >
              <ChevronRight className="w-5 sm:w-7 h-5 sm:h-7" />
            </button>

            {/* Content */}
            <div 
              style={{ maxWidth: '800px'}}
            className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl w-full max-h-[80vh] sm:max-h-[90vh] overflow-y-auto no-scrollbar">
              {/* Image */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] mb-3 sm:mb-4 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[45vh] sm:max-h-[70vh]">
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
                    <h3 className="text-white text-lg sm:text-3xl mb-2 sm:mb-4">{selectedItem.title}</h3>
                    <div>
                      <div className="text-xs sm:text-sm text-white/70 mb-1 sm:mb-2">الوصف</div>
                      <div className="prose prose-invert max-w-none text-white text-xs sm:text-base">
                        {selectedItem.text && String(selectedItem.text).trim().length > 0
                          ? selectedItem.text
                          : 'لا يوجد وصف'}
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
