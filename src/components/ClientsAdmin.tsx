import React, { useEffect, useState } from 'react';
import { apiFetch, apiFetchAuth } from '../lib/api';

export default function ClientsAdmin() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [token] = useState(localStorage.getItem('api_token') || '');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('clients');
      setClients(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل تريد حذف هذا العميل؟')) return;
    try {
      await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')}/clients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      await load();
    } catch (e) {
      alert('فشل الحذف');
    }
  };

  const handleSave = async (client: any) => {
    try {
      if (client.id) {
        await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')}/clients/${client.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(client),
        });
      } else {
        await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')}/clients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(client),
        });
      }
      setEditing(null);
      await load();
    } catch (e) {
      alert('فشل الحفظ');
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">العملاء</h3>
        <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => setEditing({})}>عميل جديد</button>
      </div>

      {editing && (
        <div className="p-4 bg-white rounded shadow">
          <h4 className="mb-2">{editing.id ? 'تعديل عميل' : 'عميل جديد'}</h4>
          <input className="w-full p-2 border mb-2" placeholder="الاسم" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <input className="w-full p-2 border mb-2" placeholder="الهاتف" value={editing.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
          <input className="w-full p-2 border mb-2" placeholder="البريد" value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
          <input className="w-full p-2 border mb-2" placeholder="المصدر" value={editing.source || ''} onChange={(e) => setEditing({ ...editing, source: e.target.value })} />
          <input className="w-full p-2 border mb-2" placeholder="الحالة" value={editing.status || ''} onChange={(e) => setEditing({ ...editing, status: e.target.value })} />
          <textarea className="w-full p-2 border mb-2" placeholder="ملاحظات" value={editing.notes || ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => handleSave(editing)}>حفظ</button>
            <button className="px-3 py-2 bg-gray-200 rounded" onClick={() => setEditing(null)}>إلغاء</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">الاسم</th>
              <th className="p-3">الهاتف</th>
              <th className="p-3">المصدر</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.source}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => setEditing(c)}>تعديل</button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(c.id)}>حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
