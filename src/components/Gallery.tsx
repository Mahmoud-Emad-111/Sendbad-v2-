import { useEffect, useState } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './Button';
import { apiFetch, API_BASE } from '../lib/api';

interface GalleryItem {
  id: number;
  title: string;
  text?: string;
  image?: string;
  style?: string;
  material?: string;
  area?: string;
  category?: { id: number; name: string } | null;
}

const galleryItemsDefault: GalleryItem[] = [];

interface GalleryProps {
  onRequestSimilar?: (item: GalleryItem) => void;
}

export function Gallery({ onRequestSimilar }: GalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showBefore, setShowBefore] = useState(false);
  const [filter, setFilter] = useState<number | 'all'>('all');
  const [items, setItems] = useState<GalleryItem[]>(galleryItemsDefault);
  const [categories, setCategories] = useState<Array<{id: number|string, name: string}>>([]);
  console.log('[Gallery] render with items:', items);
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      console.log('[Gallery] start fetching products/categories');
      try {
        const p = await apiFetch('products');
        const c = await apiFetch('categories');
        console.log('[Gallery] fetched products (raw):', p);
        console.log('[Gallery] fetched categories (raw):', c);
        const products = (p && (p.data ?? p)) || [];
        const cats = (c && (c.data ?? c)) || [];
        if (!mounted) return;
        setItems(products.map((pr: any) => ({
          id: pr.id,
          title: pr.title,
          image: pr.image,
          text: pr.text,
          material: pr.material || '',
          area: pr.area || '',
          category: pr.category ? { id: pr.category.id, name: pr.category.name } : (pr.category_id ? { id: pr.category_id, name: '' } : null),
        })));
        const normalizedCats = Array.isArray(cats) ? cats.map((x: any, i: number) => {
          if (!x) return { id: i, name: '' };
          if (typeof x === 'string') return { id: x, name: x };
          return { id: x.id ?? i, name: x.name ?? x.title ?? '' };
        }) : [];
        // fallback: if no categories returned from API, derive categories from products
        let finalCats = normalizedCats;
        if (finalCats.length === 0) {
          const fromProducts: Record<string, { id: number|string, name: string }> = {};
          (products || []).forEach((pr: any) => {
            const cat = pr.category ? { id: pr.category.id, name: pr.category.name } : (pr.category_id ? { id: pr.category_id, name: '' } : null);
            if (cat) fromProducts[String(cat.id)] = cat;
          });
          finalCats = Object.values(fromProducts);
        }
        setCategories([{ id: 'all', name: 'الكل' }, ...finalCats]);
      } catch (err:any) {
        console.error('[Gallery] fetch error:', err);
        // still try to populate from partial results if possible
        try {
          // attempt to fetch products only
          const p2 = await apiFetch('products');
          const products = (p2 && (p2.data ?? p2)) || [];
          if (!mounted) return;
          setItems(products.map((pr: any) => ({
            id: pr.id,
            title: pr.title,
            image: pr.image,
            text: pr.text,
            material: pr.material || '',
            area: pr.area || '',
            category: pr.category ? { id: pr.category.id, name: pr.category.name } : (pr.category_id ? { id: pr.category_id, name: '' } : null),
          })));
          // derive categories from products
          const fromProducts: Record<string, { id: number|string, name: string }> = {};
          products.forEach((pr: any) => {
            const cat = pr.category ? { id: pr.category.id, name: pr.category.name } : (pr.category_id ? { id: pr.category_id, name: '' } : null);
            if (cat) fromProducts[String(cat.id)] = cat;
          });
          setCategories([{ id: 'all', name: 'الكل' }, ...Object.values(fromProducts)]);
        } catch (e2:any) {
          console.error('[Gallery] products fallback fetch failed:', e2);
        }
      }
    };
    fetchData();
    const onUpdated = async () => {
      try {
        const p = await apiFetch('products');
        const products = (p && (p.data ?? p)) || [];
        if (!mounted) return;
        setItems(products.map((pr: any) => ({
          id: pr.id,
          title: pr.title,
          image: pr.image,
          text: pr.text,
          material: pr.material || '',
          area: pr.area || '',
          category: pr.category ? { id: pr.category.id, name: pr.category.name } : (pr.category_id ? { id: pr.category_id, name: '' } : null),
        })));
      } catch (e:any) {
        console.error('[Gallery] products:updated fetch error:', e);
      }
      try {
        const c = await apiFetch('categories');
        const cats = (c && (c.data ?? c)) || [];
        const normalizedCats = Array.isArray(cats) ? cats.map((x: any, i: number) => {
          if (!x) return { id: i, name: '' };
          if (typeof x === 'string') return { id: x, name: x };
          return { id: x.id ?? i, name: x.name ?? x.title ?? '' };
        }) : [];
        if (normalizedCats.length === 0) {
          // derive from current items
          const fromProducts: Record<string, { id: number|string, name: string }> = {};
          (items || []).forEach((pr: any) => {
            const cat = pr.category ? { id: pr.category.id, name: pr.category.name } : (pr.category_id ? { id: pr.category_id, name: '' } : null);
            if (cat) fromProducts[String(cat.id)] = cat;
          });
          setCategories([{ id: 'all', name: 'الكل' }, ...Object.values(fromProducts)]);
        } else {
          setCategories([{ id: 'all', name: 'الكل' }, ...normalizedCats]);
        }
      } catch (e:any) {
        console.error('[Gallery] categories:updated fetch error:', e);
      }
    };
    window.addEventListener('products:updated', onUpdated);
    window.addEventListener('categories:updated', onUpdated);
    return () => { mounted = false; window.removeEventListener('products:updated', onUpdated); window.removeEventListener('categories:updated', onUpdated); };
  }, []);

  const resolveImage = (img?: string) => {
    if (!img) return undefined;
    // already absolute
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    // prefixed storage path
    if (img.startsWith('/storage/') || img.startsWith('storage/')) return img.startsWith('/') ? img : '/' + img;
    // if it's a plain path like uploads/..., prefix with backend origin + /storage/
    try {
      const apiBaseRoot = API_BASE.replace(/\/api\/?$/, '');
      return apiBaseRoot.replace(/\/$/, '') + '/storage/' + img.replace(/^\//, '');
    } catch (e) {
      return img;
    }
  };

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => (item.category && item.category.id == filter));

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prevIndex]);
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
          {(categories.length ? categories : [{id:'all',name:'الكل'}]).map((cat) => (
            <button
              key={String(cat.id)}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2 rounded-full transition-all ${
                filter === cat.id
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
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
                  src={resolveImage(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-white m-0">{item.title}</h4>
                    <p className="text-sm text-white/90 m-0">{item.text ? (item.text.length > 120 ? item.text.slice(0,120) + '...' : item.text) : ''}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm">
                  {item.category?.name || ''}
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
                  src={resolveImage(selectedItem.image)}
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
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-white/70">القسم</div>
                    <div className="">{selectedItem.category?.name || ''}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70">الوصف</div>
                    <div className="">{selectedItem.text}</div>
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
