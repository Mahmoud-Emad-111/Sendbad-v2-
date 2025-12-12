import React, { useEffect, useState } from 'react';
import { apiFetchAuth } from '../lib/api';

export default function ConsultationsAdmin() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem('api_token') || '');
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetchAuth('consultations', token);
      // api wraps success/data
      setData(res.data || res);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل تريد حذف هذه الاستشارة؟')) return;
    try {
      await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')}/consultations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      await load();
    } catch (e) { alert('فشل الحذف'); }
  };

  if (loading) return <div>جاري التحميل...</div>;

  const items = data.data ?? data; // handle pagination

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">الاستشارات</h3>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">الاسم</th>
              <th className="p-3">الهاتف</th>
              <th className="p-3">المساحة</th>
              <th className="p-3">النمط</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.full_name}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.area}</td>
                <td className="p-3">{c.style}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">{new Date(c.created_at).toLocaleString()}</td>
                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <button
                      className="px-3 py-1 bg-white border border-gray-200 text-[var(--color-primary)] rounded hover:shadow"
                      onClick={() => setSelected(c)}
                    >
                      عرض
                    </button>

                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded hover:brightness-90"
                      onClick={() => handleDelete(c.id)}
                    >
                      حذف
                    </button>

                    {/* Additional icon delete button as requested */}
                    <button
                      aria-label="حذف"
                      title="حذف"
                      onClick={() => handleDelete(c.id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded border border-gray-200 bg-white text-red-600 hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-.894.553L4.382 4H2a1 1 0 100 2h1v9a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2.382l-.724-1.447A1 1 0 0014 2H6zm3 6a1 1 0 10-2 0v6a1 1 0 102 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 mx-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">تفاصيل الاستشارة #{selected.id}</h3>
                <p className="text-sm text-gray-500">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-gray-100 rounded" onClick={() => setSelected(null)}>إغلاق</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2 text-sm text-gray-600">الاسم</div>
                <div className="font-medium">{selected.full_name || '—'}</div>

                <div className="mt-3 text-sm text-gray-600">الهاتف</div>
                <div className="font-medium">{selected.phone || '—'}</div>

                <div className="mt-3 text-sm text-gray-600">العنوان</div>
                <div className="font-medium">{selected.address || '—'}</div>

                <div className="mt-3 text-sm text-gray-600">المساحة</div>
                <div className="font-medium">{selected.area || '—'}</div>

                <div className="mt-3 text-sm text-gray-600">النمط</div>
                <div className="font-medium">{selected.style || '—'}</div>
              </div>

              <div>
                <div className="mb-2 text-sm text-gray-600">ملاحظات</div>
                <div className="font-medium whitespace-pre-wrap">{selected.notes || '—'}</div>

                {selected.images && selected.images.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">الصور</div>
                    <div className="grid grid-cols-2 gap-2">
                      {selected.images.map((img: string, i: number) => (
                        <img key={i} src={img} alt={`img-${i}`} className="w-full h-28 object-cover rounded" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => { handleDelete(selected.id); setSelected(null); }}>حذف</button>
              <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => setSelected(null)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
