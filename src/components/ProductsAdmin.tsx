import React, { useEffect, useState } from 'react';
import { apiFetch, apiFetchAuth } from '../lib/api';
import { Button } from './Button';
import UploadButton from './UploadButton';

export default function ProductsAdmin() {
  const [list, setList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          apiFetch('products').then(r => r?.data ?? r),
          apiFetch('categories').then(r => r?.data ?? r),
        ]);
        if (!mounted) return;
        setList(Array.isArray(pRes) ? pRes : []);
        // normalize categories: some endpoints may return strings or objects
        const catsRaw = Array.isArray(cRes) ? cRes : [];
        const cats = catsRaw.map((x: any, i: number) => {
          if (!x) return { id: i, name: '' };
          if (typeof x === 'string') return { id: x, name: x };
          return { id: x.id ?? i, name: x.name ?? x.title ?? '' };
        });
        // debug logs to help troubleshoot empty select
        console.log('[ProductsAdmin] raw categories response:', cRes);
        console.log('[ProductsAdmin] normalized categories:', cats);
        setCategories(cats);
      } catch (e) {
        setList([]);
        setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();

    const onCatsUpdated = () => {
      apiFetch('categories').then(r => r?.data ?? r).then((c) => {
        if (!mounted) return;
        const catsRaw = Array.isArray(c) ? c : [];
        const cats = catsRaw.map((x: any, i: number) => {
          if (!x) return { id: i, name: '' };
          if (typeof x === 'string') return { id: x, name: x };
          return { id: x.id ?? i, name: x.name ?? x.title ?? '' };
        });
        console.log('[ProductsAdmin] categories:updated raw:', c);
        console.log('[ProductsAdmin] categories:updated normalized:', cats);
        setCategories(cats);
      }).catch(() => {});
    };

    window.addEventListener('categories:updated', onCatsUpdated);
    return () => { mounted = false; window.removeEventListener('categories:updated', onCatsUpdated); };
  }, []);

  const start = (p?: any) => {
    if (!p) {
      setEditing(null); setTitle(''); setText(''); setImage(null); setUploadFiles([]); setCategoryId(null); return;
    }
    setEditing(p);
    setTitle(p.title || ''); setText(p.text || ''); setImage(p.image || null); setCategoryId(p.category_id || null);
  };

  const save = async () => {
    let imageUrl = image;
    if (uploadFiles.length > 0) {
      try {
        const fd = new FormData(); fd.append('file', uploadFiles[0]);
        const uploaded = await apiFetchAuth('media', localStorage.getItem('api_token') || undefined, { method: 'POST', body: fd });
        const mediaObj = uploaded?.data ?? uploaded;
        imageUrl = mediaObj?.url ?? (mediaObj?.path ? `/storage/${mediaObj.path}` : imageUrl);
      } catch (e) { alert('فشل رفع الصورة'); }
    }

    const payload: any = { title, text, image: imageUrl, category_id: categoryId, visible: true };
    try {
      if (editing) {
        const res = await apiFetchAuth(`products/${editing.id}`, undefined, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setList(list.map(l => l.id === editing.id ? res.data ?? res : l));
        window.dispatchEvent(new Event('products:updated'));
      } else {
        const res = await apiFetchAuth('products', undefined, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const created = res.data ?? res;
        setList([created, ...list]);
        window.dispatchEvent(new Event('products:updated'));
      }
      start();
    } catch (e) { alert('فشل الحفظ'); }
  };

  const del = async (id: number) => {
    if (!confirm('حذف المنتج؟')) return;
    try {
      await apiFetchAuth(`products/${id}`, undefined, { method: 'DELETE' });
      setList(list.filter(l => l.id !== id));
      window.dispatchEvent(new Event('products:updated'));
    } catch (e) { alert('فشل الحذف'); }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg">المنتجات</h3>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="mb-3">إضافة / تعديل منتج</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1">العنوان</label>
            <input className="w-full p-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">الوصف</label>
            <textarea className="w-full p-2 border rounded" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1">القسم</label>
            <select className="w-full p-2 border rounded" value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}>
              <option value="">بدون قسم</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block mb-1">صورة المنتج</label>
            <div className="flex items-center gap-2">
              <UploadButton multiple={false} onFile={(f) => { setUploadFiles([f]); setImage(null); }} />
              <div className="w-28 h-20 rounded overflow-hidden border bg-gray-50">
                {uploadFiles.length > 0 ? (
                  <img src={URL.createObjectURL(uploadFiles[0])} className="w-full h-full object-cover" />
                ) : image ? (
                  <img src={image} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">لم تُختر صورة</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="primary" onClick={save}>{editing ? 'تحديث' : 'إضافة'}</Button>
          <Button variant="ghost" onClick={() => start()}>إفراغ النموذج</Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="mb-3">قائمة المنتجات</h4>
        {loading ? <div>جارٍ التحميل...</div> : (
          <div className="space-y-3">
            {list.length === 0 && <div className="text-sm text-gray-500">لا توجد منتجات</div>}
            {list.map(p => (
              <div key={p.id} className="bg-gray-50 p-3 rounded flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded overflow-hidden bg-white border">
                    <img src={p.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-gray-600">{p.text ? (p.text.length > 80 ? p.text.slice(0,80) + '...' : p.text) : ''}</div>
                    <div className="text-xs text-gray-500">{p.category?.name || ''}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => start(p)}>تعديل</Button>
                  <Button variant="destructive" size="sm" onClick={() => del(p.id)}>حذف</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
