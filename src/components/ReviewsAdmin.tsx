import React, { useEffect, useState } from 'react';
import { apiFetch, apiFetchAuth } from '../lib/api';
import { Button } from './Button';
import UploadButton from './UploadButton';

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [date, setDate] = useState<string>('');
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      apiFetch('reviews').then(r => r?.data ?? r),
      apiFetch('media').then(m => m?.data ?? m),
    ]).then(([rev, media]) => {
      if (!mounted) return;
      setReviews(rev || []);
      setMediaList(media || []);
    }).catch(() => {}).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const startEdit = (r?: any) => {
    if (!r) {
      setEditing(null);
      setAuthor(''); setRating(5); setContent(''); setAvatar(null); setDate('');
      return;
    }
    setEditing(r);
    setAuthor(r.author || '');
    setRating(r.rating || 5);
    setContent(r.content || '');
    setAvatar(r.avatar || null);
    setDate(r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '');
  };

  const save = async () => {
    // if uploadFiles selected, upload them first and take first url
    let avatarUrl = avatar;
    if (uploadFiles.length > 0) {
      try {
        const fd = new FormData();
        fd.append('file', uploadFiles[0]);
        const uploaded = await apiFetchAuth('media', localStorage.getItem('api_token') || undefined, { method: 'POST', body: fd });
        const mediaObj = uploaded?.data ?? uploaded;
        avatarUrl = mediaObj?.url ?? (mediaObj?.path ? `/storage/${mediaObj.path}` : avatarUrl);
      } catch (e) {
        alert('فشل رفع الصورة');
      }
    }

    const payload: any = { author, rating, content, avatar: avatarUrl, visible: true };
    if (date) payload.date = date;

    try {
      if (editing) {
        const res = await apiFetchAuth(`reviews/${editing.id}`, undefined, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setReviews(reviews.map(r => r.id === editing.id ? res.data ?? res : r));
        window.dispatchEvent(new Event('reviews:updated'));
      } else {
        const res = await apiFetchAuth('reviews', undefined, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const created = res.data ?? res;
        setReviews([created, ...reviews]);
        window.dispatchEvent(new Event('reviews:updated'));
      }
      startEdit();
    } catch (e) {
      alert('فشل الحفظ');
    }
  };

  const del = async (id: number) => {
    if (!confirm('حذف المراجعة؟')) return;
    try {
      await apiFetchAuth(`reviews/${id}`, undefined, { method: 'DELETE' });
      setReviews(reviews.filter(r => r.id !== id));
      window.dispatchEvent(new Event('reviews:updated'));
    } catch (e) { alert('فشل الحذف'); }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg">آراء العملاء</h3>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="mb-3">إضافة / تعديل مراجعة</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block mb-1">اسم المستخدم</label>
            <input className="w-full p-2 border rounded" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1">عدد النجوم</label>
            <select className="w-full p-2 border rounded" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} نجوم</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">التعليق</label>
            <textarea className="w-full p-2 border rounded" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1">صورة المستخدم (من المعرض أو رفع)</label>
            <div className="flex items-center gap-4">
              <UploadButton multiple={false} onFile={(f) => { setUploadFiles([f]); setAvatar(null); }} />
              <div className="text-sm text-gray-600">أو اختر من المعرض أدناه</div>
              <div className="ml-auto">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border border-white/10 bg-white/5 p-1 shadow-sm flex items-center justify-center">
                  {uploadFiles.length > 0 ? (
                    <img src={URL.createObjectURL(uploadFiles[0])} className="w-full h-full object-cover" />
                  ) : avatar ? (
                    <img src={avatar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">لم تُختر صورة</div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {mediaList.map(m => {
                const u = m.url || (m.path ? `/storage/${m.path}` : null);
                if (!u) return null;
                return (
                  <button key={m.id} onClick={() => { setAvatar(u); setUploadFiles([]); }} className={`h-12 w-12 rounded overflow-hidden border ${avatar===u? 'ring-2 ring-[var(--color-primary)]' : ''}`}>
                    <img src={u} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block mb-1">التاريخ</label>
            <input type="date" className="w-full p-2 border rounded" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="primary" onClick={save}>{editing ? 'تحديث' : 'إضافة'}</Button>
          <Button variant="ghost" onClick={() => startEdit()}>إفراغ النموذج</Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="mb-3">قائمة المراجعات</h4>
        {loading ? <div>جارٍ التحميل...</div> : (
          <div className="space-y-3">
            {reviews.length === 0 && <div className="text-sm text-gray-500">لا توجد مراجعات</div>}
            {reviews.map(r => (
              <div key={r.id} className="bg-gray-50 p-4 rounded flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={r.avatar || 'https://i.pravatar.cc/150?img=1'} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">{r.author || 'مستخدم'}</div>
                    <div className="text-sm text-gray-600">{r.content}</div>
                    <div className="text-xs text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm text-gray-500">تقييم: {r.rating}</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(r)}>تعديل</Button>
                    <Button variant="destructive" size="sm" onClick={() => del(r.id)}>حذف</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
