import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import UploadButton from './UploadButton';

export default function GalleryAdmin() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('api_token') || '';

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('media');
      setMedia(data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')}/media`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      await load();
    } catch (e) {
      alert('فشل الرفع');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('حذف هذه الصورة؟')) return;
    try {
      await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')}/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      await load();
    } catch (e) {
      alert('فشل الحذف');
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded shadow flex items-center justify-between">
        <h3 className="mb-0">المعرض</h3>
        <UploadButton onFile={uploadFile} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((m) => (
          <div key={m.id} className="bg-white rounded overflow-hidden shadow">
            <img src={m.url || `/storage/${m.path}`} alt={m.filename} className="w-full h-40 object-cover" />
            <div className="p-2 flex justify-between items-center">
              <div className="text-sm">{m.filename}</div>
              <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(m.id)}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
